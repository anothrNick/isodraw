// Package auth signs people in through any OIDC provider (Cognito, Dex,
// Okta, …) with the authorization code flow and PKCE, then keeps them signed
// in with a session cookie. Tokens from the provider never reach the browser.
package auth

import (
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"

	"github.com/anothrNick/isodraw/api/internal/config"
	"github.com/anothrNick/isodraw/api/internal/store"
)

const (
	SessionCookie = "isodraw_session"
	loginCookie   = "isodraw_login"
	loginTTL      = 10 * time.Minute
)

type Auth struct {
	cfg   config.Config
	store *store.Store

	// The provider is looked up on first use, so the server can start before it is reachable.
	mu       sync.Mutex
	verifier *oidc.IDTokenVerifier
	oauth    *oauth2.Config
}

func New(cfg config.Config, s *store.Store) *Auth { return &Auth{cfg: cfg, store: s} }

func (a *Auth) provider(ctx context.Context) (*oauth2.Config, *oidc.IDTokenVerifier, error) {
	a.mu.Lock()
	defer a.mu.Unlock()
	if a.oauth != nil {
		return a.oauth, a.verifier, nil
	}
	p, err := oidc.NewProvider(ctx, a.cfg.OIDCIssuer)
	if err != nil {
		return nil, nil, err
	}
	a.verifier = p.Verifier(&oidc.Config{ClientID: a.cfg.OIDCClientID})
	a.oauth = &oauth2.Config{
		ClientID:     a.cfg.OIDCClientID,
		ClientSecret: a.cfg.OIDCClientSecret,
		Endpoint:     p.Endpoint(),
		RedirectURL:  a.cfg.PublicURL + "/auth/callback",
		Scopes:       a.cfg.OIDCScopes,
	}
	return a.oauth, a.verifier, nil
}

// loginState travels in a signed, short-lived cookie between /auth/login and /auth/callback.
type loginState struct {
	State    string `json:"s"`
	Nonce    string `json:"n"`
	Verifier string `json:"v"`
	Return   string `json:"r"`
}

// Login sends the browser to the provider. `?return=/path` is where to land afterwards.
func (a *Auth) Login(w http.ResponseWriter, r *http.Request) {
	oauth, _, err := a.provider(r.Context())
	if err != nil {
		slog.Error("oidc provider unavailable", "issuer", a.cfg.OIDCIssuer, "err", err)
		http.Error(w, "The sign-in service is unavailable. Try again shortly.", http.StatusBadGateway)
		return
	}
	st := loginState{State: randomString(), Nonce: randomString(), Verifier: oauth2.GenerateVerifier(), Return: safeReturn(r.URL.Query().Get("return"))}
	http.SetCookie(w, &http.Cookie{
		Name: loginCookie, Value: a.sign(st), Path: "/auth", MaxAge: int(loginTTL.Seconds()),
		HttpOnly: true, Secure: a.cfg.Secure(), SameSite: http.SameSiteLaxMode,
	})
	http.Redirect(w, r, oauth.AuthCodeURL(st.State, oidc.Nonce(st.Nonce), oauth2.S256ChallengeOption(st.Verifier)), http.StatusFound)
}

// Callback finishes sign-in: it checks the provider's answer, records the user and starts a session.
func (a *Auth) Callback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	c, err := r.Cookie(loginCookie)
	if err != nil {
		http.Error(w, "Sign-in expired. Start again.", http.StatusBadRequest)
		return
	}
	st, ok := a.verify(c.Value)
	if !ok || r.URL.Query().Get("state") != st.State {
		http.Error(w, "Sign-in could not be verified. Start again.", http.StatusBadRequest)
		return
	}
	if e := r.URL.Query().Get("error"); e != "" {
		http.Error(w, "Sign-in was cancelled or refused: "+e, http.StatusUnauthorized)
		return
	}
	oauth, verifier, err := a.provider(ctx)
	if err != nil {
		http.Error(w, "The sign-in service is unavailable.", http.StatusBadGateway)
		return
	}
	tok, err := oauth.Exchange(ctx, r.URL.Query().Get("code"), oauth2.VerifierOption(st.Verifier))
	if err != nil {
		slog.Warn("oidc code exchange failed", "err", err)
		http.Error(w, "Sign-in failed.", http.StatusUnauthorized)
		return
	}
	raw, _ := tok.Extra("id_token").(string)
	idt, err := verifier.Verify(ctx, raw)
	if err != nil || idt.Nonce != st.Nonce {
		slog.Warn("id token rejected", "err", err)
		http.Error(w, "Sign-in failed.", http.StatusUnauthorized)
		return
	}
	var claims struct {
		Email    string `json:"email"`
		Name     string `json:"name"`
		Username string `json:"preferred_username"`
	}
	_ = idt.Claims(&claims)
	name := claims.Name
	if name == "" {
		name = claims.Username
	}
	u, err := a.store.UpsertUser(ctx, idt.Issuer, idt.Subject, claims.Email, name)
	if err == nil {
		err = a.store.EnsurePersonalOrg(ctx, u)
	}
	var token string
	if err == nil {
		token, err = a.store.CreateSession(ctx, u.ID, a.cfg.SessionTTL)
	}
	if err != nil {
		slog.Error("start session", "err", err)
		http.Error(w, "Sign-in failed.", http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{Name: loginCookie, Path: "/auth", MaxAge: -1})
	a.setSession(w, token)
	http.Redirect(w, r, st.Return, http.StatusFound)
}

// Logout ends the session. It is a POST, so another site cannot sign people out with a link.
func (a *Auth) Logout(w http.ResponseWriter, r *http.Request) {
	if c, err := r.Cookie(SessionCookie); err == nil {
		if err := a.store.DeleteSession(r.Context(), c.Value); err != nil {
			slog.Error("delete session", "err", err)
		}
	}
	http.SetCookie(w, &http.Cookie{Name: SessionCookie, Path: "/", MaxAge: -1, HttpOnly: true, Secure: a.cfg.Secure(), SameSite: http.SameSiteLaxMode})
	w.WriteHeader(http.StatusNoContent)
}

func (a *Auth) setSession(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name: SessionCookie, Value: token, Path: "/", MaxAge: int(a.cfg.SessionTTL.Seconds()),
		HttpOnly: true, Secure: a.cfg.Secure(), SameSite: http.SameSiteLaxMode,
	})
}

// ---------- the signed-in user ----------

type ctxKey struct{}
type tokenKey struct{}

// User is the signed-in user, set by RequireUser.
func User(ctx context.Context) store.User {
	u, _ := ctx.Value(ctxKey{}).(store.User)
	return u
}

// WithUser puts a user in a context, for handlers called without RequireUser (tests).
func WithUser(ctx context.Context, u store.User) context.Context { return context.WithValue(ctx, ctxKey{}, u) }

// Token is the API token the request was made with, or nil for a browser session.
func Token(ctx context.Context) *store.Token {
	t, _ := ctx.Value(tokenKey{}).(*store.Token)
	return t
}

// BearerToken is the token in an Authorization header, if any.
func BearerToken(r *http.Request) (string, bool) {
	v, ok := strings.CutPrefix(r.Header.Get("Authorization"), "Bearer ")
	return strings.TrimSpace(v), ok && strings.TrimSpace(v) != ""
}

// RequireUser answers 401 unless the request carries a valid session cookie
// or API token. Read-only tokens may only read.
func (a *Auth) RequireUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if secret, ok := BearerToken(r); ok {
			u, t, err := a.store.TokenUser(r.Context(), secret)
			if errors.Is(err, store.ErrNotFound) {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				_, _ = w.Write([]byte(`{"error":{"code":"invalid_token","message":"This token is unknown, revoked or expired. Run isodraw login again."}}`))
				return
			}
			if err != nil {
				slog.Error("load token", "err", err)
				http.Error(w, `{"error":{"code":"internal","message":"Something went wrong."}}`, http.StatusInternalServerError)
				return
			}
			readOnly := r.Method == http.MethodGet || r.Method == http.MethodHead
			// A read-only token may still revoke itself (logout).
			if t.Scope != store.ScopeWrite && !readOnly && !(r.Method == http.MethodDelete && r.URL.Path == "/api/tokens/current") {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusForbidden)
				_, _ = w.Write([]byte(`{"error":{"code":"read_only_token","message":"This token is read-only. Run isodraw login and choose read and write access to make changes."}}`))
				return
			}
			ctx := context.WithValue(WithUser(r.Context(), u), tokenKey{}, &t)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}
		c, err := r.Cookie(SessionCookie)
		if err != nil {
			unauthorized(w)
			return
		}
		u, err := a.store.SessionUser(r.Context(), c.Value)
		if errors.Is(err, store.ErrNotFound) {
			unauthorized(w)
			return
		}
		if err != nil {
			slog.Error("load session", "err", err)
			http.Error(w, `{"error":{"code":"internal","message":"Something went wrong."}}`, http.StatusInternalServerError)
			return
		}
		next.ServeHTTP(w, r.WithContext(WithUser(r.Context(), u)))
	})
}

func unauthorized(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	_, _ = w.Write([]byte(`{"error":{"code":"unauthenticated","message":"Sign in to continue."}}`))
}

// ---------- helpers ----------

func (a *Auth) sign(st loginState) string {
	body, _ := json.Marshal(st)
	payload := base64.RawURLEncoding.EncodeToString(body)
	return payload + "." + a.mac(payload)
}

func (a *Auth) verify(v string) (loginState, bool) {
	var st loginState
	payload, sig, ok := strings.Cut(v, ".")
	if !ok || !hmac.Equal([]byte(sig), []byte(a.mac(payload))) {
		return st, false
	}
	body, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil || json.Unmarshal(body, &st) != nil {
		return st, false
	}
	return st, true
}

func (a *Auth) mac(payload string) string {
	m := hmac.New(sha256.New, []byte(a.cfg.SessionSecret))
	m.Write([]byte(payload))
	return base64.RawURLEncoding.EncodeToString(m.Sum(nil))
}

// safeReturn only allows paths on this site, so the login can't be used to redirect elsewhere.
func safeReturn(p string) string {
	if !strings.HasPrefix(p, "/") || strings.HasPrefix(p, "//") || strings.HasPrefix(p, "/\\") {
		return "/"
	}
	return p
}

func randomString() string {
	b := make([]byte, 24)
	_, _ = rand.Read(b)
	return base64.RawURLEncoding.EncodeToString(b)
}

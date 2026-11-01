package httpapi

// OAuth 2.1 for AI apps connecting to IsoDraw's MCP server (/mcp, served by
// the web app's Pages Function). Apps register themselves (dynamic client
// registration), send the person here to approve, and swap the code for an
// access token with PKCE. The access token is an ordinary API token, scoped
// to the workspace the person picked, so it shows on the Tokens page and
// revoking it disconnects the app.
//
//	GET  /.well-known/oauth-protected-resource[/mcp]   what protects /mcp
//	GET  /.well-known/oauth-authorization-server       the endpoints below
//	POST /oauth/register                               an app registers
//	GET  /oauth/authorize                              → the app's /connect consent page
//	POST /oauth/token                                  code + verifier → token
//	GET  /api/oauth/request                            (app) who's asking, for the consent page
//	POST /api/oauth/approve | /api/oauth/deny          (app) the person's answer

import (
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/store"
)

const (
	oauthCodeTTL    = 10 * time.Minute
	maxClientName   = 100
	maxRedirectURIs = 10
	maxRedirectURI  = 2000
	registerPerHour = 20
	tokenPerTenMins = 60
)

var (
	pkceVerifier  = regexp.MustCompile(`^[A-Za-z0-9._~-]{43,128}$`)
	pkceChallenge = regexp.MustCompile(`^[A-Za-z0-9_-]{43}$`)
	customScheme  = regexp.MustCompile(`^[a-z][a-z0-9+.-]*$`)
)

func (s *Server) oauthRoutes(mux, api *http.ServeMux) {
	register := auth.NewLimiter(registerPerHour, time.Hour)
	token := auth.NewLimiter(tokenPerTenMins, 10*time.Minute)

	mux.Handle("GET /.well-known/oauth-protected-resource", cors(http.HandlerFunc(s.protectedResource)))
	mux.Handle("GET /.well-known/oauth-protected-resource/mcp", cors(http.HandlerFunc(s.protectedResource)))
	mux.Handle("GET /.well-known/oauth-authorization-server", cors(http.HandlerFunc(s.authorizationServer)))
	mux.Handle("POST /oauth/register", cors(limited(register, http.HandlerFunc(s.registerClient))))
	mux.HandleFunc("GET /oauth/authorize", s.authorize)
	mux.Handle("POST /oauth/token", cors(limited(token, http.HandlerFunc(s.exchangeToken))))
	for _, p := range []string{"/.well-known/oauth-protected-resource", "/.well-known/oauth-protected-resource/mcp", "/.well-known/oauth-authorization-server", "/oauth/register", "/oauth/token"} {
		mux.Handle("OPTIONS "+p, cors(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusNoContent) })))
	}

	api.HandleFunc("GET /api/oauth/request", s.oauthRequest)
	api.HandleFunc("POST /api/oauth/approve", s.oauthApprove)
	api.HandleFunc("POST /api/oauth/deny", s.oauthDeny)
}

// cors lets browser-based MCP clients (like the MCP Inspector) read these public endpoints.
func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("Access-Control-Allow-Origin", "*")
		h.Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		h.Set("Access-Control-Allow-Headers", "Content-Type, Authorization, MCP-Protocol-Version")
		h.Set("Access-Control-Max-Age", "86400")
		next.ServeHTTP(w, r)
	})
}

func limited(l *auth.Limiter, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !l.Allow(auth.ClientIP(r)) {
			oauthError(w, http.StatusTooManyRequests, "slow_down", "Too many requests. Try again later.")
			return
		}
		next.ServeHTTP(w, r)
	})
}

// oauthError answers in OAuth's error format (RFC 6749 §5.2), not the API's.
func oauthError(w http.ResponseWriter, status int, code, description string) {
	w.Header().Set("Cache-Control", "no-store")
	writeJSON(w, status, map[string]string{"error": code, "error_description": description})
}

// ---------- discovery ----------

func (s *Server) protectedResource(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"resource":                 s.cfg.PublicURL + "/mcp",
		"authorization_servers":    []string{s.cfg.PublicURL},
		"scopes_supported":         []string{"read", "write"},
		"bearer_methods_supported": []string{"header"},
		"resource_name":            "IsoDraw",
		"resource_documentation":   s.cfg.PublicURL,
	})
}

func (s *Server) authorizationServer(w http.ResponseWriter, _ *http.Request) {
	u := s.cfg.PublicURL
	writeJSON(w, http.StatusOK, map[string]any{
		"issuer":                                u,
		"authorization_endpoint":                u + "/oauth/authorize",
		"token_endpoint":                        u + "/oauth/token",
		"registration_endpoint":                 u + "/oauth/register",
		"response_types_supported":              []string{"code"},
		"grant_types_supported":                 []string{"authorization_code"},
		"code_challenge_methods_supported":      []string{"S256"},
		"token_endpoint_auth_methods_supported": []string{"none"},
		"scopes_supported":                      []string{"read", "write"},
	})
}

// ---------- registration ----------

// validRedirect accepts https, http on this machine, and apps' own schemes (cursor://…).
func validRedirect(raw string) bool {
	if raw == "" || len(raw) > maxRedirectURI {
		return false
	}
	u, err := url.Parse(raw)
	if err != nil || u.Fragment != "" || u.Scheme == "" {
		return false
	}
	switch u.Scheme {
	case "https":
		return u.Host != ""
	case "http":
		h := u.Hostname()
		return h == "localhost" || h == "127.0.0.1" || h == "::1"
	case "javascript", "data", "file", "vbscript", "about", "blob":
		return false
	}
	return customScheme.MatchString(u.Scheme)
}

func (s *Server) registerClient(w http.ResponseWriter, r *http.Request) {
	var body struct {
		ClientName              string   `json:"client_name"`
		RedirectURIs            []string `json:"redirect_uris"`
		TokenEndpointAuthMethod string   `json:"token_endpoint_auth_method"`
		GrantTypes              []string `json:"grant_types"`
		ResponseTypes           []string `json:"response_types"`
	}
	if !decodeOAuth(w, r, 16<<10, &body) {
		return
	}
	name := strings.TrimSpace(body.ClientName)
	if name == "" {
		name = "An AI app"
	}
	if len([]rune(name)) > maxClientName {
		oauthError(w, http.StatusBadRequest, "invalid_client_metadata", "client_name is too long.")
		return
	}
	if len(body.RedirectURIs) == 0 || len(body.RedirectURIs) > maxRedirectURIs {
		oauthError(w, http.StatusBadRequest, "invalid_redirect_uri", "Give between 1 and 10 redirect_uris.")
		return
	}
	for _, u := range body.RedirectURIs {
		if !validRedirect(u) {
			oauthError(w, http.StatusBadRequest, "invalid_redirect_uri", "Redirect URIs must be https, http on localhost, or an app's own scheme, without a fragment.")
			return
		}
	}
	if m := body.TokenEndpointAuthMethod; m != "" && m != "none" {
		oauthError(w, http.StatusBadRequest, "invalid_client_metadata", "Only public clients are supported: token_endpoint_auth_method must be none (PKCE protects the exchange).")
		return
	}
	c, err := s.store.CreateOAuthClient(r.Context(), name, body.RedirectURIs)
	if err != nil {
		internalError(w, err)
		return
	}
	w.Header().Set("Cache-Control", "no-store")
	writeJSON(w, http.StatusCreated, map[string]any{
		"client_id":                  c.ID,
		"client_name":                c.Name,
		"redirect_uris":              c.RedirectURIs,
		"client_id_issued_at":        c.CreatedAt.Unix(),
		"token_endpoint_auth_method": "none",
		"grant_types":                []string{"authorization_code"},
		"response_types":             []string{"code"},
	})
}

// ---------- authorization ----------

// clientFor checks a client and that redirectURI is one it registered.
func (s *Server) clientFor(r *http.Request, clientID, redirectURI string) (store.OAuthClient, error) {
	c, err := s.store.OAuthClient(r.Context(), clientID)
	if err != nil {
		return c, err
	}
	for _, u := range c.RedirectURIs {
		if u == redirectURI {
			return c, nil
		}
	}
	return c, store.ErrNotFound
}

// redirectWith adds query parameters to an app's redirect URI.
func redirectWith(redirectURI string, params map[string]string) string {
	u, _ := url.Parse(redirectURI)
	q := u.Query()
	for k, v := range params {
		if v != "" {
			q.Set(k, v)
		}
	}
	u.RawQuery = q.Encode()
	return u.String()
}

// authorize checks the request and sends the person to the consent page. Problems with the
// client or redirect URI are shown here; anything else goes back to the app as an OAuth error.
func (s *Server) authorize(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	clientID, redirectURI, state := q.Get("client_id"), q.Get("redirect_uri"), q.Get("state")
	if _, err := s.clientFor(r, clientID, redirectURI); err != nil {
		if errors.Is(err, store.ErrNotFound) {
			http.Error(w, "This app isn't registered with IsoDraw, or its redirect address doesn't match. Try connecting it again.", http.StatusBadRequest)
			return
		}
		internalError(w, err)
		return
	}
	fail := func(code, description string) {
		http.Redirect(w, r, redirectWith(redirectURI, map[string]string{"error": code, "error_description": description, "state": state}), http.StatusFound)
	}
	switch {
	case q.Get("response_type") != "code":
		fail("unsupported_response_type", "Only response_type=code is supported.")
		return
	case q.Get("code_challenge_method") != "S256" || !pkceChallenge.MatchString(q.Get("code_challenge")):
		fail("invalid_request", "PKCE with S256 is required.")
		return
	}
	if res := q.Get("resource"); res != "" && strings.TrimRight(res, "/") != s.cfg.PublicURL+"/mcp" {
		fail("invalid_target", "This server only grants access to "+s.cfg.PublicURL+"/mcp.")
		return
	}
	consent := url.Values{}
	for _, k := range []string{"client_id", "redirect_uri", "code_challenge", "state", "scope"} {
		if v := q.Get(k); v != "" {
			consent.Set(k, v)
		}
	}
	http.Redirect(w, r, s.cfg.PublicURL+"/connect?"+consent.Encode(), http.StatusFound)
}

// oauthRequest tells the consent page which app is asking.
func (s *Server) oauthRequest(w http.ResponseWriter, r *http.Request) {
	if !browserOnly(w, r) {
		return
	}
	redirectURI := r.URL.Query().Get("redirect_uri")
	c, err := s.clientFor(r, r.URL.Query().Get("client_id"), redirectURI)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "This app isn't registered with IsoDraw, or its redirect address doesn't match. Try connecting it again from the app.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	u, _ := url.Parse(redirectURI)
	writeJSON(w, http.StatusOK, map[string]any{"clientName": c.Name, "redirectHost": u.Host, "redirectScheme": u.Scheme})
}

func (s *Server) oauthApprove(w http.ResponseWriter, r *http.Request) {
	if !browserOnly(w, r) {
		return
	}
	var body struct {
		ClientID      string      `json:"clientId"`
		RedirectURI   string      `json:"redirectUri"`
		CodeChallenge string      `json:"codeChallenge"`
		State         string      `json:"state"`
		OrgID         string      `json:"orgId"`
		Scope         store.Scope `json:"scope"`
		ExpiresInDays int         `json:"expiresInDays"`
	}
	if !decode(w, r, 8192, &body) {
		return
	}
	if _, err := s.clientFor(r, body.ClientID, body.RedirectURI); err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeError(w, http.StatusNotFound, "not_found", "This app isn't registered with IsoDraw, or its redirect address doesn't match.")
			return
		}
		internalError(w, err)
		return
	}
	if !pkceChallenge.MatchString(body.CodeChallenge) {
		writeError(w, http.StatusBadRequest, "invalid_request", "The app's sign-in request is incomplete. Try connecting again.")
		return
	}
	if !body.Scope.Valid() {
		writeError(w, http.StatusBadRequest, "invalid_scope", "The access must be read or write.")
		return
	}
	if body.ExpiresInDays < 0 || body.ExpiresInDays > 365 {
		writeError(w, http.StatusBadRequest, "invalid_expiry", "Access can last up to 365 days, or not expire (0).")
		return
	}
	role, ok := s.orgRole(w, r, body.OrgID)
	if !ok {
		return
	}
	if body.Scope == store.ScopeWrite && !role.CanEdit() {
		writeError(w, http.StatusForbidden, "forbidden", "Viewers can only give read access.")
		return
	}
	_ = s.store.DeleteExpiredOAuthCodes(r.Context())
	code, err := s.store.CreateOAuthCode(r.Context(), store.OAuthGrant{
		ClientID: body.ClientID, UserID: auth.User(r.Context()).ID, OrgID: body.OrgID, Scope: body.Scope,
		ExpiresInDays: body.ExpiresInDays, RedirectURI: body.RedirectURI, CodeChallenge: body.CodeChallenge,
	}, oauthCodeTTL)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"redirect": redirectWith(body.RedirectURI, map[string]string{"code": code, "state": body.State})})
}

func (s *Server) oauthDeny(w http.ResponseWriter, r *http.Request) {
	if !browserOnly(w, r) {
		return
	}
	var body struct {
		ClientID    string `json:"clientId"`
		RedirectURI string `json:"redirectUri"`
		State       string `json:"state"`
	}
	if !decode(w, r, 8192, &body) {
		return
	}
	if _, err := s.clientFor(r, body.ClientID, body.RedirectURI); err != nil {
		writeError(w, http.StatusNotFound, "not_found", "This app isn't registered with IsoDraw.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"redirect": redirectWith(body.RedirectURI, map[string]string{
		"error": "access_denied", "error_description": "The person declined.", "state": body.State,
	})})
}

// ---------- token ----------

func pkceMatches(verifier, challenge string) bool {
	if !pkceVerifier.MatchString(verifier) {
		return false
	}
	sum := sha256.Sum256([]byte(verifier))
	return subtle.ConstantTimeCompare([]byte(base64.RawURLEncoding.EncodeToString(sum[:])), []byte(challenge)) == 1
}

func (s *Server) exchangeToken(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
	if err := r.ParseForm(); err != nil {
		oauthError(w, http.StatusBadRequest, "invalid_request", "Send the request as application/x-www-form-urlencoded.")
		return
	}
	f := r.PostForm
	if f.Get("grant_type") != "authorization_code" {
		oauthError(w, http.StatusBadRequest, "unsupported_grant_type", "Only authorization_code is supported.")
		return
	}
	g, err := s.store.TakeOAuthCode(r.Context(), f.Get("code"))
	if errors.Is(err, store.ErrNotFound) {
		oauthError(w, http.StatusBadRequest, "invalid_grant", "The code is unknown, used or expired. Connect again.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	if f.Get("client_id") != g.ClientID || f.Get("redirect_uri") != g.RedirectURI {
		oauthError(w, http.StatusBadRequest, "invalid_grant", "The code was issued to another client or redirect URI.")
		return
	}
	if !pkceMatches(f.Get("code_verifier"), g.CodeChallenge) {
		oauthError(w, http.StatusBadRequest, "invalid_grant", "The code verifier doesn't match.")
		return
	}
	c, err := s.store.OAuthClient(r.Context(), g.ClientID)
	if err != nil {
		internalError(w, err)
		return
	}
	var expires *time.Time
	if g.ExpiresInDays > 0 {
		t := time.Now().Add(time.Duration(g.ExpiresInDays) * 24 * time.Hour)
		expires = &t
	}
	name := c.Name + " (connected " + time.Now().Format("Jan 2") + ")"
	_, secret, err := s.store.CreateToken(r.Context(), g.UserID, g.OrgID, name, g.Scope, expires)
	if err != nil {
		internalError(w, err)
		return
	}
	resp := map[string]any{"access_token": secret, "token_type": "Bearer", "scope": string(g.Scope)}
	if expires != nil {
		resp["expires_in"] = int(time.Until(*expires).Seconds())
	}
	w.Header().Set("Cache-Control", "no-store")
	writeJSON(w, http.StatusOK, resp)
}

// decodeOAuth reads a JSON body, answering failures in OAuth's error format.
func decodeOAuth(w http.ResponseWriter, r *http.Request, limit int64, v any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, limit)
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		oauthError(w, http.StatusBadRequest, "invalid_client_metadata", "Send the registration as JSON.")
		return false
	}
	return true
}

package auth

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"net/mail"
	"strings"
)

// The JSON endpoints behind IsoDraw's own sign-up, sign-in and reset pages
// (AUTH_MODE cognito or local). They live under /auth, outside the signed-in
// /api, and only take same-origin requests (the server wraps them).

// Config tells the app which sign-in to show: its own pages ("password"),
// or a redirect to the identity provider's ("redirect").
func (a *Auth) Config(w http.ResponseWriter, _ *http.Request) {
	mode := "redirect"
	if a.password != nil {
		mode = "password"
	}
	writeJSON(w, http.StatusOK, map[string]string{"mode": mode})
}

// OnCode sends AUTH_MODE=local's verification and reset codes somewhere
// other than the log: email for a self-hoster, or a test.
func (a *Auth) OnCode(deliver func(email, purpose, code string)) {
	if l, ok := a.password.(*local); ok {
		l.Deliver = deliver
	}
}

// HasPasswordPages reports whether the app runs its own sign-in pages.
func (a *Auth) HasPasswordPages() bool { return a.password != nil }

type pageError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func fail(w http.ResponseWriter, status int, code, msg string) {
	writeJSON(w, status, map[string]pageError{"error": {Code: code, Message: msg}})
}

// failWith answers with the right status and message for a provider error.
func failWith(w http.ResponseWriter, err error) {
	var input *InputError
	switch {
	case errors.As(err, &input):
		fail(w, http.StatusBadRequest, "invalid_input", input.Msg)
	case errors.Is(err, ErrAccountExists):
		fail(w, http.StatusConflict, "account_exists", "There's already an account with this email. Sign in, or reset the password.")
	case errors.Is(err, ErrNotConfirmed):
		fail(w, http.StatusForbidden, "unverified", "Verify your email address first. We've sent a new code.")
	case errors.Is(err, ErrBadCredentials):
		fail(w, http.StatusUnauthorized, "bad_credentials", "Incorrect email or password.")
	case errors.Is(err, ErrBadCode):
		fail(w, http.StatusBadRequest, "bad_code", "That code isn't right. Check the email and try again.")
	case errors.Is(err, ErrCodeExpired):
		fail(w, http.StatusBadRequest, "code_expired", "That code has expired. Ask for a new one.")
	case errors.Is(err, ErrTooMany):
		fail(w, http.StatusTooManyRequests, "too_many", "Too many attempts. Wait a few minutes and try again.")
	default:
		slog.Error("sign-in page request failed", "err", err)
		fail(w, http.StatusInternalServerError, "internal", "Something went wrong. Try again in a moment.")
	}
}

// form reads a small JSON body.
func form(w http.ResponseWriter, r *http.Request, v any) bool {
	if !strings.HasPrefix(r.Header.Get("Content-Type"), "application/json") {
		fail(w, http.StatusUnsupportedMediaType, "unsupported_media_type", "Send JSON.")
		return false
	}
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 8192)).Decode(v); err != nil {
		fail(w, http.StatusBadRequest, "invalid_json", "The request body is not valid JSON.")
		return false
	}
	return true
}

func cleanEmail(w http.ResponseWriter, e string) (string, bool) {
	addr, err := mail.ParseAddress(strings.TrimSpace(e))
	if err != nil || addr.Name != "" {
		fail(w, http.StatusBadRequest, "invalid_email", "Enter an email address, like name@example.com.")
		return "", false
	}
	return strings.ToLower(addr.Address), true
}

// limited answers 429 when this IP or email has tried too often.
func (a *Auth) limited(w http.ResponseWriter, r *http.Request, action, email string) bool {
	if a.limits.allow(action+"|ip|"+clientIP(r)) && (email == "" || a.limits.allow(action+"|email|"+email)) {
		return false
	}
	failWith(w, ErrTooMany)
	return true
}

func (a *Auth) SignUp(w http.ResponseWriter, r *http.Request) {
	var b struct{ Email, Password, Name string }
	if !form(w, r, &b) {
		return
	}
	email, ok := cleanEmail(w, b.Email)
	if !ok || a.limited(w, r, "signup", email) {
		return
	}
	name := strings.TrimSpace(b.Name)
	if len([]rune(name)) > 100 {
		fail(w, http.StatusBadRequest, "invalid_input", "Keep your name under 100 characters.")
		return
	}
	sentTo, err := a.password.SignUp(r.Context(), email, b.Password, name)
	if err != nil {
		failWith(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"next": "verify", "sentTo": sentTo})
}

func (a *Auth) Verify(w http.ResponseWriter, r *http.Request) {
	var b struct{ Email, Code string }
	if !form(w, r, &b) {
		return
	}
	email, ok := cleanEmail(w, b.Email)
	if !ok || a.limited(w, r, "code", email) {
		return
	}
	if err := a.password.Confirm(r.Context(), email, strings.TrimSpace(b.Code)); err != nil {
		failWith(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (a *Auth) Resend(w http.ResponseWriter, r *http.Request) {
	var b struct{ Email string }
	if !form(w, r, &b) {
		return
	}
	email, ok := cleanEmail(w, b.Email)
	if !ok || a.limited(w, r, "resend", email) {
		return
	}
	sentTo, err := a.password.Resend(r.Context(), email)
	if err != nil {
		failWith(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"sentTo": sentTo})
}

// SignIn checks the password and starts a session, the same session the OIDC flow starts.
func (a *Auth) SignIn(w http.ResponseWriter, r *http.Request) {
	var b struct{ Email, Password string }
	if !form(w, r, &b) {
		return
	}
	email, ok := cleanEmail(w, b.Email)
	if !ok || a.limited(w, r, "signin", email) {
		return
	}
	id, err := a.password.SignIn(r.Context(), email, b.Password)
	if errors.Is(err, ErrNotConfirmed) {
		// Send a fresh code so the verify page has one to use.
		_, _ = a.password.Resend(r.Context(), email)
	}
	if err != nil {
		failWith(w, err)
		return
	}
	if !a.startSession(w, r, id) {
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (a *Auth) Forgot(w http.ResponseWriter, r *http.Request) {
	var b struct{ Email string }
	if !form(w, r, &b) {
		return
	}
	email, ok := cleanEmail(w, b.Email)
	if !ok || a.limited(w, r, "forgot", email) {
		return
	}
	if err := a.password.Forgot(r.Context(), email); err != nil {
		failWith(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (a *Auth) Reset(w http.ResponseWriter, r *http.Request) {
	var b struct{ Email, Code, Password string }
	if !form(w, r, &b) {
		return
	}
	email, ok := cleanEmail(w, b.Email)
	if !ok || a.limited(w, r, "code", email) {
		return
	}
	if err := a.password.Reset(r.Context(), email, strings.TrimSpace(b.Code), b.Password); err != nil {
		failWith(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

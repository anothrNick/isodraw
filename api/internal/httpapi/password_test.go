package httpapi

import (
	"net/http"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/blobs"
	"github.com/anothrNick/isodraw/api/internal/config"
	"github.com/anothrNick/isodraw/api/internal/store"
	"github.com/anothrNick/isodraw/api/internal/testdb"
)

// codes collects the local provider's codes, as an email inbox would.
type codes struct {
	mu   sync.Mutex
	last map[string]string
}

func (c *codes) get(email, purpose string) string {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.last[email+"|"+purpose]
}

func setupLocal(t *testing.T) (*fixture, *codes) {
	pool, _ := testdb.New(t)
	cfg := config.Config{
		AuthMode:      "local",
		PublicURL:     appOrigin,
		SessionSecret: "test-secret-0123456789",
		SessionTTL:    time.Hour,
	}
	s := store.New(pool)
	a, err := auth.New(cfg, s)
	if err != nil {
		t.Fatal(err)
	}
	inbox := &codes{last: map[string]string{}}
	a.OnCode(func(email, purpose, code string) {
		inbox.mu.Lock()
		inbox.last[email+"|"+purpose] = code
		inbox.mu.Unlock()
	})
	return &fixture{t: t, store: s, h: New(cfg, s, a, blobs.Dir(t.TempDir()))}, inbox
}

func sessionFrom(t *testing.T, res *http.Response) *http.Cookie {
	t.Helper()
	for _, c := range res.Cookies() {
		if c.Name == auth.SessionCookie && c.Value != "" {
			return c
		}
	}
	t.Fatal("no session cookie")
	return nil
}

func errCode(out map[string]any) string {
	e, _ := out["error"].(map[string]any)
	s, _ := e["code"].(string)
	return s
}

func TestPasswordPagesLocalFlow(t *testing.T) {
	f, inbox := setupLocal(t)
	post := func(path, body string) (*http.Response, map[string]any) {
		return f.do(req{method: "POST", path: path, body: body, header: map[string]string{"Origin": appOrigin}})
	}

	res, out := f.do(req{method: "GET", path: "/auth/config"})
	if out["mode"] != "password" {
		t.Fatalf("config: %v", out)
	}
	res, _ = f.do(req{method: "GET", path: "/auth/login?return=/dev"})
	if res.StatusCode != 302 || res.Header.Get("Location") != "/login?return=%2Fdev" {
		t.Fatalf("login redirects to the app's page: %d %s", res.StatusCode, res.Header.Get("Location"))
	}

	// Sign up: the password rule is checked, then a code goes out.
	res, out = post("/auth/signup", `{"email":"Ada@Example.com","password":"short1","name":"Ada"}`)
	expect(t, res, 400, out)
	res, out = post("/auth/signup", `{"email":"Ada@Example.com","password":"longenough","name":"Ada"}`)
	expect(t, res, 400, out) // no number
	res, out = post("/auth/signup", `{"email":"Ada@Example.com","password":"correct horse 1","name":"Ada"}`)
	expect(t, res, 200, out)
	if out["next"] != "verify" || inbox.get("ada@example.com", "verify") == "" {
		t.Fatalf("signup: %v", out)
	}

	// Can't sign in until verified; trying sends a fresh code.
	first := inbox.get("ada@example.com", "verify")
	res, out = post("/auth/signin", `{"email":"ada@example.com","password":"correct horse 1"}`)
	expect(t, res, 403, out)
	if errCode(out) != "unverified" {
		t.Fatal(out)
	}
	code := inbox.get("ada@example.com", "verify")
	if code == first {
		t.Log("same code by chance")
	}

	res, out = post("/auth/verify", `{"email":"ada@example.com","code":"000000x"}`)
	expect(t, res, 400, out)
	res, out = post("/auth/verify", `{"email":"ada@example.com","code":"`+code+`"}`)
	expect(t, res, 200, out)
	// A code works once.
	res, out = post("/auth/verify", `{"email":"ada@example.com","code":"`+code+`"}`)
	expect(t, res, 400, out)

	res, out = post("/auth/signin", `{"email":"ada@example.com","password":"wrong password 1"}`)
	expect(t, res, 401, out)
	res, out = post("/auth/signin", `{"email":"ADA@example.com","password":"correct horse 1"}`)
	expect(t, res, 200, out)
	cookie := sessionFrom(t, res)
	res, out = f.do(req{method: "GET", path: "/api/me", cookie: cookie})
	expect(t, res, 200, out)
	if u := out["user"].(map[string]any); u["email"] != "ada@example.com" || u["name"] != "Ada" || len(out["orgs"].([]any)) != 1 {
		t.Fatalf("me: %v", out)
	}

	// Signing up again with a verified address is refused.
	res, out = post("/auth/signup", `{"email":"ada@example.com","password":"another one 2"}`)
	expect(t, res, 409, out)

	// Forgot and reset.
	res, out = post("/auth/forgot", `{"email":"nobody@example.com"}`)
	expect(t, res, 200, out) // says nothing about whether an account exists
	res, out = post("/auth/forgot", `{"email":"ada@example.com"}`)
	expect(t, res, 200, out)
	reset := inbox.get("ada@example.com", "reset")
	res, out = post("/auth/reset", `{"email":"ada@example.com","code":"`+reset+`","password":"new password 3"}`)
	expect(t, res, 200, out)
	res, out = post("/auth/signin", `{"email":"ada@example.com","password":"correct horse 1"}`)
	expect(t, res, 401, out)
	res, out = post("/auth/signin", `{"email":"ada@example.com","password":"new password 3"}`)
	expect(t, res, 200, out)

	// The same person again: same user, not a second account.
	res, out = f.do(req{method: "GET", path: "/api/me", cookie: sessionFrom(t, res)})
	expect(t, res, 200, out)
	if len(out["orgs"].([]any)) != 1 {
		t.Fatal("signing in again must not create another workspace")
	}
}

func TestPasswordPagesGuardrails(t *testing.T) {
	f, _ := setupLocal(t)

	// Other sites can't post to the sign-in endpoints.
	res, out := f.do(req{method: "POST", path: "/auth/signin", body: `{"email":"a@example.com","password":"x"}`, header: map[string]string{"Origin": "https://evil.example"}})
	expect(t, res, 403, out)

	res, out = f.do(req{method: "POST", path: "/auth/signup", body: `{"email":"not an email","password":"correct horse 1"}`})
	expect(t, res, 400, out)
	if errCode(out) != "invalid_email" {
		t.Fatal(out)
	}

	// Guessing gets throttled.
	var last *http.Response
	for i := 0; i < 12; i++ {
		last, out = f.do(req{method: "POST", path: "/auth/signin", body: `{"email":"victim@example.com","password":"guess ` + strings.Repeat("x", i) + `1"}`})
	}
	expect(t, last, 429, out)
}

func TestRedirectModeHasNoPasswordEndpoints(t *testing.T) {
	f := setup(t) // AUTH_MODE oidc
	res, out := f.do(req{method: "GET", path: "/auth/config"})
	if res.StatusCode != 200 || out["mode"] != "redirect" {
		t.Fatalf("config: %v", out)
	}
	res, _ = f.do(req{method: "POST", path: "/auth/signin", body: `{}`})
	if res.StatusCode != 404 && res.StatusCode != 405 {
		t.Fatalf("no password sign-in in redirect mode: %d", res.StatusCode)
	}
}

package auth_test

import (
	"context"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"net/url"
	"os"
	"regexp"
	"strings"
	"testing"
	"time"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/blobs"
	"github.com/anothrNick/isodraw/api/internal/config"
	"github.com/anothrNick/isodraw/api/internal/httpapi"
	"github.com/anothrNick/isodraw/api/internal/store"
	"github.com/anothrNick/isodraw/api/internal/testdb"
)

// The registered redirect for the local Dex client (dev/dex.yaml).
const publicURL = "http://localhost:5190"

func dexIssuer(t *testing.T) string {
	issuer := os.Getenv("TEST_OIDC_ISSUER")
	if issuer == "" {
		issuer = "http://localhost:5556/dex"
	}
	res, err := http.Get(issuer + "/.well-known/openid-configuration")
	if err != nil || res.StatusCode != 200 {
		if os.Getenv("CI") != "" {
			t.Fatalf("Dex is not reachable at %s: %v", issuer, err)
		}
		t.Skipf("Dex is not running (docker compose up -d): %v", err)
	}
	res.Body.Close()
	return issuer
}

func server(t *testing.T, issuer string) (*httptest.Server, *store.Store) {
	pool, _ := testdb.New(t)
	cfg := config.Config{
		PublicURL:        publicURL,
		OIDCIssuer:       issuer,
		OIDCClientID:     "isodraw-local",
		OIDCClientSecret: "local-secret",
		OIDCScopes:       []string{"openid", "email", "profile"},
		SessionSecret:    "test-secret-0123456789",
		SessionTTL:       time.Hour,
	}
	s := store.New(pool)
	a, err := auth.New(cfg, s)
	if err != nil {
		t.Fatal(err)
	}
	srv := httptest.NewServer(httpapi.New(cfg, s, a, blobs.Dir(t.TempDir())))
	t.Cleanup(srv.Close)
	return srv, s
}

// TestSignInWithDex runs the whole authorization code flow against the local
// Dex: our login redirect, Dex's password form, and our callback.
func TestSignInWithDex(t *testing.T) {
	issuer := dexIssuer(t)
	srv, s := server(t, issuer)

	jar, _ := cookiejar.New(nil)
	client := &http.Client{
		Jar: jar,
		// Stop when the browser would come back to the app (the registered
		// redirect is localhost:5190); the test hands that request to srv.
		CheckRedirect: func(r *http.Request, _ []*http.Request) error {
			if strings.HasPrefix(r.URL.String(), publicURL) {
				return http.ErrUseLastResponse
			}
			return nil
		},
	}

	// 1. Our login sets the signed state cookie and sends us to Dex, which shows its form.
	res, err := client.Get(srv.URL + "/auth/login?return=/diagrams")
	if err != nil {
		t.Fatal(err)
	}
	page, _ := io.ReadAll(res.Body)
	res.Body.Close()
	if res.StatusCode != 200 || !strings.Contains(string(page), "password") {
		t.Fatalf("expected Dex's login form, got %d at %s", res.StatusCode, res.Request.URL)
	}
	srvURL, _ := url.Parse(srv.URL)
	var loginCookie *http.Cookie
	for _, c := range jar.Cookies(&url.URL{Scheme: "http", Host: srvURL.Host, Path: "/auth"}) {
		if c.Name == "isodraw_login" {
			loginCookie = c
		}
	}
	if loginCookie == nil {
		t.Fatal("no login state cookie")
	}

	// 2. Submit the dev user's password; Dex redirects back to the app with a code.
	action := res.Request.URL
	if m := regexp.MustCompile(`action="([^"]+)"`).FindSubmatch(page); m != nil {
		action, _ = res.Request.URL.Parse(strings.ReplaceAll(string(m[1]), "&amp;", "&"))
	}
	res, err = client.PostForm(action.String(), url.Values{"login": {"dev@isodraw.local"}, "password": {"password"}})
	if err != nil {
		t.Fatal(err)
	}
	res.Body.Close()
	back, err := res.Location()
	if err != nil || !strings.HasPrefix(back.String(), publicURL+"/auth/callback") {
		t.Fatalf("expected a redirect to the callback, got %d %v", res.StatusCode, back)
	}

	// 3. Our callback with that code: user, personal org and session are created.
	req, _ := http.NewRequest("GET", srv.URL+back.RequestURI(), nil)
	req.AddCookie(loginCookie)
	noFollow := &http.Client{CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}
	res, err = noFollow.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	res.Body.Close()
	if res.StatusCode != http.StatusFound || res.Header.Get("Location") != "/diagrams" {
		t.Fatalf("callback: %d to %q", res.StatusCode, res.Header.Get("Location"))
	}
	var session *http.Cookie
	for _, c := range res.Cookies() {
		if c.Name == auth.SessionCookie {
			session = c
		}
	}
	if session == nil || !session.HttpOnly || session.SameSite != http.SameSiteLaxMode {
		t.Fatalf("session cookie: %+v", session)
	}
	u, err := s.SessionUser(context.Background(), session.Value)
	if err != nil || u.Email != "dev@isodraw.local" {
		t.Fatalf("session user: %+v %v", u, err)
	}
	orgs, err := s.UserOrgs(context.Background(), u.ID)
	if err != nil || len(orgs) != 1 || orgs[0].Slug != "dev" {
		t.Fatalf("personal org: %+v %v", orgs, err)
	}

	// Replaying the callback fails: the code is single-use.
	res, _ = noFollow.Do(req)
	res.Body.Close()
	if res.StatusCode == http.StatusFound {
		t.Fatal("a used code must not sign in again")
	}
}

func TestCallbackRejectsForgedState(t *testing.T) {
	issuer := dexIssuer(t)
	srv, _ := server(t, issuer)
	res, err := http.Get(srv.URL + "/auth/callback?code=x&state=y")
	if err != nil {
		t.Fatal(err)
	}
	res.Body.Close()
	if res.StatusCode != http.StatusBadRequest {
		t.Fatalf("no state cookie: %d", res.StatusCode)
	}
	req, _ := http.NewRequest("GET", srv.URL+"/auth/callback?code=x&state=y", nil)
	req.AddCookie(&http.Cookie{Name: "isodraw_login", Value: "eyJzIjoieSJ9.forged"})
	res, err = http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	res.Body.Close()
	if res.StatusCode != http.StatusBadRequest {
		t.Fatalf("forged state cookie: %d", res.StatusCode)
	}
}

func TestLoginOnlyReturnsToThisSite(t *testing.T) {
	issuer := dexIssuer(t)
	srv, _ := server(t, issuer)
	noFollow := &http.Client{CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}
	for _, ret := range []string{"https://evil.example", "//evil.example", "/\\evil.example"} {
		res, err := noFollow.Get(srv.URL + "/auth/login?return=" + url.QueryEscape(ret))
		if err != nil {
			t.Fatal(err)
		}
		res.Body.Close()
		for _, c := range res.Cookies() {
			if c.Name == "isodraw_login" && strings.Contains(c.Value, "evil") {
				t.Fatalf("return %q kept", ret)
			}
		}
	}
}

package httpapi

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/config"
	"github.com/anothrNick/isodraw/api/internal/store"
	"github.com/anothrNick/isodraw/api/internal/testdb"
)

const appOrigin = "http://localhost:5190"

type fixture struct {
	t     *testing.T
	store *store.Store
	h     http.Handler
}

func setup(t *testing.T) *fixture {
	pool, _ := testdb.New(t)
	cfg := config.Config{
		PublicURL:     appOrigin,
		OIDCIssuer:    "http://127.0.0.1:1/unused",
		OIDCClientID:  "test",
		SessionSecret: "test-secret-0123456789",
		SessionTTL:    time.Hour,
	}
	s := store.New(pool)
	return &fixture{t: t, store: s, h: New(cfg, s, auth.New(cfg, s))}
}

// user signs a new user in and returns their session cookie and personal org id.
func (f *fixture) user(email string) (*http.Cookie, string) {
	f.t.Helper()
	ctx := context.Background()
	u, err := f.store.UpsertUser(ctx, "https://issuer.test", email, email, "")
	if err != nil {
		f.t.Fatal(err)
	}
	if err := f.store.EnsurePersonalOrg(ctx, u); err != nil {
		f.t.Fatal(err)
	}
	token, err := f.store.CreateSession(ctx, u.ID, time.Hour)
	if err != nil {
		f.t.Fatal(err)
	}
	orgs, err := f.store.UserOrgs(ctx, u.ID)
	if err != nil || len(orgs) != 1 {
		f.t.Fatalf("orgs: %v %v", orgs, err)
	}
	return &http.Cookie{Name: auth.SessionCookie, Value: token}, orgs[0].ID
}

type req struct {
	method, path, body string
	cookie             *http.Cookie
	header             map[string]string
}

func (f *fixture) do(r req) (*http.Response, map[string]any) {
	f.t.Helper()
	var body io.Reader
	if r.body != "" {
		body = strings.NewReader(r.body)
	}
	hr := httptest.NewRequest(r.method, r.path, body)
	if r.body != "" {
		hr.Header.Set("Content-Type", "application/json")
	}
	if r.cookie != nil {
		hr.AddCookie(r.cookie)
	}
	for k, v := range r.header {
		hr.Header.Set(k, v)
	}
	w := httptest.NewRecorder()
	f.h.ServeHTTP(w, hr)
	res := w.Result()
	var out map[string]any
	_ = json.NewDecoder(res.Body).Decode(&out)
	return res, out
}

func expect(t *testing.T, res *http.Response, status int, out map[string]any) {
	t.Helper()
	if res.StatusCode != status {
		t.Fatalf("status %d, want %d: %v", res.StatusCode, status, out)
	}
}

func TestRequiresSignIn(t *testing.T) {
	f := setup(t)
	res, out := f.do(req{method: "GET", path: "/api/me"})
	expect(t, res, 401, out)
	if out["error"].(map[string]any)["code"] != "unauthenticated" {
		t.Fatal(out)
	}
	res, out = f.do(req{method: "GET", path: "/api/me", cookie: &http.Cookie{Name: auth.SessionCookie, Value: "forged"}})
	expect(t, res, 401, out)
}

func TestMeListsPersonalOrg(t *testing.T) {
	f := setup(t)
	c, org := f.user("Dev.Person@example.com")
	res, out := f.do(req{method: "GET", path: "/api/me", cookie: c})
	expect(t, res, 200, out)
	orgs := out["orgs"].([]any)
	o := orgs[0].(map[string]any)
	if o["id"] != org || o["slug"] != "dev-person" || o["role"] != "owner" || o["personal"] != true {
		t.Fatalf("org: %v", o)
	}
	if res.Header.Get("Cache-Control") != "no-store" {
		t.Fatal("API responses must not be cached")
	}
	// A second user with the same name part gets their own slug.
	c2, _ := f.user("dev.person@other.test")
	_, out = f.do(req{method: "GET", path: "/api/me", cookie: c2})
	if s := out["orgs"].([]any)[0].(map[string]any)["slug"]; s != "dev-person-2" {
		t.Fatalf("slug %v", s)
	}
}

func TestDiagramLifecycle(t *testing.T) {
	f := setup(t)
	c, org := f.user("dev@example.com")

	res, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{"title":"  Shop  "}`, cookie: c})
	expect(t, res, 201, out)
	id := out["id"].(string)
	if out["title"] != "Shop" || out["version"] != 1.0 || res.Header.Get("ETag") != `"1"` {
		t.Fatalf("created: %v %s", out, res.Header.Get("ETag"))
	}
	if nodes := out["content"].(map[string]any)["nodes"].([]any); len(nodes) != 0 {
		t.Fatal("a new diagram starts empty")
	}

	res, out = f.do(req{method: "GET", path: "/api/orgs/" + org + "/diagrams", cookie: c})
	expect(t, res, 200, out)
	list := out["diagrams"].([]any)
	if len(list) != 1 || list[0].(map[string]any)["content"] != nil {
		t.Fatalf("list has metadata only: %v", list)
	}

	content := `{"version":1,"nodes":[{"id":"a","kind":"block"}],"edges":[]}`
	res, out = f.do(req{method: "PUT", path: "/api/diagrams/" + id + "/content", body: content, cookie: c, header: map[string]string{"If-Match": `"1"`}})
	expect(t, res, 200, out)
	if out["version"] != 2.0 || res.Header.Get("ETag") != `"2"` {
		t.Fatalf("saved: %v", out)
	}

	res, out = f.do(req{method: "GET", path: "/api/diagrams/" + id, cookie: c})
	expect(t, res, 200, out)
	if n := out["content"].(map[string]any)["nodes"].([]any); len(n) != 1 {
		t.Fatalf("content: %v", out["content"])
	}

	res, out = f.do(req{method: "PATCH", path: "/api/diagrams/" + id, body: `{"title":"Shop v2"}`, cookie: c})
	expect(t, res, 200, out)
	if out["title"] != "Shop v2" || out["version"] != 2.0 {
		t.Fatalf("renaming keeps the version: %v", out)
	}

	res, _ = f.do(req{method: "DELETE", path: "/api/diagrams/" + id, cookie: c})
	if res.StatusCode != 204 {
		t.Fatal(res.StatusCode)
	}
	res, out = f.do(req{method: "GET", path: "/api/diagrams/" + id, cookie: c})
	expect(t, res, 404, out)
}

func TestSaveConflicts(t *testing.T) {
	f := setup(t)
	c, org := f.user("dev@example.com")
	_, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{}`, cookie: c})
	id := out["id"].(string)
	put := func(ifMatch, body string) (*http.Response, map[string]any) {
		h := map[string]string{}
		if ifMatch != "" {
			h["If-Match"] = ifMatch
		}
		return f.do(req{method: "PUT", path: "/api/diagrams/" + id + "/content", body: body, cookie: c, header: h})
	}
	first := `{"nodes":[{"id":"first"}],"edges":[]}`

	res, out := put("", first)
	expect(t, res, 428, out)

	res, out = put(`"1"`, first)
	expect(t, res, 200, out)

	// Another tab still thinks it's at version 1.
	res, out = put(`"1"`, `{"nodes":[{"id":"second"}],"edges":[]}`)
	expect(t, res, 409, out)
	cur := out["current"].(map[string]any)
	if cur["version"] != 2.0 || cur["content"].(map[string]any)["nodes"].([]any)[0].(map[string]any)["id"] != "first" {
		t.Fatalf("conflict carries the saved diagram: %v", cur)
	}
	if res.Header.Get("ETag") != `"2"` {
		t.Fatal(res.Header.Get("ETag"))
	}

	res, out = put(`W/"2"`, `{"nodes":[],"edges":[]}`)
	expect(t, res, 200, out)
}

func TestRejectsBadInput(t *testing.T) {
	f := setup(t)
	c, org := f.user("dev@example.com")
	_, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{}`, cookie: c})
	id := out["id"].(string)
	put := func(body string) (*http.Response, map[string]any) {
		return f.do(req{method: "PUT", path: "/api/diagrams/" + id + "/content", body: body, cookie: c, header: map[string]string{"If-Match": `"1"`}})
	}

	res, out := put(`{"nodes":[]}`)
	expect(t, res, 400, out)
	res, out = put(`[1,2]`)
	expect(t, res, 400, out)
	res, out = put(`{not json`)
	expect(t, res, 400, out)
	res, out = put(`{"nodes":[],"edges":[],"pad":"` + strings.Repeat("x", MaxContentBytes) + `"}`)
	expect(t, res, 413, out)
	res, out = f.do(req{method: "PATCH", path: "/api/diagrams/" + id, body: `{"title":"   "}`, cookie: c})
	expect(t, res, 400, out)
	res, out = f.do(req{method: "GET", path: "/api/diagrams/not-a-uuid", cookie: c})
	expect(t, res, 404, out)

	// Writes from another site are refused even with the cookie.
	res, out = f.do(req{method: "PATCH", path: "/api/diagrams/" + id, body: `{"title":"x"}`, cookie: c, header: map[string]string{"Origin": "https://evil.example"}})
	expect(t, res, 403, out)
	res, out = f.do(req{method: "PATCH", path: "/api/diagrams/" + id, body: `{"title":"x"}`, cookie: c, header: map[string]string{"Origin": appOrigin}})
	expect(t, res, 200, out)
}

func TestOrganizationsAreSeparate(t *testing.T) {
	f := setup(t)
	alice, aliceOrg := f.user("alice@example.com")
	bob, _ := f.user("bob@example.com")
	_, out := f.do(req{method: "POST", path: "/api/orgs/" + aliceOrg + "/diagrams", body: `{"title":"Private"}`, cookie: alice})
	id := out["id"].(string)

	// Bob can't see Alice's organization or diagram, and can't tell they exist.
	for _, r := range []req{
		{method: "GET", path: "/api/orgs/" + aliceOrg + "/diagrams"},
		{method: "POST", path: "/api/orgs/" + aliceOrg + "/diagrams", body: `{}`},
		{method: "GET", path: "/api/diagrams/" + id},
		{method: "PUT", path: "/api/diagrams/" + id + "/content", body: `{"nodes":[],"edges":[]}`, header: map[string]string{"If-Match": `"1"`}},
		{method: "DELETE", path: "/api/diagrams/" + id},
	} {
		r.cookie = bob
		res, out := f.do(r)
		if res.StatusCode != 404 {
			t.Fatalf("%s %s: %d %v", r.method, r.path, res.StatusCode, out)
		}
	}
}

func TestViewersCannotEdit(t *testing.T) {
	f := setup(t)
	owner, org := f.user("owner@example.com")
	viewer, _ := f.user("viewer@example.com")
	_, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{}`, cookie: owner})
	id := out["id"].(string)

	ctx := context.Background()
	v, _ := f.store.UpsertUser(ctx, "https://issuer.test", "viewer@example.com", "viewer@example.com", "")
	if err := f.store.AddMember(ctx, org, v.ID, store.Viewer); err != nil {
		t.Fatal(err)
	}
	res, out := f.do(req{method: "GET", path: "/api/diagrams/" + id, cookie: viewer})
	expect(t, res, 200, out)
	res, out = f.do(req{method: "PUT", path: "/api/diagrams/" + id + "/content", body: `{"nodes":[],"edges":[]}`, cookie: viewer, header: map[string]string{"If-Match": `"1"`}})
	expect(t, res, 403, out)
	res, out = f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{}`, cookie: viewer})
	expect(t, res, 403, out)
}

func TestLogout(t *testing.T) {
	f := setup(t)
	c, _ := f.user("dev@example.com")
	res, _ := f.do(req{method: "POST", path: "/auth/logout", cookie: c})
	if res.StatusCode != 204 {
		t.Fatal(res.StatusCode)
	}
	res, out := f.do(req{method: "GET", path: "/api/me", cookie: c})
	expect(t, res, 401, out)
}

func TestUnknownAPIRoute(t *testing.T) {
	f := setup(t)
	c, _ := f.user("dev@example.com")
	res, out := f.do(req{method: "GET", path: "/api/nope", cookie: c})
	expect(t, res, 404, out)
}

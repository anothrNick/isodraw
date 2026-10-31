package httpapi

import (
	"context"
	"net/http"
	"strings"
	"testing"
	"time"
)

// token creates an API token with the cookie's session and returns its secret.
func (f *fixture) token(c *http.Cookie, org, scope string) string {
	f.t.Helper()
	res, out := f.do(req{method: "POST", path: "/api/tokens", body: `{"name":"test","orgId":"` + org + `","scope":"` + scope + `"}`, cookie: c})
	expect(f.t, res, 201, out)
	secret := out["secret"].(string)
	if !strings.HasPrefix(secret, "isd_") {
		f.t.Fatalf("secret %q", secret)
	}
	return secret
}

func bearer(secret string) map[string]string { return map[string]string{"Authorization": "Bearer " + secret} }

func TestWriteTokenWorksOnDiagrams(t *testing.T) {
	f := setup(t)
	c, org := f.user("dev@example.com")
	tok := f.token(c, org, "write")

	res, out := f.do(req{method: "GET", path: "/api/me", header: bearer(tok)})
	expect(t, res, 200, out)
	if out["token"].(map[string]any)["scope"] != "write" || len(out["orgs"].([]any)) != 1 {
		t.Fatalf("me with a token: %v", out)
	}

	// Create, save and read back, with no cookie and a foreign Origin (only cookies are checked).
	h := bearer(tok)
	h["Origin"] = "https://somewhere.example"
	res, out = f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{"title":"From the CLI"}`, header: h})
	expect(t, res, 201, out)
	id := out["id"].(string)
	h["If-Match"] = `"1"`
	res, out = f.do(req{method: "PUT", path: "/api/diagrams/" + id + "/content", body: `{"nodes":[{"id":"a"}],"edges":[]}`, header: h})
	expect(t, res, 200, out)
	res, out = f.do(req{method: "GET", path: "/api/diagrams/" + id, header: bearer(tok)})
	expect(t, res, 200, out)
	if out["version"] != 2.0 {
		t.Fatal(out)
	}
}

func TestReadTokenOnlyReads(t *testing.T) {
	f := setup(t)
	c, org := f.user("dev@example.com")
	_, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{}`, cookie: c})
	id := out["id"].(string)
	tok := f.token(c, org, "read")

	res, out := f.do(req{method: "GET", path: "/api/diagrams/" + id, header: bearer(tok)})
	expect(t, res, 200, out)
	_, out = f.do(req{method: "GET", path: "/api/me", header: bearer(tok)})
	if out["orgs"].([]any)[0].(map[string]any)["role"] != "viewer" {
		t.Fatalf("a read-only token acts as a viewer: %v", out)
	}
	h := bearer(tok)
	h["If-Match"] = `"1"`
	res, out = f.do(req{method: "PUT", path: "/api/diagrams/" + id + "/content", body: `{"nodes":[],"edges":[]}`, header: h})
	expect(t, res, 403, out)
	if out["error"].(map[string]any)["code"] != "read_only_token" {
		t.Fatal(out)
	}
	// It can still revoke itself.
	res, _ = f.do(req{method: "DELETE", path: "/api/tokens/current", header: bearer(tok)})
	if res.StatusCode != 204 {
		t.Fatal(res.StatusCode)
	}
	res, out = f.do(req{method: "GET", path: "/api/me", header: bearer(tok)})
	expect(t, res, 401, out)
}

func TestTokenStaysInItsOrganization(t *testing.T) {
	f := setup(t)
	c, personal := f.user("dev@example.com")
	team, _ := f.team(c, "Shop")
	_, out := f.do(req{method: "POST", path: "/api/orgs/" + team + "/diagrams", body: `{}`, cookie: c})
	teamDiagram := out["id"].(string)
	tok := f.token(c, personal, "write")

	res, out := f.do(req{method: "GET", path: "/api/orgs/" + team + "/diagrams", header: bearer(tok)})
	expect(t, res, 404, out)
	res, out = f.do(req{method: "GET", path: "/api/diagrams/" + teamDiagram, header: bearer(tok)})
	expect(t, res, 404, out)
	_, out = f.do(req{method: "GET", path: "/api/me", header: bearer(tok)})
	if len(out["orgs"].([]any)) != 1 {
		t.Fatalf("a token sees only its organization: %v", out["orgs"])
	}
}

func TestTokensCantManageAccess(t *testing.T) {
	f := setup(t)
	c, _ := f.user("dev@example.com")
	team, _ := f.team(c, "Shop")
	tok := f.token(c, team, "write")
	for _, r := range []req{
		{method: "POST", path: "/api/orgs", body: `{"name":"x"}`},
		{method: "POST", path: "/api/orgs/" + team + "/invites", body: `{"email":"x@example.com"}`},
		{method: "POST", path: "/api/tokens", body: `{"name":"x","orgId":"` + team + `","scope":"write"}`},
		{method: "GET", path: "/api/tokens"},
	} {
		r.header = bearer(tok)
		res, out := f.do(r)
		if res.StatusCode != 403 || out["error"].(map[string]any)["code"] != "browser_only" {
			t.Fatalf("%s %s: %d %v", r.method, r.path, res.StatusCode, out)
		}
	}
	// Reading the member list is fine.
	res, out := f.do(req{method: "GET", path: "/api/orgs/" + team + "/members", header: bearer(tok)})
	expect(t, res, 200, out)
}

func TestTokenListAndRevoke(t *testing.T) {
	f := setup(t)
	c, org := f.user("dev@example.com")
	tok := f.token(c, org, "write")
	res, out := f.do(req{method: "GET", path: "/api/tokens", cookie: c})
	expect(t, res, 200, out)
	list := out["tokens"].([]any)
	if len(list) != 1 || list[0].(map[string]any)["orgName"] != "Personal" || list[0].(map[string]any)["secret"] != nil {
		t.Fatalf("list never includes secrets: %v", list)
	}
	id := list[0].(map[string]any)["id"].(string)

	// Someone else can't revoke it.
	other, _ := f.user("other@example.com")
	res, out = f.do(req{method: "DELETE", path: "/api/tokens/" + id, cookie: other})
	expect(t, res, 404, out)

	res, _ = f.do(req{method: "DELETE", path: "/api/tokens/" + id, cookie: c})
	if res.StatusCode != 204 {
		t.Fatal(res.StatusCode)
	}
	res, out = f.do(req{method: "GET", path: "/api/me", header: bearer(tok)})
	expect(t, res, 401, out)
}

func TestTokenRules(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	viewer, _ := f.user("viewer@example.com")
	team, _ := f.team(owner, "Shop")
	f.do(req{method: "POST", path: "/api/invites/" + f.invite(owner, team, "viewer@example.com", "viewer") + "/accept", cookie: viewer})

	res, out := f.do(req{method: "POST", path: "/api/tokens", body: `{"name":"x","orgId":"` + team + `","scope":"write"}`, cookie: viewer})
	expect(t, res, 403, out)
	f.token(viewer, team, "read")

	for _, body := range []string{
		`{"name":"","orgId":"` + team + `","scope":"read"}`,
		`{"name":"x","orgId":"` + team + `","scope":"admin"}`,
		`{"name":"x","orgId":"` + team + `","scope":"read","expiresInDays":999}`,
	} {
		res, out = f.do(req{method: "POST", path: "/api/tokens", body: body, cookie: owner})
		expect(t, res, 400, out)
	}
	stranger, _ := f.user("stranger@example.com")
	res, out = f.do(req{method: "POST", path: "/api/tokens", body: `{"name":"x","orgId":"` + team + `","scope":"read"}`, cookie: stranger})
	expect(t, res, 404, out)
}

func TestExpiredTokensStopWorking(t *testing.T) {
	f := setup(t)
	_, org := f.user("dev@example.com")
	ctx := context.Background()
	u, _ := f.store.UpsertUser(ctx, "https://issuer.test", "dev@example.com", "dev@example.com", "")
	past := time.Now().Add(-time.Minute)
	_, secret, err := f.store.CreateToken(ctx, u.ID, org, "old", "write", &past)
	if err != nil {
		t.Fatal(err)
	}
	res, out := f.do(req{method: "GET", path: "/api/me", header: bearer(secret)})
	expect(t, res, 401, out)
	res, out = f.do(req{method: "GET", path: "/api/me", header: bearer("isd_made-up")})
	expect(t, res, 401, out)
}

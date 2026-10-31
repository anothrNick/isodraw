package httpapi

import (
	"net/http"
	"strings"
	"testing"
)

// team creates a team owned by the cookie's user and returns its id and slug.
func (f *fixture) team(c *http.Cookie, name string) (string, string) {
	f.t.Helper()
	res, out := f.do(req{method: "POST", path: "/api/orgs", body: `{"name":"` + name + `"}`, cookie: c})
	expect(f.t, res, 201, out)
	return out["id"].(string), out["slug"].(string)
}

// invite invites an address and returns the link's token.
func (f *fixture) invite(c *http.Cookie, org, email, role string) string {
	f.t.Helper()
	res, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/invites", body: `{"email":"` + email + `","role":"` + role + `"}`, cookie: c})
	expect(f.t, res, 201, out)
	url := out["url"].(string)
	if !strings.HasPrefix(url, appOrigin+"/invite/") {
		f.t.Fatalf("invite url %q", url)
	}
	return strings.TrimPrefix(url, appOrigin+"/invite/")
}

func roleOf(t *testing.T, f *fixture, c *http.Cookie, org, email string) string {
	t.Helper()
	res, out := f.do(req{method: "GET", path: "/api/orgs/" + org + "/members", cookie: c})
	expect(t, res, 200, out)
	for _, m := range out["members"].([]any) {
		if m.(map[string]any)["email"] == email {
			return m.(map[string]any)["role"].(string)
		}
	}
	return ""
}

func userID(t *testing.T, f *fixture, c *http.Cookie) string {
	t.Helper()
	_, out := f.do(req{method: "GET", path: "/api/me", cookie: c})
	return out["user"].(map[string]any)["id"].(string)
}

func TestCreateTeam(t *testing.T) {
	f := setup(t)
	c, _ := f.user("dev@example.com")
	id, slug := f.team(c, "Platform Team")
	if slug != "platform-team" {
		t.Fatal(slug)
	}
	_, slug2 := f.team(c, "Platform team")
	if slug2 != "platform-team-2" {
		t.Fatalf("taken slugs get a number: %s", slug2)
	}
	if _, s := f.team(c, "Invite"); s != "invite-team" {
		t.Fatalf("reserved words stay out of URLs: %s", s)
	}
	_, out := f.do(req{method: "GET", path: "/api/me", cookie: c})
	if n := len(out["orgs"].([]any)); n != 4 {
		t.Fatalf("personal org plus three teams, got %d", n)
	}
	res, out := f.do(req{method: "PATCH", path: "/api/orgs/" + id, body: `{"name":"Platform"}`, cookie: c})
	expect(t, res, 200, out)
	if out["name"] != "Platform" || out["slug"] != "platform-team" {
		t.Fatalf("renaming keeps the slug: %v", out)
	}
	res, out = f.do(req{method: "POST", path: "/api/orgs", body: `{"name":"  "}`, cookie: c})
	expect(t, res, 400, out)
}

func TestInviteAndAccept(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	alex, _ := f.user("alex@example.com")
	org, slug := f.team(owner, "Shop")
	token := f.invite(owner, org, "Alex@Example.com", "editor")

	// Before accepting, Alex sees what the invite is for, and not the team's diagrams.
	res, out := f.do(req{method: "GET", path: "/api/invites/" + token, cookie: alex})
	expect(t, res, 200, out)
	if out["orgName"] != "Shop" || out["role"] != "editor" || out["email"] != "alex@example.com" || out["invitedBy"] != "owner@example.com" {
		t.Fatalf("invite: %v", out)
	}
	res, out = f.do(req{method: "GET", path: "/api/orgs/" + org + "/diagrams", cookie: alex})
	expect(t, res, 404, out)

	// The owner sees the invite as pending.
	_, out = f.do(req{method: "GET", path: "/api/orgs/" + org + "/members", cookie: owner})
	if len(out["invites"].([]any)) != 1 {
		t.Fatalf("pending: %v", out["invites"])
	}

	res, out = f.do(req{method: "POST", path: "/api/invites/" + token + "/accept", cookie: alex})
	expect(t, res, 200, out)
	if out["slug"] != slug || out["role"] != "editor" {
		t.Fatalf("accepted: %v", out)
	}
	if r := roleOf(t, f, owner, org, "alex@example.com"); r != "editor" {
		t.Fatal(r)
	}
	res, out = f.do(req{method: "GET", path: "/api/orgs/" + org + "/diagrams", cookie: alex})
	expect(t, res, 200, out)

	// A link works once, and accepted invites leave the pending list.
	res, out = f.do(req{method: "POST", path: "/api/invites/" + token + "/accept", cookie: alex})
	expect(t, res, 409, out)
	_, out = f.do(req{method: "GET", path: "/api/orgs/" + org + "/members", cookie: owner})
	if len(out["invites"].([]any)) != 0 {
		t.Fatalf("pending: %v", out["invites"])
	}
}

func TestInviteOnlyForItsAddress(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	eve, _ := f.user("eve@example.com")
	org, _ := f.team(owner, "Shop")
	token := f.invite(owner, org, "alex@example.com", "editor")
	res, out := f.do(req{method: "POST", path: "/api/invites/" + token + "/accept", cookie: eve})
	expect(t, res, 403, out)
	if !strings.Contains(out["error"].(map[string]any)["message"].(string), "alex@example.com") {
		t.Fatal(out)
	}
	res, out = f.do(req{method: "GET", path: "/api/invites/not-a-real-token", cookie: eve})
	expect(t, res, 404, out)
}

func TestReinviteReplacesAndRevoke(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	alex, _ := f.user("alex@example.com")
	org, _ := f.team(owner, "Shop")
	old := f.invite(owner, org, "alex@example.com", "viewer")
	newer := f.invite(owner, org, "alex@example.com", "editor")
	res, out := f.do(req{method: "GET", path: "/api/invites/" + old, cookie: alex})
	expect(t, res, 404, out)

	_, out = f.do(req{method: "GET", path: "/api/orgs/" + org + "/members", cookie: owner})
	invites := out["invites"].([]any)
	if len(invites) != 1 {
		t.Fatalf("one open invite per address: %v", invites)
	}
	id := invites[0].(map[string]any)["id"].(string)
	res, _ = f.do(req{method: "DELETE", path: "/api/orgs/" + org + "/invites/" + id, cookie: owner})
	if res.StatusCode != 204 {
		t.Fatal(res.StatusCode)
	}
	res, out = f.do(req{method: "POST", path: "/api/invites/" + newer + "/accept", cookie: alex})
	expect(t, res, 404, out)
}

func TestNoInvitesToPersonalWorkspaces(t *testing.T) {
	f := setup(t)
	owner, personal := f.user("owner@example.com")
	res, out := f.do(req{method: "POST", path: "/api/orgs/" + personal + "/invites", body: `{"email":"alex@example.com"}`, cookie: owner})
	expect(t, res, 409, out)
	res, out = f.do(req{method: "DELETE", path: "/api/orgs/" + personal + "/members/" + userID(t, f, owner), cookie: owner})
	expect(t, res, 409, out)
}

func TestRoleRules(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	admin, _ := f.user("admin@example.com")
	editor, _ := f.user("editor@example.com")
	org, _ := f.team(owner, "Shop")
	for email, role := range map[string]string{"admin@example.com": "admin", "editor@example.com": "editor"} {
		c := map[string]*http.Cookie{"admin@example.com": admin, "editor@example.com": editor}[email]
		res, out := f.do(req{method: "POST", path: "/api/invites/" + f.invite(owner, org, email, role) + "/accept", cookie: c})
		expect(t, res, 200, out)
	}
	ownerID, adminID, editorID := userID(t, f, owner), userID(t, f, admin), userID(t, f, editor)
	path := func(id string) string { return "/api/orgs/" + org + "/members/" + id }

	// Editors can't manage members or see invites.
	res, out := f.do(req{method: "PATCH", path: path(editorID), body: `{"role":"admin"}`, cookie: editor})
	expect(t, res, 403, out)
	res, out = f.do(req{method: "POST", path: "/api/orgs/" + org + "/invites", body: `{"email":"x@example.com"}`, cookie: editor})
	expect(t, res, 403, out)
	_, out = f.do(req{method: "GET", path: "/api/orgs/" + org + "/members", cookie: editor})
	if len(out["members"].([]any)) != 3 || len(out["invites"].([]any)) != 0 {
		t.Fatalf("editors see members but not invites: %v", out)
	}

	// Admins manage everyone below owner, but can't touch owners or make one.
	res, out = f.do(req{method: "PATCH", path: path(editorID), body: `{"role":"viewer"}`, cookie: admin})
	expect(t, res, 204, out)
	res, out = f.do(req{method: "PATCH", path: path(editorID), body: `{"role":"owner"}`, cookie: admin})
	expect(t, res, 403, out)
	res, out = f.do(req{method: "PATCH", path: path(ownerID), body: `{"role":"viewer"}`, cookie: admin})
	expect(t, res, 403, out)
	res, out = f.do(req{method: "DELETE", path: path(ownerID), cookie: admin})
	expect(t, res, 403, out)
	res, out = f.do(req{method: "POST", path: "/api/orgs/" + org + "/invites", body: `{"email":"x@example.com","role":"owner"}`, cookie: admin})
	expect(t, res, 403, out)

	// The only owner can't step down or leave; with a second owner they can.
	res, out = f.do(req{method: "PATCH", path: path(ownerID), body: `{"role":"admin"}`, cookie: owner})
	expect(t, res, 409, out)
	res, out = f.do(req{method: "DELETE", path: path(ownerID), cookie: owner})
	expect(t, res, 409, out)
	res, out = f.do(req{method: "PATCH", path: path(adminID), body: `{"role":"owner"}`, cookie: owner})
	expect(t, res, 204, out)
	res, out = f.do(req{method: "DELETE", path: path(ownerID), cookie: owner})
	expect(t, res, 204, out)

	// Anyone can leave; the viewer leaves, then can't see the team.
	res, out = f.do(req{method: "DELETE", path: path(editorID), cookie: editor})
	expect(t, res, 204, out)
	res, out = f.do(req{method: "GET", path: "/api/orgs/" + org + "/members", cookie: editor})
	expect(t, res, 404, out)

	res, out = f.do(req{method: "PATCH", path: path(adminID), body: `{"role":"boss"}`, cookie: admin})
	expect(t, res, 400, out)
}

func TestAcceptingNeverLowersARole(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	alex, _ := f.user("alex@example.com")
	org, _ := f.team(owner, "Shop")
	f.do(req{method: "POST", path: "/api/invites/" + f.invite(owner, org, "alex@example.com", "admin") + "/accept", cookie: alex})
	res, out := f.do(req{method: "POST", path: "/api/invites/" + f.invite(owner, org, "alex@example.com", "viewer") + "/accept", cookie: alex})
	expect(t, res, 200, out)
	if r := roleOf(t, f, owner, org, "alex@example.com"); r != "admin" {
		t.Fatal(r)
	}
}

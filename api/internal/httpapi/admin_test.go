package httpapi

import (
	"context"
	"github.com/anothrNick/isodraw/api/internal/store"
	"net/http"
	"testing"
)

func (f *fixture) makeAdmin(c *http.Cookie) {
	f.t.Helper()
	if err := f.store.SetPlatformAdmin(context.Background(), userID(f.t, f, c), true); err != nil {
		f.t.Fatal(err)
	}
}

func TestAdminIsHiddenFromOthers(t *testing.T) {
	f := setup(t)
	c, org := f.user("ada@example.com")
	for _, path := range []string{"/api/admin/stats", "/api/admin/users", "/api/admin/orgs", "/api/admin/events"} {
		if res, out := f.do(req{method: "GET", path: path, cookie: c}); res.StatusCode != 404 {
			t.Fatalf("%s: %d %v", path, res.StatusCode, out)
		}
	}
	_, out := f.do(req{method: "GET", path: "/api/me", cookie: c})
	if out["admin"] != false {
		t.Fatal(out)
	}
	// Admins can't use the admin routes through an API token either.
	f.makeAdmin(c)
	tok := f.token(c, org, "write")
	if res, _ := f.do(req{method: "GET", path: "/api/admin/stats", header: bearer(tok)}); res.StatusCode != 404 {
		t.Fatal(res.StatusCode)
	}
	_, out = f.do(req{method: "GET", path: "/api/me", header: bearer(tok)})
	if _, has := out["admin"]; has {
		t.Fatal("tokens don't learn about admin", out)
	}
}

func TestAdminManagesUsersAndWorkspaces(t *testing.T) {
	f := setup(t)
	admin, _ := f.user("admin@example.com")
	f.makeAdmin(admin)
	ada, _ := f.user("ada@example.com")
	team, _ := f.team(ada, "Shop")

	_, out := f.do(req{method: "GET", path: "/api/me", cookie: admin})
	if out["admin"] != true {
		t.Fatal(out)
	}
	res, out := f.do(req{method: "GET", path: "/api/admin/stats", cookie: admin})
	expect(t, res, 200, out)
	if st := out["stats"].(map[string]any); st["users"].(float64) != 2 || st["teams"].(float64) != 1 || st["lifetime"].(float64) != 1 {
		t.Fatal(st)
	}

	// Find Ada, take back her lifetime access; her team turns read-only.
	res, out = f.do(req{method: "GET", path: "/api/admin/users?q=ada", cookie: admin})
	expect(t, res, 200, out)
	users := out["users"].([]any)
	if len(users) != 1 {
		t.Fatal(out)
	}
	id := users[0].(map[string]any)["id"].(string)
	res, out = f.do(req{method: "PATCH", path: "/api/admin/users/" + id, body: `{"lifetime":false}`, cookie: admin})
	expect(t, res, 200, out)
	if out["user"].(map[string]any)["lifetimeSince"] != nil || len(out["workspaces"].([]any)) != 2 {
		t.Fatal(out)
	}
	if p := f.plan(ada, team); p["editable"] != false {
		t.Fatal(p)
	}

	// Grandfather the team instead: editable again.
	res, out = f.do(req{method: "GET", path: "/api/admin/orgs?kind=team", cookie: admin})
	expect(t, res, 200, out)
	if ws := out["workspaces"].([]any); len(ws) != 1 || ws[0].(map[string]any)["owner"] != "ada@example.com" {
		t.Fatal(out)
	}
	res, out = f.do(req{method: "PATCH", path: "/api/admin/orgs/" + team, body: `{"grandfathered":true}`, cookie: admin})
	expect(t, res, 200, out)
	if out["plan"].(map[string]any)["editable"] != true || len(out["members"].([]any)) != 1 {
		t.Fatal(out)
	}

	// Personal workspaces follow their person's plan.
	res, out = f.do(req{method: "GET", path: "/api/admin/orgs?kind=personal&q=ada", cookie: admin})
	expect(t, res, 200, out)
	personal := out["workspaces"].([]any)[0].(map[string]any)["id"].(string)
	res, out = f.do(req{method: "PATCH", path: "/api/admin/orgs/" + personal, body: `{"grandfathered":true}`, cookie: admin})
	expect(t, res, 409, out)

	// Both changes are in the log, newest first.
	res, out = f.do(req{method: "GET", path: "/api/admin/events", cookie: admin})
	expect(t, res, 200, out)
	ev := out["events"].([]any)
	if len(ev) != 2 || ev[0].(map[string]any)["action"] != "team.grandfather" || ev[1].(map[string]any)["action"] != "lifetime.revoke" ||
		ev[1].(map[string]any)["admin"] != "admin@example.com" || ev[1].(map[string]any)["target"] != "ada@example.com" {
		t.Fatal(ev)
	}
}

func TestAdminDeletesATeam(t *testing.T) {
	f := setup(t)
	admin, _ := f.user("admin@example.com")
	f.makeAdmin(admin)
	ada, personal := f.user("ada@example.com")
	team, slug := f.team(ada, "Shop")
	res, d := newDiagram(f, ada, team, 1)
	expect(t, res, 201, d)
	f.invite(ada, team, "bob@example.com", "editor")
	del := func(c *http.Cookie, org, confirm string) (*http.Response, map[string]any) {
		return f.do(req{method: "POST", path: "/api/admin/orgs/" + org + "/delete", body: `{"confirm":"` + confirm + `"}`, cookie: c})
	}

	// Only platform admins, only with the exact address typed, never a personal workspace.
	if res, _ := del(ada, team, slug); res.StatusCode != 404 {
		t.Fatal(res.StatusCode)
	}
	if res, out := del(admin, team, "Shop"); res.StatusCode != 400 {
		t.Fatal(out)
	}
	if res, out := del(admin, personal, "ada"); res.StatusCode != 409 {
		t.Fatal(out)
	}

	res, out := del(admin, team, slug)
	expect(t, res, 200, out)
	if got := out["deleted"].(map[string]any); got["diagrams"].(float64) != 1 || got["members"].(float64) != 1 || got["invites"].(float64) != 1 {
		t.Fatal(got)
	}
	// Gone for its members, and its diagrams with it.
	_, me := f.do(req{method: "GET", path: "/api/me", cookie: ada})
	if len(me["orgs"].([]any)) != 1 {
		t.Fatal(me)
	}
	if res, _ := f.do(req{method: "GET", path: "/api/diagrams/" + d["id"].(string), cookie: ada}); res.StatusCode != 404 {
		t.Fatal(res.StatusCode)
	}
	_, ev := f.do(req{method: "GET", path: "/api/admin/events", cookie: admin})
	if e := ev["events"].([]any)[0].(map[string]any); e["action"] != "team.delete" || e["target"] != "Shop ("+slug+")" {
		t.Fatal(e)
	}
}

func TestAdminCompsAWorkspace(t *testing.T) {
	f := setup(t)
	admin, _ := f.user("admin@example.com")
	f.makeAdmin(admin)
	// A prospect on the free plan: no lifetime access, can't make teams themselves.
	ada, _ := f.user("ada@example.com")
	adaID := userID(t, f, ada)

	create := func(c *http.Cookie, body string) (*http.Response, map[string]any) {
		return f.do(req{method: "POST", path: "/api/admin/orgs", body: body, cookie: c})
	}
	if res, _ := create(ada, `{"name":"Acme","ownerId":"`+adaID+`","plan":"pro"}`); res.StatusCode != 404 {
		t.Fatal("admins only", res.StatusCode)
	}
	if res, out := create(admin, `{"name":"Acme","ownerId":"`+adaID+`","plan":"gold"}`); res.StatusCode != 400 {
		t.Fatal(out)
	}
	res, o := create(admin, `{"name":"Acme demo","ownerId":"`+adaID+`","plan":"pro","note":"Demo for Acme, call on Friday"}`)
	expect(t, res, 201, o)
	org := o["id"].(string)
	if o["plan"] != "pro" || o["owner"] != "ada@example.com" {
		t.Fatal(o)
	}

	// Ada owns it and can use it without paying: editable, unlimited diagrams, up to 4 people.
	p := f.plan(ada, org)
	if p["editable"] != true || p["plan"] != "pro" || p["planSource"] != "comp" || p["peopleLimit"].(float64) != store.ProPeople || p["diagramLimit"].(float64) != 0 {
		t.Fatal(p)
	}
	res, out := newDiagram(f, ada, org, 1)
	expect(t, res, 201, out)
	// Ada plus three invites fill it, viewers included; a fourth is refused.
	f.invite(ada, org, "b@example.com", "editor")
	f.invite(ada, org, "c@example.com", "viewer")
	f.invite(ada, org, "d@example.com", "viewer")
	res, out = f.do(req{method: "POST", path: "/api/orgs/" + org + "/invites", body: `{"email":"e@example.com","role":"viewer"}`, cookie: ada})
	expect(t, res, 402, out)
	// Re-inviting someone already counted is fine.
	f.invite(ada, org, "d@example.com", "editor")

	// Moving it to Team lifts the limit.
	res, out = f.do(req{method: "PATCH", path: "/api/admin/orgs/" + org, body: `{"plan":"team","note":"Signed"}`, cookie: admin})
	expect(t, res, 200, out)
	if out["plan"].(map[string]any)["peopleLimit"].(float64) != 0 {
		t.Fatal(out)
	}
	f.invite(ada, org, "e@example.com", "viewer")

	// Taking the plan away: it follows Ada's own access again, and she has no lifetime access.
	res, out = f.do(req{method: "PATCH", path: "/api/admin/orgs/" + org, body: `{"plan":""}`, cookie: admin})
	expect(t, res, 200, out)
	if out["plan"].(map[string]any)["editable"] != false {
		t.Fatal(out)
	}

	_, ev := f.do(req{method: "GET", path: "/api/admin/events", cookie: admin})
	events := ev["events"].([]any)
	if e := events[2].(map[string]any); e["action"] != "team.create" || e["detail"] != "pro for ada@example.com; Demo for Acme, call on Friday" {
		t.Fatal(e)
	}
	if e := events[1].(map[string]any); e["action"] != "team.plan" || e["detail"] != "team; Signed" {
		t.Fatal(e)
	}
}

package httpapi

import (
	"context"
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

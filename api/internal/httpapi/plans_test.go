package httpapi

import (
	"context"
	"fmt"
	"net/http"
	"testing"

	"github.com/anothrNick/isodraw/api/internal/store"
)

// lifetime grants (or takes back) the cookie's user's lifetime access, as a purchase or refund would.
func (f *fixture) lifetime(c *http.Cookie, on bool) {
	f.t.Helper()
	_, out := f.do(req{method: "GET", path: "/api/me", cookie: c})
	email := out["user"].(map[string]any)["email"].(string)
	if n, err := f.store.SetLifetime(context.Background(), email, on); err != nil || n != 1 {
		f.t.Fatalf("lifetime: %d %v", n, err)
	}
}

func (f *fixture) plan(c *http.Cookie, org string) map[string]any {
	f.t.Helper()
	res, out := f.do(req{method: "GET", path: "/api/orgs/" + org + "/plan", cookie: c})
	expect(f.t, res, 200, out)
	return out
}

func newDiagram(f *fixture, c *http.Cookie, org string, n int) (*http.Response, map[string]any) {
	return f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: fmt.Sprintf(`{"title":"D%d"}`, n), cookie: c})
}

func TestFreePersonalDiagramLimit(t *testing.T) {
	f := setup(t)
	c, org := f.user("ada@example.com")
	var first string
	for n := 1; n <= store.FreeDiagrams; n++ {
		res, out := newDiagram(f, c, org, n)
		expect(t, res, 201, out)
		if n == 1 {
			first = out["id"].(string)
		}
	}
	if p := f.plan(c, org); p["diagrams"].(float64) != store.FreeDiagrams || p["diagramLimit"].(float64) != store.FreeDiagrams || p["lifetime"] != false {
		t.Fatal(p)
	}
	res, out := newDiagram(f, c, org, 11)
	expect(t, res, 402, out)
	if out["error"].(map[string]any)["code"] != "plan_limit" {
		t.Fatal(out)
	}
	// Nothing existing is locked: the diagrams still save.
	res, out = f.do(req{method: "PUT", path: "/api/diagrams/" + first + "/content", body: `{"version":1,"nodes":[],"edges":[]}`, cookie: c, header: map[string]string{"If-Match": `"1"`}})
	expect(t, res, 200, out)
	// Deleting one makes room.
	res, out = f.do(req{method: "DELETE", path: "/api/diagrams/" + first, cookie: c})
	expect(t, res, 204, out)
	res, out = newDiagram(f, c, org, 11)
	expect(t, res, 201, out)
	// Lifetime lifts the limit.
	f.lifetime(c, true)
	res, out = newDiagram(f, c, org, 12)
	expect(t, res, 201, out)
	if p := f.plan(c, org); p["diagramLimit"].(float64) != 0 || p["lifetime"] != true {
		t.Fatal(p)
	}
	_, out = f.do(req{method: "GET", path: "/api/me", cookie: c})
	if out["lifetime"] != true {
		t.Fatal(out)
	}
}

func TestTeamsNeedLifetime(t *testing.T) {
	f := setup(t)
	c, _ := f.user("ada@example.com")
	res, out := f.do(req{method: "POST", path: "/api/orgs", body: `{"name":"Shop"}`, cookie: c})
	expect(t, res, 402, out)
	f.lifetime(c, true)
	res, out = f.do(req{method: "POST", path: "/api/orgs", body: `{"name":"Shop"}`, cookie: c})
	expect(t, res, 201, out)
	team := out["id"].(string)
	if p := f.plan(c, team); p["editorLimit"].(float64) != store.TeamEditors || p["editors"].(float64) != 1 || p["diagramLimit"].(float64) != 0 {
		t.Fatal(p)
	}

	// A refund makes the team read-only, but nothing is lost, and members can still be managed.
	res, out = newDiagram(f, c, team, 1)
	expect(t, res, 201, out)
	id := out["id"].(string)
	f.lifetime(c, false)
	res, out = newDiagram(f, c, team, 2)
	expect(t, res, 402, out)
	res, out = f.do(req{method: "PATCH", path: "/api/diagrams/" + id, body: `{"title":"New"}`, cookie: c})
	expect(t, res, 402, out)
	res, out = f.do(req{method: "GET", path: "/api/diagrams/" + id, cookie: c})
	expect(t, res, 200, out)
	f.invite(c, team, "viewer@example.com", "viewer")
	if p := f.plan(c, team); p["editable"] != false {
		t.Fatal(p)
	}
	f.lifetime(c, true)
	res, out = f.do(req{method: "PATCH", path: "/api/diagrams/" + id, body: `{"title":"New"}`, cookie: c})
	expect(t, res, 200, out)
}

func TestTeamEditorSeats(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	team, _ := f.team(owner, "Shop")
	// The owner plus four invited editors fill the five seats.
	for n := 1; n < store.TeamEditors; n++ {
		f.invite(owner, team, fmt.Sprintf("e%d@example.com", n), "editor")
	}
	res, out := f.do(req{method: "POST", path: "/api/orgs/" + team + "/invites", body: `{"email":"e9@example.com","role":"editor"}`, cookie: owner})
	expect(t, res, 402, out)
	// Viewers are unlimited, and re-inviting someone already counted isn't a new seat.
	f.invite(owner, team, "v1@example.com", "viewer")
	f.invite(owner, team, "e1@example.com", "admin")

	// Accepting the viewer invite, then making them an editor, needs a free seat.
	viewer, _ := f.user("v1@example.com")
	token := f.invite(owner, team, "v1@example.com", "viewer")
	res, out = f.do(req{method: "POST", path: "/api/invites/" + token + "/accept", cookie: viewer})
	expect(t, res, 200, out)
	vid := userID(t, f, viewer)
	res, out = f.do(req{method: "PATCH", path: "/api/orgs/" + team + "/members/" + vid, body: `{"role":"editor"}`, cookie: owner})
	expect(t, res, 402, out)

	// Revoking an invite frees a seat.
	_, out = f.do(req{method: "GET", path: "/api/orgs/" + team + "/members", cookie: owner})
	var revoke string
	for _, i := range out["invites"].([]any) {
		if i.(map[string]any)["email"] == "e2@example.com" {
			revoke = i.(map[string]any)["id"].(string)
		}
	}
	res, out = f.do(req{method: "DELETE", path: "/api/orgs/" + team + "/invites/" + revoke, cookie: owner})
	expect(t, res, 204, out)
	res, out = f.do(req{method: "PATCH", path: "/api/orgs/" + team + "/members/" + vid, body: `{"role":"editor"}`, cookie: owner})
	expect(t, res, 204, out)
}

func TestGrandfatheredTeams(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	team, _ := f.team(owner, "Old team")
	// Teams from before plans are marked by the migration; do the same here.
	if _, err := f.pool.Exec(context.Background(), `update orgs set grandfathered = true where id = $1`, team); err != nil {
		t.Fatal(err)
	}
	f.lifetime(owner, false)
	for n := 1; n <= store.TeamEditors+1; n++ {
		f.invite(owner, team, fmt.Sprintf("e%d@example.com", n), "editor")
	}
	res, out := newDiagram(f, owner, team, 1)
	expect(t, res, 201, out)
	if p := f.plan(owner, team); p["grandfathered"] != true || p["editorLimit"].(float64) != 0 || p["editable"] != true {
		t.Fatal(p)
	}
}

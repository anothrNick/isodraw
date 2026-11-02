package httpapi

import (
	"encoding/json"
	"strings"
	"testing"

	"github.com/anothrNick/isodraw/api/internal/store"
)

func TestMoveAndCopyDiagrams(t *testing.T) {
	f := setup(t)
	ada, personal := f.user("ada@example.com")
	team, _ := f.team(ada, "Shop")

	// A diagram in Ada's personal workspace that uses an uploaded image.
	res, img := f.upload(ada, personal, "image/png", "Logo", pngBytes, nil)
	expect(t, res, 201, img)
	content := `{"version":1,"nodes":[{"id":"a","kind":"image","x":0,"y":0,"z":0,"w":2,"d":2,"h":0.35,"color":"#fff","src":"` + img["url"].(string) + `"}],"edges":[]}`
	res, d := f.do(req{method: "POST", path: "/api/orgs/" + personal + "/diagrams", body: `{"title":"Shop map","content":` + content + `}`, cookie: ada})
	expect(t, res, 201, d)
	id := d["id"].(string)

	// Copy it into the team: a new diagram, same content, original untouched.
	res, c := f.do(req{method: "POST", path: "/api/diagrams/" + id + "/copy", body: `{"orgId":"` + team + `"}`, cookie: ada})
	expect(t, res, 201, c)
	if c["title"] != "Shop map (copy)" || c["orgId"] != team || c["id"] == id || !strings.Contains(string(mustJSON(t, c["content"])), img["url"].(string)) {
		t.Fatal(c)
	}
	// The image is on the team's Images tab too, at the same link.
	_, out := f.do(req{method: "GET", path: "/api/orgs/" + team + "/images", cookie: ada})
	if ims := out["images"].([]any); len(ims) != 1 || ims[0].(map[string]any)["url"] != img["url"] {
		t.Fatal(out)
	}

	// Move the original: same id and version, now in the team.
	res, m := f.do(req{method: "POST", path: "/api/diagrams/" + id + "/move", body: `{"orgId":"` + team + `"}`, cookie: ada})
	expect(t, res, 200, m)
	if m["id"] != id || m["orgId"] != team || m["version"].(float64) != 1 {
		t.Fatal(m)
	}
	_, out = f.do(req{method: "GET", path: "/api/orgs/" + personal + "/diagrams", cookie: ada})
	if len(out["diagrams"].([]any)) != 0 {
		t.Fatal("it left the personal workspace", out)
	}
	// Moving it again copies the image once, not twice.
	_, out = f.do(req{method: "GET", path: "/api/orgs/" + team + "/images", cookie: ada})
	if len(out["images"].([]any)) != 1 {
		t.Fatal(out)
	}
	res, out = f.do(req{method: "POST", path: "/api/diagrams/" + id + "/move", body: `{"orgId":"` + team + `"}`, cookie: ada})
	expect(t, res, 400, out)
}

func TestMoveAndCopyRules(t *testing.T) {
	f := setup(t)
	ada, personal := f.user("ada@example.com")
	bob, bobPersonal := f.user("bob@example.com")
	team, _ := f.team(ada, "Shop")
	token := f.invite(ada, team, "bob@example.com", "viewer")
	res, out := f.do(req{method: "POST", path: "/api/invites/" + token + "/accept", cookie: bob})
	expect(t, res, 200, out)
	res, d := newDiagram(f, ada, team, 1)
	expect(t, res, 201, d)
	id := d["id"].(string)

	// Bob can read the team's diagram, so he can copy it to his own workspace, but not move it.
	res, out = f.do(req{method: "POST", path: "/api/diagrams/" + id + "/move", body: `{"orgId":"` + bobPersonal + `"}`, cookie: bob})
	expect(t, res, 403, out)
	res, out = f.do(req{method: "POST", path: "/api/diagrams/" + id + "/copy", body: `{"orgId":"` + bobPersonal + `"}`, cookie: bob})
	expect(t, res, 201, out)
	// Nobody can put diagrams in a workspace they can't edit, or don't belong to.
	res, out = f.do(req{method: "POST", path: "/api/diagrams/" + id + "/copy", body: `{"orgId":"` + team + `"}`, cookie: bob})
	expect(t, res, 403, out)
	res, out = f.do(req{method: "POST", path: "/api/diagrams/" + id + "/copy", body: `{"orgId":"` + personal + `"}`, cookie: bob})
	expect(t, res, 404, out)

	// A full free personal workspace refuses one more.
	for n := 1; n <= store.FreeDiagrams; n++ {
		res, out := newDiagram(f, bob, bobPersonal, n+1)
		if n < store.FreeDiagrams {
			expect(t, res, 201, out)
		}
	}
	res, out = f.do(req{method: "POST", path: "/api/diagrams/" + id + "/copy", body: `{"orgId":"` + bobPersonal + `"}`, cookie: bob})
	expect(t, res, 402, out)
}

func mustJSON(t *testing.T, v any) []byte {
	t.Helper()
	b, err := json.Marshal(v)
	if err != nil {
		t.Fatal(err)
	}
	return b
}

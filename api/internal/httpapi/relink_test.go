package httpapi

import (
	"context"
	"strings"
	"testing"
)

func TestRelinkAfterADomainMove(t *testing.T) {
	f := setup(t)
	c, org := f.user("ada@example.com")
	content := `{"version":1,"nodes":[{"id":"a","kind":"image","x":0,"y":0,"z":0,"w":2,"d":2,"h":0.35,"color":"#fff","src":"https://old.example/i/abc.png"}],"edges":[]}`
	res, d := f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{"title":"Map","content":` + content + `}`, cookie: c})
	expect(t, res, 201, d)
	res, other := newDiagram(f, c, org, 2)
	expect(t, res, 201, other)

	ctx := context.Background()
	if n, err := f.store.Relink(ctx, "https://old.example", "https://new.example", false); err != nil || n != 1 {
		t.Fatalf("dry run: %d %v", n, err)
	}
	if n, err := f.store.Relink(ctx, "https://old.example", "https://new.example", true); err != nil || n != 1 {
		t.Fatalf("apply: %d %v", n, err)
	}
	res, got := f.do(req{method: "GET", path: "/api/diagrams/" + d["id"].(string), cookie: c})
	expect(t, res, 200, got)
	if b := string(mustJSON(t, got["content"])); !strings.Contains(b, "https://new.example/i/abc.png") || strings.Contains(b, "old.example") || got["version"].(float64) != 2 {
		t.Fatal(got)
	}
	// Nothing left to do the second time.
	if n, _ := f.store.Relink(ctx, "https://old.example", "https://new.example", false); n != 0 {
		t.Fatal(n)
	}
}

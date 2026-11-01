package httpapi

import (
	"encoding/json"
	"net/url"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/anothrNick/isodraw/api/internal/config"
)

const previewContent = `{"version":1,"view":"2d","doc":"secret overview",
 "nodes":[
  {"id":"api","kind":"box","x":0,"y":0,"w":2,"d":2,"h":1,"z":0,"color":"#fff","doc":"secret node doc",
   "detail":{"version":1,"doc":"inner overview","nodes":[
     {"id":"worker","kind":"box","x":0,"y":0,"w":1,"d":1,"h":1,"z":0,"color":"#000","doc":"inner doc",
      "detail":{"version":1,"nodes":[{"id":"deep","kind":"box","x":0,"y":0,"w":1,"d":1,"h":1,"z":0,"color":"#000"}],"edges":[]}}],"edges":[]}},
  {"id":"db","kind":"cylinder","x":4,"y":0,"w":2,"d":2,"h":1,"z":0,"color":"#fff"}],
 "edges":[{"id":"e1","from":"api","to":"db","doc":"secret edge doc"}]}`

func TestPreviewLinks(t *testing.T) {
	f := setup(t)
	c, org := f.user("ada@example.com")
	_, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{"title":"Payments","content":` + previewContent + `}`, cookie: c})
	id := out["id"].(string)

	// Someone outside the organization can't get a link.
	other, _ := f.user("eve@example.com")
	res, out := f.do(req{method: "GET", path: "/api/diagrams/" + id + "/preview", cookie: other})
	expect(t, res, 404, out)

	res, out = f.do(req{method: "GET", path: "/api/diagrams/" + id + "/preview", cookie: c})
	expect(t, res, 200, out)
	svg := out["svg"].(string)
	if out["png"] != strings.Replace(svg, ".svg?", ".png?", 1) {
		t.Fatalf("png link: %v", out["png"])
	}
	if !strings.HasPrefix(svg, appOrigin+"/p/"+id+".svg?") || !strings.HasPrefix(out["url"].(string), appOrigin+"/") || out["title"] != "Payments" {
		t.Fatalf("link: %v", out)
	}
	exp, _ := time.Parse(time.RFC3339, out["expiresAt"].(string))
	if d := time.Until(exp); d < 6*24*time.Hour || d > 8*24*time.Hour {
		t.Fatalf("default expiry is a week: %v", exp)
	}
	public := func(link string) (int, map[string]any) {
		u, _ := url.Parse(link)
		res, out := f.do(req{method: "GET", path: "/public/previews/" + id + "?" + u.RawQuery})
		return res.StatusCode, out
	}

	// The top level, without any docs or deeper diagrams.
	status, out := public(svg)
	if status != 200 || out["title"] != "Payments" || out["version"] != float64(1) {
		t.Fatalf("%d %v", status, out)
	}
	raw, _ := json.Marshal(out["diagram"])
	for _, secret := range []string{"secret", "inner", "worker", "deep"} {
		if strings.Contains(string(raw), secret) {
			t.Fatalf("the preview leaks %q: %s", secret, raw)
		}
	}
	d := out["diagram"].(map[string]any)
	if d["view"] != "2d" || len(d["nodes"].([]any)) != 2 || len(d["edges"].([]any)) != 1 {
		t.Fatalf("diagram: %s", raw)
	}
	if d["nodes"].([]any)[0].(map[string]any)["detail"] == nil {
		t.Fatal("a component with a detail diagram still shows as one")
	}

	// A detail level, and a level that doesn't exist.
	res, out = f.do(req{method: "GET", path: "/api/diagrams/" + id + "/preview?level=api&ttl=2d", cookie: c})
	expect(t, res, 200, out)
	if !strings.HasSuffix(out["url"].(string), "#in/api") {
		t.Fatal(out["url"])
	}
	status, out = public(out["svg"].(string))
	if status != 200 {
		t.Fatal(out)
	}
	nodes := out["diagram"].(map[string]any)["nodes"].([]any)
	if len(nodes) != 1 || nodes[0].(map[string]any)["id"] != "worker" || nodes[0].(map[string]any)["doc"] != nil {
		t.Fatalf("level: %v", out)
	}
	res, out = f.do(req{method: "GET", path: "/api/diagrams/" + id + "/preview?level=db", cookie: c})
	expect(t, res, 400, out)
	res, out = f.do(req{method: "GET", path: "/api/diagrams/" + id + "/preview?ttl=400d", cookie: c})
	expect(t, res, 400, out)

	// Tampering: another level, a later expiry, another diagram.
	u, _ := url.Parse(svg)
	q := u.Query()
	q.Set("l", "api")
	if status, _ := public("x?" + q.Encode()); status != 403 {
		t.Fatalf("changed level: %d", status)
	}
	q = u.Query()
	q.Set("e", strconv.FormatInt(time.Now().Add(1000*24*time.Hour).Unix(), 10))
	if status, _ := public("x?" + q.Encode()); status != 403 {
		t.Fatalf("changed expiry: %d", status)
	}
	res, _ = f.do(req{method: "GET", path: "/public/previews/00000000-0000-0000-0000-000000000000?" + u.RawQuery})
	if res.StatusCode != 403 {
		t.Fatalf("another diagram: %d", res.StatusCode)
	}

	// Expired links stop working.
	past := time.Now().Add(-time.Minute).Unix()
	signer := &Server{cfg: config.Config{SessionSecret: "test-secret-0123456789"}}
	q = url.Values{"e": {strconv.FormatInt(past, 10)}, "s": {signer.previewSig(id, "", past)}}
	if status, out := public("x?" + q.Encode()); status != 410 {
		t.Fatalf("expired: %d %v", status, out)
	}

	// Deleted diagrams stop showing.
	res, _ = f.do(req{method: "DELETE", path: "/api/diagrams/" + id, cookie: c, header: map[string]string{"Origin": appOrigin}})
	if status, _ := public(svg); status != 404 {
		t.Fatalf("deleted: %d", status)
	}
}

func TestDiagramListHasThumbnails(t *testing.T) {
	f := setup(t)
	c, org := f.user("ada@example.com")
	_, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/diagrams", body: `{"title":"Payments","content":` + previewContent + `}`, cookie: c})
	id := out["id"].(string)
	res, out := f.do(req{method: "GET", path: "/api/orgs/" + org + "/diagrams", cookie: c})
	expect(t, res, 200, out)
	item := out["diagrams"].([]any)[0].(map[string]any)
	thumb, _ := url.Parse(item["thumbnail"].(string))
	q := thumb.Query()
	if thumb.Path != "/p/"+id+".png" || q.Get("size") != "thumb" || q.Get("v") != "1" {
		t.Fatalf("thumbnail: %s", thumb)
	}
	// It's a working preview link, valid for a day or two, the same all day.
	exp, _ := strconv.ParseInt(q.Get("e"), 10, 64)
	if d := time.Until(time.Unix(exp, 0)); d < 24*time.Hour || d > 48*time.Hour || exp%86400 != 0 {
		t.Fatalf("expiry %v", time.Unix(exp, 0))
	}
	res, out = f.do(req{method: "GET", path: "/public/previews/" + id + "?" + thumb.RawQuery})
	expect(t, res, 200, out)
}

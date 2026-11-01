package httpapi

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

var pngBytes = []byte("\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89")

// upload posts raw image bytes the way the web app does.
func (f *fixture) upload(c *http.Cookie, org, contentType, name string, data []byte, header map[string]string) (*http.Response, map[string]any) {
	f.t.Helper()
	h := map[string]string{"Content-Type": contentType}
	for k, v := range header {
		h[k] = v
	}
	return f.do(req{method: "POST", path: "/api/orgs/" + org + "/images?name=" + name, body: string(data), cookie: c, header: h})
}

// get fetches a path without the JSON decoding, for the image itself.
func (f *fixture) get(path string) (*http.Response, []byte) {
	w := httptest.NewRecorder()
	f.h.ServeHTTP(w, httptest.NewRequest("GET", path, nil))
	body, _ := io.ReadAll(w.Result().Body)
	return w.Result(), body
}

func TestImages(t *testing.T) {
	f := setup(t)
	c, org := f.user("ada@example.com")

	res, img := f.upload(c, org, "image/png", "Logo", pngBytes, nil)
	expect(t, res, 201, img)
	link := img["url"].(string)
	if img["name"] != "Logo" || img["size"].(float64) != float64(len(pngBytes)) || img["uploadedBy"] != "ada@example.com" ||
		!strings.HasPrefix(link, appOrigin+"/i/") || !strings.HasSuffix(link, ".png") {
		t.Fatal(img)
	}

	// Everyone in the workspace sees it on the list.
	res, out := f.do(req{method: "GET", path: "/api/orgs/" + org + "/images", cookie: c})
	expect(t, res, 200, out)
	if list := out["images"].([]any); len(list) != 1 || list[0].(map[string]any)["url"] != link {
		t.Fatal(out)
	}

	// The link works without signing in, cached for good, with scripts locked out.
	res, body := f.get(strings.TrimPrefix(link, appOrigin))
	if res.StatusCode != 200 || !bytes.Equal(body, pngBytes) || res.Header.Get("Content-Type") != "image/png" ||
		!strings.Contains(res.Header.Get("Cache-Control"), "immutable") || !strings.Contains(res.Header.Get("Content-Security-Policy"), "sandbox") {
		t.Fatalf("%d %v", res.StatusCode, res.Header)
	}
	if res, _ := f.get("/i/not-a-real-token.png"); res.StatusCode != 404 {
		t.Fatal(res.StatusCode)
	}

	// Removing takes it off the list, but diagrams that use it keep working.
	res, out = f.do(req{method: "DELETE", path: "/api/orgs/" + org + "/images/" + img["id"].(string), cookie: c})
	expect(t, res, 204, out)
	_, out = f.do(req{method: "GET", path: "/api/orgs/" + org + "/images", cookie: c})
	if len(out["images"].([]any)) != 0 {
		t.Fatal(out)
	}
	if res, _ := f.get(strings.TrimPrefix(link, appOrigin)); res.StatusCode != 200 {
		t.Fatal("removed images keep their links")
	}
}

func TestImageUploadRules(t *testing.T) {
	f := setup(t)
	c, org := f.user("ada@example.com")

	if res, out := f.upload(c, org, "application/pdf", "x", []byte("%PDF-1.4"), nil); res.StatusCode != 415 {
		t.Fatal(out)
	}
	// The bytes must be what the type says.
	if res, out := f.upload(c, org, "image/png", "x", []byte("<html>nope</html>"), nil); res.StatusCode != 400 {
		t.Fatal(out)
	}
	if res, out := f.upload(c, org, "image/svg+xml", "x", []byte("not an svg"), nil); res.StatusCode != 400 {
		t.Fatal(out)
	}
	res, out := f.upload(c, org, "image/svg+xml", "Mark", []byte(`<svg xmlns="http://www.w3.org/2000/svg"/>`), nil)
	expect(t, res, 201, out)
	if !strings.HasSuffix(out["url"].(string), ".svg") {
		t.Fatal(out)
	}
	if res, out := f.upload(c, org, "image/png", "big", append(pngBytes, make([]byte, MaxImageBytes)...), nil); res.StatusCode != 413 {
		t.Fatal(out)
	}

	// Read-only tokens act as viewers; other workspaces don't exist.
	read := f.token(c, org, "read")
	if res, out := f.upload(nil, org, "image/png", "x", pngBytes, bearer(read)); res.StatusCode != 403 {
		t.Fatal(out)
	}
	write := f.token(c, org, "write")
	if res, out := f.upload(nil, org, "image/png", "x", pngBytes, bearer(write)); res.StatusCode != 201 {
		t.Fatal(out)
	}
	eve, _ := f.user("eve@example.com")
	if res, out := f.upload(eve, org, "image/png", "x", pngBytes, nil); res.StatusCode != 404 {
		t.Fatal(out)
	}
	if res, out := f.do(req{method: "GET", path: "/api/orgs/" + org + "/images", cookie: eve}); res.StatusCode != 404 {
		t.Fatal(out)
	}
}

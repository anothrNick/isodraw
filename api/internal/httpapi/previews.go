package httpapi

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/anothrNick/isodraw/api/internal/store"
)

// Preview links: a signed, expiring URL to a picture of one diagram level,
// for places that can't sign in (a chat window, a wiki, a pull request).
//
//	GET /api/diagrams/{id}/preview?level=a/b&ttl=168h   (signed in, can read the diagram) → svg and png links
//	  → {"svg": ".../p/{id}.svg?l=a/b&e=…&s=…", "url": ".../org/d/{id}#in/a/b", "expiresAt": …}
//	GET /public/previews/{id}?l=a/b&e=…&s=…              (anyone with the link)
//	  → {"title": …, "diagram": …} the level only, without docs or deeper levels
//
// The web app's /p/{id}.svg function calls the second and draws the SVG. The
// link shows the diagram as it is when the picture is fetched, until it expires.

const (
	previewDefaultTTL = 7 * 24 * time.Hour
	previewMaxTTL     = 365 * 24 * time.Hour
)

// previewKey is derived from the session secret, so there's nothing else to configure.
func (s *Server) previewKey() []byte {
	m := hmac.New(sha256.New, []byte(s.cfg.SessionSecret))
	m.Write([]byte("isodraw preview links v1"))
	return m.Sum(nil)
}

func (s *Server) previewSig(id, level string, exp int64) string {
	m := hmac.New(sha256.New, s.previewKey())
	m.Write([]byte(id + "\n" + level + "\n" + strconv.FormatInt(exp, 10)))
	return base64.RawURLEncoding.EncodeToString(m.Sum(nil)[:24])
}

// splitLevel turns "a/b" into ["a","b"]; "" is the top diagram.
func splitLevel(level string) []string {
	if level == "" {
		return nil
	}
	return strings.Split(level, "/")
}

func (s *Server) previewLink(w http.ResponseWriter, r *http.Request) {
	d, ok := s.diagramAccess(w, r, false)
	if !ok {
		return
	}
	q := r.URL.Query()
	level := strings.Trim(q.Get("level"), "/")
	ttl := previewDefaultTTL
	if v := q.Get("ttl"); v != "" {
		parsed, err := parseTTL(v)
		if err != nil || parsed <= 0 || parsed > previewMaxTTL {
			writeError(w, http.StatusBadRequest, "invalid_ttl", "ttl is a duration up to a year, like 24h, 7d or 30d.")
			return
		}
		ttl = parsed
	}
	if _, err := levelOf(d.Content, splitLevel(level)); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_level", err.Error())
		return
	}
	org, err := s.store.GetOrg(r.Context(), d.OrgID)
	if err != nil {
		internalError(w, err)
		return
	}
	exp := time.Now().Add(ttl).Unix()
	pq := url.Values{}
	if level != "" {
		pq.Set("l", level)
	}
	pq.Set("e", strconv.FormatInt(exp, 10))
	pq.Set("s", s.previewSig(d.ID, level, exp))
	app := s.cfg.PublicURL + "/" + org.Slug + "/d/" + d.ID
	if level != "" {
		app += "#in/" + level
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"svg": s.cfg.PublicURL + "/p/" + d.ID + ".svg?" + pq.Encode(),
		// The same picture as PNG, for apps that don't show SVG (chat apps).
		"png":       s.cfg.PublicURL + "/p/" + d.ID + ".png?" + pq.Encode(),
		"url":       app,
		"title":     d.Title,
		"expiresAt": time.Unix(exp, 0).UTC(),
	})
}

// thumbnailLink is a signed PNG link to a small picture of a diagram's top level, for the
// app's grid of diagrams. Its expiry is rounded to a day, and the version is in the link, so
// the browser can keep the image until the diagram changes.
func (s *Server) thumbnailLink(id string, version int64) string {
	exp := time.Now().UTC().Truncate(24 * time.Hour).Add(48 * time.Hour).Unix()
	q := url.Values{}
	q.Set("e", strconv.FormatInt(exp, 10))
	q.Set("s", s.previewSig(id, "", exp))
	q.Set("size", "thumb")
	q.Set("v", strconv.FormatInt(version, 10))
	return s.cfg.PublicURL + "/p/" + id + ".png?" + q.Encode()
}

// parseTTL reads Go durations plus days: "36h", "7d".
func parseTTL(v string) (time.Duration, error) {
	if days, ok := strings.CutSuffix(v, "d"); ok {
		n, err := strconv.Atoi(days)
		if err != nil {
			return 0, err
		}
		return time.Duration(n) * 24 * time.Hour, nil
	}
	return time.ParseDuration(v)
}

func (s *Server) publicPreview(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	q := r.URL.Query()
	level := q.Get("l")
	exp, err := strconv.ParseInt(q.Get("e"), 10, 64)
	if !isUUID(id) || err != nil || !hmac.Equal([]byte(q.Get("s")), []byte(s.previewSig(id, level, exp))) {
		writeError(w, http.StatusForbidden, "bad_signature", "This preview link isn't valid.")
		return
	}
	if time.Now().Unix() > exp {
		writeError(w, http.StatusGone, "expired", "This preview link has expired.")
		return
	}
	d, err := s.store.GetDiagram(r.Context(), id)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "This diagram no longer exists.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	lvl, err := levelOf(d.Content, splitLevel(level))
	if err != nil {
		writeError(w, http.StatusNotFound, "not_found", "That part of the diagram no longer exists.")
		return
	}
	// Short, so edits show up soon; the link itself stays valid until it expires.
	w.Header().Set("Cache-Control", "public, max-age=60")
	// The version lets the picture function keep one rendering per version of the diagram.
	writeJSON(w, http.StatusOK, map[string]any{"title": d.Title, "version": d.Version, "diagram": lvl})
}

// levelOf picks a level out of diagram content and keeps only what drawing it
// needs: no docs anywhere, and no deeper levels (a component that has one is
// marked with an empty detail, so it still draws as drillable).
func levelOf(content json.RawMessage, path []string) (map[string]any, error) {
	var d map[string]any
	if err := json.Unmarshal(content, &d); err != nil {
		return nil, err
	}
	for _, id := range path {
		var next map[string]any
		for _, n := range asList(d["nodes"]) {
			if n["id"] == id {
				next, _ = n["detail"].(map[string]any)
			}
		}
		if next == nil {
			return nil, errors.New("no component " + strconv.Quote(id) + " with a detail diagram on that path")
		}
		d = next
	}
	out := map[string]any{"version": 1, "nodes": []any{}, "edges": []any{}}
	if v, ok := d["view"]; ok {
		out["view"] = v
	}
	nodes := []any{}
	for _, n := range asList(d["nodes"]) {
		delete(n, "doc")
		if _, ok := n["detail"]; ok {
			n["detail"] = map[string]any{"version": 1, "nodes": []any{}, "edges": []any{}}
		}
		nodes = append(nodes, n)
	}
	edges := []any{}
	for _, e := range asList(d["edges"]) {
		delete(e, "doc")
		edges = append(edges, e)
	}
	out["nodes"], out["edges"] = nodes, edges
	return out, nil
}

func asList(v any) []map[string]any {
	items, _ := v.([]any)
	out := make([]map[string]any, 0, len(items))
	for _, it := range items {
		if m, ok := it.(map[string]any); ok {
			out = append(out, m)
		}
	}
	return out
}

package httpapi

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/store"
)

// MaxContentBytes caps a diagram's JSON. Uploaded images live in workspace image
// storage (images.go) and diagrams link to them, so real diagrams stay far below this.
const MaxContentBytes = 5 << 20

const maxTitle = 200

var emptyContent = json.RawMessage(`{"version":1,"nodes":[],"edges":[]}`)

func (s *Server) me(w http.ResponseWriter, r *http.Request) {
	u := auth.User(r.Context())
	orgs, err := s.store.UserOrgs(r.Context(), u.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	lifetime, err := s.store.HasLifetime(r.Context(), u.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	t := auth.Token(r.Context())
	if t == nil {
		// Platform admins get the admin screens; only in the app, never through a token.
		admin, err := s.store.IsPlatformAdmin(r.Context(), u.ID)
		if err != nil {
			internalError(w, err)
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"user": u, "orgs": orgs, "lifetime": lifetime, "admin": admin})
		return
	}
	// A token sees only its own organization, with the role it acts as there.
	visible := []store.Org{}
	for _, o := range orgs {
		if o.ID == t.OrgID {
			if t.Scope != store.ScopeWrite {
				o.Role = store.Viewer
			}
			visible = append(visible, o)
		}
	}
	writeJSON(w, http.StatusOK, map[string]any{"user": u, "orgs": visible, "token": t, "lifetime": lifetime})
}

// roleIn is the role the request acts with in an organization: the user's
// role, limited by the token when there is one. A token only works in its own
// organization, and a read-only token acts as a viewer.
func (s *Server) roleIn(r *http.Request, orgID string) (store.Role, error) {
	role, err := s.store.RoleIn(r.Context(), orgID, auth.User(r.Context()).ID)
	if err != nil {
		return role, err
	}
	if t := auth.Token(r.Context()); t != nil {
		if t.OrgID != orgID {
			return "", store.ErrNotFound
		}
		if t.Scope != store.ScopeWrite {
			return store.Viewer, nil
		}
	}
	return role, nil
}

// browserOnly refuses requests made with an API token. Tokens are for working
// on diagrams; teams, members, invites and tokens are managed in the app.
func browserOnly(w http.ResponseWriter, r *http.Request) bool {
	if auth.Token(r.Context()) != nil {
		writeError(w, http.StatusForbidden, "browser_only", "This can only be done in the IsoDraw app, not with an API token.")
		return false
	}
	return true
}

// orgRole checks that the signed-in user belongs to the organization. Non-members get 404, so ids don't leak.
func (s *Server) orgRole(w http.ResponseWriter, r *http.Request, orgID string) (store.Role, bool) {
	if !isUUID(orgID) {
		writeError(w, http.StatusNotFound, "not_found", "No such organization.")
		return "", false
	}
	role, err := s.roleIn(r, orgID)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such organization.")
		return "", false
	}
	if err != nil {
		internalError(w, err)
		return "", false
	}
	return role, true
}

// diagramAccess loads a diagram's metadata and the user's role in its organization.
// With `edit`, viewers get 403.
func (s *Server) diagramAccess(w http.ResponseWriter, r *http.Request, edit bool) (store.Diagram, bool) {
	id := r.PathValue("id")
	if !isUUID(id) {
		writeError(w, http.StatusNotFound, "not_found", "No such diagram.")
		return store.Diagram{}, false
	}
	d, err := s.store.GetDiagram(r.Context(), id)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such diagram.")
		return d, false
	}
	if err != nil {
		internalError(w, err)
		return d, false
	}
	role, err := s.roleIn(r, d.OrgID)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such diagram.")
		return d, false
	}
	if err != nil {
		internalError(w, err)
		return d, false
	}
	if edit && !role.CanEdit() {
		writeError(w, http.StatusForbidden, "forbidden", "You can view this diagram but not change it.")
		return d, false
	}
	if edit && !s.editable(w, r, d.OrgID) {
		return d, false
	}
	return d, true
}

func (s *Server) listDiagrams(w http.ResponseWriter, r *http.Request) {
	org := r.PathValue("org")
	if _, ok := s.orgRole(w, r, org); !ok {
		return
	}
	list, err := s.store.ListDiagrams(r.Context(), org)
	if err != nil {
		internalError(w, err)
		return
	}
	type listed struct {
		store.DiagramMeta
		Thumbnail string `json:"thumbnail"`
	}
	out := make([]listed, len(list))
	for i, d := range list {
		out[i] = listed{DiagramMeta: d, Thumbnail: s.thumbnailLink(d.ID, d.Version)}
	}
	writeJSON(w, http.StatusOK, map[string]any{"diagrams": out})
}

func (s *Server) createDiagram(w http.ResponseWriter, r *http.Request) {
	org := r.PathValue("org")
	role, ok := s.orgRole(w, r, org)
	if !ok {
		return
	}
	if !role.CanEdit() {
		writeError(w, http.StatusForbidden, "forbidden", "You can't create diagrams in this organization.")
		return
	}
	var body struct {
		Title   string          `json:"title"`
		Content json.RawMessage `json:"content"`
	}
	if !decode(w, r, MaxContentBytes+4096, &body) {
		return
	}
	title, msg := cleanTitle(body.Title, "Untitled diagram")
	if msg != "" {
		writeError(w, http.StatusBadRequest, "invalid_title", msg)
		return
	}
	content := body.Content
	if len(content) == 0 {
		content = emptyContent
	} else if msg := checkContent(content); msg != "" {
		writeError(w, http.StatusBadRequest, "invalid_content", msg)
		return
	}
	if !s.roomForDiagram(w, r, org) {
		return
	}
	d, err := s.store.CreateDiagram(r.Context(), org, auth.User(r.Context()).ID, title, content)
	if err != nil {
		internalError(w, err)
		return
	}
	w.Header().Set("ETag", etag(d.Version))
	writeJSON(w, http.StatusCreated, d)
}

func (s *Server) getDiagram(w http.ResponseWriter, r *http.Request) {
	d, ok := s.diagramAccess(w, r, false)
	if !ok {
		return
	}
	w.Header().Set("ETag", etag(d.Version))
	writeJSON(w, http.StatusOK, d)
}

// saveContent replaces the content. The If-Match header names the version the
// edit started from; if someone saved in between, the answer is 409 with the
// current diagram, so the client can merge and try again.
func (s *Server) saveContent(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.diagramAccess(w, r, true); !ok {
		return
	}
	from, ok := parseIfMatch(r.Header.Get("If-Match"))
	if !ok {
		writeError(w, http.StatusPreconditionRequired, "version_required", `Send If-Match with the version you edited, like If-Match: "3".`)
		return
	}
	var content json.RawMessage
	if !decode(w, r, MaxContentBytes, &content) {
		return
	}
	if msg := checkContent(content); msg != "" {
		writeError(w, http.StatusBadRequest, "invalid_content", msg)
		return
	}
	m, err := s.store.SaveContent(r.Context(), r.PathValue("id"), auth.User(r.Context()).ID, from, content)
	var conflict *store.ConflictError
	if errors.As(err, &conflict) {
		w.Header().Set("ETag", etag(conflict.Current.Version))
		writeJSON(w, http.StatusConflict, map[string]any{
			"error":   apiError{Code: "version_conflict", Message: "Someone else saved this diagram since you opened it."},
			"current": conflict.Current,
		})
		return
	}
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such diagram.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	w.Header().Set("ETag", etag(m.Version))
	writeJSON(w, http.StatusOK, m)
}

func (s *Server) updateDiagram(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.diagramAccess(w, r, true); !ok {
		return
	}
	var body struct {
		Title *string `json:"title"`
	}
	if !decode(w, r, 4096, &body) {
		return
	}
	if body.Title == nil {
		writeError(w, http.StatusBadRequest, "nothing_to_change", "Send a title.")
		return
	}
	title, msg := cleanTitle(*body.Title, "")
	if msg != "" {
		writeError(w, http.StatusBadRequest, "invalid_title", msg)
		return
	}
	m, err := s.store.Rename(r.Context(), r.PathValue("id"), title)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, m)
}

func (s *Server) deleteDiagram(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.diagramAccess(w, r, true); !ok {
		return
	}
	if err := s.store.DeleteDiagram(r.Context(), r.PathValue("id")); err != nil && !errors.Is(err, store.ErrNotFound) {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// ---------- validation ----------

func cleanTitle(t, fallback string) (string, string) {
	t = strings.TrimSpace(t)
	if t == "" {
		t = fallback
	}
	if t == "" {
		return "", "The title can't be empty."
	}
	if len([]rune(t)) > maxTitle {
		return "", fmt.Sprintf("Keep the title under %d characters.", maxTitle)
	}
	return t, ""
}

// checkContent makes sure the content is an IsoDraw diagram at heart: an
// object with node and connection arrays. The editor's own parser checks the rest.
func checkContent(raw json.RawMessage) string {
	var d struct {
		Nodes []json.RawMessage `json:"nodes"`
		Edges []json.RawMessage `json:"edges"`
	}
	if err := json.Unmarshal(raw, &d); err != nil || d.Nodes == nil || d.Edges == nil {
		return "The content must be an IsoDraw diagram: an object with nodes and edges arrays."
	}
	return ""
}

func etag(v int64) string { return `"` + strconv.FormatInt(v, 10) + `"` }

func parseIfMatch(h string) (int64, bool) {
	h = strings.TrimPrefix(strings.TrimSpace(h), "W/")
	v, err := strconv.ParseInt(strings.Trim(h, `"`), 10, 64)
	return v, err == nil && v > 0
}

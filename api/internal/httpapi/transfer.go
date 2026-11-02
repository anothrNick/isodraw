package httpapi

import (
	"net/http"
	"regexp"

	"github.com/anothrNick/isodraw/api/internal/auth"
)

// Moving and copying diagrams between workspaces, for example from the free
// personal workspace into a team's. Both count against the target's plan.
// Uploaded images are links that work anywhere; they're also put on the
// target workspace's Images tab so its members can reuse them.

func (s *Server) transferRoutes(api *http.ServeMux) {
	api.HandleFunc("POST /api/diagrams/{id}/move", s.moveDiagram)
	api.HandleFunc("POST /api/diagrams/{id}/copy", s.copyDiagram)
}

// targetOrg checks the caller can add a diagram to the workspace named in the body.
func (s *Server) targetOrg(w http.ResponseWriter, r *http.Request, orgID string) bool {
	role, ok := s.orgRole(w, r, orgID)
	if !ok {
		return false
	}
	if !role.CanEdit() {
		writeError(w, http.StatusForbidden, "forbidden", "You can't add diagrams to that workspace.")
		return false
	}
	return s.roomForDiagram(w, r, orgID)
}

func (s *Server) moveDiagram(w http.ResponseWriter, r *http.Request) {
	var body struct {
		OrgID string `json:"orgId"`
	}
	if !decode(w, r, 1024, &body) {
		return
	}
	d, ok := s.diagramAccess(w, r, true)
	if !ok {
		return
	}
	if d.OrgID == body.OrgID {
		writeError(w, http.StatusBadRequest, "same_workspace", "The diagram is already in that workspace.")
		return
	}
	if !s.targetOrg(w, r, body.OrgID) {
		return
	}
	if !s.carryImages(w, r, body.OrgID, d.Content) {
		return
	}
	m, err := s.store.MoveDiagram(r.Context(), d.ID, body.OrgID)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, m)
}

func (s *Server) copyDiagram(w http.ResponseWriter, r *http.Request) {
	var body struct {
		OrgID string `json:"orgId"`
		Title string `json:"title"`
	}
	if !decode(w, r, 4096, &body) {
		return
	}
	d, ok := s.diagramAccess(w, r, false)
	if !ok {
		return
	}
	if !s.targetOrg(w, r, body.OrgID) {
		return
	}
	title := body.Title
	if title == "" {
		// Room for the suffix under the title limit.
		t := []rune(d.Title)
		title = string(t[:min(len(t), maxTitle-len(" (copy)"))]) + " (copy)"
	}
	title, msg := cleanTitle(title, d.Title)
	if msg != "" {
		writeError(w, http.StatusBadRequest, "invalid_title", msg)
		return
	}
	if !s.carryImages(w, r, body.OrgID, d.Content) {
		return
	}
	c, err := s.store.CreateDiagram(r.Context(), body.OrgID, auth.User(r.Context()).ID, title, d.Content)
	if err != nil {
		internalError(w, err)
		return
	}
	w.Header().Set("ETag", etag(c.Version))
	writeJSON(w, http.StatusCreated, c)
}

// carryImages adds the workspace images a diagram uses to the target workspace's list.
func (s *Server) carryImages(w http.ResponseWriter, r *http.Request, orgID string, content []byte) bool {
	link := regexp.MustCompile(regexp.QuoteMeta(s.cfg.PublicURL) + `/i/([A-Za-z0-9_-]{16,64})\.(?:png|jpg|gif|webp|svg)`)
	seen := map[string]bool{}
	var tokens []string
	for _, m := range link.FindAllSubmatch(content, -1) {
		if t := string(m[1]); !seen[t] {
			seen[t] = true
			tokens = append(tokens, t)
		}
	}
	if err := s.store.AddImagesToOrg(r.Context(), orgID, auth.User(r.Context()).ID, tokens); err != nil {
		internalError(w, err)
		return false
	}
	return true
}

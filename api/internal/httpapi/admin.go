package httpapi

import (
	"errors"
	"net/http"
	"strings"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/store"
)

// Platform administration (/api/admin/*): every user and workspace, for
// platform admins only, in the app (not with API tokens). Others get 404, so
// the routes don't announce themselves. Changes are recorded in the admin log.
// Admins see who and what exists, never diagram content.

const adminListLimit = 200

func (s *Server) adminRoutes(api *http.ServeMux) {
	for pattern, h := range map[string]http.HandlerFunc{
		"GET /api/admin/stats":        s.adminStats,
		"GET /api/admin/users":        s.adminUsers,
		"GET /api/admin/users/{id}":   s.adminUser,
		"PATCH /api/admin/users/{id}": s.adminUpdateUser,
		"GET /api/admin/orgs":         s.adminOrgs,
		"GET /api/admin/orgs/{id}":    s.adminOrg,
		"PATCH /api/admin/orgs/{id}":  s.adminUpdateOrg,
		"GET /api/admin/events":       s.adminEvents,
	} {
		api.HandleFunc(pattern, s.platformAdmin(h))
	}
}

func (s *Server) platformAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if auth.Token(r.Context()) != nil {
			writeError(w, http.StatusNotFound, "not_found", "No such API route.")
			return
		}
		ok, err := s.store.IsPlatformAdmin(r.Context(), auth.User(r.Context()).ID)
		if err != nil && !errors.Is(err, store.ErrNotFound) {
			internalError(w, err)
			return
		}
		if !ok {
			writeError(w, http.StatusNotFound, "not_found", "No such API route.")
			return
		}
		next(w, r)
	}
}

func (s *Server) record(r *http.Request, action, target, detail string) {
	if err := s.store.RecordAdminEvent(r.Context(), auth.User(r.Context()).ID, action, target, detail); err != nil {
		internalError(nopWriter{}, err) // logged; the change itself went through
	}
}

func (s *Server) adminStats(w http.ResponseWriter, r *http.Request) {
	stats, err := s.store.AdminStats(r.Context())
	if err != nil {
		internalError(w, err)
		return
	}
	events, err := s.store.AdminEvents(r.Context(), 15)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"stats": stats, "events": events})
}

func (s *Server) adminUsers(w http.ResponseWriter, r *http.Request) {
	list, err := s.store.AdminUsers(r.Context(), strings.TrimSpace(r.URL.Query().Get("q")), adminListLimit)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"users": list, "limit": adminListLimit})
}

func (s *Server) adminUserByPath(w http.ResponseWriter, r *http.Request) (store.AdminUser, bool) {
	id := r.PathValue("id")
	if !isUUID(id) {
		writeError(w, http.StatusNotFound, "not_found", "No such user.")
		return store.AdminUser{}, false
	}
	u, err := s.store.AdminUser(r.Context(), id)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such user.")
		return u, false
	}
	if err != nil {
		internalError(w, err)
		return u, false
	}
	return u, true
}

func (s *Server) adminUser(w http.ResponseWriter, r *http.Request) {
	u, ok := s.adminUserByPath(w, r)
	if !ok {
		return
	}
	orgs, err := s.store.UserWorkspaces(r.Context(), u.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"user": u, "workspaces": orgs})
}

func (s *Server) adminUpdateUser(w http.ResponseWriter, r *http.Request) {
	u, ok := s.adminUserByPath(w, r)
	if !ok {
		return
	}
	var body struct {
		Lifetime *bool `json:"lifetime"`
	}
	if !decode(w, r, 1024, &body) {
		return
	}
	if body.Lifetime != nil {
		if err := s.store.SetLifetimeByID(r.Context(), u.ID, *body.Lifetime); err != nil {
			internalError(w, err)
			return
		}
		action := map[bool]string{true: "lifetime.grant", false: "lifetime.revoke"}[*body.Lifetime]
		s.record(r, action, u.Email, "")
	}
	s.adminUser(w, r)
}

func (s *Server) adminOrgs(w http.ResponseWriter, r *http.Request) {
	kind := r.URL.Query().Get("kind")
	if kind != "team" && kind != "personal" {
		kind = ""
	}
	list, err := s.store.AdminOrgs(r.Context(), strings.TrimSpace(r.URL.Query().Get("q")), kind, adminListLimit)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"workspaces": list, "limit": adminListLimit})
}

func (s *Server) adminOrgByPath(w http.ResponseWriter, r *http.Request) (store.AdminOrg, bool) {
	id := r.PathValue("id")
	if !isUUID(id) {
		writeError(w, http.StatusNotFound, "not_found", "No such workspace.")
		return store.AdminOrg{}, false
	}
	o, err := s.store.AdminOrg(r.Context(), id)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such workspace.")
		return o, false
	}
	if err != nil {
		internalError(w, err)
		return o, false
	}
	return o, true
}

func (s *Server) adminOrg(w http.ResponseWriter, r *http.Request) {
	o, ok := s.adminOrgByPath(w, r)
	if !ok {
		return
	}
	members, err := s.store.Members(r.Context(), o.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	invites, err := s.store.PendingInvites(r.Context(), o.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	plan, err := s.store.OrgPlan(r.Context(), o.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"workspace": o, "members": members, "invites": invites, "plan": plan})
}

func (s *Server) adminUpdateOrg(w http.ResponseWriter, r *http.Request) {
	o, ok := s.adminOrgByPath(w, r)
	if !ok {
		return
	}
	var body struct {
		Grandfathered *bool `json:"grandfathered"`
	}
	if !decode(w, r, 1024, &body) {
		return
	}
	if body.Grandfathered != nil {
		if o.Personal {
			writeError(w, http.StatusConflict, "personal", "Personal workspaces follow their person's plan.")
			return
		}
		if err := s.store.SetGrandfathered(r.Context(), o.ID, *body.Grandfathered); err != nil {
			internalError(w, err)
			return
		}
		action := map[bool]string{true: "team.grandfather", false: "team.ungrandfather"}[*body.Grandfathered]
		s.record(r, action, o.Name+" ("+o.Slug+")", "")
	}
	s.adminOrg(w, r)
}

func (s *Server) adminEvents(w http.ResponseWriter, r *http.Request) {
	events, err := s.store.AdminEvents(r.Context(), adminListLimit)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"events": events})
}

// nopWriter lets internalError log without answering anyone.
type nopWriter struct{}

func (nopWriter) Header() http.Header         { return http.Header{} }
func (nopWriter) Write(b []byte) (int, error) { return len(b), nil }
func (nopWriter) WriteHeader(int)             {}

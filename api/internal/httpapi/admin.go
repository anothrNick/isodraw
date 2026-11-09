package httpapi

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/store"
)

// Platform administration (/api/admin/*): every user and workspace, for
// platform admins only, in the app (not with API tokens). Others get 404, so
// the routes don't announce themselves. Changes are recorded in the admin log.
// Admins see who and what exists, never diagram content.

const (
	adminListLimit  = 200
	maxDiagramLimit = 1_000_000
)

func (s *Server) adminRoutes(api *http.ServeMux) {
	for pattern, h := range map[string]http.HandlerFunc{
		"GET /api/admin/stats":        s.adminStats,
		"GET /api/admin/users":        s.adminUsers,
		"GET /api/admin/users/{id}":   s.adminUser,
		"PATCH /api/admin/users/{id}": s.adminUpdateUser,
		"GET /api/admin/orgs":         s.adminOrgs,
		"GET /api/admin/orgs/{id}":    s.adminOrg,
		"PATCH /api/admin/orgs/{id}":  s.adminUpdateOrg,
		// POST, not DELETE, so the confirmation travels in the body.
		"POST /api/admin/orgs/{id}/delete": s.adminDeleteOrg,
		"POST /api/admin/orgs":             s.adminCreateOrg,
		"GET /api/admin/events":            s.adminEvents,
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
	sold, pending, err := s.store.Seats(r.Context())
	if err != nil {
		internalError(w, err)
		return
	}
	seats := map[string]int{"total": s.cfg.LifetimeSeats, "sold": sold, "pending": pending}
	writeJSON(w, http.StatusOK, map[string]any{"stats": stats, "events": events, "seats": seats, "checkout": s.stripe != nil})
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
	purchases, err := s.store.UserPurchases(r.Context(), u.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"user": u, "workspaces": orgs, "purchases": purchases, "defaultDiagramLimit": s.store.DefaultDiagramLimit()})
}

func (s *Server) adminUpdateUser(w http.ResponseWriter, r *http.Request) {
	u, ok := s.adminUserByPath(w, r)
	if !ok {
		return
	}
	var body struct {
		Lifetime *bool `json:"lifetime"`
		// DiagramLimit is a number, 0 for no limit, or null for the default. Raw to tell null from leaving it out.
		DiagramLimit json.RawMessage `json:"diagramLimit"`
	}
	if !decode(w, r, 1024, &body) {
		return
	}
	var limit *int
	if body.DiagramLimit != nil {
		if err := json.Unmarshal(body.DiagramLimit, &limit); err != nil || (limit != nil && (*limit < 0 || *limit > maxDiagramLimit)) {
			writeError(w, http.StatusBadRequest, "invalid_limit", fmt.Sprintf("The diagram limit must be a whole number from 0 (no limit) to %d, or null for the default.", maxDiagramLimit))
			return
		}
		if err := s.store.SetDiagramLimit(r.Context(), u.ID, limit); err != nil {
			internalError(w, err)
			return
		}
		detail := "default"
		if limit != nil {
			detail = "no limit"
			if *limit > 0 {
				detail = fmt.Sprint(*limit)
			}
		}
		s.record(r, "diagrams.limit", u.Email, detail)
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
		// Plan is "pro", "team" or "business", given without payment (a comp), or "" to take it away.
		Plan *string `json:"plan"`
		Note string  `json:"note"`
	}
	if !decode(w, r, 4096, &body) {
		return
	}
	if body.Plan != nil {
		if o.Personal {
			writeError(w, http.StatusConflict, "personal", "Personal workspaces follow their person's plan.")
			return
		}
		if *body.Plan != "" && !store.Plans[*body.Plan] {
			writeError(w, http.StatusBadRequest, "invalid_plan", "The plan must be pro, team or business.")
			return
		}
		if err := s.store.SetOrgPlan(r.Context(), o.ID, *body.Plan, "comp"); err != nil {
			internalError(w, err)
			return
		}
		plan := *body.Plan
		if plan == "" {
			plan = "none"
		}
		s.record(r, "team.plan", o.Name+" ("+o.Slug+")", noted(plan, body.Note))
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

// adminCreateOrg makes a team workspace for a user, on a plan given without
// payment: for selling by hand and demos. The user is its owner.
func (s *Server) adminCreateOrg(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name    string `json:"name"`
		OwnerID string `json:"ownerId"`
		Plan    string `json:"plan"`
		Note    string `json:"note"`
	}
	if !decode(w, r, 4096, &body) {
		return
	}
	name, msg := cleanOrgName(body.Name)
	if msg != "" {
		writeError(w, http.StatusBadRequest, "invalid_name", msg)
		return
	}
	if !store.Plans[body.Plan] {
		writeError(w, http.StatusBadRequest, "invalid_plan", "The plan must be pro, team or business.")
		return
	}
	if !isUUID(body.OwnerID) {
		writeError(w, http.StatusNotFound, "not_found", "No such user.")
		return
	}
	owner, err := s.store.AdminUser(r.Context(), body.OwnerID)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such user.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	org, err := s.store.CreateTeam(r.Context(), owner.ID, name)
	if err != nil {
		internalError(w, err)
		return
	}
	if err := s.store.SetOrgPlan(r.Context(), org.ID, body.Plan, "comp"); err != nil {
		internalError(w, err)
		return
	}
	s.record(r, "team.create", org.Name+" ("+org.Slug+")", noted(body.Plan+" for "+owner.Email, body.Note))
	o, err := s.store.AdminOrg(r.Context(), org.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, o)
}

// noted adds an admin's note to a log line.
func noted(detail, note string) string {
	note = strings.TrimSpace(note)
	if note == "" {
		return detail
	}
	if len([]rune(note)) > 200 {
		note = string([]rune(note)[:200])
	}
	return detail + "; " + note
}

// adminDeleteOrg permanently deletes a team workspace. The body must repeat
// the workspace's slug exactly, so a stray click or a scripted call can't
// delete the wrong one.
func (s *Server) adminDeleteOrg(w http.ResponseWriter, r *http.Request) {
	o, ok := s.adminOrgByPath(w, r)
	if !ok {
		return
	}
	var body struct {
		Confirm string `json:"confirm"`
	}
	if !decode(w, r, 1024, &body) {
		return
	}
	if o.Personal {
		writeError(w, http.StatusConflict, "personal", "Personal workspaces go with their account; they can't be deleted on their own.")
		return
	}
	if body.Confirm != o.Slug {
		writeError(w, http.StatusBadRequest, "confirm", "Type the workspace's address ("+o.Slug+") exactly to delete it.")
		return
	}
	d, err := s.store.DeleteOrg(r.Context(), o.ID)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such workspace.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	s.record(r, "team.delete", o.Name+" ("+o.Slug+")",
		fmt.Sprintf("%d diagrams, %d members, %d invites, %d images, %d tokens", d.Diagrams, d.Members, d.Invites, d.Images, d.Tokens))
	writeJSON(w, http.StatusOK, map[string]any{"deleted": d})
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

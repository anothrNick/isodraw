package httpapi

import (
	"fmt"
	"net/http"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/store"
)

// Plans: free personal workspaces hold store.FreeDiagrams diagrams; lifetime
// access lifts that and lets people own team workspaces of store.TeamEditors
// editors. Limits answer 402 with code "plan_limit" and a message that says
// what to do, which the app, the CLI and the MCP server show as is.

func planLimit(w http.ResponseWriter, msg string) {
	writeError(w, http.StatusPaymentRequired, "plan_limit", msg)
}

const readOnlyTeam = "This team is read-only because none of its owners has lifetime access any more. An owner with lifetime access can make it editable again."

func (s *Server) orgPlan(w http.ResponseWriter, r *http.Request) {
	org := r.PathValue("org")
	if _, ok := s.orgRole(w, r, org); !ok {
		return
	}
	p, err := s.store.OrgPlan(r.Context(), org)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, p)
}

// editable checks an organization's content may change under its plan, answering 402 when not.
func (s *Server) editable(w http.ResponseWriter, r *http.Request, orgID string) bool {
	p, err := s.store.OrgPlan(r.Context(), orgID)
	if err != nil {
		internalError(w, err)
		return false
	}
	if !p.Editable {
		planLimit(w, readOnlyTeam)
		return false
	}
	return true
}

// roomForDiagram checks one more diagram fits the organization's plan.
func (s *Server) roomForDiagram(w http.ResponseWriter, r *http.Request, orgID string) bool {
	p, err := s.store.OrgPlan(r.Context(), orgID)
	if err != nil {
		internalError(w, err)
		return false
	}
	switch {
	case !p.Editable:
		planLimit(w, readOnlyTeam)
		return false
	case p.DiagramLimit > 0 && p.Diagrams >= p.DiagramLimit:
		planLimit(w, fmt.Sprintf("The free plan holds %d diagrams in your personal workspace. Export one you're not using (Download, then JSON) and delete it to make room; you can import it again any time. A Pro workspace has no limit, and you can move diagrams into it.", p.DiagramLimit))
		return false
	}
	return true
}

// lifetimeWorkspace is the user's lifetime access and the workspace it's on,
// for /api/me and /api/billing: nil when they don't have it, an empty
// workspace while it's unused.
func (s *Server) lifetimeWorkspace(r *http.Request) (has bool, on *store.Org, err error) {
	has, orgID, err := s.store.LifetimeWorkspace(r.Context(), auth.User(r.Context()).ID)
	if err != nil || orgID == "" {
		return has, nil, err
	}
	o, err := s.store.GetOrg(r.Context(), orgID)
	if err != nil {
		return has, nil, err
	}
	return has, &o, nil
}

// seatFor checks a team has an editor seat for someone (by email or user id) who is to edit.
func (s *Server) seatFor(w http.ResponseWriter, r *http.Request, orgID, email, userID string) bool {
	p, err := s.store.OrgPlan(r.Context(), orgID)
	if err != nil {
		internalError(w, err)
		return false
	}
	if !p.Editable {
		planLimit(w, readOnlyTeam)
		return false
	}
	if p.EditorLimit == 0 {
		return true
	}
	used, err := s.store.EditorSeats(r.Context(), orgID, email, userID)
	if err != nil {
		internalError(w, err)
		return false
	}
	if used >= p.EditorLimit {
		planLimit(w, fmt.Sprintf("This team's %d editor seats are in use (members who can edit, plus open invites). Invite them as a viewer, or free a seat by making someone a viewer or revoking an invite.", p.EditorLimit))
		return false
	}
	return true
}

// roomForPerson checks a workspace with a people limit (Pro) has room for one more person, by email.
func (s *Server) roomForPerson(w http.ResponseWriter, r *http.Request, orgID, email string) bool {
	p, err := s.store.OrgPlan(r.Context(), orgID)
	if err != nil {
		internalError(w, err)
		return false
	}
	if p.PeopleLimit == 0 {
		return true
	}
	n, err := s.store.PeopleIn(r.Context(), orgID, email)
	if err != nil {
		internalError(w, err)
		return false
	}
	if n >= p.PeopleLimit {
		planLimit(w, fmt.Sprintf("This Pro workspace holds up to %d people, counting open invites. Revoke an invite or remove someone to make room; Team has no limit.", p.PeopleLimit))
		return false
	}
	return true
}

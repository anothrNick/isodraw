package httpapi

import (
	"errors"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/store"
)

// InviteTTL is how long an invite link works.
const InviteTTL = 7 * 24 * time.Hour

const maxOrgName = 80

func (s *Server) memberRoutes(api *http.ServeMux) {
	// Seeing the member list works with a token; changing teams, members and invites is for the app.
	api.HandleFunc("GET /api/orgs/{org}/members", s.listMembers)
	api.HandleFunc("GET /api/orgs/{org}/plan", s.orgPlan)
	for pattern, h := range map[string]http.HandlerFunc{
		"POST /api/orgs":                          s.createTeam,
		"PATCH /api/orgs/{org}":                   s.renameOrg,
		"PATCH /api/orgs/{org}/members/{user}":    s.changeRole,
		"DELETE /api/orgs/{org}/members/{user}":   s.removeMember,
		"POST /api/orgs/{org}/invites":            s.createInvite,
		"DELETE /api/orgs/{org}/invites/{invite}": s.revokeInvite,
		"GET /api/invites/{token}":                s.getInvite,
		"POST /api/invites/{token}/accept":        s.acceptInvite,
	} {
		api.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
			if browserOnly(w, r) {
				h(w, r)
			}
		})
	}
}

// managedOrg loads an organization the signed-in user can manage (owner or admin).
func (s *Server) managedOrg(w http.ResponseWriter, r *http.Request) (store.Org, bool) {
	role, ok := s.orgRole(w, r, r.PathValue("org"))
	if !ok {
		return store.Org{}, false
	}
	if !role.CanManage() {
		writeError(w, http.StatusForbidden, "forbidden", "Only owners and admins can manage this organization.")
		return store.Org{}, false
	}
	org, err := s.store.GetOrg(r.Context(), r.PathValue("org"))
	if err != nil {
		internalError(w, err)
		return org, false
	}
	org.Role = role
	return org, true
}

func cleanOrgName(name string) (string, string) {
	name = strings.TrimSpace(name)
	if name == "" {
		return "", "Give the team a name."
	}
	if len([]rune(name)) > maxOrgName {
		return "", "Keep the name under 80 characters."
	}
	return name, ""
}

func (s *Server) createTeam(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name string `json:"name"`
	}
	if !decode(w, r, 4096, &body) {
		return
	}
	name, msg := cleanOrgName(body.Name)
	if msg != "" {
		writeError(w, http.StatusBadRequest, "invalid_name", msg)
		return
	}
	if !s.mayOwnTeams(w, r) {
		return
	}
	org, err := s.store.CreateTeam(r.Context(), auth.User(r.Context()).ID, name)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, org)
}

func (s *Server) renameOrg(w http.ResponseWriter, r *http.Request) {
	org, ok := s.managedOrg(w, r)
	if !ok {
		return
	}
	var body struct {
		Name string `json:"name"`
	}
	if !decode(w, r, 4096, &body) {
		return
	}
	name, msg := cleanOrgName(body.Name)
	if msg != "" {
		writeError(w, http.StatusBadRequest, "invalid_name", msg)
		return
	}
	if err := s.store.RenameOrg(r.Context(), org.ID, name); err != nil {
		internalError(w, err)
		return
	}
	org.Name = name
	writeJSON(w, http.StatusOK, org)
}

// listMembers shows the members to anyone in the organization; pending invites only to those who manage it.
func (s *Server) listMembers(w http.ResponseWriter, r *http.Request) {
	role, ok := s.orgRole(w, r, r.PathValue("org"))
	if !ok {
		return
	}
	members, err := s.store.Members(r.Context(), r.PathValue("org"))
	if err != nil {
		internalError(w, err)
		return
	}
	invites := []store.Invite{}
	if role.CanManage() {
		if invites, err = s.store.PendingInvites(r.Context(), r.PathValue("org")); err != nil {
			internalError(w, err)
			return
		}
	}
	writeJSON(w, http.StatusOK, map[string]any{"members": members, "invites": invites})
}

// target loads the member a request is about, and checks the actor may change them:
// managers may change anyone below owner, and only owners may change owners.
func (s *Server) target(w http.ResponseWriter, r *http.Request, actor store.Role) (store.Role, bool) {
	userID := r.PathValue("user")
	if !isUUID(userID) {
		writeError(w, http.StatusNotFound, "not_found", "No such member.")
		return "", false
	}
	role, err := s.store.RoleIn(r.Context(), r.PathValue("org"), userID)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such member.")
		return "", false
	}
	if err != nil {
		internalError(w, err)
		return "", false
	}
	if role == store.Owner && actor != store.Owner {
		writeError(w, http.StatusForbidden, "forbidden", "Only an owner can change another owner.")
		return "", false
	}
	return role, true
}

// lastOwner answers 409 when the change would leave the organization without an owner.
func (s *Server) lastOwner(w http.ResponseWriter, r *http.Request, current store.Role) bool {
	if current != store.Owner {
		return false
	}
	n, err := s.store.Owners(r.Context(), r.PathValue("org"))
	if err != nil {
		internalError(w, err)
		return true
	}
	if n <= 1 {
		writeError(w, http.StatusConflict, "last_owner", "An organization needs an owner. Make someone else an owner first.")
		return true
	}
	return false
}

func (s *Server) changeRole(w http.ResponseWriter, r *http.Request) {
	org, ok := s.managedOrg(w, r)
	if !ok {
		return
	}
	var body struct {
		Role store.Role `json:"role"`
	}
	if !decode(w, r, 1024, &body) {
		return
	}
	if !body.Role.Valid() {
		writeError(w, http.StatusBadRequest, "invalid_role", "The role must be owner, admin, editor or viewer.")
		return
	}
	if body.Role == store.Owner && org.Role != store.Owner {
		writeError(w, http.StatusForbidden, "forbidden", "Only an owner can make someone an owner.")
		return
	}
	current, ok := s.target(w, r, org.Role)
	if !ok {
		return
	}
	if body.Role != store.Owner && s.lastOwner(w, r, current) {
		return
	}
	// Going from viewer to anything that edits takes a seat.
	if current == store.Viewer && body.Role != store.Viewer && !s.seatFor(w, r, org.ID, "", r.PathValue("user")) {
		return
	}
	if err := s.store.SetRole(r.Context(), org.ID, r.PathValue("user"), body.Role); err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// removeMember takes someone out of the organization. Anyone may remove themselves (leave).
func (s *Server) removeMember(w http.ResponseWriter, r *http.Request) {
	me := auth.User(r.Context()).ID
	self := r.PathValue("user") == me
	actor, ok := s.orgRole(w, r, r.PathValue("org"))
	if !ok {
		return
	}
	if !self && !actor.CanManage() {
		writeError(w, http.StatusForbidden, "forbidden", "Only owners and admins can remove members.")
		return
	}
	org, err := s.store.GetOrg(r.Context(), r.PathValue("org"))
	if err != nil {
		internalError(w, err)
		return
	}
	if org.Personal {
		writeError(w, http.StatusConflict, "personal", "You can't leave your personal workspace.")
		return
	}
	current, ok := s.target(w, r, actor)
	if !ok || s.lastOwner(w, r, current) {
		return
	}
	if err := s.store.RemoveMember(r.Context(), org.ID, r.PathValue("user")); err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) createInvite(w http.ResponseWriter, r *http.Request) {
	org, ok := s.managedOrg(w, r)
	if !ok {
		return
	}
	if org.Personal {
		writeError(w, http.StatusConflict, "personal", "Your personal workspace is just for you. Create a team to invite people.")
		return
	}
	var body struct {
		Email string     `json:"email"`
		Role  store.Role `json:"role"`
	}
	if !decode(w, r, 4096, &body) {
		return
	}
	addr, err := mail.ParseAddress(strings.TrimSpace(body.Email))
	if err != nil || addr.Name != "" {
		writeError(w, http.StatusBadRequest, "invalid_email", "Enter an email address, like name@example.com.")
		return
	}
	if body.Role == "" {
		body.Role = store.Editor
	}
	if !body.Role.Valid() {
		writeError(w, http.StatusBadRequest, "invalid_role", "The role must be owner, admin, editor or viewer.")
		return
	}
	if body.Role == store.Owner && org.Role != store.Owner {
		writeError(w, http.StatusForbidden, "forbidden", "Only an owner can invite another owner.")
		return
	}
	email := strings.ToLower(addr.Address)
	if body.Role != store.Viewer && !s.seatFor(w, r, org.ID, email, "") {
		return
	}
	inv, token, err := s.store.CreateInvite(r.Context(), org.ID, email, body.Role, auth.User(r.Context()).ID, InviteTTL)
	if err != nil {
		internalError(w, err)
		return
	}
	// No email is sent yet: the inviter shares this link themselves.
	writeJSON(w, http.StatusCreated, map[string]any{"invite": inv, "url": s.cfg.PublicURL + "/invite/" + token})
}

func (s *Server) revokeInvite(w http.ResponseWriter, r *http.Request) {
	org, ok := s.managedOrg(w, r)
	if !ok {
		return
	}
	if !isUUID(r.PathValue("invite")) {
		writeError(w, http.StatusNotFound, "not_found", "No such invite.")
		return
	}
	err := s.store.RevokeInvite(r.Context(), org.ID, r.PathValue("invite"))
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such invite.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// getInvite describes an invite to whoever holds the link, so they can decide to accept.
func (s *Server) getInvite(w http.ResponseWriter, r *http.Request) {
	d, err := s.store.InviteByToken(r.Context(), r.PathValue("token"))
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "This invite link isn't valid. It may have been revoked or replaced by a newer one.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, d)
}

func (s *Server) acceptInvite(w http.ResponseWriter, r *http.Request) {
	org, err := s.store.AcceptInvite(r.Context(), r.PathValue("token"), auth.User(r.Context()))
	var wrongEmail *store.InviteEmailError
	switch {
	case err == nil:
		writeJSON(w, http.StatusOK, org)
	case errors.Is(err, store.ErrNotFound):
		writeError(w, http.StatusNotFound, "not_found", "This invite link isn't valid. It may have been revoked or replaced by a newer one.")
	case errors.Is(err, store.ErrInviteUsed):
		writeError(w, http.StatusConflict, "invite_used", "This invite has already been used.")
	case errors.Is(err, store.ErrInviteExpired):
		writeError(w, http.StatusGone, "invite_expired", "This invite has expired. Ask for a new one.")
	case errors.As(err, &wrongEmail):
		writeError(w, http.StatusForbidden, "wrong_email", "This invite is for "+wrongEmail.Invited+". Sign in with that address to accept it.")
	default:
		internalError(w, err)
	}
}

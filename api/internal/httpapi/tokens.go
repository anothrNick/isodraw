package httpapi

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/store"
)

const maxTokenName = 100

func (s *Server) tokenRoutes(api *http.ServeMux) {
	api.HandleFunc("GET /api/tokens", s.listTokens)
	api.HandleFunc("POST /api/tokens", s.createToken)
	api.HandleFunc("DELETE /api/tokens/{id}", s.deleteToken)
	// A token revokes itself on logout; this is the one token route a token can use.
	api.HandleFunc("DELETE /api/tokens/current", s.deleteCurrentToken)
}

func (s *Server) listTokens(w http.ResponseWriter, r *http.Request) {
	if !browserOnly(w, r) {
		return
	}
	tokens, err := s.store.Tokens(r.Context(), auth.User(r.Context()).ID)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"tokens": tokens})
}

// createToken makes a token for the CLI, an agent or CI. Its secret is in the answer once.
func (s *Server) createToken(w http.ResponseWriter, r *http.Request) {
	if !browserOnly(w, r) {
		return
	}
	var body struct {
		Name          string      `json:"name"`
		OrgID         string      `json:"orgId"`
		Scope         store.Scope `json:"scope"`
		ExpiresInDays int         `json:"expiresInDays"`
	}
	if !decode(w, r, 4096, &body) {
		return
	}
	name := strings.TrimSpace(body.Name)
	if name == "" || len([]rune(name)) > maxTokenName {
		writeError(w, http.StatusBadRequest, "invalid_name", "Give the token a name under 100 characters, like “CLI on my laptop”.")
		return
	}
	if !body.Scope.Valid() {
		writeError(w, http.StatusBadRequest, "invalid_scope", "The scope must be read or write.")
		return
	}
	if body.ExpiresInDays < 0 || body.ExpiresInDays > 365 {
		writeError(w, http.StatusBadRequest, "invalid_expiry", "Tokens can last up to 365 days, or not expire (0).")
		return
	}
	role, ok := s.orgRole(w, r, body.OrgID)
	if !ok {
		return
	}
	if body.Scope == store.ScopeWrite && !role.CanEdit() {
		writeError(w, http.StatusForbidden, "forbidden", "Viewers can only create read-only tokens.")
		return
	}
	var expires *time.Time
	if body.ExpiresInDays > 0 {
		t := time.Now().Add(time.Duration(body.ExpiresInDays) * 24 * time.Hour)
		expires = &t
	}
	t, secret, err := s.store.CreateToken(r.Context(), auth.User(r.Context()).ID, body.OrgID, name, body.Scope, expires)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"token": t, "secret": secret})
}

func (s *Server) deleteToken(w http.ResponseWriter, r *http.Request) {
	if !browserOnly(w, r) {
		return
	}
	id := r.PathValue("id")
	if !isUUID(id) {
		writeError(w, http.StatusNotFound, "not_found", "No such token.")
		return
	}
	err := s.store.DeleteToken(r.Context(), auth.User(r.Context()).ID, id)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "No such token.")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) deleteCurrentToken(w http.ResponseWriter, r *http.Request) {
	t := auth.Token(r.Context())
	if t == nil {
		writeError(w, http.StatusBadRequest, "no_token", "This request wasn't made with an API token.")
		return
	}
	if err := s.store.DeleteToken(r.Context(), t.UserID, t.ID); err != nil && !errors.Is(err, store.ErrNotFound) {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

package store

import (
	"context"
	"time"
)

const (
	// FreeDiagrams is how many diagrams a free personal workspace holds.
	FreeDiagrams = 10
	// TeamEditors is how many members of a team workspace can edit (owners, admins and editors), open invites included.
	TeamEditors = 5
)

// Plan is what an organization may do, and how much of it is used.
type Plan struct {
	// Lifetime: an owner has lifetime access (for a personal workspace, its person).
	Lifetime bool `json:"lifetime"`
	// Grandfathered: a team from before plans, free and without a seat limit.
	Grandfathered bool `json:"grandfathered"`
	// Editable is false for a team whose owners no longer have lifetime access: it can be read, not changed.
	Editable bool `json:"editable"`
	// DiagramLimit and EditorLimit are 0 when there is none.
	DiagramLimit int `json:"diagramLimit"`
	EditorLimit  int `json:"editorLimit"`
	Diagrams     int `json:"diagrams"`
	// Editors counts members who can edit plus open invites to edit: the seats in use.
	Editors int `json:"editors"`
}

// OrgPlan works out an organization's plan and usage.
func (s *Store) OrgPlan(ctx context.Context, orgID string) (Plan, error) {
	var p Plan
	var personal bool
	err := s.db.QueryRow(ctx, `
		select o.personal, o.grandfathered,
		  exists (select 1 from memberships m join users u on u.id = m.user_id
		          where m.org_id = o.id and m.role = 'owner' and u.lifetime_since is not null),
		  (select count(*) from diagrams d where d.org_id = o.id and d.deleted_at is null),
		  (select count(*) from memberships m where m.org_id = o.id and m.role <> 'viewer') +
		  (select count(*) from invites i where i.org_id = o.id and i.accepted_at is null and i.expires_at > now() and i.role <> 'viewer')
		from orgs o where o.id = $1`, orgID,
	).Scan(&personal, &p.Grandfathered, &p.Lifetime, &p.Diagrams, &p.Editors)
	if err != nil {
		return p, notFound(err)
	}
	switch {
	case personal:
		p.Editable = true
		if !p.Lifetime {
			p.DiagramLimit = FreeDiagrams
		}
	case p.Grandfathered:
		p.Editable = true
	default:
		p.Editable = p.Lifetime
		p.EditorLimit = TeamEditors
	}
	return p, nil
}

// EditorSeats counts a team's seats in use (see Plan.Editors), leaving out one
// person, by email or user id: someone being re-invited or given a new role isn't a new seat.
func (s *Store) EditorSeats(ctx context.Context, orgID, exceptEmail, exceptUserID string) (int, error) {
	var n int
	err := s.db.QueryRow(ctx, `
		select
		  (select count(*) from memberships m join users u on u.id = m.user_id
		   where m.org_id = $1 and m.role <> 'viewer' and lower(u.email) <> lower($2) and m.user_id::text <> $3) +
		  (select count(*) from invites i
		   where i.org_id = $1 and i.accepted_at is null and i.expires_at > now() and i.role <> 'viewer' and lower(i.email) <> lower($2))`,
		orgID, exceptEmail, exceptUserID).Scan(&n)
	return n, err
}

// HasLifetime reports whether a user has lifetime access.
func (s *Store) HasLifetime(ctx context.Context, userID string) (bool, error) {
	var since *time.Time
	err := s.db.QueryRow(ctx, `select lifetime_since from users where id = $1`, userID).Scan(&since)
	return since != nil, notFound(err)
}

// SetLifetime grants (or, with on false, takes back) lifetime access by email,
// and reports how many accounts matched.
func (s *Store) SetLifetime(ctx context.Context, email string, on bool) (int64, error) {
	tag, err := s.db.Exec(ctx, `
		update users set lifetime_since = case when $2 then coalesce(lifetime_since, now()) end
		where lower(email) = lower($1)`, email, on)
	return tag.RowsAffected(), err
}

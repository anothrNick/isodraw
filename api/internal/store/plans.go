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
	// ProPeople is how many people a Pro workspace holds: every member, any role, and open invites.
	ProPeople = 4
)

// Plans a workspace can have of its own.
var Plans = map[string]bool{"pro": true, "team": true, "business": true}

// Plan is what an organization may do, and how much of it is used.
type Plan struct {
	// Lifetime: an owner has lifetime access (for a personal workspace, its person).
	Lifetime bool `json:"lifetime"`
	// Grandfathered: a team from before plans, free and without a seat limit.
	Grandfathered bool `json:"grandfathered"`
	// Editable is false for a team whose owners no longer have lifetime access: it can be read, not changed.
	Editable bool `json:"editable"`
	// Name is the workspace's own plan (pro, team, business) and Source how it
	// got it (comp: set by a platform admin); both empty when it has none and
	// follows its owners' lifetime access or grandfathering.
	Name   string `json:"plan"`
	Source string `json:"planSource"`
	// DiagramLimit, EditorLimit and PeopleLimit are 0 when there is none.
	DiagramLimit int `json:"diagramLimit"`
	EditorLimit  int `json:"editorLimit"`
	PeopleLimit  int `json:"peopleLimit"`
	Diagrams     int `json:"diagrams"`
	// Editors counts members who can edit plus open invites to edit: the seats in use.
	Editors int `json:"editors"`
	// People counts every member plus open invites.
	People int `json:"people"`
}

// OrgPlan works out an organization's plan and usage.
func (s *Store) OrgPlan(ctx context.Context, orgID string) (Plan, error) {
	var p Plan
	var personal bool
	err := s.db.QueryRow(ctx, `
		select o.personal, o.grandfathered, coalesce(o.plan, ''), coalesce(o.plan_source, ''),
		  exists (select 1 from memberships m join users u on u.id = m.user_id
		          where m.org_id = o.id and m.role = 'owner' and u.lifetime_since is not null),
		  (select count(*) from diagrams d where d.org_id = o.id and d.deleted_at is null),
		  (select count(*) from memberships m where m.org_id = o.id and m.role <> 'viewer') +
		  (select count(*) from invites i where i.org_id = o.id and i.accepted_at is null and i.expires_at > now() and i.role <> 'viewer'),
		  (select count(*) from memberships m where m.org_id = o.id) +
		  (select count(*) from invites i where i.org_id = o.id and i.accepted_at is null and i.expires_at > now())
		from orgs o where o.id = $1`, orgID,
	).Scan(&personal, &p.Grandfathered, &p.Name, &p.Source, &p.Lifetime, &p.Diagrams, &p.Editors, &p.People)
	if err != nil {
		return p, notFound(err)
	}
	switch {
	case personal:
		p.Editable = true
		if !p.Lifetime {
			p.DiagramLimit = FreeDiagrams
		}
	case p.Name != "":
		// Its own plan: editable, with Pro's people limit.
		p.Editable = true
		if p.Name == "pro" {
			p.PeopleLimit = ProPeople
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

// PeopleIn counts a workspace's people (see Plan.People), leaving out one email:
// re-inviting someone isn't a new person.
func (s *Store) PeopleIn(ctx context.Context, orgID, exceptEmail string) (int, error) {
	var n int
	err := s.db.QueryRow(ctx, `
		select
		  (select count(*) from memberships m join users u on u.id = m.user_id where m.org_id = $1 and lower(u.email) <> lower($2)) +
		  (select count(*) from invites i where i.org_id = $1 and i.accepted_at is null and i.expires_at > now() and lower(i.email) <> lower($2))`,
		orgID, exceptEmail).Scan(&n)
	return n, err
}

// SetOrgPlan gives a team workspace its own plan, or with plan "" takes it
// away so it follows its owners' lifetime access or grandfathering again.
func (s *Store) SetOrgPlan(ctx context.Context, orgID, plan, source string) error {
	tag, err := s.db.Exec(ctx, `update orgs set plan = nullif($2, ''), plan_source = case when $2 = '' then null else $3 end
		where id = $1 and not personal`, orgID, plan, source)
	if err == nil && tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return notFound(err)
}

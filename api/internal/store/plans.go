package store

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
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
		// Free and just you, whatever else someone has: more diagrams means a Pro workspace.
		p.Editable = true
		p.DiagramLimit = FreeDiagrams
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
// and reports how many accounts matched. Taking it back also takes the Pro
// plan off their lifetime workspace.
func (s *Store) SetLifetime(ctx context.Context, email string, on bool) (int64, error) {
	var n int64
	err := pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		tag, err := tx.Exec(ctx, `
			update users set lifetime_since = case when $2 then coalesce(lifetime_since, now()) end
			where lower(email) = lower($1)`, email, on)
		if err != nil {
			return err
		}
		n = tag.RowsAffected()
		if on {
			return nil
		}
		return dropLifetimeWorkspace(ctx, tx, `(select id from users where lower(email) = lower($1))`, email)
	})
	return n, err
}

// LifetimeWorkspace reports whether a user has lifetime access and, if they've
// used it, the workspace it's on (orgID is empty while it's unused).
func (s *Store) LifetimeWorkspace(ctx context.Context, userID string) (has bool, orgID string, err error) {
	err = s.db.QueryRow(ctx, `
		select u.lifetime_since is not null, coalesce((select o.id::text from orgs o where o.lifetime_of = u.id), '')
		from users u where u.id = $1`, userID).Scan(&has, &orgID)
	return has, orgID, notFound(err)
}

// ErrLifetimeUsed: the user's lifetime access is already on a workspace.
var ErrLifetimeUsed = errors.New("lifetime access is already on a workspace")

// CreateLifetimeWorkspace makes a team workspace owned by the user, on Pro
// from their lifetime access. It fails with ErrLifetimeUsed when they
// already have their lifetime workspace.
func (s *Store) CreateLifetimeWorkspace(ctx context.Context, userID, name string) (Org, error) {
	var org Org
	err := pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		// One at a time per person, so two at once can't both take it.
		if _, err := tx.Exec(ctx, `select 1 from users where id = $1 for update`, userID); err != nil {
			return err
		}
		var used bool
		if err := tx.QueryRow(ctx, `select exists (select 1 from orgs where lifetime_of = $1)`, userID).Scan(&used); err != nil {
			return err
		}
		if used {
			return ErrLifetimeUsed
		}
		id, err := createOrg(ctx, tx, name, slugify(name), false)
		if err != nil {
			return err
		}
		if _, err := tx.Exec(ctx, `insert into memberships (org_id, user_id, role) values ($1, $2, 'owner')`, id, userID); err != nil {
			return err
		}
		if _, err := tx.Exec(ctx, `update orgs set plan = 'pro', plan_source = 'lifetime', lifetime_of = $2 where id = $1`, id, userID); err != nil {
			return err
		}
		return tx.QueryRow(ctx, `select id, name, slug, personal from orgs where id = $1`, id).Scan(&org.ID, &org.Name, &org.Slug, &org.Personal)
	})
	org.Role = Owner
	return org, err
}

// dropLifetimeWorkspace takes the Pro plan off the lifetime workspace of the
// user that `who` (a subquery with one parameter) picks, when they no longer
// have lifetime access. The workspace then follows the old rules: read-only
// unless another owner has lifetime access. Nothing in it is deleted.
func dropLifetimeWorkspace(ctx context.Context, tx pgx.Tx, who string, arg any) error {
	_, err := tx.Exec(ctx, `
		update orgs set plan = null, plan_source = null, lifetime_of = null
		where lifetime_of = `+who+` and plan_source = 'lifetime'
		  and (select lifetime_since from users where id = orgs.lifetime_of) is null`, arg)
	return err
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

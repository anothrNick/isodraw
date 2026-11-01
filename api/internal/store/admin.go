package store

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
)

// Platform administration: every user and workspace, for the people who run IsoDraw.

// SetPlatformAdmin records whether a user is a platform admin.
func (s *Store) SetPlatformAdmin(ctx context.Context, userID string, on bool) error {
	_, err := s.db.Exec(ctx, `update users set platform_admin = $2 where id = $1`, userID, on)
	return err
}

// SetPlatformAdminByEmail is SetPlatformAdmin for the `isodraw admin` command, reporting how many accounts matched.
func (s *Store) SetPlatformAdminByEmail(ctx context.Context, email string, on bool) (int64, error) {
	tag, err := s.db.Exec(ctx, `update users set platform_admin = $2 where lower(email) = lower($1)`, email, on)
	return tag.RowsAffected(), err
}

func (s *Store) IsPlatformAdmin(ctx context.Context, userID string) (bool, error) {
	var on bool
	err := s.db.QueryRow(ctx, `select platform_admin from users where id = $1`, userID).Scan(&on)
	return on, notFound(err)
}

type AdminStats struct {
	Users         int   `json:"users"`
	UsersLastWeek int   `json:"usersLastWeek"`
	ActiveWeek    int   `json:"activeWeek"`
	Lifetime      int   `json:"lifetime"`
	Teams         int   `json:"teams"`
	Diagrams      int   `json:"diagrams"`
	Images        int   `json:"images"`
	ImageBytes    int64 `json:"imageBytes"`
}

func (s *Store) AdminStats(ctx context.Context) (AdminStats, error) {
	var a AdminStats
	err := s.db.QueryRow(ctx, `
		select
		  (select count(*) from users),
		  (select count(*) from users where created_at > now() - interval '7 days'),
		  (select count(*) from users where last_login_at > now() - interval '7 days'),
		  (select count(*) from users where lifetime_since is not null),
		  (select count(*) from orgs where not personal),
		  (select count(*) from diagrams where deleted_at is null),
		  (select count(*) from images where removed_at is null),
		  (select coalesce(sum(size), 0) from images)`,
	).Scan(&a.Users, &a.UsersLastWeek, &a.ActiveWeek, &a.Lifetime, &a.Teams, &a.Diagrams, &a.Images, &a.ImageBytes)
	return a, err
}

type AdminUser struct {
	ID            string     `json:"id"`
	Email         string     `json:"email"`
	Name          string     `json:"name"`
	CreatedAt     time.Time  `json:"createdAt"`
	LastLoginAt   *time.Time `json:"lastLoginAt"`
	LifetimeSince *time.Time `json:"lifetimeSince"`
	PlatformAdmin bool       `json:"platformAdmin"`
	Workspaces    int        `json:"workspaces"`
	Diagrams      int        `json:"diagrams"`
}

const adminUserCols = `u.id, u.email, u.name, u.created_at, u.last_login_at, u.lifetime_since, u.platform_admin,
	(select count(*) from memberships m where m.user_id = u.id),
	(select count(*) from diagrams d where d.created_by = u.id and d.deleted_at is null)`

func scanAdminUser(r pgx.Row) (AdminUser, error) {
	var u AdminUser
	err := r.Scan(&u.ID, &u.Email, &u.Name, &u.CreatedAt, &u.LastLoginAt, &u.LifetimeSince, &u.PlatformAdmin, &u.Workspaces, &u.Diagrams)
	return u, err
}

// AdminUsers lists users, newest first, matching q in their email or name.
func (s *Store) AdminUsers(ctx context.Context, q string, limit int) ([]AdminUser, error) {
	rows, err := s.db.Query(ctx, `select `+adminUserCols+` from users u
		where $1 = '' or u.email ilike '%' || $1 || '%' or u.name ilike '%' || $1 || '%'
		order by u.created_at desc limit $2`, q, limit)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (AdminUser, error) { return scanAdminUser(r) })
}

func (s *Store) AdminUser(ctx context.Context, id string) (AdminUser, error) {
	u, err := scanAdminUser(s.db.QueryRow(ctx, `select `+adminUserCols+` from users u where u.id = $1`, id))
	return u, notFound(err)
}

// UserWorkspaces lists the workspaces a user belongs to, with their role.
func (s *Store) UserWorkspaces(ctx context.Context, userID string) ([]AdminOrg, error) {
	rows, err := s.db.Query(ctx, `select `+adminOrgCols+`, m.role from memberships m join orgs o on o.id = m.org_id
		where m.user_id = $1 order by o.personal desc, o.name`, userID)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (AdminOrg, error) { return scanAdminOrg(r, true) })
}

// SetLifetimeByID grants or takes back a user's lifetime access.
func (s *Store) SetLifetimeByID(ctx context.Context, userID string, on bool) error {
	tag, err := s.db.Exec(ctx, `update users set lifetime_since = case when $2 then coalesce(lifetime_since, now()) end where id = $1`, userID, on)
	if err == nil && tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return notFound(err)
}

type AdminOrg struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Slug          string    `json:"slug"`
	Personal      bool      `json:"personal"`
	Grandfathered bool      `json:"grandfathered"`
	CreatedAt     time.Time `json:"createdAt"`
	Members       int       `json:"members"`
	Diagrams      int       `json:"diagrams"`
	// Owner is the first owner's email: the person, for a personal workspace.
	Owner string `json:"owner"`
	// Role is the user's role, when listed for one user.
	Role Role `json:"role,omitempty"`
}

const adminOrgCols = `o.id, o.name, o.slug, o.personal, o.grandfathered, o.created_at,
	(select count(*) from memberships m2 where m2.org_id = o.id),
	(select count(*) from diagrams d where d.org_id = o.id and d.deleted_at is null),
	coalesce((select u.email from memberships m2 join users u on u.id = m2.user_id
	          where m2.org_id = o.id and m2.role = 'owner' order by m2.created_at limit 1), '')`

func scanAdminOrg(r pgx.Row, withRole bool) (AdminOrg, error) {
	var o AdminOrg
	dest := []any{&o.ID, &o.Name, &o.Slug, &o.Personal, &o.Grandfathered, &o.CreatedAt, &o.Members, &o.Diagrams, &o.Owner}
	if withRole {
		dest = append(dest, &o.Role)
	}
	err := r.Scan(dest...)
	return o, err
}

// AdminOrgs lists workspaces, newest first, matching q in their name, slug or owner's email.
// kind is "team", "personal" or "" for both.
func (s *Store) AdminOrgs(ctx context.Context, q, kind string, limit int) ([]AdminOrg, error) {
	rows, err := s.db.Query(ctx, `select `+adminOrgCols+` from orgs o
		where ($2 = '' or ($2 = 'team') = not o.personal)
		  and ($1 = '' or o.name ilike '%' || $1 || '%' or o.slug ilike '%' || $1 || '%'
		       or exists (select 1 from memberships m join users u on u.id = m.user_id
		                  where m.org_id = o.id and m.role = 'owner' and u.email ilike '%' || $1 || '%'))
		order by o.created_at desc limit $3`, q, kind, limit)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (AdminOrg, error) { return scanAdminOrg(r, false) })
}

func (s *Store) AdminOrg(ctx context.Context, id string) (AdminOrg, error) {
	o, err := scanAdminOrg(s.db.QueryRow(ctx, `select `+adminOrgCols+` from orgs o where o.id = $1`, id), false)
	return o, notFound(err)
}

// SetGrandfathered changes whether a team is grandfathered (free, no seat limit).
func (s *Store) SetGrandfathered(ctx context.Context, orgID string, on bool) error {
	tag, err := s.db.Exec(ctx, `update orgs set grandfathered = $2 where id = $1 and not personal`, orgID, on)
	if err == nil && tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return notFound(err)
}

type AdminEvent struct {
	ID        string    `json:"id"`
	Admin     string    `json:"admin"`
	Action    string    `json:"action"`
	Target    string    `json:"target"`
	Detail    string    `json:"detail"`
	CreatedAt time.Time `json:"createdAt"`
}

// RecordAdminEvent keeps a line in the admin log.
func (s *Store) RecordAdminEvent(ctx context.Context, adminID, action, target, detail string) error {
	// An empty adminID is the system itself, like a Stripe webhook.
	_, err := s.db.Exec(ctx, `insert into admin_events (admin_id, action, target, detail) values (nullif($1, '')::uuid, $2, $3, $4)`, adminID, action, target, detail)
	return err
}

// AdminEvents lists the admin log, newest first.
func (s *Store) AdminEvents(ctx context.Context, limit int) ([]AdminEvent, error) {
	rows, err := s.db.Query(ctx, `select e.id, coalesce(u.email, ''), e.action, e.target, e.detail, e.created_at
		from admin_events e left join users u on u.id = e.admin_id order by e.created_at desc limit $1`, limit)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (AdminEvent, error) {
		var e AdminEvent
		err := r.Scan(&e.ID, &e.Admin, &e.Action, &e.Target, &e.Detail, &e.CreatedAt)
		return e, err
	})
}

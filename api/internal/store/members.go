package store

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
)

var (
	ErrInviteExpired = errors.New("invite expired")
	ErrInviteUsed    = errors.New("invite already used")
)

// InviteEmailError is returned when someone other than the invited address tries to accept.
type InviteEmailError struct{ Invited string }

func (e *InviteEmailError) Error() string { return "this invite is for " + e.Invited }

// rank orders roles from least to most access.
var rank = map[Role]int{Viewer: 1, Editor: 2, Admin: 3, Owner: 4}

// Valid reports whether r is one of the four roles.
func (r Role) Valid() bool { return rank[r] > 0 }

// CanManage reports whether the role may change members, invites and the organization's name.
func (r Role) CanManage() bool { return r == Owner || r == Admin }

// AtLeast reports whether r gives as much access as other.
func (r Role) AtLeast(other Role) bool { return rank[r] >= rank[other] }

// reserved slugs would clash with the app's own routes.
var reserved = map[string]bool{"api": true, "auth": true, "invite": true, "cli": true, "login": true, "signup": true, "verify": true, "forgot": true, "reset": true, "s": true, "d": true, "new": true, "settings": true, "admin": true, "assets": true, "healthz": true}

func slugify(name string) string {
	s := strings.Trim(nonSlug.ReplaceAllString(strings.ToLower(name), "-"), "-")
	if len(s) > 40 {
		s = strings.TrimRight(s[:40], "-")
	}
	if s == "" {
		s = "team"
	}
	if reserved[s] {
		s += "-team"
	}
	return s
}

// ---------- teams ----------

// CreateTeam creates an organization with the user as its owner.
func (s *Store) CreateTeam(ctx context.Context, userID, name string) (Org, error) {
	var org Org
	err := pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		id, err := createOrg(ctx, tx, name, slugify(name), false)
		if err != nil {
			return err
		}
		if _, err := tx.Exec(ctx, `insert into memberships (org_id, user_id, role) values ($1, $2, 'owner')`, id, userID); err != nil {
			return err
		}
		return tx.QueryRow(ctx, `select id, name, slug, personal from orgs where id = $1`, id).Scan(&org.ID, &org.Name, &org.Slug, &org.Personal)
	})
	org.Role = Owner
	return org, err
}

// GetOrg is an organization without the caller's role.
func (s *Store) GetOrg(ctx context.Context, orgID string) (Org, error) {
	var o Org
	err := s.db.QueryRow(ctx, `select id, name, slug, personal from orgs where id = $1`, orgID).Scan(&o.ID, &o.Name, &o.Slug, &o.Personal)
	return o, notFound(err)
}

// RenameOrg changes an organization's display name. The slug, and so its URLs, stay.
func (s *Store) RenameOrg(ctx context.Context, orgID, name string) error {
	_, err := s.db.Exec(ctx, `update orgs set name = $2 where id = $1`, orgID, name)
	return err
}

// ---------- members ----------

type Member struct {
	UserID   string    `json:"userId"`
	Email    string    `json:"email"`
	Name     string    `json:"name"`
	Role     Role      `json:"role"`
	JoinedAt time.Time `json:"joinedAt"`
}

// Members lists an organization's members, owners first.
func (s *Store) Members(ctx context.Context, orgID string) ([]Member, error) {
	rows, err := s.db.Query(ctx, `
		select u.id, u.email, u.name, m.role, m.created_at
		from memberships m join users u on u.id = m.user_id
		where m.org_id = $1
		order by case m.role when 'owner' then 0 when 'admin' then 1 when 'editor' then 2 else 3 end, lower(u.email)`, orgID)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (Member, error) {
		var m Member
		err := r.Scan(&m.UserID, &m.Email, &m.Name, &m.Role, &m.JoinedAt)
		return m, err
	})
}

// Owners counts an organization's owners, so the last one can't leave or be demoted.
func (s *Store) Owners(ctx context.Context, orgID string) (int, error) {
	var n int
	err := s.db.QueryRow(ctx, `select count(*) from memberships where org_id = $1 and role = 'owner'`, orgID).Scan(&n)
	return n, err
}

// SetRole changes a member's role, or returns ErrNotFound when they are not a member.
func (s *Store) SetRole(ctx context.Context, orgID, userID string, role Role) error {
	tag, err := s.db.Exec(ctx, `update memberships set role = $3 where org_id = $1 and user_id = $2`, orgID, userID, role)
	if err == nil && tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return err
}

func (s *Store) RemoveMember(ctx context.Context, orgID, userID string) error {
	tag, err := s.db.Exec(ctx, `delete from memberships where org_id = $1 and user_id = $2`, orgID, userID)
	if err == nil && tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return err
}

// ---------- invites ----------

type Invite struct {
	ID        string    `json:"id"`
	OrgID     string    `json:"orgId"`
	Email     string    `json:"email"`
	Role      Role      `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
}

// CreateInvite invites an address and returns the token for the link.
// An open invite for the same address is replaced, so the newest link is the one that works.
func (s *Store) CreateInvite(ctx context.Context, orgID, email string, role Role, invitedBy string, ttl time.Duration) (Invite, string, error) {
	b := make([]byte, 24)
	if _, err := rand.Read(b); err != nil {
		return Invite{}, "", err
	}
	token := base64.RawURLEncoding.EncodeToString(b)
	var inv Invite
	err := pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		if _, err := tx.Exec(ctx, `delete from invites where org_id = $1 and lower(email) = lower($2) and accepted_at is null`, orgID, email); err != nil {
			return err
		}
		return tx.QueryRow(ctx, `
			insert into invites (org_id, email, role, token_hash, invited_by, expires_at)
			values ($1, $2, $3, $4, $5, $6)
			returning id, org_id, email, role, created_at, expires_at`,
			orgID, email, role, hashToken(token), invitedBy, time.Now().Add(ttl),
		).Scan(&inv.ID, &inv.OrgID, &inv.Email, &inv.Role, &inv.CreatedAt, &inv.ExpiresAt)
	})
	return inv, token, err
}

// PendingInvites lists invites nobody has accepted yet, expired ones included so they can be resent.
func (s *Store) PendingInvites(ctx context.Context, orgID string) ([]Invite, error) {
	rows, err := s.db.Query(ctx, `
		select id, org_id, email, role, created_at, expires_at from invites
		where org_id = $1 and accepted_at is null order by created_at desc`, orgID)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (Invite, error) {
		var i Invite
		err := r.Scan(&i.ID, &i.OrgID, &i.Email, &i.Role, &i.CreatedAt, &i.ExpiresAt)
		return i, err
	})
}

func (s *Store) RevokeInvite(ctx context.Context, orgID, inviteID string) error {
	tag, err := s.db.Exec(ctx, `delete from invites where id = $1 and org_id = $2 and accepted_at is null`, inviteID, orgID)
	if err == nil && tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return notFound(err)
}

// InviteDetails is what the invite page shows before someone accepts.
type InviteDetails struct {
	Invite
	OrgName   string `json:"orgName"`
	OrgSlug   string `json:"orgSlug"`
	InvitedBy string `json:"invitedBy"`
	Accepted  bool   `json:"accepted"`
	Expired   bool   `json:"expired"`
}

func (s *Store) InviteByToken(ctx context.Context, token string) (InviteDetails, error) {
	var d InviteDetails
	err := s.db.QueryRow(ctx, `
		select i.id, i.org_id, i.email, i.role, i.created_at, i.expires_at, o.name, o.slug,
		       coalesce(nullif(u.name, ''), u.email, ''), i.accepted_at is not null, i.expires_at <= now()
		from invites i join orgs o on o.id = i.org_id left join users u on u.id = i.invited_by
		where i.token_hash = $1`, hashToken(token),
	).Scan(&d.ID, &d.OrgID, &d.Email, &d.Role, &d.CreatedAt, &d.ExpiresAt, &d.OrgName, &d.OrgSlug, &d.InvitedBy, &d.Accepted, &d.Expired)
	return d, notFound(err)
}

// AcceptInvite adds the user to the invite's organization. Someone already in
// it keeps their role unless the invite gives more access.
func (s *Store) AcceptInvite(ctx context.Context, token string, u User) (Org, error) {
	var org Org
	err := pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		var id, orgID, email string
		var role Role
		var accepted, expired bool
		err := tx.QueryRow(ctx, `
			select id, org_id, email, role, accepted_at is not null, expires_at <= now()
			from invites where token_hash = $1 for update`, hashToken(token),
		).Scan(&id, &orgID, &email, &role, &accepted, &expired)
		if err != nil {
			return notFound(err)
		}
		switch {
		case accepted:
			return ErrInviteUsed
		case expired:
			return ErrInviteExpired
		case !strings.EqualFold(strings.TrimSpace(email), strings.TrimSpace(u.Email)):
			return &InviteEmailError{Invited: email}
		}
		var current Role
		err = tx.QueryRow(ctx, `select role from memberships where org_id = $1 and user_id = $2`, orgID, u.ID).Scan(&current)
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			_, err = tx.Exec(ctx, `insert into memberships (org_id, user_id, role) values ($1, $2, $3)`, orgID, u.ID, role)
		case err == nil && !current.AtLeast(role):
			_, err = tx.Exec(ctx, `update memberships set role = $3 where org_id = $1 and user_id = $2`, orgID, u.ID, role)
		}
		if err != nil {
			return err
		}
		if _, err := tx.Exec(ctx, `update invites set accepted_at = now(), accepted_by = $2 where id = $1`, id, u.ID); err != nil {
			return err
		}
		return tx.QueryRow(ctx, `
			select o.id, o.name, o.slug, o.personal, m.role from orgs o join memberships m on m.org_id = o.id
			where o.id = $1 and m.user_id = $2`, orgID, u.ID).Scan(&org.ID, &org.Name, &org.Slug, &org.Personal, &org.Role)
	})
	return org, err
}

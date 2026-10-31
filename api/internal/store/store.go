// Package store is the data layer: users, organizations, sessions and diagrams.
package store

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrNotFound = errors.New("not found")

// ConflictError is returned when a save names a version that is no longer current.
type ConflictError struct{ Current Diagram }

func (e *ConflictError) Error() string {
	return fmt.Sprintf("diagram is at version %d", e.Current.Version)
}

type Store struct{ db *pgxpool.Pool }

func New(db *pgxpool.Pool) *Store { return &Store{db: db} }

// ---------- users ----------

type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

// UpsertUser records a sign-in: it creates the user the first time and refreshes their email and name after that.
func (s *Store) UpsertUser(ctx context.Context, issuer, subject, email, name string) (User, error) {
	var u User
	err := s.db.QueryRow(ctx, `
		insert into users (issuer, subject, email, name, last_login_at)
		values ($1, $2, $3, $4, now())
		on conflict (issuer, subject) do update
		  set email = excluded.email, name = excluded.name, last_login_at = now()
		returning id, email, name`,
		issuer, subject, email, name,
	).Scan(&u.ID, &u.Email, &u.Name)
	return u, err
}

// ---------- organizations ----------

type Role string

const (
	Owner  Role = "owner"
	Admin  Role = "admin"
	Editor Role = "editor"
	Viewer Role = "viewer"
)

// CanEdit reports whether the role may change diagrams.
func (r Role) CanEdit() bool { return r == Owner || r == Admin || r == Editor }

type Org struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Slug     string `json:"slug"`
	Personal bool   `json:"personal"`
	Role     Role   `json:"role"`
}

// EnsurePersonalOrg gives a user with no organization a personal one, so
// there is always somewhere to put a diagram.
func (s *Store) EnsurePersonalOrg(ctx context.Context, u User) error {
	return pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		var n int
		if err := tx.QueryRow(ctx, `select count(*) from memberships where user_id = $1`, u.ID).Scan(&n); err != nil {
			return err
		}
		if n > 0 {
			return nil
		}
		orgID, err := createOrg(ctx, tx, "Personal", slugBase(u.Email), true)
		if err != nil {
			return err
		}
		_, err = tx.Exec(ctx, `insert into memberships (org_id, user_id, role) values ($1, $2, 'owner')`, orgID, u.ID)
		return err
	})
}

// createOrg inserts an organization, adding -2, -3, … to the slug until it is free.
func createOrg(ctx context.Context, tx pgx.Tx, name, base string, personal bool) (string, error) {
	for i := 1; i <= 50; i++ {
		slug := base
		if i > 1 {
			slug = fmt.Sprintf("%s-%d", base, i)
		}
		var id string
		err := tx.QueryRow(ctx, `
			insert into orgs (name, slug, personal) values ($1, $2, $3)
			on conflict (slug) do nothing returning id`, name, slug, personal).Scan(&id)
		if errors.Is(err, pgx.ErrNoRows) {
			continue
		}
		return id, err
	}
	return "", errors.New("no free organization slug")
}

var nonSlug = regexp.MustCompile(`[^a-z0-9]+`)

// slugBase turns "Dev.Person@example.com" into "dev-person".
func slugBase(email string) string {
	local, _, _ := strings.Cut(strings.ToLower(email), "@")
	s := strings.Trim(nonSlug.ReplaceAllString(local, "-"), "-")
	if s == "" {
		return "user"
	}
	return s
}

// UserOrgs lists the organizations a user belongs to, personal one first.
func (s *Store) UserOrgs(ctx context.Context, userID string) ([]Org, error) {
	rows, err := s.db.Query(ctx, `
		select o.id, o.name, o.slug, o.personal, m.role
		from memberships m join orgs o on o.id = m.org_id
		where m.user_id = $1
		order by o.personal desc, o.name`, userID)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (Org, error) {
		var o Org
		err := r.Scan(&o.ID, &o.Name, &o.Slug, &o.Personal, &o.Role)
		return o, err
	})
}

// AddMember gives a user a role in an organization, or changes the role they have.
func (s *Store) AddMember(ctx context.Context, orgID, userID string, role Role) error {
	_, err := s.db.Exec(ctx, `
		insert into memberships (org_id, user_id, role) values ($1, $2, $3)
		on conflict (org_id, user_id) do update set role = excluded.role`, orgID, userID, role)
	return err
}

// RoleIn is the user's role in an organization, or ErrNotFound when they are not a member.
func (s *Store) RoleIn(ctx context.Context, orgID, userID string) (Role, error) {
	var r Role
	err := s.db.QueryRow(ctx, `select role from memberships where org_id = $1 and user_id = $2`, orgID, userID).Scan(&r)
	return r, notFound(err)
}

// ---------- sessions ----------

// CreateSession starts a session and returns the token for the cookie. Only its hash is stored.
func (s *Store) CreateSession(ctx context.Context, userID string, ttl time.Duration) (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	token := base64.RawURLEncoding.EncodeToString(b)
	_, err := s.db.Exec(ctx, `insert into sessions (token_hash, user_id, expires_at) values ($1, $2, $3)`,
		hashToken(token), userID, time.Now().Add(ttl))
	return token, err
}

// SessionUser is the signed-in user for a session token, or ErrNotFound when the session is unknown or expired.
func (s *Store) SessionUser(ctx context.Context, token string) (User, error) {
	var u User
	err := s.db.QueryRow(ctx, `
		select u.id, u.email, u.name
		from sessions s join users u on u.id = s.user_id
		where s.token_hash = $1 and s.expires_at > now()`, hashToken(token)).Scan(&u.ID, &u.Email, &u.Name)
	return u, notFound(err)
}

func (s *Store) DeleteSession(ctx context.Context, token string) error {
	_, err := s.db.Exec(ctx, `delete from sessions where token_hash = $1`, hashToken(token))
	return err
}

func hashToken(token string) []byte {
	h := sha256.Sum256([]byte(token))
	return h[:]
}

// ---------- diagrams ----------

type DiagramMeta struct {
	ID        string    `json:"id"`
	OrgID     string    `json:"orgId"`
	Title     string    `json:"title"`
	Version   int64     `json:"version"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Diagram struct {
	DiagramMeta
	Content json.RawMessage `json:"content"`
}

const metaCols = `id, org_id, title, version, created_at, updated_at`

func scanMeta(r pgx.Row, extra ...any) (DiagramMeta, error) {
	var m DiagramMeta
	err := r.Scan(append([]any{&m.ID, &m.OrgID, &m.Title, &m.Version, &m.CreatedAt, &m.UpdatedAt}, extra...)...)
	return m, err
}

// ListDiagrams lists an organization's diagrams, most recently changed first, without their content.
func (s *Store) ListDiagrams(ctx context.Context, orgID string) ([]DiagramMeta, error) {
	rows, err := s.db.Query(ctx, `select `+metaCols+` from diagrams
		where org_id = $1 and deleted_at is null order by updated_at desc`, orgID)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (DiagramMeta, error) { return scanMeta(r) })
}

func (s *Store) CreateDiagram(ctx context.Context, orgID, userID, title string, content json.RawMessage) (Diagram, error) {
	d := Diagram{}
	m, err := scanMeta(s.db.QueryRow(ctx, `
		insert into diagrams (org_id, title, content, created_by, updated_by)
		values ($1, $2, $3, $4, $4) returning `+metaCols+`, content`,
		orgID, title, content, userID), &d.Content)
	d.DiagramMeta = m
	return d, err
}

func (s *Store) GetDiagram(ctx context.Context, id string) (Diagram, error) {
	d := Diagram{}
	m, err := scanMeta(s.db.QueryRow(ctx, `select `+metaCols+`, content from diagrams
		where id = $1 and deleted_at is null`, id), &d.Content)
	d.DiagramMeta = m
	return d, notFound(err)
}

// SaveContent replaces a diagram's content if it is still at version `from`,
// and returns the new metadata. Otherwise it returns a *ConflictError holding the current diagram.
func (s *Store) SaveContent(ctx context.Context, id, userID string, from int64, content json.RawMessage) (DiagramMeta, error) {
	m, err := scanMeta(s.db.QueryRow(ctx, `
		update diagrams set content = $3, version = version + 1, updated_by = $4, updated_at = now()
		where id = $1 and version = $2 and deleted_at is null
		returning `+metaCols, id, from, content, userID))
	if !errors.Is(err, pgx.ErrNoRows) {
		return m, err
	}
	cur, err := s.GetDiagram(ctx, id)
	if err != nil {
		return DiagramMeta{}, err
	}
	return DiagramMeta{}, &ConflictError{Current: cur}
}

// Rename changes a diagram's title. Titles are not content, so the version stays.
func (s *Store) Rename(ctx context.Context, id, title string) (DiagramMeta, error) {
	m, err := scanMeta(s.db.QueryRow(ctx, `
		update diagrams set title = $2, updated_at = now() where id = $1 and deleted_at is null
		returning `+metaCols, id, title))
	return m, notFound(err)
}

// DeleteDiagram hides a diagram. The row stays so it can be restored.
func (s *Store) DeleteDiagram(ctx context.Context, id string) error {
	tag, err := s.db.Exec(ctx, `update diagrams set deleted_at = now() where id = $1 and deleted_at is null`, id)
	if err == nil && tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return err
}

// notFound maps "no rows" and malformed ids (which cannot match a row) to ErrNotFound.
func notFound(err error) error {
	var pgErr *pgconn.PgError
	if errors.Is(err, pgx.ErrNoRows) || (errors.As(err, &pgErr) && pgErr.Code == "22P02") {
		return ErrNotFound
	}
	return err
}

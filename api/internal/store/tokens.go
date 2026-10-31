package store

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"time"

	"github.com/jackc/pgx/v5"
)

// TokenPrefix starts every token secret, so secret scanners and people can recognize one.
const TokenPrefix = "isd_"

type Scope string

const (
	ScopeRead  Scope = "read"
	ScopeWrite Scope = "write"
)

func (s Scope) Valid() bool { return s == ScopeRead || s == ScopeWrite }

type Token struct {
	ID         string     `json:"id"`
	UserID     string     `json:"-"`
	OrgID      string     `json:"orgId"`
	OrgName    string     `json:"orgName,omitempty"`
	Name       string     `json:"name"`
	Scope      Scope      `json:"scope"`
	CreatedAt  time.Time  `json:"createdAt"`
	ExpiresAt  *time.Time `json:"expiresAt"`
	LastUsedAt *time.Time `json:"lastUsedAt"`
}

const tokenCols = `t.id, t.user_id, t.org_id, o.name, t.name, t.scope, t.created_at, t.expires_at, t.last_used_at`

func scanToken(r pgx.Row, extra ...any) (Token, error) {
	var t Token
	err := r.Scan(append([]any{&t.ID, &t.UserID, &t.OrgID, &t.OrgName, &t.Name, &t.Scope, &t.CreatedAt, &t.ExpiresAt, &t.LastUsedAt}, extra...)...)
	return t, err
}

// CreateToken makes a token and returns it with its secret, which is shown once and never stored.
func (s *Store) CreateToken(ctx context.Context, userID, orgID, name string, scope Scope, expiresAt *time.Time) (Token, string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return Token{}, "", err
	}
	secret := TokenPrefix + base64.RawURLEncoding.EncodeToString(b)
	t, err := scanToken(s.db.QueryRow(ctx, `
		with t as (
		  insert into api_tokens (user_id, org_id, name, scope, token_hash, expires_at)
		  values ($1, $2, $3, $4, $5, $6) returning *
		)
		select `+tokenCols+` from t join orgs o on o.id = t.org_id`,
		userID, orgID, name, scope, hashToken(secret), expiresAt))
	return t, secret, err
}

// TokenUser is the user and token behind a secret, or ErrNotFound when it is unknown or expired.
func (s *Store) TokenUser(ctx context.Context, secret string) (User, Token, error) {
	var u User
	t, err := scanToken(s.db.QueryRow(ctx, `
		select `+tokenCols+`, u.email, u.name
		from api_tokens t join orgs o on o.id = t.org_id join users u on u.id = t.user_id
		where t.token_hash = $1 and (t.expires_at is null or t.expires_at > now())`, hashToken(secret)), &u.Email, &u.Name)
	if err != nil {
		return u, t, notFound(err)
	}
	u.ID = t.UserID
	// Record use, at most once a minute, so the list can show stale tokens.
	if t.LastUsedAt == nil || time.Since(*t.LastUsedAt) > time.Minute {
		_, _ = s.db.Exec(ctx, `update api_tokens set last_used_at = now() where id = $1`, t.ID)
	}
	return u, t, nil
}

// Tokens lists a user's tokens, newest first.
func (s *Store) Tokens(ctx context.Context, userID string) ([]Token, error) {
	rows, err := s.db.Query(ctx, `select `+tokenCols+` from api_tokens t join orgs o on o.id = t.org_id
		where t.user_id = $1 order by t.created_at desc`, userID)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (Token, error) { return scanToken(r) })
}

// DeleteToken revokes one of the user's tokens.
func (s *Store) DeleteToken(ctx context.Context, userID, id string) error {
	tag, err := s.db.Exec(ctx, `delete from api_tokens where id = $1 and user_id = $2`, id, userID)
	if err == nil && tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return notFound(err)
}

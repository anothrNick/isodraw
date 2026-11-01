package store

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"time"
)

// OAuthClient is an AI app registered to connect to the MCP server.
type OAuthClient struct {
	ID           string    `json:"client_id"`
	Name         string    `json:"client_name"`
	RedirectURIs []string  `json:"redirect_uris"`
	CreatedAt    time.Time `json:"-"`
}

// OAuthGrant is what a person approved on the consent page, carried by a one-time code.
type OAuthGrant struct {
	ClientID      string
	UserID        string
	OrgID         string
	Scope         Scope
	ExpiresInDays int
	RedirectURI   string
	CodeChallenge string
}

func randomString(prefix string) (string, error) {
	b := make([]byte, 24)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return prefix + base64.RawURLEncoding.EncodeToString(b), nil
}

// CreateOAuthClient registers an app and gives it a client id.
func (s *Store) CreateOAuthClient(ctx context.Context, name string, redirectURIs []string) (OAuthClient, error) {
	id, err := randomString("mcp_")
	if err != nil {
		return OAuthClient{}, err
	}
	c := OAuthClient{ID: id, Name: name, RedirectURIs: redirectURIs}
	err = s.db.QueryRow(ctx, `insert into oauth_clients (id, name, redirect_uris) values ($1, $2, $3) returning created_at`,
		id, name, redirectURIs).Scan(&c.CreatedAt)
	return c, err
}

// OAuthClient is a registered app, or ErrNotFound.
func (s *Store) OAuthClient(ctx context.Context, id string) (OAuthClient, error) {
	c := OAuthClient{ID: id}
	err := s.db.QueryRow(ctx, `select name, redirect_uris, created_at from oauth_clients where id = $1`, id).
		Scan(&c.Name, &c.RedirectURIs, &c.CreatedAt)
	return c, notFound(err)
}

// CreateOAuthCode stores an approval and returns the one-time code for it, valid for ttl.
func (s *Store) CreateOAuthCode(ctx context.Context, g OAuthGrant, ttl time.Duration) (string, error) {
	code, err := randomString("")
	if err != nil {
		return "", err
	}
	_, err = s.db.Exec(ctx, `
		insert into oauth_codes (code_hash, client_id, user_id, org_id, scope, expires_in_days, redirect_uri, code_challenge, expires_at)
		values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		hashToken(code), g.ClientID, g.UserID, g.OrgID, g.Scope, g.ExpiresInDays, g.RedirectURI, g.CodeChallenge, time.Now().Add(ttl))
	return code, err
}

// TakeOAuthCode uses up a code: it is deleted whether or not it's still valid,
// so it can never be exchanged twice. ErrNotFound when unknown or expired.
func (s *Store) TakeOAuthCode(ctx context.Context, code string) (OAuthGrant, error) {
	var g OAuthGrant
	var expires time.Time
	err := s.db.QueryRow(ctx, `
		delete from oauth_codes where code_hash = $1
		returning client_id, user_id, org_id, scope, expires_in_days, redirect_uri, code_challenge, expires_at`, hashToken(code)).
		Scan(&g.ClientID, &g.UserID, &g.OrgID, &g.Scope, &g.ExpiresInDays, &g.RedirectURI, &g.CodeChallenge, &expires)
	if err != nil {
		return g, notFound(err)
	}
	if time.Now().After(expires) {
		return g, ErrNotFound
	}
	return g, nil
}

// DeleteExpiredOAuthCodes clears codes nobody exchanged.
func (s *Store) DeleteExpiredOAuthCodes(ctx context.Context) error {
	_, err := s.db.Exec(ctx, `delete from oauth_codes where expires_at < now()`)
	return err
}

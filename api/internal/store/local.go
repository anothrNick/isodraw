package store

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
)

// LocalAccount is an account for AUTH_MODE=local.
type LocalAccount struct {
	ID           string
	Email        string
	Name         string
	PasswordHash string
	Verified     bool
}

func (s *Store) LocalAccount(ctx context.Context, email string) (LocalAccount, error) {
	var a LocalAccount
	err := s.db.QueryRow(ctx, `select id, email, name, password_hash, verified_at is not null
		from local_accounts where lower(email) = lower($1)`, email).Scan(&a.ID, &a.Email, &a.Name, &a.PasswordHash, &a.Verified)
	return a, notFound(err)
}

// SaveLocalAccount creates an unverified account, or replaces the name and
// password of one that was never verified (someone signing up again).
func (s *Store) SaveLocalAccount(ctx context.Context, email, name, hash string) (LocalAccount, error) {
	a := LocalAccount{Email: email, Name: name, PasswordHash: hash}
	err := s.db.QueryRow(ctx, `
		insert into local_accounts (email, name, password_hash) values ($1, $2, $3)
		on conflict ((lower(email))) do update set name = excluded.name, password_hash = excluded.password_hash
		  where local_accounts.verified_at is null
		returning id`, email, name, hash).Scan(&a.ID)
	return a, notFound(err)
}

func (s *Store) SetLocalPassword(ctx context.Context, id, hash string, verify bool) error {
	_, err := s.db.Exec(ctx, `update local_accounts set password_hash = $2,
		verified_at = case when $3 then coalesce(verified_at, now()) else verified_at end where id = $1`, id, hash, verify)
	return err
}

func (s *Store) VerifyLocalAccount(ctx context.Context, id string) error {
	_, err := s.db.Exec(ctx, `update local_accounts set verified_at = coalesce(verified_at, now()) where id = $1`, id)
	return err
}

// SetLocalCode stores a fresh code for an account and purpose, replacing any earlier one.
func (s *Store) SetLocalCode(ctx context.Context, accountID, purpose, code string, ttl time.Duration) error {
	_, err := s.db.Exec(ctx, `
		insert into local_codes (account_id, purpose, code_hash, expires_at) values ($1, $2, $3, $4)
		on conflict (account_id, purpose) do update set code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0`,
		accountID, purpose, hashToken(code), time.Now().Add(ttl))
	return err
}

// CodeResult is what checking a code found.
type CodeResult int

const (
	CodeOK CodeResult = iota
	CodeWrong
	CodeExpired
	CodeLocked
)

// CheckLocalCode compares a code and uses it up on success. Five wrong tries lock it.
func (s *Store) CheckLocalCode(ctx context.Context, accountID, purpose, code string, maxAttempts int) (CodeResult, error) {
	var result CodeResult
	err := pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		var hash []byte
		var expires time.Time
		var attempts int
		err := tx.QueryRow(ctx, `select code_hash, expires_at, attempts from local_codes
			where account_id = $1 and purpose = $2 for update`, accountID, purpose).Scan(&hash, &expires, &attempts)
		if err == pgx.ErrNoRows {
			result = CodeExpired
			return nil
		}
		if err != nil {
			return err
		}
		switch {
		case attempts >= maxAttempts:
			result = CodeLocked
		case time.Now().After(expires):
			result = CodeExpired
		case string(hash) != string(hashToken(code)):
			result = CodeWrong
			_, err = tx.Exec(ctx, `update local_codes set attempts = attempts + 1 where account_id = $1 and purpose = $2`, accountID, purpose)
			return err
		default:
			result = CodeOK
			_, err = tx.Exec(ctx, `delete from local_codes where account_id = $1 and purpose = $2`, accountID, purpose)
			return err
		}
		return nil
	})
	return result, err
}

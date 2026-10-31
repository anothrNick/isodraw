package auth

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"log/slog"
	"math/big"
	"sync"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/anothrNick/isodraw/api/internal/store"
)

// LocalIssuer marks users whose accounts live in local_accounts.
const LocalIssuer = "local"

const (
	codeTTL      = 15 * time.Minute
	codeAttempts = 5
)

// local keeps accounts in Postgres. Codes aren't emailed: Deliver gets them,
// and by default writes them to the log, which suits development. A
// self-hoster would plug in email here.
type local struct {
	store   *store.Store
	Deliver func(email, purpose, code string)
}

func newLocal(s *store.Store) *local {
	return &local{store: s, Deliver: func(email, purpose, code string) {
		slog.Warn("sign-in code (AUTH_MODE=local: shown here instead of emailed)", "email", email, "purpose", purpose, "code", code)
	}}
}

// dummyHash is a real bcrypt hash to compare against when there's no account.
var dummyHash = sync.OnceValue(func() []byte {
	h, _ := bcrypt.GenerateFromPassword([]byte("no account has this password"), 12)
	return h
})

func sixDigits() string {
	n, _ := rand.Int(rand.Reader, big.NewInt(1_000_000))
	return fmt.Sprintf("%06d", n.Int64())
}

func (l *local) sendCode(ctx context.Context, a store.LocalAccount, purpose string) error {
	code := sixDigits()
	if err := l.store.SetLocalCode(ctx, a.ID, purpose, code, codeTTL); err != nil {
		return err
	}
	l.Deliver(a.Email, purpose, code)
	return nil
}

func (l *local) SignUp(ctx context.Context, email, password, name string) (string, error) {
	if err := checkPassword(password); err != nil {
		return "", err
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return "", err
	}
	a, err := l.store.SaveLocalAccount(ctx, email, name, string(hash))
	if errors.Is(err, store.ErrNotFound) {
		return "", ErrAccountExists // already verified
	}
	if err != nil {
		return "", err
	}
	a.Email = email
	return email, l.sendCode(ctx, a, "verify")
}

func (l *local) checkCode(ctx context.Context, email, purpose, code string) (store.LocalAccount, error) {
	a, err := l.store.LocalAccount(ctx, email)
	if errors.Is(err, store.ErrNotFound) {
		return a, ErrBadCode
	}
	if err != nil {
		return a, err
	}
	res, err := l.store.CheckLocalCode(ctx, a.ID, purpose, code, codeAttempts)
	if err != nil {
		return a, err
	}
	switch res {
	case store.CodeWrong:
		return a, ErrBadCode
	case store.CodeExpired:
		return a, ErrCodeExpired
	case store.CodeLocked:
		return a, ErrTooMany
	}
	return a, nil
}

func (l *local) Confirm(ctx context.Context, email, code string) error {
	a, err := l.checkCode(ctx, email, "verify", code)
	if err != nil {
		return err
	}
	return l.store.VerifyLocalAccount(ctx, a.ID)
}

func (l *local) Resend(ctx context.Context, email string) (string, error) {
	a, err := l.store.LocalAccount(ctx, email)
	if errors.Is(err, store.ErrNotFound) || (err == nil && a.Verified) {
		return email, nil // nothing to send, and nothing to reveal
	}
	if err != nil {
		return "", err
	}
	return email, l.sendCode(ctx, a, "verify")
}

func (l *local) SignIn(ctx context.Context, email, password string) (Identity, error) {
	a, err := l.store.LocalAccount(ctx, email)
	if errors.Is(err, store.ErrNotFound) {
		// Same work and answer as a wrong password, so accounts can't be probed by timing.
		_ = bcrypt.CompareHashAndPassword(dummyHash(), []byte(password))
		return Identity{}, ErrBadCredentials
	}
	if err != nil {
		return Identity{}, err
	}
	if bcrypt.CompareHashAndPassword([]byte(a.PasswordHash), []byte(password)) != nil {
		return Identity{}, ErrBadCredentials
	}
	if !a.Verified {
		return Identity{}, ErrNotConfirmed
	}
	return Identity{Issuer: LocalIssuer, Subject: a.ID, Email: a.Email, Name: a.Name}, nil
}

func (l *local) Forgot(ctx context.Context, email string) error {
	a, err := l.store.LocalAccount(ctx, email)
	if errors.Is(err, store.ErrNotFound) {
		return nil
	}
	if err != nil {
		return err
	}
	return l.sendCode(ctx, a, "reset")
}

func (l *local) Reset(ctx context.Context, email, code, password string) error {
	if err := checkPassword(password); err != nil {
		return err
	}
	a, err := l.checkCode(ctx, email, "reset", code)
	if err != nil {
		return err
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return err
	}
	// The code came by email, so resetting also proves the address.
	return l.store.SetLocalPassword(ctx, a.ID, string(hash), true)
}

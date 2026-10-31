package auth

import (
	"context"
	"errors"
)

// Identity is who a password sign-in proved someone to be. Issuer and
// Subject identify the account, exactly as an OIDC ID token would, so the
// same person is the same user whichever way they signed in.
type Identity struct {
	Issuer  string
	Subject string
	Email   string
	Name    string
}

// PasswordProvider runs IsoDraw's own sign-up, sign-in and password reset
// pages. Cognito keeps the accounts and sends the emails in production;
// the local provider keeps them in Postgres for development and simple
// self-hosting.
type PasswordProvider interface {
	// SignUp creates an unconfirmed account and sends a verification code.
	// It returns where the code went (possibly masked), for the page to show.
	SignUp(ctx context.Context, email, password, name string) (sentTo string, err error)
	Confirm(ctx context.Context, email, code string) error
	Resend(ctx context.Context, email string) (sentTo string, err error)
	SignIn(ctx context.Context, email, password string) (Identity, error)
	// Forgot sends a reset code if the account exists, and says nothing either way.
	Forgot(ctx context.Context, email string) error
	Reset(ctx context.Context, email, code, password string) error
}

var (
	ErrAccountExists  = errors.New("an account with this email already exists")
	ErrNotConfirmed   = errors.New("this email address hasn't been verified yet")
	ErrBadCredentials = errors.New("incorrect email or password")
	ErrBadCode        = errors.New("that code isn't right")
	ErrCodeExpired    = errors.New("that code has expired; ask for a new one")
	ErrTooMany        = errors.New("too many attempts; wait a few minutes and try again")
)

// InputError is a problem with what was entered, with a message for the person.
type InputError struct{ Msg string }

func (e *InputError) Error() string { return e.Msg }

// checkPassword is the rule both providers enforce, matching the Cognito pool's policy.
func checkPassword(p string) error {
	if len(p) < 10 {
		return &InputError{"Use at least 10 characters for the password."}
	}
	for _, r := range p {
		if r >= '0' && r <= '9' {
			return nil
		}
	}
	return &InputError{"Include at least one number in the password."}
}

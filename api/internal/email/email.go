// Package email sends IsoDraw's own emails (invites, welcome, and sign-in
// codes for local accounts) through Amazon SES, an SMTP server, or the log.
package email

import (
	"context"
	"fmt"
	"log/slog"
	"net/mail"
)

// Message is one email to one person, in plain text and HTML.
type Message struct {
	To      string
	Subject string
	Text    string
	HTML    string
}

// Sender delivers messages. From and Reply-To are the sender's own settings.
type Sender interface {
	Send(ctx context.Context, m Message) error
}

// Settings choose and configure the sender (config.Config fills them in).
type Settings struct {
	// Provider is ses, smtp or log.
	Provider string
	// From is the From header, like "IsoDraw <hello@isodraw.app>".
	From    string
	ReplyTo string
	// SES, with its own keys: AWS_* belongs to the image bucket.
	SESRegion          string
	SESAccessKeyID     string
	SESSecretAccessKey string
	SESConfigSet       string
	// SMTPURL is smtp://user:pass@host:587 (STARTTLS) or smtps://…:465 (TLS).
	SMTPURL string
}

// New returns the configured sender.
func New(ctx context.Context, s Settings) (Sender, error) {
	switch s.Provider {
	case "", "log":
		return Log{}, nil
	case "ses":
		return newSES(ctx, s)
	case "smtp":
		return newSMTP(s)
	}
	return nil, fmt.Errorf("EMAIL_PROVIDER must be ses, smtp or log, not %q", s.Provider)
}

// Delivers reports whether messages from s reach people (the log sender only writes them down).
func Delivers(s Sender) bool {
	_, isLog := s.(Log)
	return s != nil && !isLog
}

// Log writes messages to the log instead of sending them: development, and
// self-hosting before email is set up.
type Log struct{}

func (Log) Send(_ context.Context, m Message) error {
	slog.Warn("email (EMAIL_PROVIDER=log: written here instead of sent)", "to", m.To, "subject", m.Subject, "text", m.Text)
	return nil
}

// address checks a From or Reply-To setting and returns its bare address.
func address(name, v string) (*mail.Address, error) {
	a, err := mail.ParseAddress(v)
	if err != nil {
		return nil, fmt.Errorf("%s must be an address like \"IsoDraw <hello@example.com>\": %w", name, err)
	}
	return a, nil
}

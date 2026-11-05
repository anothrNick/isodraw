package email

import (
	"context"
	"strings"
	"testing"
)

func TestTemplates(t *testing.T) {
	m := Invite("alex@example.com", "Ada\r\nBcc: x@evil.test", "<b>Shop</b>", "editor", "https://isodraw.app/invite/abc", 7)
	if strings.ContainsAny(m.Subject, "\r\n") || m.Subject != "Ada  Bcc: x@evil.test invited you to <b>Shop</b> on IsoDraw" {
		t.Fatalf("subject: %q", m.Subject)
	}
	if strings.Contains(m.HTML, "<b>Shop</b>") || !strings.Contains(m.HTML, `href="https://isodraw.app/invite/abc"`) {
		t.Fatalf("html: %s", m.HTML)
	}
	if !strings.Contains(m.Text, "as an editor") || !strings.Contains(m.Text, "7 days, for alex@example.com") {
		t.Fatalf("text: %s", m.Text)
	}
	if w := Welcome("a@example.com", "", "https://isodraw.app", 10); w.Subject != "Welcome to IsoDraw" || !strings.Contains(w.Text, "10 diagrams") {
		t.Fatalf("welcome: %+v", w)
	}
	if c := Code("a@example.com", "reset", "123456", 15); !strings.Contains(c.Subject, "Reset") || !strings.Contains(c.Text, "123456") {
		t.Fatalf("code: %+v", c)
	}
}

func TestNew(t *testing.T) {
	ctx := context.Background()
	if s, err := New(ctx, Settings{}); err != nil || Delivers(s) {
		t.Fatalf("default is the log: %v %v", s, err)
	}
	for _, bad := range []Settings{
		{Provider: "postmark"},
		{Provider: "ses", From: "IsoDraw <hello@isodraw.app>"},
		{Provider: "ses", From: "not an address", SESAccessKeyID: "k", SESSecretAccessKey: "s"},
		{Provider: "smtp", From: "hello@example.com", SMTPURL: "http://mail.example.com"},
	} {
		if _, err := New(ctx, bad); err == nil {
			t.Errorf("%+v: no error", bad)
		}
	}
	s, err := New(ctx, Settings{Provider: "ses", From: "IsoDraw <hello@isodraw.app>", SESAccessKeyID: "k", SESSecretAccessKey: "s"})
	if err != nil || !Delivers(s) {
		t.Fatalf("ses: %v", err)
	}
}

func TestSMTPCompose(t *testing.T) {
	s, err := newSMTP(Settings{From: "IsoDraw <hello@example.com>", ReplyTo: "help@example.com", SMTPURL: "smtp://u:p@mail.example.com"})
	if err != nil {
		t.Fatal(err)
	}
	sm := s.(*smtpSender)
	if sm.addr != "mail.example.com:587" || sm.envelope != "hello@example.com" {
		t.Fatalf("parsed: %+v", sm)
	}
	raw := string(sm.compose(Message{To: "a@example.com", Subject: "Café", Text: "hi\nthere", HTML: "<p>hi</p>"}))
	for _, want := range []string{"From: IsoDraw <hello@example.com>\r\n", "Reply-To: help@example.com\r\n", "Subject: =?utf-8?q?Caf=C3=A9?=\r\n", "multipart/alternative", "text/plain", "text/html", "hi\r\nthere"} {
		if !strings.Contains(raw, want) {
			t.Errorf("missing %q in:\n%s", want, raw)
		}
	}
}

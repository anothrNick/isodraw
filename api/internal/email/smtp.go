package email

import (
	"bytes"
	"context"
	"crypto/rand"
	"crypto/tls"
	"encoding/hex"
	"errors"
	"fmt"
	"mime"
	"mime/quotedprintable"
	"net"
	"net/smtp"
	"net/url"
	"strings"
	"time"
)

// smtpSender sends through an SMTP server, for self-hosters with their own mail service.
type smtpSender struct {
	addr     string // host:port
	host     string
	implicit bool // smtps: TLS from the start, rather than STARTTLS
	auth     smtp.Auth
	from     string // the header
	envelope string // the bare address
	replyTo  string
}

func newSMTP(s Settings) (Sender, error) {
	u, err := url.Parse(s.SMTPURL)
	if err != nil || (u.Scheme != "smtp" && u.Scheme != "smtps") || u.Hostname() == "" {
		return nil, errors.New("EMAIL_PROVIDER=smtp needs SMTP_URL, like smtp://user:password@mail.example.com:587")
	}
	from, err := address("EMAIL_FROM", s.From)
	if err != nil {
		return nil, err
	}
	if s.ReplyTo != "" {
		if _, err := address("EMAIL_REPLY_TO", s.ReplyTo); err != nil {
			return nil, err
		}
	}
	port := u.Port()
	if port == "" {
		port = map[string]string{"smtp": "587", "smtps": "465"}[u.Scheme]
	}
	out := &smtpSender{addr: net.JoinHostPort(u.Hostname(), port), host: u.Hostname(), implicit: u.Scheme == "smtps", from: s.From, envelope: from.Address, replyTo: s.ReplyTo}
	if pass, ok := u.User.Password(); ok {
		out.auth = smtp.PlainAuth("", u.User.Username(), pass, u.Hostname())
	}
	return out, nil
}

func (s *smtpSender) Send(ctx context.Context, m Message) error {
	d := net.Dialer{Timeout: 15 * time.Second}
	var conn net.Conn
	var err error
	if s.implicit {
		conn, err = (&tls.Dialer{NetDialer: &d, Config: &tls.Config{ServerName: s.host}}).DialContext(ctx, "tcp", s.addr)
	} else {
		conn, err = d.DialContext(ctx, "tcp", s.addr)
	}
	if err != nil {
		return err
	}
	if dl, ok := ctx.Deadline(); ok {
		_ = conn.SetDeadline(dl)
	}
	c, err := smtp.NewClient(conn, s.host)
	if err != nil {
		conn.Close()
		return err
	}
	defer c.Close()
	if !s.implicit {
		// Credentials and mail only go over TLS.
		if ok, _ := c.Extension("STARTTLS"); !ok {
			return errors.New("the SMTP server doesn't offer STARTTLS")
		}
		if err := c.StartTLS(&tls.Config{ServerName: s.host}); err != nil {
			return err
		}
	}
	if s.auth != nil {
		if err := c.Auth(s.auth); err != nil {
			return err
		}
	}
	if err := c.Mail(s.envelope); err != nil {
		return err
	}
	if err := c.Rcpt(m.To); err != nil {
		return err
	}
	w, err := c.Data()
	if err != nil {
		return err
	}
	if _, err := w.Write(s.compose(m)); err != nil {
		return err
	}
	if err := w.Close(); err != nil {
		return err
	}
	return c.Quit()
}

// compose writes the message as multipart/alternative: plain text, then HTML.
func (s *smtpSender) compose(m Message) []byte {
	var b bytes.Buffer
	id := make([]byte, 12)
	_, _ = rand.Read(id)
	boundary := "isodraw-" + hex.EncodeToString(id)
	domain := s.envelope[strings.LastIndex(s.envelope, "@")+1:]
	header := func(k, v string) { fmt.Fprintf(&b, "%s: %s\r\n", k, v) }
	header("From", s.from)
	header("To", m.To)
	if s.replyTo != "" {
		header("Reply-To", s.replyTo)
	}
	header("Subject", mime.QEncoding.Encode("utf-8", m.Subject))
	header("Date", time.Now().Format(time.RFC1123Z))
	header("Message-ID", "<"+hex.EncodeToString(id)+"@"+domain+">")
	header("MIME-Version", "1.0")
	header("Content-Type", `multipart/alternative; boundary="`+boundary+`"`)
	for _, part := range []struct{ kind, body string }{{"text/plain", m.Text}, {"text/html", m.HTML}} {
		fmt.Fprintf(&b, "\r\n--%s\r\nContent-Type: %s; charset=utf-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n", boundary, part.kind)
		q := quotedprintable.NewWriter(&b)
		_, _ = q.Write([]byte(strings.ReplaceAll(part.body, "\n", "\r\n")))
		_ = q.Close()
	}
	fmt.Fprintf(&b, "\r\n--%s--\r\n", boundary)
	return b.Bytes()
}

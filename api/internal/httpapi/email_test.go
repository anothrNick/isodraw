package httpapi

import (
	"errors"
	"strings"
	"testing"
	"time"
)

func TestInviteIsEmailed(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	org, _ := f.team(owner, "Shop <Ops>")
	res, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/invites", body: `{"email":"Alex@Example.com","role":"admin"}`, cookie: owner})
	expect(t, res, 201, out)
	if out["emailed"] != true {
		t.Fatalf("emailed: %v", out)
	}
	sent := f.mail.messages()
	if len(sent) != 1 {
		t.Fatalf("sent %d emails", len(sent))
	}
	m := sent[0]
	link := out["url"].(string)
	if m.To != "alex@example.com" || !strings.Contains(m.Subject, "Shop <Ops>") || !strings.Contains(m.Text, link) || !strings.Contains(m.Text, "as an admin") {
		t.Fatalf("invite email: %+v", m)
	}
	// The workspace name is the team's own, so it's escaped in the HTML.
	if strings.Contains(m.HTML, "<Ops>") || !strings.Contains(m.HTML, "Shop &lt;Ops&gt;") {
		t.Fatalf("html not escaped: %s", m.HTML)
	}
}

func TestInviteWhenEmailFails(t *testing.T) {
	f := setup(t)
	owner, _ := f.user("owner@example.com")
	org, _ := f.team(owner, "Shop")
	f.mail.fail = errors.New("ses down")
	// The invite is still made, and the link comes back to share by hand.
	res, out := f.do(req{method: "POST", path: "/api/orgs/" + org + "/invites", body: `{"email":"alex@example.com"}`, cookie: owner})
	expect(t, res, 201, out)
	if out["emailed"] != false || out["url"] == "" {
		t.Fatalf("invite: %v", out)
	}
}

func TestWelcomeOnFirstSignInOnly(t *testing.T) {
	f, inbox := setupLocal(t)
	post := func(path, body string) {
		t.Helper()
		res, out := f.do(req{method: "POST", path: path, body: body, header: map[string]string{"Origin": appOrigin}})
		expect(t, res, 200, out)
	}
	post("/auth/signup", `{"email":"ada@example.com","password":"correct horse 1","name":"Ada"}`)
	post("/auth/verify", `{"email":"ada@example.com","code":"`+inbox.get("ada@example.com", "verify")+`"}`)
	post("/auth/signin", `{"email":"ada@example.com","password":"correct horse 1"}`)
	post("/auth/signin", `{"email":"ada@example.com","password":"correct horse 1"}`)

	// The welcome goes out in the background.
	deadline := time.Now().Add(5 * time.Second)
	for len(f.mail.messages()) == 0 && time.Now().Before(deadline) {
		time.Sleep(10 * time.Millisecond)
	}
	time.Sleep(50 * time.Millisecond)
	sent := f.mail.messages()
	if len(sent) != 1 || sent[0].To != "ada@example.com" || sent[0].Subject != "Welcome to IsoDraw, Ada" || !strings.Contains(sent[0].Text, appOrigin) {
		t.Fatalf("welcome: %+v", sent)
	}
}

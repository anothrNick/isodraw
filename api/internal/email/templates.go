package email

import (
	"fmt"
	"html"
	"strings"
)

// The emails IsoDraw sends, each in plain text and simple HTML. Names and
// workspace names come from people, so they're escaped in the HTML and kept
// to one line everywhere.

// Invite asks someone to join a workspace.
func Invite(to, inviter, workspace, role, link string, days int) Message {
	inviter, workspace = oneLine(inviter), oneLine(workspace)
	subject := fmt.Sprintf("%s invited you to %s on IsoDraw", inviter, workspace)
	lead := fmt.Sprintf("%s invited you to join %s on IsoDraw as %s.", inviter, workspace, article(role))
	note := fmt.Sprintf("The link works for %d days, for %s only. If you weren't expecting this, you can ignore it.", days, to)
	return Message{
		To:      to,
		Subject: subject,
		Text:    lead + "\n\nAccept the invite:\n" + link + "\n\n" + note + "\n",
		HTML:    page(subject, p(lead)+button(link, "Accept the invite")+small(note)),
	}
}

// Welcome greets someone after their first sign-in.
func Welcome(to, name, appURL string, diagrams int) Message {
	hi := "Welcome to IsoDraw"
	if name = oneLine(name); name != "" {
		hi = "Welcome to IsoDraw, " + name
	}
	lead := fmt.Sprintf("Your personal workspace is ready, with room for %d diagrams and every feature.", diagrams)
	steps := []string{
		"Start from an example, or open Terraform state or a plan to draw what you've deployed.",
		"Press Tidy to lay a diagram out and route its lines.",
		"Connect an AI app like Claude or ChatGPT (Connect MCP in the header) to have it read, draw and document diagrams for you.",
	}
	text := hi + ".\n\n" + lead + "\n\n"
	items := ""
	for _, s := range steps {
		text += "- " + s + "\n"
		items += `<li style="margin:0 0 6px">` + html.EscapeString(s) + "</li>"
	}
	text += "\nOpen IsoDraw: " + appURL + "\n\nQuestions or ideas? Just reply to this email.\n"
	body := p(lead) + `<ul style="margin:0 0 20px;padding-left:20px;color:#334155">` + items + "</ul>" +
		button(appURL, "Open IsoDraw") + small("Questions or ideas? Just reply to this email.")
	return Message{To: to, Subject: hi, Text: text, HTML: page(hi, body)}
}

// Code sends a sign-in code for a local account: purpose is verify or reset.
func Code(to, purpose, code string, minutes int) Message {
	subject, lead := "Your IsoDraw verification code", "Enter this code to confirm your email address:"
	if purpose == "reset" {
		subject, lead = "Reset your IsoDraw password", "Enter this code to choose a new password:"
	}
	note := fmt.Sprintf("It expires in %d minutes. If you didn't ask for it, you can ignore this email.", minutes)
	return Message{
		To:      to,
		Subject: subject,
		Text:    lead + "\n\n" + code + "\n\n" + note + "\n",
		HTML: page(subject, p(lead)+
			`<p style="margin:0 0 20px;font-size:28px;font-weight:600;letter-spacing:4px;color:#0f172a">`+html.EscapeString(code)+"</p>"+small(note)),
	}
}

func article(role string) string {
	if role != "" && strings.ContainsAny(role[:1], "aeiou") {
		return "an " + role
	}
	return "a " + role
}

// oneLine drops line breaks and other control characters.
func oneLine(s string) string {
	return strings.TrimSpace(strings.Map(func(r rune) rune {
		if r < 0x20 || r == 0x7f {
			return ' '
		}
		return r
	}, s))
}

func p(s string) string {
	return `<p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:#334155">` + html.EscapeString(s) + "</p>"
}

func small(s string) string {
	return `<p style="margin:20px 0 0;font-size:13px;line-height:1.5;color:#64748b">` + html.EscapeString(s) + "</p>"
}

func button(href, label string) string {
	return `<p style="margin:0"><a href="` + html.EscapeString(href) + `" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none">` + html.EscapeString(label) + "</a></p>"
}

func page(title, body string) string {
	return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>` + html.EscapeString(title) + `</title></head>` +
		`<body style="margin:0;padding:24px 12px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">` +
		`<div style="max-width:520px;margin:0 auto;padding:28px;border-radius:10px;background:#ffffff">` +
		`<p style="margin:0 0 20px;font-size:16px;font-weight:700;color:#0f172a">IsoDraw</p>` +
		`<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:#0f172a">` + html.EscapeString(title) + `</h1>` +
		body + `</div></body></html>`
}

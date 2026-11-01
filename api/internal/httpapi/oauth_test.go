package httpapi

import (
	"crypto/sha256"
	"encoding/base64"
	"net/http"
	"net/url"
	"strings"
	"testing"
)

const (
	clientRedirect = "https://claude.example/api/mcp/auth_callback"
	verifier       = "a-very-long-pkce-code-verifier-0123456789-abcdefghijklmnop"
)

func challengeFor(v string) string {
	sum := sha256.Sum256([]byte(v))
	return base64.RawURLEncoding.EncodeToString(sum[:])
}

var form = map[string]string{"Content-Type": "application/x-www-form-urlencoded"}

// register registers an MCP client the way an AI app does and returns its id.
func (f *fixture) register(redirect string) string {
	f.t.Helper()
	res, out := f.do(req{method: "POST", path: "/oauth/register", body: `{"client_name":"Claude","redirect_uris":["` + redirect + `"],"token_endpoint_auth_method":"none"}`})
	expect(f.t, res, 201, out)
	return out["client_id"].(string)
}

func TestOAuthDiscovery(t *testing.T) {
	f := setup(t)
	res, out := f.do(req{method: "GET", path: "/.well-known/oauth-protected-resource/mcp"})
	expect(t, res, 200, out)
	if out["resource"] != appOrigin+"/mcp" || out["authorization_servers"].([]any)[0] != appOrigin {
		t.Fatal(out)
	}
	if res.Header.Get("Access-Control-Allow-Origin") != "*" {
		t.Fatal("discovery needs CORS for browser clients")
	}
	res, out = f.do(req{method: "GET", path: "/.well-known/oauth-authorization-server"})
	expect(t, res, 200, out)
	if out["token_endpoint"] != appOrigin+"/oauth/token" || out["registration_endpoint"] != appOrigin+"/oauth/register" || out["code_challenge_methods_supported"].([]any)[0] != "S256" {
		t.Fatal(out)
	}
}

func TestOAuthRegistrationRules(t *testing.T) {
	f := setup(t)
	for _, bad := range []string{
		`{"client_name":"X","redirect_uris":[]}`,
		`{"client_name":"X","redirect_uris":["http://evil.example/cb"]}`,
		`{"client_name":"X","redirect_uris":["javascript:alert(1)"]}`,
		`{"client_name":"X","redirect_uris":["https://ok.example/cb#frag"]}`,
		`{"client_name":"X","redirect_uris":["https://ok.example/cb"],"token_endpoint_auth_method":"client_secret_basic"}`,
		`not json`,
	} {
		res, out := f.do(req{method: "POST", path: "/oauth/register", body: bad})
		if res.StatusCode != 400 || out["error"] == nil {
			t.Fatalf("%s: %d %v", bad, res.StatusCode, out)
		}
	}
	for _, ok := range []string{"http://localhost:6274/oauth/callback", "http://127.0.0.1:33418/cb", "cursor://anysphere.cursor-retrieval/oauth/callback"} {
		f.register(ok)
	}
}

func TestOAuthFlow(t *testing.T) {
	f := setup(t)
	c, org := f.user("ada@example.com")
	client := f.register(clientRedirect)
	challenge := challengeFor(verifier)

	// The app sends the person to authorize; it goes on to the consent page with the details.
	q := url.Values{"response_type": {"code"}, "client_id": {client}, "redirect_uri": {clientRedirect}, "code_challenge": {challenge},
		"code_challenge_method": {"S256"}, "state": {"xyz"}, "resource": {appOrigin + "/mcp"}}
	res, _ := f.do(req{method: "GET", path: "/oauth/authorize?" + q.Encode()})
	if res.StatusCode != 302 {
		t.Fatalf("authorize: %d", res.StatusCode)
	}
	loc, _ := url.Parse(res.Header.Get("Location"))
	if loc.Path != "/connect" || loc.Query().Get("client_id") != client || loc.Query().Get("state") != "xyz" || loc.Query().Get("code_challenge") != challenge {
		t.Fatalf("consent page: %s", loc)
	}

	// The consent page learns who's asking.
	res, out := f.do(req{method: "GET", path: "/api/oauth/request?client_id=" + client + "&redirect_uri=" + url.QueryEscape(clientRedirect), cookie: c})
	expect(t, res, 200, out)
	if out["clientName"] != "Claude" || out["redirectHost"] != "claude.example" {
		t.Fatal(out)
	}

	// The person approves write access to their workspace for 30 days.
	approve := `{"clientId":"` + client + `","redirectUri":"` + clientRedirect + `","codeChallenge":"` + challenge + `","state":"xyz","orgId":"` + org + `","scope":"write","expiresInDays":30}`
	res, out = f.do(req{method: "POST", path: "/api/oauth/approve", body: approve, cookie: c})
	expect(t, res, 200, out)
	back, _ := url.Parse(out["redirect"].(string))
	code := back.Query().Get("code")
	if !strings.HasPrefix(out["redirect"].(string), clientRedirect+"?") || back.Query().Get("state") != "xyz" || code == "" {
		t.Fatalf("redirect: %v", out)
	}

	exchange := func(v url.Values) (int, map[string]any) {
		res, out := f.do(req{method: "POST", path: "/oauth/token", body: v.Encode(), header: form})
		return res.StatusCode, out
	}
	good := url.Values{"grant_type": {"authorization_code"}, "code": {code}, "redirect_uri": {clientRedirect}, "client_id": {client}, "code_verifier": {verifier}}

	// A wrong verifier fails, and uses up the code.
	wrong := url.Values{}
	for k, v := range good {
		wrong[k] = v
	}
	wrong.Set("code_verifier", "x"+verifier[1:])
	if status, out := exchange(wrong); status != 400 || out["error"] != "invalid_grant" {
		t.Fatalf("wrong verifier: %d %v", status, out)
	}
	if status, out := exchange(good); status != 400 || out["error"] != "invalid_grant" {
		t.Fatalf("a code works once: %d %v", status, out)
	}

	// Again, properly this time.
	res, out = f.do(req{method: "POST", path: "/api/oauth/approve", body: approve, cookie: c})
	expect(t, res, 200, out)
	back, _ = url.Parse(out["redirect"].(string))
	good.Set("code", back.Query().Get("code"))
	status, tok := exchange(good)
	if status != 200 || tok["token_type"] != "Bearer" || tok["scope"] != "write" || !strings.HasPrefix(tok["access_token"].(string), "isd_") {
		t.Fatalf("token: %d %v", status, tok)
	}
	if e := tok["expires_in"].(float64); e < 29*86400 || e > 30*86400 {
		t.Fatalf("expires_in %v", e)
	}

	// The token is an ordinary API token in the chosen workspace, named after the app.
	secret := tok["access_token"].(string)
	res, out = f.do(req{method: "GET", path: "/api/me", header: bearer(secret)})
	expect(t, res, 200, out)
	if out["token"].(map[string]any)["orgId"] != org || !strings.HasPrefix(out["token"].(map[string]any)["name"].(string), "Claude (connected ") {
		t.Fatal(out)
	}
	res, out = f.do(req{method: "GET", path: "/api/tokens", cookie: c})
	expect(t, res, 200, out)
	if len(out["tokens"].([]any)) != 1 {
		t.Fatal("the connection shows on the Tokens page")
	}
}

func TestOAuthGuards(t *testing.T) {
	f := setup(t)
	c, org := f.user("ada@example.com")
	client := f.register(clientRedirect)
	challenge := challengeFor(verifier)

	// Authorize with an unregistered redirect is refused here, never redirected.
	q := url.Values{"response_type": {"code"}, "client_id": {client}, "redirect_uri": {"https://evil.example/cb"}, "code_challenge": {challenge}, "code_challenge_method": {"S256"}}
	if res, _ := f.do(req{method: "GET", path: "/oauth/authorize?" + q.Encode()}); res.StatusCode != 400 {
		t.Fatalf("unregistered redirect: %d", res.StatusCode)
	}
	// Without PKCE, the app gets an error back.
	q.Set("redirect_uri", clientRedirect)
	q.Del("code_challenge")
	res, _ := f.do(req{method: "GET", path: "/oauth/authorize?" + q.Encode()})
	if loc, _ := url.Parse(res.Header.Get("Location")); res.StatusCode != 302 || loc.Query().Get("error") != "invalid_request" {
		t.Fatalf("no PKCE: %d %s", res.StatusCode, res.Header.Get("Location"))
	}
	// Another resource than /mcp is refused.
	q.Set("code_challenge", challenge)
	q.Set("resource", "https://elsewhere.example/mcp")
	res, _ = f.do(req{method: "GET", path: "/oauth/authorize?" + q.Encode()})
	if loc, _ := url.Parse(res.Header.Get("Location")); loc.Query().Get("error") != "invalid_target" {
		t.Fatalf("resource: %s", res.Header.Get("Location"))
	}

	approve := func(cookie *http.Cookie, orgID, scope string, header map[string]string) (int, map[string]any) {
		body := `{"clientId":"` + client + `","redirectUri":"` + clientRedirect + `","codeChallenge":"` + challenge + `","state":"s","orgId":"` + orgID + `","scope":"` + scope + `","expiresInDays":0}`
		res, out := f.do(req{method: "POST", path: "/api/oauth/approve", body: body, cookie: cookie, header: header})
		return res.StatusCode, out
	}
	// Approving needs a session in the browser: not an API token, not someone else's workspace.
	if status, _ := approve(nil, org, "read", nil); status != 401 {
		t.Fatalf("no session: %d", status)
	}
	tok := f.token(c, org, "write")
	if status, _ := approve(nil, org, "read", bearer(tok)); status != 403 {
		t.Fatalf("with a token: %d", status)
	}
	_, otherOrg := f.user("eve@example.com")
	if status, _ := approve(c, otherOrg, "read", nil); status != 404 {
		t.Fatalf("another workspace: %d", status)
	}
	// Approving from another site is refused.
	if status, _ := approve(c, org, "read", map[string]string{"Origin": "https://evil.example"}); status != 403 {
		t.Fatalf("cross-site: %d", status)
	}
	// Declining sends the app an error.
	res, out := f.do(req{method: "POST", path: "/api/oauth/deny", body: `{"clientId":"` + client + `","redirectUri":"` + clientRedirect + `","state":"s"}`, cookie: c})
	expect(t, res, 200, out)
	if loc, _ := url.Parse(out["redirect"].(string)); loc.Query().Get("error") != "access_denied" || loc.Query().Get("state") != "s" {
		t.Fatal(out)
	}
	// Unknown codes and grant types.
	v := url.Values{"grant_type": {"authorization_code"}, "code": {"nope"}, "redirect_uri": {clientRedirect}, "client_id": {client}, "code_verifier": {verifier}}
	res, out = f.do(req{method: "POST", path: "/oauth/token", body: v.Encode(), header: form})
	if res.StatusCode != 400 || out["error"] != "invalid_grant" {
		t.Fatal(out)
	}
	v.Set("grant_type", "client_credentials")
	res, out = f.do(req{method: "POST", path: "/oauth/token", body: v.Encode(), header: form})
	if res.StatusCode != 400 || out["error"] != "unsupported_grant_type" {
		t.Fatal(out)
	}
}

package auth

import (
	"context"
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	jose "github.com/go-jose/go-jose/v4"
)

const testIssuer = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_test"

// fakeCognito answers like Cognito's user pool API, recording what it was sent.
type fakeCognito struct {
	t       *testing.T
	key     *rsa.PrivateKey
	calls   []map[string]any
	targets []string
	answer  func(target string, body map[string]any) (int, any)
}

func (f *fakeCognito) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("Content-Type") != "application/x-amz-json-1.1" {
		f.t.Errorf("content type %q", r.Header.Get("Content-Type"))
	}
	target := r.Header.Get("X-Amz-Target")
	var body map[string]any
	data, _ := io.ReadAll(r.Body)
	_ = json.Unmarshal(data, &body)
	f.calls = append(f.calls, body)
	f.targets = append(f.targets, target)
	status, out := f.answer(target, body)
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(out)
}

func (f *fakeCognito) idToken(sub, email, name string) string {
	signer, err := jose.NewSigner(jose.SigningKey{Algorithm: jose.RS256, Key: f.key}, (&jose.SignerOptions{}).WithType("JWT"))
	if err != nil {
		f.t.Fatal(err)
	}
	claims, _ := json.Marshal(map[string]any{
		"iss": testIssuer, "sub": sub, "aud": "client-1", "email": email, "name": name,
		"iat": time.Now().Unix(), "exp": time.Now().Add(time.Hour).Unix(),
	})
	jws, err := signer.Sign(claims)
	if err != nil {
		f.t.Fatal(err)
	}
	s, _ := jws.CompactSerialize()
	return s
}

func newFake(t *testing.T) (*fakeCognito, *cognito) {
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatal(err)
	}
	f := &fakeCognito{t: t, key: key}
	srv := httptest.NewServer(f)
	t.Cleanup(srv.Close)
	verifier := oidc.NewVerifier(testIssuer, &oidc.StaticKeySet{PublicKeys: []crypto.PublicKey{&key.PublicKey}}, &oidc.Config{ClientID: "client-1"})
	c, err := newCognito(testIssuer, "client-1", "shh", func(ctx context.Context, raw string) (*oidc.IDToken, error) {
		return verifier.Verify(ctx, raw)
	})
	if err != nil {
		t.Fatal(err)
	}
	c.endpoint = srv.URL + "/"
	return f, c
}

func TestCognitoEndpointFromIssuer(t *testing.T) {
	c, err := newCognito("https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_abc", "id", "s", nil)
	if err != nil || c.endpoint != "https://cognito-idp.eu-west-1.amazonaws.com/" {
		t.Fatalf("%v %v", c, err)
	}
	if _, err := newCognito("http://localhost:5556/dex", "id", "s", nil); err == nil {
		t.Fatal("a non-Cognito issuer is refused")
	}
}

func TestCognitoSignUpSendsSecretHashAndAttributes(t *testing.T) {
	f, c := newFake(t)
	f.answer = func(string, map[string]any) (int, any) {
		return 200, map[string]any{"CodeDeliveryDetails": map[string]string{"Destination": "a***@e***"}}
	}
	sentTo, err := c.SignUp(context.Background(), "ada@example.com", "correct horse 1", "Ada")
	if err != nil || sentTo != "a***@e***" {
		t.Fatalf("%q %v", sentTo, err)
	}
	if f.targets[0] != "AWSCognitoIdentityProviderService.SignUp" {
		t.Fatal(f.targets[0])
	}
	body := f.calls[0]
	if body["SecretHash"] != c.secretHash("ada@example.com") || body["Username"] != "ada@example.com" || body["ClientId"] != "client-1" {
		t.Fatalf("body: %v", body)
	}
	if attrs := body["UserAttributes"].([]any); len(attrs) != 2 {
		t.Fatalf("attributes: %v", attrs)
	}
	// The password rule is checked before calling Cognito.
	if _, err := c.SignUp(context.Background(), "ada@example.com", "short", ""); err == nil || len(f.calls) != 1 {
		t.Fatal("weak passwords never reach Cognito")
	}
}

func TestCognitoSignInVerifiesTheIDToken(t *testing.T) {
	f, c := newFake(t)
	f.answer = func(target string, body map[string]any) (int, any) {
		params := body["AuthParameters"].(map[string]any)
		if body["AuthFlow"] != "USER_PASSWORD_AUTH" || params["SECRET_HASH"] == "" {
			t.Errorf("auth body %v", body)
		}
		if params["PASSWORD"] != "right password 1" {
			return 400, map[string]string{"__type": "NotAuthorizedException", "message": "Incorrect username or password."}
		}
		return 200, map[string]any{"AuthenticationResult": map[string]string{"IdToken": f.idToken("sub-123", "ada@example.com", "Ada")}}
	}
	id, err := c.SignIn(context.Background(), "ada@example.com", "right password 1")
	if err != nil {
		t.Fatal(err)
	}
	if id != (Identity{Issuer: testIssuer, Subject: "sub-123", Email: "ada@example.com", Name: "Ada"}) {
		t.Fatalf("%+v", id)
	}
	if _, err := c.SignIn(context.Background(), "ada@example.com", "wrong password 1"); !errors.Is(err, ErrBadCredentials) {
		t.Fatal(err)
	}

	// A token not signed by the pool is rejected.
	other, _ := rsa.GenerateKey(rand.Reader, 2048)
	f.key = other
	f.answer = func(string, map[string]any) (int, any) {
		return 200, map[string]any{"AuthenticationResult": map[string]string{"IdToken": f.idToken("sub-123", "ada@example.com", "Ada")}}
	}
	if _, err := c.SignIn(context.Background(), "ada@example.com", "right password 1"); err == nil {
		t.Fatal("a forged token must not sign anyone in")
	}
}

func TestCognitoErrorMapping(t *testing.T) {
	for typ, want := range map[string]error{
		"UsernameExistsException":   ErrAccountExists,
		"UserNotConfirmedException": ErrNotConfirmed,
		"CodeMismatchException":     ErrBadCode,
		"ExpiredCodeException":      ErrCodeExpired,
		"LimitExceededException":    ErrTooMany,
		"UserNotFoundException":     ErrBadCredentials,
	} {
		if got := mapCognitoError("X", cognitoError{Type: typ}); !errors.Is(got, want) {
			t.Errorf("%s: %v", typ, got)
		}
	}
	if got := mapCognitoError("X", cognitoError{Type: "NotAuthorizedException", Message: "Password attempts exceeded"}); !errors.Is(got, ErrTooMany) {
		t.Error(got)
	}
	for _, e := range []cognitoError{
		{Type: "NotAuthorizedException", Message: "Unable to verify secret hash for client 1234"},
		{Type: "InvalidParameterException", Message: "USER_PASSWORD_AUTH flow not enabled for this client"},
	} {
		if got := mapCognitoError("X", e); got == nil || errors.Is(got, ErrBadCredentials) || errors.As(got, new(*InputError)) {
			t.Errorf("a misconfigured client is a server error, not the user's: %v", got)
		}
	}
	var input *InputError
	if got := mapCognitoError("X", cognitoError{Type: "InvalidPasswordException", Message: "Password does not conform to policy: Password not long enough"}); !errors.As(got, &input) || input.Msg != "Password not long enough" {
		t.Error(got)
	}
}

func TestCognitoForgotDoesNotRevealAccounts(t *testing.T) {
	f, c := newFake(t)
	f.answer = func(string, map[string]any) (int, any) {
		return 400, map[string]string{"__type": "UserNotFoundException", "message": "Username/client id combination not found."}
	}
	if err := c.Forgot(context.Background(), "nobody@example.com"); err != nil {
		t.Fatal(err)
	}
}

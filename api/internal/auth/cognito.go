package auth

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
)

// cognito runs password sign-in through Cognito's user pool APIs. These
// calls are unauthenticated (the app client's secret proves who's asking),
// so the API needs no AWS credentials. Accounts, verification and reset
// emails stay in Cognito.
type cognito struct {
	endpoint string
	clientID string
	secret   string
	http     *http.Client
	// verify checks the ID token a sign-in returns, as the OIDC flow would.
	verify func(ctx context.Context, raw string) (*oidc.IDToken, error)
}

// newCognito derives the API endpoint from the pool's issuer
// (https://cognito-idp.<region>.amazonaws.com/<pool>).
func newCognito(issuer, clientID, secret string, verify func(context.Context, string) (*oidc.IDToken, error)) (*cognito, error) {
	u, err := url.Parse(issuer)
	if err != nil || !strings.HasPrefix(u.Host, "cognito-idp.") {
		return nil, fmt.Errorf("AUTH_MODE=cognito needs OIDC_ISSUER to be a Cognito pool, like https://cognito-idp.us-east-1.amazonaws.com/us-east-1_abc; got %q", issuer)
	}
	return &cognito{
		endpoint: u.Scheme + "://" + u.Host + "/",
		clientID: clientID,
		secret:   secret,
		http:     &http.Client{Timeout: 15 * time.Second},
		verify:   verify,
	}, nil
}

// secretHash proves the request comes from this app client.
func (c *cognito) secretHash(username string) string {
	m := hmac.New(sha256.New, []byte(c.secret))
	m.Write([]byte(username + c.clientID))
	return base64.StdEncoding.EncodeToString(m.Sum(nil))
}

type cognitoError struct {
	Type    string `json:"__type"`
	Message string `json:"message"`
}

func (c *cognito) call(ctx context.Context, action string, in, out any) error {
	body, _ := json.Marshal(in)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.endpoint, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/x-amz-json-1.1")
	req.Header.Set("X-Amz-Target", "AWSCognitoIdentityProviderService."+action)
	res, err := c.http.Do(req)
	if err != nil {
		return fmt.Errorf("cognito %s: %w", action, err)
	}
	defer res.Body.Close()
	data, _ := io.ReadAll(io.LimitReader(res.Body, 1<<20))
	if res.StatusCode != http.StatusOK {
		var e cognitoError
		_ = json.Unmarshal(data, &e)
		return mapCognitoError(action, e)
	}
	if out != nil {
		return json.Unmarshal(data, out)
	}
	return nil
}

// mapCognitoError turns Cognito's errors into the provider's, so pages show
// the same messages whichever provider runs.
func mapCognitoError(action string, e cognitoError) error {
	t := e.Type[strings.LastIndex(e.Type, "#")+1:]
	msg := strings.ToLower(e.Message)
	// The app client's settings are wrong (secret, enabled flows): a server
	// problem, not the person's password.
	misconfigured := strings.Contains(msg, "secret hash") || strings.Contains(msg, "flow not enabled") || strings.Contains(msg, "client")
	switch {
	case misconfigured && (t == "NotAuthorizedException" || t == "InvalidParameterException"):
		t = "misconfigured"
	}
	switch t {
	case "UsernameExistsException", "AliasExistsException":
		return ErrAccountExists
	case "UserNotConfirmedException":
		return ErrNotConfirmed
	case "NotAuthorizedException":
		if strings.Contains(msg, "attempts exceeded") {
			return ErrTooMany
		}
		return ErrBadCredentials
	case "UserNotFoundException":
		return ErrBadCredentials
	case "CodeMismatchException":
		return ErrBadCode
	case "ExpiredCodeException":
		return ErrCodeExpired
	case "LimitExceededException", "TooManyRequestsException", "TooManyFailedAttemptsException":
		return ErrTooMany
	case "InvalidPasswordException", "InvalidParameterException":
		return &InputError{Msg: strings.TrimPrefix(e.Message, "Password does not conform to policy: ")}
	}
	slog.Error("cognito call failed", "action", action, "type", e.Type, "message", e.Message)
	return fmt.Errorf("cognito %s: %s", action, t)
}

type deliveryOut struct {
	CodeDeliveryDetails struct {
		Destination string `json:"Destination"`
	} `json:"CodeDeliveryDetails"`
}

func (c *cognito) SignUp(ctx context.Context, email, password, name string) (string, error) {
	if err := checkPassword(password); err != nil {
		return "", err
	}
	attrs := []map[string]string{{"Name": "email", "Value": email}}
	if name != "" {
		attrs = append(attrs, map[string]string{"Name": "name", "Value": name})
	}
	var out deliveryOut
	err := c.call(ctx, "SignUp", map[string]any{
		"ClientId": c.clientID, "SecretHash": c.secretHash(email),
		"Username": email, "Password": password, "UserAttributes": attrs,
	}, &out)
	return out.CodeDeliveryDetails.Destination, err
}

func (c *cognito) Confirm(ctx context.Context, email, code string) error {
	return c.call(ctx, "ConfirmSignUp", map[string]any{
		"ClientId": c.clientID, "SecretHash": c.secretHash(email), "Username": email, "ConfirmationCode": code,
	}, nil)
}

func (c *cognito) Resend(ctx context.Context, email string) (string, error) {
	var out deliveryOut
	err := c.call(ctx, "ResendConfirmationCode", map[string]any{
		"ClientId": c.clientID, "SecretHash": c.secretHash(email), "Username": email,
	}, &out)
	return out.CodeDeliveryDetails.Destination, err
}

func (c *cognito) SignIn(ctx context.Context, email, password string) (Identity, error) {
	var out struct {
		ChallengeName        string `json:"ChallengeName"`
		AuthenticationResult struct {
			IDToken string `json:"IdToken"`
		} `json:"AuthenticationResult"`
	}
	err := c.call(ctx, "InitiateAuth", map[string]any{
		"AuthFlow": "USER_PASSWORD_AUTH",
		"ClientId": c.clientID,
		"AuthParameters": map[string]string{
			"USERNAME": email, "PASSWORD": password, "SECRET_HASH": c.secretHash(email),
		},
	}, &out)
	if err != nil {
		return Identity{}, err
	}
	if out.ChallengeName != "" || out.AuthenticationResult.IDToken == "" {
		// MFA or a forced password change: not offered by IsoDraw's pool.
		slog.Error("cognito sign-in needs a challenge IsoDraw doesn't handle", "challenge", out.ChallengeName)
		return Identity{}, errors.New("this account needs a sign-in step IsoDraw doesn't support")
	}
	idt, err := c.verify(ctx, out.AuthenticationResult.IDToken)
	if err != nil {
		return Identity{}, fmt.Errorf("verify cognito id token: %w", err)
	}
	var claims struct {
		Email  string   `json:"email"`
		Name   string   `json:"name"`
		Groups []string `json:"cognito:groups"`
	}
	_ = idt.Claims(&claims)
	return Identity{Issuer: idt.Issuer, Subject: idt.Subject, Email: claims.Email, Name: claims.Name, Groups: nonNil(claims.Groups)}, nil
}

func (c *cognito) Forgot(ctx context.Context, email string) error {
	err := c.call(ctx, "ForgotPassword", map[string]any{
		"ClientId": c.clientID, "SecretHash": c.secretHash(email), "Username": email,
	}, nil)
	// Don't reveal whether an account exists.
	if errors.Is(err, ErrBadCredentials) {
		return nil
	}
	return err
}

func (c *cognito) Reset(ctx context.Context, email, code, password string) error {
	if err := checkPassword(password); err != nil {
		return err
	}
	return c.call(ctx, "ConfirmForgotPassword", map[string]any{
		"ClientId": c.clientID, "SecretHash": c.secretHash(email), "Username": email,
		"ConfirmationCode": code, "Password": password,
	}, nil)
}

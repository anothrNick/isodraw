// Package config reads the server's settings from the environment.
package config

import (
	"errors"
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	// Addr is where the server listens, e.g. ":8080".
	Addr string
	// DatabaseURL is a Postgres connection string.
	DatabaseURL string
	// PublicURL is where browsers reach the app. Login redirects back to
	// PublicURL + "/auth/callback", and changing requests must come from this origin.
	PublicURL string
	// AuthMode is how people sign in:
	//   oidc     redirect to an OIDC provider's own pages (Dex, Okta, a self-hoster's IdP)
	//   cognito  IsoDraw's own pages, with accounts and emails in Cognito (OIDC_* name the pool's app client)
	//   local    IsoDraw's own pages, with accounts in Postgres and codes in the log (development, simple self-hosting)
	AuthMode string
	// OIDC provider: Cognito in production, Dex locally, or a self-hoster's own.
	OIDCIssuer       string
	OIDCClientID     string
	OIDCClientSecret string
	OIDCScopes       []string
	// SessionSecret signs the short-lived login cookie.
	SessionSecret string
	SessionTTL    time.Duration
	// WebDir, when set, is a built web app to serve for every path outside /api and /auth.
	WebDir string
	// BucketName, when set, is the S3-compatible bucket (Tigris on Fly) for uploaded images,
	// reached with the usual AWS_* variables. Without it, images are files under ImageDir.
	BucketName string
	ImageDir   string
	// AdminGroup is the identity provider group whose members are platform admins (Cognito: a user pool group).
	AdminGroup string
	// Stripe, for buying lifetime access. Without a key there's nothing to buy (admins can still grant it).
	StripeSecretKey     string
	StripeWebhookSecret string
	// StripeAPI is Stripe's address (tests point it at a fake).
	StripeAPI string
	// StripeAutomaticTax has Stripe Tax add sales tax or VAT at checkout (set it up in the dashboard first).
	StripeAutomaticTax bool
	// The founding lifetime offer: price in the currency's smallest unit, and how many seats there are.
	LifetimePrice    int
	LifetimeCurrency string
	LifetimeSeats    int
}

// FromEnv reads the configuration, reporting every missing or invalid setting at once.
func FromEnv() (Config, error) {
	c := Config{
		Addr:             env("ADDR", ":8080"),
		AuthMode:         env("AUTH_MODE", "oidc"),
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		PublicURL:        strings.TrimRight(os.Getenv("PUBLIC_URL"), "/"),
		OIDCIssuer:       os.Getenv("OIDC_ISSUER"),
		OIDCClientID:     os.Getenv("OIDC_CLIENT_ID"),
		OIDCClientSecret: os.Getenv("OIDC_CLIENT_SECRET"),
		OIDCScopes:       strings.Fields(env("OIDC_SCOPES", "openid email profile")),
		SessionSecret:    os.Getenv("SESSION_SECRET"),
		WebDir:           os.Getenv("WEB_DIR"),
		BucketName:       os.Getenv("BUCKET_NAME"),
		ImageDir:         env("IMAGE_DIR", ".data/images"),
		AdminGroup:       env("ADMIN_GROUP", "admins"),

		StripeSecretKey:     os.Getenv("STRIPE_SECRET_KEY"),
		StripeWebhookSecret: os.Getenv("STRIPE_WEBHOOK_SECRET"),
		StripeAPI:           env("STRIPE_API", "https://api.stripe.com"),
		StripeAutomaticTax:  os.Getenv("STRIPE_AUTOMATIC_TAX") == "true",
		LifetimeCurrency:    env("LIFETIME_CURRENCY", "usd"),
	}
	var errs []error
	for name, p := range map[string]*int{"LIFETIME_PRICE": &c.LifetimePrice, "LIFETIME_SEATS": &c.LifetimeSeats} {
		def := map[string]string{"LIFETIME_PRICE": "9900", "LIFETIME_SEATS": "100"}[name]
		n, err := strconv.Atoi(env(name, def))
		if err != nil || n <= 0 {
			errs = append(errs, fmt.Errorf("%s must be a positive whole number", name))
		}
		*p = n
	}
	if c.StripeSecretKey != "" && c.StripeWebhookSecret == "" {
		errs = append(errs, errors.New("STRIPE_WEBHOOK_SECRET is required with STRIPE_SECRET_KEY, or payments would never be recorded"))
	}
	ttl, err := time.ParseDuration(env("SESSION_TTL", "720h"))
	if err != nil {
		errs = append(errs, fmt.Errorf("SESSION_TTL: %w", err))
	}
	c.SessionTTL = ttl
	required := map[string]string{"DATABASE_URL": c.DatabaseURL, "PUBLIC_URL": c.PublicURL}
	switch c.AuthMode {
	case "oidc":
		required["OIDC_ISSUER"], required["OIDC_CLIENT_ID"] = c.OIDCIssuer, c.OIDCClientID
	case "cognito":
		required["OIDC_ISSUER"], required["OIDC_CLIENT_ID"], required["OIDC_CLIENT_SECRET"] = c.OIDCIssuer, c.OIDCClientID, c.OIDCClientSecret
	case "local":
	default:
		errs = append(errs, fmt.Errorf("AUTH_MODE must be oidc, cognito or local, not %q", c.AuthMode))
	}
	for name, v := range required {
		if v == "" {
			errs = append(errs, fmt.Errorf("%s is required", name))
		}
	}
	if u, err := url.Parse(c.PublicURL); c.PublicURL != "" && (err != nil || u.Scheme == "" || u.Host == "") {
		errs = append(errs, errors.New("PUBLIC_URL must be an absolute URL, like http://localhost:5190"))
	}
	if len(c.SessionSecret) < 16 {
		errs = append(errs, errors.New("SESSION_SECRET must be at least 16 characters"))
	}
	return c, errors.Join(errs...)
}

// Secure reports whether the app is served over HTTPS, so cookies get the Secure flag.
func (c Config) Secure() bool { return strings.HasPrefix(c.PublicURL, "https://") }

func env(name, fallback string) string {
	if v := os.Getenv(name); v != "" {
		return v
	}
	return fallback
}

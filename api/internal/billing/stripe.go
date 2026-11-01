// Package billing talks to Stripe: it starts Checkout sessions and checks
// that webhook events really come from Stripe. It uses Stripe's HTTP API
// directly; IsoDraw needs two calls, not the whole SDK.
package billing

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

// Stripe is a client for one Stripe account.
type Stripe struct {
	Key string
	// API is Stripe's address; tests point it at a fake.
	API  string
	HTTP *http.Client
}

func New(key string) *Stripe {
	return &Stripe{Key: key, API: "https://api.stripe.com", HTTP: &http.Client{Timeout: 20 * time.Second}}
}

// CheckoutRequest is a one-time payment for one item.
type CheckoutRequest struct {
	Name        string
	AmountCents int
	Currency    string
	Email       string
	Reference   string // our purchase id, echoed back in events
	SuccessURL  string
	CancelURL   string
	ExpiresAt   time.Time
	// AutomaticTax has Stripe Tax add sales tax or VAT (it must be set up in the Stripe dashboard).
	AutomaticTax bool
}

type CheckoutSession struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

// Error is an error answer from Stripe.
type Error struct {
	Status  int
	Message string
}

func (e *Error) Error() string { return fmt.Sprintf("stripe: %d %s", e.Status, e.Message) }

func (s *Stripe) CreateCheckout(ctx context.Context, r CheckoutRequest) (CheckoutSession, error) {
	f := url.Values{
		"mode":                                          {"payment"},
		"line_items[0][quantity]":                       {"1"},
		"line_items[0][price_data][currency]":           {r.Currency},
		"line_items[0][price_data][unit_amount]":        {strconv.Itoa(r.AmountCents)},
		"line_items[0][price_data][product_data][name]": {r.Name},
		"customer_email":                                {r.Email},
		"client_reference_id":                           {r.Reference},
		"metadata[purchase_id]":                         {r.Reference},
		"payment_intent_data[metadata][purchase_id]":    {r.Reference},
		"success_url":                                   {r.SuccessURL},
		"cancel_url":                                    {r.CancelURL},
		"expires_at":                                    {strconv.FormatInt(r.ExpiresAt.Unix(), 10)},
		// An invoice gives buyers a PDF to expense.
		"invoice_creation[enabled]": {"true"},
	}
	if r.AutomaticTax {
		f.Set("automatic_tax[enabled]", "true")
	}
	var out CheckoutSession
	err := s.post(ctx, "/v1/checkout/sessions", f, &out)
	return out, err
}

// ExpireCheckout ends a Checkout session that hasn't been paid, so its seat comes back.
func (s *Stripe) ExpireCheckout(ctx context.Context, id string) error {
	return s.post(ctx, "/v1/checkout/sessions/"+url.PathEscape(id)+"/expire", url.Values{}, nil)
}

func (s *Stripe) post(ctx context.Context, path string, form url.Values, out any) error {
	req, err := http.NewRequestWithContext(ctx, "POST", strings.TrimRight(s.API, "/")+path, strings.NewReader(form.Encode()))
	if err != nil {
		return err
	}
	req.SetBasicAuth(s.Key, "")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	res, err := s.HTTP.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	body, _ := io.ReadAll(io.LimitReader(res.Body, 1<<20))
	if res.StatusCode >= 300 {
		var e struct {
			Error struct {
				Message string `json:"message"`
			} `json:"error"`
		}
		_ = json.Unmarshal(body, &e)
		return &Error{Status: res.StatusCode, Message: e.Error.Message}
	}
	if out == nil {
		return nil
	}
	return json.Unmarshal(body, out)
}

// ---------- webhooks ----------

// Tolerance is how old a webhook's signature may be, against replays.
const Tolerance = 5 * time.Minute

var ErrBadSignature = errors.New("webhook signature doesn't match")

// Event is a webhook event, with its object left raw for the handler to read.
type Event struct {
	ID   string `json:"id"`
	Type string `json:"type"`
	Data struct {
		Object json.RawMessage `json:"object"`
	} `json:"data"`
}

// VerifyWebhook checks a webhook body against its Stripe-Signature header
// ("t=<unix>,v1=<hex hmac>,…") and the endpoint's signing secret, then reads the event.
func VerifyWebhook(body []byte, header, secret string, now time.Time) (Event, error) {
	var ts int64
	var sigs [][]byte
	for _, part := range strings.Split(header, ",") {
		k, v, _ := strings.Cut(strings.TrimSpace(part), "=")
		switch k {
		case "t":
			ts, _ = strconv.ParseInt(v, 10, 64)
		case "v1":
			if b, err := hex.DecodeString(v); err == nil {
				sigs = append(sigs, b)
			}
		}
	}
	if ts == 0 || len(sigs) == 0 {
		return Event{}, ErrBadSignature
	}
	if d := now.Sub(time.Unix(ts, 0)); d > Tolerance || d < -Tolerance {
		return Event{}, ErrBadSignature
	}
	want := Sign(body, secret, ts)
	ok := false
	for _, s := range sigs {
		ok = ok || hmac.Equal(s, want)
	}
	if !ok {
		return Event{}, ErrBadSignature
	}
	var e Event
	if err := json.Unmarshal(body, &e); err != nil {
		return Event{}, err
	}
	return e, nil
}

// Sign is Stripe's webhook signature for a body at a time (and what tests send).
func Sign(body []byte, secret string, ts int64) []byte {
	m := hmac.New(sha256.New, []byte(secret))
	m.Write([]byte(strconv.FormatInt(ts, 10) + "."))
	m.Write(body)
	return m.Sum(nil)
}

// SignatureHeader is a Stripe-Signature header for a body, for tests.
func SignatureHeader(body []byte, secret string, ts int64) string {
	return "t=" + strconv.FormatInt(ts, 10) + ",v1=" + hex.EncodeToString(Sign(body, secret, ts))
}

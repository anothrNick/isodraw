package billing

import (
	"context"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"
)

func TestVerifyWebhook(t *testing.T) {
	body := []byte(`{"id":"evt_1","type":"checkout.session.completed","data":{"object":{"id":"cs_1"}}}`)
	now := time.Unix(1_800_000_000, 0)
	ev, err := VerifyWebhook(body, SignatureHeader(body, "whsec_x", now.Unix()), "whsec_x", now)
	if err != nil || ev.ID != "evt_1" || ev.Type != "checkout.session.completed" || string(ev.Data.Object) != `{"id":"cs_1"}` {
		t.Fatalf("%+v %v", ev, err)
	}
	for name, header := range map[string]string{
		"wrong secret": SignatureHeader(body, "whsec_other", now.Unix()),
		"too old":      SignatureHeader(body, "whsec_x", now.Add(-10*time.Minute).Unix()),
		"no signature": "t=1800000000",
		"empty":        "",
		"changed body": SignatureHeader([]byte(`{"id":"evt_2"}`), "whsec_x", now.Unix()),
	} {
		if _, err := VerifyWebhook(body, header, "whsec_x", now); err != ErrBadSignature {
			t.Errorf("%s: %v", name, err)
		}
	}
	// Stripe may send several v1 signatures while a secret is being rolled.
	both := SignatureHeader(body, "whsec_old", now.Unix()) + ",v1=" + SignatureHeader(body, "whsec_x", now.Unix())[len("t=1800000000,v1="):]
	if _, err := VerifyWebhook(body, both, "whsec_x", now); err != nil {
		t.Fatal(err)
	}
}

func TestCreateCheckout(t *testing.T) {
	var got url.Values
	var user string
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, _, _ = r.BasicAuth()
		_ = r.ParseForm()
		got = r.PostForm
		if r.URL.Path != "/v1/checkout/sessions" {
			w.WriteHeader(404)
			_, _ = w.Write([]byte(`{"error":{"message":"no such path"}}`))
			return
		}
		_, _ = w.Write([]byte(`{"id":"cs_test_1","url":"https://checkout.stripe.test/c/cs_test_1"}`))
	}))
	defer srv.Close()
	s := New("sk_test_1")
	s.API = srv.URL
	cs, err := s.CreateCheckout(context.Background(), CheckoutRequest{
		Name: "Lifetime", AmountCents: 9900, Currency: "usd", Email: "ada@example.com", Reference: "p1",
		SuccessURL: "https://app.test/ok", CancelURL: "https://app.test/no", ExpiresAt: time.Unix(1_800_000_000, 0), AutomaticTax: true,
	})
	if err != nil || cs.ID != "cs_test_1" || cs.URL == "" {
		t.Fatalf("%+v %v", cs, err)
	}
	for k, v := range map[string]string{
		"mode": "payment", "line_items[0][price_data][unit_amount]": "9900", "line_items[0][price_data][currency]": "usd",
		"customer_email": "ada@example.com", "client_reference_id": "p1", "metadata[purchase_id]": "p1",
		"payment_intent_data[metadata][purchase_id]": "p1", "expires_at": "1800000000", "automatic_tax[enabled]": "true",
	} {
		if got.Get(k) != v {
			t.Errorf("%s = %q, want %q", k, got.Get(k), v)
		}
	}
	if user != "sk_test_1" {
		t.Fatal("authenticates with the secret key")
	}
	// Stripe's errors come back with their message.
	if err := s.ExpireCheckout(context.Background(), "cs_x"); err == nil || err.(*Error).Message != "no such path" {
		t.Fatal(err)
	}
}

package httpapi

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/anothrNick/isodraw/api/internal/billing"
	"github.com/anothrNick/isodraw/api/internal/config"
)

const webhookSecret = "whsec_test"

// fakeStripe answers Checkout calls and remembers them.
type fakeStripe struct {
	mu       sync.Mutex
	sessions int
	expired  []string
	refs     map[string]string // session id → our purchase id
}

func (s *fakeStripe) handler(w http.ResponseWriter, r *http.Request) {
	s.mu.Lock()
	defer s.mu.Unlock()
	_ = r.ParseForm()
	switch {
	case r.URL.Path == "/v1/checkout/sessions":
		s.sessions++
		id := fmt.Sprintf("cs_test_%d", s.sessions)
		s.refs[id] = r.PostForm.Get("client_reference_id")
		_, _ = fmt.Fprintf(w, `{"id":%q,"url":"https://checkout.stripe.test/%s"}`, id, id)
	case strings.HasSuffix(r.URL.Path, "/expire"):
		s.expired = append(s.expired, strings.Split(r.URL.Path, "/")[4])
		_, _ = w.Write([]byte(`{}`))
	default:
		w.WriteHeader(404)
	}
}

func setupStripe(t *testing.T, seats int) (*fixture, *fakeStripe) {
	fake := &fakeStripe{refs: map[string]string{}}
	srv := httptest.NewServer(http.HandlerFunc(fake.handler))
	t.Cleanup(srv.Close)
	f := setupWith(t, func(c *config.Config) {
		c.StripeSecretKey, c.StripeWebhookSecret, c.StripeAPI = "sk_test_1", webhookSecret, srv.URL
		c.LifetimePrice, c.LifetimeCurrency, c.LifetimeSeats = 9900, "usd", seats
	})
	return f, fake
}

// webhook sends a signed Stripe event.
func (f *fixture) webhook(id, typ string, object any) *http.Response {
	f.t.Helper()
	obj, _ := json.Marshal(object)
	body := fmt.Sprintf(`{"id":%q,"type":%q,"data":{"object":%s}}`, id, typ, obj)
	hr := httptest.NewRequest("POST", "/stripe/webhook", strings.NewReader(body))
	hr.Header.Set("Stripe-Signature", billing.SignatureHeader([]byte(body), webhookSecret, time.Now().Unix()))
	w := httptest.NewRecorder()
	f.h.ServeHTTP(w, hr)
	return w.Result()
}

func (f *fixture) checkout(c *http.Cookie) (*http.Response, map[string]any) {
	return f.do(req{method: "POST", path: "/api/billing/checkout", cookie: c, header: map[string]string{"Content-Type": "application/json"}})
}

func (f *fixture) billing(c *http.Cookie) map[string]any {
	f.t.Helper()
	res, out := f.do(req{method: "GET", path: "/api/billing", cookie: c})
	expect(f.t, res, 200, out)
	return out
}

func paid(session, pi string) map[string]any {
	return map[string]any{"id": session, "payment_status": "paid", "payment_intent": pi, "customer": "cus_1", "amount_total": 9900, "currency": "usd"}
}

func TestBuyingLifetime(t *testing.T) {
	f, fake := setupStripe(t, 2)
	ada, _ := f.user("ada@example.com")

	if b := f.billing(ada); b["available"] != true || b["lifetime"] != false || b["seats"].(map[string]any)["left"].(float64) != 2 {
		t.Fatal(b)
	}
	res, out := f.checkout(ada)
	expect(t, res, 200, out)
	url := out["url"].(string)
	if url != "https://checkout.stripe.test/cs_test_1" {
		t.Fatal(out)
	}
	// The open checkout holds a seat, and asking again reuses it.
	if left := f.billing(ada)["seats"].(map[string]any)["left"].(float64); left != 1 {
		t.Fatal(left)
	}
	if _, out := f.checkout(ada); out["url"] != url || fake.sessions != 1 {
		t.Fatal(out, fake.sessions)
	}

	// Coming back from Stripe grants nothing; the signed webhook does.
	if res := f.webhook("evt_1", "checkout.session.completed", map[string]any{"id": "cs_test_1"}); res.StatusCode != 200 {
		t.Fatal(res.StatusCode) // completed but unpaid: wait
	}
	if f.billing(ada)["lifetime"] != false {
		t.Fatal("not paid yet")
	}
	obj := paid("cs_test_1", "pi_1")
	obj["metadata"] = map[string]string{"purchase_id": fake.refs["cs_test_1"]}
	if res := f.webhook("evt_2", "checkout.session.completed", obj); res.StatusCode != 200 {
		t.Fatal(res.StatusCode)
	}
	b := f.billing(ada)
	if b["lifetime"] != true || b["purchase"].(map[string]any)["seat"].(float64) != 1 || b["seats"].(map[string]any)["sold"].(float64) != 1 {
		t.Fatal(b)
	}
	// Stripe sending the event twice changes nothing.
	f.webhook("evt_2", "checkout.session.completed", obj)
	if f.billing(ada)["seats"].(map[string]any)["sold"].(float64) != 1 {
		t.Fatal("counted twice")
	}
	// Lifetime holders can't buy again; lifetime lets them make teams.
	if res, out := f.checkout(ada); res.StatusCode != 409 || out["error"].(map[string]any)["code"] != "already_lifetime" {
		t.Fatal(out)
	}
	f.team(ada, "Shop")

	// Forged webhooks are refused.
	hr := httptest.NewRequest("POST", "/stripe/webhook", strings.NewReader(`{"id":"evt_x","type":"checkout.session.completed"}`))
	hr.Header.Set("Stripe-Signature", "t=1,v1=00")
	w := httptest.NewRecorder()
	f.h.ServeHTTP(w, hr)
	if w.Code != 400 {
		t.Fatal(w.Code)
	}

	// A full refund takes lifetime access back; the team turns read-only.
	if res := f.webhook("evt_3", "charge.refunded", map[string]any{"payment_intent": "pi_1", "refunded": true}); res.StatusCode != 200 {
		t.Fatal(res.StatusCode)
	}
	if b := f.billing(ada); b["lifetime"] != false || b["purchase"] != nil {
		t.Fatal(b)
	}

	// Payments and refunds are in the admin log, made by the system.
	events, err := f.store.AdminEvents(context.Background(), 10)
	if err != nil || len(events) != 2 || events[0].Action != "purchase.refunded" || events[1].Action != "purchase.paid" || events[1].Detail != "founding seat #1" || events[1].Admin != "" {
		t.Fatalf("%+v %v", events, err)
	}
}

func TestFoundingSeatsRunOut(t *testing.T) {
	f, fake := setupStripe(t, 1)
	ada, _ := f.user("ada@example.com")
	bob, _ := f.user("bob@example.com")

	res, out := f.checkout(ada)
	expect(t, res, 200, out)
	// Ada's open checkout holds the only seat.
	res, out = f.checkout(bob)
	if res.StatusCode != 409 || out["error"].(map[string]any)["code"] != "sold_out" {
		t.Fatal(out)
	}
	// Ada comes back without paying: her seat is released, at Stripe too.
	res, out = f.do(req{method: "POST", path: "/api/billing/cancel", cookie: ada, header: map[string]string{"Content-Type": "application/json"}})
	expect(t, res, 204, out)
	if len(fake.expired) != 1 || fake.expired[0] != "cs_test_1" {
		t.Fatal(fake.expired)
	}
	res, out = f.checkout(bob)
	expect(t, res, 200, out)
	// Bob's checkout expires at Stripe: the seat comes back.
	if res := f.webhook("evt_1", "checkout.session.expired", map[string]any{"id": "cs_test_2"}); res.StatusCode != 200 {
		t.Fatal(res.StatusCode)
	}
	if left := f.billing(bob)["seats"].(map[string]any)["left"].(float64); left != 1 {
		t.Fatal(left)
	}
}

func TestCheckoutNeedsStripe(t *testing.T) {
	f := setup(t)
	c, _ := f.user("ada@example.com")
	if b := f.billing(c); b["available"] != false {
		t.Fatal(b)
	}
	if res, _ := f.checkout(c); res.StatusCode != 503 {
		t.Fatal(res.StatusCode)
	}
	// Without a webhook secret there is no webhook.
	hr := httptest.NewRequest("POST", "/stripe/webhook", strings.NewReader(`{}`))
	w := httptest.NewRecorder()
	f.h.ServeHTTP(w, hr)
	if body, _ := io.ReadAll(w.Body); w.Code != 404 {
		t.Fatal(w.Code, string(body))
	}
}

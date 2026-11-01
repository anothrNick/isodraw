package httpapi

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"time"

	"github.com/anothrNick/isodraw/api/internal/auth"
	"github.com/anothrNick/isodraw/api/internal/billing"
	"github.com/anothrNick/isodraw/api/internal/store"
)

// Buying lifetime access with Stripe Checkout. Starting checkout holds one of
// the founding seats for CheckoutTTL; Stripe's webhook then says it was paid
// (lifetime access and a seat number), expired (the seat comes back), or
// refunded later (access goes). Nothing is granted from the browser's return
// trip, only from the signed webhook.

// CheckoutTTL is how long a started checkout holds its seat (Stripe's minimum is 30 minutes).
const CheckoutTTL = 31 * time.Minute

func (s *Server) billingRoutes(mux, api *http.ServeMux) {
	api.HandleFunc("GET /api/billing", s.billingStatus)
	api.HandleFunc("POST /api/billing/checkout", func(w http.ResponseWriter, r *http.Request) {
		if browserOnly(w, r) {
			s.startCheckout(w, r)
		}
	})
	api.HandleFunc("POST /api/billing/cancel", func(w http.ResponseWriter, r *http.Request) {
		if browserOnly(w, r) {
			s.cancelCheckout(w, r)
		}
	})
	// Stripe calls this; the signature is the authentication.
	mux.HandleFunc("POST /stripe/webhook", s.stripeWebhook)
}

func (s *Server) billingStatus(w http.ResponseWriter, r *http.Request) {
	u := auth.User(r.Context())
	lifetime, err := s.store.HasLifetime(r.Context(), u.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	paid, pending, err := s.store.Seats(r.Context())
	if err != nil {
		internalError(w, err)
		return
	}
	purchases, err := s.store.UserPurchases(r.Context(), u.ID)
	if err != nil {
		internalError(w, err)
		return
	}
	var bought *store.Purchase
	for i, p := range purchases {
		if p.Status == "paid" {
			bought = &purchases[i]
			break
		}
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"available": s.stripe != nil,
		"lifetime":  lifetime,
		"price":     map[string]any{"amount": s.cfg.LifetimePrice, "currency": s.cfg.LifetimeCurrency},
		"seats":     map[string]any{"total": s.cfg.LifetimeSeats, "sold": paid, "left": max(0, s.cfg.LifetimeSeats-paid-pending)},
		"purchase":  bought,
	})
}

func (s *Server) startCheckout(w http.ResponseWriter, r *http.Request) {
	if s.stripe == nil {
		writeError(w, http.StatusServiceUnavailable, "unavailable", "Buying lifetime access isn't open yet.")
		return
	}
	u := auth.User(r.Context())
	p, open, err := s.store.StartPurchase(r.Context(), u.ID, u.Email, s.cfg.LifetimeSeats, time.Now().Add(CheckoutTTL))
	switch {
	case errors.Is(err, store.ErrAlreadyLifetime):
		writeError(w, http.StatusConflict, "already_lifetime", "You already have lifetime access.")
		return
	case errors.Is(err, store.ErrSoldOut):
		writeError(w, http.StatusConflict, "sold_out", fmt.Sprintf("All %d founding seats are taken. Seats held by unfinished checkouts come back within half an hour.", s.cfg.LifetimeSeats))
		return
	case err != nil:
		internalError(w, err)
		return
	}
	if open {
		writeJSON(w, http.StatusOK, map[string]string{"url": p.CheckoutURL})
		return
	}
	session, err := s.stripe.CreateCheckout(r.Context(), billing.CheckoutRequest{
		Name:         "IsoDraw lifetime access (founding member)",
		AmountCents:  s.cfg.LifetimePrice,
		Currency:     s.cfg.LifetimeCurrency,
		Email:        u.Email,
		Reference:    p.ID,
		SuccessURL:   s.cfg.PublicURL + "/settings/plan?session_id={CHECKOUT_SESSION_ID}",
		CancelURL:    s.cfg.PublicURL + "/settings/plan?canceled=1",
		ExpiresAt:    time.Now().Add(CheckoutTTL),
		AutomaticTax: s.cfg.StripeAutomaticTax,
	})
	if err != nil {
		slog.Error("stripe checkout", "err", err)
		_ = s.store.ExpirePurchase(r.Context(), p.ID)
		writeError(w, http.StatusBadGateway, "stripe", "Couldn't start checkout. Please try again in a moment.")
		return
	}
	if err := s.store.AttachCheckout(r.Context(), p.ID, session.ID, session.URL); err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"url": session.URL})
}

// cancelCheckout gives back the seat held by the user's unfinished checkout, when they come back from Stripe without paying.
func (s *Server) cancelCheckout(w http.ResponseWriter, r *http.Request) {
	purchases, err := s.store.UserPurchases(r.Context(), auth.User(r.Context()).ID)
	if err != nil {
		internalError(w, err)
		return
	}
	for _, p := range purchases {
		if p.Status != "pending" {
			continue
		}
		if s.stripe != nil && p.CheckoutURL != "" {
			if session, ok := s.sessionOf(r, p); ok {
				// If Stripe won't expire it (say it was just paid), leave the purchase for the webhook.
				if err := s.stripe.ExpireCheckout(r.Context(), session); err != nil {
					slog.Warn("expire stripe checkout", "err", err)
					continue
				}
			}
		}
		if err := s.store.ExpirePurchase(r.Context(), p.ID); err != nil {
			internalError(w, err)
			return
		}
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) sessionOf(r *http.Request, p store.Purchase) (string, bool) {
	session, err := s.store.CheckoutSession(r.Context(), p.ID)
	return session, err == nil && session != ""
}

func (s *Server) stripeWebhook(w http.ResponseWriter, r *http.Request) {
	if s.cfg.StripeWebhookSecret == "" {
		http.NotFound(w, r)
		return
	}
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 1<<20))
	if err != nil {
		http.Error(w, "unreadable body", http.StatusBadRequest)
		return
	}
	ev, err := billing.VerifyWebhook(body, r.Header.Get("Stripe-Signature"), s.cfg.StripeWebhookSecret, time.Now())
	if err != nil {
		slog.Warn("stripe webhook rejected", "err", err)
		http.Error(w, "bad signature", http.StatusBadRequest)
		return
	}
	isNew, err := s.store.RecordStripeEvent(r.Context(), ev.ID, ev.Type)
	if err != nil {
		internalError(w, err)
		return
	}
	if !isNew {
		w.WriteHeader(http.StatusOK)
		return
	}
	if err := s.handleStripeEvent(r, ev); err != nil {
		// Forget it, so Stripe's retry gets handled.
		s.store.ForgetStripeEvent(r.Context(), ev.ID)
		slog.Error("stripe webhook", "type", ev.Type, "id", ev.ID, "err", err)
		http.Error(w, "failed", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (s *Server) handleStripeEvent(r *http.Request, ev billing.Event) error {
	ctx := r.Context()
	switch ev.Type {
	case "checkout.session.completed", "checkout.session.async_payment_succeeded":
		var cs struct {
			ID                string            `json:"id"`
			PaymentStatus     string            `json:"payment_status"`
			PaymentIntent     string            `json:"payment_intent"`
			Customer          string            `json:"customer"`
			AmountTotal       int               `json:"amount_total"`
			Currency          string            `json:"currency"`
			ClientReferenceID string            `json:"client_reference_id"`
			Metadata          map[string]string `json:"metadata"`
		}
		if err := json.Unmarshal(ev.Data.Object, &cs); err != nil {
			return err
		}
		// Completed but not yet paid (a bank debit): wait for async_payment_succeeded.
		if cs.PaymentStatus != "paid" {
			return nil
		}
		id := cs.Metadata["purchase_id"]
		if id == "" {
			id = cs.ClientReferenceID
		}
		p, err := s.store.MarkPaid(ctx, store.Payment{PurchaseID: id, Session: cs.ID, PaymentIntent: cs.PaymentIntent, Customer: cs.Customer, Amount: cs.AmountTotal, Currency: cs.Currency})
		if errors.Is(err, store.ErrNotFound) {
			slog.Warn("stripe checkout for an unknown purchase", "session", cs.ID)
			return nil
		}
		if err != nil {
			return err
		}
		seat := ""
		if p.Seat != nil {
			seat = fmt.Sprintf("founding seat #%d", *p.Seat)
		}
		return s.store.RecordAdminEvent(ctx, "", "purchase.paid", p.Email, seat)
	case "checkout.session.expired", "checkout.session.async_payment_failed":
		var cs struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(ev.Data.Object, &cs); err != nil {
			return err
		}
		return s.store.ExpireCheckoutSession(ctx, cs.ID)
	case "charge.refunded", "charge.dispute.closed":
		var obj struct {
			PaymentIntent string `json:"payment_intent"`
			Refunded      bool   `json:"refunded"` // charge: fully refunded
			Status        string `json:"status"`   // dispute: won or lost
		}
		if err := json.Unmarshal(ev.Data.Object, &obj); err != nil {
			return err
		}
		if ev.Type == "charge.refunded" && !obj.Refunded || ev.Type == "charge.dispute.closed" && obj.Status != "lost" {
			return nil
		}
		p, found, err := s.store.Refund(ctx, obj.PaymentIntent)
		if err != nil || !found {
			return err
		}
		why := map[string]string{"charge.refunded": "refunded", "charge.dispute.closed": "dispute lost"}[ev.Type]
		return s.store.RecordAdminEvent(ctx, "", "purchase.refunded", p.Email, why)
	}
	return nil
}

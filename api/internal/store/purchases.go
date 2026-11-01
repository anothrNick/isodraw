package store

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
)

var (
	ErrSoldOut         = errors.New("the founding cohort is sold out")
	ErrAlreadyLifetime = errors.New("already has lifetime access")
)

// Purchase is one checkout for lifetime access (see the purchases migration).
type Purchase struct {
	ID          string     `json:"id"`
	UserID      string     `json:"-"`
	Email       string     `json:"email"`
	Status      string     `json:"status"`
	CheckoutURL string     `json:"-"`
	Amount      *int       `json:"amount"`
	Currency    *string    `json:"currency"`
	Seat        *int       `json:"seat"`
	CreatedAt   time.Time  `json:"createdAt"`
	PaidAt      *time.Time `json:"paidAt"`
	RefundedAt  *time.Time `json:"refundedAt"`
}

const purchaseCols = `id, coalesce(user_id::text, ''), email, status, coalesce(checkout_url, ''), amount, currency, seat, created_at, paid_at, refunded_at`

func scanPurchase(r pgx.Row) (Purchase, error) {
	var p Purchase
	err := r.Scan(&p.ID, &p.UserID, &p.Email, &p.Status, &p.CheckoutURL, &p.Amount, &p.Currency, &p.Seat, &p.CreatedAt, &p.PaidAt, &p.RefundedAt)
	return p, err
}

// purchaseLock serializes seat counting, so two buyers can't take the last seat.
const purchaseLock = `select pg_advisory_xact_lock(7243001)`

// held counts seats taken: paid, plus checkouts still open.
const held = `select count(*) from purchases where status = 'paid' or (status = 'pending' and expires_at > now())`

// StartPurchase holds a founding seat for a user until expiresAt, or returns
// the checkout they already have open (open is true). It refuses when every
// seat is taken or held, and when the user already has lifetime access.
func (s *Store) StartPurchase(ctx context.Context, userID, email string, seats int, expiresAt time.Time) (p Purchase, open bool, err error) {
	err = pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		if _, err := tx.Exec(ctx, purchaseLock); err != nil {
			return err
		}
		var lifetime bool
		if err := tx.QueryRow(ctx, `select lifetime_since is not null from users where id = $1`, userID).Scan(&lifetime); err != nil {
			return notFound(err)
		}
		if lifetime {
			return ErrAlreadyLifetime
		}
		p, err = scanPurchase(tx.QueryRow(ctx, `select `+purchaseCols+` from purchases
			where user_id = $1 and status = 'pending' and expires_at > now() + interval '2 minutes' and checkout_url is not null
			order by created_at desc limit 1`, userID))
		if err == nil {
			open = true
			return nil
		}
		if !errors.Is(err, pgx.ErrNoRows) {
			return err
		}
		var n int
		if err := tx.QueryRow(ctx, held).Scan(&n); err != nil {
			return err
		}
		if n >= seats {
			return ErrSoldOut
		}
		p, err = scanPurchase(tx.QueryRow(ctx, `insert into purchases (user_id, email, status, expires_at)
			values ($1, $2, 'pending', $3) returning `+purchaseCols, userID, email, expiresAt))
		return err
	})
	return p, open, err
}

// CheckoutSession is the Stripe Checkout session id of a purchase.
func (s *Store) CheckoutSession(ctx context.Context, id string) (string, error) {
	var session *string
	err := s.db.QueryRow(ctx, `select checkout_session from purchases where id = $1`, id).Scan(&session)
	if session == nil {
		return "", notFound(err)
	}
	return *session, err
}

// AttachCheckout records the Stripe Checkout session made for a purchase.
func (s *Store) AttachCheckout(ctx context.Context, id, session, url string) error {
	_, err := s.db.Exec(ctx, `update purchases set checkout_session = $2, checkout_url = $3 where id = $1`, id, session, url)
	return err
}

// ExpirePurchase lets a seat go: the checkout expired, failed to start, or was abandoned.
func (s *Store) ExpirePurchase(ctx context.Context, id string) error {
	_, err := s.db.Exec(ctx, `update purchases set status = 'expired' where id = $1 and status = 'pending'`, id)
	return err
}

// ExpireCheckoutSession is ExpirePurchase by Stripe's session id.
func (s *Store) ExpireCheckoutSession(ctx context.Context, session string) error {
	_, err := s.db.Exec(ctx, `update purchases set status = 'expired' where checkout_session = $1 and status = 'pending'`, session)
	return err
}

// Payment is what Stripe says about a completed checkout.
type Payment struct {
	PurchaseID    string
	Session       string
	PaymentIntent string
	Customer      string
	Amount        int
	Currency      string
}

// MarkPaid records a payment: the purchase gets the next seat number and its
// buyer lifetime access. Recording the same payment again changes nothing.
// A payment that arrives after its checkout expired still counts.
func (s *Store) MarkPaid(ctx context.Context, pay Payment) (Purchase, error) {
	var p Purchase
	err := pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		if _, err := tx.Exec(ctx, purchaseLock); err != nil {
			return err
		}
		var err error
		p, err = scanPurchase(tx.QueryRow(ctx, `select `+purchaseCols+` from purchases
			where id::text = $1 or checkout_session = $2 for update`, pay.PurchaseID, pay.Session))
		if err != nil {
			return notFound(err)
		}
		if p.Status == "paid" || p.Status == "refunded" {
			return nil
		}
		p, err = scanPurchase(tx.QueryRow(ctx, `
			update purchases set status = 'paid', paid_at = now(), checkout_session = coalesce(checkout_session, nullif($2, '')),
			  payment_intent = nullif($3, ''), customer = nullif($4, ''), amount = $5, currency = $6,
			  seat = (select coalesce(max(seat), 0) + 1 from purchases)
			where id = $1 returning `+purchaseCols,
			p.ID, pay.Session, pay.PaymentIntent, pay.Customer, pay.Amount, pay.Currency))
		if err != nil {
			return err
		}
		if p.UserID != "" {
			_, err = tx.Exec(ctx, `update users set lifetime_since = coalesce(lifetime_since, now()) where id = $1`, p.UserID)
		}
		return err
	})
	return p, err
}

// Refund records money going back for a payment (a refund, or a lost
// dispute): the purchase is marked refunded and its buyer loses lifetime
// access unless they have another paid purchase. found is false for a
// payment that isn't a lifetime purchase.
func (s *Store) Refund(ctx context.Context, paymentIntent string) (p Purchase, found bool, err error) {
	err = pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		var err error
		p, err = scanPurchase(tx.QueryRow(ctx, `
			update purchases set status = 'refunded', refunded_at = coalesce(refunded_at, now())
			where payment_intent = $1 and status in ('paid', 'refunded') returning `+purchaseCols, paymentIntent))
		if errors.Is(err, pgx.ErrNoRows) {
			return nil
		}
		if err != nil {
			return err
		}
		found = true
		if p.UserID == "" {
			return nil
		}
		_, err = tx.Exec(ctx, `update users set lifetime_since = null where id = $1
			and not exists (select 1 from purchases where user_id = $1 and status = 'paid')`, p.UserID)
		return err
	})
	return p, found, err
}

// Seats reports how many founding seats are paid for, and how many are held by open checkouts.
func (s *Store) Seats(ctx context.Context) (paid, pending int, err error) {
	err = s.db.QueryRow(ctx, `select
		(select count(*) from purchases where status = 'paid'),
		(select count(*) from purchases where status = 'pending' and expires_at > now())`).Scan(&paid, &pending)
	return paid, pending, err
}

// UserPurchases lists a user's purchases, newest first.
func (s *Store) UserPurchases(ctx context.Context, userID string) ([]Purchase, error) {
	rows, err := s.db.Query(ctx, `select `+purchaseCols+` from purchases where user_id = $1 order by created_at desc`, userID)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, func(r pgx.CollectableRow) (Purchase, error) { return scanPurchase(r) })
}

// RecordStripeEvent notes a webhook event and reports whether it is new.
func (s *Store) RecordStripeEvent(ctx context.Context, id, typ string) (bool, error) {
	tag, err := s.db.Exec(ctx, `insert into stripe_events (id, type) values ($1, $2) on conflict (id) do nothing`, id, typ)
	return tag.RowsAffected() == 1, err
}

// ForgetStripeEvent undoes RecordStripeEvent when handling failed, so Stripe's retry is handled.
func (s *Store) ForgetStripeEvent(ctx context.Context, id string) {
	_, _ = s.db.Exec(ctx, `delete from stripe_events where id = $1`, id)
}

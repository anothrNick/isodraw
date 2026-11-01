-- +goose Up

-- Lifetime access bought through Stripe Checkout. A row is made (pending)
-- when someone starts checkout, which holds one of the founding seats until
-- the Checkout session expires; it becomes paid when Stripe says so, and
-- refunded if the money goes back. The seat number is the buyer's place in
-- the founding cohort, given at payment.
create table purchases (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references users on delete set null,
  email            text not null,
  status           text not null check (status in ('pending', 'paid', 'expired', 'refunded')),
  checkout_session text unique,
  checkout_url     text,
  payment_intent   text,
  customer         text,
  amount           integer,
  currency         text,
  seat             integer unique,
  created_at       timestamptz not null default now(),
  expires_at       timestamptz not null,
  paid_at          timestamptz,
  refunded_at      timestamptz
);
create index purchases_user_idx on purchases (user_id);
create index purchases_payment_intent_idx on purchases (payment_intent);

-- Stripe event ids already handled, since Stripe may send an event more than once.
create table stripe_events (
  id          text primary key,
  type        text not null,
  received_at timestamptz not null default now()
);

-- +goose Down
drop table stripe_events;
drop table purchases;

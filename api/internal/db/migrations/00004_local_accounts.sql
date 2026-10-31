-- +goose Up

-- Accounts for AUTH_MODE=local: IsoDraw's own sign-in, for development and
-- simple self-hosting. (With Cognito, accounts live in the user pool.)
create table local_accounts (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  name          text not null default '',
  password_hash text not null,
  verified_at   timestamptz,
  created_at    timestamptz not null default now()
);
create unique index local_accounts_email_idx on local_accounts (lower(email));

-- One-time codes to verify an email address or reset a password. Only a hash is kept.
create table local_codes (
  account_id uuid not null references local_accounts on delete cascade,
  purpose    text not null check (purpose in ('verify', 'reset')),
  code_hash  bytea not null,
  expires_at timestamptz not null,
  attempts   int not null default 0,
  primary key (account_id, purpose)
);

-- +goose Down
drop table local_codes;
drop table local_accounts;

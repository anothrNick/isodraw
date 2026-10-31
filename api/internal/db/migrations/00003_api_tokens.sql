-- +goose Up

-- Personal access tokens, for the CLI, AI agents and CI. A token acts as its
-- user, limited to one organization; a read-only token acts as a viewer there.
-- Only a hash of the secret is stored.
create table api_tokens (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users on delete cascade,
  org_id       uuid not null references orgs on delete cascade,
  name         text not null,
  scope        text not null check (scope in ('read', 'write')),
  token_hash   bytea not null unique,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz,
  last_used_at timestamptz
);
create index api_tokens_user_idx on api_tokens (user_id);

-- +goose Down
drop table api_tokens;

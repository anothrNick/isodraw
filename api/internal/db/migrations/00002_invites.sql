-- +goose Up

-- An invitation for an email address to join an organization with a role.
-- The link carries a random token; only its hash is stored. Accepting needs a
-- signed-in user with the same email, so a forwarded link can't be used by
-- someone else.
create table invites (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs on delete cascade,
  email       text not null,
  role        text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  token_hash  bytea not null unique,
  invited_by  uuid references users on delete set null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  accepted_at timestamptz,
  accepted_by uuid references users on delete set null
);
-- One open invite per address and organization; inviting again replaces it.
create unique index invites_open_idx on invites (org_id, lower(email)) where accepted_at is null;

-- +goose Down
drop table invites;

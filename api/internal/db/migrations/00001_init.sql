-- +goose Up

-- People, as the OIDC provider knows them. Identity stays with the provider;
-- organizations and roles live here, so moving providers is painless.
create table users (
  id            uuid primary key default gen_random_uuid(),
  issuer        text not null,
  subject       text not null,
  email         text not null default '',
  name          text not null default '',
  created_at    timestamptz not null default now(),
  last_login_at timestamptz,
  unique (issuer, subject)
);

create table orgs (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  personal   boolean not null default false,
  created_at timestamptz not null default now()
);

create table memberships (
  org_id     uuid not null references orgs on delete cascade,
  user_id    uuid not null references users on delete cascade,
  role       text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index memberships_user_idx on memberships (user_id);

-- Browser sessions. Only a hash of the cookie's token is stored.
create table sessions (
  token_hash bytea primary key,
  user_id    uuid not null references users on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index sessions_user_idx on sessions (user_id);

-- A diagram is one JSON document (the editor's value, detail diagrams and docs
-- included). `version` goes up on every save; saves name the version they
-- started from, so concurrent edits are caught instead of overwritten.
create table diagrams (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references orgs on delete cascade,
  title      text not null,
  content    jsonb not null,
  version    bigint not null default 1,
  created_by uuid references users on delete set null,
  updated_by uuid references users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index diagrams_org_idx on diagrams (org_id, updated_at desc) where deleted_at is null;

-- +goose Down
drop table diagrams;
drop table sessions;
drop table memberships;
drop table orgs;
drop table users;

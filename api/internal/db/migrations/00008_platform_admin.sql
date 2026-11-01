-- +goose Up

-- Platform admins see and manage every user and workspace (/admin). With
-- Cognito or OIDC sign-in the flag follows the identity provider's admin group
-- at each sign-in; with local accounts it's set by `isodraw admin grant`.
alter table users add column platform_admin boolean not null default false;

-- What admins changed, and when: shown on the admin screens.
create table admin_events (
  id         uuid primary key default gen_random_uuid(),
  admin_id   uuid references users on delete set null,
  action     text not null,
  target     text not null,
  detail     text not null default '',
  created_at timestamptz not null default now()
);
create index admin_events_created_idx on admin_events (created_at desc);

-- +goose Down
drop table admin_events;
alter table users drop column platform_admin;

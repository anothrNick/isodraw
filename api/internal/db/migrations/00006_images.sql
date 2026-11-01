-- +goose Up

-- A workspace's uploaded images, shared by everyone in it. The bytes live in
-- blob storage under images/<token>; the token is the unguessable part of the
-- image's public link, so diagrams, previews and published pages can show it
-- without signing in. Removing an image hides it from the workspace's list but
-- keeps the link working, so diagrams that use it don't break.
create table images (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references orgs on delete cascade,
  name         text not null,
  token        text not null unique,
  content_type text not null,
  size         integer not null,
  created_by   uuid references users on delete set null,
  created_at   timestamptz not null default now(),
  removed_at   timestamptz
);
create index images_org_idx on images (org_id, created_at) where removed_at is null;

-- +goose Down
drop table images;

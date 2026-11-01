-- +goose Up

-- Plans. Everyone is free: everything in their personal workspace, up to a
-- number of diagrams. Lifetime access (a one-time purchase, or granted by
-- hand) lifts that limit and lets the person own team workspaces, each with a
-- number of editor seats. A refund clears lifetime_since again.
alter table users add column lifetime_since timestamptz;

-- Teams that existed before plans keep working for free, without a seat limit.
alter table orgs add column grandfathered boolean not null default false;
update orgs set grandfathered = true where not personal;

-- +goose Down
alter table orgs drop column grandfathered;
alter table users drop column lifetime_since;

-- +goose Up

-- Founding lifetime access is Pro, forever, on one workspace (see
-- features/workspace-plans.md): the buyer's lifetime workspace is the one with
-- lifetime_of set to them, on plan 'pro' from source 'lifetime'. A person has
-- at most one. users.lifetime_since stays as the entitlement (a purchase, or
-- an admin's grant); creating a workspace with it unused makes that workspace
-- theirs.
alter table orgs add column lifetime_of uuid references users on delete set null;
create unique index orgs_lifetime_of_idx on orgs (lifetime_of);

-- Carry over: each lifetime holder's oldest team without a plan of its own
-- becomes their lifetime Pro workspace.
with first as (
  select distinct on (u.id) u.id as user_id, o.id as org_id
  from users u
  join memberships m on m.user_id = u.id and m.role = 'owner'
  join orgs o on o.id = m.org_id and not o.personal and o.plan is null and not o.grandfathered
  where u.lifetime_since is not null
  order by u.id, o.created_at, o.id
), picked as (
  -- A team owned by two lifetime holders goes to the earlier one only.
  select distinct on (org_id) org_id, user_id from first order by org_id, user_id
)
update orgs o set plan = 'pro', plan_source = 'lifetime', lifetime_of = picked.user_id
from picked where o.id = picked.org_id;

-- Any other team kept going by an owner's lifetime access keeps going as it
-- was: nobody loses what they had (limits apply to new changes only).
update orgs o set grandfathered = true
where not o.personal and o.plan is null and not o.grandfathered
  and exists (select 1 from memberships m join users u on u.id = m.user_id
              where m.org_id = o.id and m.role = 'owner' and u.lifetime_since is not null);

-- +goose Down
update orgs set plan = null, plan_source = null where plan_source = 'lifetime';
drop index orgs_lifetime_of_idx;
alter table orgs drop column lifetime_of;

-- +goose Up

-- A workspace's own plan, the start of moving plans onto workspaces (see
-- features/workspace-plans.md). For now platform admins set it by hand, to
-- sell and demo IsoDraw without payment (plan_source 'comp'). A workspace with
-- no plan follows the earlier rules: its owners' lifetime access, or
-- grandfathering. Pro allows 4 people (any role, open invites included); Team
-- and Business have no people limit.
alter table orgs add column plan text check (plan in ('pro', 'team', 'business'));
alter table orgs add column plan_source text check (plan_source in ('comp', 'subscription', 'lifetime'));
alter table orgs add constraint orgs_plan_source check ((plan is null) = (plan_source is null));

-- +goose Down
alter table orgs drop constraint orgs_plan_source;
alter table orgs drop column plan_source;
alter table orgs drop column plan;

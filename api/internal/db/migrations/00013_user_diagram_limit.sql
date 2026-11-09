-- +goose Up

-- A platform admin can set how many diagrams a person's personal workspace
-- holds: null follows the platform's default (FREE_DIAGRAMS), 0 is no limit.
alter table users add column diagram_limit integer check (diagram_limit >= 0);

-- +goose Down
alter table users drop column diagram_limit;

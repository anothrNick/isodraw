-- +goose Up

-- The same uploaded image can be in several workspaces' libraries: moving or
-- copying a diagram adds the images it uses to the target workspace. They
-- share the bytes and the link (the token), so a token is unique per workspace.
alter table images drop constraint images_token_key;
create unique index images_org_token_idx on images (org_id, token);
create index images_token_idx on images (token);

-- +goose Down
drop index images_token_idx;
drop index images_org_token_idx;
alter table images add constraint images_token_key unique (token);

-- +goose Up

-- AI apps (Claude, ChatGPT) that connect to IsoDraw's MCP server register
-- themselves here (OAuth dynamic client registration). They are public
-- clients: no secret, so PKCE protects the code exchange.
create table oauth_clients (
  id            text primary key,
  name          text not null,
  redirect_uris text[] not null,
  created_at    timestamptz not null default now()
);

-- One-time authorization codes, from a person's approval on the consent page
-- to the app's token request. They carry what the person chose; the token is
-- made when the code is exchanged. Only a hash of the code is stored.
create table oauth_codes (
  code_hash       bytea primary key,
  client_id       text not null references oauth_clients on delete cascade,
  user_id         uuid not null references users on delete cascade,
  org_id          uuid not null references orgs on delete cascade,
  scope           text not null check (scope in ('read', 'write')),
  expires_in_days int not null,
  redirect_uri    text not null,
  code_challenge  text not null,
  expires_at      timestamptz not null
);

-- +goose Down
drop table oauth_codes;
drop table oauth_clients;

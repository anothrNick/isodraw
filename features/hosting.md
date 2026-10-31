# Hosting

**Status:** shipped · **Priority:** next
**Summary:** Run the platform for real: one container on Fly.io, Postgres, S3, and Cognito for sign-in, all in Terraform, plus email for invites. Self-hosting uses the same container.

## Where it stands

Live at https://isodraw.sjostrom.io since 2026-10-31:

- **Web app** on Cloudflare Pages (project `isodraw`), deployed with `npm run deploy:web`. Pages Functions forward `/api` and `/auth` to the API, so the browser sees one origin.
- **API** on Fly.io (`isodraw-api`, Personal org, `iad`), deployed with `npm run deploy:api`; migrations run as the release command.
- **Postgres** on Fly as unmanaged Postgres (`isodraw-db`, one machine, 1 GB), about $3/month. Move to Managed Postgres when people depend on it (DEPLOY.md has the steps).
- **Storage:** Tigris bucket `isodraw-assets`, attached but unused until image storage lands.
- **Sign-in:** Cognito pool `isodraw` in AWS account 397979615590 (us-east-1), from `infra/terraform`. The Terraform state is local, in `infra/terraform`; move it to an S3 backend before anyone else changes it.

Still to do:

- **Email for invites:** invites are links to copy; sending them needs SES (or similar) and a mailer in the API.
- **Automatic deploys** of the API and web app from CI on push to `main` (the demo already deploys this way). Needs a Fly deploy token and a Cloudflare API token as repository secrets.
- **Self-hosting:** `docker-compose.selfhost.yml` and a guide to connecting an identity provider.

## How it could work

- **One image:** a Dockerfile builds the web app and the Go server, embeds the app in the binary, and serves both from one port. Migrations run on start.
- **Fly.io:** `fly.toml` with health checks on `/healthz`, a release command for migrations, and secrets for the database, OIDC and session settings.
- **Postgres:** Fly Managed Postgres (or an external one); open question below.
- **S3:** for assets, reached with Fly's OIDC tokens assuming an AWS role, so no stored AWS keys.
- **Cognito in Terraform** (`infra/terraform`): the app client with callback URLs, the hosted sign-in domain, and either a new user pool or Radical Whale's existing one.
- **Email:** invites and notifications through SES (or Postmark), behind a small mailer interface so self-hosters can use SMTP.
- **Self-hosting:** a `docker-compose.selfhost.yml` with the image, Postgres and an S3-compatible store, and a guide to connecting an identity provider.

## Open questions

- Reuse Radical Whale's Cognito user pool (one account across products) or a new pool?
- Postgres on Fly, Neon, or RDS?
- S3 on AWS, or Tigris on Fly?
- The domain for the hosted app.

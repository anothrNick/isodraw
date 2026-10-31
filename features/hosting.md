# Hosting

**Status:** idea · **Priority:** next
**Summary:** Run the platform for real: one container on Fly.io, Postgres, S3, and Cognito for sign-in, all in Terraform, plus email for invites. Self-hosting uses the same container.

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

# Deploying IsoDraw

```
browser ──▶ Cloudflare Pages  (the web app, your domain)
               │  /api/*, /auth/*, /oauth/* and /.well-known/oauth-* are forwarded by Pages Functions (web/functions);
               │  /mcp (AI apps) and /p/*.svg (preview pictures) run in Pages Functions and call the API
               ▼
            Fly.io app  (the Go API, api/)  ──▶ Postgres on Fly (its own small app)
               │                             └─▶ Tigris on Fly (S3, for uploaded images)
               └──▶ AWS Cognito (sign-in, infra/terraform)
```

The browser only ever talks to your domain: Cloudflare forwards `/api` and `/auth` to Fly. So the session cookie belongs to your domain, there's no CORS to configure, and the API's `PUBLIC_URL` is the site's address, not Fly's.

You need: a Fly.io account and `flyctl`; a Cloudflare account (wrangler runs through `npx`); an AWS account and Terraform (or OpenTofu) for Cognito; and a domain on Cloudflare.

## Decide first

| | Example | Where it's set |
| --- | --- | --- |
| Site address | `https://isodraw.example.com` | `api/fly.toml` (`PUBLIC_URL`), `infra/terraform/terraform.tfvars` (`app_url`) |
| Fly app | `isodraw-api` in `iad` | `api/fly.toml` (`app`, `primary_region`), `web/wrangler.toml` (`API_ORIGIN`) |
| Pages project | `isodraw` | `web/wrangler.toml` (`name`) |
| Cognito pool | new, or an existing one | `infra/terraform/terraform.tfvars` |

## 1. Sign-in (Cognito)

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # set app_url, and existing_user_pool_id to reuse a pool
terraform init
terraform apply
terraform output                               # oidc_issuer, oidc_client_id
terraform output -raw oidc_client_secret
```

The app has its own sign-in pages; the API checks passwords against the pool with the `USER_PASSWORD_AUTH` flow (enabled on the app client) and Cognito emails the verification and reset codes. The hosted UI domain stays configured for `AUTH_MODE=oidc`, but isn't used.

## 2. The API (Fly.io)

```bash
fly auth login
fly apps create isodraw-api

# Postgres: one small machine with a 1 GB volume, about $3/month (see "Postgres" below).
# Attaching creates a database and user for the API and sets its DATABASE_URL.
fly postgres create --name isodraw-db --region iad --initial-cluster-size 1 --vm-size shared-cpu-1x --volume-size 1
fly postgres attach isodraw-db -a isodraw-api --superuser=false

# Object storage for uploaded images (sets AWS_* and BUCKET_NAME). Used once image storage lands.
fly storage create -a isodraw-api

# Sign-in and sessions.
fly secrets set -a isodraw-api \
  AUTH_MODE=cognito \
  OIDC_ISSUER="$(cd infra/terraform && terraform output -raw oidc_issuer)" \
  OIDC_CLIENT_ID="$(cd infra/terraform && terraform output -raw oidc_client_id)" \
  OIDC_CLIENT_SECRET="$(cd infra/terraform && terraform output -raw oidc_client_secret)" \
  SESSION_SECRET="$(openssl rand -base64 48)"

npm run deploy:api        # fly deploy from api/: builds the image, runs migrations, rolls out
fly logs -a isodraw-api
```

The release command (`migrate`, run as `/isodraw migrate`) applies database migrations before the new version starts. `GET /healthz` is the health check.

## 3. The web app (Cloudflare Pages)

```bash
npx wrangler@4.156.0 login
npx wrangler@4.156.0 pages project create isodraw --production-branch main
npm run deploy:web        # builds web/ and deploys it with its functions
```

Then in the Cloudflare dashboard, add your domain to the Pages project (*Custom domains*). `API_ORIGIN` comes from `web/wrangler.toml`.

### Preview pictures in R2 (optional, recommended)

Preview pictures (`/p/{id}.svg` and `.png`, and the app's grid thumbnails) are drawn on demand. With an R2 bucket bound as `PREVIEWS`, each version of a diagram is drawn once per size, theme and format and kept, so views cost almost nothing until the next edit. Without it, every cache miss draws again (fine for light use; PNGs take a few hundred ms of CPU).

1. In the Cloudflare dashboard, open **R2** once and enable it (it has a free tier; Cloudflare may ask for a payment method).
2. Create the bucket and a rule that deletes pictures after 30 days:

   ```bash
   npx wrangler@4.156.0 r2 bucket create isodraw-previews
   npx wrangler@4.156.0 r2 bucket lifecycle add isodraw-previews expire-previews previews/ --expire-days 30 --force
   ```

3. Uncomment the `[[r2_buckets]]` block in `web/wrangler.toml` and run `npm run deploy:web`. Responses then carry `X-Preview: drawn` the first time and `X-Preview: stored` after.

## 4. Check it

1. Open your domain: you're sent to `/login`. Create an account, enter the code Cognito emails you, and you land on your diagrams.
2. Create a diagram, reload, and it's still there.
3. From a terminal: `npx isodraw login --server https://isodraw.example.com`.
4. AI apps: `https://isodraw.example.com/.well-known/oauth-authorization-server` answers JSON, and `curl -i -X POST https://isodraw.example.com/mcp` answers 401 with a `WWW-Authenticate` header. Then add the URL as a connector in Claude (see the README) and approve it.

## Postgres

For now the database is Fly's unmanaged Postgres: Postgres running as its own Fly app on one machine, about $2–4/month. Fly no longer supports it as a product, so it's ours to look after:

- **Backups:** Fly snapshots the volume daily (`fly volumes list -a isodraw-db`, then `fly volumes snapshots list <volume-id>`). For a copy you control, run `pg_dump` through `fly proxy 15432:5432 -a isodraw-db`.
- **Getting in:** `fly postgres connect -a isodraw-db`.
- **Upgrades and failover:** none automatic. A single machine means a restart is a short outage.

When real people depend on it, move to Fly Managed Postgres (from $38/month on the Basic plan, with high availability, backups and pooling included):

```bash
fly mpg create --name isodraw-pg --region iad --plan basic
fly proxy 15432:5432 -a isodraw-db &   # dump the old database
pg_dump --no-owner --no-privileges "postgres://…@localhost:15432/isodraw_api" > isodraw.sql
fly mpg proxy <cluster-id> &           # load it into the new cluster on localhost:16380
psql "postgres://…@localhost:16380/…" < isodraw.sql
fly secrets unset DATABASE_URL -a isodraw-api
fly mpg attach <cluster-id> -a isodraw-api   # sets the new DATABASE_URL and restarts the API
```

## Later deploys

```bash
npm run deploy:api   # API changes (migrations run first)
npm run deploy:web   # web app changes
```

Roll the API back with `fly releases -a isodraw-api` and `fly deploy --image <previous image>`; Pages keeps every deployment and can roll back from the dashboard.

## Try the production setup locally

`npm run preview:pages -w isodraw-web` serves the built app with Cloudflare's own runtime on :5190, forwarding to an API on :8080, which is the same path as production. Stop `npm run dev` first and run the API on its own (`cd api && go run ./cmd/isodraw` with `.env` loaded).

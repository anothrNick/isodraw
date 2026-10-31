# Deploying IsoDraw

```
browser ──▶ Cloudflare Pages  (the web app, your domain)
               │  /api/* and /auth/* are forwarded by Pages Functions (web/functions)
               ▼
            Fly.io app  (the Go API, api/)  ──▶ Fly Managed Postgres
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

## 2. The API (Fly.io)

```bash
fly auth login
fly apps create isodraw-api

# Postgres: a managed cluster, attached to the app (sets DATABASE_URL).
fly mpg create --name isodraw-db --region iad --plan development   # or production
fly mpg attach <cluster-id> -a isodraw-api

# Object storage for uploaded images (sets AWS_* and BUCKET_NAME). Used once image storage lands.
fly storage create -a isodraw-api

# Sign-in and sessions.
fly secrets set -a isodraw-api \
  OIDC_ISSUER="$(cd infra/terraform && terraform output -raw oidc_issuer)" \
  OIDC_CLIENT_ID="$(cd infra/terraform && terraform output -raw oidc_client_id)" \
  OIDC_CLIENT_SECRET="$(cd infra/terraform && terraform output -raw oidc_client_secret)" \
  SESSION_SECRET="$(openssl rand -base64 48)"

npm run deploy:api        # fly deploy from api/: builds the image, runs migrations, rolls out
fly logs -a isodraw-api
```

The release command (`/isodraw migrate`) applies database migrations before the new version starts. `GET /healthz` is the health check.

## 3. The web app (Cloudflare Pages)

```bash
npx wrangler@4.156.0 login
npx wrangler@4.156.0 pages project create isodraw --production-branch main
npm run deploy:web        # builds web/ and deploys it with its functions
```

Then in the Cloudflare dashboard, add your domain to the Pages project (*Custom domains*). `API_ORIGIN` comes from `web/wrangler.toml`.

## 4. Check it

1. Open your domain: you're sent to Cognito's sign-in page; sign up, and you land on your diagrams.
2. Create a diagram, reload, and it's still there.
3. From a terminal: `npx isodraw login --server https://isodraw.example.com`.

## Later deploys

```bash
npm run deploy:api   # API changes (migrations run first)
npm run deploy:web   # web app changes
```

Roll the API back with `fly releases -a isodraw-api` and `fly deploy --image <previous image>`; Pages keeps every deployment and can roll back from the dashboard.

## Try the production setup locally

`npm run preview:pages -w isodraw-web` serves the built app with Cloudflare's own runtime on :5190, forwarding to an API on :8080, which is the same path as production. Stop `npm run dev` first and run the API on its own (`cd api && go run ./cmd/isodraw` with `.env` loaded).

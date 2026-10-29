<!-- diagram -->
## Overview

**Tablebook** is a restaurant reservations web app: diners search for open tables and book them, and restaurants manage their floor plans and bookings. This diagram is the production stack in `us-east-1`.

A request takes one of two paths:

1. Static files (JavaScript, CSS, images) come from [@CloudFront](isodraw:node/cf), which caches them from [@S3 assets](isodraw:node/s3).
2. API calls under `/api/*` pass through CloudFront to the [@ALB](isodraw:node/alb), which spreads them across three Django servers. Those servers read and write [@RDS primary](isodraw:node/rds) and cache hot reads in [@ElastiCache](isodraw:node/cache).

## Service levels

| Endpoint | Availability | Latency (p99) |
| --- | --- | --- |
| Search tables | 99.9% | 400 ms |
| Create reservation | 99.95% | 600 ms |
| Static assets | 99.99% | 100 ms |

## Environments

| Environment | URL | Notes |
| --- | --- | --- |
| Production | `tablebook.example.com` | This diagram |
| Staging | `staging.tablebook.example.com` | Same layout, one web server, smaller database |
| Local | `localhost:8000` | Docker Compose with Postgres and Redis |

> Every component has its own page with its configuration, payloads and the errors it can produce. Open one from the contents, or hover a mention to find it on the diagram.

<!-- node:vpc -->
The production network for Tablebook: one VPC across three availability zones, split into public, app and data subnets.

| Setting | Value |
| --- | --- |
| Region | `us-east-1` (a, b, c) |
| CIDR | `10.0.0.0/16` |
| NAT | One NAT gateway per AZ |
| Flow logs | Rejected traffic only, to CloudWatch Logs (30 days) |
| Endpoints | Gateway endpoint for S3; interface endpoints for Secrets Manager and SSM |

## Traffic rules

Only the [@ALB](isodraw:node/alb) is reachable from the internet. Each tier accepts traffic only from the tier in front of it:

| Security group | Allows in | From |
| --- | --- | --- |
| `sg-alb` | 443 | CloudFront managed prefix list |
| `sg-web` | 8000 | `sg-alb` |
| `sg-db` | 5432 | `sg-web` |
| `sg-cache` | 6379 | `sg-web` |

## Failure cases

- **One AZ goes down:** each tier has capacity in the other two AZs. The ALB stops routing to the unhealthy zone within about 30 seconds.
- **A NAT gateway fails:** only outbound calls from that AZ's web server break (for example, sending email). Inbound requests keep working.

<!-- node:pub -->
Subnets for internet-facing resources: the [@ALB](isodraw:node/alb) and the NAT gateways.

| AZ | CIDR |
| --- | --- |
| us-east-1a | `10.0.0.0/24` |
| us-east-1b | `10.0.1.0/24` |
| us-east-1c | `10.0.2.0/24` |

Nothing else may run here. A Config rule flags any EC2 instance launched in these subnets.

<!-- node:app -->
Private subnets for the web tier: [@web-1](isodraw:node/ec2a), [@web-2](isodraw:node/ec2b) and [@web-3](isodraw:node/ec2c).

| AZ | CIDR |
| --- | --- |
| us-east-1a | `10.0.10.0/23` |
| us-east-1b | `10.0.12.0/23` |
| us-east-1c | `10.0.14.0/23` |

They have outbound internet through the NAT gateways (payment provider, email API) but no inbound route from the internet.

<!-- node:data -->
Isolated subnets for state: [@RDS primary](isodraw:node/rds), [@RDS replica](isodraw:node/rds2) and [@ElastiCache](isodraw:node/cache).

There is no route to the internet at all, not even through NAT. Engine updates come through AWS, and backups go to S3 through the gateway endpoint.

<!-- node:users -->
Diners and restaurant staff using Tablebook in a browser.

| Audience | Share of traffic | Peak |
| --- | --- | --- |
| Diners (search and book) | 85% | Friday 5–7 pm local time |
| Restaurant staff (dashboard) | 15% | Weekdays 10–11 am |

Everyone reaches the app at `tablebook.example.com` over HTTPS through [@CloudFront](isodraw:node/cf). Nothing talks to the load balancer directly.

<!-- node:cf -->
The CDN in front of everything: it serves cached static files and passes API calls through to the load balancer.

| Setting | Value |
| --- | --- |
| Service | Amazon CloudFront |
| Domain | `tablebook.example.com` (ACM certificate) |
| Price class | 100 (North America and Europe) |
| Protocols | HTTP/2 and HTTP/3; TLS 1.2 minimum |
| WAF | AWS managed common rules plus a rate limit of 2,000 requests per 5 minutes per IP |

## Behaviors

| Path | Origin | Caching |
| --- | --- | --- |
| `/static/*` | [@S3 assets](isodraw:node/s3) | 1 year (file names are content-hashed) |
| `/api/*` | [@ALB](isodraw:node/alb) | Not cached; all headers, cookies and query strings forwarded |
| `/*` | [@S3 assets](isodraw:node/s3) | 60 seconds (`index.html`) |

## Error cases

| What the user sees | Cause | Handling |
| --- | --- | --- |
| `403` | Blocked by WAF (rate limit or bad request) | Branded "Too many requests" page |
| `502` | Origin TLS handshake failed or the origin closed the connection | Custom error page; alarm if above 1% for 5 minutes |
| `504` | Origin took longer than 30 seconds | Custom error page; API clients retry idempotent calls |

## Deploying

The frontend build uploads to S3, then invalidates `/index.html` only. Every other file has a new hashed name, so it never needs invalidating.

<!-- node:s3 -->
The bucket holding Tablebook's frontend: the single-page app's HTML, JavaScript, CSS, fonts and images.

| Setting | Value |
| --- | --- |
| Bucket | `tablebook-prod-assets` |
| Access | Private; only [@CloudFront](isodraw:node/cf) can read it (origin access control) |
| Versioning | On, with old versions expiring after 30 days |
| Encryption | SSE-S3 |

## Layout

```text
index.html                   Cache-Control: max-age=60
static/js/app.3f9c1e.js      Cache-Control: max-age=31536000, immutable
static/css/app.81aa02.css
static/img/…
```

## Error cases

- **`403 AccessDenied` through CloudFront:** almost always a missing object. S3 returns 403 instead of 404 for a missing key when the caller can't list the bucket. Check the deploy uploaded the hashed file that `index.html` points to.
- **Bad deploy:** roll back by restoring the previous `index.html` version. The old hashed files are still in the bucket.

<!-- node:alb -->
The public Application Load Balancer. It terminates TLS for API traffic and spreads requests across the web servers.

| Setting | Value |
| --- | --- |
| Service | Elastic Load Balancing (Application Load Balancer) |
| Scheme | Internet-facing, in the public subnets of all three AZs |
| Idle timeout | 60 seconds |
| Deletion protection | On |

## Listeners

| Listener | Action |
| --- | --- |
| 443 HTTPS | Forward to target group `web` if the `X-Origin-Verify` header matches; otherwise `403` |
| 80 HTTP | Redirect to 443 |

The `X-Origin-Verify` header is a secret that [@CloudFront](isodraw:node/cf) adds, so requests that skip the CDN are rejected.

## Target group `web`

| Setting | Value |
| --- | --- |
| Targets | [@web-1](isodraw:node/ec2a), [@web-2](isodraw:node/ec2b), [@web-3](isodraw:node/ec2c) on port 8000 |
| Health check | `GET /healthz` every 10 s; 2 passes healthy, 3 failures unhealthy |
| Deregistration delay | 30 s |
| Algorithm | Least outstanding requests |

## Error cases

| Status | Meaning | Usual cause |
| --- | --- | --- |
| `502` | A target closed the connection or sent a bad response | gunicorn worker killed (out of memory) mid-request |
| `503` | No healthy targets | Bad deploy failing `/healthz` on every instance |
| `504` | A target didn't answer within 60 s | Slow database query; see [@RDS primary](isodraw:node/rds) |

<!-- node:ec2a -->
Web server in **us-east-1a**, identical to [@web-2](isodraw:node/ec2b). Its page has the full details: the API, payloads and error handling.

<!-- node:ec2b -->
One of three identical Django web servers that run the Tablebook API. They sit behind the [@ALB](isodraw:node/alb), one per AZ.

| Setting | Value |
| --- | --- |
| Service | Amazon EC2 in an Auto Scaling group |
| Instance | `m7g.large` (Graviton), Amazon Linux 2023 |
| Runtime | Python 3.12, Django 5.1, gunicorn (9 workers) on port 8000 |
| Scaling | Min 3, max 9; scales out when CPU is above 55% |
| Config | Environment from SSM Parameter Store; secrets from Secrets Manager |

## API

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/api/restaurants/{id}/availability?date=&party=` | Open slots for a day (cached) |
| `POST` | `/api/reservations` | Book a slot |
| `DELETE` | `/api/reservations/{id}` | Cancel a booking |
| `GET` | `/healthz` | Checks the process can reach the database and cache |

## Example: book a table

Request:

```http
POST /api/reservations
Authorization: Bearer eyJhbGciOi…
Idempotency-Key: 6f1c2a9e-4b1d-4c55-9a0e-2f4b6a7d8e10
Content-Type: application/json

{
  "restaurantId": "rst_1042",
  "slot": "2026-11-06T19:30:00-05:00",
  "partySize": 4,
  "notes": "Window seat if possible"
}
```

Response `201 Created`:

```json
{
  "id": "res_8Kq2Zp",
  "status": "confirmed",
  "restaurantId": "rst_1042",
  "slot": "2026-11-06T19:30:00-05:00",
  "partySize": 4,
  "confirmationCode": "TB-4F7Q"
}
```

The booking runs in one database transaction that locks the slot row (`SELECT … FOR UPDATE`), so two diners can't book the last table at the same moment.

## Error cases

| Status | Code | When |
| --- | --- | --- |
| `400` | `invalid_request` | Missing fields, party size outside 1–20, or a slot in the past |
| `401` | `unauthenticated` | Missing or expired session token |
| `409` | `slot_unavailable` | Someone else took the slot; the response lists the nearest open times |
| `409` | `duplicate_request` | Same `Idempotency-Key` with a different body |
| `429` | `rate_limited` | More than 10 bookings per minute from one account |
| `503` | `dependency_unavailable` | Database unreachable; the client should retry with backoff |

Errors share one shape:

```json
{ "error": { "code": "slot_unavailable", "message": "That time was just booked.", "alternatives": ["19:00", "20:15"] } }
```

## To do

- [x] IMDSv2 only
- [x] Graceful shutdown: drain in-flight requests before the instance is replaced
- [ ] Move to Graviton 4 (`m8g`)
- [ ] Containerize and move to ECS

<!-- node:ec2c -->
Web server in **us-east-1c**, identical to [@web-2](isodraw:node/ec2b). This is also the instance that runs the nightly `send_reminders` cron job, which emails diners the day before their booking. The job takes a database advisory lock, so it can't run twice.

<!-- node:rds -->
The main PostgreSQL database and Tablebook's source of truth. All writes go here.

| Setting | Value |
| --- | --- |
| Service | Amazon RDS for PostgreSQL 16 |
| Instance | `db.r7g.xlarge`, Multi-AZ (synchronous standby in another AZ) |
| Storage | 500 GB gp3, autoscaling to 1 TB |
| Backups | Daily snapshots kept 14 days, plus point-in-time recovery |
| Parameters | `max_connections=400`, `statement_timeout=5s` for the app role |

## Main tables

| Table | Rows | Notes |
| --- | --- | --- |
| `restaurants` | 12k | Profile, opening hours, floor plan |
| `slots` | 40M | One row per bookable table and time; partitioned by month |
| `reservations` | 18M | Unique on `(slot_id)` where status is confirmed |
| `users` | 2.1M | Diners and staff, with a role column |

## Error cases

| Symptom | Cause | What happens |
| --- | --- | --- |
| Connections drop for 30–60 s | Multi-AZ failover (maintenance or instance failure) | The DNS name moves to the standby; Django reconnects and retries the request once |
| `too many connections` | A web server's connection pool leaking | Alarm at 80% of `max_connections`; restart the instance |
| `canceling statement due to statement timeout` | Slow query above 5 s | The API returns `503`; the query is logged for review |
| `deadlock detected` | Two bookings locking slots in a different order | The booking is retried up to 3 times |

> Restores go to a new instance. Never restore over production; repoint the app once the data has been checked.

<!-- node:rds2 -->
A read-only copy of [@RDS primary](isodraw:node/rds) for reporting and the restaurant dashboard's heavy queries.

| Setting | Value |
| --- | --- |
| Service | RDS read replica (same engine and instance size) |
| Replication | Asynchronous; usually less than 1 second behind |
| Used by | Monthly reports and the "busy times" charts |

## Error cases

- **Replica lag above 30 s:** the app stops sending reads here and uses the primary until lag recovers. Fresh data matters more than the extra load.
- **Replica unavailable:** reports pause and show "Data is being refreshed". Bookings are unaffected because they never read from the replica.

<!-- node:cache -->
Redis cache for hot reads (mostly availability) and for rate-limit counters.

| Setting | Value |
| --- | --- |
| Service | Amazon ElastiCache for Redis 7 (cluster mode off) |
| Nodes | `cache.r7g.large`, one primary and one replica in another AZ |
| Eviction | `allkeys-lru` |
| Encryption | In transit (TLS) and at rest |

## Keys

| Key | Value | TTL |
| --- | --- | --- |
| `avail:{restaurantId}:{date}:{party}` | JSON list of open slots | 30 s |
| `restaurant:{id}` | Restaurant profile | 10 min |
| `rl:{userId}:{minute}` | Request counter | 60 s |

Example availability value:

```json
{ "date": "2026-11-06", "party": 4, "slots": ["17:30", "19:00", "20:15"], "generatedAt": "2026-11-05T14:02:11Z" }
```

A new booking deletes that restaurant's `avail:*` keys for the day, so the next search recomputes them.

## Error cases

- **Cache unavailable:** reads fall through to the database. The client has a 50 ms timeout, so a slow Redis can't slow the API down much. Rate limiting fails open.
- **Many requests miss the same key at once:** only one request recomputes the value. The others wait up to 200 ms for it, using a short `SET NX` lock.

<!-- edge:e1 -->
Browsers to [@CloudFront](isodraw:node/cf) over HTTPS (HTTP/2 or HTTP/3). The session token is in a `Secure`, `HttpOnly`, `SameSite=Lax` cookie; API calls also send it as a `Bearer` header.

<!-- edge:e2 -->
CloudFront forwards `/api/*` to the [@ALB](isodraw:node/alb) over HTTPS.

- Adds `X-Origin-Verify: <secret>`, so the ALB can reject requests that skip the CDN. The secret is rotated monthly.
- Origin timeouts: 5 s to connect, 30 s to respond.
- Forwards all headers, cookies and query strings. Nothing under `/api/*` is cached.

<!-- edge:e3 -->
CloudFront reads from [@S3 assets](isodraw:node/s3) using origin access control, with requests signed by SigV4. The bucket policy only allows this distribution's ARN.

<!-- edge:e4 -->
ALB to [@web-1](isodraw:node/ec2a) over plain HTTP on port 8000, inside the VPC. The ALB adds `X-Forwarded-For`, `X-Forwarded-Proto` and `X-Amzn-Trace-Id`. Django trusts these only from the ALB's subnets.

<!-- edge:e5 -->
Same as the other web server connections: HTTP on port 8000, with health checks on `/healthz` every 10 seconds.

<!-- edge:e6 -->
Same as the other web server connections. When web-3 is being replaced during a deploy, the ALB drains it for 30 seconds before the instance stops.

<!-- edge:e7 -->
Django to PostgreSQL with `psycopg` 3 over TLS.

| Setting | Value |
| --- | --- |
| Pool | 20 connections per instance (`CONN_MAX_AGE=60`) |
| Connect timeout | 3 s |
| Statement timeout | 5 s for the app role |

Example of the booking transaction:

```sql
BEGIN;
SELECT id FROM slots
 WHERE id = $1 AND status = 'open'
   FOR UPDATE;
INSERT INTO reservations (slot_id, user_id, party_size, status)
VALUES ($1, $2, 4, 'confirmed');
UPDATE slots SET status = 'booked' WHERE id = $1;
COMMIT;
```

<!-- edge:e8 -->
Asynchronous streaming replication. Typical lag is under a second; reporting queries read from the replica.

An alarm fires when `ReplicaLag` stays above 30 seconds for 5 minutes. Above that the app stops reading from the replica (see [@RDS replica](isodraw:node/rds2)).

<!-- edge:e9 -->
Web servers to Redis over TLS on port 6379, with a 50 ms command timeout. Reads use `GET` and `MGET`; booking writes delete keys with `UNLINK`, so a delete never blocks.

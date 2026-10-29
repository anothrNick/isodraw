<!-- diagram -->
## Overview

**Northwind Market** is an online grocery shop. Its services run on one [@EKS cluster](isodraw:node/eks), with a namespace per team, so each team deploys on its own schedule while sharing the platform.

A shopper's request goes through [@Route 53](isodraw:node/dns) and the [@Ingress ALB](isodraw:node/alb) to [@storefront](isodraw:node/storefront). That then calls [@cart](isodraw:node/cart) and [@orders](isodraw:node/orders-svc) over the [@Istio](isodraw:node/mesh) mesh. State lives outside the cluster, in [@Aurora](isodraw:node/aurora) and [@Redis](isodraw:node/redis).

## Ownership

| Namespace | Team | Services | On-call |
| --- | --- | --- | --- |
| [@namespace: web](isodraw:node/ns-web) | Storefront | storefront, cart | #storefront-oncall |
| [@namespace: orders](isodraw:node/ns-orders) | Checkout | orders, payments | #checkout-oncall |
| [@namespace: platform](isodraw:node/ns-platform) | Platform | Prometheus, Argo CD, Istio | #platform-oncall |

## How a change ships

1. A merge to `main` builds an image and pushes it to [@ECR](isodraw:node/ecr), tagged with the commit SHA.
2. CI updates the image tag in the `deploy` repo.
3. [@Argo CD](isodraw:node/argocd) syncs the change, and [@Istio](isodraw:node/mesh) shifts traffic to the new version: 5%, then 25%, then 100%, checking error rates between steps.

<!-- node:users -->
Shoppers on the website and the mobile apps.

| Metric | Value |
| --- | --- |
| Weekly active shoppers | 340k |
| Peak traffic | Sunday 6–9 pm, about 1,800 requests/s |
| Orders per day | 22k |

<!-- node:dns -->
DNS for `shop.example.com`, with a failover record that keeps a static "we'll be right back" page available if the cluster is down.

| Setting | Value |
| --- | --- |
| Service | Amazon Route 53 |
| Primary record | Alias `shop.example.com` → the [@Ingress ALB](isodraw:node/alb) |
| Failover record | Alias to a CloudFront distribution serving the maintenance page |
| Health check | `GET https://shop.example.com/healthz` every 10 s from 3 regions |
| TTL | 60 s |

## Error cases

- **Health check failing:** after 3 failures (about 30 s), Route 53 answers with the failover record. Shoppers see the maintenance page instead of errors.
- **Records changed by hand:** don't. Records are managed by ExternalDNS from the Ingress, so manual changes are overwritten.

<!-- node:alb -->
The internet-facing load balancer for the cluster. The AWS Load Balancer Controller creates it from the `web` namespace's Ingress.

| Setting | Value |
| --- | --- |
| Service | Elastic Load Balancing (Application Load Balancer) |
| TLS | ACM certificate for `shop.example.com`; TLS 1.2+ policy |
| WAF | AWS managed common rules, a bot control rule set and a rate limit |
| Targets | Pod IPs directly (`target-type: ip`), no node ports |

## Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: storefront
  namespace: web
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/healthcheck-path: /healthz
spec:
  rules:
    - host: shop.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service: { name: storefront, port: { number: 3000 } }
```

## Error cases

| Status | Cause |
| --- | --- |
| `502` | A pod was killed while handling a request. Pods have a `preStop` sleep of 15 s so the ALB stops sending them traffic first |
| `503` | No healthy storefront pods; usually a bad deploy that Argo CD is rolling back |
| `403` | Blocked by WAF; check the WAF logs for the matched rule |

<!-- node:eks -->
The production Kubernetes cluster that runs every Northwind service.

| Setting | Value |
| --- | --- |
| Service | Amazon EKS, Kubernetes 1.33 |
| Nodes | Karpenter-managed Graviton instances (`m7g`, `c7g`) across 3 AZs; spot for stateless pods |
| Networking | VPC CNI with prefix delegation; network policies on |
| Access | IAM roles for service accounts on every workload; no node-level IAM permissions |
| Add-ons | AWS Load Balancer Controller, ExternalDNS, cert-manager, Karpenter |

## Upgrades

- [x] Move from Cluster Autoscaler to Karpenter
- [x] IRSA for every service account
- [ ] Upgrade to Kubernetes 1.34 before the end of the quarter
- [ ] Move to EKS Pod Identity

## Error cases

- **Spot interruption:** Karpenter gets a 2-minute warning, starts a replacement node and drains the old one. Pod disruption budgets keep at least 2 replicas of each service running.
- **Pods `Pending`:** Karpenter couldn't find a matching instance type (often an anti-affinity rule that's too strict). Check `kubectl describe pod`.
- **Node `NotReady`:** Karpenter replaces nodes that stay unhealthy for 10 minutes.

<!-- node:ns-web -->
The Storefront team's namespace: [@storefront](isodraw:node/storefront) and [@cart](isodraw:node/cart). Deploys go out on every merge to `main`, many times a day.

| Quota | Limit |
| --- | --- |
| CPU requests | 40 cores |
| Memory requests | 80 GiB |
| Pods | 150 |

<!-- node:ns-orders -->
The Checkout team's namespace: [@orders](isodraw:node/orders-svc) and [@payments](isodraw:node/payments). Changes need a review from the Checkout team, and deploys are frozen on Sunday evenings, the busiest time.

Network policy: only [@storefront](isodraw:node/storefront) may call `orders`, and only `orders` may call `payments`.

<!-- node:ns-platform -->
Shared tooling run by the Platform team: [@Prometheus](isodraw:node/prometheus), [@Argo CD](isodraw:node/argocd) and [@Istio](isodraw:node/mesh). Other teams can read resources here but can't change them.

<!-- node:storefront -->
The shop's web frontend: product pages, search, the basket and the checkout screens, rendered on the server.

| Setting | Value |
| --- | --- |
| Stack | Next.js 15 (Node.js 22), port 3000 |
| Replicas | 6 to 30, scaled by CPU (60% target) |
| Resources | 500m CPU and 1 GiB memory per pod |
| Calls | [@cart](isodraw:node/cart) over HTTP; [@orders](isodraw:node/orders-svc) over gRPC |

## Example: product page data

`GET /api/products/sku-88213` returns:

```json
{
  "sku": "sku-88213",
  "name": "Organic Bananas (6 pack)",
  "priceCents": 299,
  "inStock": true,
  "badges": ["organic", "local"]
}
```

## Error cases

| Case | What the shopper sees |
| --- | --- |
| Cart service unavailable | The page loads with an empty basket and a "basket temporarily unavailable" banner |
| Orders service slow (over 2 s) | Checkout shows "Still working…", then a retry button |
| Unhandled exception | A friendly `500` page with a reference ID matching the logs |

<!-- node:cart -->
Holds each shopper's basket. It is stateless itself and keeps baskets in [@Redis](isodraw:node/redis).

| Setting | Value |
| --- | --- |
| Stack | Go 1.23, port 8080 |
| Replicas | 3 to 12 |
| Storage | Redis hash `cart:{shopperId}`, expiring 30 days after the last change |

## API

| Method | Path | Body |
| --- | --- | --- |
| `GET` | `/carts/{shopperId}` | |
| `PUT` | `/carts/{shopperId}/items/{sku}` | `{ "qty": 2 }` |
| `DELETE` | `/carts/{shopperId}/items/{sku}` | |

Response:

```json
{
  "shopperId": "shp_5521",
  "items": [{ "sku": "sku-88213", "qty": 2, "priceCents": 299 }],
  "subtotalCents": 598,
  "updatedAt": "2026-10-29T18:02:44Z"
}
```

## Error cases

- **Quantity over 99:** `400 invalid_quantity`.
- **Redis timeout (over 100 ms):** `503`. The storefront shows the basket as unavailable rather than empty, so shoppers don't think they lost it.

<!-- node:orders-svc -->
Turns a basket into an order: it checks stock, reserves a delivery slot, takes payment and records the order.

| Setting | Value |
| --- | --- |
| Stack | Java 21, Spring Boot 3.4, gRPC on port 9090 |
| Replicas | 4 to 16 |
| Database | `orders` schema in [@Aurora](isodraw:node/aurora) |

## Service levels

| Method | Target |
| --- | --- |
| `PlaceOrder` | 99.9% under 300 ms |
| `GetOrder` | 99.9% under 100 ms |

## `PlaceOrder`

```protobuf
rpc PlaceOrder(PlaceOrderRequest) returns (Order);

message PlaceOrderRequest {
  string shopper_id = 1;
  string cart_version = 2;      // fails if the basket changed since checkout opened
  string delivery_slot_id = 3;
  string payment_method_id = 4;
  string idempotency_key = 5;
}
```

Steps: reserve stock and the delivery slot in one transaction, then call [@payments](isodraw:node/payments), then mark the order `confirmed`. If payment fails, the reservation is released.

## Error cases

| gRPC status | Reason | Storefront shows |
| --- | --- | --- |
| `FAILED_PRECONDITION` | `cart_changed` | "Your basket changed. Please review it." |
| `RESOURCE_EXHAUSTED` | `slot_full` | Other delivery slots to choose from |
| `ABORTED` | `payment_declined` | The card's decline reason |
| `UNAVAILABLE` | Aurora failover or overload | Retried automatically, then "Try again" |
| `ALREADY_EXISTS` | Same idempotency key | The original order (not an error to the shopper) |

<!-- node:payments -->
The only service that talks to the card processor. It is PCI-scoped and isolated from everything else.

| Setting | Value |
| --- | --- |
| Stack | Kotlin, Ktor, gRPC on port 9090 |
| Nodes | Dedicated node group with a taint; no other pods share these nodes |
| Network | Only [@orders](isodraw:node/orders-svc) may call it; outbound only to the processor's IP ranges |
| Secrets | Processor API key from Secrets Manager, rotated every 90 days |

> Never log card data. The service only ever sees processor tokens like `pm_1Q2w3E`, never card numbers.

## Charge request (to the processor)

```json
{
  "amount": 4812,
  "currency": "usd",
  "payment_method": "pm_1Q2w3E",
  "idempotency_key": "ord_77120-charge",
  "capture": true
}
```

## Error cases

| Processor response | Returned to orders |
| --- | --- |
| `card_declined` / `insufficient_funds` | `ABORTED`, with the decline reason |
| `authentication_required` (3-D Secure) | `FAILED_PRECONDITION`, with a URL for the shopper to confirm |
| Timeout after 8 s | `UNAVAILABLE`; the retry reuses the idempotency key, so the card can't be charged twice |

<!-- node:prometheus -->
Collects metrics from every pod and fires alerts.

| Setting | Value |
| --- | --- |
| Stack | kube-prometheus-stack (Prometheus, Alertmanager, Grafana) |
| Scraping | Every pod with the `prometheus.io/scrape: "true"` annotation, every 30 s |
| Retention | 15 days in the cluster; long-term copies go to Amazon Managed Service for Prometheus |

## Key alerts

| Alert | Expression | Severity |
| --- | --- | --- |
| `HighErrorRate` | 5xx above 2% of requests for 5 min | Page |
| `OrdersLatency` | `PlaceOrder` p99 above 300 ms for 10 min | Page |
| `PodCrashLooping` | Restarts above 3 in 15 min | Ticket |
| `CertExpiringSoon` | Certificate expires within 14 days | Ticket |

<!-- node:argocd -->
The GitOps controller: it makes the cluster match what's in the `deploy` repo.

| Setting | Value |
| --- | --- |
| Stack | Argo CD 2.13 with Argo Rollouts |
| Source | `github.com/northwind/deploy`, one folder per namespace |
| Sync | Automatic, with pruning and self-heal on |
| Images | Pulled from [@ECR](isodraw:node/ecr) |

## Rollouts

Every service uses a canary rollout: 5% of traffic for 5 minutes, then 25% for 10 minutes, then 100%. Between steps, Argo Rollouts checks the error rate in Prometheus and rolls back automatically if it's above 1%.

## Error cases

- **`OutOfSync` that won't clear:** someone changed a resource by hand with `kubectl`. Self-heal reverts it; make the change in Git instead.
- **`Degraded`:** the new pods failed their health checks. The rollout stops and traffic stays on the old version.
- **Image pull errors:** the tag doesn't exist in ECR, usually because CI pushed to a different repository.

<!-- node:mesh -->
The service mesh that secures and controls traffic between pods.

| Setting | Value |
| --- | --- |
| Stack | Istio 1.24, sidecar mode |
| Security | Strict mTLS between all pods; identity from service accounts |
| Traffic | Retries, timeouts and the weighted routing used by canary rollouts |

## Default policy for calls to `orders`

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: orders
  namespace: orders
spec:
  hosts: [orders.orders.svc.cluster.local]
  http:
    - timeout: 2s
      retries:
        attempts: 2
        perTryTimeout: 800ms
        retryOn: unavailable,reset
      route:
        - destination: { host: orders, subset: stable }
          weight: 100
```

## Error cases

- **`503 UF` or `URX` in sidecar logs:** the upstream refused the connection, or retries ran out. Check the target's pods.
- **Calls fail with TLS errors right after a deploy:** the new pod started before its sidecar was ready. Pods use `holdApplicationUntilProxyStarts: true` to prevent this.

<!-- node:ecr -->
The container registry for every Northwind service.

| Setting | Value |
| --- | --- |
| Service | Amazon ECR, one repository per service |
| Tags | Immutable; images are tagged with the git commit SHA |
| Scanning | Enhanced scanning (Inspector) on push and continuously |
| Lifecycle | Keep the last 50 images per repository |

A critical vulnerability found on push fails the CI pipeline before the image can be deployed.

<!-- node:aurora -->
The relational database for services that need transactions, mainly [@orders](isodraw:node/orders-svc).

| Setting | Value |
| --- | --- |
| Service | Amazon Aurora PostgreSQL 16 |
| Instances | 1 writer and 2 readers (`db.r7g.2xlarge`) |
| Isolation | One schema and one database user per service; no cross-schema joins |
| Backups | Continuous, with 14 days of point-in-time recovery |
| Connections | Through RDS Proxy, so pod restarts don't create connection storms |

## Error cases

| Event | Effect | Handling |
| --- | --- | --- |
| Writer failover | 20–30 s of failed writes | RDS Proxy holds connections; orders returns `UNAVAILABLE` and the storefront retries |
| Long-running query | Locks held, checkout slows | `statement_timeout = 3s` for service users |
| Schema migration | Locks a table | Migrations run as a pre-sync Argo CD job and must be backward compatible |

<!-- node:redis -->
In-memory store for shopper baskets and sessions.

| Setting | Value |
| --- | --- |
| Service | Amazon ElastiCache for Redis 7, cluster mode on |
| Shards | 3 shards, each with 1 replica, across AZs |
| Persistence | Daily snapshot, kept for 3 days |
| Eviction | `volatile-lru`: only keys with a TTL can be evicted |

## Keys

| Key | Type | TTL |
| --- | --- | --- |
| `cart:{shopperId}` | Hash of SKU → quantity | 30 days |
| `session:{id}` | String (JSON) | 24 hours |

## Error cases

- **Shard failover:** the replica takes over in under 30 s. [@cart](isodraw:node/cart) returns `503` meanwhile.
- **Memory full:** session keys are evicted first. Baskets are big enough that an alarm fires at 75% memory, well before that point.

<!-- edge:e1 -->
Shoppers resolve `shop.example.com` with Route 53, then connect over HTTPS. Browsers and the apps cache the answer for 60 seconds.

<!-- edge:e2 -->
Route 53 alias record to the ALB's DNS name. Alias records have no extra lookup cost and follow the ALB's IP changes automatically.

<!-- edge:e3 -->
The ALB forwards HTTPS traffic to storefront pods on port 3000, adding `X-Forwarded-For` and `X-Amzn-Trace-Id`. The trace ID is passed along to every downstream call.

<!-- edge:e4 -->
HTTP/1.1 over the mesh (mTLS) to `cart.web.svc.cluster.local:8080`, with a 500 ms timeout and one retry on connection errors.

<!-- edge:e5 -->
Over the mesh with mTLS. Retries twice on `UNAVAILABLE`, with a 2 s overall deadline.

Example call metadata:

```text
:path        /northwind.orders.v1.Orders/PlaceOrder
x-shopper-id shp_5521
x-request-id 9c1e0a77-…
grpc-timeout 2S
```

<!-- edge:e6 -->
gRPC `Charge` call over the mesh. The timeout is 8 s, the processor's own limit, and retries are **off** in the mesh: retrying a charge is left to orders, which reuses the idempotency key.

<!-- edge:e7 -->
JDBC through RDS Proxy (`orders-proxy.proxy-…rds.amazonaws.com:5432`) with IAM authentication. HikariCP pool of 10 per pod. Reads that can be slightly stale use the reader endpoint.

<!-- edge:e8 -->
Cluster-mode Redis client with TLS, a 100 ms command timeout and connection pooling. Basket updates use `HINCRBY` so two tabs updating at once don't overwrite each other.

<!-- edge:e9 -->
Kubernetes pulls images from ECR using the node's credentials. The image tag in each manifest is the commit SHA, so a sync always deploys exactly the image that was tested.

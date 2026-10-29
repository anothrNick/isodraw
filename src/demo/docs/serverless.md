<!-- diagram -->
## Overview

The order API for **Brewbox**, a coffee subscription and one-off order shop. The mobile app places orders through this API, and everything after checkout (receipts, emails, the fulfilment partner) runs asynchronously.

How one order flows:

1. The [@Mobile app](isodraw:node/client) signs the user in with [@Cognito](isodraw:node/cognito) and calls [@API Gateway](isodraw:node/apigw) with the token.
2. [@orders-api](isodraw:node/orders) validates the order, stores it in [@Orders table](isodraw:node/ddb) and puts an `OrderPlaced` event on [@order-events](isodraw:node/sqs). The customer gets `201 Created` straight away.
3. [@notify](isodraw:node/notify) picks up the event, writes a PDF receipt to [@Receipts](isodraw:node/receipts) and publishes to [@order-updates](isodraw:node/sns), which emails the customer and calls the fulfilment partner's webhook.

## Design choices

- **No servers to run.** Every part is managed and scales to zero overnight.
- **Checkout never waits on email.** Slow or failing downstream work happens after the response, and retries from the queue.
- **Safe retries.** `POST /orders` takes an `Idempotency-Key`, so a retry after a timeout can't charge twice.

## Targets

| Metric | Target |
| --- | --- |
| `POST /orders` latency (p99) | 250 ms |
| Receipt emailed after order | Within 60 s for 99% of orders |
| Monthly cost at 50k orders | Under $150 |

<!-- node:client -->
Brewbox's iOS and Android apps (React Native). Customers browse coffees, manage subscriptions and place orders.

## Auth

The app signs in through the [@Cognito](isodraw:node/cognito) hosted UI (authorization code flow with PKCE) and keeps the tokens in the device keychain. Every API call sends the access token:

```http
Authorization: Bearer eyJraWQiOiJ…
```

When a call returns `401`, the app refreshes the token once and retries. If the refresh fails, the user is sent back to sign in.

## Retries

| Response | App behavior |
| --- | --- |
| Network error or `5xx` on `POST /orders` | Retry up to 3 times with the **same** `Idempotency-Key` (1 s, 2 s, 4 s) |
| `429` | Wait for `Retry-After`, then retry |
| `4xx` (other) | Show the error message; don't retry |

<!-- node:cognito -->
The user directory for Brewbox customers. It handles sign-up, sign-in and tokens.

| Setting | Value |
| --- | --- |
| Service | Amazon Cognito user pool `brewbox-prod` |
| Sign-in | Email and password, or Sign in with Apple and Google |
| MFA | Optional TOTP |
| Tokens | Access and ID tokens last 1 hour; refresh tokens 30 days |
| Groups | `customers`, `support` (can read any order) |

## Token claims the API uses

```json
{
  "sub": "8d3c5f2e-91b0-4a7e-b3f6-0c2d9e1a4b77",
  "cognito:groups": ["customers"],
  "scope": "orders/write orders/read",
  "exp": 1793318400
}
```

[@API Gateway](isodraw:node/apigw) checks the signature, expiry and audience. [@orders-api](isodraw:node/orders) uses `sub` as the customer ID.

## Error cases

- **Account not confirmed:** sign-in fails with `UserNotConfirmedException`; the app offers to resend the code.
- **Too many failed sign-ins:** Cognito temporarily blocks the account. The app shows "Try again in a few minutes".
- **Signing keys rotated:** the API reloads Cognito's public keys automatically; nothing to do.

<!-- node:apigw -->
The public HTTPS entry point for the API. It checks tokens, applies throttling and invokes the Lambda function.

| Setting | Value |
| --- | --- |
| Service | Amazon API Gateway (HTTP API) |
| Domain | `api.brewbox.example.com` |
| Authorizer | JWT, issuer: the [@Cognito](isodraw:node/cognito) user pool |
| Throttling | 200 requests/s steady, 500 burst |
| CORS | `https://brewbox.example.com` only |

## Routes

| Route | Target | Auth | Scope |
| --- | --- | --- | --- |
| `POST /orders` | [@orders-api](isodraw:node/orders) | JWT | `orders/write` |
| `GET /orders/{id}` | [@orders-api](isodraw:node/orders) | JWT | `orders/read` |
| `GET /orders` | [@orders-api](isodraw:node/orders) | JWT | `orders/read` |
| `GET /health` | Mock integration | None | |

## Error cases

These come from API Gateway itself, before the function runs:

| Status | Body | Cause |
| --- | --- | --- |
| `401` | `{"message":"Unauthorized"}` | Missing, expired or badly signed token |
| `403` | `{"message":"Forbidden"}` | Token lacks the route's scope |
| `429` | `{"message":"Too Many Requests"}` | Over the throttling limit |
| `503` | `{"message":"Service Unavailable"}` | Lambda throttled (no concurrency left) |
| `504` | `{"message":"Endpoint request timed out"}` | The function took longer than 29 s |

<!-- node:backend -->
Everything Brewbox runs after the API layer: the two functions, the table, the queue, the topic and the receipts bucket. It's all deployed as one AWS SAM stack, `brewbox-orders`, from the `orders` repo.

<!-- node:orders -->
The Lambda function behind every `/orders` route. It validates orders, writes them to DynamoDB and announces them on the queue.

| Setting | Value |
| --- | --- |
| Service | AWS Lambda |
| Runtime | Node.js 22, arm64, 512 MB |
| Timeout | 10 s |
| Concurrency | Reserved: 100 |
| Permissions | `dynamodb:PutItem` and `GetItem` on the table, `sqs:SendMessage` on the queue |

## Request and response

```http
POST /orders
Idempotency-Key: 0b7e6c1a-2f44-4d1e-9a51-6cbe8f3d2a90

{
  "items": [
    { "sku": "ETH-YIRG-250", "qty": 2 },
    { "sku": "COL-HUILA-1KG", "qty": 1 }
  ],
  "shippingAddressId": "adr_19",
  "paymentMethodId": "pm_card_visa_4242"
}
```

`201 Created`:

```json
{
  "id": "ord_2026_000123",
  "status": "placed",
  "totalCents": 6400,
  "currency": "USD",
  "createdAt": "2026-10-29T16:20:05Z"
}
```

## Inside the function

Each request goes through these steps. An order that fails validation returns `400` before anything is written.

<!-- embed:ordersInternals -->

```ts
export const handler = async (event) => {
  const key = event.headers['idempotency-key'];
  const seen = await idempotency.get(key);
  if (seen) return seen.response;

  const order = validate(JSON.parse(event.body), event.requestContext.authorizer.jwt.claims.sub);
  await table.put(order, { condition: 'attribute_not_exists(SK)' });
  await queue.send({ type: 'OrderPlaced', orderId: order.id, customerId: order.customerId, totalCents: order.totalCents });

  return idempotency.save(key, { statusCode: 201, body: JSON.stringify(order) });
};
```

## Error cases

| Status | Code | When |
| --- | --- | --- |
| `400` | `invalid_order` | Unknown SKU, quantity outside 1–20, or an empty basket |
| `402` | `payment_declined` | The card was declined; the body includes the decline reason |
| `409` | `idempotency_conflict` | Same `Idempotency-Key` sent with a different body |
| `422` | `out_of_stock` | One or more items sold out; the body lists them |
| `500` | `internal_error` | A bug. The function logs the stack trace and the request ID |
| `503` | `try_again` | DynamoDB or SQS throttled the call after 3 SDK retries |

If the queue send fails after the order is saved, the function still returns `201`. A sweeper job finds orders without an event and sends it later, so nothing is lost.

## To do

- [x] Idempotency keys on `POST /orders`
- [x] Structured JSON logs with the request ID
- [ ] Move validation into a shared Lambda layer
- [ ] Turn on SnapStart once it's available for Node.js

<!-- node:ddb -->
The table holding every Brewbox order.

| Setting | Value |
| --- | --- |
| Service | Amazon DynamoDB, table `orders-prod` |
| Capacity | On-demand |
| Recovery | Point-in-time recovery (35 days) |
| Streams | Off; events go through [@order-events](isodraw:node/sqs) instead |

## Keys and indexes

| Key | Example | Notes |
| --- | --- | --- |
| Partition key `PK` | `CUST#8d3c5f2e…` | One partition per customer |
| Sort key `SK` | `ORDER#2026-10-29T16:20:05Z#ord_2026_000123` | Sorts a customer's orders by time |
| GSI `byStatus` | `status`, `createdAt` | Support dashboard: "all orders stuck in `placed`" |

## Example item

```json
{
  "PK": "CUST#8d3c5f2e-91b0-4a7e-b3f6-0c2d9e1a4b77",
  "SK": "ORDER#2026-10-29T16:20:05Z#ord_2026_000123",
  "status": "placed",
  "items": [{ "sku": "ETH-YIRG-250", "qty": 2, "unitCents": 1800 }],
  "totalCents": 6400,
  "ttl": null
}
```

## Error cases

- **`ConditionalCheckFailedException`:** the order ID already exists. This should only happen on a replay; the function treats it as a duplicate.
- **`ProvisionedThroughputExceededException`:** rare in on-demand mode, but possible when traffic doubles in seconds. The SDK retries with backoff, then the API returns `503`.
- **Hot partition:** one customer placing thousands of orders (a reseller). Not seen yet; the fix would be to add a suffix to their partition key.

<!-- node:sqs -->
The queue that separates checkout from everything that happens afterwards.

| Setting | Value |
| --- | --- |
| Service | Amazon SQS standard queue `order-events` |
| Visibility timeout | 60 s (six times the consumer's timeout) |
| Retention | 4 days |
| Dead-letter queue | `order-events-dlq` after 5 failed receives |
| Encryption | SSE-SQS |

## Message

```json
{
  "type": "OrderPlaced",
  "version": 1,
  "orderId": "ord_2026_000123",
  "customerId": "8d3c5f2e-91b0-4a7e-b3f6-0c2d9e1a4b77",
  "totalCents": 6400,
  "occurredAt": "2026-10-29T16:20:05Z"
}
```

## Error cases

- **Duplicates:** standard queues deliver at least once, so the same message can arrive twice. [@notify](isodraw:node/notify) skips any order it has already sent a receipt for.
- **Out of order:** messages can arrive in any order. Each message describes one order, so order doesn't matter.
- **Messages in the DLQ:** an alarm posts to #orders-alerts. After the bug is fixed, redrive the DLQ back to the main queue from the console.

<!-- node:notify -->
The Lambda function that handles everything after an order is placed: the PDF receipt, the customer email and the fulfilment hand-off.

| Setting | Value |
| --- | --- |
| Service | AWS Lambda, Node.js 22, 1024 MB (PDF rendering) |
| Trigger | [@order-events](isodraw:node/sqs), batches of up to 10 |
| Timeout | 10 s |
| Partial batch failures | On, so one bad message doesn't retry the whole batch |

## What it does for each message

1. Loads the order from [@Orders table](isodraw:node/ddb).
2. Renders a PDF receipt and uploads it to [@Receipts](isodraw:node/receipts) as `receipts/2026/10/ord_2026_000123.pdf`.
3. Publishes an `OrderConfirmed` message to [@order-updates](isodraw:node/sns), with a presigned link to the receipt (valid for 7 days).

## Error cases

| Failure | Result |
| --- | --- |
| Order not found (deleted, or a stale event) | Logged and dropped; not retried |
| S3 or SNS call fails | That message is reported as failed and comes back after 60 s |
| The same message fails 5 times | It moves to the DLQ and the alarm fires |

<!-- node:receipts -->
The bucket holding PDF receipts. Customers can download them from the app at any time, and finance needs them for 7 years.

| Setting | Value |
| --- | --- |
| Service | Amazon S3, bucket `brewbox-receipts-prod` |
| Access | Private; customers only get presigned links |
| Lifecycle | Move to Glacier Instant Retrieval after 90 days; delete after 7 years |
| Object Lock | Governance mode, 7 years (receipts can't be altered) |

If a customer asks for a receipt after their link expires, the app calls `GET /orders/{id}`, which returns a fresh link.

<!-- node:sns -->
The topic that tells the outside world about each order.

| Setting | Value |
| --- | --- |
| Service | Amazon SNS topic `order-updates` |
| Subscriptions | Email Lambda (customer emails through SES); HTTPS webhook to the fulfilment partner |
| Delivery retries | HTTPS: 3 immediate, then backoff for up to 1 hour |

## Webhook payload sent to the fulfilment partner

```json
{
  "event": "order.confirmed",
  "orderId": "ord_2026_000123",
  "shipTo": { "name": "Ada L.", "postalCode": "94110", "country": "US" },
  "items": [{ "sku": "ETH-YIRG-250", "qty": 2 }],
  "signature": "t=1793291234,v1=5f2b…"
}
```

The partner verifies `signature` with a shared secret before accepting the order.

## Error cases

- **Partner webhook down:** SNS keeps retrying for an hour, then sends the message to a dead-letter queue. Support re-sends it from the admin tool.
- **Email bounces:** SES marks the address. The app asks the customer to update their email the next time they open it.

<!-- node:logs -->
Logs, metrics, traces and alarms for the whole order flow.

| Setting | Value |
| --- | --- |
| Service | Amazon CloudWatch (Logs, Metrics, Alarms) and X-Ray |
| Log retention | 30 days, then exported to S3 |
| Log format | JSON, one line per request, including `requestId`, `orderId` and `durationMs` |

## Alarms

| Alarm | Threshold | Goes to |
| --- | --- | --- |
| `orders-api` errors | More than 1% for 5 minutes | Page on-call |
| `orders-api` p99 latency | Above 250 ms for 15 minutes | #orders-alerts |
| DLQ depth | Any message | #orders-alerts |
| API Gateway `5xx` | More than 0.5% for 5 minutes | Page on-call |

A useful Logs Insights query for a customer complaint:

```sql
fields @timestamp, status, durationMs, error.code
| filter orderId = "ord_2026_000123"
| sort @timestamp asc
```

<!-- edge:e1 -->
App to API over HTTPS (TLS 1.2+). Each call carries `Authorization: Bearer <access token>`; order creation also sends `Idempotency-Key`. Responses are JSON, compressed with gzip.

<!-- edge:e2 -->
API Gateway checks each token against Cognito's public signing keys (JWKS). It only fetches the keys, not each token, so Cognito sees almost no traffic from this. Validated tokens are cached for 5 minutes.

<!-- edge:e3 -->
API Gateway invokes the function synchronously with a payload format 2.0 event. The integration times out after 29 s, though the function's own timeout of 10 s is hit first.

<!-- edge:e4 -->
`PutItem` with `ConditionExpression: attribute_not_exists(SK)`, so a replay can't overwrite an existing order. Typical latency is 5–8 ms.

<!-- edge:e5 -->
`SendMessage` with the `OrderPlaced` event as the body, and the `orderId` as a message attribute for filtering:

```json
{ "type": "OrderPlaced", "version": 1, "orderId": "ord_2026_000123", "totalCents": 6400 }
```

If this call fails after the order is saved, the sweeper job sends it later (see [@orders-api](isodraw:node/orders)).

<!-- edge:e6 -->
Lambda polls the queue and invokes [@notify](isodraw:node/notify) with up to 10 messages, waiting at most 5 s to fill a batch. Failed messages are reported back individually (`batchItemFailures`), so only they are retried.

<!-- edge:e7 -->
`PutObject` with `ContentType: application/pdf` and server-side encryption. The key is `receipts/{yyyy}/{mm}/{orderId}.pdf`, so writing the same receipt twice just overwrites it with identical content.

<!-- edge:e8 -->
`Publish` with an `eventType` message attribute (`order.confirmed`). Subscriptions use filter policies, so the email Lambda and the partner webhook each receive only the events they handle.

<!-- edge:e9 -->
Every function writes structured JSON logs to its own log group (`/aws/lambda/orders-api`), plus X-Ray traces covering the API Gateway, Lambda and DynamoDB calls.

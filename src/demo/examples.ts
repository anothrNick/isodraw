import type { Diagram, DiagramEdge, DiagramNode } from '../lib';
import { sampleDiagram } from './sample';

const ICONS = 'https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons';
const svc = (name: string) => `${ICONS}/architecture-service/${name}.svg`;
const res = (name: string) => `${ICONS}/resource/${name}.svg`;

const md = (...lines: string[]) => lines.join('\n');
const ref = (id: string, label: string) => `[@${label}](isodraw:node/${id})`;

/** An AWS icon on a tile (or standing, for people/devices). */
function icon(id: string, label: string, src: string, x: number, y: number, extra: Partial<DiagramNode> = {}): DiagramNode {
  return { id, kind: 'image', label, src, x, y, w: 2, d: 2, h: 0.35, z: 0, color: '#ffffff', imageStyle: 'tile', ...extra };
}
function area(id: string, label: string, color: string, x: number, y: number, w: number, d: number, extra: Partial<DiagramNode> = {}): DiagramNode {
  return { id, kind: 'area', label, color, x, y, w, d, h: 0, z: 0, opacity: 0.12, ...extra };
}
function title(id: string, text: string, x: number, y: number, w: number): DiagramNode {
  return { id, kind: 'text', text, x, y, w, d: 2, h: 0, z: 0, color: '#0f172a', fontSize: 1.1 };
}
function edge(id: string, from: string, to: string, extra: Partial<DiagramEdge> = {}): DiagramEdge {
  return { id, from, to, color: '#475569', width: 2, routing: 'orthogonal', rounded: true, endMarker: 'arrow', ...extra };
}

// ---------------------------------------------------------------------------
// Serverless order API
// ---------------------------------------------------------------------------

const serverless: Diagram = {
  version: 1,
  doc: md(
    '## Overview',
    '',
    `A fully serverless order API. Clients call ${ref('apigw', 'API Gateway')}, which checks tokens issued by ${ref('cognito', 'Cognito')} and invokes ${ref('orders', 'orders-api')}. Orders are written to ${ref('ddb', 'Orders table')} and an \`OrderPlaced\` event goes to ${ref('sqs', 'order-events')} so notifications never slow down checkout.`,
    '',
    '## Key properties',
    '',
    '- No servers to patch; everything scales to zero',
    '- p99 latency target: **250 ms** for `POST /orders`',
    '- All functions log to CloudWatch with structured JSON',
  ),
  nodes: [
    title('title', 'Serverless order API', -2, -5, 14),
    icon('client', 'Mobile app', res('Mobileclient'), -5, 3, {
      imageStyle: 'standing',
      doc: md('iOS and Android apps. Users sign in with the hosted UI and send the ID token as a `Bearer` header.'),
    }),
    icon('cognito', 'Cognito', svc('AmazonCognito'), 0, -2.5, {
      doc: md(
        'User pool `orders-prod`.',
        '',
        '- Email + password, optional TOTP MFA',
        '- Access tokens live for **1 hour**',
        `- ${ref('apigw', 'API Gateway')} uses a JWT authorizer against this pool`,
      ),
    }),
    icon('apigw', 'API Gateway', svc('AmazonAPIGateway'), 0, 3, {
      doc: md(
        'HTTP API with a JWT authorizer.',
        '',
        '| Route | Target | Auth |',
        '| --- | --- | --- |',
        '| POST /orders | orders-api | required |',
        '| GET /orders/{id} | orders-api | required |',
        '| GET /health | mock | none |',
        '',
        'Throttling: 500 rps burst, 200 rps steady.',
      ),
    }),
    area('backend', 'Serverless backend', '#ed7100', 4, -2.5, 17.5, 14, { dashed: true, opacity: 0.06 }),
    icon('orders', 'orders-api', svc('AWSLambda'), 6, 3, {
      doc: md(
        'Node.js 22 function, 512 MB, arm64.',
        '',
        '```ts',
        'export const handler = async (event) => {',
        '  const order = validate(JSON.parse(event.body));',
        '  await table.put(order);',
        '  await queue.send({ type: "OrderPlaced", id: order.id });',
        '  return { statusCode: 201, body: JSON.stringify(order) };',
        '};',
        '```',
        '',
        '- [x] Idempotency keys on `POST /orders`',
        '- [ ] Move validation to a shared layer',
      ),
    }),
    icon('ddb', 'Orders table', svc('AmazonDynamoDB'), 12.5, -1, {
      doc: md(
        'On-demand capacity, point-in-time recovery on.',
        '',
        '| Key | Example |',
        '| --- | --- |',
        '| PK `customerId` | `cus_42` |',
        '| SK `orderId` | `ord_2026_0001` |',
        '',
        'GSI `byStatus` powers the support dashboard.',
      ),
    }),
    icon('sqs', 'order-events', svc('AmazonSimpleQueueService'), 12.5, 3, {
      doc: md(
        'Standard queue for `OrderPlaced` events.',
        '',
        '> Messages that fail 5 times go to the `order-events-dlq` dead-letter queue. An alarm fires when it is not empty.',
      ),
    }),
    icon('notify', 'notify', svc('AWSLambda'), 17.5, 3, {
      doc: md(
        `Consumes ${ref('sqs', 'order-events')} in batches of 10, renders a receipt to ${ref('receipts', 'Receipts')} and publishes to ${ref('sns', 'order-updates')}.`,
      ),
    }),
    icon('receipts', 'Receipts', svc('AmazonSimpleStorageService'), 17.5, -1, {
      doc: md('PDF receipts, kept for 7 years. Lifecycle rule moves objects to Glacier after 90 days.'),
    }),
    icon('sns', 'order-updates', svc('AmazonSimpleNotificationService'), 17.5, 7.5, {
      doc: md('Fan-out topic: email to the customer, and a webhook for the fulfilment partner.'),
    }),
    icon('logs', 'CloudWatch', svc('AmazonCloudWatch'), 6, 7.5, {
      doc: md(
        'Logs, metrics and alarms for every function.',
        '',
        '- `orders-api` error rate > 1% for 5 min → page on-call',
        '- DLQ depth > 0 → Slack #orders-alerts',
      ),
    }),
  ],
  edges: [
    edge('e1', 'client', 'apigw', { routing: 'curved', label: 'HTTPS', animation: 'packets', animationDirection: 'both' }),
    edge('e2', 'apigw', 'cognito', {
      lineStyle: 'dashed',
      color: '#c925d1',
      endMarker: 'open',
      label: 'verify JWT',
      doc: 'The authorizer caches validated tokens for 5 minutes, so Cognito sees very little traffic.',
    }),
    edge('e3', 'apigw', 'orders', { animation: 'flow' }),
    edge('e4', 'orders', 'ddb', { color: '#3b48cc', animation: 'packets', label: 'PutItem' }),
    edge('e5', 'orders', 'sqs', {
      color: '#dd344c',
      animation: 'packets',
      label: 'OrderPlaced',
      doc: md('Event shape:', '', '```json', '{ "type": "OrderPlaced", "id": "ord_…", "total": 4200 }', '```'),
    }),
    edge('e6', 'sqs', 'notify', { color: '#dd344c', animation: 'flow' }),
    edge('e7', 'notify', 'receipts', { lineStyle: 'dashed', color: '#7aa116' }),
    edge('e8', 'notify', 'sns', { color: '#dd344c' }),
    edge('e9', 'orders', 'logs', { lineStyle: 'dotted', color: '#94a3b8', endMarker: 'none', label: 'logs' }),
  ],
};

// ---------------------------------------------------------------------------
// Streaming IoT pipeline
// ---------------------------------------------------------------------------

const sensor = (id: string, label: string, y: number): DiagramNode => ({
  id,
  kind: 'block',
  label,
  x: -7,
  y,
  w: 1.5,
  d: 1.5,
  h: 0.75,
  z: 0,
  color: '#7aa116',
  doc: md(`Vibration and temperature sensor on ${label}. Publishes every 2 s over MQTT to ${ref('iot', 'IoT Core')}.`),
});

const streaming: Diagram = {
  version: 1,
  doc: md(
    '## Overview',
    '',
    `Telemetry from factory sensors flows through ${ref('iot', 'IoT Core')} into ${ref('kinesis', 'Kinesis')} and is enriched in real time by ${ref('enrich', 'enrich')}. Enriched events go two ways: hot data to ${ref('search', 'OpenSearch')} for live dashboards, and everything to the ${ref('lake', 'Data lake')} through ${ref('firehose', 'Firehose')} for analytics.`,
    '',
    '## Volumes',
    '',
    '| Metric | Typical | Peak |',
    '| --- | --- | --- |',
    '| Events / s | 4,000 | 15,000 |',
    '| Data / day | 120 GB | 400 GB |',
  ),
  nodes: [
    title('title', 'Streaming IoT pipeline', -2, -5, 16),
    area('floor', 'Factory floor', '#7aa116', -8.5, -1, 4.5, 8.5, {
      doc: md('Three production lines, each with one sensor gateway. More lines are added by registering a new thing in IoT Core.'),
    }),
    sensor('s1', 'Line 1', 0),
    sensor('s2', 'Line 2', 2.5),
    sensor('s3', 'Line 3', 5),
    icon('iot', 'IoT Core', svc('AWSIoTCore'), -1.5, 2, {
      doc: md(
        'MQTT broker and device registry.',
        '',
        '- Topic: `factory/{line}/telemetry`',
        `- A rule forwards every message to ${ref('kinesis', 'Kinesis')}`,
        '- Certificates rotate yearly',
      ),
    }),
    icon('kinesis', 'Kinesis', svc('AmazonKinesisDataStreams'), 3, 2, {
      doc: md('Data stream with **8 shards** (on-demand mode), partitioned by sensor id. Retention: 24 h.'),
    }),
    icon('enrich', 'enrich', svc('AWSLambda'), 7.5, 2, {
      doc: md(
        'Adds machine metadata and flags anomalies.',
        '',
        '1. Look up machine and line in the asset registry (cached)',
        '2. Convert units to SI',
        '3. Score against the rolling baseline; mark `anomaly: true` above 3σ',
      ),
    }),
    icon('search', 'OpenSearch', svc('AmazonOpenSearchService'), 12.5, 2, {
      doc: md('Last 7 days of enriched events. Powers the plant-floor dashboards that refresh every 5 s.'),
    }),
    icon('firehose', 'Firehose', svc('AmazonDataFirehose'), 7.5, 7, {
      doc: md('Buffers 5 minutes or 128 MB, converts to Parquet, and writes to the curated zone, partitioned by `date/line`.'),
    }),
    area('lake', 'Data lake', '#3fb27f', -2, 10, 12.5, 7.5, {
      doc: md(
        'S3-based lake governed by Lake Formation.',
        '',
        '| Zone | Format | Retention |',
        '| --- | --- | --- |',
        '| raw | JSON | 30 days |',
        '| curated | Parquet | 3 years |',
      ),
    }),
    icon('raw', 'raw', svc('AmazonSimpleStorageService'), -0.5, 11.5, { doc: 'Unmodified events, kept briefly for replay.' }),
    icon('curated', 'curated', svc('AmazonSimpleStorageService'), 6.5, 11.5, { doc: 'Clean, partitioned Parquet: the source of truth for analytics.' }),
    icon('glue', 'Glue crawler', svc('AWSGlue'), 3, 14.5, {
      doc: md(`Runs hourly over ${ref('curated', 'curated')} and keeps the \`telemetry\` table schema up to date.`),
    }),
    icon('athena', 'Athena', svc('AmazonAthena'), 13.5, 14.5, {
      doc: md('Ad-hoc SQL over the lake.', '', '```sql', 'SELECT line, avg(temp_c)', 'FROM telemetry', "WHERE dt = current_date", 'GROUP BY line;', '```'),
    }),
    icon('analysts', 'Analysts', res('Users'), 18, 14.5, { imageStyle: 'standing' }),
  ],
  edges: [
    edge('e1', 's1', 'iot', { color: '#7aa116', animation: 'packets', label: 'MQTT' }),
    edge('e2', 's2', 'iot', { color: '#7aa116', animation: 'packets' }),
    edge('e3', 's3', 'iot', { color: '#7aa116', animation: 'packets' }),
    edge('e4', 'iot', 'kinesis', { animation: 'packets', animationSpeed: 1.5 }),
    edge('e5', 'kinesis', 'enrich', { animation: 'packets', animationSpeed: 1.5 }),
    edge('e6', 'enrich', 'search', {
      color: '#3b48cc',
      animation: 'pulse',
      label: 'hot path',
      doc: 'Only the last 7 days, and only fields the dashboards need, to keep the cluster small.',
    }),
    edge('e7', 'enrich', 'firehose', { animation: 'flow', label: 'cold path' }),
    edge('e8', 'firehose', 'curated', { color: '#3fb27f', animation: 'flow' }),
    edge('e9', 'iot', 'raw', { lineStyle: 'dashed', color: '#94a3b8', routing: 'curved', label: 'archive' }),
    edge('e10', 'glue', 'curated', { lineStyle: 'dotted', color: '#8c4fff', endMarker: 'open' }),
    edge('e11', 'athena', 'glue', { lineStyle: 'dotted', color: '#8c4fff', label: 'catalog' }),
    edge('e12', 'analysts', 'athena', { routing: 'straight', animation: 'packets', animationDirection: 'both' }),
  ],
};

// ---------------------------------------------------------------------------
// Kubernetes microservices
// ---------------------------------------------------------------------------

const svcBlock = (id: string, label: string, x: number, y: number, color: string, doc: string, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  id,
  kind: 'block',
  label,
  x,
  y,
  w: 2.5,
  d: 2,
  h: 1,
  z: 0,
  color,
  doc,
  ...extra,
});

const kubernetes: Diagram = {
  version: 1,
  doc: md(
    '## Overview',
    '',
    `Microservices on an ${ref('eks', 'EKS cluster')}, one namespace per team. Traffic enters through ${ref('alb', 'Ingress ALB')}; services talk to each other over the mesh and keep state in ${ref('aurora', 'Aurora')} and ${ref('redis', 'Redis')}.`,
    '',
    '## Ownership',
    '',
    '| Namespace | Team | On-call |',
    '| --- | --- | --- |',
    '| web | Storefront | #storefront-oncall |',
    '| orders | Checkout | #checkout-oncall |',
    '| platform | Platform | #platform-oncall |',
  ),
  nodes: [
    title('title', 'Kubernetes microservices', 2, -7, 18),
    icon('users', 'Shoppers', res('Users'), -6, 4, { imageStyle: 'standing' }),
    icon('dns', 'Route 53', svc('AmazonRoute53'), -2, 4, { doc: 'Alias record `shop.example.com` → the ingress load balancer. Health-checked failover to a static page.' }),
    icon('alb', 'Ingress ALB', svc('ElasticLoadBalancing'), 1.5, 4, {
      doc: md('Created by the AWS Load Balancer Controller from the `web` Ingress.', '', '- TLS via ACM certificate', '- WAF managed rules attached'),
    }),
    area('eks', 'EKS cluster', '#ed7100', 4.5, -3, 20, 16, {
      dashed: true,
      opacity: 0.05,
      doc: md(
        'Kubernetes 1.33 on managed node groups (Graviton), spread across 3 AZs.',
        '',
        '- [x] Cluster autoscaler → Karpenter',
        '- [x] IRSA for every service account',
        '- [ ] Upgrade to 1.34 before end of quarter',
      ),
    }),
    area('ns-web', 'namespace: web', '#4f8cf7', 5.5, -2, 8, 7, { doc: 'Customer-facing frontends. Deploys on every merge to `main`.' }),
    area('ns-orders', 'namespace: orders', '#dd344c', 14.5, -2, 9, 7, { doc: 'Checkout domain. Changes need a review from the Checkout team.' }),
    area('ns-platform', 'namespace: platform', '#64748b', 5.5, 6, 18, 6, { doc: 'Shared tooling run by the Platform team. Other teams are read-only here.' }),
    svcBlock('storefront', 'storefront', 6.5, -0.5, '#4f8cf7', md(
      'Next.js app, 6 replicas, HPA on CPU 60%.',
      '',
      `Calls ${ref('cart', 'cart')} and ${ref('orders-svc', 'orders')} through the mesh.`,
    )),
    svcBlock('cart', 'cart', 10, 2, '#4f8cf7', md(`Go service holding carts in ${ref('redis', 'Redis')}. Stateless pods, 3 replicas.`)),
    svcBlock('orders-svc', 'orders', 15.5, -0.5, '#dd344c', md(
      'Java (Spring Boot) service.',
      '',
      '| Endpoint | SLO |',
      '| --- | --- |',
      '| POST /orders | 99.9% < 300 ms |',
      '| GET /orders/{id} | 99.9% < 100 ms |',
    )),
    {
      id: 'payments',
      kind: 'hexagon',
      label: 'payments',
      x: 20,
      y: 1.5,
      w: 2.5,
      d: 2,
      h: 1,
      z: 0,
      color: '#c925d1',
      doc: md('PCI-scoped service. Runs on a dedicated node group with stricter network policies.', '', '> Never log card data. Tokens only.'),
    },
    {
      id: 'prometheus',
      kind: 'pyramid',
      label: 'Prometheus',
      x: 7,
      y: 7.5,
      w: 2.5,
      d: 2.5,
      h: 1.75,
      z: 0,
      color: '#e5534b',
      doc: md('Scrapes every pod with a `prometheus.io/scrape` annotation. 15-day retention; long-term metrics go to Amazon Managed Prometheus.'),
    },
    {
      id: 'argocd',
      kind: 'cone',
      label: 'Argo CD',
      x: 12,
      y: 7.5,
      w: 2.5,
      d: 2.5,
      h: 2,
      z: 0,
      color: '#f2a93b',
      doc: md('GitOps controller. Every namespace is an Argo CD Application synced from the `deploy` repo.', '', `Pulls images from ${ref('ecr', 'ECR')}.`),
    },
    {
      id: 'mesh',
      kind: 'cylinder',
      label: 'Istio',
      x: 17,
      y: 7.5,
      w: 2.5,
      d: 2.5,
      h: 1.25,
      z: 0,
      color: '#39c5cf',
      doc: md('Service mesh providing mTLS between all pods, retries and traffic shifting for canary releases.'),
    },
    icon('ecr', 'ECR', svc('AmazonElasticContainerRegistry'), 12.25, 14.5, { doc: 'One repository per service. Images are scanned on push; critical CVEs block deploys.' }),
    icon('aurora', 'Aurora', svc('AmazonAurora'), 27, 0, {
      doc: md('Aurora PostgreSQL, one writer and two readers. Each service has its own schema and user; no cross-schema joins.'),
    }),
    icon('redis', 'Redis', svc('AmazonElastiCache'), 27, 5, { doc: 'ElastiCache for Redis (cluster mode). Carts expire after 30 days of inactivity.' }),
  ],
  edges: [
    edge('e1', 'users', 'dns', { routing: 'straight', animation: 'packets', animationDirection: 'both' }),
    edge('e2', 'dns', 'alb', { animation: 'flow' }),
    edge('e3', 'alb', 'storefront', { animation: 'packets', label: 'HTTPS' }),
    edge('e4', 'storefront', 'cart', { color: '#4f8cf7', animation: 'flow' }),
    edge('e5', 'storefront', 'orders-svc', {
      color: '#dd344c',
      animation: 'packets',
      label: 'gRPC',
      doc: 'Over the mesh with mTLS. Retries twice on `UNAVAILABLE`, with a 2 s overall deadline.',
    }),
    edge('e6', 'orders-svc', 'payments', { color: '#c925d1', animation: 'pulse' }),
    edge('e7', 'orders-svc', 'aurora', { color: '#3b48cc', label: 'SQL' }),
    edge('e8', 'cart', 'redis', { color: '#dd344c', routing: 'curved' }),
    edge('e9', 'argocd', 'ecr', { lineStyle: 'dashed', color: '#94a3b8', label: 'pull images' }),
  ],
};

export interface Example {
  id: string;
  name: string;
  diagram: Diagram;
}

export const EXAMPLES: Example[] = [
  { id: 'three-tier', name: 'Three-tier web app', diagram: sampleDiagram },
  { id: 'serverless', name: 'Serverless order API', diagram: serverless },
  { id: 'streaming', name: 'Streaming IoT pipeline', diagram: streaming },
  { id: 'kubernetes', name: 'Kubernetes microservices', diagram: kubernetes },
];

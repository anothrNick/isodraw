import type { Diagram, DiagramEdge, DiagramNode } from '../lib';
import { withDocs } from './docs';
import kubernetesDocs from './docs/kubernetes.md?raw';
import serverlessDocs from './docs/serverless.md?raw';
import streamingDocs from './docs/streaming.md?raw';
import { sampleDiagram } from './sample';
import { terraformExample } from './terraform';

// Layouts live here; each example's documentation is a Markdown file in ./docs.

const ICONS = 'https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons';
const svc = (name: string) => `${ICONS}/architecture-service/${name}.svg`;
const res = (name: string) => `${ICONS}/resource/${name}.svg`;

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

/** validate()'s detail diagram, a level further down: the checks an order goes through. */
const validateSteps: Diagram = {
  version: 1,
  nodes: [
    { id: 'schema', kind: 'hexagon', label: 'JSON schema', x: 0, y: 0, w: 2, d: 2, h: 0.5, z: 0, color: '#f2a93b' },
    { id: 'stock', kind: 'cylinder', label: 'stock levels', x: 4, y: 0, w: 2, d: 2, h: 1, z: 0, color: '#3b48cc' },
    { id: 'price', kind: 'block', label: 'price & tax', x: 8, y: 0, w: 2, d: 2, h: 0.75, z: 0, color: '#3fb27f' },
  ],
  edges: [edge('v1', 'schema', 'stock', { animation: 'packets' }), edge('v2', 'stock', 'price', { animation: 'packets' })],
};

/** The orders-api component's detail diagram: what happens inside one invocation. */
const ordersInternals: Diagram = {
  version: 1,
  nodes: [
    { id: 'in', kind: 'block', label: 'API event', x: 0, y: 0, w: 2, d: 2, h: 0.5, z: 0, color: '#8c4fff' },
    {
      id: 'validate',
      kind: 'hexagon',
      label: 'validate()',
      x: 4,
      y: 0,
      w: 2,
      d: 2,
      h: 0.75,
      z: 0,
      color: '#f2a93b',
      doc: 'Rejects an order before anything is written: the body must match the schema, every item must be in stock, and the total is recalculated server-side.\n\n```isodraw-detail\n```',
      detail: validateSteps,
    },
    { id: 'idem', kind: 'cylinder', label: 'idempotency cache', x: 4, y: 4, w: 2, d: 2, h: 1, z: 0, color: '#64748b' },
    { id: 'put', kind: 'block', label: 'table.put()', x: 8, y: 0, w: 2, d: 2, h: 0.75, z: 0, color: '#3b48cc' },
    { id: 'send', kind: 'block', label: 'queue.send()', x: 12, y: 0, w: 2, d: 2, h: 0.75, z: 0, color: '#dd344c' },
    { id: 'out', kind: 'pyramid', label: '201 Created', x: 12, y: 4, w: 2, d: 2, h: 1, z: 0, color: '#3fb27f' },
  ],
  edges: [
    edge('i1', 'in', 'validate', { animation: 'packets' }),
    edge('i2', 'validate', 'idem', { lineStyle: 'dashed', label: 'seen?', startMarker: 'arrow' }),
    edge('i3', 'validate', 'put', { animation: 'packets' }),
    edge('i4', 'put', 'send', { animation: 'packets' }),
    edge('i5', 'send', 'out', { color: '#3fb27f' }),
  ],
};

const serverless: Diagram = {
  version: 1,
  nodes: [
    title('title', 'Serverless order API', -2, -5, 14),
    icon('client', 'Mobile app', res('Mobileclient'), -5, 3, { imageStyle: 'standing' }),
    icon('cognito', 'Cognito', svc('AmazonCognito'), 0, -2.5),
    icon('apigw', 'API Gateway', svc('AmazonAPIGateway'), 0, 3),
    area('backend', 'Serverless backend', '#ed7100', 4, -2.5, 17.5, 14, { dashed: true, opacity: 0.06 }),
    icon('orders', 'orders-api', svc('AWSLambda'), 6, 3),
    icon('ddb', 'Orders table', svc('AmazonDynamoDB'), 12.5, -1),
    icon('sqs', 'order-events', svc('AmazonSimpleQueueService'), 12.5, 3),
    icon('notify', 'notify', svc('AWSLambda'), 17.5, 3),
    icon('receipts', 'Receipts', svc('AmazonSimpleStorageService'), 17.5, -1),
    icon('sns', 'order-updates', svc('AmazonSimpleNotificationService'), 17.5, 7.5),
    icon('logs', 'CloudWatch', svc('AmazonCloudWatch'), 6, 7.5),
  ],
  edges: [
    edge('e1', 'client', 'apigw', { routing: 'curved', label: 'HTTPS', animation: 'packets', animationDirection: 'both' }),
    edge('e2', 'apigw', 'cognito', { lineStyle: 'dashed', color: '#c925d1', endMarker: 'open', label: 'verify JWT' }),
    edge('e3', 'apigw', 'orders', { animation: 'flow' }),
    edge('e4', 'orders', 'ddb', { color: '#3b48cc', animation: 'packets', label: 'PutItem' }),
    edge('e5', 'orders', 'sqs', { color: '#dd344c', animation: 'packets', label: 'OrderPlaced' }),
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
});

const streaming: Diagram = {
  version: 1,
  nodes: [
    title('title', 'Streaming IoT pipeline', -2, -5, 16),
    area('floor', 'Factory floor', '#7aa116', -8.5, -1, 4.5, 8.5),
    sensor('s1', 'Line 1', 0),
    sensor('s2', 'Line 2', 2.5),
    sensor('s3', 'Line 3', 5),
    icon('iot', 'IoT Core', svc('AWSIoTCore'), -1.5, 2),
    icon('kinesis', 'Kinesis', svc('AmazonKinesisDataStreams'), 3, 2),
    icon('enrich', 'enrich', svc('AWSLambda'), 7.5, 2),
    icon('search', 'OpenSearch', svc('AmazonOpenSearchService'), 12.5, 2),
    icon('firehose', 'Firehose', svc('AmazonDataFirehose'), 7.5, 7),
    area('lake', 'Data lake', '#3fb27f', -2, 10, 12.5, 7.5),
    icon('raw', 'raw', svc('AmazonSimpleStorageService'), -0.5, 11.5),
    icon('curated', 'curated', svc('AmazonSimpleStorageService'), 6.5, 11.5),
    icon('glue', 'Glue crawler', svc('AWSGlue'), 3, 14.5),
    icon('athena', 'Athena', svc('AmazonAthena'), 13.5, 14.5),
    icon('analysts', 'Analysts', res('Users'), 18, 14.5, { imageStyle: 'standing' }),
  ],
  edges: [
    edge('e1', 's1', 'iot', { color: '#7aa116', animation: 'packets', label: 'MQTT' }),
    edge('e2', 's2', 'iot', { color: '#7aa116', animation: 'packets' }),
    edge('e3', 's3', 'iot', { color: '#7aa116', animation: 'packets' }),
    edge('e4', 'iot', 'kinesis', { animation: 'packets', animationSpeed: 1.5 }),
    edge('e5', 'kinesis', 'enrich', { animation: 'packets', animationSpeed: 1.5 }),
    edge('e6', 'enrich', 'search', { color: '#3b48cc', animation: 'pulse', label: 'hot path' }),
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

const svcBlock = (id: string, label: string, x: number, y: number, color: string): DiagramNode => ({
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
});

const kubernetes: Diagram = {
  version: 1,
  nodes: [
    title('title', 'Kubernetes microservices', 2, -7, 18),
    icon('users', 'Shoppers', res('Users'), -6, 4, { imageStyle: 'standing' }),
    icon('dns', 'Route 53', svc('AmazonRoute53'), -2, 4),
    icon('alb', 'Ingress ALB', svc('ElasticLoadBalancing'), 1.5, 4),
    area('eks', 'EKS cluster', '#ed7100', 4.5, -3, 20, 16, { dashed: true, opacity: 0.05 }),
    area('ns-web', 'namespace: web', '#4f8cf7', 5.5, -2, 8, 7),
    area('ns-orders', 'namespace: orders', '#dd344c', 14.5, -2, 9, 7),
    area('ns-platform', 'namespace: platform', '#64748b', 5.5, 6, 18, 6),
    svcBlock('storefront', 'storefront', 6.5, -0.5, '#4f8cf7'),
    svcBlock('cart', 'cart', 10, 2, '#4f8cf7'),
    svcBlock('orders-svc', 'orders', 15.5, -0.5, '#dd344c'),
    { id: 'payments', kind: 'hexagon', label: 'payments', x: 20, y: 1.5, w: 2.5, d: 2, h: 1, z: 0, color: '#c925d1' },
    { id: 'prometheus', kind: 'pyramid', label: 'Prometheus', x: 7, y: 7.5, w: 2.5, d: 2.5, h: 1.75, z: 0, color: '#e5534b' },
    { id: 'argocd', kind: 'cone', label: 'Argo CD', x: 12, y: 7.5, w: 2.5, d: 2.5, h: 2, z: 0, color: '#f2a93b' },
    { id: 'mesh', kind: 'cylinder', label: 'Istio', x: 17, y: 7.5, w: 2.5, d: 2.5, h: 1.25, z: 0, color: '#39c5cf' },
    icon('ecr', 'ECR', svc('AmazonElasticContainerRegistry'), 12.25, 14.5),
    icon('aurora', 'Aurora', svc('AmazonAurora'), 27, 0),
    icon('redis', 'Redis', svc('AmazonElastiCache'), 27, 5),
  ],
  edges: [
    edge('e1', 'users', 'dns', { routing: 'straight', animation: 'packets', animationDirection: 'both' }),
    edge('e2', 'dns', 'alb', { animation: 'flow' }),
    edge('e3', 'alb', 'storefront', { animation: 'packets', label: 'HTTPS' }),
    edge('e4', 'storefront', 'cart', { color: '#4f8cf7', animation: 'flow' }),
    edge('e5', 'storefront', 'orders-svc', { color: '#dd344c', animation: 'packets', label: 'gRPC' }),
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
  { id: 'serverless', name: 'Serverless order API', diagram: withDocs({ ...serverless, nodes: serverless.nodes.map((n) => (n.id === 'orders' ? { ...n, detail: ordersInternals } : n)) }, serverlessDocs) },
  { id: 'streaming', name: 'Streaming IoT pipeline', diagram: withDocs(streaming, streamingDocs) },
  { id: 'kubernetes', name: 'Kubernetes microservices', diagram: withDocs(kubernetes, kubernetesDocs) },
  { id: 'terraform', name: 'Imported from Terraform (AWS)', diagram: terraformExample },
];

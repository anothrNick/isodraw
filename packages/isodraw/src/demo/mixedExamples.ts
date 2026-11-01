import type { Diagram, DiagramEdge, DiagramNode } from '../lib';
import { cloudIconUrl } from '../lib/icons';
import { fitIsoIcon } from '../lib/isoIcons';
import { createImageNode } from '../lib/shapes';

// Examples that mix IsoDraw's isometric icons, Lucide icons and the cloud icon sets.
// Their docs are Markdown files in ./docs, like the other examples.

/** One of IsoDraw's isometric icons, a little larger than natural so it holds its own beside 2×2 cloud tiles. */
function iso(id: string, label: string, name: string, x: number, y: number, extra: Partial<DiagramNode> = {}): DiagramNode {
  const n = createImageNode(`isodraw:${name}`, label, 0, 0);
  return { ...fitIsoIcon({ ...n, w: n.w * 1.3 }, 'w'), id, x, y, ...extra };
}

/** A cloud service icon (`aws:…`, `azure:…`, `gcp:core/…`) on a tile. */
function cloud(id: string, label: string, ref: string, x: number, y: number): DiagramNode {
  const src = cloudIconUrl(ref);
  if (!src) throw new Error(`No icon for ${ref}`);
  return { id, kind: 'image', label, src, x, y, w: 2, d: 2, h: 0.35, z: 0, color: '#ffffff', imageStyle: 'tile' };
}

/**
 * Lucide icons used below (ISC), as the palette's Lucide tab makes them: the
 * icon's `currentColor` follows the root `color`, so its Icon color can change.
 */
const LUCIDE: Record<string, string> = {
  'chart-column':
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v16a2 2 0 0 0 2 2h16m-3-4V9m-5 8V5M8 17v-3"/>',
  truck:
    '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2m10 0H9m10 0h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></g>',
  'fingerprint-pattern':
    '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38 0 6.38-1 8.88m4.29-.98c.12-.6.43-2.3.5-3.02M2 12a10 10 0 0 1 18-6M2 16h.01m19.79 0c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2m2.31 12c.21-.66.45-1.32.57-2M9 6.8a6 6 0 0 1 9 5.2v2"/></g>',
  mail: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/></g>',
  'message-square':
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>',
  'git-branch':
    '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 6a9 9 0 0 0-9 9V3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/></g>',
  ticket:
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Zm11-4v2m0 10v2m0-8v2"/>',
};

/** A Lucide icon on a tile. */
function lucide(id: string, label: string, name: string, x: number, y: number, color = '#2563eb'): DiagramNode {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96" color="${color}">${LUCIDE[name]}</svg>`;
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return { id, kind: 'image', label, src, x, y, w: 2, d: 2, h: 0.35, z: 0, color: '#ffffff', imageStyle: 'tile' };
}

function area(id: string, label: string, color: string, x: number, y: number, w: number, d: number, extra: Partial<DiagramNode> = {}): DiagramNode {
  return { id, kind: 'area', label, color, x, y, w, d, h: 0, z: 0, opacity: 0.1, ...extra };
}
function title(id: string, text: string, x: number, y: number, w: number): DiagramNode {
  return { id, kind: 'text', text, x, y, w, d: 2, h: 0, z: 0, color: '#0f172a', fontSize: 1.1 };
}
function edge(id: string, from: string, to: string, extra: Partial<DiagramEdge> = {}): DiagramEdge {
  return { id, from, to, color: '#475569', width: 2, routing: 'orthogonal', rounded: true, endMarker: 'arrow', ...extra };
}

// ---------------------------------------------------------------------------
// Retail stores to Azure
// ---------------------------------------------------------------------------

export const retail: Diagram = {
  version: 1,
  nodes: [
    title('title', 'Retail stores to Azure', -6, -7, 20),
    iso('shoppers', 'Shoppers', 'users', -16, 4),
    area('store', 'Store #142', '#10b981', -11, -2.5, 11, 15),
    iso('checkout', 'Checkout lanes', 'card', -9.5, -0.5),
    iso('shelves', 'Shelf sensors', 'sensor', -9, 5, { color: '#10b981' }),
    iso('handhelds', 'Staff handhelds', 'phone', -9, 9.5),
    iso('wifi', 'Store Wi-Fi', 'wifi', -4.5, 7),
    iso('router', 'Store router', 'router', -4.5, 1),
    area('azure', 'Azure', '#0078d4', 2, -2.5, 21, 12.5, { dashed: true, opacity: 0.06 }),
    cloud('iothub', 'IoT Hub', 'azure:iot-hub', 3.5, 1),
    cloud('eventhubs', 'Event Hubs', 'azure:event-hubs', 8.5, 1),
    cloud('stockfn', 'stock-events', 'azure:function-apps', 13.5, 1),
    cloud('inventory', 'Inventory', 'azure:azure-cosmos-db', 19, 1),
    cloud('sales', 'Sales', 'azure:sql-database', 8.5, 6),
    lucide('dashboards', 'Store dashboards', 'chart-column', 15, 6),
    lucide('replenish', 'Replenishment', 'truck', 27, 1, '#0f766e'),
    iso('managers', 'Regional managers', 'laptop', 21, 13),
    area('hq', 'Head office', '#64748b', 2, 13, 11, 6.5),
    iso('firewall', 'HQ firewall', 'firewall', 3.5, 15),
    iso('erp', 'ERP', 'server-rack', 9, 15),
  ],
  edges: [
    edge('e1', 'shoppers', 'checkout', { routing: 'curved', animation: 'packets' }),
    edge('e2', 'checkout', 'router', { animation: 'packets', label: 'card auth' }),
    edge('e3', 'shelves', 'wifi', { color: '#10b981', animation: 'packets' }),
    edge('e4', 'handhelds', 'wifi', { animation: 'packets', animationDirection: 'both' }),
    edge('e5', 'wifi', 'router', { animation: 'flow' }),
    edge('e6', 'router', 'iothub', { color: '#0078d4', animation: 'packets', label: 'MQTT over TLS' }),
    edge('e7', 'iothub', 'eventhubs', { color: '#0078d4', animation: 'flow' }),
    edge('e8', 'eventhubs', 'stockfn', { color: '#0078d4', animation: 'packets' }),
    edge('e9', 'stockfn', 'inventory', { color: '#3b48cc', label: 'upsert' }),
    edge('e10', 'eventhubs', 'sales', { color: '#0078d4', animation: 'flow', label: 'sale events' }),
    edge('e11', 'sales', 'dashboards', { lineStyle: 'dashed', color: '#7c3aed' }),
    edge('e12', 'inventory', 'replenish', { color: '#0f766e', animation: 'pulse', label: 'reorder' }),
    edge('e13', 'dashboards', 'managers', { routing: 'curved', color: '#7c3aed' }),
    edge('e14', 'router', 'firewall', { lineStyle: 'dashed', color: '#64748b', label: 'SD-WAN' }),
    edge('e15', 'firewall', 'erp', { color: '#64748b' }),
    edge('e16', 'erp', 'sales', { lineStyle: 'dotted', color: '#64748b', label: 'prices & promos' }),
  ],
};

// ---------------------------------------------------------------------------
// Zero-trust remote access
// ---------------------------------------------------------------------------

export const zeroTrust: Diagram = {
  version: 1,
  nodes: [
    title('title', 'Zero-trust remote access', -6, -13, 20),
    iso('employee', 'Employee', 'user', -22, -1),
    iso('laptop', 'Managed laptop', 'laptop', -15, -1),
    iso('phone', 'Phone', 'phone', -15, -8),
    iso('contractors', 'Contractors', 'users', -15, 8),
    lucide('idp', 'Identity provider', 'fingerprint-pattern', -4, -5, '#7c3aed'),
    iso('proxy', 'Access proxy', 'shield', -3.5, 3),
    iso('siem', 'Security analytics', 'chart', -9, 14, { color: '#f59e0b' }),
    area('saas', 'SaaS', '#7c3aed', 2, -8, 15, 5),
    lucide('email', 'Email', 'mail', 3.5, -6.5),
    lucide('chat', 'Team chat', 'message-square', 8.5, -6.5),
    lucide('code', 'Code hosting', 'git-branch', 13.5, -6.5, '#0f172a'),
    area('gcp', 'Google Cloud (private)', '#4285f4', 2, -0.5, 15, 7, { dashed: true, opacity: 0.06 }),
    cloud('tools', 'Internal tools', 'gcp:core/cloudrun-512-color-rgb', 3.5, 2),
    cloud('hrdb', 'HR database', 'gcp:core/cloudsql-512-color', 8.5, 2),
    cloud('runners', 'Build runners', 'gcp:core/gke-512-color', 13.5, 2),
    area('office', 'HQ office', '#64748b', 2, 9.5, 11, 6),
    iso('connector', 'App connector', 'server', 3.5, 11.5),
    iso('files', 'File shares', 'storage', 8.5, 11.5),
  ],
  edges: [
    edge('e1', 'employee', 'laptop', { routing: 'straight' }),
    edge('e2', 'laptop', 'idp', { color: '#7c3aed', animation: 'packets', label: 'SSO' }),
    edge('e3', 'phone', 'idp', { color: '#7c3aed', routing: 'curved', lineStyle: 'dashed', label: 'MFA push' }),
    edge('e4', 'laptop', 'proxy', { animation: 'packets', animationDirection: 'both', label: 'every request' }),
    edge('e5', 'contractors', 'proxy', { routing: 'curved', animation: 'packets', label: 'browser only' }),
    edge('e6', 'idp', 'proxy', { color: '#7c3aed', lineStyle: 'dashed', endMarker: 'open', label: 'identity + device' }),
    edge('e7', 'idp', 'email', { color: '#7c3aed', lineStyle: 'dotted', label: 'SAML' }),
    edge('e8', 'idp', 'chat', { color: '#7c3aed', lineStyle: 'dotted' }),
    edge('e9', 'idp', 'code', { color: '#7c3aed', lineStyle: 'dotted' }),
    edge('e10', 'proxy', 'tools', { color: '#4285f4', animation: 'flow' }),
    edge('e11', 'tools', 'hrdb', { color: '#4285f4', label: 'SQL' }),
    edge('e12', 'runners', 'code', { lineStyle: 'dashed', color: '#0f172a', label: 'jobs' }),
    edge('e13', 'proxy', 'connector', { color: '#64748b', animation: 'flow', label: 'outbound tunnel' }),
    edge('e14', 'connector', 'files', { color: '#64748b', label: 'SMB' }),
    edge('e15', 'proxy', 'siem', { lineStyle: 'dotted', color: '#f59e0b', label: 'access logs' }),
    edge('e16', 'idp', 'siem', { lineStyle: 'dotted', color: '#f59e0b', routing: 'curved', label: 'sign-in logs' }),
  ],
};

// ---------------------------------------------------------------------------
// AI support assistant
// ---------------------------------------------------------------------------

export const aiAssistant: Diagram = {
  version: 1,
  nodes: [
    title('title', 'AI support assistant', -6, -10, 20),
    iso('customers', 'Customers', 'users', -17, 4),
    iso('help', 'Help center', 'browser', -12, -1),
    iso('widget', 'Chat widget', 'chat', -12, 4),
    iso('app', 'Mobile app', 'phone', -11.5, 9.5),
    area('aws', 'AWS', '#ed7100', -7, -2.5, 25, 14.5, { dashed: true, opacity: 0.05 }),
    cloud('apigw', 'API Gateway', 'aws:architecture-service/AmazonAPIGateway', -5.5, 4),
    iso('assistant', 'assistant', 'ai', -0.5, 4),
    cloud('bedrock', 'Bedrock', 'aws:architecture-service/AmazonBedrock', 5, -0.5),
    cloud('vectors', 'Vector index', 'aws:architecture-service/AmazonOpenSearchService', 6, 8.5),
    cloud('convos', 'Conversations', 'aws:architecture-service/AmazonDynamoDB', -5, 8.5),
    cloud('ingest', 'ingest', 'aws:architecture-service/AWSLambda', 11, 8.5),
    cloud('articles', 'Help articles', 'aws:architecture-service/AmazonSimpleStorageService', 15.5, 8.5),
    iso('kb', 'Knowledge base', 'document', 22, 8.5),
    lucide('ticketing', 'Ticketing', 'ticket', 1, 15.5, '#db2777'),
    iso('agents', 'Support agents', 'users', 8, 15.5, { color: '#db2777' }),
  ],
  edges: [
    edge('e1', 'customers', 'help', { routing: 'curved' }),
    edge('e2', 'customers', 'widget', { animation: 'packets', animationDirection: 'both' }),
    edge('e3', 'customers', 'app', { routing: 'curved' }),
    edge('e4', 'widget', 'apigw', { animation: 'packets', animationDirection: 'both', label: 'WebSocket' }),
    edge('e5', 'app', 'apigw', { animation: 'packets', animationDirection: 'both' }),
    edge('e6', 'apigw', 'assistant', { animation: 'flow' }),
    edge('e7', 'assistant', 'bedrock', { color: '#ed7100', animation: 'pulse', label: 'prompt + context' }),
    edge('e8', 'assistant', 'vectors', { color: '#3b48cc', label: 'top-k search' }),
    edge('e9', 'assistant', 'convos', { color: '#3b48cc', lineStyle: 'dashed', startMarker: 'arrow', label: 'history' }),
    edge('e10', 'assistant', 'ticketing', { color: '#db2777', routing: 'curved', label: 'hand off' }),
    edge('e11', 'ticketing', 'agents', { color: '#db2777', animation: 'packets' }),
    edge('e12', 'kb', 'articles', { color: '#7aa116', label: 'publish' }),
    edge('e13', 'articles', 'ingest', { color: '#7aa116', animation: 'flow', label: 'on change' }),
    edge('e14', 'ingest', 'vectors', { color: '#3b48cc', animation: 'packets', label: 'chunks + embeddings' }),
    edge('e15', 'ingest', 'bedrock', { color: '#ed7100', lineStyle: 'dotted', label: 'embed' }),
  ],
};

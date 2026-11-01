import type { Diagram, IconDef, IconLibrary } from './types';

const AWS_PKG = 'aws-icons';
const AWS_VERSION = '3.3.0';

const FOLDER_LABELS: Record<string, string> = {
  'architecture-service': 'Services',
  resource: 'Resources',
  'architecture-group': 'Groups',
  category: 'Categories',
};

/** "AmazonEC2" → "Amazon EC2", "AWSLambda" → "AWS Lambda". */
export function humanizeIconName(file: string): string {
  return file
    .replace(/\.svg$/i, '')
    .replace(/^(Amazon|AWS)(?=[A-Z0-9])/, '$1 ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .replace(/\b(Io T|Cloud (?:Front|Watch|Formation|Trail|Shell|Search|Map|HSM)|Dynamo DB|Elasti Cache|Sage Maker|Open Search|Event Bridge|Code (?:Build|Commit|Deploy|Pipeline|Guru|Catalyst|Whisperer)|Doc DB)\b/g, (m) =>
      m.replace(' ', ''),
    )
    .trim();
}

/**
 * Load the official AWS Architecture icon set at runtime from the jsDelivr CDN
 * (packaged on npm as `aws-icons`, MIT). Nothing is bundled; icons are
 * referenced by URL and inlined only when exporting.
 */
export async function loadAwsIconLibrary(
  opts: { version?: string; folders?: string[]; signal?: AbortSignal } = {},
): Promise<IconLibrary> {
  const version = opts.version ?? AWS_VERSION;
  const folders = opts.folders ?? ['architecture-service', 'resource', 'architecture-group', 'category'];
  const res = await fetch(`https://data.jsdelivr.com/v1/packages/npm/${AWS_PKG}@${version}?structure=flat`, {
    signal: opts.signal,
  });
  if (!res.ok) throw new Error(`Could not list AWS icons (${res.status})`);
  const listing = (await res.json()) as { files: { name: string }[] };
  const icons: IconDef[] = [];
  for (const f of listing.files) {
    const m = /^\/icons\/([^/]+)\/([^/]+\.svg)$/.exec(f.name);
    if (!m || !folders.includes(m[1])) continue;
    icons.push({
      id: `aws:${m[1]}/${m[2]}`,
      name: humanizeIconName(m[2]),
      src: `https://cdn.jsdelivr.net/npm/${AWS_PKG}@${version}${f.name}`,
      category: FOLDER_LABELS[m[1]] ?? m[1],
    });
  }
  icons.sort((a, b) => folders.indexOf(catKey(a)) - folders.indexOf(catKey(b)) || a.name.localeCompare(b.name));
  return { id: 'aws', name: 'AWS', icons };

  function catKey(i: IconDef) {
    return /^aws:([^/]+)/.exec(i.id)?.[1] ?? '';
  }
}

// ---------------------------------------------------------------------------
// Google Cloud
// ---------------------------------------------------------------------------

/** Google Cloud product icons (216), Iconify JSON, Apache-2.0. */
const GCP_PRODUCTS = 'https://cdn.jsdelivr.net/npm/@f5-sales-demo/icons-gcp@0.1.0/icons.json';
/** Google's newer core-product and category icons (45), MIT. */
const GCP_CORE = 'https://cdn.jsdelivr.net/npm/gcp-icons@1.0.6/dist';

/** Display names for the core set; its file names are run together ("cloudspanner-512-color"). */
const GCP_CORE_NAMES: Record<string, string> = {
  aihypercomputer: 'AI Hypercomputer', alloydb: 'AlloyDB', anthos: 'Anthos', apigee: 'Apigee', bigquery: 'BigQuery',
  cloudrun: 'Cloud Run', cloudsql: 'Cloud SQL', cloudspanner: 'Cloud Spanner', 'cloud-storage': 'Cloud Storage',
  computeengine: 'Compute Engine', distributedcloud: 'Distributed Cloud', gke: 'GKE', hyperdisk: 'Hyperdisk', looker: 'Looker',
  mandiant: 'Mandiant', securitycommandcenter: 'Security Command Center', secops: 'Security Operations',
  threatintelligence: 'Threat Intelligence', vertexai: 'Vertex AI',
  aimachinelearning: 'AI & Machine Learning', agents: 'Agents', businessintelligence: 'Business Intelligence', collaboration: 'Collaboration',
  compute: 'Compute', containers: 'Containers', dataanalytics: 'Data Analytics', databases: 'Databases', devops: 'DevOps',
  'developer-tools': 'Developer Tools', hybridmulticloud: 'Hybrid & Multicloud', integrationservices: 'Integration Services',
  managementtools: 'Management Tools', mapsgeospatial: 'Maps & Geospatial', marketplace: 'Marketplace', mediaservices: 'Media Services',
  migration: 'Migration', mixedreality: 'Mixed Reality', networking: 'Networking', observability: 'Observability', operations: 'Operations',
  securityidentity: 'Security & Identity', serverlesscomputing: 'Serverless Computing', storage: 'Storage', webmobile: 'Web & Mobile', web3: 'Web3',
};

/** Words that keep a particular casing in Google product names. */
const GCP_WORDS: Record<string, string> = {
  ai: 'AI', api: 'API', apis: 'APIs', automl: 'AutoML', bigquery: 'BigQuery', bigtable: 'Bigtable', cdn: 'CDN', cx: 'CX', dlp: 'DLP',
  dns: 'DNS', gce: 'GCE', gke: 'GKE', gpu: 'GPU', iam: 'IAM', iap: 'IAP', iot: 'IoT', kms: 'KMS', ml: 'ML', nat: 'NAT', nlp: 'NLP',
  sql: 'SQL', tpu: 'TPU', vm: 'VM', vpc: 'VPC', vpn: 'VPN', bi: 'BI', ids: 'IDS', os: 'OS', sap: 'SAP', apigee: 'Apigee',
};

const titleCase = (kebab: string, words: Record<string, string>) =>
  kebab
    .split('-')
    .map((w) => words[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

type IconifyJson = { width?: number; height?: number; icons: Record<string, { body: string; width?: number; height?: number }> };

/** An Iconify icon as a standalone SVG data URL; `color` is what its `currentColor` draws in. */
function iconifySvg(icon: { body: string; width?: number; height?: number }, set: IconifyJson, color?: string): string {
  const w = icon.width ?? set.width ?? 24;
  const h = icon.height ?? set.height ?? 24;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 4}" height="${h * 4}"${color ? ` color="${color}"` : ''}>${icon.body}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Google Cloud icons from the jsDelivr CDN: Google's newer core-product
 * icons first, then the full product icon set, then category icons.
 */
export async function loadGcpIconLibrary(opts: { signal?: AbortSignal } = {}): Promise<IconLibrary> {
  const [products, core] = await Promise.all([
    fetch(GCP_PRODUCTS, { signal: opts.signal }).then((r) => {
      if (!r.ok) throw new Error(`Could not load GCP icons (${r.status})`);
      return r.json() as Promise<IconifyJson>;
    }),
    fetch(`${GCP_CORE}/icons-metadata.json`, { signal: opts.signal })
      .then((r) => (r.ok ? (r.json() as Promise<{ key: string; source: string }[]>) : []))
      .catch(() => [] as { key: string; source: string }[]),
  ]);
  const coreIcons: IconDef[] = core.map((c) => {
    const base = c.key.replace(/-512-color(-rgb)?$/, '');
    return {
      id: `gcp:core/${c.key}`,
      name: GCP_CORE_NAMES[base] ?? titleCase(base, GCP_WORDS),
      src: `${GCP_CORE}/icons/${c.key}.svg`,
      category: c.source === 'category' ? 'Categories' : 'Core products',
    };
  });
  const productIcons: IconDef[] = Object.entries(products.icons).map(([key, icon]) => ({
    id: `gcp:product/${key}`,
    name: titleCase(key, GCP_WORDS),
    src: iconifySvg(icon, products),
    category: 'Products',
  }));
  const order = ['Core products', 'Products', 'Categories'];
  const icons = [...coreIcons, ...productIcons].sort(
    (a, b) => order.indexOf(a.category!) - order.indexOf(b.category!) || a.name.localeCompare(b.name),
  );
  return { id: 'gcp', name: 'GCP', icons };
}

// ---------------------------------------------------------------------------
// Azure
// ---------------------------------------------------------------------------

/**
 * Microsoft's Azure architecture icons (V24), redistributed unmodified.
 * Microsoft permits their use in architecture diagrams, training material and
 * documentation; see the package's NOTICE.
 */
const AZURE_PKG = 'https://cdn.jsdelivr.net/npm/@squinch/pack-azure@0.16.0';

/** Azure architecture icons from the jsDelivr CDN, grouped by Microsoft's categories. */
export async function loadAzureIconLibrary(opts: { signal?: AbortSignal } = {}): Promise<IconLibrary> {
  const res = await fetch(`${AZURE_PKG}/pack.json`, { signal: opts.signal });
  if (!res.ok) throw new Error(`Could not load Azure icons (${res.status})`);
  const pack = (await res.json()) as { icons: Record<string, { file: string; title: string; category: string }> };
  // Most-used categories first; the catch-alls last.
  const last = new Set(['General', 'Other', 'New Icons', 'Menu']);
  const icons: IconDef[] = Object.entries(pack.icons).map(([key, i]) => ({
    id: `azure:${key}`,
    name: i.title,
    src: `${AZURE_PKG}/icons/${i.file}`,
    category: i.category,
  }));
  icons.sort(
    (a, b) =>
      Number(last.has(a.category!)) - Number(last.has(b.category!)) ||
      a.category!.localeCompare(b.category!) ||
      a.name.localeCompare(b.name),
  );
  return { id: 'azure', name: 'Azure', icons };
}

/**
 * CDN URL for a cloud icon by reference, without loading a whole library:
 * `aws:<folder>/<File>`, `azure:<key>` or `gcp:core/<key>`. Returns null for
 * `gcp:product/…` icons, which only exist inside the GCP library JSON.
 */
export function cloudIconUrl(ref: string): string | null {
  const [lib, key] = [ref.slice(0, ref.indexOf(':')), ref.slice(ref.indexOf(':') + 1)];
  if (lib === 'aws') return `https://cdn.jsdelivr.net/npm/${AWS_PKG}@${AWS_VERSION}/icons/${key}.svg`;
  if (lib === 'azure') return `${AZURE_PKG}/icons/${key}.svg`;
  if (lib === 'gcp' && key.startsWith('core/')) return `${GCP_CORE}/icons/${key.slice(5)}.svg`;
  return null;
}

// ---------------------------------------------------------------------------
// Lucide
// ---------------------------------------------------------------------------

/** Lucide, the icon set the IsoDraw app itself uses (ISC), as Iconify JSON. */
const LUCIDE = 'https://cdn.jsdelivr.net/npm/@iconify-json/lucide@1.2.148/icons.json';
/** Lucide icons draw with `currentColor`, which is black inside an <img>; they start in the app's blue. */
const LUCIDE_COLOR = '#2563eb';

/** Every Lucide icon, loaded from the jsDelivr CDN, alphabetically. */
export async function loadLucideIconLibrary(opts: { signal?: AbortSignal } = {}): Promise<IconLibrary> {
  const res = await fetch(LUCIDE, { signal: opts.signal });
  if (!res.ok) throw new Error(`Could not load Lucide icons (${res.status})`);
  const set = (await res.json()) as IconifyJson;
  const icons: IconDef[] = Object.entries(set.icons)
    .map(([key, icon]) => ({
      id: `lucide:${key}`,
      name: titleCase(key, {}),
      src: iconifySvg(icon, set, LUCIDE_COLOR),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return { id: 'lucide', name: 'Lucide', icons };
}

const SVG_DATA = 'data:image/svg+xml,';
const ROOT_COLOR = /^(<svg\b[^>]*?\scolor=")(#[0-9a-f]{6})"/i;

/**
 * The color a recolorable icon draws in: an SVG data URL whose root sets
 * `color`, like the Lucide icons. Null for anything else.
 */
export function iconColor(src: string | undefined): string | null {
  if (!src?.startsWith(SVG_DATA)) return null;
  try {
    return ROOT_COLOR.exec(decodeURIComponent(src.slice(SVG_DATA.length)))?.[2] ?? null;
  } catch {
    return null;
  }
}

/** The same icon in another color (see iconColor); other sources come back unchanged. */
export function withIconColor(src: string, color: string): string {
  if (!iconColor(src) || !/^#[0-9a-f]{6}$/i.test(color)) return src;
  const svg = decodeURIComponent(src.slice(SVG_DATA.length)).replace(ROOT_COLOR, `$1${color}"`);
  return SVG_DATA + encodeURIComponent(svg);
}

// ---------------------------------------------------------------------------
// The user's own images
// ---------------------------------------------------------------------------

/**
 * An image the user brought: an uploaded file (a base64 data URL) or a link
 * they added. Not one of IsoDraw's icons, a cloud icon from the CDN or a Lucide icon.
 */
export function isUserImage(src: string | undefined): boolean {
  if (!src) return false;
  if (src.startsWith('data:')) return src.includes(';base64,');
  return /^https?:\/\//.test(src) && !src.startsWith('https://cdn.jsdelivr.net/npm/');
}

/** The user's images placed anywhere in a diagram, detail diagrams included, once each. */
export function diagramImages(d: Diagram): IconDef[] {
  const seen = new Set<string>();
  const out: IconDef[] = [];
  const walk = (level: Diagram) => {
    for (const n of level.nodes) {
      if (n.kind === 'image' && isUserImage(n.src) && !seen.has(n.src!)) {
        seen.add(n.src!);
        out.push({ id: `used:${n.id}`, name: n.label || 'Image', src: n.src!, category: 'In this diagram' });
      }
      if (n.detail) walk(n.detail);
    }
  };
  walk(d);
  return out;
}

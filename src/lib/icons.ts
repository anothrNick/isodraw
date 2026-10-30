import type { IconDef, IconLibrary } from './types';

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

/** An Iconify icon as a standalone SVG data URL. */
function iconifySvg(icon: { body: string; width?: number; height?: number }, set: IconifyJson): string {
  const w = icon.width ?? set.width ?? 24;
  const h = icon.height ?? set.height ?? 24;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 4}" height="${h * 4}">${icon.body}</svg>`;
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

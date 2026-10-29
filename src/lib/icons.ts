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

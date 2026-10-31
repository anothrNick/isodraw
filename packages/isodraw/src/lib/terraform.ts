import { cloudIconUrl, loadGcpIconLibrary } from './icons';
import { layeredLayout } from './layout';
import { catalogEntry, DOC_SETTINGS, type CatalogEntry } from './terraformCatalog';
import type { Diagram, DiagramEdge, DiagramNode, IconLibrary } from './types';

/**
 * Terraform import: turns a state file, `terraform show -json` output or a
 * plan (`terraform show -json plan.out`) into a laid-out diagram.
 *
 * Connections come from references between resources: from the configuration
 * in a plan, and otherwise from attribute values that contain another
 * resource's ID, ARN, hostname or name. Supporting resources (IAM, listeners,
 * attachments…) are not drawn; see `terraformCatalog.ts`.
 */

type Values = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped Terraform JSON
type Json = Record<string, any>;

interface Ref {
  target: string;
  /** Attribute path the reference was found under, e.g. `vpc_config.subnet_ids`. */
  path: string;
}

interface Resource {
  address: string;
  type: string;
  name: string;
  values: Values;
  sensitive: Set<string>;
  entry: CatalogEntry;
  refs: Ref[];
}

export type TerraformSource = 'state file' | 'state' | 'plan';

export interface TerraformImportSummary {
  source: TerraformSource;
  terraformVersion?: string;
  resources: number;
  components: number;
  areas: number;
  connections: number;
  /** Resource types left out of the drawing, with counts. */
  hidden: Record<string, number>;
  /** Types not in the catalog, drawn as plain blocks. */
  unrecognized: string[];
}

export interface TerraformImportResult {
  diagram: Diagram;
  summary: TerraformImportSummary;
}

export interface TerraformImportOptions {
  /** The loaded GCP icon library, for Google Cloud icons that only exist inside it. */
  gcpIcons?: IconLibrary;
}

/** Does this parsed JSON look like Terraform state or plan output? */
export function isTerraformJson(json: unknown): boolean {
  const o = json as Json;
  if (!o || typeof o !== 'object') return false;
  return (
    (o.version === 4 && Array.isArray(o.resources)) ||
    !!o.values?.root_module ||
    !!o.planned_values ||
    (typeof o.terraform_version === 'string' && 'format_version' in o)
  );
}

/**
 * Import Terraform JSON, loading the GCP icon library first when the file has
 * Google Cloud resources that need it (falls back to plain blocks offline).
 */
export async function importTerraform(json: unknown, opts: TerraformImportOptions = {}): Promise<TerraformImportResult> {
  const { resources } = readTerraform(json);
  let gcpIcons = opts.gcpIcons;
  if (!gcpIcons && resources.some((r) => r.entry.role === 'node' && typeof r.entry.icon === 'string' && r.entry.icon.startsWith('gcp:product/'))) {
    gcpIcons = await loadGcpIconLibrary().catch(() => undefined);
  }
  return terraformToDiagram(json, { ...opts, gcpIcons });
}

/** Synchronous import; Google Cloud icons that need the GCP library become blocks unless `gcpIcons` is given. */
export function terraformToDiagram(json: unknown, opts: TerraformImportOptions = {}): TerraformImportResult {
  const { resources, source, terraformVersion } = readTerraform(json);
  if (!resources.length) throw new Error('No managed resources found in this Terraform file');
  linkByValues(resources);
  const byAddr = new Map(resources.map((r) => [r.address, r]));
  const refsOf = mergedRefs(byAddr);

  const nodes = resources.filter((r) => r.entry.role === 'node');
  if (!nodes.length) throw new Error(`Found ${resources.length} Terraform resources, but none that are drawn as components`);
  const edges = inferEdges(resources, byAddr, refsOf);
  const { parents, spans } = placeInAreas(resources, byAddr, refsOf);

  // ---- diagram items ----
  const ids = new Map<Resource, string>();
  const used = new Set<string>();
  for (const r of resources) {
    let id = r.address
      .replace(/\[(\d+)\]/g, '-$1')
      .replace(/\["([^"]*)"\]/g, '-$1')
      .replace(/[^A-Za-z0-9_.-]/g, '_');
    for (let i = 2; used.has(id); i++) id = `${id}-${i}`;
    used.add(id);
    ids.set(r, id);
  }

  // Areas that hold at least one component, nested.
  const children = new Map<Resource | undefined, Resource[]>();
  for (const n of nodes) {
    let child: Resource = n;
    let p = parents.get(n);
    while (true) {
      const list = children.get(p) ?? [];
      if (!list.includes(child)) list.push(child);
      children.set(p, list);
      if (!p) break;
      child = p;
      p = parents.get(p);
    }
  }
  const areas = [...children.keys()].filter((a): a is Resource => !!a);

  const out: DiagramNode[] = [];
  const pos = new Map<Resource, DiagramNode>();
  for (const r of [...areas, ...nodes]) {
    const n = r.entry.role === 'area' ? areaNode(r, ids.get(r)!) : componentNode(r, ids.get(r)!, opts);
    const across = spans.get(r);
    if (across) n.doc = n.doc!.replace(/^.*$/m, (first) => `${first} Spans ${across.map(labelOf).join(', ')}.`);
    pos.set(r, n);
  }
  layout(children, edges, pos);
  // Areas first so they draw beneath, outer before inner.
  const depth = (r: Resource) => {
    let d = 0;
    for (let p = parents.get(r); p; p = parents.get(p)) d++;
    return d;
  };
  out.push(...[...areas].sort((a, b) => depth(a) - depth(b)).map((a) => pos.get(a)!), ...nodes.map((n) => pos.get(n)!));

  const diagramEdges: DiagramEdge[] = edges.map((e, i) => ({
    id: `e${i + 1}`,
    from: ids.get(e.from)!,
    to: ids.get(e.to)!,
    color: '#475569',
    width: 2,
    routing: 'orthogonal',
    rounded: true,
    lineStyle: 'solid',
    endMarker: 'arrow',
    doc: `Inferred from Terraform:\n\n${[...e.why].slice(0, 6).map((w) => `- ${w}`).join('\n')}`,
  }));

  const hidden: Record<string, number> = {};
  for (const r of resources) if (r.entry.role !== 'node' && !(r.entry.role === 'area' && children.has(r))) hidden[r.type] = (hidden[r.type] ?? 0) + 1;
  const unrecognized = [...new Set(nodes.filter((n) => n.entry.role === 'node' && !n.entry.icon).map((n) => n.type))].sort();

  const summary: TerraformImportSummary = {
    source,
    terraformVersion,
    resources: resources.length,
    components: nodes.length,
    areas: areas.length,
    connections: diagramEdges.length,
    hidden,
    unrecognized,
  };
  return { diagram: { version: 1, doc: overviewDoc(summary), nodes: out, edges: diagramEdges }, summary };
}

// ---------------------------------------------------------------------------
// Reading the three formats
// ---------------------------------------------------------------------------

function resource(address: string, type: string, name: string, values: Values, sensitive: Set<string>): Resource {
  return { address, type, name, values: values ?? {}, sensitive, entry: catalogEntry(type), refs: [] };
}

function readTerraform(json: unknown): { resources: Resource[]; source: TerraformSource; terraformVersion?: string } {
  if (!isTerraformJson(json)) throw new Error('Not a Terraform state or plan: expected a .tfstate file or `terraform show -json` output');
  const o = json as Json;
  const resources: Resource[] = [];
  if (o.version === 4 && Array.isArray(o.resources)) {
    for (const r of o.resources as Json[]) {
      if (r.mode !== 'managed') continue;
      for (const inst of (r.instances ?? []) as Json[]) {
        const index = inst.index_key === undefined ? '' : `[${JSON.stringify(inst.index_key)}]`;
        const sensitive = new Set<string>();
        for (const path of (inst.sensitive_attributes ?? []) as unknown[]) {
          const first = Array.isArray(path) ? (path[0] as Json | undefined) : undefined;
          if (first?.value !== undefined) sensitive.add(String(first.value));
        }
        resources.push(resource(`${r.module ? `${r.module}.` : ''}${r.type}.${r.name}${index}`, r.type, r.name, inst.attributes, sensitive));
      }
    }
    return { resources, source: 'state file', terraformVersion: o.terraform_version };
  }

  const walk = (m: Json | undefined) => {
    for (const r of (m?.resources ?? []) as Json[]) {
      if (r.mode !== 'managed') continue;
      const sensitive = new Set(Object.entries((r.sensitive_values ?? {}) as Values).filter(([, v]) => JSON.stringify(v).includes('true')).map(([k]) => k));
      resources.push(resource(r.address, r.type, r.name, r.values, sensitive));
    }
    for (const c of (m?.child_modules ?? []) as Json[]) walk(c);
  };
  if (o.planned_values) {
    walk(o.planned_values.root_module);
    if (o.configuration?.root_module) linkByConfiguration(o.configuration.root_module, resources);
    return { resources, source: 'plan', terraformVersion: o.terraform_version };
  }
  walk(o.values?.root_module);
  return { resources, source: 'state', terraformVersion: o.terraform_version };
}

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

interface Scope {
  prefix: string;
  module: Json | undefined;
  call: Json | null;
  parent: Scope | null;
}

/** References written in a plan's configuration, followed through module inputs and outputs. */
function linkByConfiguration(root: Json, resources: Resource[]) {
  const byConfig = new Map<string, Resource[]>();
  for (const r of resources) {
    const key = r.address.replace(/\[[^\]]*\]/g, '');
    byConfig.set(key, [...(byConfig.get(key) ?? []), r]);
  }

  const resolve = (ref: string, scope: Scope, depth: number): string[] => {
    if (depth > 8) return [];
    const parts = ref.split('.');
    if (parts[0] === 'var') {
      const refs = (scope.call?.expressions?.[parts[1]]?.references ?? []) as string[];
      return scope.parent ? refs.flatMap((r) => resolve(r, scope.parent!, depth + 1)) : [];
    }
    if (parts[0] === 'module') {
      const name = parts[1]?.replace(/\[.*$/, '');
      const call = scope.module?.module_calls?.[name] as Json | undefined;
      const output = parts[2] ? call?.module?.outputs?.[parts[2].replace(/\[.*$/, '')] : undefined;
      if (!call || !output) return [];
      const child: Scope = { prefix: `${scope.prefix}module.${name}.`, module: call.module, call, parent: scope };
      return ((output.expression?.references ?? []) as string[]).flatMap((r) => resolve(r, child, depth + 1));
    }
    if (parts.length < 2 || ['data', 'local', 'each', 'count', 'path', 'self', 'terraform'].includes(parts[0])) return [];
    return (byConfig.get(`${scope.prefix}${parts[0]}.${parts[1].replace(/\[.*$/, '')}`) ?? []).map((r) => r.address);
  };

  const expressions = (expr: unknown, path: string, scope: Scope, out: Ref[]) => {
    if (Array.isArray(expr)) return expr.forEach((e) => expressions(e, path, scope, out));
    if (!expr || typeof expr !== 'object') return;
    const e = expr as Json;
    if (Array.isArray(e.references)) {
      for (const ref of e.references as string[]) for (const target of resolve(ref, scope, 0)) out.push({ target, path });
    }
    for (const [k, v] of Object.entries(e)) {
      if (k !== 'references' && k !== 'constant_value') expressions(v, path ? `${path}.${k}` : k, scope, out);
    }
  };

  const visit = (scope: Scope) => {
    for (const rc of (scope.module?.resources ?? []) as Json[]) {
      if (rc.mode !== 'managed') continue;
      const owners = byConfig.get(`${scope.prefix}${rc.address}`) ?? [];
      if (!owners.length) continue;
      const refs: Ref[] = [];
      expressions(rc.expressions, '', scope, refs);
      for (const o of owners) o.refs.push(...refs);
    }
    for (const [name, call] of Object.entries((scope.module?.module_calls ?? {}) as Record<string, Json>)) {
      visit({ prefix: `${scope.prefix}module.${name}.`, module: call.module, call, parent: scope });
    }
  };
  visit({ prefix: '', module: root, call: null, parent: null });
}

/** Attributes that name a resource exactly (IDs, names, IP addresses). */
const EXACT_KEYS = ['id', 'name', 'function_name', 'bucket', 'identifier', 'cluster_identifier', 'replication_group_id', 'cluster_id', 'ip_address', 'private_ip', 'public_ip'];
/** Attributes distinctive enough to find inside longer strings (ARNs, URLs, hostnames, Azure IDs). */
const SUBSTRING_KEYS = [
  'arn', 'id', 'self_link', 'invoke_arn', 'qualified_arn', 'dns_name', 'address', 'endpoint', 'reader_endpoint',
  'bucket_regional_domain_name', 'bucket_domain_name', 'domain_name', 'url', 'uri', 'primary_endpoint_address',
  'configuration_endpoint_address', 'default_hostname', 'fqdn', 'login_server', 'primary_blob_endpoint', 'hostname',
  'repository_url', 'vault_uri',
];
const GLUE_KEYS = new Set(['id', 'arn', 'name', 'self_link']);
/** Top-level attributes that never refer to other resources. */
const SKIP_KEYS = new Set(['name', 'tags', 'tags_all', 'labels', 'description', 'timeouts']);

function strings(v: unknown, path: string, out: [string, string][]) {
  if (typeof v === 'string') out.push([path, v.toLowerCase()]);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, path, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, path ? `${path}.${k}` : k, out);
}

const BEFORE = /[a-z0-9_.-]/;
const AFTER = /[a-z0-9_-]/;
function containsBounded(hay: string, needle: string): boolean {
  for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) {
    const before = hay[i - 1];
    const after = hay[i + needle.length];
    if ((before === undefined || !BEFORE.test(before)) && (after === undefined || !AFTER.test(after))) return true;
  }
  return false;
}

/** References found by matching attribute values against other resources' identifiers. */
function linkByValues(resources: Resource[]) {
  const exact = new Map<string, Resource | null>();
  const contained = new Map<string, Resource | null>();
  const claim = (m: Map<string, Resource | null>, key: string, r: Resource) => m.set(key, m.has(key) && m.get(key) !== r ? null : r);
  for (const r of resources) {
    // On glue, attributes like `endpoint` point at other resources rather than naming this one.
    const own = (keys: string[]) => (r.entry.role === 'glue' ? keys.filter((k) => GLUE_KEYS.has(k)) : keys);
    for (const k of own(EXACT_KEYS)) {
      const v = r.values[k];
      if (typeof v === 'string' && v.length >= 3) claim(exact, v.toLowerCase(), r);
    }
    for (const k of own(SUBSTRING_KEYS)) {
      const v = r.values[k];
      if (typeof v === 'string' && v.length >= 10 && /[:/.]/.test(v)) claim(contained, v.toLowerCase(), r);
    }
  }
  const needles = [...contained].filter((e): e is [string, Resource] => !!e[1]);
  for (const r of resources) {
    const found: [string, string][] = [];
    for (const [k, v] of Object.entries(r.values)) if (!SKIP_KEYS.has(k)) strings(v, k, found);
    for (const [path, s] of found) {
      const hit = exact.get(s);
      if (hit && hit !== r) r.refs.push({ target: hit.address, path });
      for (const [needle, owner] of needles) {
        if (owner !== r && s.length >= needle.length && containsBounded(s, needle)) r.refs.push({ target: owner.address, path });
      }
    }
  }
  for (const r of resources) {
    const seen = new Set<string>();
    r.refs = r.refs.filter((ref) => ref.target !== r.address && !seen.has(`${ref.target} ${ref.path}`) && !!seen.add(`${ref.target} ${ref.path}`));
  }
}

/** A resource's references, plus those of `merge` resources it uses. */
function mergedRefs(byAddr: Map<string, Resource>): (r: Resource) => Ref[] {
  const cache = new Map<Resource, Ref[]>();
  return (r) => {
    let refs = cache.get(r);
    if (!refs) {
      refs = [...r.refs];
      for (const ref of r.refs) {
        const t = byAddr.get(ref.target);
        if (t?.entry.role === 'merge') refs.push(...t.refs.filter((x) => x.target !== r.address));
      }
      cache.set(r, refs);
    }
    return refs;
  };
}

// ---------------------------------------------------------------------------
// Connections, areas and ranks
// ---------------------------------------------------------------------------

interface Link {
  from: Resource;
  to: Resource;
  why: Set<string>;
}

/** References under these attributes point at what feeds the resource, so the arrow is reversed. */
const REVERSED = /(^|\.)(event_trigger|trigger|triggers|event_source\w*|source_arn)(\.|$)/;

const code = (s: string) => `\`${s}\``;

function inferEdges(resources: Resource[], byAddr: Map<string, Resource>, refsOf: (r: Resource) => Ref[]): Link[] {
  let links: Link[] = [];
  const add = (from: Resource, to: Resource, why: string) => {
    if (from !== to) links.push({ from, to, why: new Set([why]) });
  };
  const flows = (r: Resource) => r.entry.role === 'node' || r.entry.role === 'via';

  for (const r of resources) {
    if (flows(r)) {
      for (const ref of refsOf(r)) {
        const t = byAddr.get(ref.target);
        if (!t || !flows(t)) continue;
        const why = `${code(r.address)} refers to ${code(t.address)} (${ref.path})`;
        if (t.entry.role === 'via' && t.entry.reverseIncoming && r.entry.role === 'node') add(t, r, why);
        else if (REVERSED.test(ref.path)) add(t, r, why);
        else add(r, t, why);
      }
    } else if (r.entry.role === 'glue') {
      const top = (path: string) => path.split('.')[0];
      const ends = (keys: string[]) =>
        keys.flatMap((k) =>
          k === 'self' ? [r] : refsOf(r).filter((x) => top(x.path) === k).map((x) => byAddr.get(x.target)!).filter((t) => t && t.entry.role !== 'area'),
        );
      const { from, to } = r.entry;
      for (const a of ends(from)) for (const b of ends(to)) add(a, b, `via ${code(r.address)}`);
    }
  }

  // Pass through everything that isn't drawn: a → listener → target group → b becomes a → b.
  for (const v of resources) {
    if (v.entry.role === 'node') continue;
    const ins = links.filter((l) => l.to === v);
    const outs = links.filter((l) => l.from === v);
    if (!ins.length && !outs.length) continue;
    links = links.filter((l) => l.from !== v && l.to !== v);
    for (const i of ins) for (const o of outs) if (i.from !== o.to) links.push({ from: i.from, to: o.to, why: new Set([...i.why, ...o.why]) });
  }

  // One connection per pair, keeping the first direction seen.
  const pairs = new Map<string, Link>();
  for (const l of links) {
    const key = [l.from.address, l.to.address].sort().join(' ');
    const seen = pairs.get(key);
    if (seen) l.why.forEach((w) => seen.why.add(w));
    else pairs.set(key, l);
  }
  return [...pairs.values()];
}

/** The area each resource sits in, from the areas it (or a supporting resource it uses) refers to. */
function placeInAreas(
  resources: Resource[],
  byAddr: Map<string, Resource>,
  refsOf: (r: Resource) => Ref[],
): { parents: Map<Resource, Resource | undefined>; spans: Map<Resource, Resource[]> } {
  const parents = new Map<Resource, Resource | undefined>();
  const spans = new Map<Resource, Resource[]>();
  const level = (r: Resource) => (r.entry.role === 'area' ? r.entry.level : Infinity);
  const targets = (r: Resource) => refsOf(r).map((x) => byAddr.get(x.target)).filter((t): t is Resource => !!t);
  const areasReferenced = (r: Resource) => {
    const out = new Set<Resource>();
    for (const t of targets(r)) {
      if (t.entry.role === 'area') out.add(t);
      else if (t.entry.role !== 'node') for (const u of targets(t)) if (u.entry.role === 'area') out.add(u);
    }
    return [...out];
  };
  const ancestors = (a: Resource) => {
    const chain: Resource[] = [];
    for (let p: Resource | undefined = a; p; p = parents.get(p)) chain.push(p);
    return chain;
  };

  const areas = resources.filter((r) => r.entry.role === 'area').sort((a, b) => level(a) - level(b));
  for (const a of areas) {
    const outer = areasReferenced(a).filter((p) => level(p) < level(a) && !ancestors(p).includes(a));
    parents.set(a, outer.sort((x, y) => level(y) - level(x))[0]);
  }
  for (const r of resources) {
    if (r.entry.role !== 'node') continue;
    let found = areasReferenced(r);
    // Keep the innermost: drop areas that contain another found area.
    found = found.filter((a) => !found.some((b) => b !== a && ancestors(b).includes(a)));
    if (found.length <= 1) {
      parents.set(r, found[0]);
      continue;
    }
    // Spread over sibling areas (subnets in two zones): draw it in the first, list the rest in its doc.
    if (found.every((a) => parents.get(a) === parents.get(found[0]))) {
      const sorted = found.sort((a, b) => a.address.localeCompare(b.address));
      parents.set(r, sorted[0]);
      spans.set(r, sorted);
      continue;
    }
    // Otherwise use the closest area holding all of them.
    const chains = found.map(ancestors);
    parents.set(r, chains[0].find((a) => chains.every((c) => c.includes(a))));
  }
  return { parents, spans };
}

/** Column for each component: longest path from the components nothing points at. */

// ---------------------------------------------------------------------------
// Diagram nodes and layout
// ---------------------------------------------------------------------------

const LABEL_KEYS = ['function_name', 'identifier', 'cluster_identifier', 'replication_group_id', 'cluster_id', 'bucket', 'name'];

function labelOf(r: Resource): string {
  const tags = r.values.tags as Values | undefined;
  if (tags && typeof tags.Name === 'string' && tags.Name) return tags.Name;
  for (const k of LABEL_KEYS) {
    const v = r.values[k];
    if (typeof v === 'string' && v && v.length <= 48 && !/^arn:|:\/\//.test(v)) return v;
  }
  const index = /\[(.+)\]$/.exec(r.address)?.[1]?.replace(/"/g, '');
  return index !== undefined ? `${r.name} ${index}` : r.name;
}

function areaNode(r: Resource, id: string): DiagramNode {
  const e = r.entry as Extract<CatalogEntry, { role: 'area' }>;
  const v = r.values;
  const cidr = [v.cidr_block, v.ip_cidr_range, (v.address_space as string[] | undefined)?.[0], (v.address_prefixes as string[] | undefined)?.[0]].find(
    (c) => typeof c === 'string',
  ) as string | undefined;
  const isPublic = v.map_public_ip_on_launch === true;
  const label = labelOf(r);
  return {
    id,
    kind: 'area',
    x: 0,
    y: 0,
    z: 0,
    w: 4,
    d: 4,
    h: 0,
    color: isPublic ? '#7aa116' : e.color,
    opacity: e.opacity,
    ...(e.dashed ? { dashed: true } : {}),
    label: cidr && !label.includes(cidr) ? `${label} ${cidr}` : label,
    doc: resourceDoc(r, isPublic ? `Public ${e.what.toLowerCase()}` : e.what),
  };
}

function componentNode(r: Resource, id: string, opts: TerraformImportOptions): DiagramNode {
  const e = r.entry as Extract<CatalogEntry, { role: 'node' }>;
  const ref = typeof e.icon === 'function' ? e.icon(r.values) : e.icon;
  const src = ref ? (cloudIconUrl(ref) ?? opts.gcpIcons?.icons.find((i) => i.id === ref)?.src) : undefined;
  const base = { id, x: 0, y: 0, z: 0, w: 2, d: 2, label: labelOf(r), doc: resourceDoc(r, e.what) };
  if (src) return { ...base, kind: 'image', h: 0.35, color: '#ffffff', imageStyle: 'tile', src };
  return { ...base, kind: 'block', h: 1, color: '#64748b' };
}

function formatSetting(v: unknown): string | null {
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v) && v.length && v.every((x) => typeof x === 'string' || typeof x === 'number')) return v.join(', ');
  return null;
}

function resourceDoc(r: Resource, what: string): string {
  const rows = DOC_SETTINGS.flatMap((k) => {
    if (r.sensitive.has(k)) return [];
    const v = formatSetting(r.values[k]);
    return v && v.length <= 120 ? [`| ${k} | ${code(v.replace(/\|/g, '\\|'))} |`] : [];
  });
  const lines = [what === r.type ? `Managed by Terraform as ${code(r.address)}.` : `${what}, managed by Terraform as ${code(r.address)}.`];
  if (rows.length) lines.push('', '| Setting | Value |', '| --- | --- |', ...rows);
  return lines.join('\n');
}

function overviewDoc(s: TerraformImportSummary): string {
  const from = s.source === 'plan' ? 'a Terraform plan' : s.source === 'state file' ? 'a Terraform state file' : 'Terraform state';
  const lines = [
    `Imported from ${from}${s.terraformVersion ? ` (Terraform ${s.terraformVersion})` : ''}: ${s.resources} resources, drawn as ${s.components} components in ${s.areas} areas with ${s.connections} connections.`,
    '',
    'Connections are inferred from references between resources. Supporting resources such as IAM roles, security groups, listeners and attachments are not drawn; where one links two components, the link is drawn as a connection. The layout is a starting point, so move things where they read best.',
  ];
  const hidden = Object.entries(s.hidden).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (hidden.length) lines.push('', '## Not drawn', '', '| Type | Count |', '| --- | --- |', ...hidden.map(([t, n]) => `| ${code(t)} | ${n} |`));
  if (s.unrecognized.length) lines.push('', '## Drawn as plain blocks', '', 'No icon for these types yet:', '', ...s.unrecognized.map((t) => `- ${code(t)}`));
  return lines.join('\n');
}

/**
 * Lay out areas and components with the shared layered layout, nesting areas
 * so containment matches the diagram's geometry. Everything is marked as
 * placed by the platform, so later automatic edits keep it tidy.
 */
function layout(children: Map<Resource | undefined, Resource[]>, links: Link[], pos: Map<Resource, DiagramNode>) {
  const id = (r: Resource) => pos.get(r)!.id;
  const byId = new Map([...pos].map(([r, n]) => [n.id, r]));
  const placed = layeredLayout({
    children: new Map([...children].map(([k, v]) => [k ? id(k) : undefined, v.map(id)])),
    isArea: (i) => byId.get(i)!.entry.role === 'area',
    size: (i) => ({ w: pos.get(byId.get(i)!)!.w, d: pos.get(byId.get(i)!)!.d }),
    label: (i) => pos.get(byId.get(i)!)!.label ?? i,
    links: links.map((l) => [id(l.from), id(l.to)]),
  });
  for (const n of pos.values()) {
    const p = placed.get(n.id);
    if (p) Object.assign(n, p, { placed: 'auto' });
  }
}

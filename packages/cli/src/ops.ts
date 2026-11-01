import {
  ISO_ICON_COLOR,
  catalogEntry,
  cloudIconUrl,
  containerOf,
  createEdge,
  createImageNode,
  createShape,
  edgeTitle,
  isContainer,
  isIsoIcon,
  levelAt,
  levelNodes,
  nodeTitle,
  settleLevel,
  SHAPES,
  withLevel,
  type Diagram,
  type DiagramEdge,
  type DiagramNode,
  type LevelPath,
  type LineStyle,
  type ShapeKind,
} from './lib';

/**
 * Edits to a diagram, as data. The CLI's commands and `apply` turn into these,
 * and a future MCP server will use the same ones. Items are named by id or
 * label; `level` is a path of components drilled into ("orders/validate").
 */
export type Op = { level?: string } & (
  | {
      op: 'addNode';
      label: string;
      id?: string;
      kind?: ShapeKind;
      /** A Terraform resource type whose icon to use, like aws_lambda_function, or an image URL. */
      icon?: string;
      color?: string;
      /** An area to put it in. */
      in?: string;
      /** An item to put it next to. */
      near?: string;
      doc?: string;
    }
  | { op: 'updateNode'; item: string; label?: string; color?: string; kind?: ShapeKind; icon?: string }
  | { op: 'removeNode'; item: string }
  | { op: 'addEdge'; from: string; to: string; label?: string; style?: LineStyle }
  | { op: 'updateEdge'; from: string; to: string; label?: string; style?: LineStyle }
  | { op: 'removeEdge'; from: string; to: string }
  /** Set a doc. Without `item`, the level's overview: the diagram's doc, or inside a detail diagram its component's doc. */
  | { op: 'setDoc'; item?: string; markdown: string }
  /** Give a component an empty detail diagram to fill. */
  | { op: 'addDetail'; item: string }
);

export class OpError extends Error {
  constructor(
    message: string,
    readonly code: 'not_found' | 'ambiguous' | 'invalid' = 'invalid',
  ) {
    super(message);
  }
}

export const parseLevel = (s?: string): LevelPath => (s ? s.split('/').map((p) => p.trim()).filter(Boolean) : []);

// The palette's shapes, plus images (what --icon makes).
const KINDS = new Set<ShapeKind>([...SHAPES.map((s) => s.kind), 'image']);

/** Find a level by component ids or labels: "orders-api/validate()" works as well as "orders/validate". */
export function resolveLevel(root: Diagram, path: string[]): LevelPath {
  const ids: string[] = [];
  let d: Diagram | undefined = root;
  for (const part of path) {
    const n = findNode(d!, part);
    if (!n.detail) throw new OpError(`${nodeTitle(n)} has no detail diagram.`, 'not_found');
    ids.push(n.id);
    d = n.detail;
  }
  return ids;
}

const norm = (s: string) => s.trim().toLowerCase();

/** A node by id, or by label (case-insensitive). Ambiguous or missing names fail with the candidates. */
export function findNode(d: Diagram, ref: string): DiagramNode {
  const byId = d.nodes.find((n) => n.id === ref);
  if (byId) return byId;
  const matches = d.nodes.filter((n) => norm(nodeTitle(n)) === norm(ref));
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    throw new OpError(`"${ref}" matches ${matches.length} items: ${matches.map((n) => n.id).join(', ')}. Use an id.`, 'ambiguous');
  }
  const close = d.nodes.filter((n) => norm(nodeTitle(n)).includes(norm(ref)) || n.id.includes(norm(ref))).slice(0, 5);
  throw new OpError(
    `No item "${ref}" here.${close.length ? ` Did you mean ${close.map((n) => `${n.id} (${nodeTitle(n)})`).join(', ')}?` : ' Run describe to see the items.'}`,
    'not_found',
  );
}

/** Connections from one item to another (either direction if none run that way). */
export function findEdges(d: Diagram, from: string, to: string): DiagramEdge[] {
  const a = findNode(d, from).id;
  const b = findNode(d, to).id;
  const forward = d.edges.filter((e) => e.from === a && e.to === b);
  const found = forward.length ? forward : d.edges.filter((e) => e.from === b && e.to === a);
  if (!found.length) throw new OpError(`No connection between ${from} and ${to}.`, 'not_found');
  return found;
}

function slug(label: string) {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'item'
  );
}

function freeId(d: Diagram, base: string) {
  const taken = new Set([...d.nodes.map((n) => n.id), ...d.edges.map((e) => e.id)]);
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

/** An icon reference: one of IsoDraw's isometric icons (`isodraw:laptop`), a Terraform resource type from the catalog, or a URL. */
export function iconUrl(icon: string): string {
  if (/^https?:\/\//.test(icon)) return icon;
  if (icon.startsWith('isodraw:')) {
    if (!isIsoIcon(icon)) throw new OpError(`Unknown icon "${icon}". \`isodraw icons isodraw:\` lists the isometric icons.`, 'not_found');
    return icon;
  }
  const e = catalogEntry(icon);
  const ref = e.role === 'node' ? (typeof e.icon === 'string' ? e.icon : e.icon({})) : '';
  const url = ref ? cloudIconUrl(ref) : null;
  if (!url) throw new OpError(`Unknown icon "${icon}". Use a Terraform resource type (isodraw icons lists them) or an image URL.`, 'not_found');
  return url;
}

type Rect = { x: number; y: number; w: number; d: number };
/** Room between items, so connection labels have space. */
const GAP = 3;
const overlaps = (a: Rect, b: Rect, gap = 1) =>
  a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.d + gap && b.y < a.y + a.d + gap;

/**
 * Where a new node goes: beside `near` (or inside `area`, or right of
 * everything), on the first free spot, never overlapping another item or an
 * area it isn't in. An area grows to fit it.
 */
export function place(d: Diagram, node: DiagramNode, near?: DiagramNode, area?: DiagramNode, side: 'right' | 'left' = 'right'): Diagram {
  const container = area ?? (near ? containerOf(near, d.nodes) : undefined);
  const insideContainer = (n: DiagramNode) => !!container && (n.id === container.id || isAncestor(d, n, container));
  const obstacles = d.nodes.filter((n) => !insideContainer(n) && (!isContainer(n) || !container || n.id !== container.id));
  const fits = (r: Rect) => obstacles.every((o) => !overlaps(r, o));

  let ax: number, ay: number;
  const dir = side === 'left' ? -1 : 1;
  if (near) [ax, ay] = [side === 'left' ? near.x - node.w - GAP : near.x + near.w + GAP, near.y];
  else if (container) [ax, ay] = [container.x + 1, container.y + 1.5];
  else {
    const top = d.nodes.filter((n) => !containerOf(n, d.nodes));
    ax = top.length ? Math.max(...top.map((n) => n.x + n.w)) + GAP : 0;
    ay = top.length ? Math.min(...top.map((n) => n.y)) : 0;
  }

  let spot: Rect | undefined;
  for (let ring = 0; ring < 12 && !spot; ring++) {
    for (let row = 0; row <= ring && !spot; row++) {
      for (const [dx, dy] of [
        [ring, row],
        [row, ring],
      ]) {
        const r = { x: ax + dir * dx * (node.w + GAP), y: ay + dy * (node.d + GAP), w: node.w, d: node.d };
        if (fits(r)) {
          spot = r;
          break;
        }
      }
    }
  }
  spot ??= { x: Math.max(0, ...d.nodes.map((n) => n.x + n.w)) + GAP, y: ay, w: node.w, d: node.d };

  const placed = { ...node, x: spot.x, y: spot.y, z: container?.z ?? 0 };
  let nodes = [...d.nodes, placed];
  // Areas grow to keep what's put in them.
  if (container) {
    const c = container;
    const pad = 1;
    const x0 = Math.min(c.x, placed.x - pad);
    const y0 = Math.min(c.y, placed.y - pad);
    const x1 = Math.max(c.x + c.w, placed.x + placed.w + pad);
    const y1 = Math.max(c.y + c.d, placed.y + placed.d + pad);
    nodes = nodes.map((n) => (n.id === c.id ? { ...n, x: x0, y: y0, w: x1 - x0, d: y1 - y0 } : n));
  }
  return { ...d, nodes };
}

function isAncestor(d: Diagram, maybeAncestor: DiagramNode, of: DiagramNode): boolean {
  for (let p = containerOf(of, d.nodes); p; p = containerOf(p, d.nodes)) if (p.id === maybeAncestor.id) return true;
  return false;
}

export interface Applied {
  diagram: Diagram;
  /** One line per change, for --dry-run and the command's output. */
  changes: string[];
  /** Ids of items added, in order, so callers can refer to them. */
  added: string[];
}

/** Apply edits in order. Each op works on the result of the ones before it. */
export function applyOps(root: Diagram, ops: Op[], defaultLevel: LevelPath = []): Applied {
  let diagram = root;
  const changes: string[] = [];
  const added: string[] = [];
  /** Levels changed by this batch, to tidy afterwards. */
  const touched = new Map<string, LevelPath>();
  /** New items placed without --near, to move beside what they end up connected to. */
  const loose: { level: LevelPath; id: string }[] = [];
  for (const [i, op] of ops.entries()) {
    try {
      const level = op.level !== undefined ? resolveLevel(diagram, parseLevel(op.level)) : defaultLevel;
      touched.set(level.join('/'), level);
      const where = level.length ? ` in ${levelNodes(diagram, level).map(nodeTitle).join(' › ')}` : '';
      if (!levelAt(diagram, level)) throw new OpError(`No such level: ${level.join('/')}`, 'not_found');

      if (op.op === 'setDoc' && !op.item && level.length) {
        // A detail diagram's overview is its component's doc, one level up.
        const parent = level.slice(0, -1);
        const id = level[level.length - 1];
        diagram = withLevel(diagram, parent, (d) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, doc: op.markdown || undefined } : n)) }));
        changes.push(`set the overview doc${where}`);
        continue;
      }

      diagram = withLevel(diagram, level, (d) => {
        switch (op.op) {
          case 'addNode': {
            if (!op.label?.trim()) throw new OpError('A new item needs a label.');
            const kind = op.kind ?? (op.icon ? 'image' : 'block');
            if (!KINDS.has(kind)) throw new OpError(`Unknown kind "${kind}". Use one of: ${[...KINDS].join(', ')}.`);
            const id = op.id ? (d.nodes.some((n) => n.id === op.id) ? fail(`An item with id "${op.id}" already exists.`) : op.id) : freeId(d, slug(op.label));
            const base = op.icon ? createImageNode(iconUrl(op.icon), op.label, 0, 0) : createShape(kind, 0, 0, { label: op.label });
            // Placed by the platform: automatic layout may move it until a person does.
            const node: DiagramNode = { ...base, id, label: op.label, placed: 'auto', ...(op.color ? { color: op.color } : {}), ...(op.doc ? { doc: op.doc } : {}) };
            const area = op.in ? findNode(d, op.in) : undefined;
            if (area && !isContainer(area)) throw new OpError(`${nodeTitle(area)} isn't an area, so nothing can go in it.`);
            const near = op.near ? findNode(d, op.near) : undefined;
            added.push(id);
            if (!near) loose.push({ level, id });
            changes.push(`added ${id} (${op.label})${area ? ` in ${nodeTitle(area)}` : ''}${where}`);
            return place(d, node, near, area);
          }
          case 'updateNode': {
            const n = findNode(d, op.item);
            const patch: Partial<DiagramNode> = {};
            if (op.label !== undefined) patch.label = op.label;
            if (op.color) patch.color = op.color;
            if (op.kind) {
              if (!KINDS.has(op.kind)) throw new OpError(`Unknown kind "${op.kind}".`);
              patch.kind = op.kind;
            }
            if (op.icon) {
              const src = iconUrl(op.icon);
              // Isometric icons stand on their tiles in the component's color; other images sit on a tile.
              if (isIsoIcon(src)) Object.assign(patch, { kind: 'image', src, h: 1, imageStyle: undefined, color: op.color ?? ISO_ICON_COLOR });
              else Object.assign(patch, { kind: 'image', src, imageStyle: n.imageStyle ?? 'tile' });
            }
            changes.push(`changed ${n.id} (${Object.keys(patch).join(', ') || 'nothing'})${where}`);
            return { ...d, nodes: d.nodes.map((x) => (x.id === n.id ? { ...x, ...patch } : x)) };
          }
          case 'removeNode': {
            const n = findNode(d, op.item);
            const gone = new Set([n.id]);
            const edges = d.edges.filter((e) => !gone.has(e.from) && !gone.has(e.to));
            changes.push(`removed ${n.id} (${nodeTitle(n)}) and ${d.edges.length - edges.length} connection(s)${where}`);
            return { ...d, nodes: d.nodes.filter((x) => x.id !== n.id), edges };
          }
          case 'addEdge': {
            const a = findNode(d, op.from);
            const b = findNode(d, op.to);
            if (a.id === b.id) throw new OpError('A connection needs two different items.');
            const edge = { ...createEdge(a.id, b.id, { ...(op.label ? { label: op.label } : {}), ...(op.style ? { lineStyle: op.style } : {}) }), id: freeId(d, `${a.id}-${b.id}`) };
            added.push(edge.id);
            changes.push(`connected ${a.id} → ${b.id}${op.label ? ` "${op.label}"` : ''}${where}`);
            return { ...d, edges: [...d.edges, edge] };
          }
          case 'updateEdge': {
            const [e] = findEdges(d, op.from, op.to);
            const patch: Partial<DiagramEdge> = {};
            if (op.label !== undefined) patch.label = op.label || undefined;
            if (op.style) patch.lineStyle = op.style;
            changes.push(`changed ${edgeTitle(e, d.nodes)}${where}`);
            return { ...d, edges: d.edges.map((x) => (x.id === e.id ? { ...x, ...patch } : x)) };
          }
          case 'removeEdge': {
            const es = findEdges(d, op.from, op.to);
            const ids = new Set(es.map((e) => e.id));
            changes.push(`removed ${es.map((e) => edgeTitle(e, d.nodes)).join(', ')}${where}`);
            return { ...d, edges: d.edges.filter((e) => !ids.has(e.id)) };
          }
          case 'setDoc': {
            if (!op.item) {
              changes.push('set the diagram overview doc');
              return { ...d, doc: op.markdown || undefined };
            }
            const n = d.nodes.find((x) => x.id === op.item) ?? (d.edges.find((e) => e.id === op.item) ? undefined : findNode(d, op.item));
            if (n) {
              changes.push(`set the doc of ${n.id}${where}`);
              return { ...d, nodes: d.nodes.map((x) => (x.id === n.id ? { ...x, doc: op.markdown || undefined } : x)) };
            }
            changes.push(`set the doc of connection ${op.item}${where}`);
            return { ...d, edges: d.edges.map((e) => (e.id === op.item ? { ...e, doc: op.markdown || undefined } : e)) };
          }
          case 'addDetail': {
            const n = findNode(d, op.item);
            if (n.detail) return d;
            changes.push(`added a detail diagram to ${n.id}${where}`);
            return { ...d, nodes: d.nodes.map((x) => (x.id === n.id ? { ...x, detail: { version: 1, nodes: [], edges: [] } } : x)) };
          }
          default:
            throw new OpError(`Unknown op "${(op as { op: string }).op}".`);
        }
      });
    } catch (e) {
      if (e instanceof OpError) throw new OpError(`Change ${i + 1} (${op.op}): ${e.message}`, e.code);
      throw e;
    }
  }
  diagram = arrange(diagram, touched, loose);
  return { diagram, changes, added };
}

/**
 * Layout after a batch: a level whose items were all placed by the platform
 * is laid out again in full. On a level a person arranged, only new items
 * that weren't put near something move, to sit beside what they connect to:
 * after something that feeds them, or before something they feed.
 */
function arrange(root: Diagram, touched: Map<string, LevelPath>, loose: { level: LevelPath; id: string }[]): Diagram {
  let diagram = root;
  for (const level of touched.values()) {
    const before = levelAt(diagram, level);
    if (!before) continue;
    const settled = settleLevel(before);
    if (settled !== before) {
      diagram = withLevel(diagram, level, () => settled);
      continue;
    }
    for (const { id } of loose.filter((l) => l.level.join('/') === level.join('/'))) {
      diagram = withLevel(diagram, level, (d) => {
        const n = d.nodes.find((x) => x.id === id);
        if (!n) return d;
        const into = d.edges.find((e) => e.to === id && e.from !== id);
        const out = d.edges.find((e) => e.from === id && e.to !== id);
        const neighbor = d.nodes.find((x) => x.id === (into ? into.from : out?.to));
        if (!neighbor) return d;
        const area = containerOf(n, d.nodes);
        const rest = { ...d, nodes: d.nodes.filter((x) => x.id !== id) };
        return place(rest, n, neighbor, area, into ? 'right' : 'left');
      });
    }
  }
  return diagram;
}

function fail(msg: string): never {
  throw new OpError(msg);
}

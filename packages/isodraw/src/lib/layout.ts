import { isContainer, parentMap } from './containers';
import type { Diagram, DiagramNode } from './types';

/**
 * Layered layout: components in columns by their place in the flow (what
 * feeds what), areas sized around their contents, unconnected components in
 * a row underneath so no line runs through them. The Terraform import, the
 * CLI and the editor's Tidy up all use it.
 */
export interface LayoutInput {
  /** Each area's direct contents (`undefined` is the top), in a stable order. */
  children: Map<string | undefined, string[]>;
  isArea: (id: string) => boolean;
  /** A component's footprint. Areas are sized to fit. */
  size: (id: string) => { w: number; d: number };
  label: (id: string) => string;
  /** Tie-break within a column before the label, e.g. the previous position, so a re-layout moves little. */
  order?: (id: string) => number;
  /** Connections between components, as [from, to]. */
  links: [string, string][];
}

export type Placement = { x: number; y: number; w: number; d: number };

const PAD = 1;
const PAD_TOP = 1.5;
const COL_GAP = 3;
const ROW_GAP = 2;
const MAX_COLUMN = 16;
const half = (v: number) => Math.round(v * 2) / 2;

/** Longest-path ranks, ignoring links that close a cycle. */
export function rankIds(ids: string[], links: [string, string][]): Map<string, number> {
  const out = new Map<string, [string, string][]>();
  for (const l of links) out.set(l[0], [...(out.get(l[0]) ?? []), l]);
  const state = new Map<string, 'active' | 'done'>();
  const back = new Set<[string, string]>();
  const order: string[] = [];
  const dfs = (n: string) => {
    state.set(n, 'active');
    for (const l of out.get(n) ?? []) {
      const s = state.get(l[1]);
      if (s === 'active') back.add(l);
      else if (!s) dfs(l[1]);
    }
    state.set(n, 'done');
    order.push(n);
  };
  ids.forEach((n) => state.has(n) || dfs(n));
  const rank = new Map(ids.map((n) => [n, 0]));
  for (const n of order.reverse()) {
    for (const l of out.get(n) ?? []) if (!back.has(l) && rank.has(l[1])) rank.set(l[1], Math.max(rank.get(l[1])!, rank.get(n)! + 1));
  }
  return rank;
}

/** Positions and sizes for every item, with the top group's corner at (0, 0). */
export function layeredLayout(input: LayoutInput): Map<string, Placement> {
  const { children, isArea, label, links } = input;
  const order = input.order ?? (() => 0);
  const components = [...new Set([...children.values()].flat())].filter((id) => !isArea(id));
  const rank = rankIds(components, links);
  const result = new Map<string, Placement>();
  const size = new Map<string, { w: number; d: number }>();
  // An area sits in the column of its earliest connected component, so unconnected
  // things inside it (NAT and internet gateways) don't drag it to the left.
  const connected = new Set(links.flat());
  const descendants = (id: string): string[] => (children.get(id) ?? []).flatMap((c) => (isArea(c) ? descendants(c) : [c]));
  const minRank = (id: string): number => {
    if (!isArea(id)) return rank.get(id) ?? 0;
    const all = descendants(id);
    const linked = all.filter((n) => connected.has(n));
    return all.length ? Math.min(...(linked.length ? linked : all).map((n) => rank.get(n) ?? 0)) : 0;
  };

  const columns = (items: string[]) => {
    const sorted = [...items].sort(
      (a, b) => minRank(a) - minRank(b) || Number(isArea(a)) - Number(isArea(b)) || order(a) - order(b) || label(a).localeCompare(label(b)),
    );
    // Long columns wrap, but never below the tallest area plus a couple of components.
    const limit = Math.max(MAX_COLUMN, ...items.map((i) => measure(i).d + 8));
    const cols: { items: string[]; w: number; d: number }[] = [];
    let current: (typeof cols)[number] | null = null;
    let currentRank = -1;
    for (const item of sorted) {
      const s = measure(item);
      const r = minRank(item);
      if (!current || r !== currentRank || current.d + ROW_GAP + s.d > limit) {
        current = { items: [], w: 0, d: -ROW_GAP };
        cols.push(current);
        currentRank = r;
      }
      current.items.push(item);
      current.w = Math.max(current.w, s.w);
      current.d += ROW_GAP + s.d;
    }
    return cols;
  };
  // A group is the flow (areas and connected components) in columns, with
  // unconnected components in a row underneath.
  const split = (items: string[]) => {
    const loose = items.filter((i) => !isArea(i) && !connected.has(i));
    const flow = items.filter((i) => !loose.includes(i));
    return flow.length ? { flow, loose } : { flow: loose, loose: [] as string[] };
  };
  const rowWidth = (items: string[]) => items.reduce((t, i) => t + measure(i).w, 0) + COL_GAP * (items.length - 1);
  const groupSize = (items: string[]) => {
    if (!items.length) return { w: 4, d: 3 };
    const { flow, loose } = split(items);
    const cols = columns(flow);
    const w = cols.reduce((t, c) => t + c.w, 0) + COL_GAP * (cols.length - 1);
    const d = Math.max(...cols.map((c) => c.d));
    return loose.length ? { w: Math.max(w, rowWidth(loose)), d: d + ROW_GAP + 2 } : { w, d };
  };
  function measure(id: string): { w: number; d: number } {
    let s = size.get(id);
    if (!s) {
      if (isArea(id)) {
        const inner = groupSize(children.get(id) ?? []);
        s = { w: inner.w + 2 * PAD, d: inner.d + PAD_TOP + PAD };
      } else s = input.size(id);
      size.set(id, s);
    }
    return s;
  }
  const placeGroup = (items: string[], x0: number, y0: number) => {
    if (!items.length) return;
    const { flow, loose } = split(items);
    const cols = columns(flow);
    const height = Math.max(...cols.map((c) => c.d));
    let x = x0;
    for (const c of cols) {
      let y = y0 + half((height - c.d) / 2);
      for (const item of c.items) {
        place(item, x, y);
        y += measure(item).d + ROW_GAP;
      }
      x += c.w + COL_GAP;
    }
    x = x0;
    for (const item of loose) {
      place(item, x, y0 + height + ROW_GAP);
      x += measure(item).w + COL_GAP;
    }
  };
  const place = (id: string, x: number, y: number) => {
    const s = measure(id);
    result.set(id, { x, y, w: s.w, d: s.d });
    if (isArea(id)) placeGroup(children.get(id) ?? [], x + PAD, y + PAD_TOP);
  };
  placeGroup(children.get(undefined) ?? [], 0, 0);
  return result;
}

// ---------------------------------------------------------------------------
// Laying out a diagram level

/** Whether the platform placed this item (true) or a person did (false). */
export const isAutoPlaced = (n: DiagramNode) => n.placed === 'auto';

/** Items that take part in layout: everything but free text. */
const laidOut = (n: DiagramNode) => n.kind !== 'text';

/**
 * Lay out a whole level: areas keep their contents, components go in columns
 * by flow, and every item is marked as placed by the platform. The result
 * starts where the old content did, so it doesn't jump away on the canvas.
 * Connections between moved items lose their manual bends and anchors.
 */
export function layoutLevel(d: Diagram): Diagram {
  const items = d.nodes.filter(laidOut);
  if (!items.length) return d;
  const ids = new Set(items.map((n) => n.id));
  const byId = new Map(items.map((n) => [n.id, n]));
  const parents = parentMap(items);
  const children = new Map<string | undefined, string[]>();
  for (const n of items) {
    const p = parents.get(n.id);
    children.set(p, [...(children.get(p) ?? []), n.id]);
  }
  const links = d.edges
    .filter((e) => ids.has(e.from) && ids.has(e.to) && !isContainer(byId.get(e.from)!) && !isContainer(byId.get(e.to)!))
    .map((e) => [e.from, e.to] as [string, string]);
  const placed = layeredLayout({
    children,
    isArea: (id) => isContainer(byId.get(id)!),
    size: (id) => ({ w: byId.get(id)!.w, d: byId.get(id)!.d }),
    label: (id) => byId.get(id)!.label ?? id,
    // Keep the current top-to-bottom order where the flow allows it.
    order: (id) => byId.get(id)!.y * 1000 + byId.get(id)!.x,
    links,
  });
  const x0 = Math.min(...items.map((n) => n.x));
  const y0 = Math.min(...items.map((n) => n.y));
  const moved = new Set<string>();
  const nodes = d.nodes.map((n) => {
    const p = placed.get(n.id);
    if (!p) return n;
    const next = { ...n, x: p.x + x0, y: p.y + y0, w: p.w, d: p.d, placed: 'auto' as const };
    if (next.x !== n.x || next.y !== n.y || next.w !== n.w || next.d !== n.d) moved.add(n.id);
    return next;
  });
  const edges = d.edges.map((e) => {
    if (!moved.has(e.from) && !moved.has(e.to)) return e;
    const { waypoints: _w, fromAnchor: _f, toAnchor: _t, ...rest } = e;
    return rest;
  });
  return { ...d, nodes, edges };
}

const GEOMETRY = ['x', 'y', 'w', 'd', 'h', 'z'] as const;

/** Whether a patch moves or resizes an item. */
export const movesItem = (patch: Partial<DiagramNode>) => GEOMETRY.some((k) => k in patch);

/**
 * After a person moved or resized items, they stop being auto-placed, so
 * automatic layout leaves them where they were put.
 */
export function markMoved(prev: Diagram, next: Diagram): Diagram {
  const before = new Map(prev.nodes.map((n) => [n.id, n]));
  let changed = false;
  const nodes = next.nodes.map((n) => {
    const b = before.get(n.id);
    if (!n.placed || !b || GEOMETRY.every((k) => b[k] === n[k])) return n;
    changed = true;
    const { placed: _p, ...rest } = n;
    return rest;
  });
  return changed ? { ...next, nodes } : next;
}

/**
 * Tidy a level after automatic changes: when every item on it was placed by
 * the platform, lay it all out again. A level a person has arranged is left
 * alone; new items there were already put beside what they connect to.
 */
export function settleLevel(d: Diagram): Diagram {
  const items = d.nodes.filter(laidOut);
  return items.length && items.every(isAutoPlaced) ? layoutLevel(d) : d;
}

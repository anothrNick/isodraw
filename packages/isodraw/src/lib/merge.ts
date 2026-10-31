import type { Diagram, DiagramNode } from './types';

/**
 * Three-way merge of two edits of the same diagram, for saving after someone
 * else saved first. `base` is what both started from, `mine` the local edit
 * and `theirs` the saved one.
 *
 * Items are matched by id within each level (detail diagrams merge the same
 * way, inside their component). An item changed on one side only takes that
 * side's version. An item changed on both sides keeps mine, and is counted in
 * `conflicts` so the app can say so. Additions from both sides are kept; a
 * deletion wins unless the other side changed the item. Connections whose
 * ends are gone are dropped.
 */
export function mergeDiagrams(base: Diagram, mine: Diagram, theirs: Diagram): { diagram: Diagram; conflicts: number } {
  const count = { conflicts: 0 };
  return { diagram: mergeLevel(base, mine, theirs, count), conflicts: count.conflicts };
}

type Counter = { conflicts: number };

function mergeLevel(base: Diagram, mine: Diagram, theirs: Diagram, count: Counter): Diagram {
  const nodes = mergeItems(base.nodes, mine.nodes, theirs.nodes, count, mergeNode);
  const ids = new Set(nodes.map((n) => n.id));
  const edges = mergeItems(base.edges, mine.edges, theirs.edges, count).filter((e) => ids.has(e.from) && ids.has(e.to));
  const out: Diagram = { ...theirs, nodes, edges };
  for (const key of ['doc', 'view'] as const) {
    const v = pick(base[key], mine[key], theirs[key], count);
    if (v === undefined) delete out[key];
    else (out as unknown as Record<string, unknown>)[key] = v;
  }
  return out;
}

/** A node's own fields merge as one value; its detail diagram merges item by item. */
function mergeNode(b: DiagramNode | undefined, m: DiagramNode, t: DiagramNode, count: Counter): DiagramNode {
  const { detail: bd, ...bRest } = b ?? ({} as DiagramNode);
  const { detail: md, ...mRest } = m;
  const { detail: td, ...tRest } = t;
  const fields = pick(b ? bRest : undefined, mRest, tRest, count);
  let detail: Diagram | undefined;
  if (md && td) detail = mergeLevel(bd ?? { version: 1, nodes: [], edges: [] }, md, td, count);
  else detail = pick(bd, md, td, count);
  return detail ? { ...(fields as DiagramNode), detail } : (fields as DiagramNode);
}

function mergeItems<T extends { id: string }>(
  base: T[],
  mine: T[],
  theirs: T[],
  count: Counter,
  both: (b: T | undefined, m: T, t: T, count: Counter) => T = (b, m, t, c) => pick(b, m, t, c)!,
): T[] {
  const b = new Map(base.map((x) => [x.id, x]));
  const m = new Map(mine.map((x) => [x.id, x]));
  const out: T[] = [];
  const seen = new Set<string>();
  // Their order first, then what only I added, in my order.
  for (const t of theirs) {
    seen.add(t.id);
    const mi = m.get(t.id);
    const bi = b.get(t.id);
    if (mi) out.push(both(bi, mi, t, count));
    else if (!bi) out.push(t); // they added it
    else if (!same(bi, t)) {
      out.push(t); // I deleted it, they changed it: keep theirs
      count.conflicts++;
    }
    // else: I deleted it and they didn't touch it
  }
  for (const mi of mine) {
    if (seen.has(mi.id)) continue;
    const bi = b.get(mi.id);
    if (!bi) out.push(mi); // I added it
    else if (!same(bi, mi)) {
      out.push(mi); // they deleted it, I changed it: keep mine
      count.conflicts++;
    }
    // else: they deleted it and I didn't touch it
  }
  return out;
}

/** One value, three-way: whichever side changed it; mine when both did differently. */
function pick<T>(base: T | undefined, mine: T | undefined, theirs: T | undefined, count: Counter): T | undefined {
  if (same(mine, theirs)) return mine;
  if (same(base, mine)) return theirs;
  if (same(base, theirs)) return mine;
  count.conflicts++;
  return mine;
}

function same(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    const bb = b as unknown[];
    return a.length === bb.length && a.every((x, i) => same(x, bb[i]));
  }
  const ka = Object.keys(a).filter((k) => (a as Record<string, unknown>)[k] !== undefined);
  const kb = Object.keys(b).filter((k) => (b as Record<string, unknown>)[k] !== undefined);
  return ka.length === kb.length && ka.every((k) => same((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}


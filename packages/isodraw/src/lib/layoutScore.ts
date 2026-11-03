import { isContainer, parentMap } from './containers';
import { resolveEdge } from './routing';
import type { Diagram, DiagramNode } from './types';

/**
 * How good a layout looks, in numbers, for comparing layout engines on the
 * same diagrams: what reads as broken (crossings, overlaps, lines through
 * items, items that left their area) and what reads as untidy (long lines,
 * wasted space, how far things moved). Lower is better everywhere.
 */
export interface LayoutScore {
  /** Pairs of connections that cross (ones sharing an item don't count). */
  crossings: number;
  /** Pairs of components whose footprints overlap. */
  overlaps: number;
  /** A connection running across a component it doesn't attach to, counted per component. */
  through: number;
  /** Items whose area changed (they were in one area and are now in another, or none). */
  regrouped: number;
  /** Total length of all connections, in world units. */
  length: number;
  /** Bounding box area over the components' own area: 1 would be packed solid. */
  sprawl: number;
  /** Average distance an item moved from where it was. */
  moved: number;
}

type Pt = { x: number; y: number };

function cross(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const o = (p: Pt, q: Pt, r: Pt) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
}

function segments(pts: Pt[]): [Pt, Pt][] {
  return pts.slice(1).map((p, i) => [pts[i], p]);
}

/** Does a segment pass through the inside of a node's footprint (shrunk a little, so grazing doesn't count)? */
function hits([a, b]: [Pt, Pt], n: DiagramNode): boolean {
  const m = 0.15;
  const [x0, y0, x1, y1] = [n.x + m, n.y + m, n.x + n.w - m, n.y + n.d - m];
  // Clip the segment to the box (Liang–Barsky).
  let t0 = 0;
  let t1 = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  for (const [p, q] of [[-dx, a.x - x0], [dx, x1 - a.x], [-dy, a.y - y0], [dy, y1 - a.y]] as const) {
    if (p === 0) {
      if (q < 0) return false;
      continue;
    }
    const t = q / p;
    if (p < 0) t0 = Math.max(t0, t);
    else t1 = Math.min(t1, t);
    if (t0 > t1) return false;
  }
  return true;
}

export function scoreLayout(d: Diagram, before?: Diagram): LayoutScore {
  const byId = new Map(d.nodes.map((n) => [n.id, n]));
  const parts = d.nodes.filter((n) => !isContainer(n) && n.kind !== 'text');
  const routes = d.edges
    .filter((e) => byId.has(e.from) && byId.has(e.to) && e.from !== e.to)
    .map((e) => ({ e, segs: segments(resolveEdge(e, byId.get(e.from)!, byId.get(e.to)!).pts) }));

  let crossings = 0;
  for (let i = 0; i < routes.length; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      const [p, q] = [routes[i], routes[j]];
      if ([p.e.from, p.e.to].some((id) => id === q.e.from || id === q.e.to)) continue;
      if (p.segs.some((s) => q.segs.some((t) => cross(s[0], s[1], t[0], t[1])))) crossings++;
    }
  }

  let overlaps = 0;
  for (let i = 0; i < parts.length; i++) {
    for (let j = i + 1; j < parts.length; j++) {
      const [a, b] = [parts[i], parts[j]];
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.d && b.y < a.y + a.d) overlaps++;
    }
  }

  let through = 0;
  for (const { e, segs } of routes) {
    for (const n of parts) if (n.id !== e.from && n.id !== e.to && segs.some((s) => hits(s, n))) through++;
  }

  let regrouped = 0;
  let moved = 0;
  if (before) {
    const was = parentMap(before.nodes);
    const now = parentMap(d.nodes);
    const old = new Map(before.nodes.map((n) => [n.id, n]));
    for (const n of d.nodes) {
      if (was.get(n.id) !== now.get(n.id)) regrouped++;
      const o = old.get(n.id);
      if (o) moved += Math.hypot(n.x - o.x, n.y - o.y);
    }
    moved /= d.nodes.length || 1;
  }

  const length = routes.reduce((t, r) => t + r.segs.reduce((s, [a, b]) => s + Math.hypot(b.x - a.x, b.y - a.y), 0), 0);
  const all = d.nodes.filter((n) => n.kind !== 'text');
  const w = Math.max(...all.map((n) => n.x + n.w)) - Math.min(...all.map((n) => n.x));
  const h = Math.max(...all.map((n) => n.y + n.d)) - Math.min(...all.map((n) => n.y));
  const own = parts.reduce((t, n) => t + n.w * n.d, 0) || 1;

  return { crossings, overlaps, through, regrouped, length: Math.round(length), sprawl: Math.round(((w * h) / own) * 10) / 10, moved: Math.round(moved * 10) / 10 };
}

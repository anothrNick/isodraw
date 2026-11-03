import { isContainer, parentMap } from './containers';
import { itemLabelBox, labelBox, pointAlong } from './autoRoute';
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
  /** Length of line two connections share, running along the same track: they can't be told apart. */
  parallel: number;
  /** Length of line two connections run side by side, less than half a unit apart: a bundle that's hard to follow. */
  close: number;
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
  /** Connection labels sitting on an item (or its label), across another line, or on another label. */
  labelOnItem: number;
  labelOnLine: number;
  labelOnLabel: number;
  /** Lines running through an item's label (not the item's own lines). */
  throughLabel: number;
}

type Pt = { x: number; y: number };

function cross(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const o = (p: Pt, q: Pt, r: Pt) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
}

function segments(pts: Pt[]): [Pt, Pt][] {
  return pts.slice(1).map((p, i) => [pts[i], p]);
}

type Rect = { x0: number; y0: number; x1: number; y1: number };

/** Does a segment pass through a box (Liang–Barsky clip)? */
function hitsBox([a, b]: [Pt, Pt], r: Rect): boolean {
  let t0 = 0;
  let t1 = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  for (const [p, q] of [[-dx, a.x - r.x0], [dx, r.x1 - a.x], [-dy, a.y - r.y0], [dy, r.y1 - a.y]] as const) {
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

/** Does a segment pass through the inside of a node's footprint (shrunk a little, so grazing doesn't count)? */
function hits(s: [Pt, Pt], n: DiagramNode): boolean {
  const m = 0.15;
  return hitsBox(s, { x0: n.x + m, y0: n.y + m, x1: n.x + n.w - m, y1: n.y + n.d - m });
}

/** Scores what's drawn: items where they are, lines as their anchors and bends draw them. */
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

  let parallel = 0;
  let close = 0;
  const flat = (s: [Pt, Pt]) => Math.abs(s[0].y - s[1].y) < 1e-6;
  const upright = (s: [Pt, Pt]) => Math.abs(s[0].x - s[1].x) < 1e-6;
  const overlap = (a0: number, a1: number, b0: number, b1: number) => Math.max(0, Math.min(Math.max(a0, a1), Math.max(b0, b1)) - Math.max(Math.min(a0, a1), Math.min(b0, b1)));
  for (let i = 0; i < routes.length; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      for (const s of routes[i].segs) {
        for (const t of routes[j].segs) {
          let [gap, run] = [Infinity, 0];
          if (flat(s) && flat(t)) [gap, run] = [Math.abs(s[0].y - t[0].y), overlap(s[0].x, s[1].x, t[0].x, t[1].x)];
          else if (upright(s) && upright(t)) [gap, run] = [Math.abs(s[0].x - t[0].x), overlap(s[0].y, s[1].y, t[0].y, t[1].y)];
          if (gap < 0.05) parallel += run;
          else if (gap < 0.45) close += run;
        }
      }
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

  // Labels: a connection's pill where it's drawn, and each item's label under it.
  const box = (r: Rect, s: Rect) => r.x0 < s.x1 && s.x0 < r.x1 && r.y0 < s.y1 && s.y0 < r.y1;
  const itemBoxes = [...parts.map((n) => ({ x0: n.x, y0: n.y, x1: n.x + n.w, y1: n.y + n.d })), ...parts.filter((n) => n.label).map(itemLabelBox)];
  const pills = routes.filter((r) => r.e.label).map((r) => ({ r, box: labelBox(r.e.label!, pointAlong([r.segs[0]?.[0] ?? { x: 0, y: 0 }, ...r.segs.map((s) => s[1])], r.e.labelT ?? 0.5)) }));
  let labelOnItem = 0;
  let labelOnLine = 0;
  let labelOnLabel = 0;
  for (const p of pills) {
    if (itemBoxes.some((b) => box(p.box, b))) labelOnItem++;
    if (routes.some((r) => r !== p.r && r.segs.some((s) => hitsBox(s, p.box)))) labelOnLine++;
  }
  for (let i = 0; i < pills.length; i++) for (let j = i + 1; j < pills.length; j++) if (box(pills[i].box, pills[j].box)) labelOnLabel++;
  let throughLabel = 0;
  for (const n of parts) {
    if (!n.label) continue;
    const b = itemLabelBox(n);
    if (routes.some((r) => r.e.from !== n.id && r.e.to !== n.id && r.segs.some((s) => hitsBox(s, b)))) throughLabel++;
  }

  const length = routes.reduce((t, r) => t + r.segs.reduce((s, [a, b]) => s + Math.hypot(b.x - a.x, b.y - a.y), 0), 0);
  const all = d.nodes.filter((n) => n.kind !== 'text');
  const w = Math.max(...all.map((n) => n.x + n.w)) - Math.min(...all.map((n) => n.x));
  const h = Math.max(...all.map((n) => n.y + n.d)) - Math.min(...all.map((n) => n.y));
  const own = parts.reduce((t, n) => t + n.w * n.d, 0) || 1;

  return { labelOnItem, labelOnLine, labelOnLabel, throughLabel, crossings, parallel: Math.round(parallel * 10) / 10, close: Math.round(close * 10) / 10, overlaps, through, regrouped, length: Math.round(length), sprawl: Math.round(((w * h) / own) * 10) / 10, moved: Math.round(moved * 10) / 10 };
}

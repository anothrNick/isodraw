import { isContainer } from './containers';
import type { Pt } from './geometry';
import { anchorPoint, autoAnchors, interpolateZ, SIDE_DIR, SIDES, simplifyPath, STUB, type LevelRoutes, type ResolvedEdge } from './routing';
import type { Diagram, DiagramEdge, DiagramNode, EdgeAnchor, Side } from './types';

/**
 * Routing a level's orthogonal connections together, so they read cleanly:
 * each goes around the items in its way, on a grid path that costs a little
 * per bend and a lot per stretch run along a track another connection already
 * uses (two lines on top of each other can't be told apart; crossing at right
 * angles is fine). A connection takes the sides of its items that make the
 * best path, unless someone set them, and several leaving the same side are
 * spread along it. Connections with bends placed by hand keep them.
 */

/** Clearance kept around items. */
const CLEAR = 0.35;
/** Grid spacing: also how far apart lines that share a stretch end up. */
const STEP = 0.5;
/** Cost of a bend, in world units of length. */
const BEND = 1.5;
/** Cost per unit of running along a track another connection uses. */
const SHARED = 6;
/** Share of that cost for running close beside another connection (under a grid step), or a grid step away: bundles are hard to follow too. */
const CLOSE = 0.6;
const NEAR = 0.25;
/** Cost of leaving a side that isn't the one facing the other end. */
const SIDE_COST = { facing: 0, across: 1.5, away: 4 };
/** Cost of each line more than a side has room for, so they spill onto another side instead of bunching up. */
const CROWD = 2.5;
/** Cost per unit of attaching away from the middle of a side. */
const SLIDE = 0.6;
/** How far past the two ends the search looks for a way around, before trying the whole level. */
const MARGIN = 5;
/** How much the search favours heading straight for the finish over trying every equal way (1 is exact). */
const GREEDY = 1.15;

/**
 * Search steps a level gets in all: a few milliseconds' work. Typical
 * diagrams use a small part of it; on very large ones the shortest
 * connections are routed first and the rest drawn the simple way. Counted in
 * steps, not time, so every machine draws the same picture.
 */
const BUDGET = 60000;
type Budget = { steps: number };

const DIRS: Pt[] = [SIDE_DIR.e, SIDE_DIR.s, SIDE_DIR.w, SIDE_DIR.n];
const dirIndex = (d: Pt) => (d.x > 0 ? 0 : d.y > 0 ? 1 : d.x < 0 ? 2 : 3);
const opposite = (i: number) => (i + 2) % 4;
const key = (v: number) => Math.round(v * 100);

type Rect = { x0: number; y0: number; x1: number; y1: number };

/** Items to keep clear of, bucketed by area, so checking a point looks at a few nearby ones only. */
class Walls {
  private buckets = new Map<number, Rect[]>();
  private static SIZE = 4;
  constructor(rects: Rect[]) {
    const S = Walls.SIZE;
    for (const r of rects) {
      for (let i = Math.floor(r.x0 / S); i <= Math.floor(r.x1 / S); i++) {
        for (let j = Math.floor(r.y0 / S); j <= Math.floor(r.y1 / S); j++) {
          const k = i * 100003 + j;
          this.buckets.set(k, [...(this.buckets.get(k) ?? []), r]);
        }
      }
    }
  }
  blocks(x: number, y: number): boolean {
    const near = this.buckets.get(Math.floor(x / Walls.SIZE) * 100003 + Math.floor(y / Walls.SIZE));
    return !!near && near.some((r) => x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1);
  }
}
type End = { anchor: EdgeAnchor; at: Pt; out: number; cost: number };

/** Which connections the router draws: orthogonal ones between two items, without hand-placed bends or lifeline ends. */
export const routed = (e: DiagramEdge) =>
  e.routing === 'orthogonal' && !e.waypoints?.length && e.from !== e.to && e.fromAnchor?.line === undefined && e.toAnchor?.line === undefined;

/** Tracks already taken: for each horizontal (h) or vertical (v) line, the stretches used along it. */
class Tracks {
  private lines = { h: new Map<number, [number, number][]>(), v: new Map<number, [number, number][]>() };
  /** Each orientation's line positions (keys), sorted, for finding the ones nearby. */
  private sorted = { h: [] as number[], v: [] as number[] };
  add(pts: Pt[]) {
    for (let i = 1; i < pts.length; i++) {
      const [p, q] = [pts[i - 1], pts[i]];
      if (Math.abs(p.y - q.y) < 1e-6) this.put('h', p.y, p.x, q.x);
      else if (Math.abs(p.x - q.x) < 1e-6) this.put('v', p.x, p.y, q.y);
    }
  }
  private put(o: 'h' | 'v', at: number, a: number, b: number) {
    const k = key(at);
    const m = this.lines[o];
    if (!m.has(k)) {
      const list = this.sorted[o];
      list.splice(lowerBound(list, k), 0, k);
    }
    m.set(k, [...(m.get(k) ?? []), [Math.min(a, b), Math.max(a, b)]]);
  }
  /**
   * How much of a stretch is already taken, weighted: in full on its own
   * track, and by closeness on tracks less than a grid step and a bit away.
   */
  shared(p: Pt, q: Pt): number {
    const o = Math.abs(p.y - q.y) < 1e-6 ? 'h' : 'v';
    const line = key(o === 'h' ? p.y : p.x);
    const [a, b] = o === 'h' ? [Math.min(p.x, q.x), Math.max(p.x, q.x)] : [Math.min(p.y, q.y), Math.max(p.y, q.y)];
    const reach = key(STEP * 1.1);
    const list = this.sorted[o];
    let total = 0;
    for (let i = lowerBound(list, line - reach); i < list.length && list[i] <= line + reach; i++) {
      const gap = Math.abs(list[i] - line);
      const weight = gap < key(0.05) ? 1 : gap < key(STEP * 0.9) ? CLOSE : NEAR;
      for (const [lo, hi] of this.lines[o].get(list[i])!) total += weight * Math.max(0, Math.min(b, hi) - Math.max(a, lo));
    }
    return total;
  }
}

function lowerBound(list: number[], v: number): number {
  let [lo, hi] = [0, list.length];
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (list[mid] < v) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Grid lines that cross a side, away from its corners: where lines can leave it on the grid, one each. */
function gridSlots(n: DiagramNode, side: Side): number[] {
  const [lo, hi] = side === 'n' || side === 's' ? [n.x, n.x + n.w] : [n.y, n.y + n.d];
  const out: number[] = [];
  for (let v = Math.ceil((lo + 0.2) / STEP) * STEP; v <= hi - 0.2 + 1e-9; v += STEP) out.push(Math.round(v * 1000) / 1000);
  return out;
}

/**
 * Where a connection can leave a node: the given anchor, or each side's
 * middle, costed by how it faces the other end and by how full the side
 * already is (`load`: how many lines leave it so far).
 */
function ends(n: DiagramNode, given: EdgeAnchor | undefined, other: DiagramNode, load: (side: Side) => number = () => 0): End[] {
  const sides: Side[] = given ? [given.side] : SIDES;
  const dx = other.x + other.w / 2 - (n.x + n.w / 2);
  const dy = other.y + other.d / 2 - (n.y + n.d / 2);
  return sides.map((side) => {
    const anchor = given ?? { side, t: 0.5 };
    const dir = SIDE_DIR[side];
    const toward = dir.x * dx + dir.y * dy;
    const facing = Math.abs(dir.x) ? Math.abs(dx) >= Math.abs(dy) && toward > 0 : Math.abs(dy) > Math.abs(dx) && toward > 0;
    const full = Math.max(0, load(side) + 1 - Math.max(1, gridSlots(n, side).length));
    const cost = given ? 0 : (facing ? SIDE_COST.facing : toward >= 0 ? SIDE_COST.across : SIDE_COST.away) + CROWD * full;
    return { anchor, at: anchorPoint(n, anchor), out: dirIndex(dir), cost };
  });
}

/** Working arrays for a search, reused between searches (reset to unvisited before each). */
let pool = { cost: new Float64Array(0), prev: new Int32Array(0) };
function buffers(n: number) {
  if (pool.cost.length < n) pool = { cost: new Float64Array(n), prev: new Int32Array(n) };
  pool.cost.fill(Infinity, 0, n);
  pool.prev.fill(-1, 0, n);
  return pool;
}

class Heap {
  private items: [number, number][] = [];
  get size() {
    return this.items.length;
  }
  push(cost: number, state: number) {
    const a = this.items;
    a.push([cost, state]);
    for (let i = a.length - 1; i > 0; ) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): [number, number] {
    const a = this.items;
    const top = a[0];
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      for (let i = 0; ; ) {
        const [l, r] = [2 * i + 1, 2 * i + 2];
        let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

/** Coordinates along one axis: the grid in a range, plus the exact ones the ends need. */
function axis(lo: number, hi: number, exact: number[]): number[] {
  const out = new Set<number>();
  for (let v = Math.floor(lo / STEP) * STEP; v <= hi + 1e-9; v += STEP) out.add(Math.round(v * 1000) / 1000);
  for (const v of exact) out.add(Math.round(v * 1000) / 1000);
  return [...out].sort((a, b) => a - b);
}

/** The cheapest grid path from any start to any finish, as world points from start to finish (excluding the anchors). */
function search(starts: End[], finishes: End[], walls: Walls, tracks: Tracks, window: Rect, budget: Budget) {
  const lead = (e: End) => ({ x: e.at.x + DIRS[e.out].x * STUB, y: e.at.y + DIRS[e.out].y * STUB });
  const S = starts.map(lead);
  const F = finishes.map(lead);
  const xs = axis(window.x0, window.x1, [...S, ...F].map((p) => p.x));
  const ys = axis(window.y0, window.y1, [...S, ...F].map((p) => p.y));
  const nx = xs.length;
  const ny = ys.length;
  // Whether each grid point is clear, worked out only for the points the search reaches (0 unknown, 1 clear, 2 blocked).
  const seen = new Uint8Array(nx * ny);
  const clear = (cell: number) => {
    if (!seen[cell]) seen[cell] = walls.blocks(xs[cell % nx], ys[Math.floor(cell / nx)]) ? 2 : 1;
    return seen[cell] === 1;
  };
  // A* estimate: the grid distance to the nearest finish, weighted a little (GREEDY) so the search
  // heads for it rather than trying every equally short way; paths come out at most a few percent longer.
  const estimate = (i: number, j: number) => {
    let m = Infinity;
    for (const f of F) m = Math.min(m, Math.abs(f.x - xs[i]) + Math.abs(f.y - ys[j]));
    return m * GREEDY;
  };
  const ix = new Map(xs.map((v, i) => [Math.round(v * 1000), i]));
  const iy = new Map(ys.map((v, i) => [Math.round(v * 1000), i]));
  const at = (p: Pt) => (iy.get(Math.round(p.y * 1000))! * nx + ix.get(Math.round(p.x * 1000))!);

  const { cost, prev } = buffers(nx * ny * 4);
  const heap = new Heap();
  starts.forEach((s, k) => {
    const cell = at(S[k]);
    if (!clear(cell)) return;
    const st = cell * 4 + s.out;
    if (s.cost < cost[st]) {
      cost[st] = s.cost;
      heap.push(s.cost + estimate(cell % nx, Math.floor(cell / nx)), st);
    }
  });
  const goals = new Map<number, number[]>();
  finishes.forEach((_, k) => {
    const cell = at(F[k]);
    if (clear(cell)) goals.set(cell, [...(goals.get(cell) ?? []), k]);
  });

  let best = Infinity;
  let bestState = -1;
  let bestFinish = -1;
  while (heap.size) {
    if (budget.steps-- <= 0) return null;
    const [f, st] = heap.pop();
    if (f >= best) break;
    const c = cost[st];
    const cell = st >> 2;
    if (f > c + estimate(cell % nx, Math.floor(cell / nx)) + 1e-6) continue;
    const dir = st & 3;
    for (const k of goals.get(cell) ?? []) {
      // Arrive heading into the node (against its side's outward direction).
      const into = opposite(finishes[k].out);
      if (dir === finishes[k].out) continue;
      const total = c + (dir === into ? 0 : BEND) + finishes[k].cost;
      if (total < best) [best, bestState, bestFinish] = [total, st, k];
    }
    const [i, j] = [cell % nx, Math.floor(cell / nx)];
    for (let nd = 0; nd < 4; nd++) {
      if (nd === opposite(dir)) continue;
      const [ni, nj] = [i + (nd === 0 ? 1 : nd === 2 ? -1 : 0), j + (nd === 1 ? 1 : nd === 3 ? -1 : 0)];
      if (ni < 0 || nj < 0 || ni >= nx || nj >= ny) continue;
      const next = nj * nx + ni;
      if (!clear(next)) continue;
      const p = { x: xs[i], y: ys[j] };
      const q = { x: xs[ni], y: ys[nj] };
      const len = Math.abs(q.x - p.x) + Math.abs(q.y - p.y);
      const step = len + (nd === dir ? 0 : BEND) + SHARED * tracks.shared(p, q);
      const ns = next * 4 + nd;
      if (c + step < cost[ns]) {
        cost[ns] = c + step;
        prev[ns] = st;
        heap.push(c + step + estimate(ni, nj) - (c + step) * 1e-6, ns);
      }
    }
  }
  if (bestState < 0) return null;
  const path: Pt[] = [];
  let first = bestState;
  for (let st = bestState; st >= 0; st = prev[st]) {
    const cell = st >> 2;
    path.push({ x: xs[cell % nx], y: ys[Math.floor(cell / nx)] });
    first = st;
  }
  path.reverse();
  const start = starts.findIndex((s, k) => at(S[k]) * 4 + s.out === first);
  return { path, start: starts[Math.max(0, start)], finish: finishes[bestFinish] };
}

const bounds = (pts: Pt[], pad: number): Rect => ({
  x0: Math.min(...pts.map((p) => p.x)) - pad,
  y0: Math.min(...pts.map((p) => p.y)) - pad,
  x1: Math.max(...pts.map((p) => p.x)) + pad,
  y1: Math.max(...pts.map((p) => p.y)) + pad,
});

function route(a: DiagramNode, b: DiagramNode, from: End[], to: End[], walls: Walls, tracks: Tracks, level: Rect, budget: Budget, wide = true) {
  const pts = [...from, ...to].map((e) => e.at);
  const near = search(from, to, walls, tracks, bounds(pts, MARGIN), budget);
  const found =
    near ??
    (wide
      ? search(from, to, walls, tracks, { x0: Math.min(level.x0, ...pts.map((p) => p.x)) - MARGIN, y0: Math.min(level.y0, ...pts.map((p) => p.y)) - MARGIN, x1: Math.max(level.x1, ...pts.map((p) => p.x)) + MARGIN, y1: Math.max(level.y1, ...pts.map((p) => p.y)) + MARGIN }, budget)
      : null);
  if (!found) return null;
  const { path, start, finish } = found;
  const pts2 = simplifyPath([start.at, ...path, finish.at]);
  return {
    pts: pts2,
    zs: interpolateZ(pts2, a.z, b.z),
    from: start.anchor,
    to: finish.anchor,
    aDir: DIRS[start.out],
    bDir: DIRS[finish.out],
  } satisfies ResolvedEdge;
}

/** The route for a connection, if the router drew it with these exact two items. */
export type Routes = LevelRoutes;

const cache = new WeakMap<DiagramNode[], WeakMap<DiagramEdge[], Routes>>();

/** Routes for a level's orthogonal connections, worked out together (and remembered for the same level). */
export function routeEdges(d: Pick<Diagram, 'nodes' | 'edges'>): Routes {
  const byEdges = cache.get(d.nodes) ?? new WeakMap<DiagramEdge[], Routes>();
  cache.set(d.nodes, byEdges);
  let routes = byEdges.get(d.edges);
  if (!routes) {
    routes = computeRoutes(d);
    byEdges.set(d.edges, routes);
  }
  return routes;
}

function computeRoutes(d: Pick<Diagram, 'nodes' | 'edges'>): Routes {
  const byId = new Map(d.nodes.map((n) => [n.id, n]));
  const solid = d.nodes.filter((n) => !isContainer(n) && n.kind !== 'text');
  const walls = new Walls(solid.map((n) => ({ x0: n.x - CLEAR, y0: n.y - CLEAR, x1: n.x + n.w + CLEAR, y1: n.y + n.d + CLEAR })));
  const level = solid.length ? bounds(solid.flatMap((n) => [{ x: n.x, y: n.y }, { x: n.x + n.w, y: n.y + n.d }]), 0) : { x0: 0, y0: 0, x1: 0, y1: 0 };
  const edges = d.edges.filter((e) => routed(e) && byId.has(e.from) && byId.has(e.to));
  const out = new Map<string, { r: ResolvedEdge; a: DiagramNode; b: DiagramNode }>();
  const budget = { steps: BUDGET };

  // First pass: the best sides for each connection, routed on its own, avoiding sides that are full.
  const load = new Map<string, number>();
  const loadOf = (n: DiagramNode) => (side: Side) => load.get(`${n.id}:${side}`) ?? 0;
  const sides = new Map<string, [EdgeAnchor, EdgeAnchor]>();
  for (const e of edges) {
    const [a, b] = [byId.get(e.from)!, byId.get(e.to)!];
    // Choosing sides only needs a look nearby; without one, take the sides that face each other.
    const r = route(a, b, ends(a, e.fromAnchor, b, loadOf(a)), ends(b, e.toAnchor, a, loadOf(b)), walls, new Tracks(), level, budget, false);
    if (!r) {
      const [f, t] = autoAnchors(a, b);
      sides.set(e.id, [e.fromAnchor ?? f, e.toAnchor ?? t]);
      continue;
    }
    sides.set(e.id, [r.from, r.to]);
    if (!e.fromAnchor) load.set(`${a.id}:${r.from.side}`, loadOf(a)(r.from.side) + 1);
    if (!e.toAnchor) load.set(`${b.id}:${r.to.side}`, loadOf(b)(r.to.side) + 1);
  }

  // Spread connections that leave the same side along it, in the order of where they're going:
  // on grid lines where there's room, so lines leave at least a grid step apart.
  const slots = new Map<string, { id: string; end: 0 | 1; along: number }[]>();
  for (const e of edges) {
    const s = sides.get(e.id);
    if (!s) continue;
    ([0, 1] as const).forEach((end) => {
      if ((end === 0 ? e.fromAnchor : e.toAnchor) !== undefined) return;
      const [self, other] = end === 0 ? [byId.get(e.from)!, byId.get(e.to)!] : [byId.get(e.to)!, byId.get(e.from)!];
      const side = s[end].side;
      const along = side === 'n' || side === 's' ? other.x + other.w / 2 : other.y + other.d / 2;
      const k = `${self.id}:${side}`;
      slots.set(k, [...(slots.get(k) ?? []), { id: e.id, end, along }]);
    });
  }
  const t = new Map<string, number>();
  for (const [k, list] of slots) {
    list.sort((p, q) => p.along - q.along);
    const [id, side] = k.split(':') as [string, Side];
    const n = byId.get(id)!;
    const grid = gridSlots(n, side);
    const [lo, span] = side === 'n' || side === 's' ? [n.x, n.w] : [n.y, n.d];
    const mid = lo + span / 2;
    list.forEach((s, i) => {
      let at: number;
      if (!grid.length || list.length > grid.length) at = lo + (span * (i + 1)) / (list.length + 1);
      else if (list.length === 1) at = grid.reduce((best, v) => (Math.abs(v - mid) < Math.abs(best - mid) ? v : best));
      else at = grid[Math.floor(((i + 0.5) * grid.length) / list.length)];
      t.set(`${s.id}:${s.end}`, (at - lo) / span);
    });
  }

  // Second pass: route for real, shortest first, each keeping off the tracks the others took.
  const tracks = new Tracks();
  const length = (e: DiagramEdge) => {
    const [a, b] = [byId.get(e.from)!, byId.get(e.to)!];
    return Math.abs(a.x + a.w / 2 - b.x - b.w / 2) + Math.abs(a.y + a.d / 2 - b.y - b.d / 2);
  };
  for (const e of [...edges].sort((p, q) => length(p) - length(q))) {
    const [a, b] = [byId.get(e.from)!, byId.get(e.to)!];
    const s = sides.get(e.id);
    // An end whose side it has to itself can attach anywhere along it on the grid (a little dearer away
    // from the middle), so it can dodge a line coming the other way; shared sides keep their slots.
    const options = (end: 0 | 1, n: DiagramNode, other: DiagramNode, given: EdgeAnchor | undefined): End[] => {
      if (given || !s) return ends(n, given, other);
      const side = s[end].side;
      const own = (slots.get(`${n.id}:${side}`)?.length ?? 0) <= 1;
      const grid = gridSlots(n, side);
      const [lo, span] = side === 'n' || side === 's' ? [n.x, n.w] : [n.y, n.d];
      if (!own || grid.length < 2) return ends(n, { side, t: t.get(`${e.id}:${end}`) ?? 0.5 }, other);
      return grid.map((v) => ({ ...ends(n, { side, t: (v - lo) / span }, other)[0], cost: SLIDE * Math.abs(v - (lo + span / 2)) }));
    };
    const r = route(a, b, options(0, a, b, e.fromAnchor), options(1, b, a, e.toAnchor), walls, tracks, level, budget);
    if (!r) continue;
    tracks.add(r.pts);
    out.set(e.id, { r, a, b });
  }

  return {
    get: (edge, a, b) => {
      const hit = out.get(edge.id);
      return hit && hit.a === a && hit.b === b ? hit.r : undefined;
    },
  };
}

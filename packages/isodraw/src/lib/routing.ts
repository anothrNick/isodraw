import { center, clipToRect, snap, type Projector, type Pt } from './geometry';
import type { DiagramEdge, DiagramNode, EdgeAnchor, LineStyle, MarkerKind, Side } from './types';

export const SIDE_DIR: Record<Side, Pt> = {
  n: { x: 0, y: -1 },
  e: { x: 1, y: 0 },
  s: { x: 0, y: 1 },
  w: { x: -1, y: 0 },
};
export const SIDES: Side[] = ['n', 'e', 's', 'w'];

/** Gap between a node's footprint and the end of its edges. */
const GAP = 0.12;
/** Length of the straight lead-out from an anchor before the first bend. */
export const STUB = 0.6;
const EPS = 1e-6;
const ROUND = new Set(['cylinder', 'cone', 'circleArea', 'sphere']);

type Axis = 'x' | 'y';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const axisOf = (d: Pt): Axis => (Math.abs(d.x) > Math.abs(d.y) ? 'x' : 'y');
const aligned = (a: Pt, b: Pt) => Math.abs(a.x - b.x) < EPS || Math.abs(a.y - b.y) < EPS;
const add = (a: Pt, d: Pt, k = 1): Pt => ({ x: a.x + d.x * k, y: a.y + d.y * k });

// ---------- legacy field compatibility ----------

export const lineStyleOf = (e: DiagramEdge): LineStyle => e.lineStyle ?? (e.dashed ? 'dashed' : 'solid');
export const startMarkerOf = (e: DiagramEdge): MarkerKind => e.startMarker ?? (e.arrowStart ? 'arrow' : 'none');
export const endMarkerOf = (e: DiagramEdge): MarkerKind => e.endMarker ?? (e.arrowEnd ? 'arrow' : 'none');

// ---------- anchors ----------

/** World point on a node's outline for an anchor, pushed out by `gap`. */
export function anchorPoint(n: DiagramNode, a: EdgeAnchor, gap = GAP): Pt {
  const t = clamp(a.t, 0, 1);
  const cx = n.x + n.w / 2;
  const cy = n.y + n.d / 2;
  let p: Pt;
  if (a.side === 'n' || a.side === 's') {
    const x = n.x + t * n.w;
    let y = a.side === 'n' ? n.y : n.y + n.d;
    if (ROUND.has(n.kind)) {
      const u = (x - cx) / (n.w / 2);
      y = cy + (a.side === 'n' ? -1 : 1) * (n.d / 2) * Math.sqrt(Math.max(0, 1 - u * u));
    }
    p = { x, y };
  } else {
    const y = n.y + t * n.d;
    let x = a.side === 'w' ? n.x : n.x + n.w;
    if (ROUND.has(n.kind)) {
      const u = (y - cy) / (n.d / 2);
      x = cx + (a.side === 'w' ? -1 : 1) * (n.w / 2) * Math.sqrt(Math.max(0, 1 - u * u));
    }
    p = { x, y };
  }
  return add(p, SIDE_DIR[a.side], gap);
}

/** Position along a side for a world coordinate (y for e/w sides, x for n/s). */
function levelToT(n: DiagramNode, side: Side, level: number): number {
  return side === 'e' || side === 'w' ? clamp((level - n.y) / n.d, 0, 1) : clamp((level - n.x) / n.w, 0, 1);
}

/** The anchor on a node closest to a world point, snapped to quarter units. */
export function nearestAnchor(n: DiagramNode, p: Pt): EdgeAnchor {
  const dist: Record<Side, number> = {
    n: Math.abs(p.y - n.y),
    s: Math.abs(p.y - (n.y + n.d)),
    w: Math.abs(p.x - n.x),
    e: Math.abs(p.x - (n.x + n.w)),
  };
  const side = SIDES.reduce((best, s) => (dist[s] < dist[best] ? s : best), 'n' as Side);
  const level = side === 'e' || side === 'w' ? snap(p.y, 0.25) : snap(p.x, 0.25);
  return { side, t: levelToT(n, side, level) };
}

/** Side of `n` facing world point `p`; aligned to p when p is level with the side. */
function anchorToward(n: DiagramNode, p: Pt): EdgeAnchor {
  const c = center(n);
  const dx = (p.x - c.x) / Math.max(n.w, EPS);
  const dy = (p.y - c.y) / Math.max(n.d, EPS);
  const side: Side = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'e' : 'w') : dy > 0 ? 's' : 'n';
  const level = side === 'e' || side === 'w' ? p.y : p.x;
  const t = levelToT(n, side, level);
  return { side, t: t > 0 && t < 1 ? t : 0.5 };
}

function autoAnchors(a: DiagramNode, b: DiagramNode): [EdgeAnchor, EdgeAnchor] {
  const ca = center(a);
  const cb = center(b);
  const dx = cb.x - ca.x;
  const dy = cb.y - ca.y;
  // Prefer the axis with the larger gap between footprints.
  const gapX = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w));
  const gapY = Math.max(b.y - (a.y + a.d), a.y - (b.y + b.d));
  const horizontal = gapX > 0 || gapY > 0 ? gapX >= gapY : Math.abs(dx) >= Math.abs(dy);
  if (horizontal) return [{ side: dx > 0 ? 'e' : 'w', t: 0.5 }, { side: dx > 0 ? 'w' : 'e', t: 0.5 }];
  return [{ side: dy > 0 ? 's' : 'n', t: 0.5 }, { side: dy > 0 ? 'n' : 's', t: 0.5 }];
}

// ---------- orthogonal routing ----------

/** Drop duplicate and collinear points (keeps the endpoints). */
export function simplifyPath(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.x - p.x) < EPS && Math.abs(last.y - p.y) < EPS) continue;
    out.push(p);
  }
  for (let i = 1; i < out.length - 1; ) {
    const a = out[i - 1];
    const b = out[i];
    const c = out[i + 1];
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (Math.abs(cross) < EPS) out.splice(i, 1);
    else i++;
  }
  return out;
}

/**
 * Connect points with horizontal/vertical legs, inserting an elbow wherever two
 * consecutive points are not aligned. Elbows continue along the current axis;
 * the final leg is forced onto `endAxis` when given.
 */
export function orthogonalize(pts: Pt[], startAxis: Axis, endAxis: Axis | null): Pt[] {
  const out: Pt[] = [pts[0]];
  let axis = startAxis;
  for (let k = 1; k < pts.length; k++) {
    const cur = out[out.length - 1];
    const t = pts[k];
    if (!aligned(cur, t)) {
      const last = k === pts.length - 1 && endAxis;
      let elbow: Pt;
      if (last) elbow = endAxis === 'x' ? { x: cur.x, y: t.y } : { x: t.x, y: cur.y };
      else elbow = axis === 'x' ? { x: t.x, y: cur.y } : { x: cur.x, y: t.y };
      out.push(elbow);
    }
    const prev = out[out.length - 1];
    if (Math.abs(t.x - prev.x) > EPS) axis = 'x';
    else if (Math.abs(t.y - prev.y) > EPS) axis = 'y';
    out.push(t);
  }
  return out;
}

function autoOrtho(A: Pt, ad: Pt, B: Pt, bd: Pt): Pt[] {
  const S = add(A, ad, STUB);
  const E = add(B, bd, STUB);
  const ah = ad.x !== 0;
  const bh = bd.x !== 0;
  if (ah && bh) {
    if (ad.x === -bd.x) {
      if ((E.x - S.x) * ad.x >= 0) {
        const mx = (S.x + E.x) / 2;
        return [A, S, { x: mx, y: S.y }, { x: mx, y: E.y }, E, B];
      }
      const my = (S.y + E.y) / 2;
      return [A, S, { x: S.x, y: my }, { x: E.x, y: my }, E, B];
    }
    const X = ad.x > 0 ? Math.max(S.x, E.x) : Math.min(S.x, E.x);
    return [A, { x: X, y: A.y }, { x: X, y: B.y }, B];
  }
  if (!ah && !bh) {
    if (ad.y === -bd.y) {
      if ((E.y - S.y) * ad.y >= 0) {
        const my = (S.y + E.y) / 2;
        return [A, S, { x: S.x, y: my }, { x: E.x, y: my }, E, B];
      }
      const mx = (S.x + E.x) / 2;
      return [A, S, { x: mx, y: S.y }, { x: mx, y: E.y }, E, B];
    }
    const Y = ad.y > 0 ? Math.max(S.y, E.y) : Math.min(S.y, E.y);
    return [A, { x: A.x, y: Y }, { x: B.x, y: Y }, B];
  }
  if (ah) {
    const ok = (E.x - S.x) * ad.x >= 0 && (E.y - S.y) * -bd.y >= 0;
    return ok ? [A, S, { x: E.x, y: S.y }, E, B] : [A, S, { x: S.x, y: E.y }, E, B];
  }
  const ok = (E.y - S.y) * ad.y >= 0 && (E.x - S.x) * -bd.x >= 0;
  return ok ? [A, S, { x: S.x, y: E.y }, E, B] : [A, S, { x: E.x, y: S.y }, E, B];
}

export function orthoRoute(A: Pt, ad: Pt, B: Pt, bd: Pt, waypoints: Pt[]): Pt[] {
  if (!waypoints.length) return simplifyPath(autoOrtho(A, ad, B, bd));
  const S = add(A, ad, STUB);
  const E = add(B, bd, STUB);
  const pts = orthogonalize([A, S, ...waypoints, E], axisOf(ad), axisOf(bd));
  pts.push(B);
  return simplifyPath(pts);
}

// ---------- resolved edge geometry ----------

export interface ResolvedEdge {
  /** World-space polyline (for curved edges: the points the curve passes through). */
  pts: Pt[];
  /** Elevation of each point. */
  zs: number[];
  from: EdgeAnchor;
  to: EdgeAnchor;
  /** Outward directions at each end (world). */
  aDir: Pt;
  bDir: Pt;
}

function interpolateZ(pts: Pt[], za: number, zb: number): number[] {
  if (za === zb) return pts.map(() => za);
  const seg = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = seg.reduce((s, v) => s + v, 0) || 1;
  let acc = 0;
  return pts.map((_, i) => {
    if (i > 0) acc += seg[i - 1];
    return za + (zb - za) * (acc / total);
  });
}

export function resolveEdge(edge: Pick<DiagramEdge, 'routing' | 'fromAnchor' | 'toAnchor' | 'waypoints'>, a: DiagramNode, b: DiagramNode): ResolvedEdge {
  const wps = edge.waypoints ?? [];
  const auto = autoAnchors(a, b);
  const from = edge.fromAnchor ?? (wps.length ? anchorToward(a, wps[0]) : auto[0]);
  const to = edge.toAnchor ?? (wps.length ? anchorToward(b, wps[wps.length - 1]) : auto[1]);
  const aDir = SIDE_DIR[from.side];
  const bDir = SIDE_DIR[to.side];
  let pts: Pt[];
  if (edge.routing === 'orthogonal') {
    pts = orthoRoute(anchorPoint(a, from), aDir, anchorPoint(b, to), bDir, wps);
  } else if (edge.routing === 'straight' && !edge.fromAnchor && !edge.toAnchor) {
    // Free straight lines aim at the node centers and stop at the footprint.
    const ca = center(a);
    const cb = center(b);
    const first = wps[0] ?? cb;
    const last = wps[wps.length - 1] ?? ca;
    pts = [clipToRect(first, ca, a), ...wps, clipToRect(last, cb, b)];
  } else {
    pts = [anchorPoint(a, from), ...wps, anchorPoint(b, to)];
  }
  return { pts, zs: interpolateZ(pts, a.z, b.z), from, to, aDir, bDir };
}

// ---------- SVG path building ----------

/** Build the scene-space SVG path for a resolved edge. */
export function edgePathD(r: ResolvedEdge, routing: DiagramEdge['routing'], rounded: boolean, proj: Projector): string {
  const P = (p: Pt, z: number) => {
    const s = proj.project(p.x, p.y, z);
    return `${s.x.toFixed(2)},${s.y.toFixed(2)}`;
  };
  const { pts, zs } = r;
  if (routing === 'curved') {
    if (pts.length === 2) {
      const [A, B] = pts;
      const k = clamp(Math.hypot(B.x - A.x, B.y - A.y) * 0.45, 0.8, 5);
      const zm = (zs[0] + zs[1]) / 2;
      return `M${P(A, zs[0])} C${P(add(A, r.aDir, k), zm)} ${P(add(B, r.bDir, k), zm)} ${P(B, zs[1])}`;
    }
    // Catmull-Rom through all points, as cubic Béziers.
    let d = `M${P(pts[0], zs[0])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? add(pts[0], r.aDir, -1);
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? add(pts[pts.length - 1], r.bDir, -1);
      const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
      const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
      d += ` C${P(c1, zs[i])} ${P(c2, zs[i + 1])} ${P(p2, zs[i + 1])}`;
    }
    return d;
  }
  if (routing === 'orthogonal' && rounded && pts.length > 2) {
    let d = `M${P(pts[0], zs[0])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i - 1];
      const v = pts[i];
      const n = pts[i + 1];
      const l1 = Math.hypot(v.x - p.x, v.y - p.y);
      const l2 = Math.hypot(n.x - v.x, n.y - v.y);
      const rad = Math.min(0.4, l1 / 2, l2 / 2);
      const a = { x: v.x - ((v.x - p.x) / (l1 || 1)) * rad, y: v.y - ((v.y - p.y) / (l1 || 1)) * rad };
      const b = { x: v.x + ((n.x - v.x) / (l2 || 1)) * rad, y: v.y + ((n.y - v.y) / (l2 || 1)) * rad };
      d += ` L${P(a, zs[i])} Q${P(v, zs[i])} ${P(b, zs[i])}`;
    }
    return `${d} L${P(pts[pts.length - 1], zs[zs.length - 1])}`;
  }
  return `M${pts.map((p, i) => P(p, zs[i])).join(' L')}`;
}

// ---------- inferring a route from a freehand drag ----------

function rdp(pts: Pt[], eps: number): Pt[] {
  if (pts.length < 3) return pts;
  const a = pts[0];
  const b = pts[pts.length - 1];
  const len = Math.hypot(b.x - a.x, b.y - a.y) || EPS;
  let max = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const d = Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) / len;
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  if (max <= eps) return [a, b];
  return [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)];
}

function inside(n: DiagramNode, p: Pt, pad = 0.25): boolean {
  return p.x >= n.x - pad && p.x <= n.x + n.w + pad && p.y >= n.y - pad && p.y <= n.y + n.d + pad;
}

export interface InferredRoute {
  fromAnchor?: EdgeAnchor;
  toAnchor?: EdgeAnchor;
  waypoints: Pt[];
}

/**
 * Turn the pointer trail of a connection drag into anchors and orthogonal bends.
 * The trail is simplified into horizontal/vertical runs whose levels snap to the
 * grid; each change of direction becomes a bend. A straight drag returns no
 * waypoints so the edge routes itself automatically.
 */
export function inferRoute(trail: Pt[], from: DiagramNode, fromSide: Side | undefined, to: DiagramNode | null): InferredRoute {
  const pts = trail.slice();
  while (pts.length && inside(from, pts[0])) pts.shift();
  if (to) while (pts.length && inside(to, pts[pts.length - 1])) pts.pop();
  const fixedFrom = fromSide ? { fromAnchor: { side: fromSide, t: 0.5 } } : {};
  if (pts.length < 2) return { ...fixedFrom, waypoints: [] };

  const runs: { axis: Axis; net: number; level: number; len: number }[] = [];
  const simp = rdp(pts, 0.45);
  for (let i = 1; i < simp.length; i++) {
    const p = simp[i - 1];
    const q = simp[i];
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.35) continue;
    const axis: Axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
    const level = axis === 'x' ? (p.y + q.y) / 2 : (p.x + q.x) / 2;
    const net = axis === 'x' ? dx : dy;
    const last = runs[runs.length - 1];
    if (last && last.axis === axis) {
      last.level = (last.level * last.len + level * len) / (last.len + len);
      last.len += len;
      last.net += net;
    } else {
      runs.push({ axis, net, level, len });
    }
  }
  for (const r of runs) r.level = snap(r.level, 0.5);
  if (runs.length < 2) return { ...fixedFrom, waypoints: [] };

  const first = runs[0];
  const side: Side = fromSide ?? (first.axis === 'x' ? (first.net > 0 ? 'e' : 'w') : first.net > 0 ? 's' : 'n');
  const sideAxis: Axis = side === 'e' || side === 'w' ? 'x' : 'y';
  const fromAnchor = { side, t: first.axis === sideAxis ? levelToT(from, side, first.level) : 0.5 };

  const waypoints: Pt[] = [];
  for (let i = 0; i < runs.length - 1; i++) {
    const r = runs[i];
    const q = runs[i + 1];
    waypoints.push(r.axis === 'x' ? { x: q.level, y: r.level } : { x: r.level, y: q.level });
  }

  let toAnchor: EdgeAnchor | undefined;
  if (to) {
    const last = runs[runs.length - 1];
    const toSide: Side = last.axis === 'x' ? (last.net > 0 ? 'w' : 'e') : last.net > 0 ? 'n' : 's';
    toAnchor = { side: toSide, t: levelToT(to, toSide, last.level) };
  }
  return { fromAnchor, toAnchor, waypoints };
}

/** Preview route from a node to a free point while a connection is being drawn. */
export function previewRoute(from: DiagramNode, inferred: InferredRoute, cursor: Pt): Pt[] {
  const anchor = inferred.fromAnchor ?? anchorToward(from, inferred.waypoints[0] ?? cursor);
  const A = anchorPoint(from, anchor);
  const ad = SIDE_DIR[anchor.side];
  return simplifyPath(orthogonalize([A, add(A, ad, STUB), ...inferred.waypoints, cursor], axisOf(ad), null));
}

/** Screen-space length of a polyline. */
export function polylineLength(pts: { x: number; y: number }[]): number {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return l;
}

// ---------- editing ----------

type RouteFields = Pick<DiagramEdge, 'fromAnchor' | 'toAnchor' | 'waypoints'>;

/**
 * Move segment `i` of an orthogonal route to a new level (y for horizontal
 * segments, x for vertical ones). End segments slide their anchor along the
 * node's side when they can, otherwise a short jog is inserted so the edge
 * stays attached.
 */
export function moveSegment(r: ResolvedEdge, a: DiagramNode, b: DiagramNode, i: number, level: number): RouteFields {
  let Q = r.pts.map((p) => ({ ...p }));
  const horizontal = Math.abs(Q[i].y - Q[i + 1].y) < EPS;
  const set = (p: Pt) => {
    if (horizontal) p.y = level;
    else p.x = level;
  };
  const slide = (node: DiagramNode, anchor: EdgeAnchor): EdgeAnchor | null => {
    const alongSide = anchor.side === 'e' || anchor.side === 'w' ? horizontal : !horizontal;
    if (!alongSide) return null;
    const lo = horizontal ? node.y : node.x;
    const size = horizontal ? node.d : node.w;
    return level >= lo && level <= lo + size ? { side: anchor.side, t: (level - lo) / size } : null;
  };
  let from = r.from;
  let to = r.to;
  const last = Q.length - 2;
  const isFirst = i === 0;
  const isLast = i === last;
  if (!isFirst && !isLast) {
    set(Q[i]);
    set(Q[i + 1]);
  } else {
    const sa = isFirst ? slide(a, from) : null;
    const sb = isLast ? slide(b, to) : null;
    if (isFirst && !isLast) set(Q[1]);
    if (isLast && !isFirst) set(Q[last]);
    if (isFirst) {
      if (sa) {
        from = sa;
        set(Q[0]);
      } else {
        const S = add(Q[0], r.aDir, STUB);
        const S2 = { ...S };
        set(S2);
        Q = [Q[0], S, S2, ...Q.slice(1)];
      }
    }
    if (isLast) {
      const n = Q.length - 1;
      if (sb) {
        to = sb;
        set(Q[n]);
      } else {
        const E = add(Q[n], r.bDir, STUB);
        const E2 = { ...E };
        set(E2);
        Q = [...Q.slice(0, n), E2, E, Q[n]];
      }
    }
  }
  return { fromAnchor: from, toAnchor: to, waypoints: simplifyPath(Q).slice(1, -1) };
}

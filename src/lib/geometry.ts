import type { DiagramNode, Rotation, ShapeKind, ViewMode } from './types';

/** Pixels per grid unit (before camera zoom). */
export const TILE = 32;
/** Vertical scale of heights in the isometric view. */
const HZ = 0.82;
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

export interface Pt {
  x: number;
  y: number;
}
export interface Pt3 extends Pt {
  z: number;
}
/** SVG affine matrix [a, b, c, d, e, f]. */
export type Matrix = [number, number, number, number, number, number];

export const FLAT_KINDS: ReadonlySet<ShapeKind> = new Set(['area', 'circleArea', 'text']);

/** True when a node lies on its base plane and has no volume. */
export function isFlat(n: DiagramNode): boolean {
  if (FLAT_KINDS.has(n.kind)) return true;
  if (n.kind === 'image') return n.imageStyle === 'flat';
  return false;
}

/** Rotate a ground vector by quarter turns. */
export function rotate(x: number, y: number, r: Rotation): Pt {
  switch (r) {
    case 1:
      return { x: -y, y: x };
    case 2:
      return { x: -x, y: -y };
    case 3:
      return { x: y, y: -x };
    default:
      return { x, y };
  }
}

/** Maps world coordinates to scene pixels (before camera transform). */
export class Projector {
  constructor(
    readonly mode: ViewMode,
    readonly rotation: Rotation,
  ) {}

  project(x: number, y: number, z = 0): Pt {
    if (this.mode === '2d') return { x: x * TILE, y: y * TILE };
    const r = rotate(x, y, this.rotation);
    return {
      x: (r.x - r.y) * TILE * COS30,
      y: (r.x + r.y) * TILE * SIN30 - z * TILE * HZ,
    };
  }

  /** Affine matrix mapping ground-plane world units at elevation z to scene pixels. */
  groundMatrix(z = 0): Matrix {
    const o = this.project(0, 0, z);
    const ux = this.project(1, 0, z);
    const uy = this.project(0, 1, z);
    return [ux.x - o.x, ux.y - o.y, uy.x - o.x, uy.y - o.y, o.x, o.y];
  }

  /** Inverse of the ground projection: scene pixel → world ground point at elevation z. */
  unproject(sx: number, sy: number, z = 0): Pt {
    const [a, b, c, d, e, f] = this.groundMatrix(z);
    const det = a * d - b * c;
    const px = sx - e;
    const py = sy - f;
    return { x: (d * px - c * py) / det, y: (-b * px + a * py) / det };
  }

  /** Pixels on screen per unit of height (0 in 2D). */
  get heightScale(): number {
    return this.mode === '2d' ? 0 : TILE * HZ;
  }
}

/**
 * Quarter turns (0..3) to rotate ground-plane content (text, logos) so it reads
 * upright: the turn whose "rightward" direction points most to the right on
 * screen, preferring right-and-down on ties.
 */
export function readableTurns(proj: Projector): number {
  const o = proj.project(0, 0);
  const dirs = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
  ];
  let best = 0;
  let bx = -Infinity;
  let by = -Infinity;
  dirs.forEach((d, k) => {
    const p = proj.project(d.x, d.y);
    const sx = p.x - o.x;
    const sy = p.y - o.y;
    if (sx > bx + 1e-6 || (Math.abs(sx - bx) <= 1e-6 && sy > by)) {
      best = k;
      bx = sx;
      by = sy;
    }
  });
  return best;
}

/**
 * 0 or 2 quarter turns: flip ground-plane text 180° only when it would read
 * upside down (its east-running baseline points left on screen), so it keeps
 * running along the same axis as the diagram.
 */
export function flipTurns(proj: Projector): number {
  const o = proj.project(0, 0);
  const p = proj.project(1, 0);
  const sx = p.x - o.x;
  const sy = p.y - o.y;
  return sx < -1e-6 || (Math.abs(sx) <= 1e-6 && sy < 0) ? 2 : 0;
}

export function matrixAttr(m: Matrix): string {
  return `matrix(${m.map((v) => +v.toFixed(5)).join(' ')})`;
}

// ---------- footprints & faces ----------

function ellipsePoly(n: DiagramNode, segments: number, phase = 0): Pt[] {
  const cx = n.x + n.w / 2;
  const cy = n.y + n.d / 2;
  const pts: Pt[] = [];
  for (let i = 0; i < segments; i++) {
    const a = phase + (i / segments) * Math.PI * 2;
    pts.push({ x: cx + (Math.cos(a) * n.w) / 2, y: cy + (Math.sin(a) * n.d) / 2 });
  }
  return pts;
}

export function rectPoly(n: { x: number; y: number; w: number; d: number }): Pt[] {
  return [
    { x: n.x, y: n.y },
    { x: n.x + n.w, y: n.y },
    { x: n.x + n.w, y: n.y + n.d },
    { x: n.x, y: n.y + n.d },
  ];
}

/** Ground footprint polygon of a node in world units. */
export function footprint(n: DiagramNode): Pt[] {
  switch (n.kind) {
    case 'cylinder':
    case 'cone':
    case 'circleArea':
    case 'sphere':
      return ellipsePoly(n, 40);
    case 'hexagon':
      return ellipsePoly(n, 6);
    default:
      return rectPoly(n);
  }
}

export interface Face {
  points: Pt[];
  /** Brightness multiplier 0..1. */
  light: number;
}

function signedArea(pts: Pt[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

/** Light for a face with world-space normal (nx, ny, nz), after view rotation. */
function faceLight(proj: Projector, nx: number, ny: number, nz: number): number {
  const r = rotate(nx, ny, proj.rotation);
  const len = Math.hypot(r.x, r.y, nz) || 1;
  const t = (r.y - r.x) / Math.SQRT2 / len; // + facing screen-left
  const side = 0.74 + 0.12 * t;
  return side + (1 - side) * Math.max(0, nz / len) * 0.75;
}

/**
 * Visible faces of a solid node, already ordered back-to-front,
 * projected to scene pixels.
 */
export function solidFaces(n: DiagramNode, proj: Projector): Face[] {
  const base = footprint(n);
  const z0 = n.z;
  const z1 = n.z + Math.max(0, n.h);
  const cx = n.x + n.w / 2;
  const cy = n.y + n.d / 2;
  const top2d = base.map((p) => proj.project(p.x, p.y, z1));
  const refSign = Math.sign(signedArea(top2d)) || 1;
  const faces: Face[] = [];

  if (n.kind === 'pyramid' || n.kind === 'cone') {
    const apex = proj.project(cx, cy, z1);
    const baseProj = base.map((p) => proj.project(p.x, p.y, z0));
    if (proj.mode === '2d') {
      faces.push({ points: baseProj, light: 0.9 });
    }
    for (let i = 0; i < base.length; i++) {
      const j = (i + 1) % base.length;
      const pts = [baseProj[i], baseProj[j], apex];
      const area = signedArea(pts);
      if (Math.sign(area) !== refSign || Math.abs(area) < 0.01) continue;
      // Outward normal from edge + slope.
      const ex = base[j].x - base[i].x;
      const ey = base[j].y - base[i].y;
      let nx = ey;
      let ny = -ex;
      const mx = (base[i].x + base[j].x) / 2 - cx;
      const my = (base[i].y + base[j].y) / 2 - cy;
      if (nx * mx + ny * my < 0) {
        nx = -nx;
        ny = -ny;
      }
      const horiz = Math.hypot(mx, my) || 1;
      const nl = Math.hypot(nx, ny) || 1;
      const slope = horiz / Math.max(0.01, z1 - z0);
      faces.push({ points: pts, light: faceLight(proj, nx / nl, ny / nl, slope) });
    }
    return faces;
  }

  // Prisms: block, cylinder, hexagon, image tiles.
  for (let i = 0; i < base.length; i++) {
    const j = (i + 1) % base.length;
    const pts = [
      proj.project(base[i].x, base[i].y, z0),
      proj.project(base[j].x, base[j].y, z0),
      proj.project(base[j].x, base[j].y, z1),
      proj.project(base[i].x, base[i].y, z1),
    ];
    const area = signedArea(pts);
    if (Math.sign(area) !== refSign || Math.abs(area) < 0.01) continue;
    const ex = base[j].x - base[i].x;
    const ey = base[j].y - base[i].y;
    let nx = ey;
    let ny = -ex;
    if (nx * ((base[i].x + base[j].x) / 2 - cx) + ny * ((base[i].y + base[j].y) / 2 - cy) < 0) {
      nx = -nx;
      ny = -ny;
    }
    faces.push({ points: pts, light: faceLight(proj, nx, ny, 0) });
  }
  faces.push({ points: top2d, light: 1 });
  return faces;
}

// ---------- colors ----------

function parseHex(c: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((ch) => ch + ch).join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Multiply a hex color's channels by `k` (k > 1 lightens toward white). */
export function shade(color: string, k: number): string {
  const rgb = parseHex(color);
  if (!rgb) return color;
  const out = rgb.map((v) => {
    const r = k <= 1 ? v * k : v + (255 - v) * (k - 1);
    return Math.max(0, Math.min(255, Math.round(r)));
  });
  return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Pick black or white text for a background color. */
export function contrastText(color: string): string {
  const rgb = parseHex(color);
  if (!rgb) return '#1f2937';
  const [r, g, b] = rgb;
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? '#1f2937' : '#ffffff';
}

// ---------- depth sorting ----------

interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

function rotatedBox(n: DiagramNode, r: Rotation): Box {
  const pts = rectPoly(n).map((p) => rotate(p.x, p.y, r));
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    minZ: n.z,
    maxZ: n.z + (isFlat(n) ? 0 : Math.max(0.01, n.h)),
  };
}

const EPS = 1e-6;

/** Should a be painted before b? */
function behind(a: Box, b: Box): boolean | null {
  if (a.maxX <= b.minX + EPS) return true;
  if (b.maxX <= a.minX + EPS) return false;
  if (a.maxY <= b.minY + EPS) return true;
  if (b.maxY <= a.minY + EPS) return false;
  if (a.maxZ <= b.minZ + EPS) return true;
  if (b.maxZ <= a.minZ + EPS) return false;
  return null;
}

/**
 * Painter's-order sort for solid nodes using pairwise box relations
 * and a topological sort (falls back to center depth on cycles).
 */
export function depthSort(nodes: DiagramNode[], proj: Projector): DiagramNode[] {
  if (proj.mode === '2d') {
    return nodes
      .map((n, i) => ({ n, i }))
      .sort((a, b) => a.n.z + a.n.h - (b.n.z + b.n.h) || a.i - b.i)
      .map((e) => e.n);
  }
  const boxes = nodes.map((n) => rotatedBox(n, proj.rotation));
  const count = nodes.length;
  const after: number[][] = nodes.map(() => []);
  const indeg = new Array(count).fill(0);
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const r = behind(boxes[i], boxes[j]);
      if (r === null) continue;
      const [from, to] = r ? [i, j] : [j, i];
      after[from].push(to);
      indeg[to]++;
    }
  }
  const key = (i: number) =>
    (boxes[i].minX + boxes[i].maxX + boxes[i].minY + boxes[i].maxY) / 2 + boxes[i].minZ * 0.01;
  const ready = [...Array(count).keys()].filter((i) => indeg[i] === 0);
  const out: number[] = [];
  const done = new Array(count).fill(false);
  while (out.length < count) {
    if (ready.length === 0) {
      // Cycle: break it with the shallowest remaining node.
      let best = -1;
      for (let i = 0; i < count; i++) if (!done[i] && (best < 0 || key(i) < key(best))) best = i;
      ready.push(best);
      indeg[best] = 0;
    }
    ready.sort((a, b) => key(a) - key(b));
    const i = ready.shift()!;
    if (done[i]) continue;
    done[i] = true;
    out.push(i);
    for (const j of after[i]) {
      if (--indeg[j] === 0 && !done[j]) ready.push(j);
    }
  }
  return out.map((i) => nodes[i]);
}

// ---------- misc ----------

export function center(n: DiagramNode): Pt {
  return { x: n.x + n.w / 2, y: n.y + n.d / 2 };
}

/**
 * Point where the segment from `outside` toward the rect's center first
 * touches the rect (expanded by pad). Returns `outside` if it is inside.
 */
export function clipToRect(
  outside: Pt,
  inside: Pt,
  r: { x: number; y: number; w: number; d: number },
  pad = 0.15,
): Pt {
  const x0 = r.x - pad;
  const x1 = r.x + r.w + pad;
  const y0 = r.y - pad;
  const y1 = r.y + r.d + pad;
  const dx = inside.x - outside.x;
  const dy = inside.y - outside.y;
  let tEnter = 0;
  let tExit = 1;
  const clip = (p: number, q: number) => {
    if (Math.abs(p) < EPS) return q >= 0;
    const t = q / p;
    if (p < 0) tEnter = Math.max(tEnter, t);
    else tExit = Math.min(tExit, t);
    return true;
  };
  if (
    clip(-dx, outside.x - x0) &&
    clip(dx, x1 - outside.x) &&
    clip(-dy, outside.y - y0) &&
    clip(dy, y1 - outside.y) &&
    tEnter <= tExit
  ) {
    return { x: outside.x + dx * tEnter, y: outside.y + dy * tEnter };
  }
  return inside;
}

export function snap(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

export function pointsAttr(pts: Pt[]): string {
  return pts.map((p) => `${+p.x.toFixed(2)},${+p.y.toFixed(2)}`).join(' ');
}

let idCounter = 0;
export function uid(prefix = 'n'): string {
  idCounter = (idCounter + 1) % 1e6;
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

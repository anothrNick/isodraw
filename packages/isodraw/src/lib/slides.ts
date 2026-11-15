import { center, footprint, Projector } from './geometry';
import { isContainer } from './containers';
import { readingOrder } from './docs';
import type { LevelPath } from './levels';
import type { Camera, Diagram, DiagramNode, DocTarget, Rotation, ViewMode } from './types';

/**
 * Presentations. A slide is a region drawn on the diagram (a `slide` node):
 * presenting fits the camera to it, keeps what's inside bright and walks
 * through its docs. Slides belong to the editor and the presenter only: every
 * other picture of a diagram (exports, previews, the docs site) leaves them out.
 */

export const isSlide = (n: Pick<DiagramNode, 'kind'>) => n.kind === 'slide';

/** The diagram without its slides, in every detail diagram too. Returns `d` itself when it has none. */
export function withoutSlides(d: Diagram): Diagram {
  let changed = false;
  const nodes: DiagramNode[] = [];
  for (const n of d.nodes) {
    if (isSlide(n)) {
      changed = true;
      continue;
    }
    if (n.detail) {
      const detail = withoutSlides(n.detail);
      if (detail !== n.detail) {
        changed = true;
        nodes.push({ ...n, detail });
        continue;
      }
    }
    nodes.push(n);
  }
  if (!changed) return d;
  const { presentation: _drop, ...rest } = d;
  return { ...rest, nodes };
}

/** True when the diagram, or any detail diagram in it, has a slide. */
export const hasSlides = (d: Diagram): boolean => d.nodes.some((n) => isSlide(n) || (!!n.detail && hasSlides(n.detail)));

export interface SlideRef {
  node: DiagramNode;
  /** The level it's drawn on. */
  level: LevelPath;
}

/** Every slide, level by level: each level's in reading order, then the detail diagrams inside it. */
export function collectSlides(root: Diagram, level: LevelPath = []): SlideRef[] {
  const here = readingOrder(root.nodes.filter(isSlide), root).map((node) => ({ node, level }));
  const deeper = readingOrder(root.nodes.filter((n) => n.detail), root).flatMap((n) => collectSlides(n.detail!, [...level, n.id]));
  return [...here, ...deeper];
}

/**
 * The slides in presenting order: the diagram's saved order, with slides it
 * doesn't list yet added at the end (in the order they're drawn), and ids that
 * no longer exist left out. The saved order can't break a presentation.
 */
export function slideOrder(root: Diagram): SlideRef[] {
  const all = collectSlides(root);
  const byId = new Map(all.map((s) => [s.node.id, s]));
  const out: SlideRef[] = [];
  for (const id of root.presentation?.order ?? []) {
    const s = byId.get(id);
    if (s) {
      out.push(s);
      byId.delete(id);
    }
  }
  for (const s of all) if (byId.has(s.node.id)) out.push(s);
  return out;
}

/** The diagram with the slides in this order. */
export function withSlideOrder(root: Diagram, ids: string[]): Diagram {
  return { ...root, presentation: { ...root.presentation, order: ids } };
}

/** The slide's number when presenting (1-based), or 0 when it isn't found. */
export const slideNumber = (root: Diagram, id: string) => slideOrder(root).findIndex((s) => s.node.id === id) + 1;

const EPS = 1e-6;
const within = (slide: DiagramNode, x: number, y: number) =>
  x >= slide.x - EPS && x <= slide.x + slide.w + EPS && y >= slide.y - EPS && y <= slide.y + slide.d + EPS;

/** Areas count when they fit inside the slide; everything else when its middle is inside. */
const inside = (slide: DiagramNode, n: DiagramNode) => {
  if (isContainer(n)) return within(slide, n.x, n.y) && within(slide, n.x + n.w, n.y + n.d);
  const c = center(n);
  return within(slide, c.x, c.y);
};

/** What the slide shows: the items whose middle is inside it (whole areas only), and the connections between them. */
export function slideContents(slide: DiagramNode, d: Diagram): Diagram {
  const nodes = d.nodes.filter((n) => !isSlide(n) && inside(slide, n));
  const ids = new Set(nodes.map((n) => n.id));
  return {
    version: 1,
    ...(d.view ? { view: d.view } : {}),
    nodes,
    edges: d.edges.filter((e) => ids.has(e.from) && ids.has(e.to)),
  };
}

/** The region for a slide around some items, with a unit of room on each side. */
export function regionAround(items: Pick<DiagramNode, 'x' | 'y' | 'w' | 'd'>[], margin = 1): { x: number; y: number; w: number; d: number } {
  const x = Math.min(...items.map((n) => n.x)) - margin;
  const y = Math.min(...items.map((n) => n.y)) - margin;
  return { x, y, w: Math.max(...items.map((n) => n.x + n.w)) + margin - x, d: Math.max(...items.map((n) => n.y + n.d)) + margin - y };
}

/**
 * After a layout moved things on a level, each slide is drawn again around
 * the items it held before, so it still shows them. Slides that held nothing
 * stay put. Returns `after` itself when no slide changed.
 */
export function refitSlides(before: Diagram, after: Diagram): Diagram {
  let changed = false;
  const nodes = after.nodes.map((n) => {
    if (!isSlide(n)) return n;
    const was = before.nodes.find((x) => x.id === n.id);
    if (!was) return n;
    const ids = new Set(slideContents(was, before).nodes.map((x) => x.id));
    const items = after.nodes.filter((x) => ids.has(x.id));
    if (!items.length) return n;
    const r = regionAround(items);
    if (r.x === n.x && r.y === n.y && r.w === n.w && r.d === n.d) return n;
    changed = true;
    return { ...n, ...r };
  });
  return changed ? { ...after, nodes } : after;
}

/** A page the presenter walks through on a slide: the slide's own notes, or an item's doc. */
export type SlidePage = { kind: 'notes' } | { kind: 'doc'; target: DocTarget };

/**
 * The pages for a slide: its notes first when it has some, then the docs it
 * lists, or (when it lists none) the documented items inside it in reading order.
 * A slide only walks through what's inside it (and the diagram's overview):
 * listed items that are gone, or have moved out of it, are skipped.
 */
export function slidePages(slide: DiagramNode, d: Diagram): SlidePage[] {
  const pages: SlidePage[] = [];
  if (slide.notes?.trim()) pages.push({ kind: 'notes' });
  const has = (md?: string) => !!md && md.trim().length > 0;
  const contents = slideContents(slide, d);
  if (slide.docs) {
    for (const t of slide.docs) {
      if (t.kind === 'diagram') pages.push({ kind: 'doc', target: t });
      else if (t.kind === 'node' ? contents.nodes.some((n) => n.id === t.id) : contents.edges.some((e) => e.id === t.id)) pages.push({ kind: 'doc', target: t });
    }
    return pages;
  }
  for (const n of readingOrder(contents.nodes, d)) if (has(n.doc)) pages.push({ kind: 'doc', target: { kind: 'node', id: n.id } });
  for (const e of contents.edges) if (has(e.doc)) pages.push({ kind: 'doc', target: { kind: 'edge', id: e.id } });
  return pages;
}

/** How the slide is drawn: its own view and rotation, or the diagram's. */
export function slideProjection(slide: DiagramNode, root: Diagram): { view: ViewMode; rotation: Rotation } {
  return { view: slide.slideView ?? root.view ?? '3d', rotation: slide.slideRotation ?? 0 };
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function boundsOf(pts: { x: number; y: number }[]): Rect {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

/**
 * What the camera frames for a slide, in scene pixels: the things inside it,
 * up to their tops. An empty slide frames its own outline. (In 2.5D a slide's
 * outline is a diamond much wider than what's in it, so it isn't framed itself.)
 */
export function slideRect(slide: DiagramNode, d: Diagram, proj: Projector): Rect {
  const contents = slideContents(slide, d).nodes;
  const pts = contents.length ? [] : footprint(slide).map((q) => proj.project(q.x, q.y, slide.z));
  for (const n of contents) {
    const top = n.z + (n.kind === 'sphere' ? Math.min(n.w, n.d) : n.h);
    for (const q of footprint(n)) pts.push(proj.project(q.x, q.y, top));
  }
  return boundsOf(pts);
}

// ---------- the camera ----------

/** The camera that fits `r` (scene pixels) in a viewport, with a margin. */
export function fitCamera(r: Rect, vw: number, vh: number, margin = 48, maxZoom = 2.5): Camera {
  const zoom = Math.max(0.05, Math.min((vw - 2 * margin) / Math.max(r.w, 1), (vh - 2 * margin) / Math.max(r.h, 1), maxZoom));
  return { zoom, x: vw / 2 - (r.x + r.w / 2) * zoom, y: vh / 2 - (r.y + r.h / 2) * zoom };
}

/** The scene rectangle a camera shows. */
export function cameraRect(c: Camera, vw: number, vh: number): Rect {
  return { x: -c.x / c.zoom, y: -c.y / c.zoom, w: vw / c.zoom, h: vh / c.zoom };
}

export interface Flight {
  /** The camera at t (0..1, already eased by the caller or not). */
  at: (t: number) => Camera;
  /** A comfortable duration in ms for the distance travelled. */
  duration: number;
}

const RHO = Math.SQRT2;

/**
 * The smooth zoom-and-pan from one camera to another (van Wijk and Nuij,
 * "Smooth and efficient zooming and panning", as d3's interpolateZoom):
 * nearby targets get a glide, distant ones zoom out on the way so you keep
 * your bearings.
 */
export function flight(from: Camera, to: Camera, vw: number, vh: number, opts: { min?: number; max?: number } = {}): Flight {
  // Work with the point at the middle of the screen and how much scene is visible across it.
  const ux0 = (vw / 2 - from.x) / from.zoom;
  const uy0 = (vh / 2 - from.y) / from.zoom;
  const w0 = vw / from.zoom;
  const ux1 = (vw / 2 - to.x) / to.zoom;
  const uy1 = (vh / 2 - to.y) / to.zoom;
  const w1 = vw / to.zoom;
  const dx = ux1 - ux0;
  const dy = uy1 - uy0;
  const d2 = dx * dx + dy * dy;
  let S: number;
  let view: (t: number) => [number, number, number];
  if (d2 < 1e-9) {
    S = Math.log(w1 / w0) / RHO;
    view = (t) => [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(RHO * t * S)];
  } else {
    const d1 = Math.sqrt(d2);
    const b0 = (w1 * w1 - w0 * w0 + RHO ** 4 * d2) / (2 * w0 * RHO ** 2 * d1);
    const b1 = (w1 * w1 - w0 * w0 - RHO ** 4 * d2) / (2 * w1 * RHO ** 2 * d1);
    const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
    const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
    S = (r1 - r0) / RHO;
    view = (t) => {
      const s = t * S;
      const u = (w0 / (RHO ** 2 * d1)) * (Math.cosh(r0) * Math.tanh(RHO * s + r0) - Math.sinh(r0));
      return [ux0 + u * dx, uy0 + u * dy, (w0 * Math.cosh(r0)) / Math.cosh(RHO * s + r0)];
    };
  }
  const at = (t: number): Camera => {
    if (t <= 0) return from;
    if (t >= 1) return to;
    const [ux, uy, w] = view(t);
    const zoom = vw / w;
    return { zoom, x: vw / 2 - ux * zoom, y: vh / 2 - uy * zoom };
  };
  const duration = Math.min(opts.max ?? 1600, Math.max(opts.min ?? 600, Math.abs(S) * 1000 * 0.55));
  return { at, duration: Number.isFinite(duration) ? duration : opts.min ?? 600 };
}

/** Ease in and out (cubic). */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

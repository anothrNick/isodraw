/**
 * IsoDraw's own isometric icons: laptops, servers, buildings and the like,
 * drawn in code from a few 3D parts (rounded prisms, cylinders, spheres and
 * shapes painted on their faces), so every icon shares one look and takes the
 * component's color.
 *
 * A diagram refers to one as `isodraw:<name>`; the renderer draws it as an
 * object standing on the component's tiles. Nothing is fetched.
 */
import { shade } from './geometry';
import type { IconDef, IconLibrary } from './types';

/** The color new isometric icons get: the app's blue. */
export const ISO_ICON_COLOR = '#3b82f6';
export const ISO_ICON_PREFIX = 'isodraw:';

/**
 * Where the icon's world origin (the middle of its 2×2 footprint) sits in the
 * picture, and the picture's size, in pixels at a 2×2 component. The renderer
 * uses these to put the drawing on the component's tiles.
 */
export const ISO_ICON_BOX = { x: -64, y: -100, w: 128, h: 140 } as const;

type V3 = readonly [number, number, number];
type V2 = readonly [number, number];
/** A flat surface to draw on: a point and two in-plane directions. */
interface Plane {
  o: V3;
  u: V3;
  v: V3;
}

const TILE = 32;
const COS30 = Math.cos(Math.PI / 6);
const HZ = 0.82;
/** Toward the viewer: a face is visible when its normal points this way. */
const VIEW: V3 = [1, 1, (TILE / 2) / (TILE * HZ)];

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const at = (p: Plane, [a, b]: V2): V3 => add(p.o, add(mul(p.u, a), mul(p.v, b)));
const n1 = (n: number) => Math.round(n * 10) / 10;

function project([x, y, z]: V3): V2 {
  return [(x - y) * TILE * COS30, (x + y) * (TILE / 2) - z * TILE * HZ];
}
function pathOf(pts: V3[]): string {
  return 'M' + pts.map((p) => project(p).map(n1).join(' ')).join('L') + 'Z';
}

/** How bright a face is: lit from above and the left, like the library's solids. */
function light([nx, ny, nz]: V3): number {
  const len = Math.hypot(nx, ny, nz) || 1;
  const h = Math.hypot(nx, ny) || 1;
  const side = 0.85 + 0.11 * ((ny - nx) / (Math.SQRT2 * h));
  const up = Math.max(0, nz / len);
  return side * (1 - up) + 1.12 * up;
}

// ----- outlines (in a plane's own coordinates) -----

/** A rounded rectangle centered on (cx, cy). */
function rr(w: number, h: number, r: number, cx = 0, cy = 0): V2[] {
  r = Math.min(r, w / 2, h / 2);
  const out: V2[] = [];
  const corners: [number, number, number][] = [
    [cx + w / 2 - r, cy - h / 2 + r, -90],
    [cx + w / 2 - r, cy + h / 2 - r, 0],
    [cx - w / 2 + r, cy + h / 2 - r, 90],
    [cx - w / 2 + r, cy - h / 2 + r, 180],
  ];
  for (const [x, y, a0] of corners) {
    if (r <= 0) {
      out.push([x, y]);
      continue;
    }
    for (let i = 0; i <= 4; i++) {
      const a = ((a0 + i * 22.5) * Math.PI) / 180;
      out.push([x + r * Math.cos(a), y + r * Math.sin(a)]);
    }
  }
  return out;
}

function circle(r: number, cx = 0, cy = 0, n = 28): V2[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as V2;
  });
}

function polygon(r: number, sides: number, cx = 0, cy = 0, turn = 0): V2[] {
  return Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * Math.PI * 2 + turn;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as V2;
  });
}

const signedArea = (pts: V2[]) => pts.reduce((s, p, i) => s + (p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1]), 0) / 2;

// ----- planes -----

/** The ground (or a box top) at height z: u along x, v along y. */
const top = (z: number): Plane => ({ o: [0, 0, z], u: [1, 0, 0], v: [0, 1, 0] });
/** An upright plane facing +y (the lower-left side on screen): u along x, v up. */
const left = (y: number): Plane => ({ o: [0, y, 0], u: [1, 0, 0], v: [0, 0, 1] });
/** An upright plane facing +x (the lower-right side): u along -y, so text reads left to right. */
const right = (x: number): Plane => ({ o: [x, 0, 0], u: [0, -1, 0], v: [0, 0, 1] });

interface Palette {
  /** The component's color. */
  c: string;
  lite: string;
  pale: string;
  deep: string;
  /** Screens and server fronts: a dark navy from the color. */
  navy: string;
  body: string;
  metal: string;
  white: string;
  ink: string;
  green: string;
  amber: string;
}

function palette(c: string): Palette {
  return {
    c,
    lite: shade(c, 1.45),
    pale: shade(c, 1.82),
    deep: shade(c, 0.62),
    navy: shade(c, 0.26),
    body: '#eef2f8',
    metal: '#c9d3e1',
    white: '#ffffff',
    ink: shade(c, 0.22),
    green: '#34d399',
    amber: '#fbbf24',
  };
}

/** Builds one icon's SVG from parts, drawn in the order they're added (back first). */
class Draw {
  private out: string[] = [];
  private defs: string[] = [];
  constructor(readonly p: Palette) {}

  /** A soft shadow on the ground under the object. */
  shadow(w: number, d: number, cx = 0, cy = 0) {
    this.out.push(`<path d="${pathOf(rr(w, d, Math.min(w, d) * 0.4, cx, cy).map((q) => at(top(0), q)))}" fill="#0f172a" opacity=".10"/>`);
  }

  /** Draw faces: an outline pass first (its outer half shows as the silhouette), then the shaded fills. */
  private faces(list: { pts: V3[]; n: V3 }[], color: string) {
    const visible = list.filter((f) => dot(f.n, VIEW) > 1e-6);
    if (!visible.length) return;
    this.out.push(
      `<path d="${visible.map((f) => pathOf(f.pts)).join('')}" fill="${this.p.ink}" stroke="${this.p.ink}" stroke-width="2.4" stroke-linejoin="round"/>`,
    );
    for (const f of visible) {
      const fill = shade(color, light(f.n));
      this.out.push(`<path d="${pathOf(f.pts)}" fill="${fill}" stroke="${fill}" stroke-width=".6" stroke-linejoin="round"/>`);
    }
  }

  /** An outline in a plane, pushed out along `w` by `depth`. The outline may be concave. */
  prism(plane: Plane, outline: V2[], w: V3, depth: number, color: string) {
    const ccw = signedArea(outline) > 0 ? 1 : -1;
    const bottom = outline.map((q) => at(plane, q));
    const lid = bottom.map((q) => add(q, mul(w, depth)));
    // The cap's normal: the side `w` points to, and its opposite.
    const capN = w;
    const sides = outline.map((q, i) => {
      const r = outline[(i + 1) % outline.length];
      // Outward in the plane, from the outline's winding.
      const du = r[0] - q[0];
      const dv = r[1] - q[1];
      const nu = dv * ccw;
      const nv = -du * ccw;
      const j = (i + 1) % outline.length;
      return { pts: [bottom[i], bottom[j], lid[j], lid[i]], n: add(mul(plane.u, nu), mul(plane.v, nv)) };
    });
    // Back walls first, so a concave outline's walls overlap correctly.
    sides.sort((a, b) => depthOf(a.pts) - depthOf(b.pts));
    // The plane's u×v may point either way relative to w; caps are the ±w faces.
    this.faces([{ pts: [...bottom].reverse(), n: mul(capN, -1) }, ...sides, { pts: lid, n: capN }], color);
  }

  /** A box with rounded upright edges; (x, y, z) is its lowest corner. */
  box(x: number, y: number, z: number, w: number, d: number, h: number, color: string, r = 0.08) {
    this.prism(top(z), rr(w, d, r, x + w / 2, y + d / 2), [0, 0, 1], h, color);
  }

  /** An upright cylinder, or a cone section when the top radius differs. */
  cyl(cx: number, cy: number, z: number, r: number, h: number, color: string, rTop = r) {
    if (rTop === r) return this.prism(top(z), circle(r, cx, cy), [0, 0, 1], h, color);
    const n = 28;
    const ring = (rad: number, zz: number) => circle(rad, cx, cy, n).map(([a, b]) => [a, b, zz] as V3);
    const lo = ring(r, z);
    const hi = ring(rTop, z + h);
    const c: V3 = [cx, cy, z + h / 2];
    const faces = lo.map((q, i) => {
      const j = (i + 1) % n;
      const pts = [q, lo[j], hi[j], hi[i]];
      const m = mul(add(add(q, lo[j]), add(hi[j], hi[i])), 0.25);
      // Outward: away from the axis, tipped by the slope.
      const out: V3 = [m[0] - c[0], m[1] - c[1], (r - rTop) / h * Math.hypot(m[0] - c[0], m[1] - c[1])];
      return { pts, n: out };
    });
    this.faces([{ pts: [...lo].reverse(), n: [0, 0, -1] }, ...faces, { pts: hi, n: [0, 0, 1] }], color);
  }

  /** A shaded ball. */
  sphere(c: V3, r: number, color: string) {
    const [x, y] = project(c);
    const id = `s${this.defs.length}`;
    this.defs.push(
      `<radialGradient id="${id}" cx="36%" cy="30%" r="72%"><stop offset="0" stop-color="${shade(color, 1.5)}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, 0.7)}"/></radialGradient>`,
    );
    this.out.push(
      `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * TILE + 1.2)}" fill="${this.p.ink}"/>`,
      `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * TILE)}" fill="url(#${id})"/>`,
    );
  }

  /** A flat shape painted on a surface. */
  decal(plane: Plane, outline: V2[], fill: string, opacity = 1) {
    this.out.push(`<path d="${pathOf(outline.map((q) => at(plane, q)))}" fill="${fill}"${opacity < 1 ? ` opacity="${opacity}"` : ''}/>`);
  }

  /** A stroke painted on a surface. */
  line(plane: Plane, pts: V2[], stroke: string, width = 2, opacity = 1) {
    const d = 'M' + pts.map((q) => project(at(plane, q)).map(n1).join(' ')).join('L');
    this.out.push(
      `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${opacity < 1 ? ` opacity="${opacity}"` : ''}/>`,
    );
  }

  /** Raw SVG in picture coordinates, for things that face the viewer (waves, sparkles). */
  raw(svg: string) {
    this.out.push(svg);
  }

  /** Where a 3D point lands in the picture. */
  at(p: V3): V2 {
    return project(p);
  }

  svg(): string {
    const b = ISO_ICON_BOX;
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.x} ${b.y} ${b.w} ${b.h}" width="${b.w * 2}" height="${b.h * 2}">` +
      (this.defs.length ? `<defs>${this.defs.join('')}</defs>` : '') +
      this.out.join('') +
      '</svg>'
    );
  }
}

const depthOf = (pts: V3[]) => dot(mul(pts.reduce((s, q) => add(s, q), [0, 0, 0] as V3), 1 / pts.length), VIEW);

/** Arcs facing the viewer around a point, like radio waves. */
function waves(g: Draw, center: V3, color: string, radii = [10, 17, 24], from = -135, to = -45) {
  const [cx, cy] = g.at(center);
  for (const r of radii) {
    const a = (from * Math.PI) / 180;
    const b = (to * Math.PI) / 180;
    const p = (t: number) => `${n1(cx + r * Math.cos(t))} ${n1(cy + r * Math.sin(t))}`;
    g.raw(`<path d="M${p(a)}A${r} ${r} 0 0 1 ${p(b)}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round"/>`);
  }
}

// ---------------------------------------------------------------------------
// The icons. Each draws inside a 2×2 footprint centered on the origin.
// ---------------------------------------------------------------------------

type Maker = (g: Draw, p: Palette) => void;

/** A window or screen standing upright, facing +y, with its front plane returned. */
function panel(g: Draw, w: number, h: number, z: number, color: string, y = -0.05, depth = 0.1, r = 0.08): Plane {
  g.prism(left(y), rr(w, h, r, 0, z + h / 2), [0, 1, 0], depth, color);
  return left(y + depth + 0.002);
}

/** A tilted plane through a hinge line along x, leaning back by `deg` from upright. */
function leaning(o: V3, deg: number): { plane: Plane; normal: V3 } {
  const a = (deg * Math.PI) / 180;
  return { plane: { o, u: [1, 0, 0], v: [0, -Math.sin(a), Math.cos(a)] }, normal: [0, Math.cos(a), Math.sin(a)] };
}

function person(g: Draw, x: number, y: number, s: number, color: string) {
  g.cyl(x, y, 0, 0.42 * s, 0.5 * s, color, 0.34 * s);
  g.sphere([x, y, 0.5 * s], 0.36 * s, color);
  g.sphere([x, y, 1.12 * s], 0.3 * s, color);
}

const ICONS: Record<string, { name: string; category: string; draw: Maker }> = {
  // ----- Devices -----
  laptop: {
    name: 'Laptop',
    category: 'Devices',
    draw(g, p) {
      g.shadow(1.9, 1.5, 0, 0.05);
      const { plane, normal } = leaning([0, -0.62, 0.1], 14);
      g.prism(plane, rr(1.6, 1.05, 0.08, 0, 0.53), normal, 0.06, p.body);
      const screen: Plane = { ...plane, o: add(plane.o, mul(normal, 0.062)) };
      g.decal(screen, rr(1.42, 0.86, 0.05, 0, 0.55), p.navy);
      g.decal(screen, rr(1.42, 0.14, 0.04, 0, 0.91), p.c);
      g.decal(screen, rr(0.55, 0.42, 0.05, -0.38, 0.5), p.lite);
      g.decal(screen, rr(0.6, 0.08, 0.04, 0.3, 0.66), p.lite, 0.8);
      g.decal(screen, rr(0.45, 0.08, 0.04, 0.23, 0.5), p.lite, 0.55);
      g.decal(screen, rr(0.55, 0.08, 0.04, 0.28, 0.34), p.lite, 0.55);
      g.box(-0.8, -0.62, 0, 1.6, 1.3, 0.1, p.body);
      g.decal(top(0.101), rr(1.34, 0.56, 0.05, 0, -0.22), p.metal);
      g.decal(top(0.101), rr(0.46, 0.28, 0.05, 0, 0.36), p.metal);
    },
  },
  desktop: {
    name: 'Desktop',
    category: 'Devices',
    draw(g, p) {
      g.shadow(1.6, 1.0, 0, 0.0);
      g.box(-0.38, -0.4, 0, 0.76, 0.6, 0.06, p.metal, 0.12);
      g.box(-0.08, -0.22, 0.06, 0.16, 0.12, 0.6, p.metal, 0.03);
      const f = panel(g, 1.8, 1.08, 0.3, p.navy, -0.1, 0.08);
      g.decal(f, rr(1.64, 0.92, 0.04, 0, 0.84), p.pale);
      g.decal(f, rr(1.64, 0.14, 0.04, 0, 1.23), p.c);
      g.decal(f, rr(0.42, 0.62, 0.05, -0.55, 0.75), p.lite);
      g.decal(f, rr(0.95, 0.28, 0.05, 0.22, 0.93), p.c, 0.85);
      g.decal(f, rr(0.44, 0.26, 0.05, -0.02, 0.58), p.lite);
      g.decal(f, rr(0.44, 0.26, 0.05, 0.47, 0.58), p.lite);
    },
  },
  phone: {
    name: 'Phone',
    category: 'Devices',
    draw(g, p) {
      g.shadow(1.0, 0.5, 0, 0.05);
      const f = panel(g, 0.84, 1.6, 0, p.navy, -0.06, 0.1, 0.14);
      g.decal(f, rr(0.72, 1.46, 0.09, 0, 0.8), p.c);
      g.decal(f, rr(0.22, 0.06, 0.03, 0, 1.45), p.navy);
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 3; c++) g.decal(f, rr(0.15, 0.15, 0.04, -0.22 + c * 0.22, 1.22 - r * 0.24), p.white, 0.85);
      g.decal(f, rr(0.56, 0.16, 0.05, 0, 0.2), p.lite, 0.9);
    },
  },
  tablet: {
    name: 'Tablet',
    category: 'Devices',
    draw(g, p) {
      g.shadow(1.8, 1.2, 0, -0.1);
      const { plane, normal } = leaning([0, 0.35, 0], 24);
      g.prism(plane, rr(1.7, 1.2, 0.12, 0, 0.62), normal, 0.07, p.navy);
      const s: Plane = { ...plane, o: add(plane.o, mul(normal, 0.072)) };
      g.decal(s, rr(1.56, 1.06, 0.07, 0, 0.62), p.c);
      g.decal(s, rr(0.62, 0.86, 0.06, -0.4, 0.62), p.lite, 0.9);
      g.decal(s, rr(0.72, 0.4, 0.06, 0.32, 0.85), p.pale, 0.9);
      g.decal(s, rr(0.72, 0.36, 0.06, 0.32, 0.38), p.pale, 0.6);
    },
  },
  printer: {
    name: 'Printer',
    category: 'Devices',
    draw(g, p) {
      g.shadow(1.8, 1.6, 0, 0.1);
      const { plane, normal } = leaning([0, -0.3, 0.5], 18);
      g.prism(plane, rr(1.0, 0.6, 0.02, 0, 0.3), normal, 0.03, p.white);
      g.box(-0.8, -0.6, 0, 1.6, 1.2, 0.55, p.body, 0.14);
      g.decal(top(0.551), rr(1.2, 0.12, 0.05, 0, -0.35), p.navy);
      g.decal(top(0.551), rr(0.36, 0.3, 0.06, 0.48, 0.25), p.navy);
      g.decal(top(0.551), circle(0.05, 0.48, 0.25), p.green);
      g.decal(left(0.601), rr(1.2, 0.08, 0.04, 0, 0.28), p.deep);
      g.box(-0.55, 0.6, 0.12, 1.1, 0.32, 0.05, p.metal, 0.04);
      g.box(-0.42, 0.55, 0.17, 0.84, 0.32, 0.02, p.white, 0.02);
      g.decal(top(0.191), rr(0.5, 0.05, 0.02, -0.08, 0.72), p.c, 0.8);
    },
  },
  camera: {
    name: 'Camera',
    category: 'Devices',
    draw(g, p) {
      g.shadow(1.8, 1.0, 0, 0.05);
      g.box(-0.4, -0.25, 0.8, 0.4, 0.4, 0.16, p.navy, 0.06);
      g.box(-0.8, -0.4, 0, 1.6, 0.8, 0.85, p.c, 0.16);
      g.decal(left(0.401), rr(1.6, 0.14, 0.03, 0, 0.66), p.navy, 0.85);
      g.prism(left(0.4), circle(0.36, 0.08, 0.4), [0, 1, 0], 0.3, p.navy);
      const lens = left(0.702);
      g.decal(lens, circle(0.27, 0.08, 0.4), p.deep);
      g.decal(lens, circle(0.18, 0.08, 0.4), p.navy);
      g.decal(lens, circle(0.07, 0.14, 0.47), p.lite, 0.8);
      g.decal(top(0.851), rr(0.22, 0.14, 0.04, 0.5, -0.1), p.lite);
    },
  },

  // ----- Servers & storage -----
  server: {
    name: 'Server',
    category: 'Servers & storage',
    draw(g, p) {
      g.shadow(1.9, 1.7);
      for (let i = 0; i < 3; i++) {
        const z = i * 0.38;
        g.box(-0.8, -0.7, z, 1.6, 1.4, 0.32, p.navy, 0.06);
        const f = left(0.701);
        for (let k = 0; k < 4; k++) g.decal(f, rr(0.22, 0.07, 0.03, -0.55 + k * 0.27, z + 0.16), shade(p.navy, 1.9));
        g.decal(f, circle(0.045, 0.5, z + 0.16), i === 1 ? p.amber : p.green);
        g.decal(f, circle(0.045, 0.64, z + 0.16), p.lite);
        const r = right(0.801);
        for (let k = 0; k < 5; k++) g.line(r, [[-0.5 + k * 0.22, z + 0.1], [-0.5 + k * 0.22, z + 0.22]], shade(p.navy, 1.8), 1.4);
      }
    },
  },
  'server-rack': {
    name: 'Server rack',
    category: 'Servers & storage',
    draw(g, p) {
      g.shadow(1.5, 1.5);
      g.box(-0.62, -0.62, 0, 1.24, 1.24, 2.05, p.navy, 0.08);
      const f = left(0.621);
      g.decal(f, rr(1.04, 1.85, 0.05, 0, 1.03), shade(p.navy, 0.75));
      for (let i = 0; i < 7; i++) {
        const z = 0.24 + i * 0.25;
        g.decal(f, rr(0.94, 0.18, 0.03, 0, z), shade(p.navy, 1.6));
        g.decal(f, rr(0.4, 0.05, 0.02, -0.18, z), shade(p.navy, 2.4));
        g.decal(f, circle(0.035, 0.3, z), i % 3 === 2 ? p.amber : p.green);
        g.decal(f, circle(0.035, 0.4, z), p.lite);
      }
      const r = right(0.621);
      for (let k = 0; k < 4; k++) g.line(r, [[-0.36 + k * 0.24, 0.3], [-0.36 + k * 0.24, 1.75]], shade(p.navy, 1.7), 1.4);
    },
  },
  database: {
    name: 'Database',
    category: 'Servers & storage',
    draw(g, p) {
      g.shadow(1.7, 1.7);
      for (let i = 0; i < 3; i++) g.cyl(0, 0, i * 0.42, 0.78, 0.36, p.c);
      g.decal(top(1.201), circle(0.52), p.lite, 0.7);
    },
  },
  storage: {
    name: 'Storage drive',
    category: 'Servers & storage',
    draw(g, p) {
      g.shadow(1.6, 1.9);
      g.box(-0.7, -0.9, 0, 1.4, 1.8, 0.2, p.metal, 0.1);
      const t = top(0.201);
      g.decal(t, rr(1.24, 1.64, 0.08), p.body);
      g.decal(t, circle(0.55, 0, -0.18), p.lite);
      g.decal(t, circle(0.42, 0, -0.18), p.c, 0.35);
      g.decal(t, circle(0.09, 0, -0.18), p.navy);
      g.line(t, [[0.42, 0.62], [0.42, 0.15], [0.1, -0.05]], p.navy, 3.2);
      g.decal(t, circle(0.07, 0.42, 0.62), p.c);
    },
  },
  bucket: {
    name: 'Bucket',
    category: 'Servers & storage',
    draw(g, p) {
      g.shadow(1.4, 1.4);
      g.cyl(0, 0, 0, 0.52, 0.5, p.c, 0.6);
      g.cyl(0, 0, 0.5, 0.6, 0.2, p.lite, 0.64);
      g.cyl(0, 0, 0.7, 0.64, 0.5, p.c, 0.74);
      g.decal(top(1.201), circle(0.64), p.deep);
      g.decal(top(1.201), circle(0.5, 0.06, 0.06), p.navy, 0.5);
    },
  },
  memory: {
    name: 'Memory',
    category: 'Servers & storage',
    draw(g, p) {
      g.shadow(2.0, 0.5);
      g.prism(left(-0.04), rr(1.9, 0.62, 0.04, 0, 0.39), [0, 1, 0], 0.05, p.deep);
      const f = left(0.012);
      for (let k = 0; k < 18; k++) g.decal(f, rr(0.05, 0.1, 0.01, -0.85 + k * 0.1, 0.15), p.amber);
      for (let k = 0; k < 4; k++) g.box(-0.82 + k * 0.42, 0.01, 0.3, 0.32, 0.06, 0.32, p.navy, 0.02);
    },
  },
  chip: {
    name: 'Chip',
    category: 'Servers & storage',
    draw(g, p) {
      g.shadow(1.8, 1.8);
      for (let k = 0; k < 5; k++) {
        const o = -0.44 + k * 0.22;
        g.box(o - 0.04, -0.82, 0, 0.08, 0.3, 0.06, p.metal, 0.01);
        g.box(-0.82, o - 0.04, 0, 0.3, 0.08, 0.06, p.metal, 0.01);
        g.box(o - 0.04, 0.52, 0, 0.08, 0.3, 0.06, p.metal, 0.01);
        g.box(0.52, o - 0.04, 0, 0.3, 0.08, 0.06, p.metal, 0.01);
      }
      g.box(-0.62, -0.62, 0.04, 1.24, 1.24, 0.22, p.navy, 0.1);
      g.box(-0.34, -0.34, 0.26, 0.68, 0.68, 0.09, p.c, 0.06);
      g.decal(top(0.351), rr(0.36, 0.36, 0.05), p.lite);
    },
  },
  gpu: {
    name: 'GPU',
    category: 'Servers & storage',
    draw(g, p) {
      g.shadow(2.0, 1.2);
      g.box(-0.95, -0.55, 0, 1.9, 1.1, 0.08, p.deep, 0.04);
      g.box(-0.9, -0.5, 0.08, 1.8, 1.0, 0.24, p.navy, 0.1);
      const t = top(0.321);
      for (const x of [-0.42, 0.42]) {
        g.decal(t, circle(0.36, x, 0), shade(p.navy, 0.7));
        g.decal(t, circle(0.3, x, 0), shade(p.navy, 1.5));
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          g.line(t, [[x + 0.08 * Math.cos(a), 0.08 * Math.sin(a)], [x + 0.28 * Math.cos(a + 0.6), 0.28 * Math.sin(a + 0.6)]], p.lite, 1.6, 0.8);
        }
        g.decal(t, circle(0.08, x, 0), p.c);
      }
      g.decal(left(0.501), rr(1.6, 0.05, 0.02, 0, 0.2), p.c);
    },
  },

  // ----- Network -----
  cloud: {
    name: 'Cloud',
    category: 'Network',
    draw(g, p) {
      g.shadow(1.9, 1.2);
      g.box(-0.85, -0.45, 0, 1.7, 0.9, 0.36, p.c, 0.44);
      g.sphere([-0.35, -0.15, 0.55], 0.4, p.c);
      g.sphere([0.12, -0.3, 0.75], 0.52, p.c);
      g.sphere([0.55, 0.1, 0.45], 0.36, p.c);
      g.sphere([-0.05, 0.25, 0.42], 0.34, p.c);
    },
  },
  globe: {
    name: 'Globe',
    category: 'Network',
    draw(g, p) {
      g.shadow(1.3, 1.3);
      g.cyl(0, 0, 0, 0.36, 0.08, p.metal);
      g.cyl(0, 0, 0.08, 0.07, 0.3, p.metal);
      const c: V3 = [0, 0, 1.1];
      g.sphere(c, 0.78, p.c);
      const [x, y] = g.at(c);
      const R = 0.78 * TILE;
      const ell = (rx: number, ry: number, cy = 0) =>
        `<ellipse cx="${n1(x)}" cy="${n1(y + cy)}" rx="${n1(rx)}" ry="${n1(ry)}" fill="none" stroke="${p.pale}" stroke-width="1.4" opacity=".75"/>`;
      g.raw(ell(R, R * 0.3) + ell(R * 0.82, R * 0.22, -R * 0.52) + ell(R * 0.82, R * 0.22, R * 0.52) + ell(R * 0.42, R) + `<line x1="${n1(x)}" y1="${n1(y - R)}" x2="${n1(x)}" y2="${n1(y + R)}" stroke="${p.pale}" stroke-width="1.4" opacity=".75"/>`);
    },
  },
  'load-balancer': {
    name: 'Load balancer',
    category: 'Network',
    draw(g, p) {
      g.shadow(1.9, 1.9);
      g.box(-0.82, -0.82, 0, 1.64, 1.64, 0.42, p.c, 0.24);
      const t = top(0.421);
      g.line(t, [[-0.6, 0], [-0.15, 0]], p.white, 3.4);
      for (const y of [-0.45, 0, 0.45]) {
        g.line(t, [[-0.15, 0], [0.12, y], [0.42, y]], p.white, 3.4);
        g.decal(t, [[0.4, y - 0.13], [0.62, y], [0.4, y + 0.13]], p.white);
      }
      g.decal(t, circle(0.1, -0.6, 0), p.white);
    },
  },
  router: {
    name: 'Router',
    category: 'Network',
    draw(g, p) {
      g.shadow(1.8, 1.4);
      g.box(-0.78, -0.55, 0, 1.56, 1.1, 0.34, p.body, 0.14);
      const f = left(0.551);
      for (let k = 0; k < 5; k++) g.decal(f, circle(0.045, -0.5 + k * 0.18, 0.18), k < 3 ? p.green : p.c);
      g.decal(top(0.341), rr(1.2, 0.1, 0.05, 0, 0.25), p.lite);
      for (const x of [-0.55, 0.55]) {
        g.cyl(x, -0.38, 0.34, 0.05, 0.85, p.navy);
        g.sphere([x, -0.38, 1.2], 0.07, p.navy);
      }
      waves(g, [0, -0.38, 1.25], p.c, [9, 16]);
    },
  },
  switch: {
    name: 'Switch',
    category: 'Network',
    draw(g, p) {
      g.shadow(2.0, 1.3);
      g.box(-0.92, -0.6, 0, 1.84, 1.2, 0.3, p.navy, 0.06);
      const f = left(0.601);
      for (let k = 0; k < 8; k++) {
        const x = -0.72 + k * 0.2;
        g.decal(f, rr(0.13, 0.11, 0.02, x, 0.12), shade(p.navy, 0.55));
        g.decal(f, circle(0.025, x, 0.24), k % 4 === 3 ? p.amber : p.green);
      }
      g.decal(top(0.301), rr(1.6, 0.08, 0.04, 0, 0.42), p.c);
    },
  },
  firewall: {
    name: 'Firewall',
    category: 'Network',
    draw(g, p) {
      g.shadow(2.0, 0.8);
      const rows = 4;
      for (let r = 0; r < rows; r++) {
        const z = r * 0.3;
        const off = r % 2 ? -0.3 : 0;
        for (let x = -0.9 + off; x < 0.9; x += 0.6) {
          const x0 = Math.max(-0.9, x);
          const x1 = Math.min(0.9, x + 0.56);
          if (x1 - x0 < 0.1) continue;
          g.box(x0, -0.22, z, x1 - x0, 0.44, 0.26, r % 2 ? shade(p.c, 0.9) : p.c, 0.04);
        }
      }
    },
  },
  wifi: {
    name: 'Wi-Fi',
    category: 'Network',
    draw(g, p) {
      g.shadow(1.5, 1.5);
      g.cyl(0, 0, 0, 0.66, 0.24, p.body);
      g.decal(top(0.241), circle(0.46), p.pale);
      g.decal(top(0.241), circle(0.12), p.c);
      waves(g, [0, 0, 0.55], p.c, [10, 19, 28]);
    },
  },
  antenna: {
    name: 'Cell tower',
    category: 'Network',
    draw(g, p) {
      g.shadow(1.4, 1.4);
      const legs: V2[] = [[-0.45, -0.45], [0.45, -0.45], [0.45, 0.45], [-0.45, 0.45]];
      const topR = 0.1;
      const h = 2.1;
      const pt = ([x, y]: V2, t: number): V3 => [x * (1 - t) + Math.sign(x) * topR * t, y * (1 - t) + Math.sign(y) * topR * t, h * t];
      const ln = (a: V3, b: V3, w: number) =>
        g.raw(`<path d="M${project(a).map(n1).join(' ')}L${project(b).map(n1).join(' ')}" stroke="${p.navy}" stroke-width="${w}" stroke-linecap="round"/>`);
      for (let i = 0; i < 4; i++) {
        const a = legs[i];
        const b = legs[(i + 1) % 4];
        ln(pt(a, 0), pt(a, 1), 2.6);
        for (const [t0, t1] of [[0, 0.33], [0.33, 0.66], [0.66, 0.9]]) {
          ln(pt(a, t0), pt(b, t1), 1.2);
          ln(pt(b, t0), pt(a, t1), 1.2);
        }
      }
      g.box(-0.16, -0.16, h, 0.32, 0.32, 0.12, p.navy, 0.04);
      for (const [x, y] of [[0.12, -0.05], [-0.05, 0.12]]) g.box(x, y, h - 0.45, 0.1, 0.1, 0.4, p.white, 0.03);
      waves(g, [0, 0, h + 0.2], p.c, [9, 16, 23], -160, -20);
    },
  },
  sensor: {
    name: 'Sensor',
    category: 'Network',
    draw(g, p) {
      g.shadow(1.1, 1.1);
      g.box(-0.42, -0.42, 0, 0.84, 0.84, 0.36, p.body, 0.26);
      g.decal(top(0.361), circle(0.22), p.c);
      g.decal(top(0.361), circle(0.08), p.white);
      g.decal(left(0.421), circle(0.04, 0.2, 0.18), p.green);
      waves(g, [0, 0, 0.6], p.c, [9, 16]);
    },
  },

  // ----- Places -----
  'data-center': {
    name: 'Data center',
    category: 'Places',
    draw(g, p) {
      g.shadow(2.0, 1.8);
      g.box(-0.88, -0.78, 0, 1.76, 1.56, 0.95, p.body, 0.05);
      const f = left(0.781);
      for (let k = 0; k < 3; k++) g.decal(f, rr(1.4, 0.08, 0.02, 0, 0.35 + k * 0.18), p.navy, 0.8);
      g.decal(f, rr(0.3, 0.42, 0.03, -0.5, 0.21), p.c);
      const r = right(0.881);
      for (let k = 0; k < 3; k++) g.decal(r, rr(1.2, 0.08, 0.02, 0, 0.35 + k * 0.18), p.navy, 0.8);
      for (const [x, y] of [[-0.6, -0.55], [-0.05, -0.55], [-0.6, 0.0]]) {
        g.box(x, y, 0.95, 0.42, 0.42, 0.18, p.metal, 0.05);
        g.decal(top(1.131), circle(0.14, x + 0.21, y + 0.21), p.navy);
        g.decal(top(1.131), circle(0.05, x + 0.21, y + 0.21), p.c);
      }
      g.decal(top(0.951), rr(0.5, 0.5, 0.05, 0.5, 0.4), p.c, 0.9);
    },
  },
  office: {
    name: 'Office building',
    category: 'Places',
    draw(g, p) {
      g.shadow(1.5, 1.5);
      g.box(-0.56, -0.56, 0, 1.12, 1.12, 2.1, p.body, 0.04);
      const f = left(0.561);
      const r = right(0.561);
      for (let row = 0; row < 7; row++)
        for (let col = 0; col < 3; col++) {
          const z = 0.3 + row * 0.26;
          g.decal(f, rr(0.24, 0.17, 0.03, -0.32 + col * 0.32, z), row === 0 && col === 1 ? p.deep : p.lite);
          g.decal(r, rr(0.24, 0.17, 0.03, -0.32 + col * 0.32, z), p.c, 0.85);
        }
      g.box(-0.3, -0.3, 2.1, 0.6, 0.6, 0.12, p.metal, 0.04);
    },
  },
  house: {
    name: 'House',
    category: 'Places',
    draw(g, p) {
      g.shadow(1.8, 1.6);
      g.box(-0.68, -0.58, 0, 1.36, 1.16, 0.72, p.body, 0.03);
      const f = left(0.581);
      g.decal(f, rr(0.3, 0.5, 0.05, -0.25, 0.25), p.c);
      g.decal(f, rr(0.3, 0.24, 0.03, 0.3, 0.42), p.lite);
      g.decal(right(0.681), rr(0.28, 0.24, 0.03, 0, 0.42), p.lite);
      g.prism({ o: [-0.78, 0, 0], u: [0, 1, 0], v: [0, 0, 1] }, [[-0.72, 0.7], [0.72, 0.7], [0, 1.32]], [1, 0, 0], 1.56, p.c);
      g.decal({ o: [0.781, 0, 0], u: [0, -1, 0], v: [0, 0, 1] }, [[-0.6, 0.74], [0.6, 0.74], [0, 1.24]], p.body);
      g.decal({ o: [0.782, 0, 0], u: [0, -1, 0], v: [0, 0, 1] }, circle(0.1, 0, 0.94), p.lite);
    },
  },
  factory: {
    name: 'Factory',
    category: 'Places',
    draw(g, p) {
      g.shadow(2.0, 1.4);
      g.box(-0.88, -0.55, 0, 1.76, 1.1, 0.6, p.body, 0.03);
      g.cyl(0.62, -0.3, 0.6, 0.12, 0.85, p.metal);
      for (let k = 0; k < 3; k++) {
        const x0 = -0.88 + k * 0.586;
        g.prism({ o: [0, -0.55, 0], u: [1, 0, 0], v: [0, 0, 1] }, [[x0, 0.6], [x0 + 0.586, 0.6], [x0, 0.98]], [0, 1, 0], 1.1, p.c);
      }
      const f = left(0.551);
      for (let k = 0; k < 4; k++) g.decal(f, rr(0.26, 0.2, 0.03, -0.6 + k * 0.4, 0.35), p.lite);
    },
  },

  // ----- Software -----
  browser: {
    name: 'Browser',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.9, 0.6);
      const f = panel(g, 1.8, 1.3, 0, p.white, -0.05, 0.1, 0.1);
      g.decal(f, rr(1.8, 0.22, 0.1, 0, 1.19), p.c);
      g.decal(f, rr(1.8, 0.1, 0, 0, 1.13), p.c);
      for (let k = 0; k < 3; k++) g.decal(f, circle(0.035, -0.78 + k * 0.1, 1.2), p.white);
      g.decal(f, rr(1.0, 0.09, 0.045, 0.2, 1.2), p.lite);
      g.decal(f, rr(1.56, 0.32, 0.05, 0, 0.82), p.pale);
      g.decal(f, rr(0.5, 0.44, 0.05, -0.53, 0.33), p.lite);
      g.decal(f, rr(0.5, 0.44, 0.05, 0, 0.33), p.lite);
      g.decal(f, rr(0.5, 0.44, 0.05, 0.53, 0.33), p.lite);
    },
  },
  code: {
    name: 'Code',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.9, 0.6);
      const f = panel(g, 1.7, 1.25, 0, p.navy, -0.05, 0.1, 0.1);
      g.decal(f, rr(1.7, 0.2, 0.1, 0, 1.15), shade(p.navy, 1.5));
      for (let k = 0; k < 3; k++) g.decal(f, circle(0.035, -0.72 + k * 0.1, 1.15), k === 0 ? p.amber : p.lite);
      g.line(f, [[-0.4, 0.78], [-0.62, 0.55], [-0.4, 0.32]], p.lite, 4);
      g.line(f, [[0.4, 0.78], [0.62, 0.55], [0.4, 0.32]], p.lite, 4);
      g.line(f, [[-0.1, 0.28], [0.1, 0.82]], p.c, 4);
    },
  },
  terminal: {
    name: 'Terminal',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.9, 0.6);
      const f = panel(g, 1.7, 1.25, 0, p.navy, -0.05, 0.1, 0.1);
      g.decal(f, rr(1.7, 0.2, 0.1, 0, 1.15), shade(p.navy, 1.5));
      for (let k = 0; k < 3; k++) g.decal(f, circle(0.035, -0.72 + k * 0.1, 1.15), p.lite);
      g.line(f, [[-0.62, 0.8], [-0.42, 0.65], [-0.62, 0.5]], p.green, 4);
      g.line(f, [[-0.28, 0.48], [0.05, 0.48]], p.lite, 4);
      g.line(f, [[-0.62, 0.25], [0.3, 0.25]], p.lite, 2, 0.45);
    },
  },
  dashboard: {
    name: 'Dashboard',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.6, 1.0);
      g.box(-0.38, -0.4, 0, 0.76, 0.6, 0.06, p.metal, 0.12);
      g.box(-0.08, -0.22, 0.06, 0.16, 0.12, 0.6, p.metal, 0.03);
      const f = panel(g, 1.8, 1.08, 0.3, p.navy, -0.1, 0.08);
      g.decal(f, rr(1.64, 0.92, 0.04, 0, 0.84), shade(p.navy, 1.35));
      g.line(f, [[-0.7, 0.6], [-0.4, 0.82], [-0.15, 0.7], [0.15, 1.05], [0.4, 0.9], [0.7, 1.15]], p.lite, 3);
      for (let k = 0; k < 5; k++) g.decal(f, rr(0.16, 0.12 + (k % 3) * 0.06, 0.02, -0.6 + k * 0.3, 0.5 + (0.12 + (k % 3) * 0.06) / 2 - 0.08), p.c);
    },
  },
  function: {
    name: 'Function',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.5, 1.5);
      g.box(-0.62, -0.62, 0, 1.24, 1.24, 1.0, p.c, 0.16);
      const f = left(0.621);
      g.line(f, [[-0.22, 0.85], [-0.08, 0.85], [0.28, 0.16]], p.white, 5);
      g.line(f, [[0.06, 0.55], [-0.26, 0.16]], p.white, 5);
      g.decal(top(1.001), rr(0.7, 0.7, 0.12), p.lite, 0.6);
    },
  },
  service: {
    name: 'Service',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.7, 1.7);
      g.prism(top(0), polygon(0.82, 6), [0, 0, 1], 0.5, p.c);
      g.decal(top(0.501), polygon(0.56, 6), p.lite);
      g.decal(top(0.501), polygon(0.3, 6), p.c);
    },
  },
  container: {
    name: 'Container',
    category: 'Software',
    draw(g, p) {
      g.shadow(2.0, 1.1);
      g.box(-0.95, -0.46, 0, 1.9, 0.92, 0.9, p.c, 0.03);
      const f = left(0.461);
      for (let k = 1; k < 12; k++) g.line(f, [[-0.95 + k * 0.158, 0.08], [-0.95 + k * 0.158, 0.82]], shade(p.c, 0.78), 1.6);
      const r = right(0.951);
      g.decal(r, rr(0.4, 0.76, 0.03, -0.21, 0.45), shade(p.c, 0.92));
      g.decal(r, rr(0.4, 0.76, 0.03, 0.21, 0.45), shade(p.c, 0.92));
      for (const u of [-0.06, 0.06]) g.line(r, [[u, 0.2], [u, 0.7]], p.navy, 1.6);
    },
  },
  cluster: {
    name: 'Cluster',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.9, 1.9);
      g.box(-0.9, -0.9, 0, 1.8, 1.8, 0.12, p.pale, 0.2);
      for (const [x, y] of [[-0.7, -0.7], [0.08, -0.7], [-0.7, 0.08], [0.08, 0.08]]) {
        g.box(x, y, 0.12, 0.62, 0.62, 0.55, p.c, 0.1);
        g.decal(top(0.671), rr(0.3, 0.3, 0.06, x + 0.31, y + 0.31), p.lite);
      }
    },
  },
  queue: {
    name: 'Queue',
    category: 'Software',
    draw(g, p) {
      g.shadow(2.0, 1.2, 0, 0.15);
      for (let k = 0; k < 4; k++) g.box(-0.95 + k * 0.48, -0.3, 0, 0.4, 0.6, 0.5, k === 3 ? p.c : p.lite, 0.08);
      const t = top(0.001);
      g.line(t, [[-0.8, 0.6], [0.55, 0.6]], p.c, 3.4);
      g.decal(t, [[0.5, 0.48], [0.75, 0.6], [0.5, 0.72]], p.c);
    },
  },
  event: {
    name: 'Event',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.3, 0.6);
      const bolt: V2[] = [[0.2, 1.75], [-0.42, 0.8], [0.0, 0.8], [-0.24, 0.0], [0.5, 1.02], [0.08, 1.02], [0.38, 1.75]];
      g.prism(left(-0.1), bolt, [0, 1, 0], 0.2, p.c);
    },
  },
  settings: {
    name: 'Settings',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.8, 1.8);
      const teeth = 10;
      const pts: V2[] = [];
      for (let i = 0; i < teeth; i++) {
        const a0 = (i / teeth) * Math.PI * 2;
        const s = (Math.PI * 2) / teeth;
        for (const [t, r] of [[0.02, 0.66], [0.16, 0.86], [0.42, 0.86], [0.56, 0.66]] as [number, number][]) {
          pts.push([r * Math.cos(a0 + t * s), r * Math.sin(a0 + t * s)]);
        }
      }
      g.prism(top(0), pts, [0, 0, 1], 0.32, p.c);
      g.decal(top(0.321), circle(0.3), p.deep);
      g.decal(top(0.321), circle(0.3), p.navy, 0.35);
    },
  },
  ai: {
    name: 'AI',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.7, 1.4);
      g.box(-0.78, -0.2, 0.3, 0.1, 0.4, 0.36, p.c, 0.04);
      g.cyl(0, 0, 0.95, 0.04, 0.3, p.metal);
      g.box(-0.66, -0.55, 0, 1.32, 1.1, 0.96, p.body, 0.3);
      g.cyl(0, 0, 0.96, 0.04, 0.28, p.metal);
      g.sphere([0, 0, 1.32], 0.1, p.c);
      const f = left(0.551);
      g.decal(f, rr(1.0, 0.56, 0.2, 0, 0.5), p.navy);
      g.decal(f, circle(0.1, -0.24, 0.53), p.lite);
      g.decal(f, circle(0.1, 0.24, 0.53), p.lite);
      g.line(f, [[-0.12, 0.33], [0.12, 0.33]], p.lite, 2.2);
      g.box(0.66, -0.2, 0.3, 0.1, 0.4, 0.36, p.c, 0.04);
    },
  },
  rocket: {
    name: 'Rocket',
    category: 'Software',
    draw(g, p) {
      g.shadow(1.3, 1.3);
      // A fin sticking out along u, 0.06 thick.
      const fin = (u: V3) => {
        const w: V3 = [u[1], -u[0], 0];
        g.prism({ o: mul(w, -0.03), u, v: [0, 0, 1] }, [[0.2, 0.08], [0.58, 0.0], [0.58, 0.2], [0.2, 0.5]], w, 0.06, p.c);
      };
      fin([-1, 0, 0]);
      fin([0, -1, 0]);
      g.cyl(0, 0, 0.05, 0.32, 1.35, p.body);
      g.cyl(0, 0, 1.4, 0.32, 0.55, p.c, 0.02);
      fin([1, 0, 0]);
      fin([0, 1, 0]);
      const k = 0.32 / Math.SQRT2 + 0.005;
      const face: Plane = { o: [k, k, 0], u: [Math.SQRT1_2, -Math.SQRT1_2, 0], v: [0, 0, 1] };
      g.decal(face, circle(0.14, 0, 1.0), p.navy);
      g.decal(face, circle(0.09, 0.02, 1.02), p.lite);
    },
  },
  chart: {
    name: 'Analytics',
    category: 'Software',
    draw(g, p) {
      g.shadow(2.0, 2.0);
      g.box(-0.9, -0.9, 0, 1.8, 1.8, 0.1, p.body, 0.16);
      const heights = [0.5, 0.95, 0.7, 1.4];
      heights.forEach((h, k) => g.box(-0.8 + k * 0.44, -0.2, 0.1, 0.26, 0.36, h, k % 2 ? p.c : p.lite, 0.05));
    },
  },

  // ----- Security -----
  lock: {
    name: 'Lock',
    category: 'Security',
    draw(g, p) {
      g.shadow(1.5, 1.0);
      g.box(-0.58, -0.3, 0, 1.16, 0.6, 0.86, p.c, 0.14);
      const f = left(0.301);
      g.decal(f, circle(0.12, 0, 0.5), p.navy);
      g.decal(f, [[-0.07, 0.48], [0.07, 0.48], [0.1, 0.22], [-0.1, 0.22]], p.navy);
      const arc: V2[] = [[-0.36, 0.86], [-0.36, 1.12]];
      for (let i = 0; i <= 16; i++) {
        const a = Math.PI - (i / 16) * Math.PI;
        arc.push([0.36 * Math.cos(a), 1.12 + 0.36 * Math.sin(a)]);
      }
      arc.push([0.36, 0.86]);
      g.line(left(0), arc, p.ink, 11);
      g.line(left(0), arc, p.metal, 7.5);
    },
  },
  key: {
    name: 'Key',
    category: 'Security',
    draw(g, p) {
      g.shadow(2.0, 1.0);
      g.cyl(-0.5, 0, 0, 0.42, 0.14, p.c);
      g.decal(top(0.141), circle(0.16, -0.58, -0.08), p.navy);
      g.box(-0.1, -0.09, 0, 1.0, 0.18, 0.14, p.c, 0.04);
      g.box(0.5, 0.09, 0, 0.12, 0.2, 0.14, p.c, 0.02);
      g.box(0.72, 0.09, 0, 0.12, 0.28, 0.14, p.c, 0.02);
    },
  },
  shield: {
    name: 'Shield',
    category: 'Security',
    draw(g, p) {
      g.shadow(1.6, 0.6);
      const side: V2[] = [[0.72, 1.62], [0.72, 1.05], [0.62, 0.68], [0.42, 0.36], [0.2, 0.14], [0, 0.04]];
      const outline = [...side, ...side.slice(0, -1).reverse().map(([u, v]) => [-u, v] as V2)];
      g.prism(left(-0.1), outline, [0, 1, 0], 0.18, p.c);
      const f = left(0.082);
      g.decal(f, outline.map(([u, v]) => [u * 0.78, 0.2 + v * 0.8] as V2), p.lite, 0.55);
      g.line(f, [[-0.28, 0.9], [-0.06, 0.66], [0.32, 1.12]], p.white, 5);
    },
  },

  // ----- People & things -----
  user: {
    name: 'User',
    category: 'People & things',
    draw(g, p) {
      g.shadow(1.2, 1.2);
      person(g, 0, 0, 1.2, p.c);
    },
  },
  users: {
    name: 'Team',
    category: 'People & things',
    draw(g, p) {
      g.shadow(1.9, 1.9);
      person(g, -0.45, -0.45, 0.9, p.lite);
      person(g, 0.5, -0.3, 0.9, p.lite);
      person(g, 0.05, 0.35, 1.0, p.c);
    },
  },
  mail: {
    name: 'Mail',
    category: 'People & things',
    draw(g, p) {
      g.shadow(1.8, 0.6);
      const f = panel(g, 1.64, 1.08, 0, p.body, -0.06, 0.12, 0.08);
      g.decal(f, [[-0.74, 1.0], [0, 0.48], [0.74, 1.0]], p.lite);
      g.line(f, [[-0.76, 1.02], [0, 0.48], [0.76, 1.02]], p.c, 2.6);
      g.line(f, [[-0.76, 0.08], [-0.22, 0.52]], p.metal, 1.6);
      g.line(f, [[0.76, 0.08], [0.22, 0.52]], p.metal, 1.6);
    },
  },
  chat: {
    name: 'Chat',
    category: 'People & things',
    draw(g, p) {
      g.shadow(1.7, 0.6);
      g.prism(left(-0.08), [[-0.5, 0.3], [-0.12, 0.3], [-0.6, 0.0]], [0, 1, 0], 0.16, p.c);
      const f = panel(g, 1.56, 1.05, 0.25, p.c, -0.08, 0.16, 0.28);
      for (let k = 0; k < 3; k++) g.decal(f, circle(0.09, -0.36 + k * 0.36, 0.78), p.white);
    },
  },
  document: {
    name: 'Document',
    category: 'People & things',
    draw(g, p) {
      g.shadow(1.6, 0.8);
      const page: V2[] = [[-0.55, 0], [0.55, 0], [0.55, 1.15], [0.25, 1.48], [-0.55, 1.48]];
      g.prism(left(-0.3), page.map(([u, v]) => [u - 0.18, v] as V2), [0, 1, 0], 0.05, p.pale);
      g.prism(left(-0.02), page, [0, 1, 0], 0.06, p.white);
      const f = left(0.041);
      g.decal(f, [[0.25, 1.48], [0.25, 1.15], [0.55, 1.15]], p.lite);
      g.decal(f, rr(0.5, 0.09, 0.045, -0.15, 1.2), p.c);
      for (let k = 0; k < 5; k++) g.decal(f, rr(k === 4 ? 0.5 : 0.82, 0.07, 0.035, k === 4 ? -0.16 : 0, 0.95 - k * 0.17), p.lite);
    },
  },
  folder: {
    name: 'Folder',
    category: 'People & things',
    draw(g, p) {
      g.shadow(1.9, 0.8);
      g.prism(left(-0.15), [[-0.8, 0], [0.8, 0], [0.8, 1.05], [-0.12, 1.05], [-0.28, 1.22], [-0.8, 1.22]], [0, 1, 0], 0.06, shade(p.c, 0.85));
      g.prism(left(-0.06), rr(1.4, 0.95, 0.03, 0, 0.62), [0, 1, 0], 0.03, p.white);
      const { plane, normal } = leaning([0, 0.12, 0], -12);
      g.prism(plane, rr(1.62, 0.95, 0.06, 0, 0.49), normal, 0.05, p.c);
    },
  },
  card: {
    name: 'Payment card',
    category: 'People & things',
    draw(g, p) {
      g.shadow(2.0, 1.5);
      g.box(-0.9, -0.75, 0, 1.6, 1.0, 0.06, p.navy, 0.12);
      g.box(-0.7, -0.35, 0.1, 1.6, 1.0, 0.06, p.c, 0.12);
      const t = top(0.161);
      g.decal(t, rr(1.6, 0.18, 0, 0.1, -0.12), p.navy, 0.85);
      g.decal(t, rr(0.28, 0.22, 0.04, -0.38, 0.22), p.amber);
      g.decal(t, rr(0.6, 0.07, 0.035, 0.34, 0.45), p.lite);
    },
  },
  clock: {
    name: 'Clock',
    category: 'People & things',
    draw(g, p) {
      g.shadow(1.4, 0.6);
      g.box(-0.35, -0.12, 0, 0.7, 0.3, 0.1, p.metal, 0.08);
      g.prism(left(-0.08), circle(0.76, 0, 0.86), [0, 1, 0], 0.16, p.c);
      const f = left(0.082);
      g.decal(f, circle(0.62, 0, 0.86), p.white);
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        const r0 = k % 3 ? 0.52 : 0.46;
        g.line(f, [[r0 * Math.cos(a), 0.86 + r0 * Math.sin(a)], [0.56 * Math.cos(a), 0.86 + 0.56 * Math.sin(a)]], p.metal, 1.6);
      }
      g.line(f, [[0, 0.86], [0, 1.26]], p.navy, 3.2);
      g.line(f, [[0, 0.86], [0.28, 0.72]], p.navy, 3.2);
      g.decal(f, circle(0.05, 0, 0.86), p.c);
    },
  },
};

/** Names of every built-in isometric icon, in palette order. */
export const ISO_ICON_NAMES = Object.keys(ICONS);

const cache = new Map<string, string>();

/** The icon as an SVG document, in `color` (the component's color). */
export function isoIconSvg(name: string, color = ISO_ICON_COLOR): string | null {
  const icon = ICONS[name];
  if (!icon) return null;
  const g = new Draw(palette(/^#[0-9a-f]{6}$/i.test(color) ? color : ISO_ICON_COLOR));
  icon.draw(g, g.p);
  return g.svg();
}

/** Is this image source one of our isometric icons (`isodraw:<name>`)? */
export function isIsoIcon(src: string | undefined): src is string {
  return !!src && src.startsWith(ISO_ICON_PREFIX) && src.slice(ISO_ICON_PREFIX.length) in ICONS;
}

/** A data URL for an `isodraw:<name>` icon in a color; other sources come back unchanged. */
export function imageHref(src: string | undefined, color?: string): string {
  if (!src || !isIsoIcon(src)) return src ?? '';
  const key = `${src}|${color ?? ''}`;
  let url = cache.get(key);
  if (!url) {
    url = `data:image/svg+xml,${encodeURIComponent(isoIconSvg(src.slice(ISO_ICON_PREFIX.length), color)!)}`;
    cache.set(key, url);
  }
  return url;
}

/** The isometric icons as a palette library. */
export function isoIconLibrary(): IconLibrary {
  const icons: IconDef[] = ISO_ICON_NAMES.map((id) => ({
    id: `${ISO_ICON_PREFIX}${id}`,
    name: ICONS[id].name,
    src: `${ISO_ICON_PREFIX}${id}`,
    category: ICONS[id].category,
  }));
  return { id: 'isodraw', name: 'Isometric', icons };
}

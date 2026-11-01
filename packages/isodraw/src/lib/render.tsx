import { Fragment, useId, useMemo, type CSSProperties, type MouseEvent as RMouseEvent, type ReactNode } from 'react';
import {
  TILE,
  Projector,
  type Pt,
  center,
  contrastText,
  depthSort,
  footprint,
  isFlat,
  matrixAttr,
  pointsAttr,
  flipTurns,
  readableTurns,
  shade,
  solidFaces,
} from './geometry';
import { depthMap, isContainer } from './containers';
import { ISO_ICON_BOX, imageHref, isIsoIcon, isoIconPlacement, isoIconScale } from './isoIcons';
import { CANVAS_BG, INK, themedDiagram, useTheme } from './theme';
import { edgePathD, endMarkerOf, lineStyleOf, polylineLength, resolveEdge, startMarkerOf } from './routing';
import type { Diagram, DiagramEdge, DiagramNode, DocTarget, LineStyle, MarkerKind } from './types';

const CURVED = new Set(['cylinder', 'cone']);
const INSIDE_LABEL_2D = new Set(['block', 'cylinder', 'hexagon']);
const INV_TILE = 1 / TILE;

/**
 * A node's footprint as seen in its upright reading frame: content is rotated
 * about the center and laid out in a `w` × `d` box (swapped for odd turns).
 * `flip` only ever turns 180° (for text, so it keeps its direction); `turn`
 * may also turn 90° (for square logos, so they always face up).
 */
function uprightFrame(node: DiagramNode, proj: Projector, mode: 'flip' | 'turn') {
  const k = mode === 'flip' ? flipTurns(proj) : readableTurns(proj);
  const c = center(node);
  const odd = k % 2 === 1;
  return {
    transform: `rotate(${k * 90} ${c.x * TILE} ${c.y * TILE})`,
    cx: c.x,
    cy: c.y,
    w: odd ? node.d : node.w,
    d: odd ? node.w : node.d,
  };
}

/** Group that maps TILE-scaled ground coordinates onto the ground plane at z. */
function Ground({ proj, z, children }: { proj: Projector; z: number; children: ReactNode }) {
  return (
    <g transform={matrixAttr(proj.groundMatrix(z))}>
      <g transform={`scale(${INV_TILE})`}>{children}</g>
    </g>
  );
}

function SolidFaces({ node, proj }: { node: DiagramNode; proj: Projector }) {
  const curved = CURVED.has(node.kind);
  return (
    <>
      {solidFaces(node, proj).map((f, i) => {
        const fill = shade(node.color, f.light);
        return (
          <polygon
            key={i}
            points={pointsAttr(f.points)}
            fill={fill}
            stroke={curved ? fill : shade(node.color, f.light * 0.72)}
            strokeWidth={curved ? 0.6 : 1}
            strokeLinejoin="round"
          />
        );
      })}
    </>
  );
}

function ImageNode({ node, proj }: { node: DiagramNode; proj: Projector }) {
  if (isIsoIcon(node.src)) return <IsoIconNode node={node} proj={proj} />;
  const style = node.imageStyle ?? 'tile';
  const pad = style === 'tile' ? Math.min(node.w, node.d) * 0.12 : 0;
  if (style === 'standing' && proj.mode === '3d') {
    const c = center(node);
    const base = proj.project(c.x, c.y, node.z);
    const s = Math.min(node.w, node.d) * TILE;
    return (
      <>
        <ellipse cx={base.x} cy={base.y} rx={s * 0.42} ry={s * 0.2} fill="#000" opacity={0.12} />
        <image href={node.src} x={base.x - s / 2} y={base.y - s * 1.02} width={s} height={s} preserveAspectRatio="xMidYMid meet" />
      </>
    );
  }
  const top = style === 'tile' ? node.z + node.h : node.z;
  const f = uprightFrame(node, proj, 'turn');
  return (
    <>
      {style === 'tile' && <SolidFaces node={{ ...node, kind: 'block' }} proj={proj} />}
      <Ground proj={proj} z={top}>
        <image
          href={node.src}
          transform={f.transform}
          x={(f.cx - f.w / 2 + pad) * TILE}
          y={(f.cy - f.d / 2 + pad) * TILE}
          width={(f.w - 2 * pad) * TILE}
          height={(f.d - 2 * pad) * TILE}
          preserveAspectRatio="xMidYMid meet"
        />
      </Ground>
    </>
  );
}

/** One of IsoDraw's isometric icons, drawn standing on the component's tiles. */
function IsoIconNode({ node, proj }: { node: DiagramNode; proj: Projector }) {
  const href = imageHref(node.src, node.color);
  const r = isoIconRect(node, proj);
  if (!r) return null;
  const b = ISO_ICON_BOX;
  // 2D shows the part of the picture with the drawing in it.
  return r.viewBox ? (
    <svg x={r.x} y={r.y} width={r.w} height={r.h} viewBox={r.viewBox} overflow="visible">
      <image href={href} x={b.x} y={b.y} width={b.w} height={b.h} />
    </svg>
  ) : (
    <image href={href} x={r.x} y={r.y} width={r.w} height={r.h} preserveAspectRatio="xMidYMid meet" />
  );
}

/** Where an isometric icon component's picture is drawn, in scene pixels. */
export function isoIconRect(node: DiagramNode, proj: Projector) {
  const c = center(node);
  const base = proj.project(c.x, c.y, node.z);
  const r = node.src ? isoIconPlacement(node.src, isoIconScale(node), proj.mode) : null;
  return r && { ...r, x: base.x + r.x, y: base.y + r.y };
}

function Sphere({ node, proj, gradId }: { node: DiagramNode; proj: Projector; gradId: string }) {
  const c = center(node);
  const r = Math.min(node.w, node.d) / 2;
  const p = proj.project(c.x, c.y, node.z + r);
  return (
    <>
      <defs>
        <radialGradient id={gradId} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor={shade(node.color, 1.45)} />
          <stop offset="55%" stopColor={node.color} />
          <stop offset="100%" stopColor={shade(node.color, 0.6)} />
        </radialGradient>
      </defs>
      <polygon points={pointsAttr(footprint(node).map((q) => proj.project(q.x, q.y, node.z)))} fill="#000" opacity={0.1} />
      <circle cx={p.x} cy={p.y} r={r * TILE} fill={`url(#${gradId})`} />
    </>
  );
}

function TextNode({ node, proj }: { node: DiagramNode; proj: Projector }) {
  const c = center(node);
  const fs = (node.fontSize ?? 0.7) * TILE;
  const lines = (node.text ?? '').split('\n');
  return (
    <Ground proj={proj} z={node.z}>
      <text
        transform={uprightFrame(node, proj, 'flip').transform}
        x={c.x * TILE}
        y={c.y * TILE - ((lines.length - 1) * fs * 1.2) / 2}
        fontSize={fs}
        fill={node.color}
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight={600}
        style={{ userSelect: 'none' }}
      >
        {lines.map((l, i) => (
          <tspan key={i} x={c.x * TILE} dy={i === 0 ? 0 : fs * 1.2}>
            {l || ' '}
          </tspan>
        ))}
      </text>
    </Ground>
  );
}

/** Scene-space anchor below a node for its label. */
export function labelAnchor(node: DiagramNode, proj: Projector): Pt {
  const c = center(node);
  // In 2D an isometric icon's picture can reach past its footprint: go under the picture.
  const iso = node.kind === 'image' && isIsoIcon(node.src) && proj.mode === '2d' ? isoIconRect(node, proj) : null;
  if (iso) return { x: iso.x + iso.w / 2, y: iso.y + iso.h + 14 };
  if (node.kind === 'image' && node.imageStyle === 'standing' && !isIsoIcon(node.src) && proj.mode === '3d') {
    const p = proj.project(c.x, c.y, node.z);
    return { x: p.x, y: p.y + 16 };
  }
  const pts = footprint(node).map((q) => proj.project(q.x, q.y, node.z));
  const maxY = Math.max(...pts.map((p) => p.y));
  return { x: proj.project(c.x, c.y, node.z).x, y: maxY + 15 };
}

function Label({ node, proj }: { node: DiagramNode; proj: Projector }) {
  const theme = useTheme();
  if (!node.label || node.kind === 'text') return null;
  if (node.kind === 'area') {
    // Area labels sit inside the (upright) top-left corner, painted on the ground.
    const f = uprightFrame(node, proj, 'flip');
    return (
      <Ground proj={proj} z={node.z}>
        <text
          transform={f.transform}
          x={(f.cx - f.w / 2 + 0.3) * TILE}
          y={(f.cy - f.d / 2 + 0.3) * TILE}
          fontSize={13}
          fontWeight={700}
          dominantBaseline="hanging"
          fill={node.labelColor ?? shade(node.color, theme === 'dark' ? 1.5 : 0.6)}
          style={{ userSelect: 'none' }} pointerEvents="none"
        >
          {node.label}
        </text>
      </Ground>
    );
  }
  const a = labelAnchor(node, proj);
  if (proj.mode === '2d' && INSIDE_LABEL_2D.has(node.kind)) {
    // In the flat view, solids carry their label on their face.
    const c = proj.project(center(node).x, center(node).y);
    return (
      <text x={c.x} y={c.y} fontSize={12} fontWeight={600} textAnchor="middle" dominantBaseline="central" fill={node.labelColor ?? contrastText(node.color)} style={{ userSelect: 'none' }} pointerEvents="none">
        {node.label}
      </text>
    );
  }
  return (
    <text
      x={a.x}
      y={a.y}
      fontSize={12}
      fontWeight={600}
      textAnchor="middle"
      fill={node.labelColor ?? INK[theme].text}
      stroke={INK[theme].halo}
      strokeWidth={3}
      strokeLinejoin="round"
      paintOrder="stroke"
      style={{ userSelect: 'none' }} pointerEvents="none"
    >
      {node.label}
    </text>
  );
}

export function NodeShape({ node, proj, idPrefix }: { node: DiagramNode; proj: Projector; idPrefix: string }) {
  let body: ReactNode;
  switch (node.kind) {
    case 'area':
    case 'circleArea': {
      const pts = footprint(node).map((q) => proj.project(q.x, q.y, node.z));
      body = (
        <polygon
          points={pointsAttr(pts)}
          fill={node.color}
          fillOpacity={node.opacity ?? 0.18}
          stroke={node.color}
          strokeWidth={1.5}
          strokeDasharray={node.dashed ? '6 4' : undefined}
          strokeLinejoin="round"
        />
      );
      break;
    }
    case 'text':
      body = <TextNode node={node} proj={proj} />;
      break;
    case 'sphere':
      body = <Sphere node={node} proj={proj} gradId={`${idPrefix}-sph-${node.id}`} />;
      break;
    case 'image':
      body = <ImageNode node={node} proj={proj} />;
      break;
    default:
      body = <SolidFaces node={node} proj={proj} />;
  }
  const isArea = node.kind === 'area' || node.kind === 'circleArea';
  return (
    <g data-node-id={node.id} opacity={isArea ? undefined : node.opacity ?? 1}>
      {body}
    </g>
  );
}

// ---------- edges ----------

export function midpoint(pts: Pt[]): Pt {
  let half = polylineLength(pts) / 2;
  for (let i = 1; i < pts.length; i++) {
    const len = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (half <= len && len > 0) {
      const t = half / len;
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t };
    }
    half -= len;
  }
  return pts[0];
}

/** Scene-space geometry of an edge: path data, projected points and length. */
/** Convex hull of screen points (monotone chain), for outlining a solid. */
function hull(pts: Pt[]): Pt[] {
  const p = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  if (p.length < 3) return p;
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const half = (list: Pt[]) => {
    const out: Pt[] = [];
    for (const q of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop();
      out.push(q);
    }
    out.pop();
    return out;
  };
  return [...half(p), ...half([...p].reverse())];
}

/** An outline drawn over a node or connection, e.g. while a doc mention of it is hovered. */
export function TargetHighlight({ target, diagram, proj }: { target: DocTarget; diagram: Diagram; proj: Projector }) {
  const stroke = { stroke: '#2563eb', strokeLinejoin: 'round' as const, pointerEvents: 'none' as const, vectorEffect: 'non-scaling-stroke' as const };
  if (target.kind === 'node') {
    const n = diagram.nodes.find((x) => x.id === target.id);
    if (!n) return null;
    const flat = isFlat(n);
    const base = footprint(n).map((q) => proj.project(q.x, q.y, n.z));
    const pts = flat ? base : hull([...base, ...footprint(n).map((q) => proj.project(q.x, q.y, n.z + n.h))]);
    return (
      <polygon
        className="isd-target-highlight"
        points={pointsAttr(pts)}
        fill="rgba(37,99,235,0.14)"
        strokeWidth={2.5}
        {...stroke}
      />
    );
  }
  if (target.kind === 'edge') {
    const e = diagram.edges.find((x) => x.id === target.id);
    const a = e && diagram.nodes.find((n) => n.id === e.from);
    const b = e && diagram.nodes.find((n) => n.id === e.to);
    if (!e || !a || !b) return null;
    const { d } = edgeGeometry(e, a, b, proj);
    return (
      <g className="isd-target-highlight">
        <path d={d} fill="none" strokeOpacity={0.3} strokeWidth={10} strokeLinecap="round" {...stroke} />
        <path d={d} fill="none" strokeWidth={2.5} strokeLinecap="round" {...stroke} />
      </g>
    );
  }
  return null;
}

export function edgeGeometry(edge: DiagramEdge, a: DiagramNode, b: DiagramNode, proj: Projector) {
  const r = resolveEdge(edge, a, b);
  const screen = r.pts.map((p, i) => proj.project(p.x, p.y, r.zs[i]));
  const d = edgePathD(r, edge.routing, edge.rounded ?? false, proj);
  return { r, screen, d, length: polylineLength(screen) };
}

function Marker({ id, kind, color }: { id: string; kind: MarkerKind; color: string }) {
  if (kind === 'none') return null;
  const common = { id, viewBox: '0 0 10 10', markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse' };
  switch (kind) {
    case 'open':
      return (
        <marker {...common} refX="8.5" refY="5">
          <path d="M1.5,1.5 L8.5,5 L1.5,8.5" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      );
    case 'circle':
      return (
        <marker {...common} refX="5" refY="5">
          <circle cx="5" cy="5" r="3.6" fill={color} />
        </marker>
      );
    case 'diamond':
      return (
        <marker {...common} refX="9" refY="5">
          <path d="M1,5 L5,1.5 L9,5 L5,8.5 z" fill={color} />
        </marker>
      );
    default:
      return (
        <marker {...common} refX="8" refY="5">
          <path d="M0,0 L10,5 L0,10 z" fill={color} />
        </marker>
      );
  }
}

function dashFor(style: LineStyle, w: number): string | undefined {
  if (style === 'dashed') return `${w * 3} ${w * 2.5}`;
  if (style === 'dotted') return `0.01 ${w * 2.2}`;
  return undefined;
}

/**
 * Edge animations are CSS keyframes on paint-only properties (dash offset and
 * opacity). SMIL moved elements every frame, which made Chrome re-run hover
 * detection and flicker the cursor. The keyframes live in a <style> inside
 * the scene, so exported SVGs still animate.
 */
export const EDGE_KEYFRAMES = `
@keyframes isd-dash { from { stroke-dashoffset: var(--isd-from); } to { stroke-dashoffset: var(--isd-to); } }
@keyframes isd-glow { 0%, 100% { stroke-opacity: 0.04; } 50% { stroke-opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) { .isd-anim { animation: none !important; } }
`;

/** Slide a dash pattern along its path from one offset to another, forever. */
function dashMotion(from: number, to: number, seconds: number): CSSProperties {
  return {
    animation: `isd-dash ${seconds.toFixed(2)}s linear infinite`,
    ['--isd-from' as string]: `${from.toFixed(2)}px`,
    ['--isd-to' as string]: `${to.toFixed(2)}px`,
  };
}

/** Animated overlays for an edge. */
function EdgeAnimationLayer({ edge, d, length }: { edge: DiagramEdge; d: string; length: number }) {
  const theme = useTheme();
  const anim = edge.animation ?? 'none';
  const w = edge.width;
  const speed = Math.max(0.1, edge.animationSpeed ?? 1);
  const pxPerSec = 80 * speed;
  const dir = edge.animationDirection ?? 'forward';
  const color = edge.animationColor ?? shade(edge.color, 1.55);
  const len = Math.max(1, length);

  if (anim === 'packets') {
    // Each packet is a zero-length dash with a round cap; the gap spaces them evenly.
    const n = Math.max(1, Math.min(6, Math.round(len / 130)));
    const gap = len / n;
    const dur = Math.max(0.6 / n, gap / pxPerSec);
    const r = w + 1.6;
    const lanes: ('forward' | 'reverse')[] = dir === 'both' ? ['forward', 'reverse'] : [dir === 'reverse' ? 'reverse' : 'forward'];
    return (
      <g pointerEvents="none">
        {lanes.map((lane) => {
          const phase = lane === 'reverse' && dir === 'both' ? gap / 2 : 0;
          const motion = lane === 'reverse' ? dashMotion(phase - gap, phase, dur) : dashMotion(phase, phase - gap, dur);
          const fill = lane === 'reverse' && dir === 'both' ? shade(edge.color, 0.7) : color;
          const dash = `0.01 ${(gap - 0.01).toFixed(2)}`;
          return (
            <g key={lane}>
              <path className="isd-anim" d={d} fill="none" stroke={INK[theme].halo} strokeWidth={2 * r + 2.4} strokeLinecap="round" strokeDasharray={dash} style={motion} />
              <path className="isd-anim" d={d} fill="none" stroke={fill} strokeWidth={2 * r} strokeLinecap="round" strokeDasharray={dash} style={motion} />
            </g>
          );
        })}
      </g>
    );
  }
  if (anim === 'pulse') {
    const seg = Math.min(70, Math.max(16, len * 0.25));
    const dur = Math.max(0.6, (len + seg) / pxPerSec);
    const sweeps: ('forward' | 'reverse')[] = dir === 'both' ? ['forward', 'reverse'] : [dir === 'reverse' ? 'reverse' : 'forward'];
    return (
      <g pointerEvents="none">
        {sweeps.map((sw) => (
          <path
            key={sw}
            className="isd-anim"
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={w + 2.5}
            strokeLinecap="round"
            strokeDasharray={`${seg} ${len + seg}`}
            style={sw === 'forward' ? dashMotion(seg, -len, dur) : dashMotion(-len, seg, dur)}
          />
        ))}
      </g>
    );
  }
  if (anim === 'glow') {
    return (
      <path
        className="isd-anim"
        d={d}
        fill="none"
        stroke={edge.color}
        strokeOpacity={0.04}
        strokeWidth={w + 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pointerEvents="none"
        style={{ animation: `isd-glow ${(2 / speed).toFixed(2)}s ease-in-out infinite` }}
      />
    );
  }
  return null;
}

export function EdgeShape({
  edge,
  a,
  b,
  proj,
  idPrefix,
  selected,
  animate = true,
}: {
  edge: DiagramEdge;
  a: DiagramNode;
  b: DiagramNode;
  proj: Projector;
  idPrefix: string;
  selected?: boolean;
  animate?: boolean;
}) {
  const { d, length } = edgeGeometry(edge, a, b, proj);
  const startId = `${idPrefix}-ms-${edge.id}`;
  const endId = `${idPrefix}-me-${edge.id}`;
  const start = startMarkerOf(edge);
  const end = endMarkerOf(edge);
  const style = lineStyleOf(edge);
  const w = edge.width;
  const flowing = animate && edge.animation === 'flow';
  let dash = dashFor(style, w);
  if (edge.animation === 'flow' && !dash) dash = `${w * 3} ${w * 2.5}`;
  const period = dash ? dash.split(' ').reduce((acc, v) => acc + parseFloat(v), 0) : 0;
  const speed = Math.max(0.1, edge.animationSpeed ?? 1);
  const reverse = edge.animationDirection === 'reverse';
  return (
    <g data-edge-id={edge.id}>
      <defs>
        <Marker id={startId} kind={start} color={edge.color} />
        <Marker id={endId} kind={end} color={edge.color} />
      </defs>
      <path d={d} stroke="transparent" strokeWidth={14} fill="none" />
      {selected && (
        <path d={d} stroke="#2563eb" strokeOpacity={0.3} strokeWidth={w + 6} fill="none" strokeLinejoin="round" strokeLinecap="round" data-noexport="" />
      )}
      {edge.animation === 'flow' && style === 'solid' && (
        <path d={d} stroke={edge.color} strokeOpacity={0.25} strokeWidth={w} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      )}
      <path
        d={d}
        stroke={edge.color}
        strokeWidth={w}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={dash}
        markerEnd={end !== 'none' ? `url(#${endId})` : undefined}
        markerStart={start !== 'none' ? `url(#${startId})` : undefined}
        className={flowing ? 'isd-anim' : undefined}
        style={flowing ? (reverse ? dashMotion(0, period, Math.max(0.15, period / (40 * speed))) : dashMotion(period, 0, Math.max(0.15, period / (40 * speed)))) : undefined}
      />
      {animate && <EdgeAnimationLayer edge={edge} d={d} length={length} />}
    </g>
  );
}

export function EdgeLabel({ edge, a, b, proj }: { edge: DiagramEdge; a: DiagramNode; b: DiagramNode; proj: Projector }) {
  const theme = useTheme();
  if (!edge.label) return null;
  const mid = midpoint(edgeGeometry(edge, a, b, proj).screen);
  const labelW = edge.label.length * 6.6 + 12;
  return (
    <g data-edge-id={edge.id}>
      <rect x={mid.x - labelW / 2} y={mid.y - 9} width={labelW} height={18} rx={9} fill={INK[theme].chip} stroke={edge.color} strokeWidth={1} />
      <text x={mid.x} y={mid.y} fontSize={11} fontWeight={600} textAnchor="middle" dominantBaseline="central" fill={INK[theme].text}>
        {edge.label}
      </text>
    </g>
  );
}

// ---------- scene ----------

export function SceneContent({
  diagram: source,
  proj,
  idPrefix,
  selectedEdges,
  animate = true,
}: {
  diagram: Diagram;
  proj: Projector;
  idPrefix: string;
  selectedEdges?: ReadonlySet<string>;
  /** Play edge animations (default true). */
  animate?: boolean;
}) {
  // Author colors adapted to the theme (dark grays become light grays in dark mode).
  const theme = useTheme();
  const diagram = useMemo(() => themedDiagram(source, theme), [source, theme]);
  const ground: DiagramNode[] = [];
  const solids: DiagramNode[] = [];
  for (const n of diagram.nodes) (isFlat(n) ? ground : solids).push(n);
  // Containers paint beneath what they contain.
  const depth = depthMap(diagram.nodes);
  const order = new Map(diagram.nodes.map((n, i) => [n.id, i]));
  ground.sort((a, b) => a.z - b.z || depth.get(a.id)! - depth.get(b.id)! || order.get(a.id)! - order.get(b.id)!);
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const sorted = depthSort(solids, proj);
  const animated = animate && diagram.edges.some((e) => e.animation && e.animation !== 'none');
  return (
    <>
      {animated && <style>{EDGE_KEYFRAMES}</style>}
      {ground.map((n) => (
        <Fragment key={n.id}>
          <NodeShape node={n} proj={proj} idPrefix={idPrefix} />
        </Fragment>
      ))}
      {diagram.edges.map((e) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        return <EdgeShape key={e.id} edge={e} a={a} b={b} proj={proj} idPrefix={idPrefix} selected={selectedEdges?.has(e.id)} animate={animate} />;
      })}
      {sorted.map((n) => (
        <NodeShape key={n.id} node={n} proj={proj} idPrefix={idPrefix} />
      ))}
      {/* Labels on top so they stay readable. */}
      {diagram.nodes.map((n) => (
        <Label key={`l-${n.id}`} node={n} proj={proj} />
      ))}
      {diagram.edges.map((e) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        return a && b ? <EdgeLabel key={`l-${e.id}`} edge={e} a={a} b={b} proj={proj} /> : null;
      })}
    </>
  );
}

const SPOT = '#2563eb';

/**
 * Picks one component out of a diagram, as on its docs page: the rest dims, and
 * the component and its connections are drawn again on top with a glow
 * beneath and a soft shadow. An area keeps its contents bright and gets a
 * glowing border instead.
 */
function Spotlight({ diagram: source, node: raw, proj, bounds, idPrefix }: { diagram: Diagram; node: DiagramNode; proj: Projector; bounds: { x: number; y: number; w: number; h: number }; idPrefix: string }) {
  const theme = useTheme();
  const diagram = useMemo(() => themedDiagram(source, theme), [source, theme]);
  const node = diagram.nodes.find((n) => n.id === raw.id) ?? raw;
  const base = footprint(node).map((q) => proj.project(q.x, q.y, node.z));
  const glow = `${idPrefix}-spot-glow`;
  const shadow = `${idPrefix}-spot-shadow`;
  const defs = (
    <defs>
      <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
      <filter id={shadow} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor={SPOT} floodOpacity={theme === 'dark' ? 0.55 : 0.35} />
      </filter>
    </defs>
  );
  if (isContainer(node)) {
    return (
      <g pointerEvents="none">
        {defs}
        <polygon points={pointsAttr(base)} fill="none" stroke={SPOT} strokeWidth={8} strokeOpacity={0.45} filter={`url(#${glow})`} />
        <polygon points={pointsAttr(base)} fill="none" stroke={SPOT} strokeWidth={2.5} strokeLinejoin="round" />
      </g>
    );
  }
  // A halo a little larger than the footprint, blurred into a glow on the ground.
  const c = proj.project(center(node).x, center(node).y, node.z);
  const halo = base.map((p) => ({ x: c.x + (p.x - c.x) * 1.35, y: c.y + (p.y - c.y) * 1.35 }));
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const edges = diagram.edges.filter((e) => e.from === node.id || e.to === node.id);
  return (
    <>
      {defs}
      <rect x={bounds.x} y={bounds.y} width={bounds.w} height={bounds.h} fill={CANVAS_BG[theme]} opacity={0.62} pointerEvents="none" />
      <polygon points={pointsAttr(halo)} fill={SPOT} opacity={theme === 'dark' ? 0.6 : 0.45} filter={`url(#${glow})`} pointerEvents="none" />
      <polygon points={pointsAttr(base)} fill={SPOT} fillOpacity={0.12} stroke={SPOT} strokeWidth={2} strokeLinejoin="round" pointerEvents="none" />
      {edges.map((e) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        return a && b ? <EdgeShape key={e.id} edge={e} a={a} b={b} proj={proj} idPrefix={`${idPrefix}-spot`} animate={false} /> : null;
      })}
      <g filter={`url(#${shadow})`}>
        <NodeShape node={node} proj={proj} idPrefix={`${idPrefix}-spot`} />
      </g>
      <Label node={node} proj={proj} />
      {edges.map((e) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        return a && b ? <EdgeLabel key={`l-${e.id}`} edge={e} a={a} b={b} proj={proj} /> : null;
      })}
    </>
  );
}

/** Small preview used by the shape palette. */
export function ShapePreview({ node, size = 44 }: { node: DiagramNode; size?: number }) {
  const proj = new Projector('3d', 0);
  const pts = footprint(node).flatMap((q) => [proj.project(q.x, q.y, node.z), proj.project(q.x, q.y, node.z + node.h)]);
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX;
  const h = Math.max(...ys) - minY;
  const m = Math.max(w, h) * 0.12;
  return (
    <svg width={size} height={size} viewBox={`${minX - m} ${minY - m} ${w + 2 * m} ${h + 2 * m}`} aria-hidden>
      <NodeShape node={node} proj={proj} idPrefix="pv" />
    </svg>
  );
}

/** Scene-space bounds of everything drawn for a diagram, including labels. */
export function sceneBounds(d: Diagram, proj: Projector, pad = 28): { x: number; y: number; w: number; h: number } {
  const pts: Pt[] = [];
  for (const n of d.nodes) {
    const top = n.z + (isFlat(n) ? 0 : n.kind === 'sphere' ? Math.min(n.w, n.d) : n.h);
    for (const q of footprint(n)) pts.push(proj.project(q.x, q.y, n.z), proj.project(q.x, q.y, top));
    if (n.label && n.kind !== 'text' && n.kind !== 'area') pts.push(labelAnchor(n, proj));
    // An isometric icon's box is its drawing in 2.5D; in 2D its picture can reach past the footprint.
    const iso = n.kind === 'image' && isIsoIcon(n.src) ? isoIconRect(n, proj) : null;
    if (iso) {
      if (iso.viewBox) pts.push({ x: iso.x, y: iso.y }, { x: iso.x + iso.w, y: iso.y + iso.h });
    } else if (n.kind === 'image' && n.imageStyle === 'standing') {
      const c = proj.project(center(n).x, center(n).y, n.z);
      pts.push({ x: c.x, y: c.y - Math.min(n.w, n.d) * TILE * 1.05 });
    }
  }
  if (!pts.length) return { x: -100, y: -60, w: 200, h: 120 };
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y };
}

/**
 * A non-interactive, responsive rendering of a diagram: it scales to the
 * width of its container. Used for published pages, component pictures and
 * diagrams embedded in docs.
 */
export function StaticDiagram({
  diagram,
  view,
  rotation = 0,
  highlight,
  focus,
  onNodeClick,
  animate = true,
  maxHeight,
  className,
  label,
}: {
  diagram: Diagram;
  /** Defaults to the diagram's own setting. */
  view?: '2d' | '3d';
  rotation?: 0 | 1 | 2 | 3;
  /** Outline this node. */
  highlight?: string;
  /** Emphasise this node or connection (e.g. while a mention of it is hovered). */
  focus?: DocTarget | null;
  onNodeClick?: (id: string) => void;
  animate?: boolean;
  maxHeight?: number | string;
  className?: string;
  /** Accessible description of the picture. */
  label?: string;
}) {
  const idPrefix = useId().replace(/:/g, '');
  const proj = new Projector(view ?? diagram.view ?? '3d', rotation);
  const b = sceneBounds(diagram, proj);
  const hl = highlight ? diagram.nodes.find((n) => n.id === highlight) : undefined;
  const onClick = (e: RMouseEvent) => {
    const id = (e.target as Element).closest('[data-node-id]')?.getAttribute('data-node-id');
    if (id && onNodeClick) onNodeClick(id);
  };
  return (
    <svg
      className={className}
      viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label ?? 'Architecture diagram'}
      style={{ display: 'block', maxHeight, cursor: onNodeClick ? 'pointer' : undefined, fontFamily: 'inherit' }}
      onClick={onClick}
    >
      <SceneContent diagram={diagram} proj={proj} idPrefix={idPrefix} animate={animate} />
      {hl && <Spotlight diagram={diagram} node={hl} proj={proj} bounds={b} idPrefix={idPrefix} />}
      {focus && <TargetHighlight target={focus} diagram={diagram} proj={proj} />}
    </svg>
  );
}

import { Fragment, type ReactNode } from 'react';
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
import { depthMap } from './containers';
import { edgePathD, endMarkerOf, lineStyleOf, polylineLength, resolveEdge, startMarkerOf } from './routing';
import type { Diagram, DiagramEdge, DiagramNode, LineStyle, MarkerKind } from './types';

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
  if (node.kind === 'image' && node.imageStyle === 'standing' && proj.mode === '3d') {
    const p = proj.project(c.x, c.y, node.z);
    return { x: p.x, y: p.y + 16 };
  }
  const pts = footprint(node).map((q) => proj.project(q.x, q.y, node.z));
  const maxY = Math.max(...pts.map((p) => p.y));
  return { x: proj.project(c.x, c.y, node.z).x, y: maxY + 15 };
}

function Label({ node, proj }: { node: DiagramNode; proj: Projector }) {
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
          fill={node.labelColor ?? shade(node.color, 0.6)}
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
      fill={node.labelColor ?? '#1f2937'}
      stroke="#ffffff"
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
    <g data-node-id={node.id} opacity={isArea ? undefined : node.opacity ?? 1} style={{ cursor: node.locked ? 'default' : 'move' }}>
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

/** Animated overlays for an edge (SMIL, so exported SVGs animate too). */
function EdgeAnimationLayer({ edge, d, length }: { edge: DiagramEdge; d: string; length: number }) {
  const anim = edge.animation ?? 'none';
  const w = edge.width;
  const speed = Math.max(0.1, edge.animationSpeed ?? 1);
  const pxPerSec = 80 * speed;
  const dir = edge.animationDirection ?? 'forward';
  const color = edge.animationColor ?? shade(edge.color, 1.55);
  const len = Math.max(1, length);

  if (anim === 'packets') {
    const n = Math.max(1, Math.min(6, Math.round(len / 130)));
    const dur = Math.max(0.6, len / pxPerSec);
    const lanes: ('forward' | 'reverse')[] = dir === 'both' ? ['forward', 'reverse'] : [dir === 'reverse' ? 'reverse' : 'forward'];
    return (
      <g pointerEvents="none">
        {lanes.flatMap((lane) =>
          Array.from({ length: n }, (_, i) => (
            <circle key={`${lane}-${i}`} r={w + 1.6} fill={lane === 'reverse' && dir === 'both' ? shade(edge.color, 0.7) : color} stroke="#ffffff" strokeWidth={1.2}>
              <animateMotion
                dur={`${dur.toFixed(2)}s`}
                repeatCount="indefinite"
                path={d}
                begin={`-${((i * dur) / n + (lane === 'reverse' ? dur / (2 * n) : 0)).toFixed(2)}s`}
                keyPoints={lane === 'reverse' ? '1;0' : '0;1'}
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
          )),
        )}
      </g>
    );
  }
  if (anim === 'pulse') {
    const seg = Math.min(70, Math.max(16, len * 0.25));
    const dur = Math.max(0.6, (len + seg) / pxPerSec);
    const sweeps: ('forward' | 'reverse')[] = dir === 'both' ? ['forward', 'reverse'] : [dir === 'reverse' ? 'reverse' : 'forward'];
    return (
      <g pointerEvents="none">
        {sweeps.map((s) => (
          <path key={s} d={d} fill="none" stroke={color} strokeWidth={w + 2.5} strokeLinecap="round" strokeDasharray={`${seg} ${len + seg}`}>
            <animate
              attributeName="stroke-dashoffset"
              values={s === 'forward' ? `${seg};${-len}` : `${-len};${seg}`}
              dur={`${dur.toFixed(2)}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
      </g>
    );
  }
  if (anim === 'glow') {
    return (
      <path d={d} fill="none" stroke={edge.color} strokeWidth={w + 8} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
        <animate attributeName="stroke-opacity" values="0.04;0.35;0.04" dur={`${(2 / speed).toFixed(2)}s`} repeatCount="indefinite" />
      </path>
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
    <g data-edge-id={edge.id} style={{ cursor: 'pointer' }}>
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
      >
        {flowing && (
          <animate
            attributeName="stroke-dashoffset"
            values={reverse ? `0;${period}` : `${period};0`}
            dur={`${Math.max(0.15, period / (40 * speed)).toFixed(2)}s`}
            repeatCount="indefinite"
          />
        )}
      </path>
      {animate && <EdgeAnimationLayer edge={edge} d={d} length={length} />}
    </g>
  );
}

export function EdgeLabel({ edge, a, b, proj }: { edge: DiagramEdge; a: DiagramNode; b: DiagramNode; proj: Projector }) {
  if (!edge.label) return null;
  const mid = midpoint(edgeGeometry(edge, a, b, proj).screen);
  const labelW = edge.label.length * 6.6 + 12;
  return (
    <g data-edge-id={edge.id} style={{ cursor: 'pointer' }}>
      <rect x={mid.x - labelW / 2} y={mid.y - 9} width={labelW} height={18} rx={9} fill="#ffffff" stroke={edge.color} strokeWidth={1} />
      <text x={mid.x} y={mid.y} fontSize={11} fontWeight={600} textAnchor="middle" dominantBaseline="central" fill="#1f2937">
        {edge.label}
      </text>
    </g>
  );
}

// ---------- scene ----------

export function SceneContent({
  diagram,
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
  const ground: DiagramNode[] = [];
  const solids: DiagramNode[] = [];
  for (const n of diagram.nodes) (isFlat(n) ? ground : solids).push(n);
  // Containers paint beneath what they contain.
  const depth = depthMap(diagram.nodes);
  const order = new Map(diagram.nodes.map((n, i) => [n.id, i]));
  ground.sort((a, b) => a.z - b.z || depth.get(a.id)! - depth.get(b.id)! || order.get(a.id)! - order.get(b.id)!);
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const sorted = depthSort(solids, proj);
  return (
    <>
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

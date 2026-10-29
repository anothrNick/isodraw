import { Fragment, type ReactNode } from 'react';
import {
  TILE,
  Projector,
  type Pt,
  center,
  clipToRect,
  contrastText,
  depthSort,
  footprint,
  isFlat,
  matrixAttr,
  pointsAttr,
  shade,
  solidFaces,
} from './geometry';
import type { Diagram, DiagramEdge, DiagramNode } from './types';

const CURVED = new Set(['cylinder', 'cone']);
const INSIDE_LABEL_2D = new Set(['block', 'cylinder', 'hexagon']);
const INV_TILE = 1 / TILE;

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
  return (
    <>
      {style === 'tile' && <SolidFaces node={{ ...node, kind: 'block' }} proj={proj} />}
      <Ground proj={proj} z={top}>
        <image
          href={node.src}
          x={(node.x + pad) * TILE}
          y={(node.y + pad) * TILE}
          width={(node.w - 2 * pad) * TILE}
          height={(node.d - 2 * pad) * TILE}
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
    // Area labels sit inside the top-left corner, painted on the ground.
    return (
      <Ground proj={proj} z={node.z}>
        <text
          x={(node.x + 0.3) * TILE}
          y={(node.y + 0.3) * TILE}
          fontSize={13}
          fontWeight={700}
          dominantBaseline="hanging"
          fill={node.labelColor ?? shade(node.color, 0.6)}
          style={{ userSelect: 'none' }}
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
      <text x={c.x} y={c.y} fontSize={12} fontWeight={600} textAnchor="middle" dominantBaseline="central" fill={node.labelColor ?? contrastText(node.color)} style={{ userSelect: 'none' }}>
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
      style={{ userSelect: 'none' }}
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

/** World-space polyline for an edge, clipped to the node footprints. */
export function edgeWorldPath(edge: DiagramEdge, a: DiagramNode, b: DiagramNode): { pts: Pt[]; zs: number[] } {
  const ca = center(a);
  const cb = center(b);
  if (edge.routing === 'orthogonal' && Math.abs(ca.x - cb.x) > 0.01 && Math.abs(ca.y - cb.y) > 0.01) {
    const corner = { x: cb.x, y: ca.y };
    const insideA = corner.x >= a.x && corner.x <= a.x + a.w;
    const insideB = corner.y >= b.y && corner.y <= b.y + b.d;
    if (!insideA && !insideB) {
      const start = clipToRect(corner, ca, a);
      const end = clipToRect(corner, cb, b);
      return { pts: [start, corner, end], zs: [a.z, a.z, b.z] };
    }
    // Corner falls inside a footprint: route vertically-first instead.
    const alt = { x: ca.x, y: cb.y };
    return {
      pts: [clipToRect(alt, ca, a), alt, clipToRect(alt, cb, b)],
      zs: [a.z, b.z, b.z],
    };
  }
  return { pts: [clipToRect(cb, ca, a), clipToRect(ca, cb, b)], zs: [a.z, b.z] };
}

function midpoint(pts: Pt[]): Pt {
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  let half = total / 2;
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

export function EdgeShape({
  edge,
  a,
  b,
  proj,
  idPrefix,
  selected,
}: {
  edge: DiagramEdge;
  a: DiagramNode;
  b: DiagramNode;
  proj: Projector;
  idPrefix: string;
  selected?: boolean;
}) {
  const { pts, zs } = edgeWorldPath(edge, a, b);
  const screen = pts.map((p, i) => proj.project(p.x, p.y, zs[i]));
  const d = `M${screen.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' L')}`;
  const markerId = `${idPrefix}-arrow-${edge.id}`;
  return (
    <g data-edge-id={edge.id} style={{ cursor: 'pointer' }}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={edge.color} />
        </marker>
      </defs>
      <path d={d} stroke="transparent" strokeWidth={14} fill="none" />
      {selected && (
        <path d={d} stroke="#2563eb" strokeOpacity={0.3} strokeWidth={edge.width + 6} fill="none" strokeLinejoin="round" data-noexport="" />
      )}
      <path
        d={d}
        stroke={edge.color}
        strokeWidth={edge.width}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={edge.dashed ? `${edge.width * 3} ${edge.width * 2.5}` : undefined}
        markerEnd={edge.arrowEnd ? `url(#${markerId})` : undefined}
        markerStart={edge.arrowStart ? `url(#${markerId})` : undefined}
      />
    </g>
  );
}

export function EdgeLabel({ edge, a, b, proj }: { edge: DiagramEdge; a: DiagramNode; b: DiagramNode; proj: Projector }) {
  if (!edge.label) return null;
  const { pts, zs } = edgeWorldPath(edge, a, b);
  const mid = midpoint(pts.map((p, i) => proj.project(p.x, p.y, zs[i])));
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
}: {
  diagram: Diagram;
  proj: Projector;
  idPrefix: string;
  selectedEdges?: ReadonlySet<string>;
}) {
  const ground: DiagramNode[] = [];
  const solids: DiagramNode[] = [];
  for (const n of diagram.nodes) (isFlat(n) ? ground : solids).push(n);
  ground.sort((a, b) => a.z - b.z);
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
        return <EdgeShape key={e.id} edge={e} a={a} b={b} proj={proj} idPrefix={idPrefix} selected={selectedEdges?.has(e.id)} />;
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

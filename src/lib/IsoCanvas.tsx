import { useEffect, useId, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type Ref } from 'react';
import { Projector, type Pt, center, footprint, isFlat, pointsAttr, rectPoly, snap } from './geometry';
import { containerOf, descendantsOf, isContainer } from './containers';
import { SceneContent, edgeGeometry } from './render';
import {
  SIDES,
  type InferredRoute,
  type ResolvedEdge,
  anchorPoint,
  edgePathD,
  inferRoute,
  moveSegment,
  nearestAnchor,
  previewRoute,
  resolveEdge,
} from './routing';
import type { Camera, Diagram, DiagramEdge, DiagramNode, Rotation, Side, ViewMode } from './types';

export interface Selection {
  nodes: string[];
  edges: string[];
}
export type Tool = 'select' | 'connect';

export interface IsoCanvasProps {
  diagram: Diagram;
  view: ViewMode;
  rotation: Rotation;
  camera: Camera;
  onCameraChange: (c: Camera) => void;
  selection: Selection;
  onSelectionChange: (s: Selection) => void;
  tool?: Tool;
  readOnly?: boolean;
  showGrid?: boolean;
  /** Play edge animations (default true). */
  animate?: boolean;
  /** Grid snapping step in world units (hold Alt while dragging to disable). */
  snapStep?: number;
  /** Style used to preview connections while they are drawn. */
  newEdgeStyle?: Partial<DiagramEdge>;
  /** Called once before a drag starts mutating the diagram (for undo history). */
  onBeginChange?: () => void;
  onChange?: (d: Diagram) => void;
  /** A connection was drawn; `route` holds the anchors and bends inferred from the drag. */
  onConnect?: (from: string, to: string, route: InferredRoute) => void;
  /** Payload dropped from the palette at the given world point. */
  onDropPayload?: (payload: string, world: Pt) => void;
  svgRef?: Ref<SVGSVGElement>;
}

type Drag =
  | { type: 'pan'; sx: number; sy: number; cam: Camera; moved: boolean }
  | {
      type: 'move';
      start: Pt;
      /** Node under the pointer; its snapped position sets the offset for everything. */
      primary: string;
      origins: Map<string, Pt>;
      /** Bends of edges whose both ends move, so they travel along. */
      edgeOrigins: Map<string, Pt[]>;
      moved: boolean;
      /** Container the primary node will land in. */
      dropTarget?: string;
    }
  | { type: 'resize'; id: string; fixed: Pt; began: boolean }
  | { type: 'height'; id: string; sy: number; h0: number; began: boolean }
  | { type: 'connect'; from: string; fromSide?: Side; trail: Pt[]; cursor: Pt; target: string | null }
  | { type: 'edgeEnd'; edgeId: string; end: 'from' | 'to'; cursor: Pt; target: string | null }
  | { type: 'segment'; edgeId: string; index: number; start: Pt; base: ResolvedEdge; began: boolean }
  | { type: 'waypoint'; edgeId: string; index: number; began: boolean }
  | { type: 'marquee'; start: Pt; cur: Pt; additive: string[] };

export const DRAG_MIME = 'application/x-isodraw';

function closestAttr(t: EventTarget | null, attr: string): string | null {
  const el = (t as Element | null)?.closest?.(`[${attr}]`);
  return el ? el.getAttribute(attr) : null;
}

const ACCENT = 'var(--isd-accent, #2563eb)';

export function IsoCanvas(props: IsoCanvasProps) {
  const {
    diagram,
    view,
    rotation,
    camera,
    onCameraChange,
    selection,
    onSelectionChange,
    tool = 'select',
    readOnly,
    showGrid = true,
    animate = true,
    snapStep = 0.5,
  } = props;
  const idPrefix = useId().replace(/:/g, '');
  const proj = useMemo(() => new Projector(view, rotation), [view, rotation]);
  const svgEl = useRef<SVGSVGElement | null>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [spaceDown, setSpaceDown] = useState(false);
  const latest = useRef(props);
  latest.current = props;

  const setSvg = (el: SVGSVGElement | null) => {
    svgEl.current = el;
    const r = props.svgRef;
    if (typeof r === 'function') r(el);
    else if (r) (r as { current: SVGSVGElement | null }).current = el;
  };

  // Track viewport size.
  useEffect(() => {
    const el = svgEl.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Space-to-pan.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target as HTMLElement)?.closest?.('input,textarea,select')) {
        setSpaceDown(true);
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => e.code === 'Space' && setSpaceDown(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Wheel: pinch / mouse wheel zooms, trackpad scroll pans.
  useEffect(() => {
    const el = svgEl.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = latest.current.camera;
      const isZoom = e.ctrlKey || e.metaKey || (e.deltaX === 0 && (e.deltaMode !== 0 || Math.abs(e.deltaY) >= 50));
      if (!isZoom) {
        latest.current.onCameraChange({ ...cam, x: cam.x - e.deltaX, y: cam.y - e.deltaY });
        return;
      }
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015));
      const zoom = Math.min(4, Math.max(0.15, cam.zoom * factor));
      const k = zoom / cam.zoom;
      latest.current.onCameraChange({ zoom, x: px - (px - cam.x) * k, y: py - (py - cam.y) * k });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const toScene = (clientX: number, clientY: number): Pt => {
    const r = svgEl.current!.getBoundingClientRect();
    return { x: (clientX - r.left - camera.x) / camera.zoom, y: (clientY - r.top - camera.y) / camera.zoom };
  };
  const toWorld = (clientX: number, clientY: number, z = 0): Pt => {
    const s = toScene(clientX, clientY);
    return proj.unproject(s.x, s.y, z);
  };
  /** Node under the pointer, ignoring pointer capture. */
  const nodeAtPoint = (clientX: number, clientY: number) =>
    closestAttr(document.elementFromPoint(clientX, clientY), 'data-node-id');

  const nodeById = useMemo(() => new Map(diagram.nodes.map((n) => [n.id, n])), [diagram.nodes]);
  const edgeById = useMemo(() => new Map(diagram.edges.map((e) => [e.id, e])), [diagram.edges]);

  const updateNodes = (fn: (n: DiagramNode) => DiagramNode) => {
    props.onChange?.({ ...diagram, nodes: diagram.nodes.map(fn) });
  };
  const patchEdge = (id: string, patch: Partial<DiagramEdge>) => {
    props.onChange?.({ ...diagram, edges: diagram.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  };
  const edgeEnds = (e: DiagramEdge) => {
    const a = nodeById.get(e.from);
    const b = nodeById.get(e.to);
    return a && b ? ([a, b] as const) : null;
  };

  const startEdgeHandle = (handle: string, e: RPointerEvent<SVGSVGElement>): boolean => {
    const edge = edgeById.get(selection.edges[0]);
    const ends = edge && edgeEnds(edge);
    if (!edge || !ends) return false;
    const [kind, idx] = handle.split(':');
    const i = Number(idx);
    if (kind === 'edge-from' || kind === 'edge-to') {
      setDrag({ type: 'edgeEnd', edgeId: edge.id, end: kind === 'edge-from' ? 'from' : 'to', cursor: toScene(e.clientX, e.clientY), target: null });
    } else if (kind === 'seg') {
      const base = resolveEdge(edge, ends[0], ends[1]);
      setDrag({ type: 'segment', edgeId: edge.id, index: i, start: toWorld(e.clientX, e.clientY, base.zs[i]), base, began: false });
    } else if (kind === 'wp') {
      setDrag({ type: 'waypoint', edgeId: edge.id, index: i, began: false });
    } else if (kind === 'wpadd') {
      // Insert a bend between route points i and i+1, then drag it.
      const r = resolveEdge(edge, ends[0], ends[1]);
      const p = { x: (r.pts[i].x + r.pts[i + 1].x) / 2, y: (r.pts[i].y + r.pts[i + 1].y) / 2 };
      const wps = [...(edge.waypoints ?? [])];
      wps.splice(i, 0, p);
      props.onBeginChange?.();
      patchEdge(edge.id, { waypoints: wps });
      setDrag({ type: 'waypoint', edgeId: edge.id, index: i, began: true });
    } else {
      return false;
    }
    return true;
  };

  const onPointerDown = (e: RPointerEvent<SVGSVGElement>) => {
    if (e.button === 2) return;
    try {
      svgEl.current?.setPointerCapture?.(e.pointerId);
    } catch {
      /* pointer already released (e.g. synthetic events) */
    }
    svgEl.current?.focus?.();
    if (e.button === 1 || spaceDown) {
      setDrag({ type: 'pan', sx: e.clientX, sy: e.clientY, cam: camera, moved: true });
      return;
    }
    const handle = closestAttr(e.target, 'data-handle');
    const nodeId = closestAttr(e.target, 'data-node-id');
    const edgeId = closestAttr(e.target, 'data-edge-id');

    if (handle && !readOnly) {
      if (startEdgeHandle(handle, e)) return;
      if (handle.startsWith('conn-')) {
        const [side, id] = handle.slice(5).split(':');
        const n = nodeById.get(id);
        if (!n) return;
        const w = toWorld(e.clientX, e.clientY, n.z);
        setDrag({ type: 'connect', from: n.id, fromSide: side as Side, trail: [w], cursor: w, target: null });
        return;
      }
      const n = nodeById.get(selection.nodes[0]);
      if (!n) return;
      if (handle === 'height') {
        setDrag({ type: 'height', id: n.id, sy: e.clientY, h0: n.h, began: false });
      } else {
        const corners = rectPoly(n);
        const fixed = corners[(Number(handle) + 2) % 4];
        setDrag({ type: 'resize', id: n.id, fixed, began: false });
      }
      return;
    }
    if (nodeId && tool === 'connect' && !readOnly) {
      const n = nodeById.get(nodeId)!;
      const w = toWorld(e.clientX, e.clientY, n.z);
      setDrag({ type: 'connect', from: nodeId, trail: [w], cursor: w, target: null });
      return;
    }
    if (nodeId) {
      let nodes = selection.nodes;
      if (e.shiftKey || e.metaKey) {
        nodes = nodes.includes(nodeId) ? nodes.filter((i) => i !== nodeId) : [...nodes, nodeId];
      } else if (!nodes.includes(nodeId)) {
        nodes = [nodeId];
      }
      onSelectionChange({ nodes, edges: [] });
      if (readOnly) return;
      // Containers carry everything inside them.
      const containers = nodes.filter((id) => {
        const n = nodeById.get(id);
        return n && isContainer(n) && !n.locked;
      });
      const moving = new Set([...nodes, ...descendantsOf(containers, diagram.nodes)]);
      const origins = new Map<string, Pt>();
      for (const id of moving) {
        const n = nodeById.get(id);
        if (n && !n.locked) origins.set(id, { x: n.x, y: n.y });
      }
      const edgeOrigins = new Map<string, Pt[]>();
      for (const ed of diagram.edges) {
        if (ed.waypoints?.length && origins.has(ed.from) && origins.has(ed.to)) edgeOrigins.set(ed.id, ed.waypoints);
      }
      if (origins.has(nodeId)) {
        setDrag({ type: 'move', start: toWorld(e.clientX, e.clientY), primary: nodeId, origins, edgeOrigins, moved: false });
      }
      return;
    }
    if (edgeId) {
      onSelectionChange({ nodes: [], edges: e.shiftKey ? [...selection.edges, edgeId] : [edgeId] });
      return;
    }
    if (e.shiftKey) {
      const s = toScene(e.clientX, e.clientY);
      setDrag({ type: 'marquee', start: s, cur: s, additive: selection.nodes });
      return;
    }
    setDrag({ type: 'pan', sx: e.clientX, sy: e.clientY, cam: camera, moved: false });
  };

  const onPointerMove = (e: RPointerEvent<SVGSVGElement>) => {
    if (!drag) {
      if (tool === 'connect' && !closestAttr(e.target, 'data-handle')?.startsWith('conn-')) {
        setHover(closestAttr(e.target, 'data-node-id'));
      }
      return;
    }
    const free = e.altKey;
    switch (drag.type) {
      case 'pan': {
        const dx = e.clientX - drag.sx;
        const dy = e.clientY - drag.sy;
        if (!drag.moved && Math.hypot(dx, dy) < 3) return;
        if (!drag.moved) setDrag({ ...drag, moved: true });
        onCameraChange({ ...drag.cam, x: drag.cam.x + dx, y: drag.cam.y + dy });
        break;
      }
      case 'move': {
        const w = toWorld(e.clientX, e.clientY);
        const dx = w.x - drag.start.x;
        const dy = w.y - drag.start.y;
        if (!drag.moved) {
          if (Math.hypot(dx, dy) < 0.15) return;
          props.onBeginChange?.();
        }
        // One offset for everything, so nested layouts keep their exact spacing.
        const p = drag.origins.get(drag.primary)!;
        const ox = free ? dx : snap(p.x + dx, snapStep) - p.x;
        const oy = free ? dy : snap(p.y + dy, snapStep) - p.y;
        const nodes = diagram.nodes.map((n) => {
          const o = drag.origins.get(n.id);
          return o ? { ...n, x: o.x + ox, y: o.y + oy } : n;
        });
        const edges = drag.edgeOrigins.size
          ? diagram.edges.map((ed) => {
              const wps = drag.edgeOrigins.get(ed.id);
              return wps ? { ...ed, waypoints: wps.map((w) => ({ x: w.x + ox, y: w.y + oy })) } : ed;
            })
          : diagram.edges;
        const primary = nodes.find((n) => n.id === drag.primary)!;
        const target = containerOf(primary, nodes, new Set(drag.origins.keys()))?.id;
        if (target !== drag.dropTarget || !drag.moved) setDrag({ ...drag, moved: true, dropTarget: target });
        props.onChange?.({ ...diagram, nodes, edges });
        break;
      }
      case 'resize': {
        const n = nodeById.get(drag.id);
        if (!n) return;
        const w = toWorld(e.clientX, e.clientY, n.z);
        const px = free ? w.x : snap(w.x, snapStep);
        const py = free ? w.y : snap(w.y, snapStep);
        const min = 0.5;
        const nw = Math.max(min, Math.abs(px - drag.fixed.x));
        const nd = Math.max(min, Math.abs(py - drag.fixed.y));
        if (!drag.began) {
          props.onBeginChange?.();
          setDrag({ ...drag, began: true });
        }
        updateNodes((m) =>
          m.id === drag.id
            ? {
                ...m,
                x: px < drag.fixed.x ? drag.fixed.x - nw : drag.fixed.x,
                y: py < drag.fixed.y ? drag.fixed.y - nd : drag.fixed.y,
                w: nw,
                d: nd,
              }
            : m,
        );
        break;
      }
      case 'height': {
        const dh = (drag.sy - e.clientY) / (proj.heightScale * camera.zoom);
        const h = Math.max(0.1, free ? drag.h0 + dh : snap(drag.h0 + dh, 0.25));
        if (!drag.began) {
          props.onBeginChange?.();
          setDrag({ ...drag, began: true });
        }
        updateNodes((m) => (m.id === drag.id ? { ...m, h } : m));
        break;
      }
      case 'connect': {
        const from = nodeById.get(drag.from)!;
        const w = toWorld(e.clientX, e.clientY, from.z);
        const last = drag.trail[drag.trail.length - 1];
        const trail = Math.hypot(w.x - last.x, w.y - last.y) > 0.1 ? [...drag.trail, w] : drag.trail;
        setDrag({ ...drag, trail, cursor: w, target: nodeAtPoint(e.clientX, e.clientY) });
        break;
      }
      case 'edgeEnd':
        setDrag({ ...drag, cursor: toScene(e.clientX, e.clientY), target: nodeAtPoint(e.clientX, e.clientY) });
        break;
      case 'segment': {
        const { base } = drag;
        const a = base.pts[drag.index];
        const b = base.pts[drag.index + 1];
        const horizontal = Math.abs(a.y - b.y) < 1e-6;
        const w = toWorld(e.clientX, e.clientY, base.zs[drag.index]);
        const raw = horizontal ? a.y + (w.y - drag.start.y) : a.x + (w.x - drag.start.x);
        const level = free ? raw : snap(raw, 0.25);
        if (Math.abs(level - (horizontal ? a.y : a.x)) < 1e-6 && !drag.began) return;
        const edge = edgeById.get(drag.edgeId);
        const ends = edge && edgeEnds(edge);
        if (!ends) return;
        if (!drag.began) {
          props.onBeginChange?.();
          setDrag({ ...drag, began: true });
        }
        patchEdge(drag.edgeId, moveSegment(base, ends[0], ends[1], drag.index, level));
        break;
      }
      case 'waypoint': {
        const edge = edgeById.get(drag.edgeId);
        if (!edge?.waypoints) return;
        const z = nodeById.get(edge.from)?.z ?? 0;
        const w = toWorld(e.clientX, e.clientY, z);
        const p = free ? w : { x: snap(w.x, 0.25), y: snap(w.y, 0.25) };
        if (!drag.began) {
          props.onBeginChange?.();
          setDrag({ ...drag, began: true });
        }
        patchEdge(edge.id, { waypoints: edge.waypoints.map((q, i) => (i === drag.index ? p : q)) });
        break;
      }
      case 'marquee': {
        const cur = toScene(e.clientX, e.clientY);
        setDrag({ ...drag, cur });
        const x0 = Math.min(drag.start.x, cur.x);
        const x1 = Math.max(drag.start.x, cur.x);
        const y0 = Math.min(drag.start.y, cur.y);
        const y1 = Math.max(drag.start.y, cur.y);
        const hit = diagram.nodes
          .filter((n) => {
            const c = center(n);
            const p = proj.project(c.x, c.y, n.z + (isFlat(n) ? 0 : n.h / 2));
            return p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1;
          })
          .map((n) => n.id);
        onSelectionChange({ nodes: [...new Set([...drag.additive, ...hit])], edges: [] });
        break;
      }
    }
  };

  const onPointerUp = (e: RPointerEvent<SVGSVGElement>) => {
    if (drag?.type === 'pan' && !drag.moved) onSelectionChange({ nodes: [], edges: [] });
    if (drag?.type === 'connect') {
      const target = nodeAtPoint(e.clientX, e.clientY);
      const from = nodeById.get(drag.from);
      const to = target ? nodeById.get(target) : undefined;
      if (from && to && to.id !== from.id) props.onConnect?.(from.id, to.id, inferRoute(drag.trail, from, drag.fromSide, to));
    }
    if (drag?.type === 'edgeEnd') {
      const edge = edgeById.get(drag.edgeId);
      const target = nodeAtPoint(e.clientX, e.clientY);
      const node = target ? nodeById.get(target) : undefined;
      const other = edge && (drag.end === 'from' ? edge.to : edge.from);
      if (edge && node && node.id !== other) {
        const anchor = nearestAnchor(node, toWorld(e.clientX, e.clientY, node.z));
        const sameNode = node.id === (drag.end === 'from' ? edge.from : edge.to);
        props.onBeginChange?.();
        patchEdge(edge.id, {
          ...(drag.end === 'from' ? { from: node.id, fromAnchor: anchor } : { to: node.id, toAnchor: anchor }),
          // Bends drawn for the old node rarely suit a new one.
          ...(sameNode ? {} : { waypoints: undefined }),
        });
      }
    }
    setDrag(null);
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    const handle = closestAttr(e.target, 'data-handle');
    const edge = edgeById.get(selection.edges[0]);
    if (!handle?.startsWith('wp:') || !edge?.waypoints || readOnly) return;
    const i = Number(handle.split(':')[1]);
    props.onBeginChange?.();
    patchEdge(edge.id, { waypoints: edge.waypoints.filter((_, k) => k !== i) });
  };

  // ----- grid -----
  const grid = useMemo(() => {
    if (!showGrid) return null;
    const corners = [
      [0, 0],
      [size.w, 0],
      [0, size.h],
      [size.w, size.h],
    ].map(([sx, sy]) => proj.unproject((sx - camera.x) / camera.zoom, (sy - camera.y) / camera.zoom));
    const minX = Math.floor(Math.min(...corners.map((c) => c.x))) - 1;
    const maxX = Math.ceil(Math.max(...corners.map((c) => c.x))) + 1;
    const minY = Math.floor(Math.min(...corners.map((c) => c.y))) - 1;
    const maxY = Math.ceil(Math.max(...corners.map((c) => c.y))) + 1;
    const span = Math.max(maxX - minX, maxY - minY);
    const step = span > 400 ? 10 : span > 160 ? 5 : 1;
    let minor = '';
    let major = '';
    const seg = (ax: number, ay: number, bx: number, by: number) => {
      const p = proj.project(ax, ay);
      const q = proj.project(bx, by);
      return `M${p.x.toFixed(1)},${p.y.toFixed(1)}L${q.x.toFixed(1)},${q.y.toFixed(1)}`;
    };
    for (let x = Math.floor(minX / step) * step; x <= maxX; x += step) {
      const s = seg(x, minY, x, maxY);
      if (x % (step * 5) === 0) major += s;
      else minor += s;
    }
    for (let y = Math.floor(minY / step) * step; y <= maxY; y += step) {
      const s = seg(minX, y, maxX, y);
      if (y % (step * 5) === 0) major += s;
      else minor += s;
    }
    return (
      <g data-noexport="" pointerEvents="none">
        <path d={minor} stroke="var(--isd-grid, #dde3ec)" strokeWidth={1} vectorEffect="non-scaling-stroke" fill="none" />
        <path d={major} stroke="var(--isd-grid-major, #c8d1de)" strokeWidth={1} vectorEffect="non-scaling-stroke" fill="none" />
      </g>
    );
  }, [showGrid, size, camera, proj]);

  // ----- selection overlay -----
  const selectedSet = useMemo(() => new Set(selection.edges), [selection.edges]);
  const r = 5 / camera.zoom;
  const overlay = selection.nodes.map((id) => {
    const n = nodeById.get(id);
    if (!n) return null;
    const base = footprint(n).map((q) => proj.project(q.x, q.y, n.z));
    const solid = !isFlat(n) && proj.mode === '3d' && n.kind !== 'sphere';
    const top = solid ? footprint(n).map((q) => proj.project(q.x, q.y, n.z + n.h)) : null;
    return (
      <g key={id}>
        <polygon points={pointsAttr(base)} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="5 3" vectorEffect="non-scaling-stroke" />
        {top && n.kind !== 'pyramid' && n.kind !== 'cone' && (
          <polygon points={pointsAttr(top)} fill="none" stroke={ACCENT} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        )}
      </g>
    );
  });

  /** Small connection dots on each side of a node; drag one to connect from that side. */
  const sideHandles = (n: DiagramNode) =>
    SIDES.map((side) => {
      const p = anchorPoint(n, { side, t: 0.5 }, 0.45);
      const s = proj.project(p.x, p.y, n.z);
      return (
        <circle
          key={side}
          data-handle={`conn-${side}:${n.id}`}
          cx={s.x}
          cy={s.y}
          r={r * 0.9}
          fill="#fff"
          stroke={ACCENT}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          style={{ cursor: 'crosshair' }}
        >
          <title>Drag to connect</title>
        </circle>
      );
    });

  let handles = null;
  const single = selection.nodes.length === 1 ? nodeById.get(selection.nodes[0]) : undefined;
  if (single && !readOnly && tool === 'select' && !drag) {
    const corners = rectPoly(single).map((q) => proj.project(q.x, q.y, single.z));
    // Front-most corner is the most convenient to grab.
    let ci = 0;
    corners.forEach((p, i) => {
      if (p.y > corners[ci].y + 0.01 || (Math.abs(p.y - corners[ci].y) < 0.01 && p.x > corners[ci].x)) ci = i;
    });
    const c = center(single);
    const showHeight = proj.mode === '3d' && !isFlat(single) && single.kind !== 'sphere' && single.kind !== 'image';
    const hp = proj.project(c.x, c.y, single.z + single.h);
    handles = (
      <g>
        {sideHandles(single)}
        {!single.locked && (
          <rect
            data-handle={String(ci)}
            x={corners[ci].x - r}
            y={corners[ci].y - r}
            width={r * 2}
            height={r * 2}
            fill="#fff"
            stroke={ACCENT}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            style={{ cursor: 'nwse-resize' }}
          />
        )}
        {showHeight && !single.locked && (
          <circle
            data-handle="height"
            cx={hp.x}
            cy={hp.y - 14 / camera.zoom}
            r={r}
            fill={ACCENT}
            stroke="#fff"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            style={{ cursor: 'ns-resize' }}
          >
            <title>Drag to change height</title>
          </circle>
        )}
      </g>
    );
  }

  // ----- edge editing handles -----
  let edgeHandles = null;
  const selEdge = selection.edges.length === 1 && !selection.nodes.length ? edgeById.get(selection.edges[0]) : undefined;
  const selEnds = selEdge && edgeEnds(selEdge);
  if (selEdge && selEnds && !readOnly && tool === 'select' && drag?.type !== 'edgeEnd') {
    const { r: route, screen } = edgeGeometry(selEdge, selEnds[0], selEnds[1], proj);
    const items: JSX.Element[] = [];
    if (selEdge.routing === 'orthogonal') {
      route.pts.slice(0, -1).forEach((p, i) => {
        const q = route.pts[i + 1];
        if (Math.hypot(q.x - p.x, q.y - p.y) < 0.6) return;
        const m = { x: (screen[i].x + screen[i + 1].x) / 2, y: (screen[i].y + screen[i + 1].y) / 2 };
        const horizontal = Math.abs(p.y - q.y) < 1e-6;
        items.push(
          <rect
            key={`seg${i}`}
            data-handle={`seg:${i}`}
            x={m.x - r * 1.1}
            y={m.y - r * 1.1}
            width={r * 2.2}
            height={r * 2.2}
            rx={r * 0.6}
            fill="#fff"
            stroke={ACCENT}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            style={{ cursor: 'move' }}
          >
            <title>{`Drag to move this ${horizontal ? 'east-west' : 'north-south'} segment`}</title>
          </rect>,
        );
      });
    } else {
      const wpCount = selEdge.waypoints?.length ?? 0;
      for (let i = 0; i < screen.length - 1; i++) {
        const m = { x: (screen[i].x + screen[i + 1].x) / 2, y: (screen[i].y + screen[i + 1].y) / 2 };
        items.push(
          <circle key={`add${i}`} data-handle={`wpadd:${i}`} cx={m.x} cy={m.y} r={r * 0.75} fill={ACCENT} fillOpacity={0.35} stroke="#fff" strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ cursor: 'copy' }}>
            <title>Drag to add a bend</title>
          </circle>,
        );
      }
      for (let i = 0; i < wpCount; i++) {
        const s = screen[i + 1];
        items.push(
          <circle key={`wp${i}`} data-handle={`wp:${i}`} cx={s.x} cy={s.y} r={r} fill="#fff" stroke={ACCENT} strokeWidth={1.5} vectorEffect="non-scaling-stroke" style={{ cursor: 'move' }}>
            <title>Drag to move, double-click to remove</title>
          </circle>,
        );
      }
    }
    const endHandle = (key: 'edge-from' | 'edge-to', s: Pt) => (
      <circle key={key} data-handle={key} cx={s.x} cy={s.y} r={r} fill={ACCENT} stroke="#fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" style={{ cursor: 'grab' }}>
        <title>Drag onto a node side to re-attach</title>
      </circle>
    );
    items.push(endHandle('edge-from', screen[0]), endHandle('edge-to', screen[screen.length - 1]));
    edgeHandles = <g>{items}</g>;
  }

  // ----- drag previews -----
  let preview = null;
  if (drag?.type === 'connect') {
    const from = nodeById.get(drag.from);
    const target = drag.target && drag.target !== drag.from ? nodeById.get(drag.target) : undefined;
    if (from) {
      const inferred = inferRoute(drag.trail, from, drag.fromSide, target ?? null);
      const style = props.newEdgeStyle ?? {};
      const routing = style.routing ?? 'orthogonal';
      let d: string;
      if (target) {
        d = edgeGeometry({ id: '_preview', from: from.id, to: target.id, color: '', width: 2, routing, rounded: style.rounded, ...inferred }, from, target, proj).d;
      } else {
        const pts = previewRoute(from, inferred, drag.cursor);
        const dir = { x: 0, y: 0 };
        d = edgePathD({ pts, zs: pts.map(() => from.z), from: { side: 'n', t: 0 }, to: { side: 'n', t: 0 }, aDir: dir, bDir: dir }, 'orthogonal', style.rounded ?? true, proj);
      }
      preview = (
        <g pointerEvents="none">
          {target && (
            <polygon
              points={pointsAttr(footprint(target).map((q) => proj.project(q.x, q.y, target.z)))}
              fill="rgba(37,99,235,0.12)"
              stroke={ACCENT}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          )}
          <path d={d} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeDasharray="7 5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" markerEnd={`url(#${idPrefix}-preview-arrow)`} />
        </g>
      );
    }
  } else if (drag?.type === 'edgeEnd') {
    const edge = edgeById.get(drag.edgeId);
    const ends = edge && edgeEnds(edge);
    if (edge && ends) {
      const { screen } = edgeGeometry(edge, ends[0], ends[1], proj);
      const fixed = drag.end === 'from' ? screen[screen.length - 1] : screen[0];
      const target = drag.target ? nodeById.get(drag.target) : undefined;
      preview = (
        <g pointerEvents="none">
          {target && (
            <polygon points={pointsAttr(footprint(target).map((q) => proj.project(q.x, q.y, target.z)))} fill="rgba(37,99,235,0.12)" stroke={ACCENT} strokeWidth={2} vectorEffect="non-scaling-stroke" />
          )}
          <line x1={fixed.x} y1={fixed.y} x2={drag.cursor.x} y2={drag.cursor.y} stroke={ACCENT} strokeWidth={2} strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
        </g>
      );
    }
  } else if (drag?.type === 'marquee') {
    preview = (
      <rect
        x={Math.min(drag.start.x, drag.cur.x)}
        y={Math.min(drag.start.y, drag.cur.y)}
        width={Math.abs(drag.cur.x - drag.start.x)}
        height={Math.abs(drag.cur.y - drag.start.y)}
        fill="rgba(37,99,235,0.08)"
        stroke={ACCENT}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />
    );
  }

  const hoverNode = hover && tool === 'connect' && !drag ? nodeById.get(hover) : undefined;

  const cursor = drag?.type === 'pan' && drag.moved ? 'grabbing' : spaceDown ? 'grab' : tool === 'connect' ? 'crosshair' : 'default';

  return (
    <svg
      ref={setSvg}
      className="isd-canvas"
      tabIndex={0}
      style={{ cursor, touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setDrag(null)}
      onDoubleClick={onDoubleClick}
      onContextMenu={(e) => e.preventDefault()}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes(DRAG_MIME)) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }
      }}
      onDrop={(e) => {
        const payload = e.dataTransfer.getData(DRAG_MIME);
        if (!payload) return;
        e.preventDefault();
        props.onDropPayload?.(payload, toWorld(e.clientX, e.clientY));
      }}
    >
      <defs data-noexport="">
        <marker id={`${idPrefix}-preview-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#2563eb" />
        </marker>
      </defs>
      <g data-camera="" transform={`translate(${camera.x} ${camera.y}) scale(${camera.zoom})`}>
        {grid}
        <g data-scene="">
          <SceneContent diagram={diagram} proj={proj} idPrefix={idPrefix} selectedEdges={selectedSet} animate={animate} />
        </g>
        <g data-noexport="">
          {hoverNode && (
            <g>
              <polygon
                points={pointsAttr(footprint(hoverNode).map((q) => proj.project(q.x, q.y, hoverNode.z)))}
                fill="rgba(37,99,235,0.12)"
                stroke={ACCENT}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
              {sideHandles(hoverNode)}
            </g>
          )}
          {drag?.type === 'move' && drag.dropTarget && nodeById.get(drag.dropTarget) && (
            <polygon
              points={pointsAttr(footprint(nodeById.get(drag.dropTarget)!).map((q) => proj.project(q.x, q.y, nodeById.get(drag.dropTarget!)!.z)))}
              fill="rgba(37,99,235,0.08)"
              stroke={ACCENT}
              strokeWidth={2.5}
              strokeDasharray="8 5"
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
          )}
          <g pointerEvents="none">{overlay}</g>
          {handles}
          {edgeHandles}
          {preview}
        </g>
      </g>
    </svg>
  );
}

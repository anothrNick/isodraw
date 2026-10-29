import { useEffect, useId, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type Ref } from 'react';
import { Projector, type Pt, center, footprint, isFlat, pointsAttr, rectPoly, snap } from './geometry';
import { SceneContent } from './render';
import type { Camera, Diagram, DiagramNode, Rotation, ViewMode } from './types';

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
  /** Grid snapping step in world units (hold Alt while dragging to disable). */
  snapStep?: number;
  /** Called once before a drag starts mutating the diagram (for undo history). */
  onBeginChange?: () => void;
  onChange?: (d: Diagram) => void;
  onConnect?: (from: string, to: string) => void;
  /** Payload dropped from the palette at the given world point. */
  onDropPayload?: (payload: string, world: Pt) => void;
  svgRef?: Ref<SVGSVGElement>;
}

type Drag =
  | { type: 'pan'; sx: number; sy: number; cam: Camera; moved: boolean }
  | { type: 'move'; start: Pt; origins: Map<string, Pt>; moved: boolean }
  | { type: 'resize'; id: string; fixed: Pt; began: boolean }
  | { type: 'height'; id: string; sy: number; h0: number; began: boolean }
  | { type: 'connect'; from: string; cursor: Pt }
  | { type: 'marquee'; start: Pt; cur: Pt; additive: string[] };

export const DRAG_MIME = 'application/x-isodraw';

function closestAttr(t: EventTarget | null, attr: string): string | null {
  const el = (t as Element | null)?.closest?.(`[${attr}]`);
  return el ? el.getAttribute(attr) : null;
}

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

  const nodeById = useMemo(() => new Map(diagram.nodes.map((n) => [n.id, n])), [diagram.nodes]);

  const updateNodes = (fn: (n: DiagramNode) => DiagramNode) => {
    props.onChange?.({ ...diagram, nodes: diagram.nodes.map(fn) });
  };

  const onPointerDown = (e: RPointerEvent<SVGSVGElement>) => {
    if (e.button === 2) return;
    svgEl.current?.setPointerCapture?.(e.pointerId);
    svgEl.current?.focus?.();
    if (e.button === 1 || spaceDown) {
      setDrag({ type: 'pan', sx: e.clientX, sy: e.clientY, cam: camera, moved: true });
      return;
    }
    const handle = closestAttr(e.target, 'data-handle');
    const nodeId = closestAttr(e.target, 'data-node-id');
    const edgeId = closestAttr(e.target, 'data-edge-id');

    if (handle && !readOnly) {
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
      setDrag({ type: 'connect', from: nodeId, cursor: toScene(e.clientX, e.clientY) });
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
      const origins = new Map<string, Pt>();
      for (const id of nodes) {
        const n = nodeById.get(id);
        if (n && !n.locked) origins.set(id, { x: n.x, y: n.y });
      }
      if (origins.size) setDrag({ type: 'move', start: toWorld(e.clientX, e.clientY), origins, moved: false });
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
      if (tool === 'connect') setHover(closestAttr(e.target, 'data-node-id'));
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
          setDrag({ ...drag, moved: true });
        }
        updateNodes((n) => {
          const o = drag.origins.get(n.id);
          if (!o) return n;
          return { ...n, x: free ? o.x + dx : snap(o.x + dx, snapStep), y: free ? o.y + dy : snap(o.y + dy, snapStep) };
        });
        break;
      }
      case 'resize': {
        const n = nodeById.get(drag.id);
        if (!n) return;
        const w = toWorld(e.clientX, e.clientY, n.z);
        const px = free ? w.x : snap(w.x, snapStep);
        const py = free ? w.y : snap(w.y, snapStep);
        const min = 0.5;
        const x0 = Math.min(px, drag.fixed.x);
        const y0 = Math.min(py, drag.fixed.y);
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
                x: px < drag.fixed.x ? drag.fixed.x - nw : x0,
                y: py < drag.fixed.y ? drag.fixed.y - nd : y0,
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
      case 'connect':
        setDrag({ ...drag, cursor: toScene(e.clientX, e.clientY) });
        setHover(closestAttr(document.elementFromPoint(e.clientX, e.clientY), 'data-node-id'));
        break;
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
      // Pointer capture retargets events, so hit-test manually.
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const target = closestAttr(el, 'data-node-id');
      if (target && target !== drag.from) props.onConnect?.(drag.from, target);
    }
    setDrag(null);
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
  const overlay = selection.nodes.map((id) => {
    const n = nodeById.get(id);
    if (!n) return null;
    const base = footprint(n).map((q) => proj.project(q.x, q.y, n.z));
    const solid = !isFlat(n) && proj.mode === '3d' && n.kind !== 'sphere';
    const top = solid ? footprint(n).map((q) => proj.project(q.x, q.y, n.z + n.h)) : null;
    return (
      <g key={id}>
        <polygon points={pointsAttr(base)} fill="none" stroke="var(--isd-accent, #2563eb)" strokeWidth={1.5} strokeDasharray="5 3" vectorEffect="non-scaling-stroke" />
        {top && n.kind !== 'pyramid' && n.kind !== 'cone' && (
          <polygon points={pointsAttr(top)} fill="none" stroke="var(--isd-accent, #2563eb)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        )}
      </g>
    );
  });

  let handles = null;
  const single = selection.nodes.length === 1 ? nodeById.get(selection.nodes[0]) : undefined;
  if (single && !readOnly && !single.locked && tool === 'select') {
    const corners = rectPoly(single).map((q) => proj.project(q.x, q.y, single.z));
    // Front-most corner is the most convenient to grab.
    let ci = 0;
    corners.forEach((p, i) => {
      if (p.y > corners[ci].y + 0.01 || (Math.abs(p.y - corners[ci].y) < 0.01 && p.x > corners[ci].x)) ci = i;
    });
    const r = 5 / camera.zoom;
    const c = center(single);
    const showHeight = proj.mode === '3d' && !isFlat(single) && single.kind !== 'sphere' && single.kind !== 'image';
    const hp = proj.project(c.x, c.y, single.z + single.h);
    handles = (
      <g>
        <rect
          data-handle={String(ci)}
          x={corners[ci].x - r}
          y={corners[ci].y - r}
          width={r * 2}
          height={r * 2}
          fill="#fff"
          stroke="var(--isd-accent, #2563eb)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          style={{ cursor: 'nwse-resize' }}
        />
        {showHeight && (
          <circle
            data-handle="height"
            cx={hp.x}
            cy={hp.y - 14 / camera.zoom}
            r={r}
            fill="var(--isd-accent, #2563eb)"
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

  let preview = null;
  if (drag?.type === 'connect') {
    const a = nodeById.get(drag.from);
    if (a) {
      const c = center(a);
      const p = proj.project(c.x, c.y, a.z);
      preview = (
        <line x1={p.x} y1={p.y} x2={drag.cursor.x} y2={drag.cursor.y} stroke="var(--isd-accent, #2563eb)" strokeWidth={2} strokeDasharray="6 4" vectorEffect="non-scaling-stroke" pointerEvents="none" />
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
        stroke="var(--isd-accent, #2563eb)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />
    );
  }

  const hoverNode = hover && tool === 'connect' ? nodeById.get(hover) : undefined;

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
      <g data-camera="" transform={`translate(${camera.x} ${camera.y}) scale(${camera.zoom})`}>
        {grid}
        <g data-scene="">
          <SceneContent diagram={diagram} proj={proj} idPrefix={idPrefix} selectedEdges={selectedSet} />
        </g>
        <g data-noexport="">
          {hoverNode && (
            <polygon
              points={pointsAttr(footprint(hoverNode).map((q) => proj.project(q.x, q.y, hoverNode.z)))}
              fill="rgba(37,99,235,0.12)"
              stroke="var(--isd-accent, #2563eb)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
          )}
          <g pointerEvents="none">{overlay}</g>
          {handles}
          {preview}
        </g>
      </g>
    </svg>
  );
}

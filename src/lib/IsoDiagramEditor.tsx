import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as RKeyboardEvent } from 'react';
import { DRAG_MIME, IsoCanvas, type Selection, type Tool } from './IsoCanvas';
import { boundsOf, containerOf, descendantsOf, isContainer } from './containers';
import { exportDocsMarkdown, hasDoc, sameTarget, targetKey, withDoc } from './docs';
import { exportJson, exportPng, exportSvg, downloadBlob, readFileAsDataUrl } from './export';
import { Projector, type Pt, footprint, isFlat, shade, uid } from './geometry';
import { endMarkerOf, lineStyleOf, startMarkerOf } from './routing';
import { CANVAS_BG, ThemeContext, useResolvedTheme, type Theme } from './theme';
import { loadAwsIconLibrary, loadAzureIconLibrary, loadGcpIconLibrary } from './icons';
import { importTerraform, isTerraformJson } from './terraform';
import { ShapePreview } from './render';
import { EDGE_STYLE_KEYS, KIND_NAMES, SHAPES, SWATCHES, createEdge, createImageNode, createShape, emptyDiagram, parseDiagram } from './shapes';
import type { Camera, Diagram, DiagramEdge, DiagramNode, DocTarget, EdgeAnimation, IconDef, IconLibrary, MarkerKind, Rotation, ShapeKind, ViewMode } from './types';
import { Field, Icon, NumberInput, ToolButton } from './ui';

export interface IsoDiagramEditorProps {
  /** Controlled diagram. Pair with onChange. */
  value?: Diagram;
  /** Initial diagram when uncontrolled. */
  defaultValue?: Diagram;
  onChange?: (d: Diagram) => void;
  /** View for diagrams that do not set one (`diagram.view`). */
  defaultView?: ViewMode;
  /** Extra icon libraries to show in the palette. */
  iconLibraries?: IconLibrary[];
  /** Offer the AWS architecture icons, loaded from the jsDelivr CDN (default true). */
  awsIcons?: boolean;
  /** Offer the Google Cloud icons, loaded from the jsDelivr CDN when the tab is first opened (default true). */
  gcpIcons?: boolean;
  /** Offer Microsoft's Azure architecture icons, loaded from the jsDelivr CDN when the tab is first opened (default true). */
  azureIcons?: boolean;
  /** Icons the user imported; persisted by the host if desired. */
  userIcons?: IconDef[];
  onUserIconsChange?: (icons: IconDef[]) => void;
  readOnly?: boolean;
  /** When to show doc markers on documented items (default: on hover or selection). */
  docBadges?: 'hover' | 'always' | 'never';
  /** Color theme. Defaults to the enclosing IsoDraw component's theme, or light. */
  theme?: Theme;
  className?: string;
  style?: React.CSSProperties;
}

interface History {
  d: Diagram;
  past: Diagram[];
  future: Diagram[];
}

// Tiptap is large: load the docs editor only when someone opens it.
const DocsPanel = lazy(() => import('./DocsPanel'));

const HISTORY_LIMIT = 200;

/** Most icons the palette lists at once; images load lazily as they scroll into view. */
const ICON_LIMIT = 1000;

type CloudId = 'aws' | 'gcp' | 'azure';
type CloudLib = { status: 'loading' | 'ready' | 'error'; lib?: IconLibrary; error?: string };
/** Built-in cloud icon sets, in palette tab order. */
const CLOUDS: { id: CloudId; name: string; load: () => Promise<IconLibrary> }[] = [
  { id: 'aws', name: 'AWS', load: () => loadAwsIconLibrary() },
  { id: 'gcp', name: 'GCP', load: () => loadGcpIconLibrary() },
  { id: 'azure', name: 'Azure', load: () => loadAzureIconLibrary() },
];

/** Side panel widths. Today's sizes are the minimums; dragging a panel's inner border widens it. */
type Panel = 'palette' | 'inspector' | 'docs';
const PANEL_MIN: Record<Panel, number> = { palette: 260, inspector: 260, docs: 440 };
const PANEL_WIDTHS_KEY = 'isodraw:panel-widths';
/** The canvas always keeps at least this much room. */
const MIN_STAGE = 240;

function loadPanelWidths(): Record<Panel, number> {
  try {
    const saved = JSON.parse(localStorage.getItem(PANEL_WIDTHS_KEY) ?? '{}') as Partial<Record<Panel, number>>;
    const w = { ...PANEL_MIN };
    for (const k of Object.keys(PANEL_MIN) as Panel[]) {
      if (typeof saved[k] === 'number') w[k] = Math.max(PANEL_MIN[k], saved[k]!);
    }
    return w;
  } catch {
    return { ...PANEL_MIN };
  }
}
const COMPACT_WIDTH = 1000;
const NO_SELECTION: Selection = { nodes: [], edges: [] };

interface PalettePayload {
  type: 'shape' | 'icon';
  kind?: ShapeKind;
  src?: string;
  name?: string;
}

export function IsoDiagramEditor(props: IsoDiagramEditorProps) {
  const { readOnly, awsIcons = true, gcpIcons = true, azureIcons = true } = props;
  const theme = useResolvedTheme(props.theme);
  const [hist, setHist] = useState<History>(() => ({
    d: props.value ?? props.defaultValue ?? emptyDiagram(),
    past: [],
    future: [],
  }));
  const diagram = hist.d;
  // The view is a diagram setting, so Edit, View and published pages agree.
  const view: ViewMode = diagram.view ?? props.defaultView ?? '3d';
  const [rotation, setRotation] = useState<Rotation>(0);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [selection, setSelection] = useState<Selection>(NO_SELECTION);
  const [tool, setTool] = useState<Tool>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [animate, setAnimate] = useState(true);
  /** Style for new connections: follows the last connection you styled. */
  const [edgeStyle, setEdgeStyle] = useState<Partial<DiagramEdge>>({});
  const [paletteTab, setPaletteTab] = useState('shapes');
  const [search, setSearch] = useState('');
  const [cloudLibs, setCloudLibs] = useState<Partial<Record<CloudId, CloudLib>>>({});
  const [localIcons, setLocalIcons] = useState<IconDef[]>(props.userIcons ?? []);
  const [toast, setToast] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  /** Narrow editors show the side panels as drawers over the canvas. */
  const [compact, setCompact] = useState(false);
  const [panelW, setPanelW] = useState(loadPanelWidths);
  const [resizing, setResizing] = useState<Panel | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [docsOpen, setDocsOpen] = useState(false);
  /** Item whose @ mention is under the pointer in the docs panel; outlined on the canvas. */
  const [mentionHover, setMentionHover] = useState<DocTarget | null>(null);
  const [docsTarget, setDocsTarget] = useState<DocTarget>({ kind: 'diagram' });
  const svgRef = useRef<SVGSVGElement>(null);
  const clipboard = useRef<{ nodes: DiagramNode[]; edges: DiagramEdge[] } | null>(null);
  const coalesce = useRef<{ key: string; t: number } | null>(null);
  const lastEmitted = useRef<Diagram | null>(null);
  const proj = useMemo(() => new Projector(view, rotation), [view, rotation]);

  const userIcons = props.userIcons ?? localIcons;
  const setUserIcons = (icons: IconDef[]) => {
    setLocalIcons(icons);
    props.onUserIconsChange?.(icons);
  };

  // Sync controlled value.
  useEffect(() => {
    if (props.value && props.value !== lastEmitted.current && props.value !== hist.d) {
      setHist((h) => ({ d: props.value!, past: [...h.past, h.d].slice(-HISTORY_LIMIT), future: [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  useEffect(() => {
    if (hist.d !== props.value) {
      lastEmitted.current = hist.d;
      props.onChange?.(hist.d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hist.d]);

  // Cloud icon sets load the first time their tab is opened (AWS, the default set, loads right away).
  const enabledClouds = CLOUDS.filter((c) => ({ aws: awsIcons, gcp: gcpIcons, azure: azureIcons })[c.id]);
  const loadCloud = useCallback((id: CloudId) => {
    const cloud = CLOUDS.find((c) => c.id === id)!;
    setCloudLibs((cur) => ({ ...cur, [id]: { status: 'loading' } }));
    cloud
      .load()
      .then((lib) => setCloudLibs((cur) => ({ ...cur, [id]: { status: 'ready', lib } })))
      .catch((e) => setCloudLibs((cur) => ({ ...cur, [id]: { status: 'error', error: String(e?.message ?? e) } })));
  }, []);
  useEffect(() => {
    if (awsIcons) loadCloud('aws');
  }, [awsIcons, loadCloud]);
  useEffect(() => {
    const cloud = CLOUDS.find((c) => c.id === paletteTab);
    if (cloud && !cloudLibs[cloud.id]) loadCloud(cloud.id);
  }, [paletteTab, cloudLibs, loadCloud]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  /** Apply a change. `mode: 'replace'` skips history (used mid-drag). */
  const commit = useCallback((next: Diagram | ((d: Diagram) => Diagram), mode: 'push' | 'replace' = 'push', key?: string) => {
    setHist((h) => {
      const d = typeof next === 'function' ? next(h.d) : next;
      if (d === h.d) return h;
      const now = Date.now();
      const sameKey = key && coalesce.current?.key === key && now - coalesce.current.t < 1200;
      coalesce.current = key ? { key, t: now } : null;
      if (mode === 'replace' || sameKey) return { ...h, d };
      return { d, past: [...h.past, h.d].slice(-HISTORY_LIMIT), future: [] };
    });
  }, []);

  const beginChange = useCallback(() => {
    coalesce.current = null;
    setHist((h) => ({ d: h.d, past: [...h.past, h.d].slice(-HISTORY_LIMIT), future: [] }));
  }, []);

  /** Undo and redo restore content but keep the current view setting. */
  const withView = (d: Diagram, from: Diagram): Diagram => (d.view === from.view ? d : { ...d, view: from.view });
  const undo = () =>
    setHist((h) => (h.past.length ? { d: withView(h.past[h.past.length - 1], h.d), past: h.past.slice(0, -1), future: [h.d, ...h.future] } : h));
  const redo = () =>
    setHist((h) => (h.future.length ? { d: withView(h.future[0], h.d), past: [...h.past, h.d], future: h.future.slice(1) } : h));

  // Switch between docked panels and drawers based on the editor's own width.
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const apply = (w: number) =>
      setCompact((was) => {
        const next = w < COMPACT_WIDTH;
        if (next !== was) {
          setPaletteOpen(!next);
          setInspectorOpen(!next);
        }
        return next;
      });
    apply(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => apply(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // In compact mode, open the inspector when something gets selected (unless docs are showing).
  useEffect(() => {
    if (compact && !docsOpen && !readOnly && (selection.nodes.length || selection.edges.length)) setInspectorOpen(true);
  }, [compact, selection]); // eslint-disable-line react-hooks/exhaustive-deps

  // The docs panel follows the selection: one item → its page; nothing → the diagram.
  const selectionTarget: DocTarget | null =
    selection.nodes.length === 1 && !selection.edges.length
      ? { kind: 'node', id: selection.nodes[0] }
      : selection.edges.length === 1 && !selection.nodes.length
        ? { kind: 'edge', id: selection.edges[0] }
        : !selection.nodes.length && !selection.edges.length
          ? { kind: 'diagram' }
          : null;
  useEffect(() => {
    if (!selectionTarget) return;
    setDocsTarget((cur) => (sameTarget(cur, selectionTarget) ? cur : selectionTarget));
    // Viewers: selecting something documented opens its docs.
    if (readOnly && selectionTarget.kind !== 'diagram') {
      const item = selectionTarget.kind === 'node' ? diagram.nodes.find((n) => n.id === selectionTarget.id) : diagram.edges.find((e) => e.id === selectionTarget.id);
      if (hasDoc(item?.doc)) setDocsOpen(true);
    }
  }, [selectionTarget && targetKey(selectionTarget)]); // eslint-disable-line react-hooks/exhaustive-deps

  const openDocs = (t?: DocTarget) => {
    if (t) {
      setDocsTarget(t);
      setSelection(t.kind === 'diagram' ? NO_SELECTION : t.kind === 'node' ? { nodes: [t.id], edges: [] } : { nodes: [], edges: [t.id] });
    }
    setDocsOpen(true);
    if (compact) {
      setInspectorOpen(false);
      setPaletteOpen(false);
    }
  };

  /** Jump to an item from a mention or breadcrumb: select it, center it, show its docs. */
  const navigateTo = (t: DocTarget) => {
    openDocs(t);
    if (t.kind === 'diagram') return;
    let p: Pt | null = null;
    if (t.kind === 'node') {
      const n = diagram.nodes.find((x) => x.id === t.id);
      if (n) p = proj.project(n.x + n.w / 2, n.y + n.d / 2, n.z);
    } else {
      const e = diagram.edges.find((x) => x.id === t.id);
      const a = e && diagram.nodes.find((x) => x.id === e.from);
      const b = e && diagram.nodes.find((x) => x.id === e.to);
      if (a && b) {
        const pa = proj.project(a.x + a.w / 2, a.y + a.d / 2, a.z);
        const pb = proj.project(b.x + b.w / 2, b.y + b.d / 2, b.z);
        p = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
      }
    }
    if (!p) return;
    const { w, h } = stageSize();
    // Keep the item clear of the docs drawer on the right.
    const visibleW = compact ? w : Math.max(w / 2, w - panelW.docs);
    setCamera((c) => ({ ...c, x: visibleW / 2 - p!.x * c.zoom, y: h / 2 - p!.y * c.zoom }));
  };

  const updateDoc = (t: DocTarget, md: string) => commit((d) => withDoc(d, t, md), 'push', `doc:${targetKey(t)}`);

  // ----- camera helpers -----
  const stageSize = () => {
    const r = stageRef.current?.getBoundingClientRect();
    return { w: r?.width ?? 800, h: r?.height ?? 600 };
  };

  const fitTo = useCallback(
    (d: Diagram, p: Projector) => {
      const { w, h } = stageSize();
      const pts = d.nodes.flatMap((n) =>
        footprint(n).flatMap((q) => [p.project(q.x, q.y, n.z), p.project(q.x, q.y, n.z + (isFlat(n) ? 0 : n.h))]),
      );
      if (!pts.length) {
        setCamera({ x: w / 2, y: h / 3, zoom: 1 });
        return;
      }
      const xs = pts.map((q) => q.x);
      const ys = pts.map((q) => q.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys) + 24;
      const zoom = Math.min(1.6, Math.max(0.2, Math.min((w * 0.85) / (maxX - minX || 1), (h * 0.85) / (maxY - minY || 1))));
      setCamera({ zoom, x: w / 2 - ((minX + maxX) / 2) * zoom, y: h / 2 - ((minY + maxY) / 2) * zoom });
    },
    [],
  );

  // Fit once the stage has been laid out.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width < 10 || entry.contentRect.height < 10) return;
      ro.disconnect();
      fitTo(hist.d, proj);
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** World point at the center of the viewport. */
  const viewCenter = (p = proj, cam = camera): Pt => {
    const { w, h } = stageSize();
    return p.unproject((w / 2 - cam.x) / cam.zoom, (h / 2 - cam.y) / cam.zoom);
  };

  const changeProjection = (nextView: ViewMode, nextRot: Rotation) => {
    const c = viewCenter();
    const np = new Projector(nextView, nextRot);
    const s = np.project(c.x, c.y);
    const { w, h } = stageSize();
    setCamera({ ...camera, x: w / 2 - s.x * camera.zoom, y: h / 2 - s.y * camera.zoom });
    // A display setting, not an edit: it stays out of undo history.
    if (nextView !== view) setHist((h) => ({ ...h, d: { ...h.d, view: nextView } }));
    setRotation(nextRot);
  };

  const zoomBy = (k: number) => {
    const { w, h } = stageSize();
    const zoom = Math.min(4, Math.max(0.15, camera.zoom * k));
    const f = zoom / camera.zoom;
    setCamera({ zoom, x: w / 2 - (w / 2 - camera.x) * f, y: h / 2 - (h / 2 - camera.y) * f });
  };

  // ----- editing -----
  const addNode = (node: DiagramNode) => {
    commit((d) => ({ ...d, nodes: [...d.nodes, node] }));
    setSelection({ nodes: [node.id], edges: [] });
    setTool('select');
  };

  const placePayload = (p: PalettePayload, at: Pt) => {
    if (readOnly) return;
    if (compact) setPaletteOpen(false);
    if (p.type === 'shape' && p.kind) addNode(createShape(p.kind, at.x, at.y));
    if (p.type === 'icon' && p.src) addNode(createImageNode(p.src, p.name ?? '', at.x, at.y));
  };

  const updateNode = (id: string, patch: Partial<DiagramNode>, key?: string) =>
    commit((d) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) }), 'push', key && `${id}:${key}`);
  const updateNodes = (ids: string[], patch: Partial<DiagramNode>) =>
    commit((d) => ({ ...d, nodes: d.nodes.map((n) => (ids.includes(n.id) ? { ...n, ...patch } : n)) }));
  const updateEdge = (id: string, patch: Partial<DiagramEdge>, key?: string) => {
    const style = Object.fromEntries(Object.entries(patch).filter(([k]) => (EDGE_STYLE_KEYS as readonly string[]).includes(k)));
    if (Object.keys(style).length) setEdgeStyle((s) => ({ ...s, ...style }));
    commitEdge(id, patch, key);
  };
  const commitEdge = (id: string, patch: Partial<DiagramEdge>, key?: string) =>
    commit((d) => ({ ...d, edges: d.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)) }), 'push', key && `${id}:${key}`);

  /** Selected nodes plus everything inside selected containers. */
  const withContents = (ids: string[]) => new Set([...ids, ...descendantsOf(ids, diagram.nodes)]);

  const deleteSelection = () => {
    if (!selection.nodes.length && !selection.edges.length) return;
    const ns = withContents(selection.nodes);
    const es = new Set(selection.edges);
    commit((d) => ({
      ...d,
      nodes: d.nodes.filter((n) => !ns.has(n.id)),
      edges: d.edges.filter((e) => !es.has(e.id) && !ns.has(e.from) && !ns.has(e.to)),
    }));
    setSelection(NO_SELECTION);
  };

  const copySelection = () => {
    const ns = withContents(selection.nodes);
    clipboard.current = {
      nodes: diagram.nodes.filter((n) => ns.has(n.id)),
      edges: diagram.edges.filter((e) => ns.has(e.from) && ns.has(e.to)),
    };
  };

  const paste = (offset = 1) => {
    const clip = clipboard.current;
    if (!clip?.nodes.length) return;
    const map = new Map<string, string>();
    const nodes = clip.nodes.map((n) => {
      const id = uid('n');
      map.set(n.id, id);
      return { ...n, id, x: n.x + offset, y: n.y + offset };
    });
    const edges = clip.edges.map((e) => ({
      ...e,
      id: uid('e'),
      from: map.get(e.from)!,
      to: map.get(e.to)!,
      waypoints: e.waypoints?.map((w) => ({ x: w.x + offset, y: w.y + offset })),
    }));
    commit((d) => ({ ...d, nodes: [...d.nodes, ...nodes], edges: [...d.edges, ...edges] }));
    // Select only the top-level pasted items; their contents come along.
    const pasted = new Set(nodes.map((n) => n.id));
    const inner = descendantsOf(pasted, nodes);
    setSelection({ nodes: nodes.filter((n) => !inner.has(n.id)).map((n) => n.id), edges: [] });
    clipboard.current = { nodes, edges };
  };

  /** Wrap the selection in a new container area. */
  const groupSelection = () => {
    const picked = diagram.nodes.filter((n) => selection.nodes.includes(n.id));
    if (!picked.length) return;
    const b = boundsOf(picked);
    const parent = containerOf({ ...picked[0], ...b, kind: 'area' }, diagram.nodes, new Set(picked.map((n) => n.id)));
    const group = {
      ...createShape('area', 0, 0, {
        z: Math.min(...picked.map((n) => n.z)),
        color: '#64748b',
        opacity: 0.08,
        dashed: true,
        label: 'Group',
      }),
      // createShape centers on a point; place the bounds exactly.
      ...b,
    };
    commit((d) => ({ ...d, nodes: [group, ...d.nodes] }));
    setSelection({ nodes: [group.id], edges: [] });
    setToast(parent ? `Grouped inside ${parent.label || 'area'}` : 'Grouped');
  };

  /** Remove selected containers but keep their contents. */
  const ungroupSelection = () => {
    const containers = diagram.nodes.filter((n) => selection.nodes.includes(n.id) && isContainer(n));
    if (!containers.length) return;
    const ids = new Set(containers.map((c) => c.id));
    const children = diagram.nodes.filter((n) => !ids.has(n.id) && containers.some((c) => containerOf(n, diagram.nodes)?.id === c.id));
    commit((d) => ({ ...d, nodes: d.nodes.filter((n) => !ids.has(n.id)) }));
    setSelection({ nodes: children.map((n) => n.id), edges: [] });
  };

  const fitContainer = (id: string) => {
    const c = diagram.nodes.find((n) => n.id === id);
    const inner = descendantsOf([id], diagram.nodes);
    const kids = diagram.nodes.filter((n) => inner.has(n.id));
    if (c && kids.length) updateNode(id, boundsOf(kids));
  };

  const reorder = (dir: 'front' | 'back') => {
    const ns = new Set(selection.nodes);
    commit((d) => {
      const sel = d.nodes.filter((n) => ns.has(n.id));
      const rest = d.nodes.filter((n) => !ns.has(n.id));
      return { ...d, nodes: dir === 'front' ? [...rest, ...sel] : [...sel, ...rest] };
    });
  };

  const onKeyDown = (e: RKeyboardEvent) => {
    if ((e.target as HTMLElement).closest('input,textarea,select,[contenteditable="true"]')) return;
    const mod = e.metaKey || e.ctrlKey;
    const k = e.key.toLowerCase();
    if (mod && k === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    } else if (mod && k === 'y') {
      e.preventDefault();
      redo();
    } else if (k === 'd' && !mod) {
      if (docsOpen) setDocsOpen(false);
      else openDocs();
    } else if (mod && k === 'a') {
      e.preventDefault();
      setSelection({ nodes: diagram.nodes.map((n) => n.id), edges: [] });
    } else if (readOnly) {
      return;
    } else if (k === 'delete' || k === 'backspace') {
      e.preventDefault();
      deleteSelection();
    } else if (mod && k === 'c') {
      copySelection();
    } else if (mod && k === 'x') {
      copySelection();
      deleteSelection();
    } else if (mod && k === 'v') {
      paste();
    } else if (mod && k === 'g') {
      e.preventDefault();
      if (e.shiftKey) ungroupSelection();
      else groupSelection();
    } else if (mod && k === 'd') {
      e.preventDefault();
      copySelection();
      paste();
    } else if (k === 'escape') {
      setSelection(NO_SELECTION);
      setTool('select');
    } else if (k === 'v' && !mod) {
      setTool('select');
    } else if (k === 'c' && !mod) {
      setTool('connect');
    } else if (k === 'tab') {
      e.preventDefault();
      changeProjection(view === '3d' ? '2d' : '3d', rotation);
    } else if (k === 'r' && view === '3d') {
      changeProjection(view, (((rotation + (e.shiftKey ? 3 : 1)) % 4) as Rotation));
    } else if (k.startsWith('arrow') && selection.nodes.length) {
      e.preventDefault();
      const step = e.shiftKey ? 1 : 0.5;
      const dirs: Record<string, Pt> = { arrowleft: { x: -1, y: 0 }, arrowright: { x: 1, y: 0 }, arrowup: { x: 0, y: -1 }, arrowdown: { x: 0, y: 1 } };
      const v = dirs[k];
      const ids = withContents(selection.nodes.filter((id) => !diagram.nodes.find((n) => n.id === id)?.locked));
      commit(
        (d) => ({ ...d, nodes: d.nodes.map((n) => (ids.has(n.id) && !n.locked ? { ...n, x: n.x + v.x * step, y: n.y + v.y * step } : n)) }),
        'push',
        'nudge',
      );
    }
  };

  // ----- import / export -----
  const fileInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const doExport = async (fmt: 'json' | 'svg' | 'png' | 'docs') => {
    setExportOpen(false);
    try {
      if (fmt === 'docs') downloadBlob(exportDocsMarkdown(diagram), 'architecture.md', 'text/markdown');
      if (fmt === 'json') downloadBlob(exportJson(diagram), 'diagram.json', 'application/json');
      // Dark-theme ink is light, so dark exports carry the dark canvas behind it.
      const background = theme === 'dark' ? CANVAS_BG.dark : undefined;
      if (fmt === 'svg' && svgRef.current) downloadBlob(await exportSvg(svgRef.current, { background }), 'diagram.svg', 'image/svg+xml');
      if (fmt === 'png' && svgRef.current) downloadBlob(await exportPng(svgRef.current, { background }), 'diagram.png');
    } catch (err) {
      setToast(`Export failed: ${(err as Error).message}`);
    }
  };

  /** Open an IsoDraw diagram, or import Terraform state or plan JSON. */
  const importJsonFile = async (file: File) => {
    try {
      const json: unknown = JSON.parse(await file.text());
      if (isTerraformJson(json)) {
        setToast('Reading Terraform…');
        const { diagram: d, summary } = await importTerraform(json, { gcpIcons: cloudLibs.gcp?.lib });
        const next = { ...d, ...(diagram.view ? { view: diagram.view } : {}) };
        commit(next);
        setSelection(NO_SELECTION);
        fitTo(next, proj);
        setToast(`Imported ${summary.components} components and ${summary.connections} connections from ${summary.resources} Terraform resources`);
        return;
      }
      const d = parseDiagram(json);
      commit(d);
      setSelection(NO_SELECTION);
      fitTo(d, proj);
      setToast(`Imported ${d.nodes.length} nodes`);
    } catch (err) {
      setToast(err instanceof SyntaxError ? `${file.name} is not valid JSON` : (err as Error).message);
    }
  };

  const importImages = async (files: FileList | File[]) => {
    const added: IconDef[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith('image/')) continue;
      added.push({ id: uid('img'), name: f.name.replace(/\.[^.]+$/, ''), src: await readFileAsDataUrl(f), category: 'Imported' });
    }
    if (!added.length) return;
    setUserIcons([...userIcons, ...added]);
    setPaletteTab('mine');
    setToast(`Imported ${added.length} image${added.length > 1 ? 's' : ''}`);
  };

  const addImageUrl = () => {
    const url = window.prompt('Image URL (PNG, SVG, JPG…)');
    if (!url) return;
    const name = url.split('/').pop()?.replace(/\.[^.]+$/, '') || 'Image';
    setUserIcons([...userIcons, { id: uid('img'), name, src: url, category: 'Imported' }]);
    setPaletteTab('mine');
  };

  // ----- palette -----
  const libraries: IconLibrary[] = [
    ...enabledClouds.map((c) => cloudLibs[c.id]?.lib ?? { id: c.id, name: c.name, icons: [] }),
    ...(props.iconLibraries ?? []),
    { id: 'mine', name: 'My images', icons: userIcons },
  ];
  const activeLib = libraries.find((l) => l.id === paletteTab);
  const activeCloud = cloudLibs[paletteTab as CloudId];
  const q = search.trim().toLowerCase();
  const visibleIcons = activeLib
    ? activeLib.icons.filter((i) => !q || i.name.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q))
    : [];
  const grouped = useMemo(() => {
    const m = new Map<string, IconDef[]>();
    for (const i of visibleIcons.slice(0, ICON_LIMIT)) {
      const c = i.category ?? '';
      if (!m.has(c)) m.set(c, []);
      m.get(c)!.push(i);
    }
    return [...m.entries()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLib, q]);

  const dragStart = (p: PalettePayload) => (e: React.DragEvent) => {
    e.dataTransfer.setData(DRAG_MIME, JSON.stringify(p));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // ----- panel resizing -----
  /** Widest a panel may get while leaving the canvas (and the other open panels) room. */
  const maxWidth = (panel: Panel) => {
    const total = rootRef.current?.clientWidth ?? 1200;
    if (panel === 'docs') return Math.max(PANEL_MIN.docs, (stageRef.current?.clientWidth ?? total) - 80);
    const other = panel === 'palette' ? (inspectorOpen ? panelW.inspector : 0) : paletteOpen ? panelW.palette : 0;
    return Math.max(PANEL_MIN[panel], total - other - MIN_STAGE);
  };
  const saveWidths = (w: Record<Panel, number>) => {
    try {
      localStorage.setItem(PANEL_WIDTHS_KEY, JSON.stringify(w));
    } catch {
      /* storage unavailable */
    }
  };
  /** Drag handler for a panel border. `dir` is +1 when dragging right widens the panel, -1 when dragging left does. */
  const startResize = (panel: Panel, dir: 1 | -1) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const handle = e.currentTarget;
    const startX = e.clientX;
    const startW = panelW[panel];
    const max = maxWidth(panel);
    let latest = panelW;
    handle.setPointerCapture(e.pointerId);
    setResizing(panel);
    const move = (ev: PointerEvent) => {
      const w = Math.round(Math.min(max, Math.max(PANEL_MIN[panel], startW + dir * (ev.clientX - startX))));
      setPanelW((cur) => (latest = { ...cur, [panel]: w }));
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      setResizing(null);
      saveWidths(latest);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };
  const resetWidth = (panel: Panel) =>
    setPanelW((cur) => {
      const next = { ...cur, [panel]: PANEL_MIN[panel] };
      saveWidths(next);
      return next;
    });
  const resizer = (panel: Panel, dir: 1 | -1, label: string) =>
    compact ? null : (
      <div
        className={`isd-resizer is-${panel}${resizing === panel ? ' is-active' : ''}`}
        role="separator"
        aria-orientation="vertical"
        aria-label={`Resize ${label}`}
        title="Drag to resize · double-click to reset"
        onPointerDown={startResize(panel, dir)}
        onDoubleClick={() => resetWidth(panel)}
      />
    );

  const selNode = selection.nodes.length === 1 ? diagram.nodes.find((n) => n.id === selection.nodes[0]) : undefined;
  const selEdge = selection.edges.length === 1 && !selection.nodes.length ? diagram.edges.find((e) => e.id === selection.edges[0]) : undefined;

  return (
    <ThemeContext.Provider value={theme}>
    <div
      ref={rootRef}
      data-theme={theme}
      className={`isd-root${compact ? ' is-compact' : ''}${resizing ? ' is-resizing' : ''} ${props.className ?? ''}`}
      style={
        {
          '--isd-palette-w': `${panelW.palette}px`,
          '--isd-inspector-w': `${panelW.inspector}px`,
          '--isd-docs-w': `${panelW.docs}px`,
          ...props.style,
        } as React.CSSProperties
      }
      onKeyDown={onKeyDown}
      onDragOver={(e) => e.dataTransfer.types.includes('Files') && e.preventDefault()}
      onDrop={(e) => {
        if (e.dataTransfer.files.length && !readOnly) {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          const json = files.find((f) => /\.(json|tfstate)$/i.test(f.name));
          if (json) void importJsonFile(json);
          else void importImages(files);
        }
      }}
    >
      {/* ---------- toolbar ---------- */}
      <div className="isd-toolbar-wrap">
      <div className="isd-toolbar">
        {!readOnly && (
          <div className="isd-group">
            <ToolButton icon="panelL" label={paletteOpen ? 'Hide shapes & icons' : 'Show shapes & icons'} active={paletteOpen} onClick={() => setPaletteOpen(!paletteOpen)} />
          </div>
        )}
        <div className="isd-group">
          <ToolButton icon="cube" label="2.5D view (Tab)" active={view === '3d'} onClick={() => changeProjection('3d', rotation)}>
            2.5D
          </ToolButton>
          <ToolButton icon="square" label="Flat view (Tab)" active={view === '2d'} onClick={() => changeProjection('2d', rotation)}>
            2D
          </ToolButton>
        </div>
        <div className="isd-group">
          <ToolButton icon="rotl" label="Rotate left (Shift+R)" disabled={view === '2d'} onClick={() => changeProjection(view, ((rotation + 3) % 4) as Rotation)} />
          <ToolButton icon="rotr" label="Rotate right (R)" disabled={view === '2d'} onClick={() => changeProjection(view, ((rotation + 1) % 4) as Rotation)} />
        </div>
        {!readOnly && (
          <div className="isd-group">
            <ToolButton icon="pointer" label="Select (V)" active={tool === 'select'} onClick={() => setTool('select')} />
            <ToolButton icon="link" label="Connect (C): drag from one node to another" active={tool === 'connect'} onClick={() => setTool('connect')} />
          </div>
        )}
        {!readOnly && (
          <div className="isd-group">
            <ToolButton icon="undo" label="Undo (⌘Z)" disabled={!hist.past.length} onClick={undo} />
            <ToolButton icon="redo" label="Redo (⇧⌘Z)" disabled={!hist.future.length} onClick={redo} />
          </div>
        )}
        <div className="isd-group isd-hide-compact">
          <ToolButton icon="minus" label="Zoom out" onClick={() => zoomBy(1 / 1.25)} />
          <span className="isd-zoom">{Math.round(camera.zoom * 100)}%</span>
          <ToolButton icon="plus" label="Zoom in" onClick={() => zoomBy(1.25)} />
        </div>
        <div className="isd-group">
          <ToolButton icon="fit" label="Fit to content" onClick={() => fitTo(diagram, proj)} />
          <ToolButton icon="grid" label="Toggle grid" active={showGrid} onClick={() => setShowGrid(!showGrid)} />
          <ToolButton icon={animate ? 'pause' : 'play'} label={animate ? 'Pause connection animations' : 'Play connection animations'} onClick={() => setAnimate(!animate)} />
        </div>
        <div className="isd-spacer" />
        {!readOnly && (
          <div className="isd-group">
            <ToolButton icon="upload" label="Open a diagram, or import Terraform state or plan JSON" onClick={() => fileInput.current?.click()}>
              Open
            </ToolButton>
          </div>
        )}
        <div className="isd-group">
          <ToolButton icon="doc" label={docsOpen ? 'Hide docs (D)' : 'Show docs (D)'} active={docsOpen} onClick={() => (docsOpen ? setDocsOpen(false) : openDocs())}>
            Docs
          </ToolButton>
        </div>
        <div className="isd-group">
          <ToolButton icon="download" label="Export" active={exportOpen} onClick={() => setExportOpen(!exportOpen)}>
            Export
          </ToolButton>
        </div>
        {!readOnly && (
          <div className="isd-group">
            <ToolButton icon="panelR" label={inspectorOpen ? 'Hide inspector' : 'Show inspector'} active={inspectorOpen} onClick={() => setInspectorOpen(!inspectorOpen)} />
          </div>
        )}
        <input
          ref={fileInput}
          type="file"
          accept=".json,.tfstate,application/json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importJsonFile(f);
            e.target.value = '';
          }}
        />
        <input
          ref={imageInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) void importImages(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {/* Outside the scrolling toolbar so it is never clipped. */}
      {exportOpen && (
        <div className="isd-menu" onMouseLeave={() => setExportOpen(false)}>
          <button type="button" onClick={() => doExport('png')}>PNG image</button>
          <button type="button" onClick={() => doExport('svg')}>SVG vector</button>
          <button type="button" onClick={() => doExport('json')}>Diagram JSON</button>
          <button type="button" onClick={() => doExport('docs')}>Docs (Markdown)</button>
        </div>
      )}
      </div>

      <div className="isd-body">
        {/* ---------- palette ---------- */}
        {!readOnly && paletteOpen && (
          <aside className="isd-palette">
            {compact && (
              <button type="button" className="isd-drawer-close" aria-label="Close panel" onClick={() => setPaletteOpen(false)}>
                <Icon name="close" />
              </button>
            )}
            <div className="isd-tabs" role="tablist">
              {[{ id: 'shapes', name: 'Shapes' }, ...libraries].map((t) => (
                <button key={t.id} type="button" role="tab" aria-selected={paletteTab === t.id} className={paletteTab === t.id ? 'is-active' : ''} onClick={() => setPaletteTab(t.id)}>
                  {t.name}
                </button>
              ))}
            </div>

            {paletteTab === 'shapes' ? (
              <div className="isd-palette-scroll">
                <div className="isd-shape-grid">
                  {SHAPES.map((s) => (
                    <button
                      key={s.kind}
                      type="button"
                      className="isd-tile"
                      draggable
                      onDragStart={dragStart({ type: 'shape', kind: s.kind })}
                      onClick={() => placePayload({ type: 'shape', kind: s.kind }, viewCenter())}
                      title={`${s.name} — click or drag onto canvas`}
                    >
                      <ShapePreview node={createShape(s.kind, 0, 0, { id: `pv-${s.kind}`, text: 'Aa', fontSize: 1.4 })} />
                      <span>{s.name}</span>
                    </button>
                  ))}
                </div>
                <div className="isd-section-title">Images & logos</div>
                <div className="isd-import-row">
                  <button type="button" className="isd-btn" onClick={() => imageInput.current?.click()}>
                    <Icon name="upload" /> Upload
                  </button>
                  <button type="button" className="isd-btn" onClick={addImageUrl}>
                    <Icon name="link" /> From URL
                  </button>
                </div>
                <p className="isd-hint">Tip: drop image files anywhere on the editor to import them.</p>
              </div>
            ) : (
              <>
                <div className="isd-search">
                  <input className="isd-input" placeholder={`Search ${activeLib?.name ?? ''}…`} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="isd-palette-scroll">
                  {paletteTab === 'mine' && (
                    <div className="isd-import-row">
                      <button type="button" className="isd-btn" onClick={() => imageInput.current?.click()}>
                        <Icon name="upload" /> Upload
                      </button>
                      <button type="button" className="isd-btn" onClick={addImageUrl}>
                        <Icon name="link" /> From URL
                      </button>
                    </div>
                  )}
                  {grouped.map(([cat, icons]) => (
                    <div key={cat}>
                      {cat && <div className="isd-section-title">{cat}</div>}
                      <div className="isd-icon-grid">
                        {icons.map((i) => (
                          <button
                            key={i.id}
                            type="button"
                            className="isd-icon-tile"
                            title={i.name}
                            draggable
                            onDragStart={dragStart({ type: 'icon', src: i.src, name: i.name })}
                            onClick={() => placePayload({ type: 'icon', src: i.src, name: i.name }, viewCenter())}
                          >
                            <img src={i.src} alt="" loading="lazy" draggable={false} />
                            <span>{i.name.replace(/^(Amazon|AWS|Azure|Google Cloud) /, '')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {visibleIcons.length > ICON_LIMIT && <p className="isd-hint">Showing {ICON_LIMIT} of {visibleIcons.length}. Refine your search.</p>}
                  {activeCloud?.status === 'loading' && <p className="isd-hint">Loading {activeLib?.name} icons…</p>}
                  {activeCloud?.status === 'error' && (
                    <div className="isd-hint">
                      <p>Couldn't load {activeLib?.name} icons: {activeCloud.error}</p>
                      <button type="button" className="isd-btn" onClick={() => loadCloud(paletteTab as CloudId)}>
                        Try again
                      </button>
                    </div>
                  )}
                  {!visibleIcons.length && (!activeCloud || activeCloud.status === 'ready') && (
                    <p className="isd-hint">{paletteTab === 'mine' ? 'No images yet. Upload PNG/SVG logos to use them as nodes.' : 'No matches.'}</p>
                  )}
                </div>
              </>
            )}
          </aside>
        )}
        {!readOnly && paletteOpen && resizer('palette', 1, 'shapes panel')}

        {/* ---------- canvas ---------- */}
        <div className="isd-stage" ref={stageRef}>
          <IsoCanvas
            svgRef={svgRef}
            diagram={diagram}
            view={view}
            rotation={rotation}
            camera={camera}
            onCameraChange={setCamera}
            selection={selection}
            onSelectionChange={setSelection}
            tool={tool}
            readOnly={readOnly}
            showGrid={showGrid}
            animate={animate}
            onOpenDocs={openDocs}
            focus={docsOpen ? mentionHover : null}
            showDocBadges={props.docBadges}
            newEdgeStyle={{ routing: 'orthogonal', rounded: true, ...edgeStyle }}
            onBeginChange={beginChange}
            onChange={(d) => commit(d, 'replace')}
            onConnect={(from, to, route) => {
              const edge = createEdge(from, to, { ...edgeStyle, ...route });
              commit((d) => ({ ...d, edges: [...d.edges, edge] }));
              setSelection({ nodes: [], edges: [edge.id] });
            }}
            onDropPayload={(payload, at) => {
              try {
                placePayload(JSON.parse(payload) as PalettePayload, at);
              } catch {
                /* ignore foreign drops */
              }
            }}
          />
          <div className="isd-status">
            {view === '3d' ? `2.5D · ${['N', 'E', 'S', 'W'][rotation]}` : 'Flat'} · {diagram.nodes.length} nodes · {diagram.edges.length} connections
          </div>
          {toast && <div className="isd-toast">{toast}</div>}
          {docsOpen && resizer('docs', -1, 'docs panel')}
          {docsOpen && (
            <Suspense fallback={<aside className="isd-docs isd-docs-loading">Loading editor…</aside>}>
              <DocsPanel
                target={docsTarget}
                diagram={diagram}
                readOnly={readOnly}
                onChange={updateDoc}
                onNavigate={navigateTo}
                onMentionHover={setMentionHover}
                onClose={() => setDocsOpen(false)}
                onExport={() => void doExport('docs')}
              />
            </Suspense>
          )}
        </div>

        {/* ---------- inspector ---------- */}
        {!readOnly && inspectorOpen && resizer('inspector', -1, 'properties panel')}
        {!readOnly && inspectorOpen && (
          <aside className="isd-inspector">
            {compact && (
              <button type="button" className="isd-drawer-close" aria-label="Close inspector" onClick={() => setInspectorOpen(false)}>
                <Icon name="close" />
              </button>
            )}
            {selNode ? (
              <NodeInspector
                node={selNode}
                onOpenDocs={() => openDocs({ kind: 'node', id: selNode.id })}
                parent={containerOf(selNode, diagram.nodes)}
                contents={isContainer(selNode) ? descendantsOf([selNode.id], diagram.nodes).size : 0}
                onSelectNodes={(ids) => setSelection({ nodes: ids, edges: [] })}
                onSelectContents={() =>
                  setSelection({ nodes: diagram.nodes.filter((n) => containerOf(n, diagram.nodes)?.id === selNode.id).map((n) => n.id), edges: [] })
                }
                onFitContents={() => fitContainer(selNode.id)}
                onUngroup={ungroupSelection}
                onChange={(patch, key) => updateNode(selNode.id, patch, key)}
                onDelete={deleteSelection}
                onDuplicate={() => {
                  copySelection();
                  paste();
                }}
                onReorder={reorder}
              />
            ) : selEdge ? (
              <EdgeInspector
                edge={selEdge}
                onOpenDocs={() => openDocs({ kind: 'edge', id: selEdge.id })}
                onChange={(patch, key) => updateEdge(selEdge.id, patch, key)}
                onRoute={(patch) => commitEdge(selEdge.id, patch)}
                onDelete={deleteSelection}
              />
            ) : selection.nodes.length > 1 ? (
              <div className="isd-panel">
                <h3>{selection.nodes.length} nodes selected</h3>
                <Field label="Color">
                  <Swatches value="" onChange={(color) => updateNodes(selection.nodes, { color })} />
                </Field>
                <Field label="Elevation">
                  <NumberInput value={diagram.nodes.find((n) => n.id === selection.nodes[0])?.z ?? 0} onChange={(z) => updateNodes(selection.nodes, { z })} />
                </Field>
                <button type="button" className="isd-btn" onClick={groupSelection} title="Wrap the selection in a new area (⌘G)">
                  <Icon name="group" /> Group into area
                </button>
                <div className="isd-row">
                  <button type="button" className="isd-btn" onClick={() => { copySelection(); paste(); }}>
                    <Icon name="copy" /> Duplicate
                  </button>
                  <button type="button" className="isd-btn is-danger" onClick={deleteSelection}>
                    <Icon name="trash" /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="isd-panel">
                <h3>Diagram</h3>
                <p className="isd-hint">Click a shape or icon to add it, or drag it onto the canvas. Select a node to edit it.</p>
                <DocsButton has={hasDoc(diagram.doc)} label="diagram overview" onClick={() => openDocs({ kind: 'diagram' })} />
                <dl className="isd-keys">
                  <dt>Drag empty space</dt><dd>Pan</dd>
                  <dt>Scroll / pinch</dt><dd>Zoom</dd>
                  <dt>Shift + drag</dt><dd>Box select</dd>
                  <dt>C / V</dt><dd>Connect / Select tool</dd>
                  <dt>Tab</dt><dd>Toggle 2D / 2.5D</dd>
                  <dt>R / Shift+R</dt><dd>Rotate view</dd>
                  <dt>Arrows</dt><dd>Nudge</dd>
                  <dt>Alt + drag</dt><dd>Move without snapping</dd>
                  <dt>⌘D / ⌘C / ⌘V</dt><dd>Duplicate / copy / paste</dd>
                  <dt>⌘G / ⇧⌘G</dt><dd>Group into area / ungroup</dd>
                  <dt>D / double-click</dt><dd>Open docs</dd>
                  <dt>⌘Z / ⇧⌘Z</dt><dd>Undo / redo</dd>
                </dl>
                {diagram.nodes.length > 0 && (
                  <button
                    type="button"
                    className="isd-btn is-danger"
                    onClick={() => {
                      if (window.confirm('Clear the whole diagram?')) commit(emptyDiagram());
                    }}
                  >
                    <Icon name="trash" /> Clear diagram
                  </button>
                )}
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
    </ThemeContext.Provider>
  );
}

// ---------- inspectors ----------

function DocsButton({ has, label, onClick }: { has: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" className={`isd-btn isd-docs-btn${has ? ' has-doc' : ''}`} onClick={onClick} title="Open the docs panel (D)">
      <Icon name="doc" /> {has ? `Open ${label}` : `Add ${label}`}
    </button>
  );
}

function Swatches({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="isd-swatches">
      {SWATCHES.map((c) => (
        <button
          key={c}
          type="button"
          className={`isd-swatch${c.toLowerCase() === value.toLowerCase() ? ' is-active' : ''}`}
          style={{ background: c }}
          title={c}
          onClick={() => onChange(c)}
        />
      ))}
      <input type="color" className="isd-color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#4f8cf7'} onChange={(e) => onChange(e.target.value)} title="Custom color" />
    </div>
  );
}


function NodeInspector({
  node,
  onOpenDocs,
  parent,
  contents,
  onChange,
  onDelete,
  onDuplicate,
  onReorder,
  onSelectNodes,
  onSelectContents,
  onFitContents,
  onUngroup,
}: {
  node: DiagramNode;
  onOpenDocs: () => void;
  /** Container this node sits in, if any. */
  parent?: DiagramNode;
  /** Number of items inside this node (containers only). */
  contents: number;
  onChange: (patch: Partial<DiagramNode>, key?: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReorder: (dir: 'front' | 'back') => void;
  onSelectNodes: (ids: string[]) => void;
  onSelectContents: () => void;
  onFitContents: () => void;
  onUngroup: () => void;
}) {
  const flat = isFlat(node);
  const isArea = node.kind === 'area' || node.kind === 'circleArea';
  const solidKinds: ShapeKind[] = ['block', 'cylinder', 'hexagon', 'pyramid', 'cone', 'sphere'];
  return (
    <div className="isd-panel">
      <h3>{KIND_NAMES[node.kind]}</h3>
      <DocsButton has={hasDoc(node.doc)} label={isContainer(node) ? 'area docs' : 'docs'} onClick={onOpenDocs} />
      {parent && (
        <button type="button" className="isd-breadcrumb" onClick={() => onSelectNodes([parent.id])} title="Select the containing area">
          Inside <strong>{parent.label || KIND_NAMES[parent.kind]}</strong>
        </button>
      )}
      {isContainer(node) && (
        <div className="isd-container-box">
          <span>
            {contents ? `Contains ${contents} item${contents === 1 ? '' : 's'} — they move with this area.` : 'Drop shapes inside to group them with this area.'}
          </span>
          {contents > 0 && (
            <div className="isd-container-actions">
              <button type="button" className="isd-btn is-wide" onClick={onSelectContents}>
                Select contents
              </button>
              <button type="button" className="isd-btn" onClick={onFitContents} title="Resize to wrap the contents">
                Fit to contents
              </button>
              <button type="button" className="isd-btn" onClick={onUngroup} title="Remove the area, keep its contents (⇧⌘G)">
                Ungroup
              </button>
            </div>
          )}
        </div>
      )}
      {node.kind === 'text' ? (
        <Field label="Text">
          <textarea className="isd-input" rows={3} value={node.text ?? ''} onChange={(e) => onChange({ text: e.target.value }, 'text')} />
        </Field>
      ) : (
        <Field label="Label">
          <input className="isd-input" value={node.label ?? ''} placeholder="Add a label" onChange={(e) => onChange({ label: e.target.value }, 'label')} />
        </Field>
      )}
      {solidKinds.includes(node.kind) && (
        <Field label="Shape">
          <select className="isd-input" value={node.kind} onChange={(e) => onChange({ kind: e.target.value as ShapeKind })}>
            {solidKinds.map((k) => (
              <option key={k} value={k}>
                {KIND_NAMES[k]}
              </option>
            ))}
          </select>
        </Field>
      )}
      {node.kind !== 'image' || node.imageStyle === 'tile' ? (
        <Field label={node.kind === 'image' ? 'Tile color' : 'Color'}>
          <Swatches value={node.color} onChange={(color) => onChange({ color })} />
        </Field>
      ) : null}
      {node.kind === 'image' && (
        <>
          <Field label="Style">
            <select className="isd-input" value={node.imageStyle ?? 'tile'} onChange={(e) => onChange({ imageStyle: e.target.value as DiagramNode['imageStyle'] })}>
              <option value="tile">Tile (icon on a block)</option>
              <option value="flat">Flat (on the ground)</option>
              <option value="standing">Standing (billboard)</option>
            </select>
          </Field>
          <div className="isd-image-preview">
            <img src={node.src} alt="" />
          </div>
        </>
      )}
      <div className="isd-grid2">
        <Field label="X">
          <NumberInput value={node.x} onChange={(x) => onChange({ x }, 'x')} />
        </Field>
        <Field label="Y">
          <NumberInput value={node.y} onChange={(y) => onChange({ y }, 'y')} />
        </Field>
        <Field label="Width">
          <NumberInput value={node.w} min={0.5} onChange={(w) => onChange({ w }, 'w')} />
        </Field>
        <Field label="Depth">
          <NumberInput value={node.d} min={0.5} onChange={(d) => onChange({ d }, 'd')} />
        </Field>
        {!flat && node.kind !== 'sphere' && (
          <Field label="Height">
            <NumberInput value={node.h} min={0.1} step={0.25} onChange={(h) => onChange({ h }, 'h')} />
          </Field>
        )}
        <Field label="Elevation">
          <NumberInput value={node.z} step={0.25} onChange={(z) => onChange({ z }, 'z')} />
        </Field>
      </div>
      {node.kind === 'text' && (
        <Field label="Font size">
          <NumberInput value={node.fontSize ?? 0.7} min={0.2} step={0.1} onChange={(fontSize) => onChange({ fontSize }, 'fs')} />
        </Field>
      )}
      <Field label={isArea ? 'Fill opacity' : 'Opacity'}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={node.opacity ?? (isArea ? 0.18 : 1)}
          onChange={(e) => onChange({ opacity: parseFloat(e.target.value) }, 'opacity')}
        />
      </Field>
      {isArea && (
        <label className="isd-check">
          <input type="checkbox" checked={!!node.dashed} onChange={(e) => onChange({ dashed: e.target.checked })} /> Dashed border
        </label>
      )}
      {node.kind !== 'text' && (
        <Field label="Label color">
          <input type="color" className="isd-color" value={node.labelColor ?? '#1f2937'} onChange={(e) => onChange({ labelColor: e.target.value }, 'lc')} />
        </Field>
      )}
      <label className="isd-check">
        <input type="checkbox" checked={!!node.locked} onChange={(e) => onChange({ locked: e.target.checked })} /> Lock position
      </label>
      <div className="isd-row">
        <button type="button" className="isd-btn" onClick={() => onReorder('back')} title="Draw first among flat items">
          To back
        </button>
        <button type="button" className="isd-btn" onClick={() => onReorder('front')}>
          To front
        </button>
      </div>
      <div className="isd-row">
        <button type="button" className="isd-btn" onClick={onDuplicate}>
          <Icon name="copy" /> Duplicate
        </button>
        <button type="button" className="isd-btn is-danger" onClick={onDelete} title={contents ? 'Deletes the area and everything inside it' : undefined}>
          <Icon name="trash" /> {contents ? 'Delete all' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="isd-segmented" role="radiogroup">
      {options.map(([v, label]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} className={value === v ? 'is-active' : ''} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  );
}

const MARKERS: [MarkerKind, string][] = [
  ['none', 'None'],
  ['arrow', 'Arrow'],
  ['open', 'Open arrow'],
  ['circle', 'Circle'],
  ['diamond', 'Diamond'],
];

const ANIMATIONS: [EdgeAnimation, string][] = [
  ['none', 'None'],
  ['flow', 'Flow (marching dashes)'],
  ['packets', 'Data packets'],
  ['pulse', 'Pulse (travelling)'],
  ['glow', 'Glow (breathing)'],
];

function EdgeInspector({
  edge,
  onOpenDocs,
  onChange,
  onRoute,
  onDelete,
}: {
  edge: DiagramEdge;
  onOpenDocs: () => void;
  onChange: (patch: Partial<DiagramEdge>, key?: string) => void;
  /** Route changes (anchors, bends) that should not become the default style. */
  onRoute: (patch: Partial<DiagramEdge>) => void;
  onDelete: () => void;
}) {
  const animation = edge.animation ?? 'none';
  const custom = !!(edge.fromAnchor || edge.toAnchor || edge.waypoints?.length);
  return (
    <div className="isd-panel">
      <h3>Connection</h3>
      <DocsButton has={hasDoc(edge.doc)} label="docs" onClick={onOpenDocs} />
      <Field label="Label">
        <input className="isd-input" value={edge.label ?? ''} placeholder="e.g. HTTPS" onChange={(e) => onChange({ label: e.target.value }, 'label')} />
      </Field>
      <Field label="Color">
        <Swatches value={edge.color} onChange={(color) => onChange({ color })} />
      </Field>

      <div className="isd-section-title">Path</div>
      <Segmented
        value={edge.routing}
        options={[
          ['orthogonal', 'Right-angle'],
          ['straight', 'Straight'],
          ['curved', 'Curved'],
        ]}
        onChange={(routing) => onChange({ routing })}
      />
      {edge.routing === 'orthogonal' && (
        <label className="isd-check">
          <input type="checkbox" checked={!!edge.rounded} onChange={(e) => onChange({ rounded: e.target.checked })} /> Rounded corners
        </label>
      )}
      <p className="isd-hint">
        {edge.routing === 'orthogonal'
          ? 'Drag the square handles to move segments. Drag an end dot onto any side of a node to re-attach it.'
          : 'Drag the small dots to add bends; double-click a bend to remove it. Drag an end dot to re-attach.'}
      </p>
      <div className="isd-row">
        <button type="button" className="isd-btn" disabled={!custom} onClick={() => onRoute({ fromAnchor: undefined, toAnchor: undefined, waypoints: undefined })}>
          Reset route
        </button>
        <button type="button" className="isd-btn" onClick={() => onRoute({ from: edge.to, to: edge.from, fromAnchor: edge.toAnchor, toAnchor: edge.fromAnchor, waypoints: edge.waypoints?.slice().reverse() })}>
          Reverse
        </button>
      </div>

      <div className="isd-section-title">Line</div>
      <Segmented
        value={lineStyleOf(edge)}
        options={[
          ['solid', 'Solid'],
          ['dashed', 'Dashed'],
          ['dotted', 'Dotted'],
        ]}
        onChange={(lineStyle) => onChange({ lineStyle, dashed: undefined })}
      />
      <Field label="Width">
        <input type="range" min={1} max={8} step={0.5} value={edge.width} onChange={(e) => onChange({ width: parseFloat(e.target.value) }, 'w')} />
      </Field>
      <div className="isd-grid2">
        <Field label="Start">
          <select className="isd-input" value={startMarkerOf(edge)} onChange={(e) => onChange({ startMarker: e.target.value as MarkerKind, arrowStart: undefined })}>
            {MARKERS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="End">
          <select className="isd-input" value={endMarkerOf(edge)} onChange={(e) => onChange({ endMarker: e.target.value as MarkerKind, arrowEnd: undefined })}>
            {MARKERS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="isd-section-title">Animation</div>
      <select className="isd-input" value={animation} onChange={(e) => onChange({ animation: e.target.value as EdgeAnimation })}>
        {ANIMATIONS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {animation !== 'none' && (
        <>
          {animation !== 'glow' && (
            <Segmented
              value={edge.animationDirection ?? 'forward'}
              options={
                animation === 'flow'
                  ? [
                      ['forward', 'Forward'],
                      ['reverse', 'Reverse'],
                    ]
                  : [
                      ['forward', 'Forward'],
                      ['reverse', 'Reverse'],
                      ['both', 'Both ways'],
                    ]
              }
              onChange={(animationDirection) => onChange({ animationDirection })}
            />
          )}
          <Field label={`Speed · ${(edge.animationSpeed ?? 1).toFixed(2).replace(/\.?0+$/, '')}×`}>
            <input type="range" min={0.25} max={3} step={0.25} value={edge.animationSpeed ?? 1} onChange={(e) => onChange({ animationSpeed: parseFloat(e.target.value) }, 'speed')} />
          </Field>
          {animation !== 'flow' && animation !== 'glow' && (
            <Field label="Highlight color">
              <input
                type="color"
                className="isd-color"
                value={edge.animationColor ?? shade(edge.color, 1.55)}
                onChange={(e) => onChange({ animationColor: e.target.value }, 'ac')}
              />
            </Field>
          )}
        </>
      )}

      <div className="isd-row">
        <button type="button" className="isd-btn is-danger" onClick={onDelete}>
          <Icon name="trash" /> Delete
        </button>
      </div>
    </div>
  );
}

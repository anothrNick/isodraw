import { Fragment, Suspense, lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as RKeyboardEvent } from 'react';
import { DRAG_MIME, IsoCanvas, type Selection, type Tool } from './IsoCanvas';
import { boundsOf, containerOf, descendantsOf, isContainer } from './containers';
import { exportDocsMarkdown, nodeTitle, sameTarget, targetKey, withDoc } from './docs';
import { exportJson, exportPng, exportSvg, downloadBlob, readFileAsDataUrl } from './export';
import { Projector, type Pt, footprint, isFlat, shade, uid } from './geometry';
import { endMarkerOf, lineStyleOf, startMarkerOf } from './routing';
import { CANVAS_BG, ThemeContext, useResolvedTheme, type Theme } from './theme';
import { iconColor, loadAwsIconLibrary, loadAzureIconLibrary, loadGcpIconLibrary, loadLucideIconLibrary, withIconColor } from './icons';
import { fitIsoIcon, imageHref, isIsoIcon, isoIconLibrary } from './isoIcons';
import { importTerraform, isTerraformJson } from './terraform';
import { layoutLevel, markMoved, movesItem } from './layout';
import { canHaveDetail, levelAt, levelKey, levelNodes, liftEmbeds, sameLevel, validLevel, withLevel, type LevelPath } from './levels';
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
  /** Offer the Lucide icons, loaded from the jsDelivr CDN when the tab is first opened (default true). */
  lucideIcons?: boolean;
  /** Icons the user imported; persisted by the host if desired. */
  userIcons?: IconDef[];
  onUserIconsChange?: (icons: IconDef[]) => void;
  readOnly?: boolean;
  /** When to show doc markers on documented items (default: on hover or selection). */
  docBadges?: 'hover' | 'always' | 'never';
  /**
   * Show the toolbar's Docs button (default true). Docs stay reachable from
   * the sidebar's Docs tab and the D key; hosts with their own Docs link can hide it.
   */
  docsButton?: boolean;
  /** Color theme. Defaults to the enclosing IsoDraw component's theme, or light. */
  theme?: Theme;
  /**
   * The detail diagram to show: ids of the components drilled into from the
   * top (`[]` is the top diagram). The editor follows changes to it; pair with
   * onLevelChange to keep it in the URL.
   */
  level?: LevelPath;
  /** The user went into or out of a component's detail diagram. */
  onLevelChange?: (level: LevelPath) => void;
  className?: string;
  style?: React.CSSProperties;
}

/** A state of the whole diagram, and the level the user was on when the change that made it happened. */
interface Snapshot {
  d: Diagram;
  at: LevelPath;
}

interface History extends Snapshot {
  past: Snapshot[];
  future: Snapshot[];
}

// Tiptap is large: load the docs editor only when someone opens it.
const DocsPanel = lazy(() => import('./DocsPanel'));

const HISTORY_LIMIT = 200;

/** Most icons the palette lists at once; images load lazily as they scroll into view. */
const ICON_LIMIT = 1000;

type CloudId = 'aws' | 'gcp' | 'azure' | 'lucide';
type CloudLib = { status: 'loading' | 'ready' | 'error'; lib?: IconLibrary; error?: string };
/** Built-in icon sets loaded from the CDN, in palette tab order. */
const CLOUDS: { id: CloudId; name: string; load: () => Promise<IconLibrary> }[] = [
  { id: 'aws', name: 'AWS', load: () => loadAwsIconLibrary() },
  { id: 'gcp', name: 'GCP', load: () => loadGcpIconLibrary() },
  { id: 'azure', name: 'Azure', load: () => loadAzureIconLibrary() },
  { id: 'lucide', name: 'Lucide', load: () => loadLucideIconLibrary() },
];
/** IsoDraw's own isometric icons: drawn in code, so always there. */
const ISO_LIBRARY = isoIconLibrary();

/** Side panel widths. Today's sizes are the minimums; dragging a panel's inner border widens it. */
/** The sidebar has one width, whichever tab is showing. */
type Panel = 'palette' | 'sidebar';
const PANEL_MIN: Record<Panel, number> = { palette: 260, sidebar: 360 };
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

/**
 * The palette's icon-set tabs: underlined like the sidebar's, on one row that
 * scrolls sideways when it doesn't fit. The wheel scrolls it too, the open tab
 * stays in view, and the edges fade where there's more to see.
 */
function PaletteTabs({ tabs, active, onChange }: { tabs: { id: string; name: string }[]; active: string; onChange: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState({ left: false, right: false });
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setMore((m) => (m.left === left && m.right === right ? m : { left, right }));
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // A vertical wheel scrolls the row sideways; it has nothing to scroll up or down.
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener('wheel', wheel);
    };
  }, [measure]);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [active]);
  return (
    <div className={`isd-tabs${more.left ? ' has-more-left' : ''}${more.right ? ' has-more-right' : ''}`}>
      <div ref={ref} className="isd-tabs-scroll" role="tablist" aria-label="Palette" onScroll={measure}>
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={active === t.id} className={active === t.id ? 'is-active' : ''} onClick={() => onChange(t.id)}>
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IsoDiagramEditor(props: IsoDiagramEditorProps) {
  const { readOnly, awsIcons = true, gcpIcons = true, azureIcons = true, lucideIcons = true } = props;
  const theme = useResolvedTheme(props.theme);
  const [hist, setHist] = useState<History>(() => ({
    d: liftEmbeds(props.value ?? props.defaultValue ?? emptyDiagram()),
    at: [],
    past: [],
    future: [],
  }));
  /** The whole diagram, with every detail diagram inside it. */
  const root = hist.d;
  const [path, setPath] = useState<LevelPath>(() => validLevel(hist.d, props.level ?? []));
  /** Read by commits, so a change lands on the level that was showing when it was made. */
  const pathRef = useRef(path);
  pathRef.current = path;
  /** The diagram on screen: the top one, or the detail diagram drilled into. */
  const diagram = levelAt(root, path) ?? root;
  // The view is a diagram setting, so Edit, View and published pages agree. Detail diagrams follow the top one.
  const view: ViewMode = root.view ?? props.defaultView ?? '3d';
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
  /** The right sidebar: an item's properties and its docs, as tabs. Viewers only get the docs. */
  const [sideOpen, setSideOpen] = useState(!readOnly);
  const [sideTab, setSideTab] = useState<'properties' | 'docs'>('properties');
  const tab = readOnly ? 'docs' : sideTab;
  const docsOpen = sideOpen && tab === 'docs';
  const [helpOpen, setHelpOpen] = useState(false);
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
      const d = liftEmbeds(props.value);
      setHist((h) => ({ d, at: [], past: [...h.past, { d: h.d, at: h.at }].slice(-HISTORY_LIMIT), future: [] }));
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
  const enabledClouds = CLOUDS.filter((c) => ({ aws: awsIcons, gcp: gcpIcons, azure: azureIcons, lucide: lucideIcons })[c.id]);
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

  /**
   * Apply a change to the diagram at level `where` (default: the one showing).
   * `mode: 'replace'` skips history (used mid-drag).
   */
  const commitAt = useCallback(
    (where: LevelPath, next: Diagram | ((d: Diagram) => Diagram), mode: 'push' | 'replace' = 'push', key?: string) => {
      const at = pathRef.current;
      setHist((h) => {
        const d = withLevel(h.d, where, (cur) => (typeof next === 'function' ? next(cur) : next));
        if (d === h.d) return h;
        const now = Date.now();
        const k = key && `${levelKey(where)}|${key}`;
        const sameKey = k && coalesce.current?.key === k && now - coalesce.current.t < 1200;
        coalesce.current = k ? { key: k, t: now } : null;
        if (mode === 'replace' || sameKey) return { ...h, d, at };
        return { d, at, past: [...h.past, { d: h.d, at: h.at }].slice(-HISTORY_LIMIT), future: [] };
      });
    },
    [],
  );
  const commit = useCallback(
    (next: Diagram | ((d: Diagram) => Diagram), mode: 'push' | 'replace' = 'push', key?: string) => commitAt(pathRef.current, next, mode, key),
    [commitAt],
  );

  const beginChange = useCallback(() => {
    coalesce.current = null;
    setHist((h) => ({ d: h.d, at: pathRef.current, past: [...h.past, { d: h.d, at: h.at }].slice(-HISTORY_LIMIT), future: [] }));
  }, []);

  /**
   * Undo and redo restore content but keep the current view setting. They go
   * to the level where the change happened, so nothing changes out of sight.
   */
  const withView = (d: Diagram, from: Diagram): Diagram => (d.view === from.view ? d : { ...d, view: from.view });
  const undo = () => {
    const prev = hist.past[hist.past.length - 1];
    if (!prev) return;
    const d = withView(prev.d, hist.d);
    setHist({ d, at: prev.at, past: hist.past.slice(0, -1), future: [{ d: hist.d, at: hist.at }, ...hist.future] });
    goLevel(validLevel(d, hist.at), { keepSelection: true });
  };
  const redo = () => {
    const next = hist.future[0];
    if (!next) return;
    const d = withView(next.d, hist.d);
    setHist({ d, at: next.at, past: [...hist.past, { d: hist.d, at: hist.at }].slice(-HISTORY_LIMIT), future: hist.future.slice(1) });
    goLevel(validLevel(d, next.at), { keepSelection: true });
  };

  // ----- levels -----
  /** Camera per level, so coming back shows what you were looking at. */
  const cameras = useRef(new Map<string, Camera>());
  /** Bumped on every level change; replays the zoom-in or zoom-out transition. */
  const [levelMove, setLevelMove] = useState<{ dir: 'in' | 'out'; n: number }>({ dir: 'in', n: 0 });

  /** Show another level. Going out selects the component you came out of. */
  const goLevel = (next: LevelPath, opts: { select?: DocTarget; keepSelection?: boolean } = {}) => {
    const cur = pathRef.current;
    const toSelection = (t: DocTarget): Selection =>
      t.kind === 'node' ? { nodes: [t.id], edges: [] } : t.kind === 'edge' ? { nodes: [], edges: [t.id] } : NO_SELECTION;
    if (sameLevel(next, cur)) {
      if (opts.select) setSelection(toSelection(opts.select));
      return;
    }
    cameras.current.set(levelKey(cur), camera);
    pathRef.current = next;
    setPath(next);
    const out = next.length < cur.length && sameLevel(next, cur.slice(0, next.length));
    const cameFrom: DocTarget | undefined = out ? { kind: 'node', id: cur[next.length] } : undefined;
    const select = opts.select ?? cameFrom;
    if (select) setSelection(toSelection(select));
    else if (!opts.keepSelection) setSelection(NO_SELECTION);
    setMentionHover(null);
    setTool('select');
    setLevelMove((m) => ({ dir: next.length > cur.length ? 'in' : 'out', n: m.n + 1 }));
    props.onLevelChange?.(next);
  };
  const goUp = () => {
    if (path.length) goLevel(path.slice(0, -1));
  };
  /** Drill into a component's detail diagram. */
  const openDetail = (id: string) => {
    if (diagram.nodes.find((n) => n.id === id)?.detail) goLevel([...path, id]);
  };
  /** Give a component an empty detail diagram and go into it. */
  const addDetail = (id: string) => {
    commit((d) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id && !n.detail ? { ...n, detail: emptyDiagram() } : n)) }));
    goLevel([...path, id]);
  };

  // Restore or fit the camera for the level now showing.
  const firstLevel = useRef(true);
  useLayoutEffect(() => {
    if (firstLevel.current) {
      firstLevel.current = false;
      return;
    }
    const saved = cameras.current.get(levelKey(path));
    if (saved) setCamera(saved);
    else fitTo(diagram, proj);
    // The canvas was replaced and took the focus with it: give it to the new one.
    const active = document.activeElement;
    if (!active || active === document.body) {
      stageRef.current?.querySelector<SVGSVGElement>('.isd-canvas')?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelKey(path)]);

  // A level can disappear (undo, delete, a new value): fall back to the nearest one that is left.
  useEffect(() => {
    const ok = validLevel(root, path);
    if (ok.length !== path.length) goLevel(ok);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root]);

  // Follow the level prop, e.g. the browser's back button.
  useEffect(() => {
    if (!props.level) return;
    const next = validLevel(root, props.level);
    if (!sameLevel(next, path)) goLevel(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.level && levelKey(props.level)]);

  // Switch between docked panels and drawers based on the editor's own width.
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const apply = (w: number) =>
      setCompact((was) => {
        const next = w < COMPACT_WIDTH;
        if (next !== was) {
          setPaletteOpen(!next);
          setSideOpen(!next && !readOnly);
        }
        return next;
      });
    apply(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => apply(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Selecting an item opens the sidebar, on whichever tab was showing.
  useEffect(() => {
    if (!selection.nodes.length && !selection.edges.length) return;
    setSideOpen(true);
    if (compact) setPaletteOpen(false);
  }, [selection.nodes.join(' '), selection.edges.join(' ')]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [selectionTarget && targetKey(selectionTarget), levelKey(path)]); // eslint-disable-line react-hooks/exhaustive-deps

  const openDocs = (t?: DocTarget) => {
    if (t) {
      setDocsTarget(t);
      setSelection(t.kind === 'diagram' ? NO_SELECTION : t.kind === 'node' ? { nodes: [t.id], edges: [] } : { nodes: [], edges: [t.id] });
    }
    setSideOpen(true);
    setSideTab('docs');
    if (compact) setPaletteOpen(false);
  };

  /**
   * Inside a detail diagram, its overview is the doc of the component it
   * details, which lives one level up. The docs panel works on that level.
   */
  const docsLevel = docsTarget.kind === 'diagram' && path.length ? path.slice(0, -1) : path;
  const docsPageTarget: DocTarget = docsTarget.kind === 'diagram' && path.length ? { kind: 'node', id: path[path.length - 1] } : docsTarget;
  const docsDiagram = levelAt(root, docsLevel) ?? root;

  /** Jump to an item from a mention or breadcrumb: select it, center it, show its docs. */
  const navigateTo = (t: DocTarget, level: LevelPath = path) => {
    if (!sameLevel(level, path)) {
      // Another level: show it whole, with the item selected.
      goLevel(level, { select: t.kind === 'diagram' ? undefined : t });
      setDocsTarget(t);
      setSideOpen(true);
      setSideTab('docs');
      return;
    }
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
    setCamera((c) => ({ ...c, x: w / 2 - p!.x * c.zoom, y: h / 2 - p!.y * c.zoom }));
  };

  const updateDoc = (t: DocTarget, md: string) => commitAt(docsLevel, (d) => withDoc(d, t, md), 'push', `doc:${targetKey(t)}`);

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
      fitTo(levelAt(hist.d, pathRef.current) ?? hist.d, proj);
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

  // Moving or resizing by hand makes an item manual: automatic layout won't move it again.
  const manual = (patch: Partial<DiagramNode>): Partial<DiagramNode> => (movesItem(patch) ? { ...patch, placed: undefined } : patch);
  // An isometric icon's box follows its drawing: setting one side scales the whole icon.
  const fit = (n: DiagramNode, patch: Partial<DiagramNode>) => fitIsoIcon(n, 'w' in patch ? 'w' : 'd' in patch ? 'd' : undefined);
  const updateNode = (id: string, patch: Partial<DiagramNode>, key?: string) =>
    commit((d) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id ? fit({ ...n, ...manual(patch) }, patch) : n)) }), 'push', key && `${id}:${key}`);
  const updateNodes = (ids: string[], patch: Partial<DiagramNode>) =>
    commit((d) => ({ ...d, nodes: d.nodes.map((n) => (ids.includes(n.id) ? fit({ ...n, ...manual(patch) }, patch) : n)) }));
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
      // A pasted copy is placed by the person pasting it.
      return { ...n, id, x: n.x + offset, y: n.y + offset, placed: undefined };
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
    } else if (e.key === '?') {
      setHelpOpen(true);
    } else if (k === 'd' && !mod) {
      if (docsOpen) setSideOpen(false);
      else openDocs();
    } else if (mod && k === 'a') {
      e.preventDefault();
      setSelection({ nodes: diagram.nodes.map((n) => n.id), edges: [] });
    } else if (k === 'enter' && !mod && selNode?.detail) {
      e.preventDefault();
      openDetail(selNode.id);
    } else if ((k === 'arrowup' && e.altKey) || (k === 'escape' && path.length && !selection.nodes.length && !selection.edges.length)) {
      e.preventDefault();
      goUp();
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
        (d) => ({ ...d, nodes: d.nodes.map((n) => (ids.has(n.id) && !n.locked ? { ...n, x: n.x + v.x * step, y: n.y + v.y * step, placed: undefined } : n)) }),
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
      // Docs and JSON cover the whole diagram; images show the level on screen.
      if (fmt === 'docs') downloadBlob(exportDocsMarkdown(root), 'architecture.md', 'text/markdown');
      if (fmt === 'json') downloadBlob(exportJson(root), 'diagram.json', 'application/json');
      // Dark-theme ink is light, so dark exports carry the dark canvas behind it.
      const background = theme === 'dark' ? CANVAS_BG.dark : undefined;
      if (fmt === 'svg' && svgRef.current) downloadBlob(await exportSvg(svgRef.current, { background }), 'diagram.svg', 'image/svg+xml');
      if (fmt === 'png' && svgRef.current) downloadBlob(await exportPng(svgRef.current, { background }), 'diagram.png');
    } catch (err) {
      setToast(`Export failed: ${(err as Error).message}`);
    }
  };

  /**
   * Open an IsoDraw diagram, or import Terraform state or plan JSON. It
   * replaces the level on screen, so a component's detail can be imported too.
   */
  const importJsonFile = async (file: File) => {
    // The top diagram keeps its view setting; detail diagrams carry none.
    const place = (d: Diagram): Diagram => {
      const { view: _v, ...rest } = d;
      return path.length ? rest : { ...rest, ...(root.view ? { view: root.view } : {}) };
    };
    const into = path.length ? ` into ${nodeTitle(levelNodes(root, path).pop()!)}` : '';
    try {
      const json: unknown = JSON.parse(await file.text());
      if (isTerraformJson(json)) {
        setToast('Reading Terraform…');
        const { diagram: d, summary } = await importTerraform(json, { gcpIcons: cloudLibs.gcp?.lib });
        const next = place(d);
        commit(next);
        setSelection(NO_SELECTION);
        fitTo(next, proj);
        setToast(`Imported ${summary.components} components and ${summary.connections} connections from ${summary.resources} Terraform resources${into}`);
        return;
      }
      const d = place(liftEmbeds(parseDiagram(json)));
      commit(d);
      setSelection(NO_SELECTION);
      fitTo(d, proj);
      setToast(`Imported ${d.nodes.length} nodes${into}`);
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
    ISO_LIBRARY,
    ...enabledClouds.map((c) => cloudLibs[c.id]?.lib ?? { id: c.id, name: c.name, icons: [] }),
    ...(props.iconLibraries ?? []),
    { id: 'mine', name: 'Images', icons: userIcons },
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
    const other = panel === 'palette' ? (sideOpen ? panelW.sidebar : 0) : paletteOpen ? panelW.palette : 0;
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

  /** "Diagram", then each component drilled into. */
  const levelCrumbs = ['Diagram', ...levelNodes(root, path).map(nodeTitle)];
  /** The docs panel's crumbs: the levels above its page. A detail diagram's overview sits under its parent's level. */
  const docsLevelCrumbs = levelCrumbs.slice(0, docsLevel.length + 1).map((label, i) => ({
    label,
    // Nothing selected, so the panel shows that level's overview.
    onClick: () => goLevel(path.slice(0, i), { select: { kind: 'diagram' } }),
  }));
  /** The component whose page the docs show, if it can have a detail diagram. */
  const docsNode = docsPageTarget.kind === 'node' ? docsDiagram.nodes.find((n) => n.id === docsPageTarget.id) : undefined;
  const inDocsNode = docsNode && sameLevel(path, [...docsLevel, docsNode.id]);
  const docsDetail =
    docsNode && canHaveDetail(docsNode)
      ? {
          diagram: docsNode.detail,
          // Already inside it: nothing to open.
          onOpen: docsNode.detail && !inDocsNode ? () => goLevel([...docsLevel, docsNode.id]) : undefined,
          // Clicking an item in the doc's picture of the detail goes in with it selected.
          onItemClick: docsNode.detail
            ? (id: string) => goLevel([...docsLevel, docsNode.id], { select: { kind: 'node', id } })
            : undefined,
          // Without a detail, the page is on the level showing.
          onAdd: readOnly || docsNode.detail ? undefined : () => addDetail(docsNode.id),
        }
      : undefined;
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
          '--isd-sidebar-w': `${panelW.sidebar}px`,
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
          {!readOnly && (
            <ToolButton
              icon="tidy"
              label="Tidy up: lay out this level in columns by flow (undo with ⌘Z)"
              disabled={!diagram.nodes.some((n) => n.kind !== 'text')}
              onClick={() => {
                const next = layoutLevel(diagram);
                commit(next);
                fitTo(next, proj);
                setToast('Tidied up. ⌘Z undoes it.');
              }}
            />
          )}
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
          {props.docsButton !== false && (
            <ToolButton icon="doc" label={docsOpen ? 'Hide docs (D)' : 'Show docs (D)'} active={docsOpen} onClick={() => (docsOpen ? setSideOpen(false) : openDocs())}>
              Docs
            </ToolButton>
          )}
          <ToolButton icon="help" label="Help and shortcuts (?)" active={helpOpen} onClick={() => setHelpOpen(true)} />
        </div>
        <div className="isd-group">
          <ToolButton icon="download" label="Export" active={exportOpen} onClick={() => setExportOpen(!exportOpen)}>
            Export
          </ToolButton>
        </div>
        <div className="isd-group">
          <ToolButton icon="panelR" label={sideOpen ? 'Hide sidebar' : 'Show sidebar'} active={sideOpen} onClick={() => setSideOpen(!sideOpen)} />
        </div>
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
            <PaletteTabs tabs={[{ id: 'shapes', name: 'Shapes' }, ...libraries]} active={paletteTab} onChange={setPaletteTab} />

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
                            <img src={imageHref(i.src)} alt="" loading="lazy" draggable={false} />
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
          {/* Keyed by level, so each level change replays the zoom transition. */}
          <div key={levelKey(path)} className={`isd-level-view${levelMove.n ? ` is-${levelMove.dir}` : ''}`}>
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
            onOpenDetail={openDetail}
            focus={docsOpen && sameLevel(docsLevel, path) ? mentionHover : null}
            showDocBadges={props.docBadges}
            newEdgeStyle={{ routing: 'orthogonal', rounded: true, ...edgeStyle }}
            onBeginChange={beginChange}
            onChange={(d) => commit((cur) => markMoved(cur, d), 'replace')}
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
          </div>
          {path.length > 0 && (
            <nav className="isd-levels" aria-label="Diagram levels">
              <button type="button" className="isd-levels-up" onClick={goUp} title="Up one level (Esc)" aria-label="Up one level">
                <Icon name="up" size={14} />
              </button>
              {levelCrumbs.map((c, i) =>
                i < levelCrumbs.length - 1 ? (
                  <span key={i}>
                    <button type="button" onClick={() => goLevel(path.slice(0, i))}>
                      {c}
                    </button>
                    <span aria-hidden>›</span>
                  </span>
                ) : (
                  <strong key={i} aria-current="location">
                    <Icon name="layers" size={13} />
                    {c}
                  </strong>
                ),
              )}
            </nav>
          )}
          {path.length > 0 && !diagram.nodes.length && (
            <div className="isd-level-empty">
              {readOnly ? 'Nothing inside yet.' : 'Nothing inside yet. Add shapes and icons from the palette to draw this component\'s insides.'}
            </div>
          )}
          <div className="isd-status">
            {view === '3d' ? `2.5D · ${['N', 'E', 'S', 'W'][rotation]}` : 'Flat'} · {diagram.nodes.length} nodes · {diagram.edges.length} connections
          </div>
          {toast && <div className="isd-toast">{toast}</div>}
        </div>

        {/* ---------- sidebar: properties and docs ---------- */}
        {sideOpen && resizer('sidebar', -1, 'sidebar')}
        {sideOpen && (
          <aside className={`isd-inspector isd-side is-${tab}`} aria-label="Sidebar">
            <div className="isd-side-head">
              {readOnly ? (
                <strong>Docs</strong>
              ) : (
                <div className="isd-side-tabs" role="tablist" aria-label="Sidebar">
                  {(
                    [
                      ['properties', 'Properties'],
                      ['docs', 'Docs'],
                    ] as const
                  ).map(([id, label]) => (
                    <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} onClick={() => setSideTab(id)}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <button type="button" className="isd-side-close" aria-label="Close sidebar" title="Close sidebar" onClick={() => setSideOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            {tab === 'docs' ? (
              <Suspense fallback={<div className="isd-docs isd-docs-loading">Loading editor…</div>}>
                <DocsPanel
                  target={docsPageTarget}
                  diagram={docsDiagram}
                  readOnly={readOnly}
                  levels={docsLevelCrumbs}
                  overview={docsTarget.kind === 'diagram' && path.length > 0}
                  detail={docsDetail}
                  onChange={updateDoc}
                  onNavigate={(t) => navigateTo(t, docsLevel)}
                  onMentionHover={setMentionHover}
                  onExport={() => void doExport('docs')}
                />
              </Suspense>
            ) : (
            <div className="isd-side-body">
            {selNode ? (
              <NodeInspector
                node={selNode}
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
                <h3>{path.length ? `Inside ${levelCrumbs[levelCrumbs.length - 1]}` : 'Diagram'}</h3>
                <p className="isd-hint">
                  Click a shape or icon to add it, or drag it onto the canvas. Select a node to edit it. Press <kbd>?</kbd> for shortcuts.
                </p>
                {diagram.nodes.length > 0 && (
                  <button
                    type="button"
                    className="isd-btn is-danger"
                    onClick={() => {
                      if (window.confirm(path.length ? `Clear everything inside ${levelCrumbs[levelCrumbs.length - 1]}?` : 'Clear the whole diagram?')) {
                        commit((d) => ({ ...emptyDiagram(), ...(d.view ? { view: d.view } : {}) }));
                      }
                    }}
                  >
                    <Icon name="trash" /> Clear diagram
                  </button>
                )}
              </div>
            )}
            </div>
            )}
          </aside>
        )}
      </div>
      {helpOpen && <HelpModal readOnly={readOnly} onClose={() => setHelpOpen(false)} />}
    </div>
    </ThemeContext.Provider>
  );
}

// ---------- help ----------

/** Shortcuts, grouped. `edit` rows only apply when the diagram can be edited. */
const HELP: { title: string; edit?: boolean; keys: [string, string][] }[] = [
  {
    title: 'Moving around',
    keys: [
      ['Drag empty space', 'Pan'],
      ['Scroll / pinch', 'Zoom'],
      ['Tab', 'Switch between 2D and 2.5D'],
      ['R / ⇧R', 'Rotate the 2.5D view'],
      ['Enter / double-click', "Go into a component's detail diagram"],
      ['Esc / ⌥↑', 'Up one level'],
    ],
  },
  {
    title: 'Editing',
    edit: true,
    keys: [
      ['V / C', 'Select tool / connect tool'],
      ['⇧ + drag', 'Box select'],
      ['Arrows', 'Nudge (⇧ for a full step)'],
      ['⌥ + drag', 'Move without snapping'],
      ['⌘D / ⌘C / ⌘V', 'Duplicate / copy / paste'],
      ['⌘G / ⇧⌘G', 'Group into an area / ungroup'],
      ['Delete', 'Delete the selection'],
      ['⌘Z / ⇧⌘Z', 'Undo / redo'],
    ],
  },
  {
    title: 'Docs',
    keys: [
      ['D', 'Show or hide the docs'],
      ['@', 'In a doc: link a component'],
      ['/', 'In a doc: insert a block (heading, table, diagram…)'],
    ],
  },
];

function HelpModal({ readOnly, onClose }: { readOnly?: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  return (
    <div
      className="isd-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Help and shortcuts"
      onClick={onClose}
      onKeyDown={(e) => {
        // Keys stay in the dialog; Esc closes it.
        e.stopPropagation();
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="isd-modal-box isd-help" onClick={(e) => e.stopPropagation()}>
        <header className="isd-modal-head">
          <strong>Help and shortcuts</strong>
          <span />
          <button ref={closeRef} type="button" className="isd-side-close" aria-label="Close help" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>
        <div className="isd-help-body">
          {HELP.filter((g) => !(readOnly && g.edit)).map((g) => (
            <section key={g.title}>
              <h4>{g.title}</h4>
              <dl className="isd-keys">
                {g.keys.map(([k, v]) => (
                  <Fragment key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </Fragment>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- inspectors ----------

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
      {node.kind !== 'image' || node.imageStyle === 'tile' || isIsoIcon(node.src) ? (
        <Field label={node.kind === 'image' && !isIsoIcon(node.src) ? 'Tile color' : 'Color'}>
          <Swatches value={node.color} onChange={(color) => onChange({ color })} />
        </Field>
      ) : null}
      {node.kind === 'image' && (
        <>
          {/* Lucide icons (and other one-color SVGs) can be redrawn in any color. */}
          {iconColor(node.src) && (
            <Field label="Icon color">
              <Swatches value={iconColor(node.src)!} onChange={(color) => onChange({ src: withIconColor(node.src!, color) })} />
            </Field>
          )}
          {/* Isometric icons are objects already; the styles are for flat pictures. */}
          {!isIsoIcon(node.src) && (
            <Field label="Style">
              <select className="isd-input" value={node.imageStyle ?? 'tile'} onChange={(e) => onChange({ imageStyle: e.target.value as DiagramNode['imageStyle'] })}>
                <option value="tile">Tile (icon on a block)</option>
                <option value="flat">Flat (on the ground)</option>
                <option value="standing">Standing (billboard)</option>
              </select>
            </Field>
          )}
          <div className="isd-image-preview">
            <img src={imageHref(node.src, node.color)} alt="" />
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
        {!flat && node.kind !== 'sphere' && !isIsoIcon(node.src) && (
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
  onChange,
  onRoute,
  onDelete,
}: {
  edge: DiagramEdge;
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

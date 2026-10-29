import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as RKeyboardEvent } from 'react';
import { DRAG_MIME, IsoCanvas, type Selection, type Tool } from './IsoCanvas';
import { exportJson, exportPng, exportSvg, downloadBlob, readFileAsDataUrl } from './export';
import { Projector, type Pt, footprint, isFlat, uid } from './geometry';
import { loadAwsIconLibrary } from './icons';
import { ShapePreview } from './render';
import { SHAPES, SWATCHES, createEdge, createImageNode, createShape, emptyDiagram, parseDiagram } from './shapes';
import type { Camera, Diagram, DiagramEdge, DiagramNode, IconDef, IconLibrary, Rotation, ShapeKind, ViewMode } from './types';
import { Field, Icon, NumberInput, ToolButton } from './ui';

export interface IsoDiagramEditorProps {
  /** Controlled diagram. Pair with onChange. */
  value?: Diagram;
  /** Initial diagram when uncontrolled. */
  defaultValue?: Diagram;
  onChange?: (d: Diagram) => void;
  /** Initial view mode. */
  defaultView?: ViewMode;
  /** Extra icon libraries to show in the palette. */
  iconLibraries?: IconLibrary[];
  /** Load the AWS architecture icons from the jsDelivr CDN (default true). */
  awsIcons?: boolean;
  /** Icons the user imported; persisted by the host if desired. */
  userIcons?: IconDef[];
  onUserIconsChange?: (icons: IconDef[]) => void;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface History {
  d: Diagram;
  past: Diagram[];
  future: Diagram[];
}

const HISTORY_LIMIT = 200;
const NO_SELECTION: Selection = { nodes: [], edges: [] };

interface PalettePayload {
  type: 'shape' | 'icon';
  kind?: ShapeKind;
  src?: string;
  name?: string;
}

export function IsoDiagramEditor(props: IsoDiagramEditorProps) {
  const { readOnly, awsIcons = true } = props;
  const [hist, setHist] = useState<History>(() => ({
    d: props.value ?? props.defaultValue ?? emptyDiagram(),
    past: [],
    future: [],
  }));
  const diagram = hist.d;
  const [view, setView] = useState<ViewMode>(props.defaultView ?? '3d');
  const [rotation, setRotation] = useState<Rotation>(0);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [selection, setSelection] = useState<Selection>(NO_SELECTION);
  const [tool, setTool] = useState<Tool>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [paletteTab, setPaletteTab] = useState('shapes');
  const [search, setSearch] = useState('');
  const [aws, setAws] = useState<IconLibrary | null>(null);
  const [awsError, setAwsError] = useState<string | null>(null);
  const [localIcons, setLocalIcons] = useState<IconDef[]>(props.userIcons ?? []);
  const [toast, setToast] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!awsIcons) return;
    const ctl = new AbortController();
    loadAwsIconLibrary({ signal: ctl.signal })
      .then(setAws)
      .catch((e) => !ctl.signal.aborted && setAwsError(String(e.message ?? e)));
    return () => ctl.abort();
  }, [awsIcons]);

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

  const undo = () =>
    setHist((h) => (h.past.length ? { d: h.past[h.past.length - 1], past: h.past.slice(0, -1), future: [h.d, ...h.future] } : h));
  const redo = () =>
    setHist((h) => (h.future.length ? { d: h.future[0], past: [...h.past, h.d], future: h.future.slice(1) } : h));

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
    setView(nextView);
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
    if (p.type === 'shape' && p.kind) addNode(createShape(p.kind, at.x, at.y));
    if (p.type === 'icon' && p.src) addNode(createImageNode(p.src, p.name ?? '', at.x, at.y));
  };

  const updateNode = (id: string, patch: Partial<DiagramNode>, key?: string) =>
    commit((d) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) }), 'push', key && `${id}:${key}`);
  const updateNodes = (ids: string[], patch: Partial<DiagramNode>) =>
    commit((d) => ({ ...d, nodes: d.nodes.map((n) => (ids.includes(n.id) ? { ...n, ...patch } : n)) }));
  const updateEdge = (id: string, patch: Partial<DiagramEdge>, key?: string) =>
    commit((d) => ({ ...d, edges: d.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)) }), 'push', key && `${id}:${key}`);

  const deleteSelection = () => {
    if (!selection.nodes.length && !selection.edges.length) return;
    const ns = new Set(selection.nodes);
    const es = new Set(selection.edges);
    commit((d) => ({
      ...d,
      nodes: d.nodes.filter((n) => !ns.has(n.id)),
      edges: d.edges.filter((e) => !es.has(e.id) && !ns.has(e.from) && !ns.has(e.to)),
    }));
    setSelection(NO_SELECTION);
  };

  const copySelection = () => {
    const ns = new Set(selection.nodes);
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
    const edges = clip.edges.map((e) => ({ ...e, id: uid('e'), from: map.get(e.from)!, to: map.get(e.to)! }));
    commit((d) => ({ ...d, nodes: [...d.nodes, ...nodes], edges: [...d.edges, ...edges] }));
    setSelection({ nodes: nodes.map((n) => n.id), edges: [] });
    clipboard.current = { nodes, edges };
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
    if ((e.target as HTMLElement).closest('input,textarea,select')) return;
    const mod = e.metaKey || e.ctrlKey;
    const k = e.key.toLowerCase();
    if (mod && k === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    } else if (mod && k === 'y') {
      e.preventDefault();
      redo();
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
      const ids = new Set(selection.nodes);
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

  const doExport = async (fmt: 'json' | 'svg' | 'png') => {
    setExportOpen(false);
    try {
      if (fmt === 'json') downloadBlob(exportJson(diagram), 'diagram.json', 'application/json');
      if (fmt === 'svg' && svgRef.current) downloadBlob(await exportSvg(svgRef.current), 'diagram.svg', 'image/svg+xml');
      if (fmt === 'png' && svgRef.current) downloadBlob(await exportPng(svgRef.current), 'diagram.png');
    } catch (err) {
      setToast(`Export failed: ${(err as Error).message}`);
    }
  };

  const importJsonFile = async (file: File) => {
    try {
      const d = parseDiagram(JSON.parse(await file.text()));
      commit(d);
      setSelection(NO_SELECTION);
      fitTo(d, proj);
      setToast(`Imported ${d.nodes.length} nodes`);
    } catch (err) {
      setToast((err as Error).message);
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
    ...(aws ? [aws] : []),
    ...(props.iconLibraries ?? []),
    { id: 'mine', name: 'My images', icons: userIcons },
  ];
  const activeLib = libraries.find((l) => l.id === paletteTab);
  const q = search.trim().toLowerCase();
  const visibleIcons = activeLib
    ? activeLib.icons.filter((i) => !q || i.name.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q))
    : [];
  const grouped = useMemo(() => {
    const m = new Map<string, IconDef[]>();
    for (const i of visibleIcons.slice(0, 400)) {
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

  const selNode = selection.nodes.length === 1 ? diagram.nodes.find((n) => n.id === selection.nodes[0]) : undefined;
  const selEdge = selection.edges.length === 1 && !selection.nodes.length ? diagram.edges.find((e) => e.id === selection.edges[0]) : undefined;

  return (
    <div
      className={`isd-root ${props.className ?? ''}`}
      style={props.style}
      onKeyDown={onKeyDown}
      onDragOver={(e) => e.dataTransfer.types.includes('Files') && e.preventDefault()}
      onDrop={(e) => {
        if (e.dataTransfer.files.length && !readOnly) {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          const json = files.find((f) => f.name.endsWith('.json'));
          if (json) void importJsonFile(json);
          else void importImages(files);
        }
      }}
    >
      {/* ---------- toolbar ---------- */}
      <div className="isd-toolbar">
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
        <div className="isd-group">
          <ToolButton icon="minus" label="Zoom out" onClick={() => zoomBy(1 / 1.25)} />
          <span className="isd-zoom">{Math.round(camera.zoom * 100)}%</span>
          <ToolButton icon="plus" label="Zoom in" onClick={() => zoomBy(1.25)} />
          <ToolButton icon="fit" label="Fit to content" onClick={() => fitTo(diagram, proj)} />
          <ToolButton icon="grid" label="Toggle grid" active={showGrid} onClick={() => setShowGrid(!showGrid)} />
        </div>
        <div className="isd-spacer" />
        {!readOnly && (
          <div className="isd-group">
            <ToolButton icon="upload" label="Open diagram (.json)" onClick={() => fileInput.current?.click()}>
              Open
            </ToolButton>
          </div>
        )}
        <div className="isd-group isd-menu-wrap">
          <ToolButton icon="download" label="Export" active={exportOpen} onClick={() => setExportOpen(!exportOpen)}>
            Export
          </ToolButton>
          {exportOpen && (
            <div className="isd-menu" onMouseLeave={() => setExportOpen(false)}>
              <button type="button" onClick={() => doExport('png')}>PNG image</button>
              <button type="button" onClick={() => doExport('svg')}>SVG vector</button>
              <button type="button" onClick={() => doExport('json')}>Diagram JSON</button>
            </div>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
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

      <div className="isd-body">
        {/* ---------- palette ---------- */}
        {!readOnly && (
          <aside className="isd-palette">
            <div className="isd-tabs" role="tablist">
              {[{ id: 'shapes', name: 'Shapes' }, ...libraries].map((t) => (
                <button key={t.id} type="button" role="tab" aria-selected={paletteTab === t.id} className={paletteTab === t.id ? 'is-active' : ''} onClick={() => setPaletteTab(t.id)}>
                  {t.name}
                </button>
              ))}
              {awsIcons && !aws && <span className="isd-tab-note">{awsError ? 'AWS icons unavailable' : 'Loading AWS…'}</span>}
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
                    <Icon name="image" /> Upload images
                  </button>
                  <button type="button" className="isd-btn" onClick={addImageUrl}>
                    From URL
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
                        <Icon name="image" /> Upload
                      </button>
                      <button type="button" className="isd-btn" onClick={addImageUrl}>
                        From URL
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
                            <span>{i.name.replace(/^(Amazon|AWS) /, '')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {visibleIcons.length > 400 && <p className="isd-hint">Showing 400 of {visibleIcons.length}. Refine your search.</p>}
                  {!visibleIcons.length && <p className="isd-hint">{paletteTab === 'mine' ? 'No images yet. Upload PNG/SVG logos to use them as nodes.' : 'No matches.'}</p>}
                </div>
              </>
            )}
          </aside>
        )}

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
            onBeginChange={beginChange}
            onChange={(d) => commit(d, 'replace')}
            onConnect={(from, to) => {
              const edge = createEdge(from, to);
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
        </div>

        {/* ---------- inspector ---------- */}
        {!readOnly && (
          <aside className="isd-inspector">
            {selNode ? (
              <NodeInspector
                node={selNode}
                onChange={(patch, key) => updateNode(selNode.id, patch, key)}
                onDelete={deleteSelection}
                onDuplicate={() => {
                  copySelection();
                  paste();
                }}
                onReorder={reorder}
              />
            ) : selEdge ? (
              <EdgeInspector edge={selEdge} onChange={(patch, key) => updateEdge(selEdge.id, patch, key)} onDelete={deleteSelection} />
            ) : selection.nodes.length > 1 ? (
              <div className="isd-panel">
                <h3>{selection.nodes.length} nodes selected</h3>
                <Field label="Color">
                  <Swatches value="" onChange={(color) => updateNodes(selection.nodes, { color })} />
                </Field>
                <Field label="Elevation">
                  <NumberInput value={diagram.nodes.find((n) => n.id === selection.nodes[0])?.z ?? 0} onChange={(z) => updateNodes(selection.nodes, { z })} />
                </Field>
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

const KIND_NAMES: Record<ShapeKind, string> = {
  block: 'Block',
  cylinder: 'Cylinder',
  hexagon: 'Hexagon',
  pyramid: 'Pyramid',
  cone: 'Cone',
  sphere: 'Sphere',
  area: 'Area',
  circleArea: 'Circle area',
  text: 'Text',
  image: 'Image',
};

function NodeInspector({
  node,
  onChange,
  onDelete,
  onDuplicate,
  onReorder,
}: {
  node: DiagramNode;
  onChange: (patch: Partial<DiagramNode>, key?: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReorder: (dir: 'front' | 'back') => void;
}) {
  const flat = isFlat(node);
  const isArea = node.kind === 'area' || node.kind === 'circleArea';
  const solidKinds: ShapeKind[] = ['block', 'cylinder', 'hexagon', 'pyramid', 'cone', 'sphere'];
  return (
    <div className="isd-panel">
      <h3>{KIND_NAMES[node.kind]}</h3>
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
        <button type="button" className="isd-btn is-danger" onClick={onDelete}>
          <Icon name="trash" /> Delete
        </button>
      </div>
    </div>
  );
}

function EdgeInspector({
  edge,
  onChange,
  onDelete,
}: {
  edge: DiagramEdge;
  onChange: (patch: Partial<DiagramEdge>, key?: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="isd-panel">
      <h3>Connection</h3>
      <Field label="Label">
        <input className="isd-input" value={edge.label ?? ''} placeholder="e.g. HTTPS" onChange={(e) => onChange({ label: e.target.value }, 'label')} />
      </Field>
      <Field label="Color">
        <Swatches value={edge.color} onChange={(color) => onChange({ color })} />
      </Field>
      <Field label="Routing">
        <select className="isd-input" value={edge.routing} onChange={(e) => onChange({ routing: e.target.value as DiagramEdge['routing'] })}>
          <option value="orthogonal">Orthogonal</option>
          <option value="straight">Straight</option>
        </select>
      </Field>
      <Field label="Width">
        <NumberInput value={edge.width} min={1} step={1} max={10} onChange={(width) => onChange({ width }, 'w')} />
      </Field>
      <label className="isd-check">
        <input type="checkbox" checked={!!edge.dashed} onChange={(e) => onChange({ dashed: e.target.checked })} /> Dashed
      </label>
      <label className="isd-check">
        <input type="checkbox" checked={!!edge.arrowStart} onChange={(e) => onChange({ arrowStart: e.target.checked })} /> Arrow at start
      </label>
      <label className="isd-check">
        <input type="checkbox" checked={!!edge.arrowEnd} onChange={(e) => onChange({ arrowEnd: e.target.checked })} /> Arrow at end
      </label>
      <div className="isd-row">
        <button type="button" className="isd-btn" onClick={() => onChange({ from: edge.to, to: edge.from })}>
          Reverse
        </button>
        <button type="button" className="isd-btn is-danger" onClick={onDelete}>
          <Icon name="trash" /> Delete
        </button>
      </div>
    </div>
  );
}

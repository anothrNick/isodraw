import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as RMouseEvent } from 'react';
import { IsoDocView } from './DocView';
import { titleOf } from './docs';
import { Projector, footprint } from './geometry';
import { DETAIL_BLOCK, levelAt, levelNodes, sameLevel, type LevelPath } from './levels';
import type { PresentationViewProps } from './Present';
import { SceneContent, TargetHighlight, sceneBounds } from './render';
import {
  boundsOf,
  easeInOut,
  fitCamera,
  flight,
  slideContents,
  slideOrder,
  slidePages,
  slideProjection,
  slideRect,
  type Rect,
  type SlidePage,
  type SlideRef,
} from './slides';
import { CANVAS_BG, ThemeContext } from './theme';
import type { Camera, Diagram, DiagramNode, DocTarget, Rotation, ViewMode } from './types';
import { Icon } from './ui';

/**
 * Presenting a diagram: full screen, the camera flies from slide to slide,
 * what's inside the slide stays bright and the docs panel walks through its pages.
 *
 * Each level (and each view) on screen is a layer: one SVG whose camera the
 * animation moves directly, so the diagram isn't re-rendered every frame.
 * Changing level fades one layer into the next.
 */

interface Layer {
  id: number;
  level: LevelPath;
  view: ViewMode;
  rotation: Rotation;
  /** The slide whose contents this layer keeps bright. */
  slideId: string;
  /** Where it starts: React sets these once, then the animation takes over. */
  cam0: Camera;
  opacity0: number;
}

const MARGIN = 56;
const FADE = 380;
const camAttr = (c: Camera) => `translate(${c.x} ${c.y}) scale(${c.zoom})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** The last item (`.at(-1)` needs a newer library target). */
const last = <T,>(list: T[]): T | undefined => list[list.length - 1];
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/** The page's doc and title. A detail diagram's overview is the doc of the component it details. */
function pageDoc(t: DocTarget, root: Diagram, level: LevelPath, siteTitle: string): { title: string; markdown: string } {
  const doc = rawPageDoc(t, root, level, siteTitle);
  // Slides show detail diagrams by going into them; the doc's marker for one has nothing to show here.
  return { ...doc, markdown: doc.markdown.split(DETAIL_BLOCK).join('') };
}

function rawPageDoc(t: DocTarget, root: Diagram, level: LevelPath, siteTitle: string): { title: string; markdown: string } {
  const d = levelAt(root, level) ?? root;
  if (t.kind === 'diagram') {
    if (level.length) {
      const owner = last(levelNodes(root, level));
      return { title: owner?.label?.trim() || 'Overview', markdown: owner?.doc ?? '' };
    }
    return { title: siteTitle, markdown: root.doc ?? '' };
  }
  const markdown = t.kind === 'node' ? d.nodes.find((n) => n.id === t.id)?.doc : d.edges.find((e) => e.id === t.id)?.doc;
  return { title: titleOf(t, d), markdown: markdown ?? '' };
}

/** A component's box in scene pixels, top included. */
function nodeRect(n: DiagramNode, proj: Projector): Rect {
  const top = n.z + (n.kind === 'sphere' ? Math.min(n.w, n.d) : n.h);
  return boundsOf(footprint(n).flatMap((q) => [proj.project(q.x, q.y, n.z), proj.project(q.x, q.y, top)]));
}

/** The camera that shows scene rectangle `r` inside screen rectangle `screen`. */
function cameraInto(r: Rect, screen: Rect): Camera {
  const zoom = Math.min(screen.w / Math.max(r.w, 1), screen.h / Math.max(r.h, 1));
  return { zoom, x: screen.x + screen.w / 2 - (r.x + r.w / 2) * zoom, y: screen.y + screen.h / 2 - (r.y + r.h / 2) * zoom };
}

const toScreen = (r: Rect, c: Camera): Rect => ({ x: r.x * c.zoom + c.x, y: r.y * c.zoom + c.y, w: r.w * c.zoom, h: r.h * c.zoom });

function LayerView({
  layer,
  root,
  focus,
  register,
}: {
  layer: Layer;
  root: Diagram;
  focus: DocTarget | null;
  register: (id: number, el: { svg: SVGSVGElement; g: SVGGElement } | null) => void;
}) {
  const idPrefix = `p${useId().replace(/:/g, '')}`;
  const svg = useRef<SVGSVGElement>(null);
  const g = useRef<SVGGElement>(null);
  useLayoutEffect(() => {
    register(layer.id, svg.current && g.current ? { svg: svg.current, g: g.current } : null);
    return () => register(layer.id, null);
  }, [layer.id, register]);
  const diagram = levelAt(root, layer.level) ?? root;
  const proj = useMemo(() => new Projector(layer.view, layer.rotation), [layer.view, layer.rotation]);
  const slide = diagram.nodes.find((n) => n.id === layer.slideId);
  const contents = useMemo(() => (slide ? slideContents(slide, diagram) : null), [slide, diagram]);
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <svg ref={svg} className="isd-present-layer" style={{ opacity: layer.opacity0 }} aria-hidden>
          <g ref={g} transform={camAttr(layer.cam0)}>
            <SceneContent diagram={diagram} proj={proj} idPrefix={idPrefix} />
            {contents && contents.nodes.length > 0 && (
              // Keyed by slide, so moving to another slide on this level fades the new contents in.
              <g key={layer.slideId} className="isd-present-spot">
                <rect x={-1e5} y={-1e5} width={2e5} height={2e5} fill={CANVAS_BG[theme]} opacity={0.84} />
                <SceneContent diagram={contents} proj={proj} idPrefix={`${idPrefix}-s`} />
              </g>
            )}
            {focus && <TargetHighlight target={focus} diagram={diagram} proj={proj} />}
          </g>
        </svg>
      )}
    </ThemeContext.Consumer>
  );
}

export default function PresentationView({ diagram, title, start, useHash, onExit, resolvedTheme, className, style }: PresentationViewProps) {
  const slides = useMemo(() => slideOrder(diagram), [diagram]);
  const siteTitle = title?.trim() || 'Overview';
  const startIndex = () => {
    if (useHash) {
      const n = Number(/^#(\d+)$/.exec(window.location.hash)?.[1]);
      if (n >= 1 && n <= slides.length) return n - 1;
    }
    const i = start ? slides.findIndex((s) => s.node.id === start) : -1;
    return Math.max(0, i);
  };
  const [index, setIndex] = useState(startIndex);
  const [page, setPage] = useState(0);
  const [detour, setDetour] = useState<DocTarget | null>(null);
  const [hover, setHover] = useState<DocTarget | null>(null);
  const [docsOpen, setDocsOpen] = useState(() => typeof window === 'undefined' || window.innerWidth >= 760);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Layer[]>([]);
  layersRef.current = layers;
  const els = useRef(new Map<number, { svg: SVGSVGElement; g: SVGGElement }>());
  const cam = useRef<Camera>({ x: 0, y: 0, zoom: 1 });
  const token = useRef(0);
  const nextId = useRef(1);
  const shown = useRef<SlideRef | null>(null);
  const reduceMotion = useRef(typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

  const register = useCallback((id: number, el: { svg: SVGSVGElement; g: SVGGElement } | null) => {
    if (el) els.current.set(id, el);
    else els.current.delete(id);
  }, []);

  const current = slides[Math.min(index, slides.length - 1)];
  const levelDiagram = current ? levelAt(diagram, current.level) ?? diagram : diagram;
  const pages: SlidePage[] = useMemo(() => (current ? slidePages(current.node, levelDiagram) : []), [current, levelDiagram]);
  const pageNow = pages[Math.min(page, pages.length - 1)];

  // ----- the stage size -----
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width > 10 && r.height > 10) setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ----- moving the camera -----
  const apply = (id: number, c: Camera | null, opacity?: number) => {
    const el = els.current.get(id);
    if (!el) return;
    if (c) {
      el.g.setAttribute('transform', camAttr(c));
      if (id === last(layersRef.current)?.id) cam.current = c;
    }
    if (opacity !== undefined) el.svg.style.opacity = String(opacity);
  };

  /** Run `step` from 0 to 1 over `ms`; resolves false if another transition started meanwhile. */
  const run = (ms: number, tok: number, step: (t: number) => void) =>
    new Promise<boolean>((resolve) => {
      const t0 = performance.now();
      const frame = (now: number) => {
        if (token.current !== tok) return resolve(false);
        const t = ms <= 0 ? 1 : Math.min(1, (now - t0) / ms);
        step(t);
        if (t < 1) requestAnimationFrame(frame);
        else resolve(true);
      };
      requestAnimationFrame(frame);
    });

  /** Put a new layer on screen and wait until it's there. */
  const addLayer = async (layer: Omit<Layer, 'id'>, tok: number): Promise<Layer | null> => {
    const l = { ...layer, id: nextId.current++ };
    setLayers((cur) => [...cur, l]);
    for (let i = 0; i < 20 && !els.current.has(l.id); i++) await nextFrame();
    return token.current === tok ? l : null;
  };

  const fly = (id: number, from: Camera, to: Camera, tok: number, w: number, h: number) => {
    if (reduceMotion.current) {
      apply(id, to);
      return Promise.resolve(token.current === tok);
    }
    const f = flight(from, to, w, h);
    return run(f.duration, tok, (t) => apply(id, f.at(easeInOut(t))));
  };

  const transition = async (next: SlideRef, w: number, h: number) => {
    const tok = ++token.current;
    // An interrupted fade: keep only the layer that was coming in.
    let cur = last(layersRef.current);
    if (cur && layersRef.current.length > 1) {
      const keep = cur;
      setLayers([keep]);
      apply(keep.id, null, 1);
    }
    const nextLevel = levelAt(diagram, next.level) ?? diagram;
    const { view, rotation } = slideProjection(next.node, diagram);
    const proj = new Projector(view, rotation);
    const target = fitCamera(slideRect(next.node, nextLevel, proj), w, h, MARGIN);
    shown.current = next;

    // The first slide: start from the whole level, then fly in.
    if (!cur) {
      const whole = fitCamera(sceneBounds(nextLevel, proj, 0), w, h, MARGIN, 1.6);
      const l = await addLayer({ level: next.level, view, rotation, slideId: next.node.id, cam0: whole, opacity0: 1 }, tok);
      if (!l) return;
      cam.current = whole;
      await run(250, tok, () => undefined);
      await fly(l.id, whole, target, tok, w, h);
      return;
    }

    if (sameLevel(cur.level, next.level) && cur.view === view && cur.rotation === rotation) {
      if (cur.slideId !== next.node.id) {
        const id = cur.id;
        setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, slideId: next.node.id } : l)));
      }
      await fly(cur.id, cam.current, target, tok, w, h);
      return;
    }

    const old = cur;
    const oldLevel = levelAt(diagram, old.level) ?? diagram;
    const oldProj = new Projector(old.view, old.rotation);
    const down = next.level.length > old.level.length && sameLevel(old.level, next.level.slice(0, old.level.length));
    const up = old.level.length > next.level.length && sameLevel(next.level, old.level.slice(0, next.level.length));
    let start: Camera;
    let oldEnd: Camera | null = null;

    if (down) {
      // Dive into the component, then let its insides grow out of it.
      const comp = oldLevel.nodes.find((n) => n.id === next.level[old.level.length]);
      if (comp) {
        const compRect = nodeRect(comp, oldProj);
        const close = fitCamera(compRect, w, h, MARGIN * 2.5);
        if (!(await fly(old.id, cam.current, close, tok, w, h))) return;
        start = cameraInto(sceneBounds(nextLevel, proj, 0), toScreen(compRect, close));
      } else start = target;
    } else if (up) {
      // Back out: the component we were inside fills the screen, then the camera pulls back.
      const comp = nextLevel.nodes.find((n) => n.id === old.level[next.level.length]);
      start = comp ? fitCamera(nodeRect(comp, proj), w, h, MARGIN * 2.5) : target;
      const c = cam.current;
      const k = 0.55;
      oldEnd = { zoom: c.zoom * k, x: w / 2 - (w / 2 - c.x) * k, y: h / 2 - (h / 2 - c.y) * k };
    } else {
      // Another branch, or another view: a crossfade with a little glide.
      const k = 0.88;
      start = { zoom: target.zoom * k, x: w / 2 - (w / 2 - target.x) * k, y: h / 2 - (h / 2 - target.y) * k };
    }

    const l = await addLayer({ level: next.level, view, rotation, slideId: next.node.id, cam0: start, opacity0: 0 }, tok);
    if (!l) return;
    cam.current = start;
    const from = cam.current;
    const oldFrom = (() => {
      const t = els.current.get(old.id)?.g.getAttribute('transform') ?? '';
      const m = /translate\(([-\d.e]+) ([-\d.e]+)\) scale\(([-\d.e]+)\)/.exec(t);
      return m ? { x: +m[1], y: +m[2], zoom: +m[3] } : from;
    })();
    const f = flight(from, target, w, h);
    const ms = reduceMotion.current ? FADE : Math.max(f.duration, FADE);
    const ok = await run(ms, tok, (t) => {
      const fade = Math.min(1, (t * ms) / FADE);
      apply(old.id, oldEnd ? { zoom: lerp(oldFrom.zoom, oldEnd.zoom, fade), x: lerp(oldFrom.x, oldEnd.x, fade), y: lerp(oldFrom.y, oldEnd.y, fade) } : null, 1 - fade);
      apply(l.id, reduceMotion.current ? target : f.at(easeInOut(t)), fade);
    });
    if (ok) setLayers((ls) => ls.filter((x) => x.id === l.id));
  };

  // Go to the slide showing whenever it, or the stage, changes.
  const sizeKey = size ? `${Math.round(size.w)}x${Math.round(size.h)}` : '';
  const lastSize = useRef('');
  useEffect(() => {
    if (!size || !current) return;
    const resized = lastSize.current && lastSize.current !== sizeKey;
    lastSize.current = sizeKey;
    const top = last(layersRef.current);
    if (resized && top && shown.current?.node.id === current.node.id) {
      // Same slide, new size: refit at once.
      token.current++;
      const lvl = levelAt(diagram, current.level) ?? diagram;
      const { view, rotation } = slideProjection(current.node, diagram);
      const c = fitCamera(slideRect(current.node, lvl, new Projector(view, rotation)), size.w, size.h, MARGIN);
      setLayers([top]);
      apply(top.id, c, 1);
      return;
    }
    void transition(current, size.w, size.h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.node.id, sizeKey]);

  // ----- moving through the presentation -----
  const goSlide = useCallback(
    (i: number, atPage: 'first' | 'last' = 'first') => {
      if (i < 0 || i >= slides.length) return;
      const s = slides[i];
      const n = atPage === 'last' ? slidePages(s.node, levelAt(diagram, s.level) ?? diagram).length - 1 : 0;
      setIndex(i);
      setPage(Math.max(0, n));
      setDetour(null);
    },
    [slides, diagram],
  );
  const next = useCallback(() => {
    if (detour) return setDetour(null);
    if (page < pages.length - 1) setPage(page + 1);
    else goSlide(index + 1);
  }, [detour, page, pages.length, index, goSlide]);
  const prev = useCallback(() => {
    if (detour) return setDetour(null);
    if (page > 0) setPage(page - 1);
    else goSlide(index - 1, 'last');
  }, [detour, page, index, goSlide]);

  const fullScreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen?.().catch(() => undefined);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.closest?.('input,textarea,select,[contenteditable="true"]')) return;
      const k = e.key;
      // On a focused button, Space presses it rather than moving on as well.
      if (k === ' ' && (e.target as HTMLElement)?.closest?.('button,a')) return;
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ') next();
      else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') prev();
      else if (k === 'Home') goSlide(0);
      else if (k === 'End') goSlide(slides.length - 1);
      else if (k === 'f' || k === 'F') fullScreen();
      else if (k === 'd' || k === 'D') setDocsOpen((o) => !o);
      else if (k === 'Escape' && detour) setDetour(null);
      else if (k === 'Escape' && !document.fullscreenElement) onExit?.();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goSlide, slides.length, onExit, detour]);

  // The slide number lives in the hash, so reloading or going back keeps the place.
  useEffect(() => {
    if (!useHash || !slides.length) return;
    const want = `#${index + 1}`;
    if (window.location.hash !== want) history.replaceState(history.state, '', want);
  }, [useHash, index, slides.length]);
  useEffect(() => {
    if (!useHash) return;
    const onHash = () => {
      const n = Number(/^#(\d+)$/.exec(window.location.hash)?.[1]);
      if (n >= 1 && n <= slides.length && n - 1 !== index) goSlide(n - 1);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [useHash, slides.length, index, goSlide]);

  // Clicking an item opens its docs, without leaving the slide.
  const onStageClick = (e: RMouseEvent) => {
    const el = e.target as Element;
    const nodeId = el.closest('[data-node-id]')?.getAttribute('data-node-id');
    const edgeId = el.closest('[data-edge-id]')?.getAttribute('data-edge-id');
    const t: DocTarget | null = nodeId ? { kind: 'node', id: nodeId } : edgeId ? { kind: 'edge', id: edgeId } : null;
    if (!t) return;
    setDetour(t);
    setDocsOpen(true);
  };

  // A new page starts at the top of the panel.
  const docsBody = useRef<HTMLDivElement>(null);
  useEffect(() => {
    docsBody.current?.scrollTo?.({ top: 0 });
  }, [index, page, detour]);

  // ----- what the docs panel shows -----
  const shownTarget: DocTarget | null = detour ?? (pageNow?.kind === 'doc' ? pageNow.target : null);
  const focus = hover ?? (shownTarget && shownTarget.kind !== 'diagram' ? shownTarget : null);
  const crumbs = current ? levelNodes(diagram, current.level).map((n) => n.label?.trim() || 'Component') : [];

  let panel: React.ReactNode = null;
  if (current) {
    const doc = shownTarget ? pageDoc(shownTarget, diagram, current.level, siteTitle) : null;
    panel = (
      <aside className="isd-present-docs" aria-label="Slide docs" onPointerUp={(e) => (e.target as HTMLElement).closest('button')?.blur()}>
        <div className="isd-present-docs-head">
          <span className="isd-present-kicker">
            Slide {index + 1} of {slides.length}
            {crumbs.length > 0 && <> · Inside {crumbs.join(' › ')}</>}
          </span>
          <h2>{current.node.label?.trim() || `Slide ${index + 1}`}</h2>
        </div>
        <div className="isd-present-docs-body" ref={docsBody}>
          {detour && (
            <button type="button" className="isd-present-back" onClick={() => setDetour(null)}>
              <Icon name="left" size={14} /> Back to the slide
            </button>
          )}
          {!detour && pageNow?.kind === 'notes' ? (
            <IsoDocView key={`notes-${current.node.id}`} markdown={current.node.notes ?? ''} diagram={levelDiagram} onNavigate={setDetour} onMentionHover={setHover} theme={resolvedTheme} />
          ) : doc ? (
            <>
              <h3>{doc.title}</h3>
              {doc.markdown.trim() ? (
                <IsoDocView key={shownTarget ? JSON.stringify(shownTarget) : ''} markdown={doc.markdown} diagram={levelDiagram} onNavigate={setDetour} onMentionHover={setHover} theme={resolvedTheme} />
              ) : (
                <p className="isd-present-empty">No docs written for this yet.</p>
              )}
            </>
          ) : (
            <p className="isd-present-empty">Nothing to read on this slide. Click an item to see its docs.</p>
          )}
        </div>
        {pages.length > 1 && !detour && (
          <div className="isd-present-pages" aria-label="Pages on this slide">
            {pages.map((p, i) => (
              <button
                key={i}
                type="button"
                className={i === page ? 'is-current' : ''}
                aria-current={i === page ? 'step' : undefined}
                title={p.kind === 'notes' ? 'Notes' : pageDoc(p.target, diagram, current.level, siteTitle).title}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
        )}
      </aside>
    );
  }

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <div ref={rootRef} className={`isd-present${docsOpen && current ? ' has-docs' : ''}${className ? ` ${className}` : ''}`} data-theme={resolvedTheme} style={style}>
        <div ref={stageRef} className="isd-present-stage" style={{ background: CANVAS_BG[resolvedTheme] }} onClick={onStageClick}>
          {layers.map((l) => (
            <LayerView key={l.id} layer={l} root={diagram} focus={l.id === last(layers)?.id ? focus : null} register={register} />
          ))}
          {!slides.length && (
            <div className="isd-present-none">
              <h2>No slides yet</h2>
              <p>In the editor, drag a Slide from the shapes palette around what you want to show, and give it a title. Each slide becomes a stop in the presentation.</p>
              {onExit && (
                <button type="button" className="isd-btn" onClick={onExit}>
                  Back
                </button>
              )}
            </div>
          )}
          {slides.length > 0 && (
            <>
              <div className="isd-present-progress" aria-hidden>
                <span style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
              </div>
              {/* Buttons let go of the focus after a click, so Space and the arrows keep moving through the slides. */}
              <div className="isd-present-bar" onClick={(e) => e.stopPropagation()} onPointerUp={(e) => (e.target as HTMLElement).closest('button')?.blur()}>
                <button type="button" onClick={prev} disabled={index === 0 && page === 0 && !detour} aria-label="Back (←)" title="Back (←)">
                  <Icon name="left" />
                </button>
                <span className="isd-present-count">
                  {index + 1} / {slides.length}
                </span>
                <button type="button" onClick={next} disabled={index === slides.length - 1 && page >= pages.length - 1 && !detour} aria-label="Next (→)" title="Next (→)">
                  <Icon name="right" />
                </button>
                <span className="isd-present-sep" />
                <button type="button" onClick={() => setDocsOpen((o) => !o)} className={docsOpen ? 'is-active' : ''} aria-label={docsOpen ? 'Hide docs (D)' : 'Show docs (D)'} title={docsOpen ? 'Hide docs (D)' : 'Show docs (D)'}>
                  <Icon name="doc" />
                </button>
                <button type="button" onClick={fullScreen} aria-label="Full screen (F)" title="Full screen (F)">
                  <Icon name="expand" />
                </button>
                {onExit && (
                  <button type="button" onClick={onExit} aria-label="Stop presenting (Esc)" title="Stop presenting (Esc)">
                    <Icon name="close" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        {docsOpen && panel}
      </div>
    </ThemeContext.Provider>
  );
}

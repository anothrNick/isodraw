import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { containerOf, isContainer, parentMap } from './containers';
import { DetailContext, DocEditor } from './DocsPanel';
import { DETAIL_BLOCK, levelAt, levelKey, levelNodes, type LevelPath } from './levels';
import { edgeTitle, hasDoc, mentionables, nodeTitle } from './docs';
import type { PublishedViewProps } from './Published';
import { ThemeContext } from './theme';
import { StaticDiagram } from './render';
import { KIND_NAMES } from './shapes';
import { Projector, center } from './geometry';
import type { Diagram, DiagramNode, DocTarget } from './types';

/**
 * A component's page, addressed like a level: the components drilled into,
 * then the component itself. `[]` is the overview.
 */
type Page = LevelPath;
const OVERVIEW: Page = [];

interface TocItem {
  node: DiagramNode;
  page: Page;
  /** What sits in its area, then what is in its detail diagram. */
  children: TocItem[];
}

/** Within this many pixels left or right, items count as one column and go top to bottom. */
const SAME_COLUMN = 12;

/**
 * Siblings in reading order, best effort: left to right as the diagram is
 * drawn (its own 2D or 2.5D view), and top to bottom where they line up.
 */
function readingOrder(nodes: DiagramNode[], d: Diagram): DiagramNode[] {
  const proj = new Projector(d.view ?? '3d', 0);
  const at = new Map(nodes.map((n) => [n.id, proj.project(center(n).x, center(n).y, n.z)]));
  return [...nodes].sort((a, b) => {
    const p = at.get(a.id)!;
    const q = at.get(b.id)!;
    return Math.abs(p.x - q.x) > SAME_COLUMN ? p.x - q.x : p.y - q.y;
  });
}

/** Components in reading order, nested under their areas and under the component whose detail they are in. Text labels are left out. */
function tableOfContents(d: Diagram, level: LevelPath = []): TocItem[] {
  const parents = parentMap(d.nodes);
  const byParent = new Map<string | undefined, DiagramNode[]>();
  for (const n of d.nodes) {
    if (n.kind === 'text') continue;
    // Text nodes are never containers, so every parent is itself listed.
    const key = parents.get(n.id);
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(n);
  }
  const build = (key: string | undefined): TocItem[] =>
    readingOrder(byParent.get(key) ?? [], d).map((n) => ({
      node: n,
      page: [...level, n.id],
      children: [...build(n.id), ...(n.detail ? tableOfContents(n.detail, [...level, n.id]) : [])],
    }));
  return build(undefined);
}

/** The items from the top of the contents down to the one for `page`. */
function trailTo(items: TocItem[], page: Page): TocItem[] {
  for (const item of items) {
    if (levelKey(item.page) === levelKey(page)) return [item];
    const rest = trailTo(item.children, page);
    if (rest.length) return [item, ...rest];
  }
  return [];
}

function siteTitle(d: Diagram, title?: string): string {
  if (title) return title;
  const t = d.nodes.find((n) => n.kind === 'text' && n.text?.trim());
  return t?.text?.split('\n')[0].trim() || 'Architecture';
}

/** `#/node/<id>`, or `#/node/<id>/<id>…` for a component inside detail diagrams. */
function readHash(): Page {
  const m = /^#\/(?:node\/)?(.+)$/.exec(window.location.hash);
  return m ? m[1].split('/').filter(Boolean).map(decodeURIComponent) : OVERVIEW;
}
const hashOf = (p: Page) => (p.length ? `#/node/${levelKey(p)}` : '#/');

/** The item whose @ mention is under the pointer; the page's diagram outlines it. */
const FocusContext = createContext<{ focus: DocTarget | null; setFocus: (t: DocTarget | null) => void }>({
  focus: null,
  setFocus: () => undefined,
});

function ReadOnlyDoc({ markdown, diagram, onNavigate }: { markdown: string; diagram: Diagram; onNavigate: (t: DocTarget) => void }) {
  const { setFocus } = useContext(FocusContext);
  return (
    <DocEditor
      markdown={markdown}
      editable={false}
      items={() => mentionables(diagram)}
      onChange={() => undefined}
      onNavigate={onNavigate}
      onMentionHover={setFocus}
    />
  );
}

export default function PublishedView({ diagram, title, useHash, resolvedTheme, className, style }: PublishedViewProps) {
  const toc = useMemo(() => tableOfContents(diagram), [diagram]);
  const [page, setPage] = useState<Page>(() => (useHash ? readHash() : OVERVIEW));
  const [focus, setFocus] = useState<DocTarget | null>(null);
  const focusValue = useMemo(() => ({ focus, setFocus }), [focus]);
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingAnchor = useRef<string | null>(null);
  const name = siteTitle(diagram, title);
  // The page's component, and the level it is drawn on. A page that no longer exists shows the overview.
  const level = page.slice(0, -1);
  const levelDiagram = page.length ? levelAt(diagram, level) : undefined;
  const current = levelDiagram?.nodes.find((n) => n.id === page[page.length - 1]);
  const at: LevelPath = current ? level : [];

  // Areas start open, so the contents show the whole top diagram; detail diagrams start closed.
  // The way to the current page is always open.
  const [open, setOpen] = useState<Set<string>>(() => {
    const keys = new Set<string>();
    const walk = (items: TocItem[]) =>
      items.forEach((t) => {
        if (isContainer(t.node)) keys.add(levelKey(t.page));
        walk(t.children);
      });
    walk(toc);
    return keys;
  });
  const trail = current ? trailTo(toc, page) : [];
  useEffect(() => {
    if (!trail.length) return;
    setOpen((cur) => {
      const missing = trail.slice(0, -1).filter((t) => !cur.has(levelKey(t.page)));
      return missing.length ? new Set([...cur, ...missing.map((t) => levelKey(t.page))]) : cur;
    });
  }, [levelKey(page)]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = (key: string) =>
    setOpen((cur) => {
      const next = new Set(cur);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  useEffect(() => {
    if (!useHash) return;
    const onHash = () => setPage(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [useHash]);

  // New page: start at the top, or at the connection a mention pointed to.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const anchor = pendingAnchor.current && el.querySelector<HTMLElement>(`[data-anchor="${pendingAnchor.current}"]`);
    pendingAnchor.current = null;
    if (anchor) anchor.scrollIntoView({ block: 'start' });
    else el.scrollTop = 0;
  }, [levelKey(page)]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (p: Page, anchor?: string) => {
    pendingAnchor.current = anchor ?? null;
    if (useHash) {
      const hash = hashOf(p);
      if (window.location.hash !== hash) window.location.hash = hash;
      else setPage(p);
    } else {
      setPage(p);
    }
  };

  /** Follow a mention in a doc on level `lv`: mentions name items on their own level. */
  const navigate = (lv: LevelPath) => (t: DocTarget) => {
    const d = levelAt(diagram, lv);
    if (!d || t.kind === 'diagram') go(lv.length ? lv : OVERVIEW);
    else if (t.kind === 'node') go(d.nodes.some((n) => n.id === t.id) ? [...lv, t.id] : OVERVIEW);
    else {
      const e = d.edges.find((x) => x.id === t.id);
      if (e) go([...lv, e.from], `edge-${e.id}`);
    }
  };

  const link = (p: Page, label: React.ReactNode, cls?: string) => (
    <a href={useHash ? hashOf(p) : '#'} className={cls} aria-current={levelKey(p) === levelKey(current ? page : OVERVIEW) ? 'page' : undefined} onClick={(e) => (e.preventDefault(), go(p))}>
      {label}
    </a>
  );

  const renderToc = (items: TocItem[]) => (
    <ul>
      {items.map((item) => {
        const key = levelKey(item.page);
        const expanded = open.has(key);
        return (
          <li key={key}>
            <div className="isd-pub-toc-row">
              {item.children.length > 0 ? (
                <button
                  type="button"
                  className="isd-pub-toc-twist"
                  aria-expanded={expanded}
                  aria-label={`${expanded ? 'Collapse' : 'Expand'} ${nodeTitle(item.node)}`}
                  onClick={() => toggle(key)}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                    <path d="M3 1.5 6.5 5 3 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <span className="isd-pub-toc-twist" aria-hidden />
              )}
              {link(item.page, nodeTitle(item.node), hasDoc(item.node.doc) ? undefined : 'is-undocumented')}
            </div>
            {expanded && item.children.length > 0 && renderToc(item.children)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <div ref={rootRef} className={`isd-pub ${className ?? ''}`} data-theme={resolvedTheme} style={style}>
        <div className="isd-pub-layout">
          <nav className="isd-pub-toc" aria-label="Table of contents">
            {link(OVERVIEW, name, 'isd-pub-site')}
            {renderToc(toc)}
          </nav>
          <article className="isd-pub-page" key={levelKey(page)}>
            <FocusContext.Provider value={focusValue}>
              {!current ? (
                <OverviewPage diagram={diagram} name={name} onOpen={go} onNavigate={navigate([])} />
              ) : (
                <ComponentPage root={diagram} level={at} diagram={levelDiagram!} node={current} name={name} onOpen={go} onNavigate={navigate(at)} />
              )}
            </FocusContext.Provider>
          </article>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

/** Icons are usually services or systems, so "Image" undersells them. */
const kindLabel = (n: DiagramNode) => (n.kind === 'image' ? 'Component' : KIND_NAMES[n.kind]);

function OverviewPage({
  diagram,
  name,
  onOpen,
  onNavigate,
}: {
  diagram: Diagram;
  name: string;
  onOpen: (p: Page) => void;
  onNavigate: (t: DocTarget) => void;
}) {
  const { focus } = useContext(FocusContext);
  return (
    <>
      <h1>{name}</h1>
      <figure className="isd-pub-figure">
        <StaticDiagram diagram={diagram} focus={focus} maxHeight={520} onNodeClick={(id) => onOpen([id])} label={`${name} architecture diagram`} />
      </figure>
      {hasDoc(diagram.doc) && (
        <section className="isd-pub-doc">
          <ReadOnlyDoc markdown={diagram.doc!} diagram={diagram} onNavigate={onNavigate} />
        </section>
      )}
    </>
  );
}

function ComponentPage({
  root,
  level,
  diagram,
  node,
  name,
  onOpen,
  onNavigate,
}: {
  root: Diagram;
  /** The components drilled into to reach `diagram`. */
  level: LevelPath;
  /** The diagram the component is drawn in. */
  diagram: Diagram;
  node: DiagramNode;
  name: string;
  onOpen: (p: Page, anchor?: string) => void;
  onNavigate: (t: DocTarget) => void;
}) {
  const { focus } = useContext(FocusContext);
  const areas: DiagramNode[] = [];
  for (let p = containerOf(node, diagram.nodes); p; p = containerOf(p, diagram.nodes)) areas.unshift(p);
  const outer = levelNodes(root, level);
  const inner = [...level, node.id];
  // The detail diagram leads the page, unless the doc places it itself. Otherwise the page shows where the component sits.
  const showDetail = node.detail && !node.doc?.includes(DETAIL_BLOCK);
  const documented = diagram.edges.filter((e) => (e.from === node.id || e.to === node.id) && hasDoc(e.doc));
  const crumb = (p: Page, label: string) => (
    <span key={levelKey(p)}>
      {p.length > 0 && <span aria-hidden>/</span>}
      <a href="#" onClick={(e) => (e.preventDefault(), onOpen(p))}>
        {label}
      </a>
    </span>
  );

  return (
    <>
      <nav className="isd-pub-crumbs" aria-label="Breadcrumbs">
        {crumb(OVERVIEW, name)}
        {/* The components this one is inside, level by level, then its areas on its own level. */}
        {outer.map((c, i) => crumb(level.slice(0, i + 1), nodeTitle(c)))}
        {areas.map((c) => crumb([...level, c.id], nodeTitle(c)))}
      </nav>
      <h1>{nodeTitle(node)}</h1>
      <p className="isd-pub-meta">{kindLabel(node)}</p>

      <figure className="isd-pub-figure">
        {showDetail ? (
          <StaticDiagram diagram={node.detail!} focus={null} maxHeight={360} onNodeClick={(id) => onOpen([...inner, id])} label={`Inside ${nodeTitle(node)}`} />
        ) : (
          <StaticDiagram
            diagram={diagram}
            highlight={node.id}
            focus={focus}
            animate={false}
            maxHeight={300}
            onNodeClick={(id) => onOpen([...level, id])}
            label={`Where ${nodeTitle(node)} sits`}
          />
        )}
      </figure>

      <section className="isd-pub-doc">
        {hasDoc(node.doc) ? (
          <DetailContext.Provider value={{ diagram: node.detail, onItemClick: (id) => onOpen([...inner, id]) }}>
            <ReadOnlyDoc markdown={node.doc!} diagram={diagram} onNavigate={onNavigate} />
          </DetailContext.Provider>
        ) : (
          <p className="isd-pub-empty">No documentation yet.</p>
        )}
      </section>

      {documented.map((e) => (
        <section key={e.id} className="isd-pub-edge" data-anchor={`edge-${e.id}`}>
          <h2>{edgeTitle(e, diagram.nodes)}</h2>
          <ReadOnlyDoc markdown={e.doc!} diagram={diagram} onNavigate={onNavigate} />
        </section>
      ))}
    </>
  );
}

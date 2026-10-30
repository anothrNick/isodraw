import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { containerOf, isContainer, parentMap } from './containers';
import { DetailContext, DocEditor } from './DocsPanel';
import { DETAIL_BLOCK, detailSize, levelAt, levelKey, levelNodes, type LevelPath } from './levels';
import { componentScene, edgeTitle, hasDoc, mentionables, nodeTitle } from './docs';
import type { PublishedViewProps } from './Published';
import { ThemeContext } from './theme';
import { Icon } from './ui';
import { StaticDiagram } from './render';
import { endMarkerOf, lineStyleOf, startMarkerOf } from './routing';
import { KIND_NAMES } from './shapes';
import type { Diagram, DiagramEdge, DiagramNode, DocTarget } from './types';

/**
 * A component's page, addressed like a level: the components drilled into,
 * then the component itself. `[]` is the overview.
 */
type Page = LevelPath;
const OVERVIEW: Page = [];

interface TocEntry {
  node: DiagramNode;
  depth: number;
  page: Page;
}

/**
 * Components in diagram order, nested under the areas that contain them and
 * then under the component whose detail diagram they are in. Text labels are left out.
 */
function tableOfContents(d: Diagram, level: LevelPath = [], depth0 = 0): TocEntry[] {
  const parents = parentMap(d.nodes);
  const children = new Map<string | undefined, DiagramNode[]>();
  for (const n of d.nodes) {
    if (n.kind === 'text') continue;
    // Text nodes are never containers, so every parent is itself listed.
    const key = parents.get(n.id);
    if (!children.has(key)) children.set(key, []);
    children.get(key)!.push(n);
  }
  const out: TocEntry[] = [];
  const walk = (key: string | undefined, depth: number) => {
    const list = children.get(key) ?? [];
    // Diagram order, which usually follows the flow the author drew.
    for (const n of list) {
      out.push({ node: n, depth, page: [...level, n.id] });
      walk(n.id, depth + 1);
      if (n.detail) out.push(...tableOfContents(n.detail, [...level, n.id], depth + 1));
    }
  };
  walk(undefined, depth0);
  return out;
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
const samePage = (a: Page, b: Page) => levelKey(a) === levelKey(b);

/** One-line description of how a connection is drawn and animated. */
function edgeStyleSummary(e: DiagramEdge): string {
  const bits: string[] = [];
  const style = lineStyleOf(e);
  if (style !== 'solid') bits.push(style);
  if (startMarkerOf(e) !== 'none' && endMarkerOf(e) !== 'none') bits.push('two-way');
  if (e.animation && e.animation !== 'none') bits.push(e.animation === 'packets' ? 'data flow' : e.animation);
  return bits.join(' · ');
}

/** The item whose @ mention is under the pointer; the page's diagrams outline it. */
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
  const [tocOpen, setTocOpen] = useState(false);
  const [focus, setFocus] = useState<DocTarget | null>(null);
  const focusValue = useMemo(() => ({ focus, setFocus }), [focus]);
  const mainRef = useRef<HTMLElement>(null);
  const pendingAnchor = useRef<string | null>(null);
  const name = siteTitle(diagram, title);
  // The page's component, and the level it is drawn on. A page that no longer exists shows the overview.
  const level = page.slice(0, -1);
  const levelDiagram = page.length ? levelAt(diagram, level) : undefined;
  const current = levelDiagram?.nodes.find((n) => n.id === page[page.length - 1]);
  const at: LevelPath = current ? level : [];

  useEffect(() => {
    if (!useHash) return;
    const onHash = () => setPage(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [useHash]);

  // New page: start at the top, or at the connection a mention pointed to.
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const anchor = pendingAnchor.current && main.querySelector<HTMLElement>(`[data-anchor="${pendingAnchor.current}"]`);
    pendingAnchor.current = null;
    if (anchor) anchor.scrollIntoView({ block: 'start' });
    else main.scrollTop = 0;
  }, [levelKey(page)]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (p: Page, anchor?: string) => {
    pendingAnchor.current = anchor ?? null;
    setTocOpen(false);
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

  const order = [OVERVIEW, ...toc.map((t) => t.page)];
  const idx = current ? order.findIndex((p) => samePage(p, page)) : 0;
  const prev = idx > 0 ? order[idx - 1] : undefined;
  const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : undefined;
  const pageTitle = (p: Page) => (p.length ? nodeTitle(levelAt(diagram, p.slice(0, -1))!.nodes.find((n) => n.id === p[p.length - 1])!) : 'Overview');

  return (
    <ThemeContext.Provider value={resolvedTheme}>
    <div className={`isd-pub ${tocOpen ? 'toc-open' : ''} ${className ?? ''}`} data-theme={resolvedTheme} style={style}>
      <aside className="isd-pub-toc" aria-label="Table of contents">
        <div className="isd-pub-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2 3 7l9 5 9-5-9-5Z" fill="#60a5fa" />
            <path d="M3 7v10l9 5V12L3 7Z" fill="#2563eb" />
            <path d="M21 7v10l-9 5V12l9-5Z" fill="#1d4ed8" />
          </svg>
          <span>{name}</span>
        </div>
        <nav>
          <a href={useHash ? '#/' : undefined} className={!current ? 'is-active' : ''} onClick={(e) => (e.preventDefault(), go(OVERVIEW))}>
            Overview
          </a>
          <div className="isd-pub-toc-label">Components</div>
          {toc.map(({ node, depth, page: p }) => (
            <a
              key={levelKey(p)}
              href={useHash ? hashOf(p) : undefined}
              className={`${current && samePage(p, page) ? 'is-active' : ''} ${hasDoc(node.doc) ? '' : 'is-undocumented'} ${isContainer(node) ? 'is-area' : ''} ${p.length > 1 ? 'is-inside' : ''}`}
              style={{ paddingLeft: 12 + depth * 14 }}
              onClick={(e) => (e.preventDefault(), go(p))}
              title={hasDoc(node.doc) ? undefined : 'No documentation yet'}
            >
              {nodeTitle(node)}
              {node.detail && (
                <span className="isd-pub-toc-detail" title="Has a detail diagram">
                  <Icon name="layers" size={11} />
                </span>
              )}
            </a>
          ))}
        </nav>
      </aside>

      <main className="isd-pub-main" ref={mainRef}>
        <button type="button" className="isd-pub-toc-toggle" onClick={() => setTocOpen(!tocOpen)} aria-expanded={tocOpen}>
          ☰ Contents
        </button>
        <article className="isd-pub-page" key={levelKey(page)}>
          <FocusContext.Provider value={focusValue}>
            {!current ? (
              <OverviewPage diagram={diagram} name={name} toc={toc} onOpen={go} onNavigate={navigate([])} />
            ) : (
              <ComponentPage root={diagram} level={at} diagram={levelDiagram!} node={current} onOpen={go} onNavigate={navigate(at)} />
            )}
          </FocusContext.Provider>
          <nav className="isd-pub-pager" aria-label="Pages">
            {prev ? (
              <a href="#" onClick={(e) => (e.preventDefault(), go(prev))}>
                <small>Previous</small>
                {pageTitle(prev)}
              </a>
            ) : (
              <span />
            )}
            {next && (
              <a href="#" className="is-next" onClick={(e) => (e.preventDefault(), go(next))}>
                <small>Next</small>
                {pageTitle(next)}
              </a>
            )}
          </nav>
        </article>
      </main>
    </div>
    </ThemeContext.Provider>
  );
}

/** Icons are usually services or systems, so "Image" undersells them. */
const kindLabel = (n: DiagramNode) => (n.kind === 'image' ? 'Component' : KIND_NAMES[n.kind]);

function firstSentence(md?: string): string {
  if (!md) return '';
  const text = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[@([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^[#>\-*|].*$/gm, (l) => (l.startsWith('#') || l.startsWith('|') ? '' : l.replace(/^[>\-*]\s*(\[[ x]\]\s*)?/, '')))
    .replace(/[*`]/g, '')
    // Emphasis underscores only, so identifiers like aws_vpc keep theirs.
    .replace(/\b_+|_+\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const m = /^(.{0,160}?[.!?])(\s|$)/.exec(text);
  return m ? m[1] : text.slice(0, 160);
}

function OverviewPage({
  diagram,
  name,
  toc,
  onOpen,
  onNavigate,
}: {
  diagram: Diagram;
  name: string;
  toc: TocEntry[];
  onOpen: (p: Page) => void;
  onNavigate: (t: DocTarget) => void;
}) {
  const documented = toc.filter((t) => hasDoc(t.node.doc)).length;
  const { focus } = useContext(FocusContext);
  return (
    <>
      <header className="isd-pub-head">
        <h1>{name}</h1>
        <p className="isd-pub-meta">
          {toc.length} components · {diagram.edges.length} connections · {documented} documented
        </p>
      </header>
      <figure className="isd-pub-figure">
        <StaticDiagram diagram={diagram} focus={focus} maxHeight={560} onNodeClick={(id) => onOpen([id])} label={`${name} architecture diagram`} />
        <figcaption>Click a component to open its page.</figcaption>
      </figure>
      {hasDoc(diagram.doc) && (
        <section className="isd-pub-doc">
          <ReadOnlyDoc markdown={diagram.doc!} diagram={diagram} onNavigate={onNavigate} />
        </section>
      )}
      <section>
        <h2 className="isd-pub-h2">Components</h2>
        <ul className="isd-pub-index">
          {toc
            .filter((t) => t.depth === 0 || hasDoc(t.node.doc))
            .map(({ node, page }) => (
              <li key={levelKey(page)}>
                <a href="#" onClick={(e) => (e.preventDefault(), onOpen(page))}>
                  {nodeTitle(node)}
                </a>
                <small>{kindLabel(node)}</small>
                {hasDoc(node.doc) && <p>{firstSentence(node.doc)}</p>}
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}

function ComponentPage({
  root,
  level,
  diagram,
  node,
  onOpen,
  onNavigate,
}: {
  root: Diagram;
  /** The components drilled into to reach `diagram`. */
  level: LevelPath;
  /** The diagram the component is drawn in. */
  diagram: Diagram;
  node: DiagramNode;
  onOpen: (p: Page, anchor?: string) => void;
  onNavigate: (t: DocTarget) => void;
}) {
  const chain: DiagramNode[] = [];
  for (let p = containerOf(node, diagram.nodes); p; p = containerOf(p, diagram.nodes)) chain.unshift(p);
  const scene = componentScene(diagram, node.id);
  const { focus } = useContext(FocusContext);
  const children = diagram.nodes.filter((n) => n.kind !== 'text' && containerOf(n, diagram.nodes)?.id === node.id);
  const edges = diagram.edges.filter((e) => e.from === node.id || e.to === node.id);
  /** The page of another item on this level. */
  const here = (id: string): Page => [...level, id];
  const outer = levelNodes(root, level);
  /** What the detail diagram holds, for links into it. */
  const inside = node.detail ? tableOfContents(node.detail, [...level, node.id]).filter((t) => t.depth === 0) : [];
  const nameOf = (id: string) => {
    const n = diagram.nodes.find((x) => x.id === id);
    return n ? nodeTitle(n) : 'Unknown';
  };

  return (
    <>
      <nav className="isd-pub-crumbs" aria-label="Breadcrumbs">
        <a href="#" onClick={(e) => (e.preventDefault(), onOpen(OVERVIEW))}>
          Overview
        </a>
        {/* The components this one is inside, level by level, then its areas on its own level. */}
        {outer.map((c, i) => (
          <span key={`level-${c.id}`}>
            <span aria-hidden>›</span>
            <a href="#" onClick={(e) => (e.preventDefault(), onOpen(level.slice(0, i + 1)))}>
              {nodeTitle(c)}
            </a>
          </span>
        ))}
        {chain.map((c) => (
          <span key={c.id}>
            <span aria-hidden>›</span>
            <a href="#" onClick={(e) => (e.preventDefault(), onOpen(here(c.id)))}>
              {nodeTitle(c)}
            </a>
          </span>
        ))}
      </nav>
      <header className="isd-pub-head">
        <h1>{nodeTitle(node)}</h1>
        <p className="isd-pub-meta">
          <span className="isd-pub-pill">{kindLabel(node)}</span>
          {chain.length > 0 ? (
            <span>in {nodeTitle(chain[chain.length - 1])}</span>
          ) : (
            outer.length > 0 && <span>inside {nodeTitle(outer[outer.length - 1])}</span>
          )}
        </p>
      </header>

      <div className="isd-pub-hero">
        <figure className="isd-pub-figure is-component">
          <StaticDiagram diagram={scene} focus={focus} maxHeight={isContainer(node) ? 320 : 190} label={nodeTitle(node)} />
        </figure>
        <figure className="isd-pub-figure is-context" title="Where it sits in the overall architecture">
          <StaticDiagram diagram={diagram} highlight={node.id} focus={focus} animate={false} maxHeight={180} onNodeClick={(id) => onOpen(here(id))} label="Context" />
          <figcaption>Where it sits</figcaption>
        </figure>
      </div>

      {/* A doc places the detail diagram itself with a detail block; otherwise it comes first. */}
      {node.detail && !node.doc?.includes(DETAIL_BLOCK) && (
        <section>
          <h2 className="isd-pub-h2">Detail</h2>
          <figure className="isd-pub-figure">
            <StaticDiagram
              diagram={node.detail}
              focus={null}
              maxHeight={360}
              onNodeClick={(id) => onOpen([...level, node.id, id])}
              label={`${nodeTitle(node)} detail`}
            />
            <figcaption>
              {detailSize(node.detail)} item{detailSize(node.detail) === 1 ? '' : 's'} inside {nodeTitle(node)}. Click one to open its page.
            </figcaption>
          </figure>
        </section>
      )}

      <section className="isd-pub-doc">
        {hasDoc(node.doc) ? (
          <DetailContext.Provider value={{ diagram: node.detail, onItemClick: (id) => onOpen([...level, node.id, id]) }}>
            <ReadOnlyDoc markdown={node.doc!} diagram={diagram} onNavigate={onNavigate} />
          </DetailContext.Provider>
        ) : (
          <p className="isd-pub-empty">No documentation for this component yet.</p>
        )}
      </section>

      {inside.length > 0 && (
        <section>
          <h2 className="isd-pub-h2">Inside {nodeTitle(node)}</h2>
          <ul className="isd-pub-index is-compact">
            {inside.map(({ node: c, page }) => (
              <li key={c.id}>
                <a href="#" onClick={(e) => (e.preventDefault(), onOpen(page))}>
                  {nodeTitle(c)}
                </a>
                <small>{kindLabel(c)}</small>
              </li>
            ))}
          </ul>
        </section>
      )}

      {children.length > 0 && (
        <section>
          <h2 className="isd-pub-h2">Contains</h2>
          <ul className="isd-pub-index is-compact">
            {children.map((c) => (
              <li key={c.id}>
                <a href="#" onClick={(e) => (e.preventDefault(), onOpen(here(c.id)))}>
                  {nodeTitle(c)}
                </a>
                <small>{kindLabel(c)}</small>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="isd-pub-connections">
        <h2 className="isd-pub-h2">Connections</h2>
        {edges.length === 0 ? (
          <p className="isd-pub-empty">No connections.</p>
        ) : (
          <>
            <table className="isd-pub-table">
              <thead>
                <tr>
                  <th>Direction</th>
                  <th>Component</th>
                  <th>Label</th>
                  <th>Style</th>
                </tr>
              </thead>
              <tbody>
                {edges.map((e) => {
                  const out = e.from === node.id;
                  const other = out ? e.to : e.from;
                  return (
                    <tr key={e.id}>
                      <td>{out ? '→ Outgoing' : '← Incoming'}</td>
                      <td>
                        <a href="#" onClick={(ev) => (ev.preventDefault(), onOpen(here(other)))}>
                          {nameOf(other)}
                        </a>
                      </td>
                      <td>{e.label || '—'}</td>
                      <td>
                        <span className="isd-pub-swatch" style={{ background: e.color }} /> {edgeStyleSummary(e) || 'solid'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {edges
              .filter((e) => hasDoc(e.doc))
              .map((e) => (
                <div key={e.id} className="isd-pub-edge" data-anchor={`edge-${e.id}`}>
                  <h3>{edgeTitle(e, diagram.nodes)}</h3>
                  <ReadOnlyDoc markdown={e.doc!} diagram={diagram} onNavigate={onNavigate} />
                </div>
              ))}
          </>
        )}
      </section>
    </>
  );
}

import { containerOf, isContainer, parentMap } from './containers';
import { KIND_NAMES } from './shapes';
import type { Diagram, DiagramEdge, DiagramNode, DocTarget } from './types';

/**
 * Documentation helpers. Docs are Markdown strings on nodes, edges and the
 * diagram. Mentions of other items are stored as ordinary Markdown links with
 * an `isodraw:` URL (`[@ALB](isodraw:node/alb)`), so the Markdown stays
 * readable anywhere.
 */

export const MENTION_SCHEME = 'isodraw:';

export const hasDoc = (md?: string) => !!md && md.trim().length > 0;

export const sameTarget = (a: DocTarget, b: DocTarget) =>
  a.kind === b.kind && (a.kind === 'diagram' || a.id === (b as { id: string }).id);

export const targetKey = (t: DocTarget) => (t.kind === 'diagram' ? 'diagram' : `${t.kind}/${t.id}`);

export function mentionHref(t: DocTarget): string {
  return `${MENTION_SCHEME}${targetKey(t)}`;
}

export function parseMentionHref(href: string): DocTarget | null {
  if (!href.startsWith(MENTION_SCHEME)) return null;
  const rest = href.slice(MENTION_SCHEME.length);
  if (rest === 'diagram') return { kind: 'diagram' };
  const m = /^(node|edge)\/(.+)$/.exec(rest);
  return m ? { kind: m[1] as 'node' | 'edge', id: decodeURIComponent(m[2]) } : null;
}

export function nodeTitle(n: DiagramNode): string {
  return n.label?.trim() || (n.kind === 'text' ? n.text?.split('\n')[0]?.trim() : '') || KIND_NAMES[n.kind];
}

export function edgeTitle(e: DiagramEdge, nodes: DiagramNode[]): string {
  const a = nodes.find((n) => n.id === e.from);
  const b = nodes.find((n) => n.id === e.to);
  const route = `${a ? nodeTitle(a) : '?'} → ${b ? nodeTitle(b) : '?'}`;
  return e.label?.trim() ? `${e.label.trim()} (${route})` : route;
}

export function titleOf(t: DocTarget, d: Diagram): string {
  if (t.kind === 'diagram') return 'Diagram';
  if (t.kind === 'node') {
    const n = d.nodes.find((x) => x.id === t.id);
    return n ? nodeTitle(n) : 'Missing item';
  }
  const e = d.edges.find((x) => x.id === t.id);
  return e ? edgeTitle(e, d.nodes) : 'Missing connection';
}

export function exists(t: DocTarget, d: Diagram): boolean {
  if (t.kind === 'diagram') return true;
  return t.kind === 'node' ? d.nodes.some((n) => n.id === t.id) : d.edges.some((e) => e.id === t.id);
}

export function docOf(t: DocTarget, d: Diagram): string {
  if (t.kind === 'diagram') return d.doc ?? '';
  if (t.kind === 'node') return d.nodes.find((n) => n.id === t.id)?.doc ?? '';
  return d.edges.find((e) => e.id === t.id)?.doc ?? '';
}

export function withDoc(d: Diagram, t: DocTarget, md: string): Diagram {
  const doc = hasDoc(md) ? md : undefined;
  if (t.kind === 'diagram') return { ...d, doc };
  if (t.kind === 'node') return { ...d, nodes: d.nodes.map((n) => (n.id === t.id ? { ...n, doc } : n)) };
  return { ...d, edges: d.edges.map((e) => (e.id === t.id ? { ...e, doc } : e)) };
}

/** Diagram › outer area › … › parent, for a node's doc page. */
export function breadcrumbs(t: DocTarget, d: Diagram): DocTarget[] {
  const crumbs: DocTarget[] = [{ kind: 'diagram' }];
  if (t.kind !== 'node') return crumbs;
  const n = d.nodes.find((x) => x.id === t.id);
  const chain: DocTarget[] = [];
  let p = n && containerOf(n, d.nodes);
  while (p) {
    chain.unshift({ kind: 'node', id: p.id });
    p = containerOf(p, d.nodes);
  }
  return [...crumbs, ...chain];
}

export interface Mentionable {
  target: DocTarget;
  title: string;
  /** Short kind label, e.g. "Block" or "Connection". */
  kind: string;
}

export function mentionables(d: Diagram): Mentionable[] {
  return [
    ...d.nodes.map((n) => ({ target: { kind: 'node', id: n.id } as DocTarget, title: nodeTitle(n), kind: KIND_NAMES[n.kind] })),
    ...d.edges.map((e) => ({ target: { kind: 'edge', id: e.id } as DocTarget, title: edgeTitle(e, d.nodes), kind: 'Connection' })),
  ];
}

// ---------- export ----------

const anchorId = (t: DocTarget) => targetKey(t).replace('/', '-');

/**
 * All documentation as one Markdown file: the diagram doc, then each documented
 * item nested under the areas that contain it, then connections. Mentions
 * become links to the matching section.
 */
export function exportDocsMarkdown(d: Diagram, title = 'Architecture'): string {
  const parents = parentMap(d.nodes);
  const children = new Map<string | undefined, DiagramNode[]>();
  for (const n of d.nodes) {
    const p = parents.get(n.id);
    if (!children.has(p)) children.set(p, []);
    children.get(p)!.push(n);
  }
  const hasDocInside = (n: DiagramNode): boolean => hasDoc(n.doc) || (children.get(n.id) ?? []).some(hasDocInside);
  // Sections that will exist in the output, so mentions only link to real anchors.
  const sections = new Set<string>([
    ...d.nodes.filter(hasDocInside).map((n) => targetKey({ kind: 'node', id: n.id })),
    ...d.edges.filter((e) => hasDoc(e.doc)).map((e) => targetKey({ kind: 'edge', id: e.id })),
  ]);
  const fixMentions = (md: string) =>
    md.replace(/\[@((?:\\.|[^\]])*)\]\(isodraw:([^)]+)\)/g, (_whole, label: string, rest: string) => {
      const t = parseMentionHref(MENTION_SCHEME + rest);
      if (t && sections.has(targetKey(t))) return `[@${label}](#${anchorId(t)})`;
      return `**@${label}**`;
    });
  /** Push a doc's headings down just enough to nest under a section at `level`. */
  const nest = (md: string, level: number) => {
    const levels = [...md.matchAll(/^(#{1,6})\s/gm)].map((m) => m[1].length);
    if (!levels.length) return md;
    const by = Math.max(0, level + 1 - Math.min(...levels));
    return md.replace(/^(#{1,6})(?=\s)/gm, (h) => '#'.repeat(Math.min(6, h.length + by)));
  };

  const out: string[] = [`# ${title}`, ''];
  if (hasDoc(d.doc)) out.push(fixMentions(nest(d.doc!.trim(), 1)), '');

  const walk = (nodes: DiagramNode[], level: number) => {
    // Containers first, then everything else, each in diagram order.
    const sorted = [...nodes.filter(isContainer), ...nodes.filter((n) => !isContainer(n))];
    for (const n of sorted) {
      if (!hasDocInside(n)) continue;
      const t: DocTarget = { kind: 'node', id: n.id };
      out.push(`<a id="${anchorId(t)}"></a>`, '', `${'#'.repeat(Math.min(6, level))} ${nodeTitle(n)}`, '');
      out.push(`_${KIND_NAMES[n.kind]}_`, '');
      if (hasDoc(n.doc)) out.push(fixMentions(nest(n.doc!.trim(), level)), '');
      walk(children.get(n.id) ?? [], level + 1);
    }
  };
  walk(children.get(undefined) ?? [], 2);

  const documentedEdges = d.edges.filter((e) => hasDoc(e.doc));
  if (documentedEdges.length) {
    out.push('## Connections', '');
    for (const e of documentedEdges) {
      const t: DocTarget = { kind: 'edge', id: e.id };
      out.push(`<a id="${anchorId(t)}"></a>`, '', `### ${edgeTitle(e, d.nodes)}`, '', fixMentions(nest(e.doc!.trim(), 3)), '');
    }
  }
  return `${out.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

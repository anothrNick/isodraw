import type { Diagram } from '../../lib';

/**
 * Example docs are written as one Markdown file per diagram. Each section
 * starts with a marker naming what it documents:
 *
 *   <!-- diagram -->        the overview
 *   <!-- node:alb -->       a component or area
 *   <!-- edge:e4 -->        a connection
 *
 * `<!-- embed:name -->` inside a section becomes an embedded diagram.
 */
export function withDocs(d: Diagram, markdown: string, embeds: Record<string, Diagram> = {}): Diagram {
  const docs = new Map<string, string>();
  const parts = markdown.split(/^<!-- (diagram|(?:node|edge):[\w-]+) -->$/m);
  for (let i = 1; i < parts.length; i += 2) {
    const body = parts[i + 1].replace(/<!-- embed:([\w-]+) -->/g, (_m, name: string) => {
      const embed = embeds[name];
      if (!embed) throw new Error(`Unknown embed "${name}"`);
      return '```isodraw\n' + JSON.stringify(embed) + '\n```';
    });
    docs.set(parts[i], body.trim());
  }
  if (import.meta.env.DEV) {
    const known = new Set(['diagram', ...d.nodes.map((n) => `node:${n.id}`), ...d.edges.map((e) => `edge:${e.id}`)]);
    for (const key of docs.keys()) if (!known.has(key)) console.warn(`Example docs: no item for <!-- ${key} -->`);
  }
  return {
    ...d,
    doc: docs.get('diagram') ?? d.doc,
    nodes: d.nodes.map((n) => (docs.has(`node:${n.id}`) ? { ...n, doc: docs.get(`node:${n.id}`) } : n)),
    edges: d.edges.map((e) => (docs.has(`edge:${e.id}`) ? { ...e, doc: docs.get(`edge:${e.id}`) } : e)),
  };
}

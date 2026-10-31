import { describe, expect, it } from 'vitest';
import { parseDiagram, type Diagram } from '../lib';
import { exists, parseMentionHref } from '../lib/docs';
import { withDocs } from './docs';
import { EXAMPLES } from './examples';
import kubernetesDocs from './docs/kubernetes.md?raw';
import serverlessDocs from './docs/serverless.md?raw';
import streamingDocs from './docs/streaming.md?raw';
import threeTierDocs from './docs/three-tier.md?raw';

const SOURCES: Record<string, string> = {
  'three-tier': threeTierDocs,
  serverless: serverlessDocs,
  streaming: streamingDocs,
  kubernetes: kubernetesDocs,
};

const allDocs = (d: Diagram) => [d.doc ?? '', ...d.nodes.map((n) => n.doc ?? ''), ...d.edges.map((e) => e.doc ?? '')];

describe('withDocs', () => {
  const base: Diagram = {
    version: 1,
    nodes: [{ id: 'api', kind: 'block', x: 0, y: 0, z: 0, w: 2, d: 2, h: 1, color: '#4f8cf7' }],
    edges: [],
  };

  it('assigns each marked section to its item', () => {
    const d = withDocs(base, '<!-- diagram -->\n\nOverview\n\n<!-- node:api -->\n\n## API\n');
    expect(d.doc).toBe('Overview');
    expect(d.nodes[0].doc).toBe('## API');
  });

  it('inlines embedded diagrams and rejects unknown ones', () => {
    const d = withDocs(base, '<!-- node:api -->\n<!-- embed:inner -->', { inner: base });
    expect(d.nodes[0].doc).toBe('```isodraw\n' + JSON.stringify(base) + '\n```');
    expect(() => withDocs(base, '<!-- node:api -->\n<!-- embed:missing -->')).toThrow(/Unknown embed "missing"/);
  });
});

describe.each(EXAMPLES.map((e) => [e.id, e] as const))('example %s', (id, example) => {
  const d = example.diagram;

  it('is a valid diagram with no dangling connections', () => {
    const parsed = parseDiagram(JSON.parse(JSON.stringify(d)));
    expect(parsed.nodes).toHaveLength(d.nodes.length);
    expect(parsed.edges).toHaveLength(d.edges.length);
    expect(new Set(d.nodes.map((n) => n.id)).size).toBe(d.nodes.length);
  });

  // Hand-written docs only; the Terraform example's docs are generated.
  it.skipIf(!SOURCES[id])('documents only items that exist', () => {
    const markers = [...SOURCES[id].matchAll(/^<!-- ((?:node|edge):[\w-]+) -->$/gm)].map((m) => m[1]);
    expect(markers.length).toBeGreaterThan(0);
    for (const m of markers) {
      const [kind, itemId] = m.split(':') as ['node' | 'edge', string];
      expect(exists({ kind, id: itemId }, d), m).toBe(true);
    }
  });

  it('has a doc for the diagram and every component', () => {
    expect(d.doc?.trim()).toBeTruthy();
    const undocumented = d.nodes.filter((n) => n.kind !== 'text' && !n.doc?.trim()).map((n) => n.id);
    expect(undocumented).toEqual([]);
  });

  it('only mentions items in the same diagram', () => {
    for (const md of allDocs(d)) {
      for (const [, href] of md.matchAll(/\]\((isodraw:[^)]+)\)/g)) {
        const t = parseMentionHref(href);
        expect(t, href).not.toBeNull();
        expect(exists(t!, d), href).toBe(true);
      }
    }
  });

  it('only shows detail diagrams in components that have one', () => {
    for (const n of d.nodes) {
      if (n.doc?.includes('```isodraw-detail')) expect(n.detail, n.id).toBeTruthy();
    }
  });

  it('embeds valid diagrams', () => {
    for (const md of allDocs(d)) {
      for (const [, json] of md.matchAll(/```isodraw\n([\s\S]*?)\n```/g)) {
        expect(() => parseDiagram(JSON.parse(json))).not.toThrow();
      }
    }
  });
});

import { describe, expect, it } from 'vitest';
import {
  breadcrumbs,
  componentScene,
  docOf,
  edgeTitle,
  exportDocsMarkdown,
  mentionHref,
  nodeTitle,
  parseMentionHref,
  titleOf,
  withDoc,
} from './docs';
import type { Diagram, DiagramEdge, DiagramNode } from './types';

const node = (id: string, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  id,
  kind: 'block',
  x: 0,
  y: 0,
  z: 0,
  w: 2,
  d: 2,
  h: 1,
  color: '#4f8cf7',
  ...extra,
});
const edge = (id: string, from: string, to: string, extra: Partial<DiagramEdge> = {}): DiagramEdge => ({
  id,
  from,
  to,
  color: '#475569',
  width: 2,
  routing: 'orthogonal',
  ...extra,
});

// A VPC holding a subnet holding the API and DB; a client outside.
const vpc = node('vpc', { kind: 'area', x: 0, y: 0, w: 20, d: 20, h: 0, label: 'VPC' });
const subnet = node('subnet', { kind: 'area', x: 2, y: 2, w: 10, d: 10, h: 0, label: 'Private subnet' });
const api = node('api', { x: 3, y: 3, label: 'API' });
const db = node('db', { kind: 'cylinder', x: 7, y: 3, label: 'DB' });
const client = node('client', { x: 30, y: 0, label: 'Client' });
const diagram: Diagram = {
  version: 1,
  view: '2d',
  nodes: [vpc, subnet, api, db, client],
  edges: [edge('e1', 'client', 'api'), edge('e2', 'api', 'db', { label: 'SQL' })],
};

describe('mention links', () => {
  it('round-trip every kind of target', () => {
    for (const t of [{ kind: 'diagram' }, { kind: 'node', id: 'alb' }, { kind: 'edge', id: 'e4' }] as const) {
      expect(parseMentionHref(mentionHref(t))).toEqual(t);
    }
  });

  it('ignore other links', () => {
    expect(parseMentionHref('https://example.com')).toBeNull();
    expect(parseMentionHref('isodraw:widget/x')).toBeNull();
  });
});

describe('titles', () => {
  it('prefer the label, then text, then the kind name', () => {
    expect(nodeTitle(api)).toBe('API');
    expect(nodeTitle(node('t', { kind: 'text', text: 'First line\nsecond' }))).toBe('First line');
    expect(nodeTitle(node('c', { kind: 'cone' }))).toBe('Cone');
  });

  it('describe connections by their ends', () => {
    expect(edgeTitle(diagram.edges[0], diagram.nodes)).toBe('Client → API');
    expect(edgeTitle(diagram.edges[1], diagram.nodes)).toBe('SQL (API → DB)');
    expect(titleOf({ kind: 'node', id: 'gone' }, diagram)).toBe('Missing item');
  });
});

describe('withDoc', () => {
  it('sets and clears docs on each kind of target', () => {
    let d = withDoc(diagram, { kind: 'node', id: 'db' }, 'Postgres 16');
    d = withDoc(d, { kind: 'edge', id: 'e1' }, 'HTTPS');
    d = withDoc(d, { kind: 'diagram' }, 'Overview');
    expect(docOf({ kind: 'node', id: 'db' }, d)).toBe('Postgres 16');
    expect(docOf({ kind: 'edge', id: 'e1' }, d)).toBe('HTTPS');
    expect(d.doc).toBe('Overview');

    const cleared = withDoc(d, { kind: 'node', id: 'db' }, '  \n');
    expect(cleared.nodes.find((n) => n.id === 'db')!.doc).toBeUndefined();
  });

  it('returns the same diagram when the doc does not change', () => {
    const d = withDoc(diagram, { kind: 'node', id: 'db' }, 'Postgres 16');
    expect(withDoc(d, { kind: 'node', id: 'db' }, 'Postgres 16\n')).toBe(d);
    expect(withDoc(d, { kind: 'edge', id: 'e1' }, '')).toBe(d);
  });
});

describe('breadcrumbs', () => {
  it('list the areas a node sits in, outermost first', () => {
    expect(breadcrumbs({ kind: 'node', id: 'db' }, diagram)).toEqual([
      { kind: 'diagram' },
      { kind: 'node', id: 'vpc' },
      { kind: 'node', id: 'subnet' },
    ]);
    expect(breadcrumbs({ kind: 'node', id: 'client' }, diagram)).toEqual([{ kind: 'diagram' }]);
  });
});

describe('componentScene', () => {
  it('takes an area with everything inside it and the connections between those', () => {
    const scene = componentScene(diagram, 'subnet');
    expect(scene.nodes.map((n) => n.id).sort()).toEqual(['api', 'db', 'subnet']);
    expect(scene.edges.map((e) => e.id)).toEqual(['e2']);
    expect(scene.view).toBe('2d');
  });
});

describe('exportDocsMarkdown', () => {
  const documented: Diagram = {
    ...diagram,
    doc: '## Overview\n\nThe [@API](isodraw:node/api) talks to [@Client](isodraw:node/client).',
    nodes: diagram.nodes.map((n) => (n.id === 'api' ? { ...n, doc: '# Endpoints\n\nGET /orders' } : n)),
    edges: diagram.edges.map((e) => (e.id === 'e2' ? { ...e, doc: 'Pooled connections.' } : e)),
  };
  const md = exportDocsMarkdown(documented, 'Shop');

  it('links mentions of documented items and bolds the rest', () => {
    expect(md).toContain('[@API](#node-api)');
    expect(md).toContain('**@Client**');
    expect(md).not.toContain('isodraw:');
  });

  it('nests documented items under the areas that hold them', () => {
    const headings = md.split('\n').filter((l) => l.startsWith('#'));
    expect(headings).toEqual([
      '# Shop',
      '## Overview',
      '## VPC',
      '### Private subnet',
      '#### API',
      '##### Endpoints',
      '## Connections',
      '### SQL (API → DB)',
    ]);
  });

  it('adds an anchor for every section', () => {
    expect(md).toContain('<a id="node-api"></a>');
    expect(md).toContain('<a id="edge-e2"></a>');
    expect(md.endsWith('\n')).toBe(true);
    expect(md).not.toMatch(/\n{3,}/);
  });
});

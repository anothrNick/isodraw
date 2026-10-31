import { describe, expect, it } from 'vitest';
import { DETAIL_BLOCK, levelAt, levelKey, levelNodes, liftEmbeds, sameLevel, validLevel, withLevel } from './levels';
import { parseDiagram } from './shapes';
import type { Diagram, DiagramNode } from './types';

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
  label: id.toUpperCase(),
  ...extra,
});

// top › api › worker
const worker: Diagram = { version: 1, nodes: [node('queue'), node('handler')], edges: [] };
const api: Diagram = { version: 1, nodes: [node('worker', { detail: worker }), node('cache')], edges: [] };
const root: Diagram = { version: 1, view: '2d', nodes: [node('api', { detail: api }), node('db')], edges: [] };

describe('levels', () => {
  it('finds the diagram at a level', () => {
    expect(levelAt(root, [])).toBe(root);
    expect(levelAt(root, ['api'])).toBe(api);
    expect(levelAt(root, ['api', 'worker'])).toBe(worker);
    expect(levelAt(root, ['db'])).toBeUndefined();
    expect(levelAt(root, ['nope', 'worker'])).toBeUndefined();
  });

  it('lists the components drilled into and trims a broken path', () => {
    expect(levelNodes(root, ['api', 'worker']).map((n) => n.id)).toEqual(['api', 'worker']);
    expect(validLevel(root, ['api', 'gone', 'x'])).toEqual(['api']);
    expect(validLevel(root, ['db'])).toEqual([]);
  });

  it('replaces a nested level and leaves everything else shared', () => {
    const next = withLevel(root, ['api', 'worker'], (d) => ({ ...d, nodes: [...d.nodes, node('dlq')] }));
    expect(levelAt(next, ['api', 'worker'])!.nodes.map((n) => n.id)).toEqual(['queue', 'handler', 'dlq']);
    expect(next.view).toBe('2d');
    expect(next.nodes[1]).toBe(root.nodes[1]);
    expect(levelAt(next, ['api'])!.nodes[1]).toBe(api.nodes[1]);
    // The original is untouched.
    expect(worker.nodes).toHaveLength(2);
  });

  it('returns the same diagram when nothing changes or the level is gone', () => {
    expect(withLevel(root, ['api'], (d) => d)).toBe(root);
    expect(withLevel(root, ['gone'], () => ({ version: 1, nodes: [], edges: [] }))).toBe(root);
  });

  it('compares and keys paths', () => {
    expect(sameLevel(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(sameLevel(['a'], ['a', 'b'])).toBe(false);
    expect(levelKey(['a/b', 'c'])).toBe('a%2Fb/c');
  });
});

describe('parseDiagram with detail diagrams', () => {
  it('parses detail diagrams at every depth', () => {
    const json = JSON.parse(JSON.stringify(root)) as Diagram;
    // Old files may leave out z and h; detail diagrams get the same defaults.
    delete (json.nodes[0].detail!.nodes[0].detail!.nodes[0] as Partial<DiagramNode>).z;
    const d = parseDiagram(json);
    expect(levelAt(d, ['api', 'worker'])!.nodes[0].z).toBe(0);
  });

  it('drops a malformed detail diagram but keeps the component', () => {
    const d = parseDiagram({ version: 1, nodes: [{ ...node('api'), detail: { nodes: 'nope' } }], edges: [] });
    expect(d.nodes[0].id).toBe('api');
    expect(d.nodes[0].detail).toBeUndefined();
  });
});

describe('liftEmbeds', () => {
  const inner: Diagram = { version: 1, nodes: [node('step')], edges: [], doc: 'never shown' };
  const embed = (d: Diagram) => '```isodraw\n' + JSON.stringify(d) + '\n```';

  it("turns a component's first embedded diagram into its detail", () => {
    const d: Diagram = {
      version: 1,
      nodes: [node('api', { doc: `Intro\n\n${embed(inner)}\n\nMore\n\n${embed(worker)}` })],
      edges: [],
    };
    const out = liftEmbeds(d);
    const api = out.nodes[0];
    expect(api.detail!.nodes.map((n) => n.id)).toEqual(['step']);
    expect(api.detail!.doc).toBeUndefined();
    expect(api.doc).toBe(`Intro\n\n${DETAIL_BLOCK}\n\nMore\n\n${embed(worker)}`);
  });

  it('leaves components that already have a detail, text labels and broken embeds alone', () => {
    const d: Diagram = {
      version: 1,
      nodes: [
        node('api', { detail: worker, doc: embed(inner) }),
        node('note', { kind: 'text', text: 'Hi', doc: embed(inner) }),
        node('bad', { doc: '```isodraw\n{nope\n```' }),
      ],
      edges: [],
    };
    expect(liftEmbeds(d)).toBe(d);
  });

  it('lifts embeds inside detail diagrams too', () => {
    const d: Diagram = { version: 1, nodes: [node('api', { detail: { version: 1, nodes: [node('fn', { doc: embed(inner) })], edges: [] } })], edges: [] };
    expect(levelAt(liftEmbeds(d), ['api', 'fn'])!.nodes[0].id).toBe('step');
  });
});

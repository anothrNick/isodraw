import { describe, expect, it } from 'vitest';
import { exportJson } from './export';
import { createEdge, createShape, migrateEdge, parseDiagram } from './shapes';
import type { Diagram, DiagramEdge } from './types';
import { sampleDiagram } from '../demo/sample';

describe('createShape', () => {
  it('centers the shape on the point and applies the kind defaults', () => {
    const n = createShape('cylinder', 10, 10);
    expect(n).toMatchObject({ kind: 'cylinder', w: 2, d: 2, h: 1.5, x: 9, y: 9, z: 0, color: '#3fb27f' });
  });

  it('lets extra fields override the defaults', () => {
    const n = createShape('block', 0, 0, { w: 4, color: '#000000', label: 'DB' });
    expect(n).toMatchObject({ w: 4, d: 2, x: -2, y: -1, color: '#000000', label: 'DB' });
  });

  it('gives every shape a fresh id', () => {
    expect(createShape('block', 0, 0).id).not.toBe(createShape('block', 0, 0).id);
  });
});

describe('migrateEdge', () => {
  it('converts the pre-0.2 dashed and arrow fields', () => {
    const legacy = { id: 'e', from: 'a', to: 'b', color: '#000', width: 2, dashed: true, arrowStart: true, arrowEnd: false } as DiagramEdge;
    const e = migrateEdge(legacy);
    expect(e).toMatchObject({ lineStyle: 'dashed', startMarker: 'arrow', endMarker: 'none' });
    expect(e).not.toHaveProperty('dashed');
    expect(e).not.toHaveProperty('arrowStart');
  });

  it('keeps current fields as they are', () => {
    const e = createEdge('a', 'b', { lineStyle: 'dotted', startMarker: 'circle' });
    expect(migrateEdge(e)).toMatchObject({ lineStyle: 'dotted', startMarker: 'circle', endMarker: 'arrow' });
  });
});

describe('parseDiagram', () => {
  const a = createShape('block', 0, 0);
  const b = createShape('block', 5, 0);

  it('rejects anything that is not a diagram', () => {
    expect(() => parseDiagram(null)).toThrow(/Not an IsoDraw diagram/);
    expect(() => parseDiagram({ nodes: [] })).toThrow();
    expect(() => parseDiagram('nope')).toThrow();
  });

  it('drops connections to missing nodes', () => {
    const d = parseDiagram({ nodes: [a, b], edges: [createEdge(a.id, b.id), createEdge(a.id, 'gone')] });
    expect(d.edges).toHaveLength(1);
    expect(d.edges[0]).toMatchObject({ from: a.id, to: b.id });
  });

  it('fills in missing elevation and height', () => {
    const { z: _z, h: _h, ...bare } = a;
    expect(parseDiagram({ nodes: [bare], edges: [] }).nodes[0]).toMatchObject({ z: 0, h: 0 });
  });

  it('keeps the diagram doc and a valid view setting', () => {
    expect(parseDiagram({ nodes: [], edges: [], doc: '# Hi', view: '2d' })).toMatchObject({ doc: '# Hi', view: '2d' });
    expect(parseDiagram({ nodes: [], edges: [], view: 'sideways' })).not.toHaveProperty('view');
  });

  it('round-trips a diagram through JSON export unchanged once normalized', () => {
    const d = parseDiagram({ ...sampleDiagram, view: '2d' } satisfies Diagram);
    expect(d.nodes).toHaveLength(sampleDiagram.nodes.length);
    expect(d.edges).toHaveLength(sampleDiagram.edges.length);
    expect(parseDiagram(JSON.parse(exportJson(d)))).toEqual(d);
  });
});

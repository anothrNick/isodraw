import { describe, expect, it } from 'vitest';
import { isContainer } from './containers';
import { followPins, layoutLevel } from './layout';
import { layoutSequence } from './sequenceLayout';
import { createShape } from './shapes';
import type { Diagram, DiagramEdge, DiagramNode } from './types';

const node = (id: string, x: number, y: number, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  id, kind: 'block', label: id, x, y, z: 0, w: 2, d: 2, h: 1, color: '#4f8cf7', placed: 'auto', ...extra,
});
const msg = (id: string, from: string, to: string, line: number): DiagramEdge => ({
  id, from, to, color: '#334155', width: 1.6, routing: 'straight', fromAnchor: { side: 'e', t: 0.5, line }, toAnchor: { side: 'w', t: 0.5, line },
});

describe('notes', () => {
  it('are flat, keep their text, and are not laid out on their own', () => {
    const n = createShape('note', 0, 0, { text: 'Remember this' });
    expect(n.kind).toBe('note');
    expect(n.text).toBe('Remember this');
    const d: Diagram = { version: 1, nodes: [node('a', 0, 0), node('b', 20, 0), { ...n, id: 'n', x: 40, y: 40 }], edges: [{ id: 'ab', from: 'a', to: 'b', color: '#000', width: 2, routing: 'orthogonal' }] };
    const laid = layoutLevel(d);
    expect(laid.nodes.find((x) => x.id === 'n')).toMatchObject({ x: 40, y: 40 });
  });

  it('follow the item they are pinned to, by hand and through layout', () => {
    const d: Diagram = { version: 1, nodes: [node('a', 0, 0), node('b', 20, 0), { ...createShape('note', 0, 0, { text: 'on a' }), id: 'n', x: 3, y: -1, pin: 'a' }], edges: [{ id: 'ab', from: 'a', to: 'b', color: '#000', width: 2, routing: 'orthogonal' }] };
    const moved = followPins(d, { ...d, nodes: d.nodes.map((x) => (x.id === 'a' ? { ...x, x: 5, y: 7 } : x)) });
    expect(moved.nodes.find((x) => x.id === 'n')).toMatchObject({ x: 8, y: 6 });
    const laid = layoutLevel(d);
    const a = laid.nodes.find((x) => x.id === 'a')!;
    const n = laid.nodes.find((x) => x.id === 'n')!;
    expect(n.x - a.x).toBe(3);
    expect(n.y - a.y).toBe(-1);
  });
});

describe('frames', () => {
  it('hold what is inside them, like areas, without the fill', () => {
    const f = createShape('frame', 5, 5, { label: 'loop' });
    expect(isContainer(f)).toBe(true);
    expect(f.opacity).toBeUndefined();
  });

  it('stretch over the same messages when a sequence is tidied', () => {
    const a = node('a', 0, 0, { lifeline: 4, d: 1 });
    const b = node('b', 6, 0, { lifeline: 4, d: 1 });
    // Messages piled on one row, and a frame meant to span the second and third of them.
    const d: Diagram = {
      version: 1,
      nodes: [a, b, { ...createShape('frame', 0, 0, { label: 'loop' }), id: 'f', x: -1, y: 3.95, w: 10, d: 0.2 }],
      edges: [msg('m1', 'a', 'b', 2), msg('m2', 'b', 'a', 2.1), msg('m3', 'a', 'b', 2.2), msg('m4', 'b', 'a', 2.3)],
    };
    const out = layoutSequence(d)!.diagram;
    const at = (id: string) => {
      const e = out.edges.find((x) => x.id === id)!;
      const n = out.nodes.find((x) => x.id === e.from)!;
      return n.y + n.d + (n.label ? 0.9 : 0.2) + e.fromAnchor!.line!;
    };
    const f = out.nodes.find((x) => x.id === 'f')!;
    expect(f.y).toBeLessThan(at('m2'));
    expect(f.y + f.d).toBeGreaterThan(at('m3'));
    expect(f.y + f.d).toBeLessThan(at('m4'));
  });
});

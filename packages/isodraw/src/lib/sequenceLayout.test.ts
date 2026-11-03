import { describe, expect, it } from 'vitest';
import { signInSequence } from '../demo/sequence';
import { layoutLevel } from './layout';
import { lineTop } from './lifelines';
import type { Diagram, DiagramEdge, DiagramNode } from './types';

const node = (id: string, x: number, y: number, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  id, kind: 'block', label: id, x, y, z: 0, w: 2, d: 1, h: 0.4, color: '#4f8cf7', lifeline: 3, ...extra,
});
const msg = (id: string, from: string, to: string, line: number, extra: Partial<DiagramEdge> = {}): DiagramEdge => ({
  id, from, to, color: '#334155', width: 1.6, routing: 'straight',
  fromAnchor: { side: 'e', t: 0.5, line }, toAnchor: { side: 'w', t: 0.5, line }, ...extra,
});

// The pile-up: lifelines too short, so every message sits on the same row, and participants crowded together.
const piled = (): Diagram => ({
  version: 1,
  view: '2d',
  nodes: [node('a', 0, 0), node('b', 3, -1, { d: 2 }), node('c', 7, 0), node('db', 30, 30, { lifeline: undefined, kind: 'cylinder' })],
  edges: [
    msg('m1', 'a', 'b', 3),
    msg('m2', 'b', 'c', 3),
    msg('m3', 'c', 'c', 3, { routing: 'orthogonal', toAnchor: { side: 'e', t: 0.5, line: 3 } }),
    msg('m4', 'c', 'b', 3, { lineStyle: 'dashed' }),
    msg('m5', 'b', 'a', 3, { lineStyle: 'dashed' }),
    { id: 'x', from: 'b', to: 'db', color: '#000', width: 2, routing: 'orthogonal' },
  ],
});

const heightOn = (d: Diagram, e: DiagramEdge) => lineTop(d.nodes.find((n) => n.id === e.from)!).y + e.fromAnchor!.line!;

describe('Tidy on a sequence', () => {
  const d = layoutLevel(piled());
  const get = (id: string) => d.nodes.find((n) => n.id === id)!;

  it('puts participants in a row, bottoms lined up, at least a column apart', () => {
    const [a, b, c] = ['a', 'b', 'c'].map(get);
    expect(a.y + a.d).toBe(b.y + b.d);
    expect(b.y + b.d).toBe(c.y + c.d);
    expect(b.x + b.w / 2 - (a.x + a.w / 2)).toBeGreaterThanOrEqual(6);
    expect(c.x + c.w / 2 - (b.x + b.w / 2)).toBeGreaterThanOrEqual(6);
  });

  it('gives every message its own row, in order, on lines long enough', () => {
    const ys = ['m1', 'm2', 'm3', 'm4', 'm5'].map((id) => heightOn(d, d.edges.find((e) => e.id === id)!));
    for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1]).toBeGreaterThan(1);
    for (const e of d.edges.filter((e) => e.id.startsWith('m'))) {
      expect(e.fromAnchor!.line).toBeLessThanOrEqual(get(e.from).lifeline!);
      expect(e.toAnchor!.line).toBeLessThanOrEqual(get(e.to).lifeline!);
      if (e.from !== e.to) expect(heightOn(d, e)).toBeCloseTo(lineTop(get(e.to)).y + e.toAnchor!.line!);
    }
  });

  it('points messages the right way and loops self calls to the right', () => {
    const m5 = d.edges.find((e) => e.id === 'm5')!;
    expect([m5.fromAnchor!.side, m5.toAnchor!.side]).toEqual(['w', 'e']);
    const m3 = d.edges.find((e) => e.id === 'm3')!;
    expect(m3.toAnchor!.line! - m3.fromAnchor!.line!).toBeCloseTo(0.6);
    expect(m3.waypoints![0].x).toBeCloseTo(lineTop(get('c')).x + 2.4);
  });

  it('lays out everything else beside the sequence', () => {
    const db = get('db');
    expect(db.x).toBeGreaterThan(get('c').x + get('c').w + 3);
    // Its connection into the sequence is routed afresh for where db is now.
    expect(d.edges.find((e) => e.id === 'x')!.routed).toBe('auto');
  });

  it('keeps the sign-in template in order, its note between the same messages', () => {
    const before = signInSequence();
    const after = layoutLevel(before);
    const order = (x: Diagram) => [...x.edges].sort((p, q) => heightOn(x, p) - heightOn(x, q)).map((e) => e.id);
    expect(order(after)).toEqual(order(before));
    const note = after.nodes.find((n) => n.id === 'note')!;
    const at = (id: string) => heightOn(after, after.edges.find((e) => e.id === id)!);
    expect(note.y).toBeGreaterThan(at('m7'));
    expect(note.y).toBeLessThan(at('m8'));
    expect(layoutLevel(after).nodes).toEqual(after.nodes);
  });
});

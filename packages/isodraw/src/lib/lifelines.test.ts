import { describe, expect, it } from 'vitest';
import { activations, lifelineBars, lifelineRoute, lineTop, onLifeline, withBars } from './lifelines';
import { anchorPoint } from './routing';
import type { Diagram, DiagramEdge, DiagramNode } from './types';

const part = (id: string, x: number): DiagramNode => ({ id, kind: 'block', x, y: 0, w: 2, d: 1, h: 0.4, z: 0, color: '#4f8cf7', lifeline: 10 });
const a = part('a', 0);
const b = part('b', 6);
// Lines start 0.2 below unlabeled nodes: at y 1.2, x 1 and 7.
const at = (y: number) => ({ y });

describe('lifelines', () => {
  it('know where they are', () => {
    expect(lineTop(a)).toEqual({ x: 1, y: 1.2 });
    expect(onLifeline(a, { x: 1.3, y: 5 })).toBe(true);
    expect(onLifeline(a, { x: 3, y: 5 })).toBe(false);
    expect(onLifeline(a, { x: 1, y: 20 })).toBe(false);
    expect(onLifeline({ ...a, lifeline: undefined }, { x: 1, y: 5 })).toBe(false);
  });

  it('turn a drawn connection into a level message at the starting height', () => {
    const r = lifelineRoute(a, { x: 1, ...at(4.1) }, b, { x: 7, ...at(6) })!;
    expect(r.routing).toBe('straight');
    expect(r.fromAnchor).toEqual({ side: 'e', t: 0.5, line: 3 });
    expect(r.toAnchor).toEqual({ side: 'w', t: 0.5, line: 3 });
    // Both ends at the same height, at the bars' edges.
    expect(anchorPoint(a, r.fromAnchor!)).toEqual({ x: 1.18, y: 4.2 });
    expect(anchorPoint(b, r.toAnchor!)).toEqual({ x: 6.82, y: 4.2 });
  });

  it('make a self call from a lifeline back to itself, and leave other connections alone', () => {
    const r = lifelineRoute(a, { x: 1, ...at(3.2) }, a, { x: 1, ...at(3.3) })!;
    expect(r.routing).toBe('orthogonal');
    expect([r.fromAnchor!.line, r.toAnchor!.line]).toEqual([2, 2.75]);
    expect(r.waypoints).toHaveLength(2);
    const plain = { ...b, lifeline: undefined };
    expect(lifelineRoute({ ...a, lifeline: undefined }, { x: 1, y: 0.5 }, plain, { x: 7, y: 0.5 })).toBeNull();
  });

  it('draw activation bars from calls in and returns out', () => {
    const msg = (id: string, from: string, to: string, line: number, dashed = false): DiagramEdge => ({
      id,
      from,
      to,
      color: '#000',
      width: 1,
      routing: 'straight',
      ...(dashed ? { lineStyle: 'dashed' as const } : {}),
      fromAnchor: { side: 'e', t: 0.5, line },
      toAnchor: { side: 'w', t: 0.5, line },
    });
    const d: Diagram = { version: 1, nodes: [a, b], edges: [msg('m1', 'a', 'b', 1), msg('m2', 'b', 'a', 3, true), msg('m3', 'a', 'b', 5)] };
    expect(activations(d, b)).toEqual([
      { from: 1, to: 3 },
      { from: 5, to: 5.5 },
    ]);
    expect(activations(d, a)).toEqual([]);
  });
});

describe('activation bars placed by hand', () => {
  const msg = (id: string, from: string, to: string, line: number, dashed = false): DiagramEdge => ({
    id,
    from,
    to,
    color: '#000',
    width: 1,
    routing: 'straight',
    ...(dashed ? { lineStyle: 'dashed' as const } : {}),
    fromAnchor: { side: 'e', t: 0.5, line },
    toAnchor: { side: 'w', t: 0.5, line },
  });
  const d: Diagram = { version: 1, nodes: [a, b], edges: [msg('m1', 'a', 'b', 1), msg('m2', 'b', 'a', 3, true)] };

  it('start from the automatic ones, then stay as placed', () => {
    expect(lifelineBars(d, b)).toEqual([{ from: 1, to: 3, depth: 0 }]);
    // The first edit keeps what was showing, plus the change.
    const placed = withBars(d, b, (bars) => [...bars, { from: 4, to: 5, depth: 0 }]);
    expect(placed.activationBars).toEqual([
      { from: 1, to: 3 },
      { from: 4, to: 5 },
    ]);
    // Placed bars no longer follow the messages.
    expect(lifelineBars({ ...d, edges: [] }, placed)).toHaveLength(2);
    // Kept on the line, and never shorter than a quarter unit.
    expect(withBars(d, b, () => [{ from: 9, to: 40 }, { from: 2, to: 1 }]).activationBars).toEqual([
      { from: 9, to: 10 },
      { from: 2, to: 2.25 },
    ]);
  });

  it('put message ends at the edge of the outermost bar, or on the line where there is none', () => {
    const nested = { ...b, activationBars: [{ from: 1, to: 5 }, { from: 2, to: 3, depth: 1 }] };
    expect(anchorPoint(nested, { side: 'e', t: 0.5, line: 2.5 }).x).toBeCloseTo(7.36);
    expect(anchorPoint(nested, { side: 'w', t: 0.5, line: 2.5 }).x).toBeCloseTo(6.82);
    expect(anchorPoint(nested, { side: 'w', t: 0.5, line: 8 }).x).toBe(7);
    // Hidden bars: no bars, so straight to the line's default offset.
    expect(lifelineBars(d, { ...nested, lifelineBars: false })).toEqual([]);
  });
});

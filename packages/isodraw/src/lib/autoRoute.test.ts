import { describe, expect, it } from 'vitest';
import { routeEdges } from './autoRoute';
import { resolveEdge } from './routing';
import type { Diagram, DiagramEdge, DiagramNode } from './types';

const node = (id: string, x: number, y: number, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  id, kind: 'block', label: id, x, y, z: 0, w: 2, d: 2, h: 1, color: '#4f8cf7', ...extra,
});
const edge = (id: string, from: string, to: string, extra: Partial<DiagramEdge> = {}): DiagramEdge => ({ id, from, to, color: '#475569', width: 2, routing: 'orthogonal', ...extra });

const routeOf = (d: Diagram, id: string) => {
  const e = d.edges.find((x) => x.id === id)!;
  const [a, b] = [d.nodes.find((n) => n.id === e.from)!, d.nodes.find((n) => n.id === e.to)!];
  return resolveEdge(e, a, b, routeEdges(d)).pts;
};
const segments = (pts: { x: number; y: number }[]) => pts.slice(1).map((p, i) => [pts[i], p] as const);
/** Does a polyline pass through the inside of a node? */
const through = (pts: { x: number; y: number }[], n: DiagramNode) =>
  segments(pts).some(([p, q]) => {
    for (let k = 0; k <= 20; k++) {
      const x = p.x + ((q.x - p.x) * k) / 20;
      const y = p.y + ((q.y - p.y) * k) / 20;
      if (x > n.x && x < n.x + n.w && y > n.y && y < n.y + n.d) return true;
    }
    return false;
  });

describe('routeEdges', () => {
  it('goes around an item in the way', () => {
    const d: Diagram = { version: 1, nodes: [node('a', 0, 0), node('wall', 5, -0.5, { d: 3 }), node('b', 10, 0)], edges: [edge('ab', 'a', 'b')] };
    const pts = routeOf(d, 'ab');
    expect(through(pts, d.nodes[1])).toBe(false);
    // Without the router, the line runs straight through it.
    const [a, b] = [d.nodes[0], d.nodes[2]];
    expect(through(resolveEdge(d.edges[0], a, b).pts, d.nodes[1])).toBe(true);
  });

  it('keeps lines that would share a track apart', () => {
    // Two lines from a to c and b to d, both wanting the same corridor.
    const d: Diagram = {
      version: 1,
      nodes: [node('a', 0, 0), node('b', 0, 6), node('c', 12, 6), node('d', 12, 0)],
      edges: [edge('ac', 'a', 'c'), edge('bd', 'b', 'd')],
    };
    const [p, q] = [segments(routeOf(d, 'ac')), segments(routeOf(d, 'bd'))];
    const shared = p.some(([a, b]) =>
      q.some(([c, e]) => {
        if (Math.abs(a.x - b.x) < 1e-6 && Math.abs(c.x - e.x) < 1e-6 && Math.abs(a.x - c.x) < 0.05)
          return Math.min(Math.max(a.y, b.y), Math.max(c.y, e.y)) - Math.max(Math.min(a.y, b.y), Math.min(c.y, e.y)) > 0.05;
        if (Math.abs(a.y - b.y) < 1e-6 && Math.abs(c.y - e.y) < 1e-6 && Math.abs(a.y - c.y) < 0.05)
          return Math.min(Math.max(a.x, b.x), Math.max(c.x, e.x)) - Math.max(Math.min(a.x, b.x), Math.min(c.x, e.x)) > 0.05;
        return false;
      }),
    );
    expect(shared).toBe(false);
  });

  it('spreads lines leaving the same side, at least a grid step apart', () => {
    const d: Diagram = {
      version: 1,
      nodes: [node('hub', 0, 0, { d: 3 }), node('x', 10, -4), node('y', 10, 0.5), node('z', 10, 5)],
      edges: [edge('hx', 'hub', 'x'), edge('hy', 'hub', 'y'), edge('hz', 'hub', 'z')],
    };
    const starts = ['hx', 'hy', 'hz'].map((id) => routeOf(d, id)[0]).filter((p) => p.x > 1.9);
    const ys = starts.map((p) => p.y).sort((a, b) => a - b);
    for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1]).toBeGreaterThanOrEqual(0.5 - 1e-6);
  });

  it('leaves hand-placed bends, curves and lifeline messages alone', () => {
    const d: Diagram = {
      version: 1,
      nodes: [node('a', 0, 0), node('b', 10, 0)],
      edges: [edge('bent', 'a', 'b', { waypoints: [{ x: 5, y: 6 }] }), edge('curve', 'a', 'b', { routing: 'curved' })],
    };
    const routes = routeEdges(d);
    expect(routes.get(d.edges[0], d.nodes[0], d.nodes[1])).toBeUndefined();
    expect(routes.get(d.edges[1], d.nodes[0], d.nodes[1])).toBeUndefined();
  });

  it("ignores its routes for items that aren't the level's own (a drag preview)", () => {
    const d: Diagram = { version: 1, nodes: [node('a', 0, 0), node('b', 10, 0)], edges: [edge('ab', 'a', 'b')] };
    const routes = routeEdges(d);
    expect(routes.get(d.edges[0], d.nodes[0], d.nodes[1])).toBeDefined();
    expect(routes.get(d.edges[0], { ...d.nodes[0], x: 3 }, d.nodes[1])).toBeUndefined();
  });

  it('draws the same routes every time', () => {
    const d = (): Diagram => ({
      version: 1,
      nodes: [node('a', 0, 0), node('b', 0, 6), node('c', 12, 6), node('d', 12, 0), node('m', 6, 3)],
      edges: [edge('ac', 'a', 'c'), edge('bd', 'b', 'd'), edge('am', 'a', 'm'), edge('md', 'm', 'd')],
    });
    expect(routeOf(d(), 'ac')).toEqual(routeOf(d(), 'ac'));
    expect(routeOf(d(), 'md')).toEqual(routeOf(d(), 'md'));
  });
});

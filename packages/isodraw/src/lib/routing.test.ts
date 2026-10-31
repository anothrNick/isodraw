import { describe, expect, it } from 'vitest';
import { anchorPoint, nearestAnchor, orthoRoute, resolveEdge, SIDE_DIR, simplifyPath } from './routing';
import type { Pt } from './geometry';
import type { DiagramNode, Side } from './types';

const node = (id: string, x: number, y: number, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  id,
  kind: 'block',
  x,
  y,
  z: 0,
  w: 2,
  d: 2,
  h: 1,
  color: '#4f8cf7',
  ...extra,
});

const isOrthogonal = (pts: Pt[]) =>
  pts.slice(1).every((p, i) => Math.abs(p.x - pts[i].x) < 1e-9 || Math.abs(p.y - pts[i].y) < 1e-9);

describe('simplifyPath', () => {
  it('drops duplicate and collinear points but keeps the ends', () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 3 },
    ];
    expect(simplifyPath(pts)).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 3 },
    ]);
  });
});

describe('orthoRoute', () => {
  const sides: Side[] = ['n', 'e', 's', 'w'];
  const A = { x: 0, y: 0 };
  const targets = [
    { x: 6, y: 4 },
    { x: -5, y: 3 },
    { x: 4, y: -6 },
    { x: 0, y: 8 },
  ];

  it('only makes horizontal and vertical legs, for every side combination', () => {
    for (const a of sides)
      for (const b of sides)
        for (const B of targets) {
          const pts = orthoRoute(A, SIDE_DIR[a], B, SIDE_DIR[b], []);
          expect(pts[0]).toEqual(A);
          expect(pts[pts.length - 1]).toEqual(B);
          expect(isOrthogonal(pts), `${a}→${b} to ${JSON.stringify(B)}`).toBe(true);
        }
  });

  it('runs the middle leg through a waypoint', () => {
    // Without a waypoint the vertical leg sits halfway, at x = 5.
    const pts = orthoRoute(A, SIDE_DIR.e, { x: 10, y: 10 }, SIDE_DIR.w, [{ x: 7, y: 5 }]);
    expect(isOrthogonal(pts)).toBe(true);
    expect(pts).toContainEqual({ x: 7, y: 0 });
    expect(pts).toContainEqual({ x: 7, y: 10 });
  });
});

describe('anchors', () => {
  it('sit just outside the side they name', () => {
    const n = node('n', 0, 0);
    expect(anchorPoint(n, { side: 'e', t: 0.5 }, 0)).toEqual({ x: 2, y: 1 });
    expect(anchorPoint(n, { side: 'n', t: 0 }, 0.5)).toEqual({ x: 0, y: -0.5 });
  });

  it('nearestAnchor picks the side nearest a point on the outline, snapped to quarters', () => {
    expect(nearestAnchor(node('n', 0, 0), { x: 2.1, y: 1.3 })).toEqual({ side: 'e', t: 0.625 });
    expect(nearestAnchor(node('n', 0, 0), { x: 0.5, y: -0.1 })).toEqual({ side: 'n', t: 0.25 });
  });
});

describe('resolveEdge', () => {
  it('connects facing sides of side-by-side nodes', () => {
    const r = resolveEdge({ routing: 'orthogonal' }, node('a', 0, 0), node('b', 10, 0));
    const first = r.pts[0];
    const last = r.pts[r.pts.length - 1];
    expect(first.x).toBeGreaterThan(2);
    expect(last.x).toBeLessThan(10);
    expect(first.y).toBe(1);
    expect(last.y).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';
import { boundsOf, canContain, containerOf, depthMap, descendantsOf, parentMap } from './containers';
import type { DiagramNode } from './types';

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

const outer = node('outer', { kind: 'area', w: 20, d: 20, h: 0 });
const inner = node('inner', { kind: 'area', x: 2, y: 2, w: 8, d: 8, h: 0 });
const box = node('box', { x: 4, y: 4 });
const loose = node('loose', { x: 15, y: 15 });
const far = node('far', { x: 40, y: 40 });
const nodes = [outer, inner, box, loose, far];

describe('containment', () => {
  it('puts each node in the smallest area holding it', () => {
    expect(containerOf(box, nodes)?.id).toBe('inner');
    expect(containerOf(loose, nodes)?.id).toBe('outer');
    expect(containerOf(far, nodes)).toBeUndefined();
    expect(containerOf(box, nodes, new Set(['inner']))?.id).toBe('outer');
  });

  it('needs an area to fit entirely inside another', () => {
    const overlapping = node('overlap', { kind: 'area', x: 15, y: 15, w: 10, d: 10, h: 0 });
    expect(canContain(outer, inner)).toBe(true);
    expect(canContain(outer, overlapping)).toBe(false);
    expect(canContain(inner, outer)).toBe(false);
  });

  it('uses the ellipse for circle areas', () => {
    const circle = node('c', { kind: 'circleArea', w: 10, d: 10, h: 0 });
    expect(canContain(circle, node('mid', { x: 4, y: 4 }))).toBe(true);
    // Inside the bounding square but outside the circle.
    expect(canContain(circle, node('corner', { x: 0, y: 0, w: 1, d: 1 }))).toBe(false);
  });

  it('ignores areas above the node', () => {
    expect(canContain({ ...outer, z: 2 }, box)).toBe(false);
  });
});

describe('hierarchy', () => {
  it('maps parents, descendants and depth', () => {
    expect(Object.fromEntries(parentMap(nodes))).toEqual({ inner: 'outer', box: 'inner', loose: 'outer' });
    expect([...descendantsOf(['outer'], nodes)].sort()).toEqual(['box', 'inner', 'loose']);
    expect(Object.fromEntries(depthMap(nodes))).toEqual({ outer: 0, inner: 1, box: 2, loose: 1, far: 0 });
  });
});

describe('boundsOf', () => {
  it('pads and snaps outward to half units', () => {
    expect(boundsOf([node('a', { x: 0.2, y: 0.3, w: 1, d: 1 })], 1)).toEqual({ x: -1, y: -1, w: 3.5, d: 3.5 });
  });
});

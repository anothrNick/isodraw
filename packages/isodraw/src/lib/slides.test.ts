import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { exportDocsMarkdown, mentionables } from './docs';
import { Projector } from './geometry';
import { layoutLevel } from './layout';
import { mergeDiagrams } from './merge';
import { sceneBounds, StaticDiagram } from './render';
import { createShape, parseDiagram } from './shapes';
import { collectSlides, fitCamera, flight, slideContents, slideOrder, slidePages, slideRect, withoutSlides, withSlideOrder } from './slides';
import type { Diagram, DiagramNode } from './types';

const node = (id: string, x: number, y: number, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  id, kind: 'block', label: id, x, y, z: 0, w: 2, d: 2, h: 1, color: '#4f8cf7', ...extra,
});
const slide = (id: string, x: number, y: number, w = 6, d = 6, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  ...createShape('slide', 0, 0), id, label: id, x, y, w, d, ...extra,
});

/** a and b on the left with slide s1 around them, c on the right with s2; d has a detail diagram with its own slide. */
const sample = (): Diagram => ({
  version: 1,
  nodes: [
    node('a', 0, 0, { doc: 'About a' }),
    node('b', 3, 0),
    node('c', 20, 0, { doc: 'About c' }),
    slide('s1', -1, -1, 7, 4),
    slide('s2', 19, -1, 4, 4),
    node('d', 40, 0, { detail: { version: 1, nodes: [node('x', 0, 0), slide('s3', -1, -1)], edges: [] } }),
  ],
  edges: [
    { id: 'ab', from: 'a', to: 'b', color: '#000', width: 2, routing: 'orthogonal', doc: 'a calls b' },
    { id: 'bc', from: 'b', to: 'c', color: '#000', width: 2, routing: 'orthogonal' },
  ],
});

describe('slides in the diagram', () => {
  it('are left out of the picture, the bounds and the docs', () => {
    const d = sample();
    const proj = new Projector('3d', 0);
    expect(sceneBounds(d, proj)).toEqual(sceneBounds(withoutSlides(d), proj));
    const svg = renderToStaticMarkup(createElement(StaticDiagram, { diagram: d, animate: false }));
    for (const id of ['s1', 's2']) expect(svg).not.toContain(`data-node-id="${id}"`);
    expect(svg).toContain('data-node-id="a"');
    expect(mentionables(d).map((m) => m.title)).not.toContain('s1');
    expect(exportDocsMarkdown(d)).not.toContain('s1');
  });

  it('withoutSlides drops them at every level, and returns the same diagram when there are none', () => {
    const out = withoutSlides(withSlideOrder(sample(), ['s2']));
    expect(out.nodes.map((n) => n.id)).toEqual(['a', 'b', 'c', 'd']);
    expect(out.nodes[3].detail!.nodes.map((n) => n.id)).toEqual(['x']);
    expect(out.presentation).toBeUndefined();
    expect(withoutSlides(out)).toBe(out);
  });

  it('stay where they are through layout', () => {
    const d = sample();
    const after = layoutLevel(d);
    expect(after.nodes.find((n) => n.id === 's1')).toMatchObject({ x: -1, y: -1, w: 7, d: 4 });
  });

  it('keep their order through parsing and merging', () => {
    const d = withSlideOrder(sample(), ['s2', 's1']);
    expect(parseDiagram(JSON.parse(JSON.stringify(d))).presentation).toEqual({ order: ['s2', 's1'] });
    const mine = withSlideOrder(d, ['s1', 's2']);
    expect(mergeDiagrams(d, mine, d).diagram.presentation).toEqual({ order: ['s1', 's2'] });
  });
});

describe('slide order', () => {
  it('collects slides level by level, in reading order', () => {
    expect(collectSlides(sample()).map((s) => [s.node.id, s.level])).toEqual([
      ['s1', []],
      ['s2', []],
      ['s3', ['d']],
    ]);
  });

  it('follows the saved order, adds unlisted slides at the end and skips ids that are gone', () => {
    const d = withSlideOrder(sample(), ['s3', 'gone', 's2']);
    expect(slideOrder(d).map((s) => s.node.id)).toEqual(['s3', 's2', 's1']);
  });
});

describe('a slide', () => {
  it('shows the items whose middle is inside it, and the connections between them', () => {
    const d = sample();
    const c = slideContents(d.nodes.find((n) => n.id === 's1')!, d);
    expect(c.nodes.map((n) => n.id)).toEqual(['a', 'b']);
    expect(c.edges.map((e) => e.id)).toEqual(['ab']);
  });

  it('shows only the items it lists, whatever else is under its outline', () => {
    const d = sample();
    // s1's outline covers a and b, but it lists only b (and c, far away), plus an id that's gone.
    const s1 = { ...d.nodes.find((n) => n.id === 's1')!, shows: ['b', 'c', 'gone'] };
    const c = slideContents(s1, d);
    expect(c.nodes.map((n) => n.id)).toEqual(['b', 'c']);
    expect(c.edges.map((e) => e.id)).toEqual(['bc']);
    // An area brings what's in it.
    const area: DiagramNode = { ...node('zone', -2, -2), kind: 'area', w: 10, d: 6, h: 0 };
    const withArea = { ...d, nodes: [...d.nodes, area] };
    expect(slideContents({ ...s1, shows: ['zone'] }, withArea).nodes.map((n) => n.id).sort()).toEqual(['a', 'b', 'zone']);
    // Nothing it lists is left: back to what's under the outline.
    expect(slideContents({ ...s1, shows: ['gone'] }, d).nodes.map((n) => n.id)).toEqual(['a', 'b']);
  });

  it('counts an area only when the whole of it is inside', () => {
    const d = sample();
    const big: DiagramNode = { ...node('vpc', -10, -10), kind: 'area', w: 22, d: 22, h: 0 };
    const small: DiagramNode = { ...node('sub', -0.5, -0.5), kind: 'area', w: 3, d: 3, h: 0 };
    const withAreas = { ...d, nodes: [...d.nodes, big, small] };
    const ids = slideContents(d.nodes.find((n) => n.id === 's1')!, withAreas).nodes.map((n) => n.id);
    expect(ids).toContain('sub');
    expect(ids).not.toContain('vpc');
  });

  it('walks through its notes, then the documented items inside it', () => {
    const d = sample();
    const s1 = { ...d.nodes.find((n) => n.id === 's1')!, notes: 'Start here' };
    expect(slidePages(s1, d)).toEqual([
      { kind: 'notes' },
      { kind: 'doc', target: { kind: 'node', id: 'a' } },
      { kind: 'doc', target: { kind: 'edge', id: 'ab' } },
    ]);
  });

  it('uses the docs it lists instead, skipping ones that are gone or outside it', () => {
    const d = sample();
    const s1 = {
      ...d.nodes.find((n) => n.id === 's1')!,
      docs: [{ kind: 'edge' as const, id: 'ab' }, { kind: 'node' as const, id: 'c' }, { kind: 'node' as const, id: 'gone' }, { kind: 'diagram' as const }, { kind: 'node' as const, id: 'b' }],
    };
    expect(slidePages(s1, d)).toEqual([
      { kind: 'doc', target: { kind: 'edge', id: 'ab' } },
      { kind: 'doc', target: { kind: 'diagram' } },
      { kind: 'doc', target: { kind: 'node', id: 'b' } },
    ]);
  });

  it('reaches up to the tops of tall things inside it', () => {
    const d = sample();
    const proj = new Projector('3d', 0);
    const s1 = d.nodes.find((n) => n.id === 's1')!;
    const tall = { ...d, nodes: d.nodes.map((n) => (n.id === 'a' ? { ...n, h: 6 } : n)) };
    expect(slideRect(s1, tall, proj).y).toBeLessThan(slideRect(s1, d, proj).y);
  });
});

describe('the camera', () => {
  it('fits a rectangle in the middle of the screen with a margin', () => {
    const c = fitCamera({ x: 100, y: 50, w: 200, h: 100 }, 1000, 600, 50);
    expect(c.zoom).toBeCloseTo(2.5); // limited by maxZoom
    const wide = fitCamera({ x: 0, y: 0, w: 1800, h: 100 }, 1000, 600, 50);
    expect(wide.zoom).toBeCloseTo(0.5);
    expect(wide.x + 900 * wide.zoom).toBeCloseTo(500);
  });

  it('flies from one camera to the other, zooming out on the way for distant targets', () => {
    const a = { x: 0, y: 0, zoom: 1 };
    const b = { x: -5000, y: 0, zoom: 1 };
    const f = flight(a, b, 1000, 600);
    expect(f.at(0)).toEqual(a);
    expect(f.at(1)).toEqual(b);
    expect(f.at(0.5).zoom).toBeLessThan(0.5);
    expect(f.duration).toBeGreaterThanOrEqual(600);
    expect(f.duration).toBeLessThanOrEqual(1600);
    // Nearby: hardly any zooming out.
    const near = flight(a, { x: -50, y: 0, zoom: 1 }, 1000, 600);
    expect(near.at(0.5).zoom).toBeGreaterThan(0.95);
    // Zooming in place.
    const zoomIn = flight(a, { x: -500, y: -300, zoom: 2 }, 1000, 600);
    expect(zoomIn.at(1).zoom).toBe(2);
    expect(Number.isFinite(zoomIn.at(0.5).zoom)).toBe(true);
  });
});

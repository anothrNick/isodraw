import { describe, expect, it } from 'vitest';
import { containerOf } from './containers';
import { layoutLevel, markMoved, settleLevel } from './layout';
import type { Diagram, DiagramEdge, DiagramNode } from './types';

const node = (id: string, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  id, kind: 'block', label: id, x: 0, y: 0, z: 0, w: 2, d: 2, h: 1, color: '#4f8cf7', placed: 'auto', ...extra,
});
const edge = (from: string, to: string): DiagramEdge => ({ id: `${from}-${to}`, from, to, color: '#475569', width: 2, routing: 'orthogonal' });
const overlap = (a: DiagramNode, b: DiagramNode) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.d && b.y < a.y + a.d;

// Everything piled up in a row, the way items added one by one end up: api → db, api → queue → worker.
const messy = (): Diagram => ({
  version: 1,
  nodes: [
    node('vpc', { kind: 'area', x: 10, y: 10, w: 30, d: 4, h: 0 }),
    node('api', { x: 11, y: 11 }),
    node('db', { x: 16, y: 11 }),
    node('queue', { x: 21, y: 11 }),
    node('worker', { x: 26, y: 11 }),
    node('stripe', { x: 45, y: 11 }),
  ],
  edges: [edge('api', 'db'), edge('api', 'queue'), edge('queue', 'worker'), { ...edge('api', 'stripe'), waypoints: [{ x: 1, y: 1 }] }],
});

describe('layoutLevel', () => {
  it('puts the flow in columns, with nothing overlapping', () => {
    const d = layoutLevel(messy());
    const at = (id: string) => d.nodes.find((n) => n.id === id)!;
    expect(at('api').x).toBeLessThan(at('db').x);
    expect(at('db').x).toBe(at('queue').x); // both fed by api: one column
    expect(at('queue').x).toBeLessThan(at('worker').x);
    const parts = d.nodes.filter((n) => n.kind !== 'area');
    for (const a of parts) for (const b of parts) if (a !== b) expect(overlap(a, b), `${a.id}/${b.id}`).toBe(false);
  });

  it('keeps contents inside their area, and the area sized around them', () => {
    const d = layoutLevel(messy());
    for (const id of ['api', 'db', 'queue', 'worker']) expect(containerOf(d.nodes.find((n) => n.id === id)!, d.nodes)?.id, id).toBe('vpc');
    expect(containerOf(d.nodes.find((n) => n.id === 'stripe')!, d.nodes)).toBeUndefined();
  });

  it('starts where the content was, marks everything as auto-placed, and drops stale bends', () => {
    const d = layoutLevel({ ...messy(), nodes: messy().nodes.map((n) => ({ ...n, placed: undefined })) });
    expect(Math.min(...d.nodes.map((n) => n.x))).toBe(10);
    expect(Math.min(...d.nodes.map((n) => n.y))).toBe(10);
    expect(d.nodes.every((n) => n.placed === 'auto')).toBe(true);
    expect(d.edges.find((e) => e.to === 'stripe')!.waypoints).toBeUndefined();
  });

  it('leaves free text where it is', () => {
    const text = node('title', { kind: 'text', text: 'Hi', x: -5, y: -5, placed: undefined });
    const d = layoutLevel({ ...messy(), nodes: [...messy().nodes, text] });
    expect(d.nodes.find((n) => n.id === 'title')).toEqual(text);
  });
});

// IsoDraw's own architecture, cut down: things outside an area feed components in its middle.
const platform = (): Diagram => ({
  version: 1,
  nodes: [
    node('agents'),
    node('cli'),
    node('people'),
    node('ai'),
    node('site', { kind: 'area', w: 4, d: 4, h: 0, x: 40, y: 0 }),
    node('preview', { x: 41, y: 1 }),
    node('web', { x: 41, y: 1 }),
    node('mcp', { x: 41, y: 1 }),
    node('proxy', { x: 41, y: 1 }),
    node('fly', { kind: 'area', w: 4, d: 4, h: 0, x: 60, y: 0 }),
    node('api', { x: 61, y: 1 }),
    node('cdn'),
  ],
  edges: [edge('agents', 'cli'), edge('cli', 'proxy'), edge('people', 'web'), edge('ai', 'mcp'), edge('web', 'proxy'), edge('mcp', 'api'),
    edge('proxy', 'api'), edge('preview', 'api'), edge('web', 'cdn')],
});

describe('layoutLevel with areas', () => {
  const d = layoutLevel(platform());
  const at = (id: string) => d.nodes.find((n) => n.id === id)!;
  const right = (n: DiagramNode) => n.x + n.w;

  it('puts what feeds an area before it, and what it feeds after it', () => {
    expect(right(at('cli'))).toBeLessThanOrEqual(at('site').x);
    expect(right(at('people'))).toBeLessThanOrEqual(at('site').x);
    expect(right(at('site'))).toBeLessThanOrEqual(at('fly').x);
    expect(right(at('site'))).toBeLessThanOrEqual(at('cdn').x);
  });

  it('pulls starting points next to what they feed', () => {
    // agents → cli → site: agents first; people and ai feed the site directly, so they share the cli's column.
    expect(at('agents').x).toBeLessThan(at('cli').x);
    expect(at('people').x).toBe(at('cli').x);
    expect(at('ai').x).toBe(at('cli').x);
  });

  it("orders an area's contents by where their outside neighbours are", () => {
    const outside = ['cli', 'people', 'ai'].sort((a, b) => at(a).y - at(b).y);
    const inside = ['web', 'mcp'].sort((a, b) => at(a).y - at(b).y);
    expect(inside).toEqual(outside.filter((o) => o !== 'cli').map((o) => (o === 'people' ? 'web' : 'mcp')));
  });
});

describe('settleLevel', () => {
  it('lays out a level only when the platform placed everything on it', () => {
    expect(settleLevel(messy())).not.toBe(messy());
    const arranged = { ...messy(), nodes: messy().nodes.map((n, i) => (i === 1 ? { ...n, placed: undefined } : n)) };
    expect(settleLevel(arranged)).toBe(arranged);
  });
});

describe('markMoved', () => {
  it('makes moved or resized items manual, and leaves others alone', () => {
    const before = messy();
    const after = { ...before, nodes: before.nodes.map((n) => (n.id === 'db' ? { ...n, x: n.x + 1 } : n.id === 'api' ? { ...n, color: '#000' } : n)) };
    const d = markMoved(before, after);
    expect(d.nodes.find((n) => n.id === 'db')!.placed).toBeUndefined();
    expect(d.nodes.find((n) => n.id === 'api')!.placed).toBe('auto');
    expect(markMoved(before, before)).toBe(before);
  });
});

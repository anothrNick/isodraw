import { describe, expect, it } from 'vitest';
import { mergeDiagrams } from './merge';
import type { Diagram, DiagramEdge, DiagramNode } from './types';

const node = (id: string, extra: Partial<DiagramNode> = {}): DiagramNode => ({
  id, kind: 'block', x: 0, y: 0, z: 0, w: 2, d: 2, h: 1, color: '#4f8cf7', ...extra,
});
const edge = (id: string, from: string, to: string, extra: Partial<DiagramEdge> = {}): DiagramEdge => ({
  id, from, to, color: '#475569', width: 2, routing: 'orthogonal', ...extra,
});
const base: Diagram = {
  version: 1,
  doc: 'Overview',
  nodes: [node('a', { label: 'A' }), node('b', { label: 'B' }), node('c', { label: 'C' })],
  edges: [edge('ab', 'a', 'b')],
};
const edit = (d: Diagram, fn: (d: Diagram) => Diagram) => fn(structuredClone(d));
const relabel = (id: string, label: string) => (d: Diagram) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, label } : n)) });

describe('mergeDiagrams', () => {
  it('keeps changes to different items from both sides', () => {
    const mine = edit(base, relabel('a', 'Mine'));
    const theirs = edit(base, relabel('b', 'Theirs'));
    const { diagram, conflicts } = mergeDiagrams(base, mine, theirs);
    expect(diagram.nodes.map((n) => n.label)).toEqual(['Mine', 'Theirs', 'C']);
    expect(conflicts).toBe(0);
  });

  it('keeps mine when both changed the same item, and counts it', () => {
    const { diagram, conflicts } = mergeDiagrams(base, edit(base, relabel('a', 'Mine')), edit(base, relabel('a', 'Theirs')));
    expect(diagram.nodes[0].label).toBe('Mine');
    expect(conflicts).toBe(1);
  });

  it('is clean when both made the same change', () => {
    const { diagram, conflicts } = mergeDiagrams(base, edit(base, relabel('a', 'Same')), edit(base, relabel('a', 'Same')));
    expect(diagram.nodes[0].label).toBe('Same');
    expect(conflicts).toBe(0);
  });

  it('keeps additions from both sides: theirs in place, mine after', () => {
    const mine = edit(base, (d) => ({ ...d, nodes: [...d.nodes, node('m')] }));
    const theirs = edit(base, (d) => ({ ...d, nodes: [node('t'), ...d.nodes] }));
    expect(mergeDiagrams(base, mine, theirs).diagram.nodes.map((n) => n.id)).toEqual(['t', 'a', 'b', 'c', 'm']);
  });

  it('applies deletions unless the other side changed the item', () => {
    const mine = edit(base, (d) => ({ ...d, nodes: d.nodes.filter((n) => n.id !== 'c' && n.id !== 'b') }));
    const theirs = edit(base, relabel('b', 'Changed'));
    const { diagram, conflicts } = mergeDiagrams(base, mine, theirs);
    // c was deleted cleanly; b was changed by them, so it stays.
    expect(diagram.nodes.map((n) => n.id)).toEqual(['a', 'b']);
    expect(conflicts).toBe(1);
  });

  it('drops connections whose ends were deleted', () => {
    const mine = edit(base, (d) => ({ ...d, edges: [...d.edges, edge('bc', 'b', 'c')] }));
    const theirs = edit(base, (d) => ({ ...d, nodes: d.nodes.filter((n) => n.id !== 'c') }));
    const { diagram } = mergeDiagrams(base, mine, theirs);
    expect(diagram.edges.map((e) => e.id)).toEqual(['ab']);
  });

  it('merges the overview doc and inside detail diagrams', () => {
    const withDetail: Diagram = { ...base, nodes: [node('a', { detail: { version: 1, nodes: [node('x'), node('y')], edges: [] } }), ...base.nodes.slice(1)] };
    const mine = edit(withDetail, (d) => {
      d.nodes[0].detail!.nodes[0].label = 'X mine';
      d.doc = 'New overview';
      return d;
    });
    const theirs = edit(withDetail, (d) => {
      d.nodes[0].detail!.nodes[1].label = 'Y theirs';
      d.nodes[0].label = 'A theirs';
      return d;
    });
    const { diagram, conflicts } = mergeDiagrams(withDetail, mine, theirs);
    expect(diagram.doc).toBe('New overview');
    expect(diagram.nodes[0].label).toBe('A theirs');
    expect(diagram.nodes[0].detail!.nodes.map((n) => n.label)).toEqual(['X mine', 'Y theirs']);
    expect(conflicts).toBe(0);
  });

  it('treats a missing field and an undefined one as the same', () => {
    const mine = edit(base, (d) => ({ ...d, nodes: d.nodes.map((n) => (n.id === 'a' ? { ...n, doc: undefined } : n)) }));
    expect(mergeDiagrams(base, mine, base).conflicts).toBe(0);
  });
});

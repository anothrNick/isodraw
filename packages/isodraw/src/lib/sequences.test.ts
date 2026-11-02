import { describe, expect, it } from 'vitest';
import { docOf, titleOf, withDoc } from './docs';
import { mergeDiagrams } from './merge';
import { activations, cleanSequences, createStep } from './sequences';
import { parseDiagram } from './shapes';
import type { Diagram, Sequence } from './types';

const node = (id: string, label: string) => ({ id, kind: 'block' as const, x: 0, y: 0, z: 0, w: 2, d: 2, h: 1, color: '#fff', label });

function seq(steps: Sequence['steps']): Sequence {
  return { id: 's1', title: 'Checkout', participants: ['web', 'api', 'db'], steps };
}

const diagram = (sequences: Sequence[]): Diagram => ({
  version: 1,
  nodes: [node('web', 'Web'), node('api', 'API'), node('db', 'DB')],
  edges: [],
  sequences,
});

describe('activations', () => {
  it('runs from a call to its return, nests self calls, and leaves unanswered calls open', () => {
    const s = seq([
      { id: 'a', kind: 'call', from: 'web', to: 'api', label: 'POST /orders' },
      { id: 'b', kind: 'self', from: 'api', label: 'validate' },
      { id: 'c', kind: 'call', from: 'api', to: 'db', label: 'INSERT' },
      { id: 'd', kind: 'return', from: 'db', to: 'api' },
      { id: 'e', kind: 'async', from: 'api', to: 'db', label: 'audit' },
      { id: 'f', kind: 'return', from: 'api', to: 'web', label: '201' },
      { id: 'g', kind: 'call', from: 'web', to: 'api', label: 'GET' },
    ]);
    expect(activations(s).sort((x, y) => x.from - y.from || x.participant.localeCompare(y.participant))).toEqual([
      { participant: 'api', from: 0, to: 5, depth: 0 },
      { participant: 'api', from: 1, to: 1, depth: 1 },
      { participant: 'db', from: 2, to: 3, depth: 0 },
      { participant: 'api', from: 6, to: 6, depth: 0 },
    ]);
  });
});

describe('sequences in diagrams', () => {
  it('drop participants and steps for components that are gone', () => {
    const d = diagram([seq([{ id: 'a', kind: 'call', from: 'web', to: 'api' }, { id: 'b', kind: 'call', from: 'api', to: 'db' }])]);
    const cleaned = cleanSequences({ ...d, nodes: d.nodes.filter((n) => n.id !== 'db') });
    expect(cleaned.sequences![0].participants).toEqual(['web', 'api']);
    expect(cleaned.sequences![0].steps.map((s) => s.id)).toEqual(['a']);
    expect(cleanSequences(d)).toBe(d);
  });

  it('survive reading a file, without junk', () => {
    const raw = JSON.parse(
      JSON.stringify({
        ...diagram([seq([{ id: 'a', kind: 'call', from: 'web', to: 'api', label: 'go' }])]),
        sequences: [
          { ...seq([{ id: 'a', kind: 'call', from: 'web', to: 'api', label: 'go' }, { id: 'x', kind: 'shout', from: 'web' } as never]) },
          { nope: true },
        ],
      }),
    );
    const d = parseDiagram(raw);
    expect(d.sequences).toEqual([seq([{ id: 'a', kind: 'call', from: 'web', to: 'api', label: 'go' }])]);
  });

  it('carry docs on sequences and steps', () => {
    let d = diagram([seq([createStep('call', 'web', 'api', 'POST /orders')])]);
    const step = d.sequences![0].steps[0];
    d = withDoc(d, { kind: 'sequence', id: 's1' }, 'The happy path.');
    d = withDoc(d, { kind: 'step', seq: 's1', id: step.id }, 'Idempotent.');
    expect(docOf({ kind: 'sequence', id: 's1' }, d)).toBe('The happy path.');
    expect(docOf({ kind: 'step', seq: 's1', id: step.id }, d)).toBe('Idempotent.');
    expect(titleOf({ kind: 'step', seq: 's1', id: step.id }, d)).toBe('Checkout, step 1: POST /orders');
  });

  it('merge as whole sequences', () => {
    const base = diagram([seq([])]);
    const mine = diagram([seq([{ id: 'a', kind: 'call', from: 'web', to: 'api' }])]);
    const theirs = diagram([seq([]), { ...seq([]), id: 's2', title: 'Sign in' }]);
    const { diagram: m, conflicts } = mergeDiagrams(base, mine, theirs);
    expect(conflicts).toBe(0);
    expect(m.sequences!.map((s) => [s.id, s.steps.length])).toEqual([
      ['s1', 1],
      ['s2', 0],
    ]);
  });
});

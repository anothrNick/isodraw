import { uid } from './geometry';
import type { Diagram, Sequence, SequenceStep, SequenceStepKind } from './types';

/**
 * Sequence diagrams on a diagram level: helpers to make and change them,
 * keep them consistent with the level's components, and work out activation
 * bars (which aren't stored).
 */

export function createSequence(title: string, participants: string[] = []): Sequence {
  return { id: uid('seq'), title, participants, steps: [] };
}

export function createStep(kind: SequenceStepKind, from: string, to?: string, label?: string): SequenceStep {
  return { id: uid('st'), kind, from, ...(kind !== 'self' && to ? { to } : {}), ...(label ? { label } : {}) };
}

/** Does a step involve only these participants? */
function fits(step: SequenceStep, ids: Set<string>): boolean {
  return ids.has(step.from) && (step.kind === 'self' || !step.to || ids.has(step.to));
}

/**
 * Sequences with only participants that exist on the level, and only steps
 * between them: after a component is deleted, or when reading a file.
 */
export function cleanSequences(d: Diagram): Diagram {
  if (!d.sequences) return d;
  const nodes = new Set(d.nodes.map((n) => n.id));
  let changed = false;
  const sequences = d.sequences.map((s) => {
    const participants = s.participants.filter((p, i) => nodes.has(p) && s.participants.indexOf(p) === i);
    const ids = new Set(participants);
    const steps = s.steps.filter((st) => fits(st, ids));
    if (participants.length === s.participants.length && steps.length === s.steps.length) return s;
    changed = true;
    return { ...s, participants, steps };
  });
  return changed ? { ...d, sequences } : d;
}

/** Read sequences from untrusted JSON, dropping anything malformed. */
export function parseSequences(raw: unknown): Sequence[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const kinds = new Set<SequenceStepKind>(['call', 'async', 'return', 'self', 'note']);
  const str = (v: unknown) => (typeof v === 'string' ? v : undefined);
  const out: Sequence[] = [];
  for (const s of raw as Record<string, unknown>[]) {
    if (!s || typeof s.id !== 'string' || !Array.isArray(s.participants) || !Array.isArray(s.steps)) continue;
    const steps: SequenceStep[] = [];
    for (const st of s.steps as Record<string, unknown>[]) {
      if (!st || typeof st.id !== 'string' || typeof st.from !== 'string' || !kinds.has(st.kind as SequenceStepKind)) continue;
      const step: SequenceStep = { id: st.id, kind: st.kind as SequenceStepKind, from: st.from };
      if (str(st.to)) step.to = str(st.to);
      if (str(st.label)) step.label = str(st.label);
      if (str(st.doc)) step.doc = str(st.doc);
      steps.push(step);
    }
    out.push({
      id: s.id,
      title: str(s.title) ?? 'Sequence',
      participants: (s.participants as unknown[]).filter((p): p is string => typeof p === 'string'),
      steps,
      ...(str(s.doc) ? { doc: str(s.doc) } : {}),
    });
  }
  return out;
}

/** Change one sequence on a level. */
export function withSequence(d: Diagram, id: string, fn: (s: Sequence) => Sequence): Diagram {
  return { ...d, sequences: (d.sequences ?? []).map((s) => (s.id === id ? fn(s) : s)) };
}

export function sequenceOf(d: Diagram, id: string | null | undefined): Sequence | undefined {
  return id ? d.sequences?.find((s) => s.id === id) : undefined;
}

/** An activation bar: a participant busy from one step's row to another's. */
export interface Activation {
  participant: string;
  from: number;
  to: number;
  /** Nesting: 0 for the outermost bar on its lifeline. */
  depth: number;
}

/**
 * Activation bars from the steps: a call activates its receiver until the
 * receiver returns to the caller (or the sequence ends); a self call nests a
 * bar for its step.
 */
export function activations(s: Sequence): Activation[] {
  const open = new Map<string, { caller: string; from: number; depth: number }[]>();
  const out: Activation[] = [];
  const stack = (p: string) => open.get(p) ?? (open.set(p, []), open.get(p)!);
  s.steps.forEach((st, i) => {
    if (st.kind === 'call' && st.to) {
      const bars = stack(st.to);
      bars.push({ caller: st.from, from: i, depth: bars.length });
    } else if (st.kind === 'self') {
      out.push({ participant: st.from, from: i, to: i, depth: stack(st.from).length });
    } else if (st.kind === 'return' && st.to) {
      // Close the latest bar the returner opened for this caller.
      const bars = stack(st.from);
      for (let j = bars.length - 1; j >= 0; j--) {
        if (bars[j].caller === st.to) {
          const [b] = bars.splice(j, 1);
          out.push({ participant: st.from, from: b.from, to: i, depth: b.depth });
          break;
        }
      }
    }
  });
  // Calls never answered stay open to the end.
  const last = Math.max(0, s.steps.length - 1);
  for (const [p, bars] of open) for (const b of bars) out.push({ participant: p, from: b.from, to: last, depth: b.depth });
  return out;
}

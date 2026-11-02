import { nodeTitle } from './docs';
import { createStep } from './sequences';
import type { Diagram, Sequence, SequenceStep, SequenceStepKind } from './types';
import { Field, Icon } from './ui';

/**
 * The Properties tab while a sequence is open: its title and participants,
 * and the selected step (kind, from, to, label, order). Changes go through
 * `onChange`, which the editor commits like any other edit.
 */

const KINDS: [SequenceStepKind, string][] = [
  ['call', 'Call (answered)'],
  ['async', 'Async message'],
  ['return', 'Return'],
  ['self', 'Self call'],
  ['note', 'Note'],
];

export function SequenceInspector({
  diagram,
  sequence: s,
  step,
  readOnly,
  onChange,
  onSelectStep,
  onDelete,
}: {
  diagram: Diagram;
  sequence: Sequence;
  step?: SequenceStep;
  readOnly: boolean;
  onChange: (fn: (s: Sequence) => Sequence, key?: string) => void;
  onSelectStep: (id: string | null) => void;
  onDelete: () => void;
}) {
  const nodes = new Map(diagram.nodes.map((n) => [n.id, n]));
  const name = (id?: string) => {
    const n = id ? nodes.get(id) : undefined;
    return n ? nodeTitle(n) : '?';
  };
  // Components that can take part: anything but text and areas.
  const candidates = diagram.nodes.filter((n) => n.kind !== 'text' && n.kind !== 'area' && n.kind !== 'circleArea' && !s.participants.includes(n.id));
  const parts = s.participants.filter((p) => nodes.has(p));
  const index = step ? s.steps.findIndex((x) => x.id === step.id) : -1;

  const setStep = (patch: Partial<SequenceStep>, key?: string) =>
    onChange((cur) => ({ ...cur, steps: cur.steps.map((x) => (x.id === step!.id ? clean({ ...x, ...patch }) : x)) }), key);
  const moveStep = (by: number) =>
    onChange((cur) => {
      const steps = [...cur.steps];
      const [x] = steps.splice(index, 1);
      steps.splice(Math.max(0, Math.min(steps.length, index + by)), 0, x);
      return { ...cur, steps };
    });
  const addStep = (after = s.steps.length - 1, make?: SequenceStep) => {
    const x = make ?? (parts.length > 1 ? createStep('call', parts[0], parts[1]) : createStep('self', parts[0]));
    onChange((cur) => {
      const steps = [...cur.steps];
      steps.splice(after + 1, 0, x);
      return { ...cur, steps };
    });
    onSelectStep(x.id);
  };
  const moveParticipant = (p: string, by: number) =>
    onChange((cur) => {
      const list = [...cur.participants];
      const i = list.indexOf(p);
      list.splice(i, 1);
      list.splice(Math.max(0, Math.min(list.length, i + by)), 0, p);
      return { ...cur, participants: list };
    });

  if (readOnly) {
    return (
      <div className="isd-panel">
        <h3>{s.title}</h3>
        <p className="isd-hint">
          {parts.length} participants, {s.steps.length} steps. Select a step to read its docs.
        </p>
      </div>
    );
  }

  return (
    <>
      {step && (
        // Keyed by step, so the label field takes focus for each newly selected step.
        <div className="isd-panel" key={step.id}>
          <h3>Step {index + 1}</h3>
          <Field label="Kind">
            <select className="isd-input" value={step.kind} onChange={(e) => setStep({ kind: e.target.value as SequenceStepKind })}>
              {KINDS.map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label={step.kind === 'note' ? 'Over' : step.kind === 'self' ? 'Participant' : 'From'}>
            <select className="isd-input" value={step.from} onChange={(e) => setStep({ from: e.target.value })}>
              {parts.map((p) => (
                <option key={p} value={p}>
                  {name(p)}
                </option>
              ))}
            </select>
          </Field>
          {step.kind !== 'self' && (
            <Field label={step.kind === 'note' ? 'To (optional)' : 'To'}>
              <select className="isd-input" value={step.to ?? ''} onChange={(e) => setStep({ to: e.target.value || undefined })}>
                {step.kind === 'note' && <option value="">Just one</option>}
                {parts.map((p) => (
                  <option key={p} value={p}>
                    {name(p)}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label={step.kind === 'note' ? 'Text' : 'Label'}>
            <input
              className="isd-input"
              value={step.label ?? ''}
              placeholder={step.kind === 'note' ? 'What happens here' : 'e.g. POST /orders'}
              onChange={(e) => setStep({ label: e.target.value || undefined }, `label:${step.id}`)}
              autoFocus
            />
          </Field>
          <div className="isd-row">
            <button type="button" className="isd-btn" disabled={index === 0} onClick={() => moveStep(-1)} title="Move up">
              ↑ Up
            </button>
            <button type="button" className="isd-btn" disabled={index === s.steps.length - 1} onClick={() => moveStep(1)} title="Move down">
              ↓ Down
            </button>
          </div>
          <div className="isd-row">
            {step.kind === 'call' && step.to && (
              <button type="button" className="isd-btn" onClick={() => addStep(index, createStep('return', step.to!, step.from))} title="Add the answer to this call below it">
                <Icon name="plus" /> Add return
              </button>
            )}
            <button
              type="button"
              className="isd-btn is-danger"
              onClick={() => {
                onChange((cur) => ({ ...cur, steps: cur.steps.filter((x) => x.id !== step.id) }));
                onSelectStep(null);
              }}
            >
              <Icon name="trash" /> Delete step
            </button>
          </div>
        </div>
      )}

      <div className="isd-panel">
        <h3>Sequence</h3>
        <Field label="Title">
          <input className="isd-input" value={s.title} onChange={(e) => onChange((cur) => ({ ...cur, title: e.target.value }), 'title')} />
        </Field>
        <Field label="Participants">
          <ul className="isd-seq-parts">
            {parts.map((p, i) => (
              <li key={p}>
                <span>{name(p)}</span>
                <button type="button" className="isd-icon-btn" disabled={i === 0} onClick={() => moveParticipant(p, -1)} aria-label={`Move ${name(p)} left`} title="Move left">
                  ←
                </button>
                <button
                  type="button"
                  className="isd-icon-btn"
                  disabled={i === parts.length - 1}
                  onClick={() => moveParticipant(p, 1)}
                  aria-label={`Move ${name(p)} right`}
                  title="Move right"
                >
                  →
                </button>
                <button
                  type="button"
                  className="isd-icon-btn"
                  onClick={() =>
                    onChange((cur) => ({
                      ...cur,
                      participants: cur.participants.filter((x) => x !== p),
                      steps: cur.steps.filter((x) => x.from !== p && x.to !== p),
                    }))
                  }
                  aria-label={`Remove ${name(p)}`}
                  title="Remove (and its steps)"
                >
                  <Icon name="close" size={12} />
                </button>
              </li>
            ))}
          </ul>
          {candidates.length > 0 ? (
            <select
              className="isd-input"
              value=""
              onChange={(e) => e.target.value && onChange((cur) => ({ ...cur, participants: [...cur.participants, e.target.value] }))}
            >
              <option value="">Add a participant…</option>
              {candidates.map((n) => (
                <option key={n.id} value={n.id}>
                  {nodeTitle(n)}
                </option>
              ))}
            </select>
          ) : (
            !parts.length && <p className="isd-hint">Draw components on the diagram first; they become this sequence's participants.</p>
          )}
        </Field>
        {parts.length > 0 && (
          <button type="button" className="isd-btn" onClick={() => addStep(index >= 0 ? index : undefined)}>
            <Icon name="plus" /> {index >= 0 ? 'Add step below' : 'Add step'}
          </button>
        )}
        <p className="isd-hint">Or click a lifeline, then another, to add a call between them (the same one twice for a self call).</p>
        <button type="button" className="isd-btn is-danger" onClick={onDelete}>
          <Icon name="trash" /> Delete sequence
        </button>
      </div>
    </>
  );
}

/** A step's fields made consistent with its kind. */
function clean(x: SequenceStep): SequenceStep {
  if (x.kind === 'self') {
    const { to: _to, ...rest } = x;
    return rest;
  }
  if (x.kind !== 'note' && !x.to) return { ...x, to: x.from };
  return x;
}

import { useId, useState } from 'react';
import { nodeTitle } from './docs';
import { ShapePreview } from './render';
import { activations } from './sequences';
import type { Diagram, Sequence, SequenceStep } from './types';

/**
 * A sequence drawn as a classic sequence diagram: the participants'
 * components across the top (with their own pictures), lifelines down, one
 * row per step. Calls, async messages, returns, self calls and notes;
 * activation bars come from the calls and returns.
 *
 * Editing is up to the caller: clicking a lifeline reports it (the editor
 * uses two clicks to add a message), and clicking a step selects it.
 */

const COL = 190;
const PAD = 70;
const HEAD = 104;
const TOP = 34;
const ROW = 50;
const BAR = 12;

export interface SequenceViewProps {
  diagram: Diagram;
  sequence: Sequence;
  selected?: string | null;
  onSelectStep?: (id: string | null) => void;
  /** A lifeline (or its header) was clicked. */
  onLifelineClick?: (participant: string) => void;
  /** A lifeline picked as a message's sender, waiting for its receiver. */
  pending?: string | null;
  /** Shown under the diagram, e.g. how to add a step. */
  hint?: string;
}

export function SequenceView({ diagram, sequence: s, selected, onSelectStep, onLifelineClick, pending, hint }: SequenceViewProps) {
  const id = useId().replace(/:/g, '');
  const [hover, setHover] = useState<string | null>(null);
  const nodes = new Map(diagram.nodes.map((n) => [n.id, n]));
  const parts = s.participants.filter((p) => nodes.has(p));
  const col = new Map(parts.map((p, i) => [p, PAD + COL / 2 + i * COL]));
  const width = Math.max(PAD * 2 + parts.length * COL, 480);
  const rowY = (i: number) => HEAD + TOP + i * ROW;
  const height = rowY(Math.max(s.steps.length, 1)) + 30;
  const bars = activations(s);
  // How far a message end stops short of a lifeline: the edge of its widest active bar.
  const inset = (p: string, i: number) => {
    const depth = Math.max(-1, ...bars.filter((b) => b.participant === p && b.from <= i && i <= b.to).map((b) => b.depth));
    return depth < 0 ? 0 : BAR / 2 + depth * (BAR / 2);
  };
  const clickable = !!onLifelineClick;

  return (
    <div className="isd-seq" onClick={() => onSelectStep?.(null)}>
      <div className="isd-seq-sheet" style={{ width, height }}>
        {parts.map((p) => {
          const n = nodes.get(p)!;
          return (
            <button
              key={p}
              type="button"
              className={`isd-seq-head${pending === p ? ' is-pending' : ''}${hover === p ? ' is-hover' : ''}`}
              style={{ left: col.get(p)! - COL / 2 + 10, width: COL - 20 }}
              disabled={!clickable}
              onClick={(e) => {
                e.stopPropagation();
                onLifelineClick?.(p);
              }}
              onMouseEnter={() => clickable && setHover(p)}
              onMouseLeave={() => setHover(null)}
            >
              <ShapePreview node={n} size={50} />
              <span>{nodeTitle(n)}</span>
            </button>
          );
        })}
        <svg className="isd-seq-svg" width={width} height={height} role="img" aria-label={`Sequence: ${s.title}`}>
          <defs>
            <marker id={`${id}-solid`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 Z" className="isd-seq-arrow" />
            </marker>
            <marker id={`${id}-open`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M1 1 L9 5 L1 9" fill="none" className="isd-seq-arrow-open" strokeWidth={1.6} strokeLinejoin="round" />
            </marker>
          </defs>
          {/* Lifelines, with wide invisible targets for clicking. */}
          {parts.map((p) => (
            <g key={p}>
              <line x1={col.get(p)} x2={col.get(p)} y1={HEAD} y2={height - 10} className={`isd-seq-life${pending === p || hover === p ? ' is-active' : ''}`} />
              {clickable && (
                <rect
                  x={col.get(p)! - 22}
                  y={HEAD}
                  width={44}
                  height={height - HEAD}
                  className="isd-seq-hit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLifelineClick?.(p);
                  }}
                  onMouseEnter={() => setHover(p)}
                  onMouseLeave={() => setHover(null)}
                />
              )}
            </g>
          ))}
          {bars.map((b, i) =>
            col.has(b.participant) ? (
              <rect
                key={i}
                className="isd-seq-bar"
                x={col.get(b.participant)! - BAR / 2 + b.depth * (BAR / 2)}
                y={rowY(b.from) - 12}
                width={BAR}
                height={rowY(b.to) - rowY(b.from) + 24}
                rx={3}
              />
            ) : null,
          )}
          {s.steps.map((st, i) => (
            <Step
              key={st.id}
              step={st}
              index={i}
              y={rowY(i)}
              col={col}
              inset={inset}
              markers={id}
              selected={selected === st.id}
              onSelect={
                onSelectStep
                  ? (e) => {
                      e.stopPropagation();
                      onSelectStep(st.id);
                    }
                  : undefined
              }
            />
          ))}
        </svg>
      </div>
      {hint && <p className="isd-seq-hint">{hint}</p>}
    </div>
  );
}

function Step({
  step: st,
  index,
  y,
  col,
  inset,
  markers,
  selected,
  onSelect,
}: {
  step: SequenceStep;
  index: number;
  y: number;
  col: Map<string, number>;
  inset: (p: string, i: number) => number;
  markers: string;
  selected: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}) {
  const fx = col.get(st.from);
  if (fx === undefined) return null;
  const cls = `isd-seq-step is-${st.kind}${selected ? ' is-selected' : ''}${onSelect ? ' is-clickable' : ''}`;
  const number = (
    <text x={14} y={y + 4} className="isd-seq-num">
      {index + 1}
    </text>
  );

  if (st.kind === 'note') {
    const tx = st.to ? col.get(st.to) : undefined;
    const x0 = Math.min(fx, tx ?? fx) - 70;
    const x1 = Math.max(fx, tx ?? fx) + 70;
    return (
      <g className={cls} onClick={onSelect}>
        {number}
        <rect x={x0} y={y - 16} width={x1 - x0} height={32} rx={5} className="isd-seq-note" />
        <text x={(x0 + x1) / 2} y={y + 4} textAnchor="middle" className="isd-seq-note-text">
          {clip(st.label || 'Note', (x1 - x0) / 7)}
        </text>
      </g>
    );
  }

  if (st.kind === 'self') {
    const x = fx + inset(st.from, index);
    const path = `M${x} ${y - 8} H${x + 42} V${y + 10} H${x + 2}`;
    return (
      <g className={cls} onClick={onSelect}>
        {number}
        <path d={path} className="isd-seq-hitline" />
        <path d={path} fill="none" className="isd-seq-line" markerEnd={`url(#${markers}-solid)`} />
        <text x={x + 50} y={y - 2} className="isd-seq-label">
          {clip(st.label ?? '', 28)}
        </text>
      </g>
    );
  }

  const tx = st.to ? col.get(st.to) : undefined;
  if (tx === undefined) return null;
  const dir = tx >= fx ? 1 : -1;
  const x1 = fx + dir * inset(st.from, index);
  const x2 = tx - dir * inset(st.to!, index);
  const mid = (x1 + x2) / 2;
  const marker = st.kind === 'call' ? 'solid' : 'open';
  return (
    <g className={cls} onClick={onSelect}>
      {number}
      <line x1={x1} x2={x2} y1={y} y2={y} className="isd-seq-hitline" />
      <line x1={x1} x2={x2} y1={y} y2={y} className="isd-seq-line" markerEnd={`url(#${markers}-${marker})`} />
      {st.label && (
        <text x={mid} y={y - 7} textAnchor="middle" className="isd-seq-label">
          {clip(st.label, Math.abs(x2 - x1) / 6.5)}
        </text>
      )}
    </g>
  );
}

function clip(s: string, max: number): string {
  const n = Math.max(4, Math.floor(max));
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

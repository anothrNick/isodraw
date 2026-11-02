import type { ActivationBar, Diagram, DiagramEdge, DiagramNode, EdgeAnchor, Side } from './types';

/**
 * Lifelines: any component can have a dashed line hanging below it (its
 * `lifeline` length), as a participant in a sequence diagram. Connections
 * attach at a point along the line (an anchor's `line` distance), and
 * activation bars are worked out from the messages that arrive and return.
 */

/** Width of an activation bar; connections stop at its edge. */
export const BAR = 0.36;
/** How far either side of the line a click still counts as on it. */
const REACH = 0.9;

const snap = (v: number) => Math.round(v * 4) / 4;

/** Where the line starts: below the node's front edge (and its label), at its center. */
export function lineTop(n: DiagramNode) {
  return { x: n.x + n.w / 2, y: n.y + n.d + (n.label ? 0.9 : 0.2) };
}

/**
 * The world point at a distance down a lifeline, at the edge of the bars
 * there on `side`: nested bars sit to the right, so they push e-side ends
 * out. With bars placed by hand, a point with no bar is on the line itself.
 */
export function linePoint(n: DiagramNode, a: EdgeAnchor) {
  const top = lineTop(n);
  const dist = Math.min(Math.max(a.line ?? 0, 0), n.lifeline ?? 0);
  let dx = a.side === 'w' ? -BAR / 2 : a.side === 'e' ? BAR / 2 : 0;
  if (n.activationBars && n.lifelineBars !== false) {
    const here = n.activationBars.filter((b) => dist >= b.from - 0.3 && dist <= b.to + 0.3);
    const deepest = Math.max(-1, ...here.map((b) => b.depth ?? 0));
    if (deepest < 0) dx = 0;
    else if (a.side === 'e') dx = BAR / 2 + deepest * (BAR / 2);
  }
  return { x: top.x + dx, y: top.y + dist };
}

/** Is a world point on (or near) a node's lifeline? */
export function onLifeline(n: DiagramNode, p: { x: number; y: number }): boolean {
  if (!n.lifeline) return false;
  const top = lineTop(n);
  return Math.abs(p.x - top.x) <= REACH && p.y >= top.y - 0.1 && p.y <= top.y + n.lifeline + 0.5;
}

/** An anchor on a node's lifeline at a world height, leaving toward `side`. */
export function lineAnchor(n: DiagramNode, y: number, side: Side): EdgeAnchor {
  const dist = Math.min(Math.max(snap(y - lineTop(n).y), 0), n.lifeline ?? 0);
  return { side: side === 'w' ? 'w' : 'e', t: 0.5, line: dist };
}

/** Which way a message on a lifeline leaves toward another node: e if it's to the right. */
export function sideToward(n: DiagramNode, other: DiagramNode): Side {
  return other.x + other.w / 2 >= n.x + n.w / 2 ? 'e' : 'w';
}

export interface Activation {
  from: number;
  to: number;
}

/**
 * Activation bars on a lifeline, from the messages on it, top to bottom: a
 * message arriving (not dashed) starts a bar; a dashed one leaving (a return)
 * ends the latest. Bars nobody returns from run to the last message.
 */
export function activations(d: Diagram, n: DiagramNode): Activation[] {
  if (!n.lifeline) return [];
  const marks: { at: number; kind: 'in' | 'return' | 'other' }[] = [];
  // Dashed or dotted: a return.
  const isReturn = (e: DiagramEdge) => (e.lineStyle ?? (e.dashed ? 'dashed' : 'solid')) !== 'solid';
  for (const e of d.edges) {
    if (e.to === n.id && e.toAnchor?.line !== undefined) marks.push({ at: e.toAnchor.line, kind: isReturn(e) || e.from === n.id ? 'other' : 'in' });
    if (e.from === n.id && e.fromAnchor?.line !== undefined) marks.push({ at: e.fromAnchor.line, kind: isReturn(e) ? 'return' : 'other' });
  }
  if (!marks.length) return [];
  marks.sort((a, b) => a.at - b.at);
  const open: number[] = [];
  const bars: Activation[] = [];
  for (const m of marks) {
    if (m.kind === 'in') open.push(m.at);
    else if (m.kind === 'return' && open.length) bars.push({ from: open.pop()!, to: m.at });
  }
  const last = marks[marks.length - 1].at;
  for (const from of open) bars.push({ from, to: Math.max(last, from + 0.5) });
  return bars;
}

/**
 * The route for a connection drawn from `start` on one node to `end` on
 * another (or the same) when either point is on a lifeline: messages run
 * straight and level, at the height they were started from; from a lifeline
 * back to itself is a self call, looping out to the right. Null when neither
 * end is on a lifeline.
 */
export function lifelineRoute(
  from: DiagramNode,
  start: { x: number; y: number },
  to: DiagramNode,
  end: { x: number; y: number },
): { fromAnchor?: EdgeAnchor; toAnchor?: EdgeAnchor; waypoints: { x: number; y: number }[]; routing: 'straight' | 'orthogonal' } | null {
  const fromLine = onLifeline(from, start);
  const toLine = onLifeline(to, end);
  if (from.id === to.id) {
    if (!fromLine) return null;
    const a = lineAnchor(from, start.y, 'e');
    const b = lineAnchor(from, end.y > start.y + 0.4 ? end.y : start.y + 0.75, 'e');
    const top = lineTop(from);
    const x = top.x + 2.4;
    return { fromAnchor: a, toAnchor: b, routing: 'orthogonal', waypoints: [{ x, y: top.y + a.line! }, { x, y: top.y + b.line! }] };
  }
  if (!fromLine && !toLine) return null;
  const y = fromLine ? start.y : end.y;
  return {
    ...(fromLine ? { fromAnchor: lineAnchor(from, y, sideToward(from, to)) } : {}),
    ...(toLine ? { toAnchor: lineAnchor(to, y, sideToward(to, from)) } : {}),
    waypoints: [],
    routing: 'straight',
  };
}

/**
 * The bars a lifeline shows: those placed by hand, or else the ones worked
 * out from its messages (none when bars are turned off). Automatic bars come
 * top to bottom; hand-placed ones in the order they're stored, so an index
 * names the same bar while it's dragged.
 */
export function lifelineBars(d: Diagram, n: DiagramNode): Required<ActivationBar>[] {
  if (!n.lifeline || n.lifelineBars === false) return [];
  if (n.activationBars) return n.activationBars.map((b) => ({ from: b.from, to: b.to, depth: b.depth ?? 0 }));
  return activations(d, n)
    .sort((a, b) => a.from - b.from)
    .map((b) => ({ ...b, depth: 0 }));
}

/** The node with its bars changed, turning automatic bars into hand-placed ones first. */
export function withBars(d: Diagram, n: DiagramNode, fn: (bars: Required<ActivationBar>[]) => ActivationBar[]): DiagramNode {
  const len = n.lifeline ?? 0;
  const bars = fn(lifelineBars(d, { ...n, lifelineBars: true })).map((b) => {
    const round = (v: number) => Math.round(v * 100) / 100;
    const from = round(Math.min(Math.max(b.from, 0), len));
    const to = round(Math.min(Math.max(b.to, from + 0.25), len));
    return { from, to, ...(b.depth ? { depth: b.depth } : {}) };
  });
  return { ...n, activationBars: bars };
}

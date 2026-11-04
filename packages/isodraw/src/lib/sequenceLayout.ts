import { isContainer } from './containers';
import { lineTop, sideToward } from './lifelines';
import type { Diagram, DiagramEdge, DiagramNode, EdgeAnchor } from './types';

/**
 * Tidying a sequence diagram: participants (items with a lifeline that
 * messages attach to) go in a row, left to right in their current order, with
 * their bottoms lined up; messages go one per row, top to bottom in their
 * current order. Notes and frames drawn over the sequence move with it, and
 * hand-placed activation bars stretch with the rows around them.
 */

/** Between participant centers, and between messages. */
const COL = 6;
const ROW = 1.6;
/** Space kept beside each participant's label, so long names don't touch. */
const LABEL_GAP = 1;
/** World units per character of a participant's label (a rough measure). */
const CHAR = 0.17;

const round = (v: number) => Math.round(v * 100) / 100;
const onLine = (a: EdgeAnchor | undefined): a is EdgeAnchor & { line: number } => a?.line !== undefined;

export interface SequenceLayout {
  /** The level with the sequence tidied; items outside it are unchanged. */
  diagram: Diagram;
  /** Items the sequence placed (participants, and notes or frames over it). */
  placed: Set<string>;
  /** The right edge of the tidied sequence, for putting everything else beside it. */
  right: number;
  /** The top of the tidied sequence. */
  top: number;
}

/** A piecewise-linear map through sorted (old, new) pairs, shifting beyond the ends. */
function remap(pairs: [number, number][]): (v: number) => number {
  const ps = [...pairs].sort((a, b) => a[0] - b[0]).filter((p, i, all) => i === 0 || p[0] > all[i - 1][0] + 1e-6);
  return (v) => {
    if (!ps.length) return v;
    if (v <= ps[0][0]) return v + ps[0][1] - ps[0][0];
    const last = ps[ps.length - 1];
    if (v >= last[0]) return v + last[1] - last[0];
    const i = ps.findIndex((p) => p[0] >= v);
    const [a, b] = [ps[i - 1], ps[i]];
    return a[1] + ((v - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
  };
}

/** The messages on a level: connections attached to a lifeline at either end. */
function messagesOf(d: Diagram, participants: Map<string, DiagramNode>): DiagramEdge[] {
  return d.edges.filter((e) => (participants.has(e.from) && onLine(e.fromAnchor)) || (participants.has(e.to) && onLine(e.toAnchor)));
}

/** A message's height (world y): where it leaves, or where it arrives when it doesn't leave from a lifeline. */
function heightOf(e: DiagramEdge, byId: Map<string, DiagramNode>): number {
  if (onLine(e.fromAnchor) && byId.get(e.from)?.lifeline) return lineTop(byId.get(e.from)!).y + e.fromAnchor.line;
  return lineTop(byId.get(e.to)!).y + e.toAnchor!.line!;
}

/**
 * Lay out the sequence on a level, or null when it has none (no message
 * attached to a lifeline).
 */
export function layoutSequence(d: Diagram): SequenceLayout | null {
  const byId = new Map(d.nodes.map((n) => [n.id, n]));
  const withLine = new Map(d.nodes.filter((n) => n.lifeline && !isContainer(n)).map((n) => [n.id, n]));
  const messages = messagesOf(d, withLine);
  if (!messages.length) return null;
  const used = new Set(messages.flatMap((e) => [e.from, e.to]).filter((id) => withLine.has(id)));
  const people = [...withLine.values()].filter((n) => used.has(n.id)).sort((a, b) => a.x + a.w / 2 - (b.x + b.w / 2));

  // Columns: at least COL apart, more when shapes or labels are wide.
  const span = (n: DiagramNode) => Math.max(n.w, (n.label?.length ?? 0) * CHAR) / 2 + LABEL_GAP;
  const centers: number[] = [];
  for (const [i, n] of people.entries()) {
    centers.push(i === 0 ? n.x + n.w / 2 : centers[i - 1] + Math.max(COL, span(people[i - 1]) + span(n)));
  }
  const top = Math.min(...people.map((n) => n.y));
  const bottom = top + Math.max(...people.map((n) => n.d));
  const moved = new Map<string, DiagramNode>(people.map((n, i) => [n.id, { ...n, x: round(centers[i] - n.w / 2), y: round(bottom - n.d) }]));

  // Rows: one per message, in the order they're drawn now (ties keep their order in the list).
  const order = messages.map((e, i) => ({ e, i, y: heightOf(e, byId) })).sort((a, b) => a.y - b.y || a.i - b.i);

  // Notes and frames drawn over the old sequence move and stretch with it.
  const oldRight = Math.max(...people.map((n) => n.x + n.w)) + 3;
  const oldLeft = Math.min(...people.map((n) => n.x)) - 1;
  const oldBottom = Math.max(...people.map((n) => lineTop(n).y + (n.lifeline ?? 0)));
  const connected = new Set(d.edges.flatMap((e) => [e.from, e.to]));
  const over = (n: DiagramNode) => n.x < oldRight && n.x + n.w > oldLeft && n.y < oldBottom && n.y + n.d > top - 0.5;
  const holds = (n: DiagramNode) => isContainer(n) && people.some((p) => p.x + p.w / 2 > n.x && p.x + p.w / 2 < n.x + n.w && p.y + p.d / 2 > n.y && p.y + p.d / 2 < n.y + n.d);
  const notes = d.nodes.filter((n) => !moved.has(n.id) && !connected.has(n.id) && over(n));
  // A note between two messages sits just under the first, with room for it before the next.
  const after = new Map<string, number>();
  const gap = order.map(() => ROW);
  for (const n of notes) {
    if (holds(n) || isContainer(n)) continue;
    const k = order.findIndex((m, i) => i + 1 < order.length && m.y <= n.y && order[i + 1].y > n.y);
    if (k < 0) continue;
    after.set(n.id, k);
    gap[k] = Math.max(gap[k], n.d + 1.1);
  }
  const first = Math.max(...[...moved.values()].map((n) => lineTop(n).y)) + 0.8;
  const rows = order.map((_, i) => first + gap.slice(0, i).reduce((a, b) => a + b, 0));
  const rowOf = new Map(order.map(({ e }, i) => [e.id, rows[i]]));
  const last = rows[rows.length - 1];
  const ys = remap(order.map(({ y }, i) => [y, rows[i]]));
  const xs = remap(people.map((n, i) => [n.x + n.w / 2, centers[i]]));

  // Lifelines reach just past the last message; bars placed by hand follow the rows.
  for (const [id, n] of moved) {
    const old = byId.get(id)!;
    const was = lineTop(old).y;
    const now = lineTop(n).y;
    const bars = old.activationBars?.map((b) => ({ ...b, from: round(Math.max(0, ys(was + b.from) - now)), to: round(Math.max(0, ys(was + b.to) - now)) }));
    const length = Math.ceil((last + 1 - now) * 2) / 2;
    const bounded = bars?.map((b) => ({ ...b, from: Math.min(b.from, length), to: Math.min(Math.max(b.to, b.from + 0.3), length) }));
    moved.set(id, { ...n, lifeline: length, ...(bounded ? { activationBars: bounded } : {}) });
  }

  for (const n of notes) {
    const x = round(xs(n.x));
    const w = round(Math.max(0.5, xs(n.x + n.w) - xs(n.x)));
    const k = after.get(n.id);
    if (holds(n)) {
      // A frame around the participants keeps them inside, top to bottom.
      const y = round(Math.min(n.y + (top - Math.min(...people.map((p) => p.y))), top - 0.5));
      moved.set(n.id, { ...n, x, w, y, d: round(Math.max(n.d, last + 1.2 - y)) });
    } else if (isContainer(n)) {
      // A frame over some of the messages (a fragment) keeps spanning the same ones.
      const y = round(ys(n.y));
      moved.set(n.id, { ...n, x, w, y, d: round(Math.max(1, ys(n.y + n.d) - y)) });
    } else moved.set(n.id, { ...n, x, w, y: round(k !== undefined ? rows[k] + 0.55 : ys(n.y)) });
  }
  // A note pinned to a participant goes where it went.
  for (const n of d.nodes) {
    if (n.kind !== 'note' || !n.pin || !moved.has(n.pin)) continue;
    const [was, now] = [byId.get(n.pin)!, moved.get(n.pin)!];
    moved.set(n.id, { ...n, x: round(n.x + now.x - was.x), y: round(n.y + now.y - was.y) });
  }

  const lineAt = (n: DiagramNode, y: number) => round(Math.min(Math.max(y - lineTop(n).y, 0), n.lifeline ?? 0));
  const edges = d.edges.map((e) => {
    const y = rowOf.get(e.id);
    if (y === undefined) return e;
    const a = moved.get(e.from) ?? byId.get(e.from)!;
    const b = moved.get(e.to) ?? byId.get(e.to)!;
    if (e.from === e.to) {
      // A self call loops out to the right, around its row.
      const from = { side: 'e' as const, t: 0.5, line: lineAt(a, y - 0.3) };
      const to = { side: 'e' as const, t: 0.5, line: lineAt(a, y + 0.3) };
      const x = round(lineTop(a).x + 2.4);
      return { ...e, fromAnchor: from, toAnchor: to, waypoints: [{ x, y: round(lineTop(a).y + from.line) }, { x, y: round(lineTop(a).y + to.line) }] };
    }
    const { waypoints: _w, ...rest } = e;
    const end = (n: DiagramNode, other: DiagramNode, anchor: EdgeAnchor | undefined) =>
      onLine(anchor) && moved.get(n.id)?.lifeline ? { side: sideToward(n, other) === 'w' ? ('w' as const) : ('e' as const), t: 0.5, line: lineAt(n, y) } : anchor;
    const fromAnchor = end(a, b, e.fromAnchor);
    const toAnchor = end(b, a, e.toAnchor);
    return { ...rest, ...(fromAnchor ? { fromAnchor } : {}), ...(toAnchor ? { toAnchor } : {}) };
  });

  const placed = new Set(moved.keys());
  const nodes = d.nodes.map((n) => (moved.has(n.id) ? { ...moved.get(n.id)!, placed: 'auto' as const } : n));
  const right = Math.max(...[...moved.values()].map((n) => n.x + n.w), centers[centers.length - 1] + 3);
  return { diagram: { ...d, nodes, edges }, placed, right, top: Math.min(...[...moved.values()].map((n) => n.y)) };
}

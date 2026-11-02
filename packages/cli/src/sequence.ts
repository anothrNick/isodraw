import { createEdge, lineAnchor, lineTop, sideToward, type Diagram, type DiagramEdge, type DiagramNode } from './lib';

/**
 * Sequence diagrams for the CLI and AI agents: participants are components
 * with lifelines, and messages are connections attached partway down two
 * lifelines at the same height, top to bottom in order. Activation bars come
 * from the messages (a call starts one, its dashed return ends it).
 */

export type MessageKind = 'call' | 'async' | 'return' | 'self';

export interface Message {
  from: string;
  to: string;
  label?: string;
  /** call (default): a request; async: fire and forget; return: the answer (dashed); self: a call to itself. */
  kind?: MessageKind;
  doc?: string;
}

/** Between participants, and between messages. */
export const COL = 6;
export const ROW = 1.6;

/** A message as a connection, `y` down from the top (world units). */
export function messageEdge(id: string, a: DiagramNode, b: DiagramNode, y: number, m: Pick<Message, 'kind' | 'label' | 'doc'>): DiagramEdge {
  const kind: MessageKind = a.id === b.id ? 'self' : (m.kind ?? 'call');
  const extra = { ...(m.label ? { label: m.label } : {}), ...(m.doc ? { doc: m.doc } : {}) };
  if (kind === 'self') {
    const top = lineTop(a);
    const from = lineAnchor(a, y - 0.3, 'e');
    const to = lineAnchor(a, y + 0.3, 'e');
    const x = top.x + 2.4;
    return {
      ...createEdge(a.id, a.id, { routing: 'orthogonal', rounded: true, endMarker: 'arrow', ...extra }),
      id,
      fromAnchor: from,
      toAnchor: to,
      waypoints: [
        { x, y: top.y + from.line! },
        { x, y: top.y + to.line! },
      ],
    };
  }
  return {
    ...createEdge(a.id, b.id, {
      routing: 'straight',
      endMarker: kind === 'call' ? 'arrow' : 'open',
      ...(kind === 'return' ? { lineStyle: 'dashed' as const, color: '#64748b' } : {}),
      ...extra,
    }),
    id,
    fromAnchor: lineAnchor(a, y, sideToward(a, b)),
    toAnchor: lineAnchor(b, y, sideToward(b, a)),
  };
}

/** What kind of message a connection on lifelines is, for describe. */
export function messageKind(e: DiagramEdge): MessageKind {
  if (e.from === e.to) return 'self';
  if ((e.lineStyle ?? (e.dashed ? 'dashed' : 'solid')) !== 'solid') return 'return';
  return e.endMarker === 'open' ? 'async' : 'call';
}

/** The height (world y) of each message on a level, for the ones attached to lifelines. */
export function messageHeights(d: Diagram): Map<string, number> {
  const byId = new Map(d.nodes.map((n) => [n.id, n]));
  const out = new Map<string, number>();
  for (const e of d.edges) {
    const n = byId.get(e.from);
    if (n?.lifeline && e.fromAnchor?.line !== undefined) out.set(e.id, lineTop(n).y + e.fromAnchor.line);
  }
  return out;
}

/** The next free height for a message on a level: below the lowest one, or just under the lifelines' tops. */
export function nextMessageY(d: Diagram, participants: DiagramNode[]): number {
  const heights = [...messageHeights(d).values()];
  const base = Math.max(...participants.map((n) => lineTop(n).y)) + 0.8;
  return heights.length ? Math.max(base, Math.max(...heights) + ROW) : base;
}

/** Make sure a participant's lifeline reaches a height. */
export function reach(n: DiagramNode, y: number): DiagramNode {
  const need = Math.ceil((y + 1 - lineTop({ ...n, lifeline: n.lifeline ?? 1 }).y) * 2) / 2;
  return n.lifeline && n.lifeline >= need ? n : { ...n, lifeline: Math.max(n.lifeline ?? 0, need, 2) };
}

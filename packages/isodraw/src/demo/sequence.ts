import type { Diagram, DiagramEdge, DiagramNode, Side } from '../lib';
import { fitIsoIcon } from '../lib/isoIcons';
import { createImageNode } from '../lib/shapes';

/**
 * A sequence diagram drawn with ordinary shapes and connections, in the flat
 * view: participants are icons along the top, lifelines are narrow dashed
 * areas under them, activation bars are thin blocks, and each message is a
 * straight connection pinned (by its anchors) at the same height on both
 * lifelines. Returns are dashed with open arrowheads; the self call bends out
 * and back into a nested activation bar.
 */

const COL = 6; // between lifelines
const TOP = 2.6; // where lifelines start, under the participants
const ROW = 2; // between messages
const FIRST = 4.2; // the first message's height
const STEPS = 12;
const LIFE = FIRST + (STEPS + 0.5) * ROW - TOP; // lifeline length

const PEOPLE: [string, string, string][] = [
  ['user', 'User', 'user'],
  ['browser', 'Browser', 'browser'],
  ['api', 'App API', 'service'],
  ['idp', 'Identity provider', 'shield'],
  ['db', 'Database', 'database'],
];
const cx = (i: number) => i * COL + 1;
const at = (p: string) => cx(PEOPLE.findIndex(([id]) => id === p));
const rowY = (i: number) => FIRST + (i - 1) * ROW;

function participant([id, label, icon]: [string, string, string], i: number): DiagramNode {
  const n = createImageNode(`isodraw:${icon}`, label, 0, 0);
  const fitted = fitIsoIcon({ ...n, w: 1.3 }, 'w');
  return { ...fitted, id, x: cx(i) - fitted.w / 2, y: 0.4 };
}

/** A lifeline: a narrow dashed area hanging under its participant. */
function lifeline(p: string): DiagramNode {
  return { id: `${p}-life`, kind: 'area', x: at(p) - 0.1, y: TOP, w: 0.2, d: LIFE, h: 0, z: 0, color: '#94a3b8', opacity: 0.04, dashed: true };
}

/** An activation bar on a lifeline from one message row to another; `nest` shifts it right for a self call. */
function bar(id: string, p: string, from: number, to: number, nest = 0): DiagramNode {
  const y = rowY(from) - 0.35;
  return { id, kind: 'block', x: at(p) - 0.25 + nest * 0.35, y, w: 0.5, d: rowY(to) + 0.35 - y, h: 0.05, z: 0, color: '#bfdbfe' };
}

/** Where on a node's side a height falls, as its anchor's position (0..1 along the side). */
function anchor(node: DiagramNode, side: Side, y: number) {
  return { side, t: Math.min(1, Math.max(0, (y - node.y) / node.d)) };
}

const MESSAGE: Partial<DiagramEdge> = { color: '#334155', width: 1.6, routing: 'straight', endMarker: 'arrow' };
const RETURN: Partial<DiagramEdge> = { ...MESSAGE, color: '#64748b', lineStyle: 'dashed', endMarker: 'open' };

export function signInSequence(): Diagram {
  const nodes: DiagramNode[] = [];
  PEOPLE.forEach((p, i) => nodes.push(participant(p, i), lifeline(p[0])));
  // Who is busy when: from the call that wakes them to the return that ends it.
  const bars = [
    bar('browser-bar', 'browser', 1, 12),
    bar('api-bar1', 'api', 2, 3),
    bar('idp-bar1', 'idp', 4, 6),
    bar('idp-self', 'idp', 5, 5, 1),
    bar('api-bar2', 'api', 7, 12),
    bar('idp-bar2', 'idp', 8, 9),
    bar('db-bar', 'db', 10, 11),
  ];
  nodes.push(...bars);
  nodes.push({
    id: 'note',
    kind: 'area',
    label: 'The code is useless without the verifier',
    x: at('browser') + 0.6,
    y: rowY(7) + 0.45,
    w: COL - 1.2,
    d: 0.9,
    h: 0,
    z: 0,
    color: '#f59e0b',
    opacity: 0.14,
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));
  // A message at row i between two nodes (a lifeline or a bar), pinned at that height on both.
  const msg = (id: string, i: number, from: string, to: string, label: string, style = MESSAGE): DiagramEdge => {
    const a = byId.get(from)!;
    const b = byId.get(to)!;
    const right = b.x > a.x;
    const y = rowY(i);
    return { id, from, to, label, ...style, fromAnchor: anchor(a, right ? 'e' : 'w', y), toAnchor: anchor(b, right ? 'w' : 'e', y) } as DiagramEdge;
  };
  const edges: DiagramEdge[] = [
    msg('m1', 1, 'user-life', 'browser-bar', 'Click "Sign in"'),
    msg('m2', 2, 'browser-bar', 'api-bar1', 'GET /auth/login'),
    msg('m3', 3, 'api-bar1', 'browser-bar', '302 to IdP + PKCE challenge', RETURN),
    msg('m4', 4, 'browser-bar', 'idp-bar1', 'GET /authorize?code_challenge'),
    msg('m6', 6, 'idp-bar1', 'browser-bar', '302 /callback?code', RETURN),
    msg('m7', 7, 'browser-bar', 'api-bar2', 'GET /callback?code'),
    msg('m8', 8, 'api-bar2', 'idp-bar2', 'POST /token (code + verifier)'),
    msg('m9', 9, 'idp-bar2', 'api-bar2', 'ID token', RETURN),
    msg('m10', 10, 'api-bar2', 'db-bar', 'upsert user, new session'),
    msg('m11', 11, 'db-bar', 'api-bar2', 'session id', RETURN),
    msg('m12', 12, 'api-bar2', 'browser-bar', 'Set-Cookie: session', RETURN),
  ];
  // The self call: out of the identity provider's bar, round, and into the nested bar.
  const idp = byId.get('idp-bar1')!;
  const self = byId.get('idp-self')!;
  const y = rowY(5);
  edges.push({
    id: 'm5',
    from: 'idp-bar1',
    to: 'idp-self',
    label: 'check password + MFA',
    ...MESSAGE,
    routing: 'orthogonal',
    fromAnchor: anchor(idp, 'e', y - 0.6),
    toAnchor: anchor(self, 'e', y + 0.15),
    waypoints: [
      { x: at('idp') + 2.6, y: y - 0.6 },
      { x: at('idp') + 2.6, y: y + 0.15 },
    ],
  } as DiagramEdge);
  return { version: 1, view: '2d', nodes, edges };
}

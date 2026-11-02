import type { Diagram, DiagramEdge, DiagramNode } from '../lib';
import { fitIsoIcon } from '../lib/isoIcons';
import { lineTop } from '../lib/lifelines';
import { createImageNode } from '../lib/shapes';

/**
 * A sequence diagram, in the flat view: each participant is an icon with a
 * lifeline, and each message is a connection attached partway down two
 * lifelines at the same height. Returns are dashed with open arrowheads; the
 * activation bars come from the messages themselves. Nothing else is needed.
 */

const COL = 6; // between participants
const ROW = 2; // between messages

const PEOPLE: [string, string, string][] = [
  ['user', 'User', 'user'],
  ['browser', 'Browser', 'browser'],
  ['api', 'App API', 'service'],
  ['idp', 'Identity provider', 'shield'],
  ['db', 'Database', 'database'],
];
const STEPS = 12;

function participant([id, label, icon]: [string, string, string], i: number, base: number): DiagramNode {
  const n = createImageNode(`isodraw:${icon}`, label, 0, 0);
  const fitted = fitIsoIcon({ ...n, w: 1.3 }, 'w');
  // Bottoms lined up, so every lifeline starts at the same height.
  return { ...fitted, id, x: i * COL + 1 - fitted.w / 2, y: base - fitted.d };
}

const MESSAGE: Partial<DiagramEdge> = { color: '#334155', width: 1.6, routing: 'straight', endMarker: 'arrow' };
const RETURN: Partial<DiagramEdge> = { ...MESSAGE, color: '#64748b', lineStyle: 'dashed', endMarker: 'open' };

export function signInSequence(): Diagram {
  const nodes = PEOPLE.map((p, i) => participant(p, i, 2));
  const top = Math.max(...nodes.map((n) => lineTop(n).y));
  const rowY = (i: number) => top + 0.8 + (i - 1) * ROW;
  for (const n of nodes) n.lifeline = rowY(STEPS) + 1 - lineTop(n).y;
  nodes.push({
    id: 'note',
    kind: 'area',
    label: 'The code is useless without the verifier',
    x: COL + 1.6,
    y: rowY(7) + 0.45,
    w: COL - 1.8,
    d: 0.9,
    h: 0,
    z: 0,
    color: '#f59e0b',
    opacity: 0.14,
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));
  /** How far down a node's lifeline row i is. */
  const down = (id: string, i: number) => rowY(i) - lineTop(byId.get(id)!).y;
  const msg = (id: string, i: number, from: string, to: string, label: string, style = MESSAGE): DiagramEdge => {
    const right = byId.get(to)!.x > byId.get(from)!.x;
    return {
      id,
      from,
      to,
      label,
      ...style,
      fromAnchor: { side: right ? 'e' : 'w', t: 0.5, line: down(from, i) },
      toAnchor: { side: right ? 'w' : 'e', t: 0.5, line: down(to, i) },
    } as DiagramEdge;
  };
  const idpX = lineTop(byId.get('idp')!).x;
  const edges: DiagramEdge[] = [
    msg('m1', 1, 'user', 'browser', 'Click "Sign in"'),
    msg('m2', 2, 'browser', 'api', 'GET /auth/login'),
    msg('m3', 3, 'api', 'browser', '302 to IdP + PKCE challenge', RETURN),
    msg('m4', 4, 'browser', 'idp', 'GET /authorize?code_challenge'),
    // A self call: out to the right and back into the same lifeline.
    {
      id: 'm5',
      from: 'idp',
      to: 'idp',
      label: 'check password + MFA',
      ...MESSAGE,
      routing: 'orthogonal',
      fromAnchor: { side: 'e', t: 0.5, line: down('idp', 5) - 0.4 },
      toAnchor: { side: 'e', t: 0.5, line: down('idp', 5) + 0.4 },
      waypoints: [
        { x: idpX + 2.4, y: rowY(5) - 0.4 },
        { x: idpX + 2.4, y: rowY(5) + 0.4 },
      ],
    } as DiagramEdge,
    msg('m6', 6, 'idp', 'browser', '302 /callback?code', RETURN),
    msg('m7', 7, 'browser', 'api', 'GET /callback?code'),
    msg('m8', 8, 'api', 'idp', 'POST /token (code + verifier)'),
    msg('m9', 9, 'idp', 'api', 'ID token', RETURN),
    msg('m10', 10, 'api', 'db', 'upsert user, new session'),
    msg('m11', 11, 'db', 'api', 'session id', RETURN),
    msg('m12', 12, 'api', 'browser', 'Set-Cookie: session', RETURN),
  ];
  return { version: 1, view: '2d', nodes, edges };
}

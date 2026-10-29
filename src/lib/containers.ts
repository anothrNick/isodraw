import { center, rectPoly, type Pt } from './geometry';
import type { DiagramNode } from './types';

/**
 * Containers are areas: anything sitting inside an area belongs to it, so
 * moving or deleting the area takes its contents along. Membership is derived
 * from geometry rather than stored, so it always matches what you see.
 */
export const isContainer = (n: DiagramNode) => n.kind === 'area' || n.kind === 'circleArea';

const EPS = 1e-6;

function containsPoint(c: DiagramNode, p: Pt): boolean {
  if (c.kind === 'circleArea') {
    const u = (p.x - (c.x + c.w / 2)) / (c.w / 2);
    const v = (p.y - (c.y + c.d / 2)) / (c.d / 2);
    return u * u + v * v <= 1 + EPS;
  }
  return p.x >= c.x - EPS && p.x <= c.x + c.w + EPS && p.y >= c.y - EPS && p.y <= c.y + c.d + EPS;
}

/** Can `c` hold `n`? Containers must fit entirely inside; other nodes by their center. */
export function canContain(c: DiagramNode, n: DiagramNode): boolean {
  if (c.id === n.id || !isContainer(c) || c.z > n.z + EPS) return false;
  if (isContainer(n)) {
    if (c.w * c.d <= n.w * n.d + EPS) return false;
    return rectPoly(n).every((p) => containsPoint(c, p));
  }
  return containsPoint(c, center(n));
}

/** The smallest container holding `n`, ignoring any ids in `exclude`. */
export function containerOf(n: DiagramNode, nodes: DiagramNode[], exclude?: ReadonlySet<string>): DiagramNode | undefined {
  let best: DiagramNode | undefined;
  for (const c of nodes) {
    if (exclude?.has(c.id) || !canContain(c, n)) continue;
    if (!best || c.w * c.d < best.w * best.d) best = c;
  }
  return best;
}

/** Map of node id → parent container id. */
export function parentMap(nodes: DiagramNode[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const n of nodes) {
    const p = containerOf(n, nodes);
    if (p) map.set(n.id, p.id);
  }
  return map;
}

/** All nodes nested (at any depth) inside the given containers. */
export function descendantsOf(ids: Iterable<string>, nodes: DiagramNode[], parents = parentMap(nodes)): Set<string> {
  const children = new Map<string, string[]>();
  for (const [child, parent] of parents) {
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent)!.push(child);
  }
  const out = new Set<string>();
  const stack = [...ids];
  while (stack.length) {
    for (const c of children.get(stack.pop()!) ?? []) {
      if (!out.has(c)) {
        out.add(c);
        stack.push(c);
      }
    }
  }
  return out;
}

/** Nesting depth of each node (0 = top level); used to paint containers under their contents. */
export function depthMap(nodes: DiagramNode[], parents = parentMap(nodes)): Map<string, number> {
  const depth = new Map<string, number>();
  const get = (id: string): number => {
    const known = depth.get(id);
    if (known !== undefined) return known;
    const p = parents.get(id);
    const d = p ? get(p) + 1 : 0;
    depth.set(id, d);
    return d;
  };
  nodes.forEach((n) => get(n.id));
  return depth;
}

/** World-space bounds around a set of nodes, padded and snapped outward to half units. */
export function boundsOf(nodes: DiagramNode[], pad = 1): { x: number; y: number; w: number; d: number } {
  const x0 = Math.floor((Math.min(...nodes.map((n) => n.x)) - pad) * 2) / 2;
  const y0 = Math.floor((Math.min(...nodes.map((n) => n.y)) - pad) * 2) / 2;
  const x1 = Math.ceil((Math.max(...nodes.map((n) => n.x + n.w)) + pad) * 2) / 2;
  const y1 = Math.ceil((Math.max(...nodes.map((n) => n.y + n.d)) + pad) * 2) / 2;
  return { x: x0, y: y0, w: x1 - x0, d: y1 - y0 };
}

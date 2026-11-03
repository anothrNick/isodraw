import ELK, { type ElkExtendedEdge, type ElkNode } from 'elkjs/lib/elk.bundled.js';
import { isContainer } from './containers';
import { applyPlacements, COL_GAP, laidOut, levelInput, PAD, PAD_TOP, ROW_GAP, type Placement } from './layout';
import { layoutSequence } from './sequenceLayout';
import type { Diagram } from './types';

/**
 * Layout with the Eclipse Layout Kernel (ELK): its layered algorithm puts
 * components in columns by flow like ours, but lays out areas and their
 * contents in one pass and works harder at keeping lines from crossing. Areas
 * keep their contents, a sequence still gets its own layout, and the result
 * starts where the old content did.
 */

/** ELK units per world unit: ELK's own defaults are tuned for pixel-ish sizes. */
const S = 10;
/** Room under a component for its label, so labels don't run into what's below. */
const LABEL = 1;
const half = (v: number) => Math.round(v * 2) / 2;

let elk: InstanceType<typeof ELK> | null = null;

/** ELK layout options, for trying settings out (the bench); the defaults are what IsoDraw uses. */
export type ElkOptions = Record<string, string>;

export async function layoutLevelElk(d: Diagram, options: ElkOptions = {}): Promise<Diagram> {
  const seq = layoutSequence(d);
  if (seq) return layoutItemsElk(seq.diagram, (n) => laidOut(n) && !seq.placed.has(n.id), options, { x: seq.right + COL_GAP, y: seq.top });
  return layoutItemsElk(d, laidOut, options);
}

async function layoutItemsElk(d: Diagram, include: Parameters<typeof levelInput>[1], options: ElkOptions, at?: { x: number; y: number }): Promise<Diagram> {
  const { items, byId, children, links } = levelInput(d, include);
  if (!items.length) return d;
  const isArea = (id: string) => isContainer(byId.get(id)!);
  // Keep the current top-to-bottom order where the flow allows it (ELK follows the order it's given).
  const order = (ids: string[]) => [...ids].sort((a, b) => byId.get(a)!.y - byId.get(b)!.y || byId.get(a)!.x - byId.get(b)!.x);

  const parent = new Map<string, string | undefined>();
  for (const [p, kids] of children) for (const k of kids) parent.set(k, p);
  const chain = (id: string) => {
    const out: (string | undefined)[] = [];
    for (let n = parent.get(id); ; n = parent.get(n!)) {
      out.push(n);
      if (n === undefined) return out;
    }
  };
  /** The innermost group holding both ends, where ELK wants the edge declared. */
  const common = (a: string, b: string) => {
    const up = new Set(chain(a));
    return chain(b).find((g) => up.has(g));
  };
  const edgesIn = new Map<string | undefined, ElkExtendedEdge[]>();
  links.forEach(([a, b], i) => {
    const g = common(a, b);
    edgesIn.set(g, [...(edgesIn.get(g) ?? []), { id: `e${i}`, sources: [a], targets: [b] }]);
  });

  // ELK stacks unconnected items in one tall column; like our own layout, put
  // each group's in a row instead, as one block ELK places.
  const connected = new Set(links.flat());
  const shelves = new Map<string, string[]>();
  const height = (id: string) => byId.get(id)!.d + (byId.get(id)!.label ? LABEL : 0);
  const contents = (group: string | undefined): ElkNode[] => {
    const kids = order(children.get(group) ?? []);
    const loose = kids.filter((k) => !isArea(k) && !connected.has(k));
    if (loose.length < 2) return kids.map(node);
    const id = `shelf:${group ?? ''}`;
    shelves.set(id, loose);
    const w = loose.reduce((t, k) => t + byId.get(k)!.w, 0) + (ROW_GAP - LABEL) * (loose.length - 1);
    return [...kids.filter((k) => !loose.includes(k)).map(node), { id, width: w * S, height: Math.max(...loose.map(height)) * S }];
  };
  const node = (id: string): ElkNode => {
    const n = byId.get(id)!;
    if (!isArea(id)) return { id, width: n.w * S, height: height(id) * S };
    const kids = children.get(id) ?? [];
    return {
      id,
      children: contents(id),
      edges: edgesIn.get(id) ?? [],
      layoutOptions: {
        'elk.padding': `[top=${PAD_TOP * S},left=${PAD * S},bottom=${PAD * S},right=${PAD * S}]`,
        'elk.nodeSize.constraints': 'MINIMUM_SIZE',
        'elk.nodeSize.minimum': `(${4 * S},${3 * S})`,
      },
      ...(kids.length ? {} : { width: 4 * S, height: 3 * S }),
    };
  };
  const graph: ElkNode = {
    id: 'root',
    children: contents(undefined),
    edges: edgesIn.get(undefined) ?? [],
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.layered.spacing.nodeNodeBetweenLayers': String(COL_GAP * S),
      'elk.spacing.nodeNode': String((ROW_GAP - LABEL) * S),
      'elk.spacing.componentComponent': String(COL_GAP * S),
      'elk.spacing.edgeNode': String(S),
      'elk.spacing.edgeEdge': String(S / 2),
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
      ...options,
    },
  };

  elk ??= new ELK();
  const out = await elk.layout(graph);

  // ELK positions are relative to the parent; IsoDraw's are absolute, on a half-unit grid.
  const placed = new Map<string, Placement>();
  const walk = (n: ElkNode, ox: number, oy: number) => {
    for (const c of n.children ?? []) {
      const x = ox + (c.x ?? 0) / S;
      const y = oy + (c.y ?? 0) / S;
      const [px, py] = [half(x), half(y)];
      const shelf = shelves.get(c.id);
      if (shelf) {
        let sx = px;
        for (const k of shelf) {
          placed.set(k, { x: sx, y: py, w: byId.get(k)!.w, d: byId.get(k)!.d });
          sx += byId.get(k)!.w + ROW_GAP - LABEL;
        }
        continue;
      }
      const item = byId.get(c.id)!;
      if (isArea(c.id)) placed.set(c.id, { x: px, y: py, w: Math.ceil((x + (c.width ?? 0) / S - px) * 2) / 2, d: Math.ceil((y + (c.height ?? 0) / S - py) * 2) / 2 });
      else placed.set(c.id, { x: px, y: py, w: item.w, d: item.d });
      walk(c, x, y);
    }
  };
  walk(out, 0, 0);
  return applyPlacements(d, items, placed, at);
}

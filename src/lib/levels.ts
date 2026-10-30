import { parseDiagram } from './shapes';
import type { Diagram, DiagramNode } from './types';

/**
 * Detail diagrams. A component can carry its own diagram (`node.detail`),
 * nested to any depth. A level is addressed by the ids of the components
 * drilled into from the top: `[]` is the top diagram, `['ecs', 'worker']` is
 * the detail of `worker` inside the detail of `ecs`.
 */
export type LevelPath = string[];

export const levelKey = (path: LevelPath) => path.map(encodeURIComponent).join('/');

export const sameLevel = (a: LevelPath, b: LevelPath) => a.length === b.length && a.every((id, i) => id === b[i]);

/** Text labels are annotations, not components, so they get no detail diagram. */
export const canHaveDetail = (n: DiagramNode) => n.kind !== 'text';

/** The diagram at `path`, or undefined when a component on the way is gone or has no detail. */
export function levelAt(root: Diagram, path: LevelPath): Diagram | undefined {
  let d: Diagram | undefined = root;
  for (const id of path) d = d?.nodes.find((n) => n.id === id)?.detail;
  return d;
}

/** The components drilled into along `path`, outermost first; stops where the path breaks. */
export function levelNodes(root: Diagram, path: LevelPath): DiagramNode[] {
  const out: DiagramNode[] = [];
  let d: Diagram | undefined = root;
  for (const id of path) {
    const n: DiagramNode | undefined = d?.nodes.find((x) => x.id === id);
    if (!n?.detail) break;
    out.push(n);
    d = n.detail;
  }
  return out;
}

/** The longest leading part of `path` that still exists in `root`. */
export function validLevel(root: Diagram, path: LevelPath): LevelPath {
  return levelNodes(root, path).map((n) => n.id);
}

/** Replace the diagram at `path`. Returns `root` itself when nothing changed. */
export function withLevel(root: Diagram, path: LevelPath, fn: (d: Diagram) => Diagram): Diagram {
  if (!path.length) return fn(root);
  const [id, ...rest] = path;
  const node = root.nodes.find((n) => n.id === id);
  if (!node?.detail) return root;
  const detail = withLevel(node.detail, rest, fn);
  if (detail === node.detail) return root;
  return { ...root, nodes: root.nodes.map((n) => (n === node ? { ...n, detail } : n)) };
}

/** Item count, for labels like "6 items". */
export const detailSize = (d: Diagram) => d.nodes.filter((n) => n.kind !== 'text').length;

/** Markdown that marks where a component's doc shows its detail diagram. */
export const DETAIL_BLOCK = '```isodraw-detail\n```';

const EMBED = /```isodraw\n([\s\S]*?)\n```/;

/**
 * Older docs drew a component's internals as a diagram embedded in its doc.
 * The first such embed becomes the component's detail diagram, and the doc
 * shows the detail in its place. Returns `d` itself when there is nothing to move.
 */
export function liftEmbeds(d: Diagram): Diagram {
  let changed = false;
  const nodes = d.nodes.map((n) => {
    let next = n;
    if (!n.detail && n.doc && canHaveDetail(n)) {
      const m = EMBED.exec(n.doc);
      if (m) {
        try {
          const detail = parseDiagram(JSON.parse(m[1]));
          // The embed's own doc never showed anywhere; the component doc is the overview.
          delete detail.doc;
          next = { ...n, detail, doc: n.doc.replace(m[0], DETAIL_BLOCK) };
        } catch {
          /* leave a broken embed where it is */
        }
      }
    }
    if (next.detail) {
      const detail = liftEmbeds(next.detail);
      if (detail !== next.detail) next = { ...next, detail };
    }
    if (next !== n) changed = true;
    return next;
  });
  return changed ? { ...d, nodes } : d;
}

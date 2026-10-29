import { uid } from './geometry';
import type { Diagram, DiagramEdge, DiagramNode, ShapeKind } from './types';

export interface ShapeDef {
  kind: ShapeKind;
  name: string;
  defaults: Partial<DiagramNode>;
}

export const SHAPES: ShapeDef[] = [
  { kind: 'block', name: 'Block', defaults: { w: 2, d: 2, h: 1, color: '#4f8cf7' } },
  { kind: 'cylinder', name: 'Cylinder', defaults: { w: 2, d: 2, h: 1.5, color: '#3fb27f' } },
  { kind: 'hexagon', name: 'Hexagon', defaults: { w: 2, d: 2, h: 1, color: '#f2a93b' } },
  { kind: 'pyramid', name: 'Pyramid', defaults: { w: 2, d: 2, h: 1.5, color: '#e5534b' } },
  { kind: 'cone', name: 'Cone', defaults: { w: 2, d: 2, h: 2, color: '#a371f7' } },
  { kind: 'sphere', name: 'Sphere', defaults: { w: 2, d: 2, h: 2, color: '#39c5cf' } },
  { kind: 'area', name: 'Area', defaults: { w: 6, d: 4, h: 0, color: '#4f8cf7', opacity: 0.18 } },
  {
    kind: 'circleArea',
    name: 'Circle area',
    defaults: { w: 4, d: 4, h: 0, color: '#3fb27f', opacity: 0.2 },
  },
  {
    kind: 'text',
    name: 'Text',
    defaults: { w: 4, d: 1, h: 0, color: '#1f2937', text: 'Text', fontSize: 0.7 },
  },
];

export const SWATCHES = [
  '#4f8cf7',
  '#3fb27f',
  '#f2a93b',
  '#e5534b',
  '#a371f7',
  '#39c5cf',
  '#ed7100',
  '#c925d1',
  '#7aa116',
  '#dd344c',
  '#8c4fff',
  '#232f3e',
  '#64748b',
  '#ffffff',
];

/** Create a node of the given kind centered on (cx, cy). */
export function createShape(kind: ShapeKind, cx: number, cy: number, extra: Partial<DiagramNode> = {}): DiagramNode {
  const def = SHAPES.find((s) => s.kind === kind)?.defaults ?? {};
  const w = extra.w ?? def.w ?? 2;
  const d = extra.d ?? def.d ?? 2;
  return {
    id: uid('n'),
    kind,
    h: 1,
    z: 0,
    color: '#4f8cf7',
    ...def,
    ...extra,
    w,
    d,
    x: Math.round(cx - w / 2),
    y: Math.round(cy - d / 2),
  };
}

export function createImageNode(src: string, name: string, cx: number, cy: number): DiagramNode {
  return createShape('image', cx, cy, {
    w: 2,
    d: 2,
    h: 0.35,
    src,
    label: name,
    color: '#ffffff',
    imageStyle: 'tile',
  });
}

export function createEdge(from: string, to: string, extra: Partial<DiagramEdge> = {}): DiagramEdge {
  return {
    id: uid('e'),
    from,
    to,
    color: '#475569',
    width: 2,
    routing: 'orthogonal',
    rounded: true,
    lineStyle: 'solid',
    endMarker: 'arrow',
    ...extra,
  };
}

/** Edge style fields that new connections inherit from the last-edited edge. */
export const EDGE_STYLE_KEYS = [
  'color',
  'width',
  'routing',
  'rounded',
  'lineStyle',
  'startMarker',
  'endMarker',
  'animation',
  'animationDirection',
  'animationSpeed',
  'animationColor',
] as const satisfies readonly (keyof DiagramEdge)[];

/** Convert pre-0.2 edge fields (dashed / arrowStart / arrowEnd) to the current ones. */
export function migrateEdge(e: DiagramEdge): DiagramEdge {
  const { dashed, arrowStart, arrowEnd, ...rest } = e;
  return {
    ...rest,
    lineStyle: e.lineStyle ?? (dashed ? 'dashed' : 'solid'),
    startMarker: e.startMarker ?? (arrowStart ? 'arrow' : 'none'),
    endMarker: e.endMarker ?? (arrowEnd ? 'arrow' : 'none'),
  };
}

export const emptyDiagram = (): Diagram => ({ version: 1, nodes: [], edges: [] });

/** Validate and normalize a parsed JSON diagram. Throws on bad input. */
export function parseDiagram(json: unknown): Diagram {
  const obj = json as Partial<Diagram>;
  if (!obj || !Array.isArray(obj.nodes) || !Array.isArray(obj.edges)) {
    throw new Error('Not an IsoDraw diagram: expected { nodes: [], edges: [] }');
  }
  const ids = new Set(obj.nodes.map((n) => n.id));
  return {
    version: 1,
    nodes: obj.nodes.map((n) => ({ ...n, z: n.z ?? 0, h: n.h ?? 0 })),
    edges: obj.edges.filter((e) => ids.has(e.from) && ids.has(e.to)).map(migrateEdge),
    ...(typeof obj.doc === 'string' ? { doc: obj.doc } : {}),
    ...(obj.view === '2d' || obj.view === '3d' ? { view: obj.view } : {}),
  };
}

export const KIND_NAMES: Record<ShapeKind, string> = {
  block: 'Block',
  cylinder: 'Cylinder',
  hexagon: 'Hexagon',
  pyramid: 'Pyramid',
  cone: 'Cone',
  sphere: 'Sphere',
  area: 'Area',
  circleArea: 'Circle area',
  text: 'Text',
  image: 'Image',
};

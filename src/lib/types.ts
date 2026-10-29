/** Rendering mode: top-down 2D or isometric 2.5D. */
export type ViewMode = '2d' | '3d';

/** Isometric camera rotation in quarter turns (0..3). */
export type Rotation = 0 | 1 | 2 | 3;

export type ShapeKind =
  | 'block'
  | 'cylinder'
  | 'hexagon'
  | 'pyramid'
  | 'cone'
  | 'sphere'
  | 'area'
  | 'circleArea'
  | 'text'
  | 'image';

/** How an image node is drawn in the 2.5D view. */
export type ImageStyle = 'tile' | 'flat' | 'standing';

/**
 * A diagram node. Coordinates are in grid units on the ground plane:
 * x grows to the east, y to the south, z (elevation) upward.
 */
export interface DiagramNode {
  id: string;
  kind: ShapeKind;
  x: number;
  y: number;
  /** Footprint width (x extent). */
  w: number;
  /** Footprint depth (y extent). */
  d: number;
  /** Height above its base. Ignored for flat kinds. */
  h: number;
  /** Elevation of the node's base. */
  z: number;
  color: string;
  label?: string;
  labelColor?: string;
  opacity?: number;
  /** For areas: draw a dashed border. */
  dashed?: boolean;
  /** For text nodes. */
  text?: string;
  fontSize?: number;
  /** For image nodes. */
  src?: string;
  imageStyle?: ImageStyle;
  /** Locked nodes can be selected but not moved. */
  locked?: boolean;
}

export type EdgeRouting = 'straight' | 'orthogonal';

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  color: string;
  width: number;
  dashed?: boolean;
  routing: EdgeRouting;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  label?: string;
}

export interface Diagram {
  version: 1;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface IconDef {
  id: string;
  name: string;
  /** Image URL or data URL. */
  src: string;
  category?: string;
}

export interface IconLibrary {
  id: string;
  name: string;
  icons: IconDef[];
}

export interface Camera {
  /** Screen-space pan offset in px. */
  x: number;
  y: number;
  zoom: number;
}

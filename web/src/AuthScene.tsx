import { useId, useMemo } from 'react';
import { createEdge, createImageNode, createShape, StaticDiagram, ThemeContext, type Diagram, type DiagramNode } from 'isodraw';
import { useTheme } from './theme';

/**
 * The backdrop of the sign-in pages: a faint isometric tile grid over the
 * whole page, and (on wide screens) a small system drawn live by IsoDraw
 * itself, with packets moving along its connections.
 */

/** A faint isometric grid, fading out toward the edges. */
export function IsoGrid() {
  const id = useId().replace(/:/g, '');
  // One diamond per tile: its height is its width × tan 30°, as on the canvas.
  const w = 56;
  const h = w * Math.tan(Math.PI / 6);
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 size-full text-primary" style={{ maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 85%)' }}>
      <defs>
        <pattern id={`${id}-tile`} width={w} height={h} patternUnits="userSpaceOnUse">
          <path d={`M0 ${h / 2} L${w / 2} 0 L${w} ${h / 2} L${w / 2} ${h} Z`} fill="none" stroke="currentColor" strokeOpacity={0.13} strokeWidth={1} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-tile)`} />
    </svg>
  );
}

/** Soft color behind everything, in the brand's blues. */
export function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -right-40 -bottom-48 size-[560px] rounded-full bg-sky-400/15 blur-3xl dark:bg-indigo-500/15" />
    </div>
  );
}

const BLUE = '#2563eb';

/** Place an isometric icon with its foot centred on (cx, cy). */
function icon(id: string, src: string, label: string, cx: number, cy: number, color = BLUE): DiagramNode {
  const n = createImageNode(`isodraw:${src}`, label, 0, 0);
  return { ...n, id, label, color, x: cx - n.w / 2, y: cy - n.d / 2 };
}

/** People → load balancer → two services → a database and a queue, inside a cloud area. */
function scene(): Diagram {
  const area = { ...createShape('area', 0, 0), id: 'cloud', x: 4.5, y: -0.5, w: 12, d: 11, color: BLUE, label: 'Your cloud', dashed: true, opacity: 0.08 };
  const nodes = [
    area,
    icon('users', 'users', 'Users', 1.5, 5),
    icon('lb', 'load-balancer', 'Load balancer', 7, 5),
    icon('api', 'service', 'API', 11, 2.2),
    icon('worker', 'function', 'Workers', 11, 7.8),
    icon('db', 'database', 'Postgres', 15, 2.2, '#4f46e5'),
    icon('queue', 'queue', 'Queue', 15, 7.8, '#0891b2'),
  ];
  const flow = { animation: 'packets' as const, color: '#64748b', animationColor: BLUE };
  const edges = [
    { ...createEdge('users', 'lb', flow), id: 'e1', label: 'HTTPS' },
    { ...createEdge('lb', 'api', flow), id: 'e2' },
    { ...createEdge('lb', 'worker', flow), id: 'e3' },
    { ...createEdge('api', 'db', flow), id: 'e4', label: 'SQL' },
    { ...createEdge('worker', 'queue', { ...flow, animationSpeed: 0.7 }), id: 'e5' },
  ];
  return { version: 1, view: '3d', nodes, edges };
}

/** The live diagram, floating slowly. Motion stops for people who ask for less. */
export function AuthScene() {
  const { resolved } = useTheme();
  const diagram = useMemo(scene, []);
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className={still ? '' : 'animate-[iso-float_7s_ease-in-out_infinite]'}>
      <ThemeContext.Provider value={resolved}>
        <StaticDiagram diagram={diagram} animate={!still} maxHeight={460} label="An example system drawn with IsoDraw: users, a load balancer, an API, workers, a database and a queue." />
      </ThemeContext.Provider>
    </div>
  );
}

import { Suspense, lazy } from 'react';
import type { Diagram } from './types';

export interface IsoDiagramPublishedProps {
  diagram: Diagram;
  /** Site title; defaults to the diagram's first text label, or "Architecture". */
  title?: string;
  /** Keep the current page in `location.hash` so pages can be linked and the back button works. */
  useHash?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// The published view renders docs with Tiptap, so it loads on demand.
const PublishedView = lazy(() => import('./PublishedView'));

/**
 * A read-only, docs-site style view of a diagram: an overview page with the
 * full diagram, then one page per component with the component drawn at the
 * top, its documentation, and its connections at the bottom.
 */
export function IsoDiagramPublished(props: IsoDiagramPublishedProps) {
  return (
    <Suspense fallback={<div className="isd-pub isd-pub-loading">Loading…</div>}>
      <PublishedView {...props} />
    </Suspense>
  );
}

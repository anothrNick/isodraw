import { Suspense, lazy } from 'react';
import { useResolvedTheme, type ResolvedTheme, type Theme } from './theme';
import type { Diagram } from './types';

export interface IsoDiagramPublishedProps {
  diagram: Diagram;
  /** Site title; defaults to the diagram's first text label, or "Architecture". */
  title?: string;
  /** Keep the current page in `location.hash` so pages can be linked and the back button works. */
  useHash?: boolean;
  /** Color theme (default light). */
  theme?: Theme;
  className?: string;
  style?: React.CSSProperties;
}

// The published view renders docs with Tiptap, so it loads on demand.
const PublishedView = lazy(() => import('./PublishedView'));

/**
 * A read-only reading view of a diagram and its docs: a page per component,
 * at every level of detail diagrams, with a nested table of contents beside it.
 */
export function IsoDiagramPublished(props: IsoDiagramPublishedProps) {
  const theme = useResolvedTheme(props.theme);
  return (
    <Suspense
      fallback={
        <div className="isd-pub isd-pub-loading" data-theme={theme}>
          Loading…
        </div>
      }
    >
      <PublishedView {...props} resolvedTheme={theme} />
    </Suspense>
  );
}

/** Props the lazy view receives: the theme is resolved once, up front. */
export type PublishedViewProps = IsoDiagramPublishedProps & { resolvedTheme: ResolvedTheme };

import { Suspense, lazy } from 'react';
import { useResolvedTheme, type ResolvedTheme, type Theme } from './theme';
import type { Diagram } from './types';

export interface IsoDiagramPresentationProps {
  diagram: Diagram;
  /** Shown for the top diagram's overview page; defaults to "Overview". */
  title?: string;
  /** The slide to start on (its id); defaults to the first, or to the hash with useHash. */
  start?: string;
  /** Keep the slide number in `location.hash` (#3), so reloading or going back keeps the place. */
  useHash?: boolean;
  /** Stop presenting (Esc, or the close button). Without it, there's no way out but leaving the page. */
  onExit?: () => void;
  /** Color theme (default light). */
  theme?: Theme;
  className?: string;
  style?: React.CSSProperties;
}

// The presenter shows docs with Tiptap, so it loads on demand.
const PresentationView = lazy(() => import('./PresentationView'));

/**
 * Present a diagram's slides: the camera flies from slide to slide, what's on
 * the slide stays bright, and a docs panel walks through each slide's pages.
 */
export function IsoDiagramPresentation(props: IsoDiagramPresentationProps) {
  const theme = useResolvedTheme(props.theme);
  return (
    <Suspense
      fallback={
        <div className="isd-present isd-present-loading" data-theme={theme}>
          Loading…
        </div>
      }
    >
      <PresentationView {...props} resolvedTheme={theme} />
    </Suspense>
  );
}

/** Props the lazy view receives: the theme is resolved once, up front. */
export type PresentationViewProps = IsoDiagramPresentationProps & { resolvedTheme: ResolvedTheme };

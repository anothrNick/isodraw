import { Suspense, lazy } from 'react';
import { useResolvedTheme, type Theme } from './theme';
import type { Diagram, DocTarget } from './types';

const DocReader = lazy(() => import('./DocsPanel').then((m) => ({ default: m.DocReader })));

export interface IsoDocViewProps {
  /** The doc's Markdown, e.g. docOf(target, diagram). */
  markdown: string;
  /** The diagram the doc belongs to, so @ mentions show its items' names. */
  diagram: Diagram;
  /** An @ mention was clicked. */
  onNavigate?: (t: DocTarget) => void;
  /** The pointer moved onto a mention (its target) or off it (null), e.g. to outline it on a diagram. */
  onMentionHover?: (t: DocTarget | null) => void;
  theme?: Theme;
  className?: string;
}

/**
 * One doc, rendered read-only with the same styles as the editor's Docs tab:
 * tables, code, callouts and @ mentions of the diagram's items. The renderer
 * loads on first use, so pages that show a doc only sometimes don't pay for it.
 */
export function IsoDocView({ markdown, diagram, onNavigate, onMentionHover, theme, className }: IsoDocViewProps) {
  const resolved = useResolvedTheme(theme);
  return (
    <div className={`isd-docview${className ? ` ${className}` : ''}`} data-theme={resolved}>
      <Suspense fallback={null}>
        <DocReader markdown={markdown} diagram={diagram} onNavigate={onNavigate ?? (() => undefined)} onMentionHover={onMentionHover} />
      </Suspense>
    </div>
  );
}

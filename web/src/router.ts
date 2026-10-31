import { useEffect, useState } from 'react';

/**
 * A small history-based router; the app has three pages, so a library isn't needed yet.
 *
 *   /                      → the first organization's diagrams
 *   /:org                  → an organization's diagrams
 *   /:org/d/:id#in/a/b     → a diagram, inside detail diagrams a › b
 */
export type Route = { page: 'home' } | { page: 'diagrams'; org: string } | { page: 'diagram'; org: string; id: string } | { page: 'missing' };

export function parseRoute(path: string): Route {
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { page: 'home' };
  if (parts.length === 1) return { page: 'diagrams', org: parts[0] };
  if (parts.length === 3 && parts[1] === 'd') return { page: 'diagram', org: parts[0], id: parts[2] };
  return { page: 'missing' };
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (opts.replace) history.replaceState(null, '', to);
  else history.pushState(null, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useRoute(): Route {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    const on = () => setPath(location.pathname);
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  return parseRoute(path);
}

/** Make an <a> navigate in-app on a plain click, and still open in a new tab with ⌘/Ctrl. */
export function linkProps(to: string) {
  return {
    href: to,
    onClick: (e: React.MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to);
    },
  };
}

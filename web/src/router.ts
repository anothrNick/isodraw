import { useEffect, useState } from 'react';

/**
 * A small history-based router; the app has a handful of pages, so a library isn't needed yet.
 *
 *   /                      → the first organization's diagrams
 *   /:org                  → an organization's diagrams
 *   /:org/d/:id#in/a/b     → a diagram, inside detail diagrams a › b
 *   /:org/d/:id/docs#/node/a/b → a diagram's docs, on component b inside a
 */
export type Route =
  | { page: 'home' }
  | { page: 'diagrams'; org: string }
  | { page: 'diagram'; org: string; id: string }
  | { page: 'docs'; org: string; id: string }
  | { page: 'missing' };

export function parseRoute(path: string): Route {
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { page: 'home' };
  if (parts.length === 1) return { page: 'diagrams', org: parts[0] };
  if (parts.length === 3 && parts[1] === 'd') return { page: 'diagram', org: parts[0], id: parts[2] };
  if (parts.length === 4 && parts[1] === 'd' && parts[3] === 'docs') return { page: 'docs', org: parts[0], id: parts[2] };
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

/**
 * The editor and the docs keep your place when you switch between them. In the
 * editor the hash is the level shown (#in/a/b); in the docs it is the page
 * (#/node/a/b/c, component c inside a › b).
 */
export function docsHashForLevel(level: string[]): string {
  return level.length ? `#/node/${level.map(encodeURIComponent).join('/')}` : '';
}

/** The editor level that shows the component a docs page is about. */
export function levelHashForDocs(hash: string): string {
  const m = /^#\/(?:node\/)?(.+)$/.exec(hash);
  const page = m ? m[1].split('/').filter(Boolean) : [];
  const level = page.slice(0, -1);
  return level.length ? `#in/${level.join('/')}` : '';
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

import type { ResolvedTheme } from './theme';

/**
 * Renders Mermaid text to SVG. Mermaid is big, so it loads on the first
 * render and stays out of the main bundle; docs without a Mermaid block never
 * fetch it.
 */

type MermaidApi = typeof import('mermaid').default;

let loading: Promise<MermaidApi> | undefined;
let counter = 0;

function load(): Promise<MermaidApi> {
  loading ??= import('mermaid').then((m) => m.default);
  return loading;
}

/** The SVG for a Mermaid diagram, or a thrown Error naming what is wrong with the text. */
export async function renderMermaid(source: string, theme: ResolvedTheme): Promise<string> {
  const mermaid = await load();
  // Theme is global config, so set it on every render: blocks in a dark doc and a light doc can share the page.
  mermaid.initialize({
    startOnLoad: false,
    theme: theme === 'dark' ? 'dark' : 'default',
    securityLevel: 'strict',
    // A bad diagram should report its error, not draw a "bomb" into the document.
    suppressErrorRendering: true,
    fontFamily: 'inherit',
  });
  const id = `isd-mermaid-${++counter}`;
  try {
    const { svg } = await mermaid.render(id, source);
    return svg;
  } finally {
    // Older renderers leave their scratch element behind on a parse error.
    document.getElementById(`d${id}`)?.remove();
  }
}

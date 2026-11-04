import type { ResolvedTheme } from './theme';

/**
 * Renders Mermaid text to SVG. Mermaid is big, so it loads on the first
 * render and stays out of the main bundle; docs without a Mermaid block never
 * fetch it.
 */

type MermaidApi = typeof import('mermaid').default;

/**
 * Mermaid's stock dark theme is its own palette (purples on near-black). These
 * variables, on the "base" theme, draw with the app's dark slate tokens from
 * styles.css instead: canvas, panel, border, text, muted and the blue accent.
 */
const DARK_VARIABLES = {
  darkMode: true,
  background: '#0b1220',
  fontFamily: 'inherit',
  fontSize: '13px',
  // Nodes
  primaryColor: '#1e293b',
  primaryTextColor: '#e2e8f0',
  primaryBorderColor: '#3b4a63',
  secondaryColor: '#131c2f',
  secondaryTextColor: '#e2e8f0',
  secondaryBorderColor: '#253247',
  tertiaryColor: '#0f172a',
  tertiaryTextColor: '#cbd5e1',
  tertiaryBorderColor: '#253247',
  mainBkg: '#1e293b',
  nodeBorder: '#3b4a63',
  nodeTextColor: '#e2e8f0',
  textColor: '#e2e8f0',
  titleColor: '#f8fafc',
  // Edges
  lineColor: '#94a3b8',
  arrowheadColor: '#94a3b8',
  edgeLabelBackground: '#0f172a',
  // Subgraphs and groups
  clusterBkg: '#0f172a',
  clusterBorder: '#253247',
  // Sequence diagrams
  actorBkg: '#1e293b',
  actorBorder: '#3b4a63',
  actorTextColor: '#e2e8f0',
  actorLineColor: '#3b4a63',
  signalColor: '#94a3b8',
  signalTextColor: '#e2e8f0',
  labelBoxBkgColor: '#131c2f',
  labelBoxBorderColor: '#253247',
  labelTextColor: '#e2e8f0',
  loopTextColor: '#e2e8f0',
  activationBkgColor: '#253247',
  activationBorderColor: '#60a5fa',
  sequenceNumberColor: '#0b1220',
  noteBkgColor: '#2a2410',
  noteBorderColor: '#b45309',
  noteTextColor: '#fde68a',
  // State, class and ER diagrams
  altBackground: '#131c2f',
  attributeBackgroundColorOdd: '#0f172a',
  attributeBackgroundColorEven: '#131c2f',
  // Pie, git and others pick from these
  pie1: '#60a5fa',
  pie2: '#34d399',
  pie3: '#fbbf24',
  pie4: '#f472b6',
  pie5: '#a78bfa',
  pie6: '#22d3ee',
  pieStrokeColor: '#0b1220',
  pieTitleTextColor: '#f8fafc',
  pieLegendTextColor: '#e2e8f0',
  pieSectionTextColor: '#0b1220',
  git0: '#60a5fa',
  git1: '#34d399',
  git2: '#fbbf24',
  git3: '#f472b6',
  git4: '#a78bfa',
  git5: '#22d3ee',
  git6: '#fb923c',
  git7: '#94a3b8',
  gitBranchLabel0: '#0b1220',
  gitBranchLabel1: '#0b1220',
  gitBranchLabel2: '#0b1220',
  gitBranchLabel3: '#0b1220',
  gitBranchLabel4: '#0b1220',
  gitBranchLabel5: '#0b1220',
  gitBranchLabel6: '#0b1220',
  gitBranchLabel7: '#0b1220',
  commitLabelColor: '#e2e8f0',
  commitLabelBackground: '#1e293b',
  tagLabelColor: '#e2e8f0',
  tagLabelBackground: '#1e293b',
  tagLabelBorder: '#3b4a63',
};

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
    ...(theme === 'dark' ? { theme: 'base', themeVariables: DARK_VARIABLES } : { theme: 'default' }),
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

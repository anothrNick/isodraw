import { useEffect, useState } from 'react';
import { IsoDiagramEditor, IsoDiagramPublished, emptyDiagram, useResolvedTheme, type Diagram, type IconDef, type LevelPath, type Theme } from '../lib';
import { EXAMPLES } from './examples';
import { sampleDiagram } from './sample';

const KEY = 'isodraw-demo:diagram';
const ICONS_KEY = 'isodraw-demo:icons';
const THEME_KEY = 'isodraw-demo:theme';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/** The detail diagram on screen lives in the URL as `#in/<component>/<component>`, so links and Back work. */
function readLevel(): LevelPath {
  const m = /^#in\/(.*)$/.exec(window.location.hash);
  return m ? m[1].split('/').filter(Boolean).map(decodeURIComponent) : [];
}
const levelHash = (level: LevelPath) => (level.length ? `#in/${level.map(encodeURIComponent).join('/')}` : '');

export function App() {
  const [diagram, setDiagram] = useState<Diagram>(() => load(KEY, sampleDiagram));
  const [icons, setIcons] = useState<IconDef[]>(() => load(ICONS_KEY, []));
  // Remounting the editor re-fits the camera after a reset.
  const [epoch, setEpoch] = useState(0);
  const [mode, setMode] = useState<'edit' | 'view' | 'published'>(() => (window.location.hash.startsWith('#/') ? 'published' : 'edit'));
  const [theme, setTheme] = useState<Theme>(() => load<Theme>(THEME_KEY, 'system'));
  const resolved = useResolvedTheme(theme);
  const [level, setLevel] = useState<LevelPath>(readLevel);

  useEffect(() => {
    const onNav = () => setLevel(readLevel());
    window.addEventListener('popstate', onNav);
    window.addEventListener('hashchange', onNav);
    return () => {
      window.removeEventListener('popstate', onNav);
      window.removeEventListener('hashchange', onNav);
    };
  }, []);
  const changeLevel = (next: LevelPath) => {
    setLevel(next);
    const hash = levelHash(next);
    if (window.location.hash !== hash) history.pushState(null, '', hash || window.location.pathname + window.location.search);
  };

  // The demo page follows the same theme as the components.
  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(theme));
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(diagram));
    } catch {
      /* storage full or unavailable */
    }
  }, [diagram]);
  useEffect(() => {
    try {
      localStorage.setItem(ICONS_KEY, JSON.stringify(icons));
    } catch {
      /* storage full or unavailable */
    }
  }, [icons]);

  const reset = (d: Diagram) => {
    setDiagram(d);
    setEpoch((e) => e + 1);
    setLevel([]);
    if (window.location.hash.startsWith('#in/')) history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  return (
    <div className="demo">
      <header className="demo-header">
        <div className="demo-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2 3 7l9 5 9-5-9-5Z" fill="#60a5fa" />
            <path d="M3 7v10l9 5V12L3 7Z" fill="#2563eb" />
            <path d="M21 7v10l-9 5V12l9-5Z" fill="#1d4ed8" />
          </svg>
          <strong>IsoDraw</strong>
          <span>Cloudcraft-style diagrams for React</span>
        </div>
        <div className="demo-actions">
          <div className="demo-modes" role="radiogroup" aria-label="Mode">
            {(
              [
                ['edit', 'Edit', 'Draw and document'],
                ['view', 'View', 'Browse the diagram and its docs without editing'],
                ['published', 'Published', 'Docs-site view: a page per component'],
              ] as const
            ).map(([m, label, hint]) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                className={mode === m ? 'is-on' : ''}
                title={hint}
                onClick={() => {
                  setMode(m);
                  if (m !== 'published' && window.location.hash.startsWith('#/')) history.replaceState(null, '', window.location.pathname);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="demo-select" title="Load an example diagram (replaces the current one)">
            <span>Examples</span>
            <select
              value=""
              aria-label="Load an example diagram"
              onChange={(e) => {
                const ex = EXAMPLES.find((x) => x.id === e.target.value);
                if (ex) reset(ex.diagram);
              }}
            >
              <option value="" disabled>
                Load example…
              </option>
              {EXAMPLES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => reset(emptyDiagram())}>New blank</button>
        </div>
        <button
          type="button"
          className="demo-theme"
          onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
          aria-label={resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {resolved === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>
      <main className="demo-main">
        {mode === 'published' ? (
          <IsoDiagramPublished diagram={diagram} useHash theme={theme} />
        ) : (
        <IsoDiagramEditor
          key={epoch}
          value={diagram}
          onChange={setDiagram}
          userIcons={icons}
          onUserIconsChange={setIcons}
          readOnly={mode === 'view'}
          theme={theme}
          level={level}
          onLevelChange={changeLevel}
        />
        )}
      </main>
    </div>
  );
}

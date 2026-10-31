import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IsoDiagramEditor, type LevelPath } from 'isodraw';
import { ApiError, api, type Org, type StoredDiagram } from './api';
import { useAutosave, type SaveStatus } from './autosave';
import { Message } from './App';

export function EditorPage({ org, id }: { org: Org; id: string }) {
  const [loaded, setLoaded] = useState<StoredDiagram | null>(null);
  const [error, setError] = useState<ApiError | Error | null>(null);

  useEffect(() => {
    api.getDiagram(id).then(setLoaded).catch(setError);
  }, [id]);

  if (error instanceof ApiError && error.status === 404) {
    return <Message title="Diagram not found" body="It may have been deleted, or you don't have access to it." />;
  }
  if (error) return <Message title="Couldn't open the diagram" body={error.message} />;
  if (!loaded) return <div className="app-loading">Opening…</div>;
  return <Editor initial={loaded} readOnly={org.role === 'viewer'} />;
}

/** The level inside detail diagrams lives in the hash: #in/<component>/<component>. */
function readLevel(): LevelPath {
  const m = /^#in\/(.*)$/.exec(location.hash);
  return m ? m[1].split('/').filter(Boolean).map(decodeURIComponent) : [];
}

function Editor({ initial, readOnly }: { initial: StoredDiagram; readOnly: boolean }) {
  const { diagram, change, status, notice, dismissNotice, saveNow } = useAutosave(initial);
  const [title, setTitle] = useState(initial.title);
  const [level, setLevel] = useState<LevelPath>(readLevel);

  useEffect(() => {
    const on = () => setLevel(readLevel());
    window.addEventListener('popstate', on);
    window.addEventListener('hashchange', on);
    return () => {
      window.removeEventListener('popstate', on);
      window.removeEventListener('hashchange', on);
    };
  }, []);
  const changeLevel = (next: LevelPath) => {
    setLevel(next);
    const hash = next.length ? `#in/${next.map(encodeURIComponent).join('/')}` : '';
    if (location.hash !== hash) history.pushState(null, '', hash || location.pathname);
  };

  const rename = async () => {
    const t = title.trim();
    if (!t || t === initial.title) return setTitle(initial.title);
    try {
      const m = await api.rename(initial.id, t);
      initial.title = m.title;
      document.title = `${m.title} · IsoDraw`;
    } catch {
      setTitle(initial.title);
    }
  };
  useEffect(() => {
    document.title = `${initial.title} · IsoDraw`;
    return () => {
      document.title = 'IsoDraw';
    };
  }, [initial.title]);

  const slot = document.getElementById('app-bar-slot');
  return (
    <div className="editor-page">
      {slot &&
        createPortal(
          <>
            <input
              className="app-title"
              value={title}
              aria-label="Diagram title"
              readOnly={readOnly}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={rename}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            />
            {!readOnly && <SaveIndicator status={status} onRetry={saveNow} />}
          </>,
          slot,
        )}
      {notice && (
        <div className="app-notice" role="status">
          {notice}
          <button type="button" className="app-btn is-quiet is-small" onClick={dismissNotice}>
            OK
          </button>
        </div>
      )}
      <IsoDiagramEditor value={diagram} onChange={change} readOnly={readOnly} level={level} onLevelChange={changeLevel} theme="system" className="editor" />
    </div>
  );
}

function SaveIndicator({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  const text = {
    saved: 'Saved',
    unsaved: 'Unsaved changes',
    saving: 'Saving…',
    offline: 'Offline, will retry',
    error: status.state === 'error' ? `Not saved: ${status.message}` : '',
  }[status.state];
  return (
    <span className={`app-save is-${status.state}`} role="status" aria-live="polite">
      {text}
      {(status.state === 'offline' || status.state === 'error') && (
        <button type="button" className="app-btn is-quiet is-small" onClick={onRetry}>
          Retry now
        </button>
      )}
    </span>
  );
}

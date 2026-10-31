import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Check, CloudOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { IsoDiagramEditor, type LevelPath } from 'isodraw';
import { ApiError, api, type Org, type StoredDiagram } from './api';
import { useAutosave, type SaveStatus } from './autosave';
import { Loading, Message } from './App';
import { useTheme } from './theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
  if (!loaded) return <Loading label="Opening…" />;
  return <Editor initial={loaded} readOnly={org.role === 'viewer'} />;
}

/** The level inside detail diagrams lives in the hash: #in/<component>/<component>. */
function readLevel(): LevelPath {
  const m = /^#in\/(.*)$/.exec(location.hash);
  return m ? m[1].split('/').filter(Boolean).map(decodeURIComponent) : [];
}

function Editor({ initial, readOnly }: { initial: StoredDiagram; readOnly: boolean }) {
  const { diagram, change, status, notice, dismissNotice, saveNow } = useAutosave(initial);
  const { resolved } = useTheme();
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

  // Merges after a conflicting save are worth knowing about, but not worth blocking on.
  useEffect(() => {
    if (!notice) return;
    toast.info(notice, { duration: 8000 });
    dismissNotice();
  }, [notice, dismissNotice]);

  const rename = async () => {
    const t = title.trim();
    if (!t || t === initial.title) return setTitle(initial.title);
    try {
      const m = await api.rename(initial.id, t);
      initial.title = m.title;
      document.title = `${m.title} · IsoDraw`;
    } catch (e) {
      setTitle(initial.title);
      toast.error((e as Error).message);
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
    <div className="relative flex min-h-0 flex-1 flex-col">
      {slot &&
        createPortal(
          <>
            <span className="text-muted-foreground/60">/</span>
            <Input
              value={title}
              aria-label="Diagram title"
              readOnly={readOnly}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={rename}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              className="h-8 w-[min(420px,40vw)] border-transparent bg-transparent px-1.5 font-semibold shadow-none hover:border-input focus-visible:bg-card dark:bg-transparent"
            />
            {!readOnly && <SaveIndicator status={status} onRetry={saveNow} />}
          </>,
          slot,
        )}
      <IsoDiagramEditor
        value={diagram}
        onChange={change}
        readOnly={readOnly}
        level={level}
        onLevelChange={changeLevel}
        theme={resolved}
        className="min-h-0 flex-1 rounded-none border-0"
      />
    </div>
  );
}

function SaveIndicator({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  const view = {
    saved: { icon: <Check />, text: 'Saved', tone: 'text-success' },
    saving: { icon: <Loader2 className="animate-spin" />, text: 'Saving…', tone: 'text-muted-foreground' },
    unsaved: { icon: <span className="size-1.5 rounded-full bg-current" />, text: 'Unsaved changes', tone: 'text-warning' },
    offline: { icon: <CloudOff />, text: 'Offline, retrying', tone: 'text-warning' },
    error: { icon: <AlertCircle />, text: status.state === 'error' ? `Not saved: ${status.message}` : '', tone: 'text-destructive' },
  }[status.state];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs whitespace-nowrap [&_svg]:size-3.5', view.tone)} role="status" aria-live="polite">
      {view.icon}
      {view.text}
      {(status.state === 'offline' || status.state === 'error') && (
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onRetry}>
          Retry now
        </Button>
      )}
    </span>
  );
}

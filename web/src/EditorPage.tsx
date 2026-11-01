import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, BookOpen, Check, CloudOff, Copy, ExternalLink, Image, Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { IsoDiagramEditor, type LevelPath } from 'isodraw';
import { ApiError, api, type Org, type PreviewLink, type StoredDiagram } from './api';
import { useAutosave, type SaveStatus } from './autosave';
import { Loading, Message } from './App';
import { docsHashForLevel, navigate } from './router';
import { useTheme } from './theme';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  return <Editor org={org} initial={loaded} readOnly={org.role === 'viewer'} />;
}

/** The level inside detail diagrams lives in the hash: #in/<component>/<component>. */
function readLevel(): LevelPath {
  const m = /^#in\/(.*)$/.exec(location.hash);
  return m ? m[1].split('/').filter(Boolean).map(decodeURIComponent) : [];
}

function Editor({ org, initial, readOnly }: { org: Org; initial: StoredDiagram; readOnly: boolean }) {
  const { diagram, change, status, notice, dismissNotice, saveNow, saveAndWait } = useAutosave(initial);
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
            <span className="flex-1" />
            <ShareMenu id={initial.id} level={level} beforeLink={readOnly ? undefined : saveAndWait} />
            {/* Read the docs, starting on the component whose detail diagram is open. */}
            <Button variant="outline" size="sm" onClick={async () => {
                // The docs load from the server, so it must have the latest edits first.
                if (!readOnly) await saveAndWait();
                navigate(`/${org.slug}/d/${initial.id}/docs${docsHashForLevel(level)}`);
              }}>
              <BookOpen />
              Docs
            </Button>
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
        // The top bar links to the docs page; writing docs happens in the sidebar's Docs tab.
        docsButton={false}
        className="min-h-0 flex-1 rounded-none border-0"
      />
    </div>
  );
}

/**
 * Copy a preview link: a picture of the open level that shows in chat and
 * Markdown without signing in. The link is made when the menu opens, after
 * saving, so copying happens right on click (Safari refuses clipboard writes
 * that come after waiting on the network).
 */
function ShareMenu({ id, level, beforeLink }: { id: string; level: LevelPath; beforeLink?: () => Promise<unknown> }) {
  const [link, setLink] = useState<Promise<PreviewLink> | null>(null);
  const make = () => {
    const p = (async () => {
      await beforeLink?.();
      return api.previewLink(id, level);
    })();
    p.catch(() => setLink(null)); // Try again next time the menu opens.
    setLink(p);
    return p;
  };
  const copy = async (what: string, text: (l: PreviewLink) => string) => {
    try {
      const l = await (link ?? make());
      await navigator.clipboard.writeText(text(l));
      toast.success(`${what} copied`, { description: `Anyone with the link can see this picture until ${new Date(l.expiresAt).toLocaleDateString()}. Docs aren't included.` });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : `Couldn't copy the ${what.toLowerCase()}`);
    }
  };
  const open = async () => {
    // Open the tab now, while the click still counts, and point it at the picture once the link is ready.
    const tab = window.open('', '_blank');
    try {
      const l = await (link ?? make());
      if (tab) tab.location.href = l.svg;
    } catch (e) {
      tab?.close();
      toast.error((e as Error).message);
    }
  };
  return (
    <DropdownMenu onOpenChange={(o) => o && make()}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Link2 />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Preview link{level.length ? ` · ${level[level.length - 1]}` : ''}, good for 7 days
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => copy('Image link', (l) => l.svg)}>
          <Image />
          Copy image link
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => copy('Markdown', (l) => `[![${l.title.replace(/[[\]]/g, '\\$&')}](${l.svg})](${l.url})`)}>
          <Copy />
          Copy as Markdown
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={open}>
          <ExternalLink />
          Open preview
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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

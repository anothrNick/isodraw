import { useEffect, useState } from 'react';
import { BookOpen, Box, LayoutGrid, List, MoreHorizontal, Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { api, type DiagramMeta, type Org } from './api';
import { NewDiagramDialog } from './NewDiagramDialog';
import { linkProps, navigate } from './router';
import { useTheme } from './theme';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const canEdit = (org: Org) => org.role !== 'viewer';

type View = 'grid' | 'list';
const VIEW_KEY = 'isodraw:diagram-view';

/** List or grid, remembered in this browser. */
function useView(): [View, (v: View) => void] {
  const [view, setView] = useState<View>(() => {
    try {
      return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid';
    } catch {
      return 'grid';
    }
  });
  const change = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* storage unavailable */
    }
  };
  return [view, change];
}

export function DiagramList({ org }: { org: Org }) {
  const [diagrams, setDiagrams] = useState<DiagramMeta[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<DiagramMeta | null>(null);
  const [view, setView] = useView();
  const { resolved } = useTheme();

  useEffect(() => {
    api
      .listDiagrams(org.id)
      .then((r) => setDiagrams(r.diagrams))
      .catch((e: Error) => setError(e.message));
  }, [org.id]);

  const remove = async (d: DiagramMeta) => {
    try {
      await api.deleteDiagram(d.id);
      setDiagrams((cur) => cur?.filter((x) => x.id !== d.id) ?? null);
      toast.success(`Deleted “${d.title}”`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="overflow-y-auto">
      <div className={cn('mx-auto w-full px-6 py-10', view === 'grid' ? 'max-w-6xl' : 'max-w-3xl')}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">{org.personal ? 'Your diagrams' : org.name}</h1>
          <div className="flex gap-2">
            <div role="radiogroup" aria-label="Show as" className="inline-flex h-9 items-center rounded-md border bg-muted/50 p-0.5">
              {(
                [
                  ['grid', LayoutGrid, 'Grid'],
                  ['list', List, 'List'],
                ] as const
              ).map(([v, Icon, label]) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={view === v}
                  aria-label={label}
                  title={label}
                  onClick={() => setView(v)}
                  className={cn(
                    'inline-flex h-full items-center rounded-[5px] px-2 text-muted-foreground transition-colors [&_svg]:size-4',
                    view === v ? 'bg-background text-foreground shadow-xs' : 'hover:text-foreground',
                  )}
                >
                  <Icon />
                </button>
              ))}
            </div>
            {!org.personal && (
              <Button variant="outline" asChild>
                <a {...linkProps(`/${org.slug}/members`)}>
                  <Users />
                  Members
                </a>
              </Button>
            )}
            {canEdit(org) && (
              <Button onClick={() => setCreating(true)}>
                <Plus />
                New diagram
              </Button>
            )}
          </div>
        </div>

        {error && <p className="text-destructive">{error}</p>}

        {!diagrams && !error && view === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-card">
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="p-3">
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : !diagrams && !error ? (
          <div className="divide-y rounded-lg border bg-card">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        ) : diagrams && diagrams.length === 0 ? (
          <div className="flex flex-col items-center rounded-lg border border-dashed bg-card px-6 py-14 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Box className="size-5" />
            </div>
            <p className="font-medium">No diagrams yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Draw your architecture and document each part of it.</p>
            {canEdit(org) && (
              <Button variant="outline" className="mt-5" onClick={() => setCreating(true)}>
                <Plus />
                Draw your first diagram
              </Button>
            )}
          </div>
        ) : diagrams && view === 'grid' ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diagrams.map((d) => (
              <li key={d.id} className="group relative overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
                <a className="block" {...linkProps(`/${org.slug}/d/${d.id}`)} aria-label={d.title}>
                  <Thumbnail diagram={d} dark={resolved === 'dark'} />
                </a>
                <div className="flex items-center gap-2 border-t px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <a className="block truncate text-sm font-medium hover:underline" {...linkProps(`/${org.slug}/d/${d.id}`)}>
                      {d.title}
                    </a>
                    <span className="text-xs text-muted-foreground">Edited {ago(d.updatedAt)}</span>
                  </div>
                  <DiagramActions org={org} diagram={d} onDelete={setDeleting} />
                </div>
              </li>
            ))}
          </ul>
        ) : diagrams ? (
          <ul className="divide-y rounded-lg border bg-card">
            {diagrams.map((d) => (
              <li key={d.id} className="group flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50">
                <div className="flex size-8 flex-none items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Box className="size-4" />
                </div>
                <a className="min-w-0 flex-1 truncate font-medium hover:underline" {...linkProps(`/${org.slug}/d/${d.id}`)}>
                  {d.title}
                </a>
                <span className="text-xs whitespace-nowrap text-muted-foreground">Edited {ago(d.updatedAt)}</span>
                <DiagramActions org={org} diagram={d} onDelete={setDeleting} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <NewDiagramDialog org={org} open={creating} onOpenChange={setCreating} />

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>The diagram and its docs will be removed for everyone in {org.personal ? 'your account' : org.name}.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => deleting && void remove(deleting)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** A diagram's picture for the grid; an icon until it loads, or if it can't. */
function Thumbnail({ diagram, dark }: { diagram: DiagramMeta; dark: boolean }) {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>(diagram.thumbnail ? 'loading' : 'failed');
  const src = diagram.thumbnail && (dark ? `${diagram.thumbnail}&theme=dark` : diagram.thumbnail);
  return (
    <div className={cn('relative flex aspect-[16/10] items-center justify-center overflow-hidden', dark ? 'bg-[#0b1220]' : 'bg-[#f4f7fb]')}>
      {state !== 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center text-primary/60">
          {state === 'loading' ? <Skeleton className="size-full rounded-none" /> : <Box className="size-8" />}
        </div>
      )}
      {src && state !== 'failed' && (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setState('ready')}
          onError={() => setState('failed')}
          className={cn('size-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]', state !== 'ready' && 'opacity-0')}
        />
      )}
    </div>
  );
}

/** Read docs, and delete for editors. */
function DiagramActions({ org, diagram: d, onDelete }: { org: Org; diagram: DiagramMeta; onDelete: (d: DiagramMeta) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 flex-none" aria-label={`Actions for ${d.title}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => navigate(`/${org.slug}/d/${d.id}/docs`)}>
          <BookOpen />
          Read docs
        </DropdownMenuItem>
        {canEdit(org) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(d)}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ago(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString();
}

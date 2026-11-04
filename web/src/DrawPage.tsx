import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Download, HardDrive, Loader2, Plus, TriangleAlert } from 'lucide-react';
import { IsoDiagramEditor, downloadBlob, emptyDiagram, exportJson, type Diagram, type IconDef } from 'isodraw';
import type { Example } from 'isodraw-templates';
import { Loading, Logo } from './App';
import { loadDraft, saveDraft } from './draft';
import { linkProps } from './router';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * /draw: the editor with no account. One diagram, kept in this browser (see
 * draft.ts) and saved as it changes; the editor's own Open and Export bring
 * diagrams in and out. Nothing is sent anywhere.
 */

/** The templates carry docs and a Terraform sample, so they load only here. */
let templates: Promise<Example[]> | null = null;
const loadTemplates = () => (templates ??= import('isodraw-templates').then((m) => m.EXAMPLES));

/** The first visit starts from this example: it shows the most of what IsoDraw does. */
const STARTER = 'three-tier';
const SAVE_AFTER_MS = 400;

type Status = 'saved' | 'saving' | 'failed';

export function DrawPage() {
  const [draft, setDraft] = useState<{ diagram: Diagram; icons: IconDef[] } | null>(null);
  // Remount the editor when the diagram is replaced, so its level, selection and history start over.
  const [generation, setGeneration] = useState(0);
  const [status, setStatus] = useState<Status>('saved');
  const [replacing, setReplacing] = useState<(() => Promise<Diagram>) | null>(null);
  const [examples, setExamples] = useState<Example[]>([]);
  const { resolved } = useTheme();
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(draft);
  latest.current = draft;

  useEffect(() => {
    document.title = 'Draw · IsoDraw';
    loadTemplates().then(setExamples, () => undefined);
    let live = true;
    loadDraft().then(async (saved) => {
      if (!live) return;
      if (saved) return setDraft({ diagram: saved.diagram, icons: saved.icons });
      const all = await loadTemplates().catch(() => [] as Example[]);
      if (live) setDraft({ diagram: all.find((e) => e.id === STARTER)?.diagram ?? emptyDiagram(), icons: [] });
    });
    return () => {
      live = false;
      document.title = 'IsoDraw';
    };
  }, []);

  const save = useCallback(() => {
    pending.current = null;
    const d = latest.current;
    if (!d) return;
    saveDraft({ ...d, savedAt: Date.now() }).then(
      () => setStatus('saved'),
      () => setStatus('failed'),
    );
  }, []);

  // Saved shortly after each change, and straight away when the page is left.
  const schedule = useCallback(() => {
    setStatus('saving');
    if (pending.current) clearTimeout(pending.current);
    pending.current = setTimeout(save, SAVE_AFTER_MS);
  }, [save]);
  useEffect(() => {
    const flush = () => pending.current && (clearTimeout(pending.current), save());
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [save]);

  const change = (diagram: Diagram) => {
    setDraft((d) => (d ? { ...d, diagram } : d));
    schedule();
  };
  const changeIcons = (icons: IconDef[]) => {
    setDraft((d) => (d ? { ...d, icons } : d));
    schedule();
  };

  const download = () => {
    if (!draft) return;
    downloadBlob(exportJson(draft.diagram), 'diagram.isodraw.json', 'application/json');
  };

  /** Replace the diagram, asking first when there's something to lose. */
  const replaceWith = (next: () => Promise<Diagram>) => {
    if (draft && (draft.diagram.nodes.length || draft.diagram.edges.length)) setReplacing(() => next);
    else void apply(next);
  };
  const apply = async (next: () => Promise<Diagram>) => {
    const diagram = await next();
    setDraft((d) => ({ diagram, icons: d?.icons ?? [] }));
    setGeneration((g) => g + 1);
    schedule();
  };

  if (!draft) return <Loading label="Opening…" />;

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 flex-none items-center gap-2 border-b bg-card px-3">
        <a className="flex items-center gap-2 rounded-md px-1.5 py-1 font-semibold hover:bg-accent" {...linkProps('/')}>
          <Logo />
          IsoDraw
        </a>
        <span className="text-muted-foreground/60">/</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 px-1.5">
              <Plus />
              New
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem onSelect={() => replaceWith(async () => emptyDiagram())}>Blank diagram</DropdownMenuItem>
            {examples.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Start from an example</DropdownMenuLabel>
                {examples.map((ex) => (
                  <DropdownMenuItem key={ex.id} onSelect={() => replaceWith(async () => ex.diagram)}>
                    {ex.name}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="hidden items-center gap-1.5 px-1.5 text-xs text-muted-foreground sm:flex">
              {status === 'failed' ? (
                <TriangleAlert className="size-3.5 text-amber-600" />
              ) : status === 'saving' ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <HardDrive className="size-3.5" />
              )}
              {status === 'failed' ? "Couldn't save on this device" : 'Saved on this device'}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-64">
            {status === 'failed'
              ? 'This browser won’t store it (it may be full, or a private window). Export it to keep a copy.'
              : 'Nothing leaves your browser. Clearing site data or a private window loses it, so export a copy or sign up to keep it.'}
          </TooltipContent>
        </Tooltip>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" asChild>
          <a {...linkProps('/login')}>Sign in</a>
        </Button>
        <Button size="sm" asChild>
          <a {...linkProps('/signup')}>Sign up free</a>
        </Button>
      </header>
      <main className="relative flex min-h-0 flex-1 flex-col">
        {!draft.diagram.nodes.length && (
          // An empty canvas says where to start; it goes once there's something on it.
          <div className="pointer-events-none absolute inset-x-0 top-1/3 z-10 flex justify-center px-4">
            <div className="max-w-sm rounded-lg border bg-card/90 px-5 py-4 text-center text-sm shadow-sm backdrop-blur">
              <p className="font-medium">Start drawing</p>
              <p className="mt-1 text-muted-foreground">
                Add shapes and icons from the panel on the left, open a diagram or Terraform file with Open, or pick an example from New.
              </p>
            </div>
          </div>
        )}
        <IsoDiagramEditor
          key={generation}
          value={draft.diagram}
          onChange={change}
          theme={resolved}
          // No account, so dropped-in images stay in the diagram (as data URLs) and in this browser.
          userIcons={draft.icons}
          onUserIconsChange={changeIcons}
          className="min-h-0 flex-1 rounded-none! border-0!"
        />
      </main>
      <AlertDialog open={!!replacing} onOpenChange={(open) => !open && setReplacing(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace this diagram?</AlertDialogTitle>
            <AlertDialogDescription>
              Without an account you can keep one diagram, and it's only saved in this browser. Download it first to keep a copy you can open again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                download();
                const next = replacing;
                setReplacing(null);
                if (next) void apply(next);
              }}
            >
              <Download />
              Download, then replace
            </Button>
            <AlertDialogAction
              onClick={() => {
                const next = replacing;
                setReplacing(null);
                if (next) void apply(next);
              }}
            >
              Replace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

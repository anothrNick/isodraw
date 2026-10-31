import { useEffect, useState } from 'react';
import { Check, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { StaticDiagram, ThemeContext, type Diagram } from 'isodraw';
import type { Example } from 'isodraw-templates';
import { api, type Org } from './api';
import { navigate } from './router';
import { useTheme } from './theme';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/** The templates carry docs and a Terraform sample, so they load only when someone opens this dialog. */
let templates: Promise<Example[]> | null = null;
const loadTemplates = () => (templates ??= import('isodraw-templates').then((m) => m.EXAMPLES));

const BLANK = 'blank';

/** Start a diagram: blank, or a copy of a documented example. */
export function NewDiagramDialog({ org, open, onOpenChange }: { org: Org; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [list, setList] = useState<Example[] | null>(null);
  const [choice, setChoice] = useState(BLANK);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const { resolved } = useTheme();

  useEffect(() => {
    if (!open) return;
    setChoice(BLANK);
    setTitle('');
    loadTemplates()
      .then(setList)
      .catch(() => setList([]));
  }, [open]);

  const template = list?.find((t) => t.id === choice);

  const create = async (id = choice) => {
    const t = list?.find((x) => x.id === id);
    setBusy(true);
    try {
      // A template is copied: the new diagram is independent of it.
      const content: Diagram | undefined = t ? structuredClone(t.diagram) : undefined;
      const d = await api.createDiagram(org.id, title.trim() || t?.name || undefined, content);
      onOpenChange(false);
      navigate(`/${org.slug}/d/${d.id}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(760px,92vh)] flex-col gap-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>New diagram</DialogTitle>
          <DialogDescription>Start from a blank canvas, or from a documented example you can change.</DialogDescription>
        </DialogHeader>

        <form
          id="new-diagram"
          className="flex min-h-0 flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            void create();
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Title</span>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={template?.name ?? 'Untitled diagram'} autoFocus />
          </label>

          {/* Previews draw their labels for the app's light or dark theme. */}
          <ThemeContext.Provider value={resolved}>
          <div className="-mx-1 min-h-0 overflow-y-auto px-1 pb-1">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Start from">
              <Choice id={BLANK} name="Blank" description="An empty canvas." chosen={choice === BLANK} onChoose={setChoice} onCreate={create}>
                <div className="flex size-full items-center justify-center rounded-md border border-dashed text-muted-foreground">
                  <Plus className="size-6" />
                </div>
              </Choice>
              {list === null
                ? [0, 1].map((i) => (
                    <div key={i} className="flex h-[190px] items-center justify-center rounded-lg border text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ))
                : list.map((t) => (
                    <Choice key={t.id} id={t.id} name={t.name} description={t.description} chosen={choice === t.id} onChoose={setChoice} onCreate={create}>
                      <StaticDiagram diagram={t.diagram} maxHeight={96} animate={false} label={`${t.name} preview`} />
                    </Choice>
                  ))}
            </div>
          </div>
          </ThemeContext.Provider>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="new-diagram" disabled={busy}>
            {busy && <Loader2 className="animate-spin" />}
            {template ? 'Create from template' : 'Create blank diagram'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Choice({
  id,
  name,
  description,
  chosen,
  onChoose,
  onCreate,
  children,
}: {
  id: string;
  name: string;
  description: string;
  chosen: boolean;
  onChoose: (id: string) => void;
  onCreate: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={chosen}
      onClick={() => onChoose(id)}
      onDoubleClick={() => onCreate(id)}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg border bg-card text-left transition-colors hover:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
        chosen && 'border-primary ring-1 ring-primary',
      )}
    >
      {/* Previews sit on the editor's canvas color, as they would in the editor. */}
      <div className="pointer-events-none flex h-[110px] items-center justify-center bg-muted/60 p-2">{children}</div>
      <div className="flex flex-col gap-0.5 border-t p-3">
        <span className="text-sm font-medium">{name}</span>
        <span className="line-clamp-2 text-xs text-muted-foreground">{description}</span>
      </div>
      {chosen && (
        <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3.5" />
        </span>
      )}
    </button>
  );
}

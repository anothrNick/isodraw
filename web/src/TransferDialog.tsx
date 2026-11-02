import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, type Org } from './api';
import { navigate } from './router';
import { useSession } from './session';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type Transfer = { mode: 'move' | 'copy'; id: string; title: string };

/**
 * Move a diagram to another workspace, or copy it to any workspace you can
 * edit (its own included). Either counts against the target's plan; the
 * API says so when it's full.
 */
export function TransferDialog({
  from,
  transfer: current,
  onClose,
  onMoved,
}: {
  from: Org;
  transfer: Transfer | null;
  onClose: () => void;
  onMoved?: (to: Org) => void;
}) {
  const session = useSession();
  // Keep showing the last diagram while the dialog animates closed.
  const [transfer, setShown] = useState(current);
  if (current && current !== transfer) setShown(current);
  const [target, setTarget] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const move = transfer?.mode === 'move';
  const targets = session.orgs.filter((o) => o.role !== 'viewer' && (!move || o.id !== from.id));
  useEffect(() => {
    if (current) setTarget(null);
  }, [current]);

  const run = async () => {
    const to = targets.find((o) => o.id === target);
    if (!transfer || !to) return;
    setBusy(true);
    try {
      const where = to.personal ? 'your personal workspace' : to.name;
      if (move) {
        await api.moveDiagram(transfer.id, to.id);
        onMoved?.(to);
        toast.success(`Moved “${transfer.title}” to ${where}`, {
          action: { label: 'Open', onClick: () => navigate(`/${to.slug}/d/${transfer.id}`) },
        });
      } else {
        const copy = await api.copyDiagram(transfer.id, to.id);
        toast.success(`Copied to ${where} as “${copy.title}”`, {
          action: { label: 'Open', onClick: () => navigate(`/${to.slug}/d/${copy.id}`) },
        });
      }
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={!!current} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{move ? 'Move to another workspace' : 'Copy to a workspace'}</DialogTitle>
          <DialogDescription>
            {move
              ? `“${transfer?.title}” keeps its links and history. People in ${from.personal ? 'this workspace' : from.name} who aren't in the new one lose access.`
              : `A copy of “${transfer?.title}” with its docs. The original stays where it is.`}
          </DialogDescription>
        </DialogHeader>
        {targets.length === 0 ? (
          <p className="text-sm text-muted-foreground">There's no other workspace you can edit. Create a team from the workspace menu first.</p>
        ) : (
          <div role="radiogroup" aria-label="Workspace" className="flex max-h-72 flex-col gap-1 overflow-y-auto">
            {targets.map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={target === o.id}
                onClick={() => setTarget(o.id)}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                  target === o.id ? 'border-primary bg-primary/5' : 'hover:bg-accent',
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{o.personal ? 'Personal' : o.name}</span>
                  {o.id === from.id && <span className="text-xs text-muted-foreground">This workspace</span>}
                </span>
                {target === o.id && <Check className="size-4 flex-none text-primary" />}
              </button>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={run} disabled={busy || !target}>
            {busy && <Loader2 className="animate-spin" />}
            {move ? 'Move' : 'Copy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

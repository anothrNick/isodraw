import { useEffect, useState } from 'react';
import { BookOpen, Box, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, type DiagramMeta, type Org } from './api';
import { NewDiagramDialog } from './NewDiagramDialog';
import { linkProps, navigate } from './router';
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

const canEdit = (org: Org) => org.role !== 'viewer';

export function DiagramList({ org }: { org: Org }) {
  const [diagrams, setDiagrams] = useState<DiagramMeta[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<DiagramMeta | null>(null);

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
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">{org.personal ? 'Your diagrams' : org.name}</h1>
          {canEdit(org) && (
            <Button onClick={() => setCreating(true)}>
              <Plus />
              New diagram
            </Button>
          )}
        </div>

        {error && <p className="text-destructive">{error}</p>}

        {!diagrams && !error ? (
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${d.title}`}>
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
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(d)}>
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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

function ago(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString();
}

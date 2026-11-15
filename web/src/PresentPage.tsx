import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PencilLine } from 'lucide-react';
import { IsoDiagramPresentation } from 'isodraw';
import { ApiError, api, type Org, type StoredDiagram } from './api';
import { Loading, Message } from './App';
import { navigate } from './router';
import { useTheme } from './theme';
import { Button } from '@/components/ui/button';

/**
 * Presenting a diagram: the camera flies from slide to slide with the docs
 * alongside. Like the docs page, everyone in the organization can open it.
 */
export function PresentPage({ org, id }: { org: Org; id: string }) {
  const [loaded, setLoaded] = useState<StoredDiagram | null>(null);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const { resolved } = useTheme();

  useEffect(() => {
    api.getDiagram(id).then(setLoaded).catch(setError);
  }, [id]);

  useEffect(() => {
    if (!loaded) return;
    document.title = `${loaded.title} · Presenting · IsoDraw`;
    return () => {
      document.title = 'IsoDraw';
    };
  }, [loaded]);

  if (error instanceof ApiError && error.status === 404) {
    return <Message title="Diagram not found" body="It may have been deleted, or you don't have access to it." />;
  }
  if (error) return <Message title="Couldn't open the presentation" body={error.message} />;
  if (!loaded) return <Loading />;

  const slot = document.getElementById('app-bar-slot');
  const back = () => navigate(`/${org.slug}/d/${id}`);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {slot &&
        createPortal(
          <>
            <span className="text-muted-foreground/60">/</span>
            <span className="truncate px-1.5 font-semibold">{loaded.title}</span>
            <span className="text-xs text-muted-foreground">Presenting</span>
            <span className="flex-1" />
            <Button variant="outline" size="sm" onClick={back}>
              <PencilLine />
              {org.role === 'viewer' ? 'Open diagram' : 'Edit'}
            </Button>
          </>,
          slot,
        )}
      <IsoDiagramPresentation diagram={loaded.content} title={loaded.title} useHash theme={resolved} onExit={back} className="min-h-0 flex-1" />
    </div>
  );
}

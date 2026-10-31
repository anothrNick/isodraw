import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PencilLine } from 'lucide-react';
import { IsoDiagramPublished } from 'isodraw';
import { ApiError, api, type Org, type StoredDiagram } from './api';
import { Loading, Message } from './App';
import { levelHashForDocs, navigate } from './router';
import { useTheme } from './theme';
import { Button } from '@/components/ui/button';

/**
 * A diagram's docs as a reading page: nested contents beside the text, a page
 * per component at every level. Everyone in the organization can read it.
 */
export function DocsPage({ org, id }: { org: Org; id: string }) {
  const [loaded, setLoaded] = useState<StoredDiagram | null>(null);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const { resolved } = useTheme();

  useEffect(() => {
    api.getDiagram(id).then(setLoaded).catch(setError);
  }, [id]);

  useEffect(() => {
    if (!loaded) return;
    document.title = `${loaded.title} docs · IsoDraw`;
    return () => {
      document.title = 'IsoDraw';
    };
  }, [loaded]);

  if (error instanceof ApiError && error.status === 404) {
    return <Message title="Diagram not found" body="It may have been deleted, or you don't have access to it." />;
  }
  if (error) return <Message title="Couldn't open the docs" body={error.message} />;
  if (!loaded) return <Loading />;

  const slot = document.getElementById('app-bar-slot');
  // Back to the editor, on the level that shows the component being read.
  const edit = () => navigate(`/${org.slug}/d/${id}${levelHashForDocs(location.hash)}`);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {slot &&
        createPortal(
          <>
            <span className="text-muted-foreground/60">/</span>
            <span className="truncate px-1.5 font-semibold">{loaded.title}</span>
            <span className="text-xs text-muted-foreground">Docs</span>
            <span className="flex-1" />
            <Button variant="outline" size="sm" onClick={edit}>
              <PencilLine />
              {org.role === 'viewer' ? 'Open diagram' : 'Edit'}
            </Button>
          </>,
          slot,
        )}
      <IsoDiagramPublished diagram={loaded.content} title={loaded.title} useHash theme={resolved} className="min-h-0 flex-1" />
    </div>
  );
}

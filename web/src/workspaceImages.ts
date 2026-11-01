import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { IconDef } from 'isodraw';
import { api, type WorkspaceImage } from './api';

const CATEGORY = 'Workspace';

const asIcon = (i: WorkspaceImage): IconDef => ({ id: `ws:${i.id}`, name: i.name, src: i.url, category: CATEGORY });

/**
 * The editor's Images tab for a workspace: images uploaded by anyone in it,
 * from the API, plus links added in this session. Uploads go to the
 * workspace, and removing one takes it off everyone's list. The list
 * refreshes when the window comes back into focus, to pick up teammates' uploads.
 */
export function useWorkspaceImages(orgId: string) {
  const [icons, setIcons] = useState<IconDef[]>([]);
  const current = useRef(icons);
  current.current = icons;

  const load = useCallback(async () => {
    try {
      const { images } = await api.images(orgId);
      const links = current.current.filter((i) => i.category !== CATEGORY);
      setIcons([...images.map(asIcon), ...links]);
    } catch {
      // The tab still works with what it has; the next focus tries again.
    }
  }, [orgId]);

  useEffect(() => {
    void load();
    const onFocus = () => void load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [load]);

  const upload = async (files: File[]) => {
    const added: IconDef[] = [];
    for (const f of files) added.push(asIcon(await api.uploadImage(orgId, f)));
    return added;
  };

  // The editor reports the whole new list; workspace images missing from it were removed.
  const change = (next: IconDef[]) => {
    const kept = new Set(next.map((i) => i.id));
    const removed = current.current.filter((i) => i.category === CATEGORY && !kept.has(i.id));
    setIcons(next);
    for (const i of removed) {
      api.removeImage(orgId, i.id.slice('ws:'.length)).catch((err: Error) => {
        toast.error(`Couldn't remove ${i.name}: ${err.message}`);
        void load();
      });
    }
  };

  return { icons, upload, change };
}

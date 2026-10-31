import { useCallback, useEffect, useRef, useState } from 'react';
import { mergeDiagrams, type Diagram } from 'isodraw';
import { ApiError, api, signIn, type StoredDiagram } from './api';

export type SaveStatus =
  | { state: 'saved' }
  | { state: 'unsaved' }
  | { state: 'saving' }
  | { state: 'offline'; retryIn: number }
  | { state: 'error'; message: string };

const DEBOUNCE_MS = 800;
const draftKey = (id: string) => `isodraw:draft:${id}`;

/** Unsaved changes kept in the browser when the session runs out mid-edit. */
interface Draft {
  version: number;
  content: Diagram;
}

function readDraft(id: string): Draft | null {
  try {
    return JSON.parse(localStorage.getItem(draftKey(id)) ?? 'null') as Draft | null;
  } catch {
    return null;
  }
}

/**
 * Keeps a diagram saved while it is edited. Changes are sent after a short
 * pause, naming the version they were made on. If someone else saved first,
 * the server answers 409 with their version; the two edits are merged item by
 * item and the result is saved, so nobody's work is overwritten.
 */
export function useAutosave(initial: StoredDiagram) {
  const draft = readDraft(initial.id);
  // A draft from the version we just loaded can be applied as is.
  const restored = draft && draft.version === initial.version ? draft.content : null;

  const [diagram, setDiagram] = useState<Diagram>(restored ?? initial.content);
  const [status, setStatus] = useState<SaveStatus>(restored ? { state: 'unsaved' } : { state: 'saved' });
  const [notice, setNotice] = useState<string | null>(restored ? 'Restored changes that had not been saved.' : null);
  const s = useRef({
    /** What the server has at `version`. */
    base: initial.content,
    version: initial.version,
    local: restored ?? initial.content,
    inFlight: false,
    timer: 0,
    retries: 0,
  });

  const schedule = useCallback((ms: number) => {
    window.clearTimeout(s.current.timer);
    s.current.timer = window.setTimeout(() => void flush(), ms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flush = useCallback(async () => {
    const st = s.current;
    if (st.inFlight) return; // the running save reschedules when it finishes
    if (st.local === st.base) {
      setStatus({ state: 'saved' });
      return;
    }
    st.inFlight = true;
    setStatus({ state: 'saving' });
    const sent = st.local;
    try {
      const meta = await api.saveContent(initial.id, st.version, sent);
      st.base = sent;
      st.version = meta.version;
      st.retries = 0;
      localStorage.removeItem(draftKey(initial.id));
      if (st.local !== sent) schedule(0);
      else setStatus({ state: 'saved' });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        const current = err.body.current as StoredDiagram;
        const { diagram: merged, conflicts } = mergeDiagrams(st.base, st.local, current.content);
        st.base = current.content;
        st.version = current.version;
        st.local = merged;
        setDiagram(merged);
        setNotice(
          conflicts
            ? `Someone else edited this diagram. Their changes were merged in; where you both changed the same item (${conflicts}), yours were kept.`
            : 'Someone else edited this diagram. Their changes were merged in.',
        );
        schedule(0);
      } else if (err instanceof ApiError && err.status === 401) {
        localStorage.setItem(draftKey(initial.id), JSON.stringify({ version: st.version, content: st.local } satisfies Draft));
        signIn();
      } else if (err instanceof ApiError) {
        setStatus({ state: 'error', message: err.message });
      } else {
        // Network trouble: keep the changes and try again, backing off up to 30 s.
        const wait = Math.min(30_000, 1000 * 2 ** st.retries++);
        setStatus({ state: 'offline', retryIn: wait });
        schedule(wait);
      }
    } finally {
      st.inFlight = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.id]);

  const change = useCallback(
    (d: Diagram) => {
      if (d === s.current.local) return;
      s.current.local = d;
      setDiagram(d);
      setStatus({ state: 'unsaved' });
      schedule(DEBOUNCE_MS);
    },
    [schedule],
  );

  // A restored draft still has to reach the server.
  useEffect(() => {
    if (restored) schedule(0);
    return () => window.clearTimeout(s.current.timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warn before leaving with changes that haven't reached the server.
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (s.current.local !== s.current.base || s.current.inFlight) e.preventDefault();
    };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, []);

  return { diagram, change, status, notice, dismissNotice: () => setNotice(null), saveNow: () => schedule(0) };
}

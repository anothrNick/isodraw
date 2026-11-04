import { parseDiagram, type Diagram, type IconDef } from 'isodraw';

/**
 * The diagram someone draws at /draw without an account, kept in this
 * browser: IndexedDB, since images dropped into it are stored inside it as
 * data URLs and soon outgrow localStorage's few megabytes. Falls back to
 * localStorage where IndexedDB isn't available (some private windows).
 */

export interface Draft {
  diagram: Diagram;
  /** Images dropped in or loaded from a URL, as the editor's Images tab lists them. */
  icons: IconDef[];
  savedAt: number;
}

const DB = 'isodraw';
const STORE = 'drafts';
const KEY = 'draw';
const FALLBACK = 'isodraw:draw-draft';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB is not available'));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        tx.oncomplete = () => {
          db.close();
          resolve(req.result);
        };
        tx.onerror = tx.onabort = () => {
          db.close();
          reject(tx.error ?? req.error);
        };
      }),
  );
}

/** A stored draft, checked: anything that doesn't read as a diagram counts as none. */
function valid(raw: unknown): Draft | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<Draft>;
  try {
    return { diagram: parseDiagram(r.diagram), icons: Array.isArray(r.icons) ? r.icons : [], savedAt: Number(r.savedAt) || 0 };
  } catch {
    return null;
  }
}

export async function loadDraft(): Promise<Draft | null> {
  try {
    return valid(await run('readonly', (s) => s.get(KEY)));
  } catch {
    try {
      const raw = localStorage.getItem(FALLBACK);
      return raw ? valid(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  }
}

/** Save the draft; throws if neither store will take it (full, or blocked). */
export async function saveDraft(draft: Draft): Promise<void> {
  try {
    await run('readwrite', (s) => s.put(draft, KEY));
  } catch {
    localStorage.setItem(FALLBACK, JSON.stringify(draft));
  }
}

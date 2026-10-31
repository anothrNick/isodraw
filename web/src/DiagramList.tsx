import { useEffect, useState } from 'react';
import { api, type DiagramMeta, type Org } from './api';
import { linkProps, navigate } from './router';

const canEdit = (org: Org) => org.role !== 'viewer';

export function DiagramList({ org }: { org: Org }) {
  const [diagrams, setDiagrams] = useState<DiagramMeta[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .listDiagrams(org.id)
      .then((r) => setDiagrams(r.diagrams))
      .catch((e: Error) => setError(e.message));
  }, [org.id]);

  const create = async () => {
    setBusy(true);
    try {
      const d = await api.createDiagram(org.id);
      navigate(`/${org.slug}/d/${d.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  const remove = async (d: DiagramMeta) => {
    if (!window.confirm(`Delete “${d.title}”?`)) return;
    try {
      await api.deleteDiagram(d.id);
      setDiagrams((cur) => cur?.filter((x) => x.id !== d.id) ?? null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="list-page">
      <div className="list-head">
        <h1>{org.personal ? 'Your diagrams' : org.name}</h1>
        {canEdit(org) && (
          <button type="button" className="app-btn is-primary" onClick={create} disabled={busy}>
            New diagram
          </button>
        )}
      </div>
      {error && <p className="app-error">{error}</p>}
      {!diagrams ? (
        <p className="list-empty">Loading…</p>
      ) : diagrams.length === 0 ? (
        <div className="list-empty">
          <p>No diagrams yet.</p>
          {canEdit(org) && (
            <button type="button" className="app-btn" onClick={create} disabled={busy}>
              Draw your first diagram
            </button>
          )}
        </div>
      ) : (
        <ul className="list">
          {diagrams.map((d) => (
            <li key={d.id}>
              <a className="list-title" {...linkProps(`/${org.slug}/d/${d.id}`)}>
                {d.title}
              </a>
              <span className="list-meta">Edited {ago(d.updatedAt)}</span>
              {canEdit(org) && (
                <button type="button" className="app-btn is-quiet is-small" onClick={() => remove(d)} aria-label={`Delete ${d.title}`}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
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

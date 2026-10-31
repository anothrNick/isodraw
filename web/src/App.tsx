import { useEffect, useState } from 'react';
import { ApiError, api, signIn, type Org, type User } from './api';
import { DiagramList } from './DiagramList';
import { EditorPage } from './EditorPage';
import { linkProps, navigate, useRoute } from './router';

type Session = { user: User; orgs: Org[] };

export function App() {
  const route = useRoute();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .me()
      .then(setSession)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) signIn();
        else setError(err instanceof Error ? err.message : String(err));
      });
  }, []);

  // "/" opens the first organization (the personal one).
  useEffect(() => {
    if (session && route.page === 'home' && session.orgs[0]) navigate(`/${session.orgs[0].slug}`, { replace: true });
  }, [session, route.page]);

  if (error) return <Message title="Can't reach IsoDraw" body={error} />;
  if (!session) return <div className="app-loading">Loading…</div>;

  const org = 'org' in route ? session.orgs.find((o) => o.slug === route.org) : session.orgs[0];
  if (route.page === 'missing' || ('org' in route && !org)) {
    return (
      <Shell session={session}>
        <Message title="Not found" body="There's nothing here, or you don't have access to it." />
      </Shell>
    );
  }
  if (!org) return null;

  return (
    <Shell session={session} org={org}>
      {route.page === 'diagram' ? <EditorPage key={route.id} org={org} id={route.id} /> : <DiagramList key={org.id} org={org} />}
    </Shell>
  );
}

function Shell({ session, org, children }: { session: Session; org?: Org; children: React.ReactNode }) {
  const signOut = async () => {
    await api.signOut().catch(() => undefined);
    window.location.assign('/auth/login');
  };
  return (
    <div className="app">
      <header className="app-bar">
        <a className="app-brand" {...linkProps(org ? `/${org.slug}` : '/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2 3 7l9 5 9-5-9-5Z" fill="#60a5fa" />
            <path d="M3 7v10l9 5V12L3 7Z" fill="#2563eb" />
            <path d="M21 7v10l-9 5V12l9-5Z" fill="#1d4ed8" />
          </svg>
          IsoDraw
        </a>
        {org && session.orgs.length > 1 && (
          <select className="app-org" value={org.slug} aria-label="Organization" onChange={(e) => navigate(`/${e.target.value}`)}>
            {session.orgs.map((o) => (
              <option key={o.id} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        )}
        <div className="app-bar-slot" id="app-bar-slot" />
        <span className="app-user" title={session.user.email}>
          {session.user.name || session.user.email}
        </span>
        <button type="button" className="app-btn is-quiet" onClick={signOut}>
          Sign out
        </button>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

export function Message({ title, body }: { title: string; body: string }) {
  return (
    <div className="app-message">
      <h1>{title}</h1>
      <p>{body}</p>
      <a {...linkProps('/')}>Go to your diagrams</a>
    </div>
  );
}

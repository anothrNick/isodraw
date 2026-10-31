import { useEffect, useState } from 'react';
import { ChevronsUpDown, Loader2, LogOut, Monitor, Moon, Sun } from 'lucide-react';
import { ApiError, api, signIn, type Org, type User } from './api';
import { DiagramList } from './DiagramList';
import { DocsPage } from './DocsPage';
import { EditorPage } from './EditorPage';
import { linkProps, navigate, useRoute } from './router';
import { setThemeSetting, useTheme, type ThemeSetting } from './theme';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Session = { user: User; orgs: Org[] };

export function App() {
  const route = useRoute();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  useTheme(); // keeps <html class="dark"> in step on every page

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
  if (!session) return <Loading />;

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
      {route.page === 'diagram' ? (
        <EditorPage key={route.id} org={org} id={route.id} />
      ) : route.page === 'docs' ? (
        <DocsPage key={route.id} org={org} id={route.id} />
      ) : (
        <DiagramList key={org.id} org={org} />
      )}
    </Shell>
  );
}

function Logo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2 3 7l9 5 9-5-9-5Z" fill="#60a5fa" />
      <path d="M3 7v10l9 5V12L3 7Z" fill="#2563eb" />
      <path d="M21 7v10l-9 5V12l9-5Z" fill="#1d4ed8" />
    </svg>
  );
}

function Shell({ session, org, children }: { session: Session; org?: Org; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 flex-none items-center gap-2 border-b bg-card px-3">
        <a className="flex items-center gap-2 rounded-md px-1.5 py-1 font-semibold hover:bg-accent" {...linkProps(org ? `/${org.slug}` : '/')}>
          <Logo />
          IsoDraw
        </a>
        {org && (
          <>
            <span className="text-muted-foreground/60">/</span>
            <OrgSwitcher orgs={session.orgs} current={org} />
          </>
        )}
        {/* The editor puts the diagram's title and save status here. */}
        <div id="app-bar-slot" className="flex min-w-0 flex-1 items-center gap-2" />
        <UserMenu user={session.user} />
      </header>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}

function OrgSwitcher({ orgs, current }: { orgs: Org[]; current: Org }) {
  if (orgs.length < 2) {
    return (
      <a className="rounded-md px-1.5 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground" {...linkProps(`/${current.slug}`)}>
        {current.name}
      </a>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 px-1.5 text-muted-foreground">
          {current.name}
          <ChevronsUpDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current.slug} onValueChange={(slug) => navigate(`/${slug}`)}>
          {orgs.map((o) => (
            <DropdownMenuRadioItem key={o.id} value={o.slug}>
              {o.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function initials(user: User) {
  const source = user.name || user.email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase();
}

function UserMenu({ user }: { user: User }) {
  const { setting } = useTheme();
  const signOut = async () => {
    await api.signOut().catch(() => undefined);
    window.location.assign('/auth/login');
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">{initials(user)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="truncate font-medium">{user.name || user.email}</div>
          {user.name && <div className="truncate text-xs text-muted-foreground">{user.email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {setting === 'dark' ? <Moon /> : setting === 'light' ? <Sun /> : <Monitor />}
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={setting} onValueChange={(v) => setThemeSetting(v as ThemeSetting)}>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function Message({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto mt-24 max-w-md px-4 text-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{body}</p>
      <Button asChild variant="outline" className="mt-6">
        <a {...linkProps('/')}>Go to your diagrams</a>
      </Button>
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { ChevronsUpDown, Infinity as InfinityIcon, KeyRound, Loader2, LogOut, Monitor, Moon, Plus, ShieldCheck, Sparkles, Sun, Users } from 'lucide-react';
import { ApiError, api, signIn, type Org, type User } from './api';
import { AuthPages } from './AuthPages';
import { CliLoginPage } from './CliLoginPage';
import { ConnectAiDialog } from './ConnectAiDialog';
import { ConnectPage } from './ConnectPage';
import { DiagramList } from './DiagramList';
import { DocsPage } from './DocsPage';
import { DrawPage } from './DrawPage';
import { EditorPage } from './EditorPage';
import { InvitePage } from './InvitePage';
import { LandingPage } from './LandingPage';
import { MembersPage } from './MembersPage';
import { linkProps, navigate, useRoute } from './router';
import { SessionContext, type Session } from './session';
import { TokensPage } from './TokensPage';
import { AdminPage } from './AdminPage';
import { PlanPage } from './PlanPage';
import { NewWorkspaceDialog } from './NewWorkspaceDialog';
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

export function App() {
  const route = useRoute();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Signed out at "/": show the landing page instead of sending them to sign in.
  const [signedOut, setSignedOut] = useState(false);
  useTheme(); // keeps <html class="dark"> in step on every page

  const reload = useCallback(async (): Promise<Session> => {
    const me = await api.me();
    const next = { ...me, reload };
    setSession(next);
    return next;
  }, []);

  const authPage = route.page === 'login' || route.page === 'signup' || route.page === 'verify' || route.page === 'forgot' || route.page === 'reset';

  useEffect(() => {
    // Signing in isn't needed (or asked for) on the auth pages or at /draw.
    if (authPage || route.page === 'draw') return;
    reload().catch((err) => {
      if (err instanceof ApiError && err.status === 401) {
        if (location.pathname === '/') setSignedOut(true);
        else signIn();
      }
      else setError(err instanceof Error ? err.message : String(err));
    });
  }, [reload, authPage, route.page]);

  // "/" opens the first organization (the personal one).
  useEffect(() => {
    if (session && route.page === 'home' && session.orgs[0]) navigate(`/${session.orgs[0].slug}`, { replace: true });
  }, [session, route.page]);

  if (route.page === 'login' || route.page === 'signup' || route.page === 'verify' || route.page === 'forgot' || route.page === 'reset')
    return <AuthPages route={route} />;
  if (route.page === 'draw') return <DrawPage />;
  if (signedOut && route.page === 'home') return <LandingPage />;
  if (error) return <Message title="Can't reach IsoDraw" body={error} />;
  if (!session) return <Loading />;

  // Account-level pages, outside any workspace.
  if (
    route.page === 'invite' ||
    route.page === 'cli-login' ||
    route.page === 'connect' ||
    route.page === 'tokens' ||
    route.page === 'plan' ||
    route.page === 'admin'
  ) {
    return (
      <SessionContext.Provider value={session}>
        <Shell session={session}>
          {route.page === 'invite' ? (
            <InvitePage token={route.token} />
          ) : route.page === 'cli-login' ? (
            <CliLoginPage />
          ) : route.page === 'connect' ? (
            <ConnectPage />
          ) : route.page === 'plan' ? (
            <PlanPage />
          ) : route.page === 'admin' ? (
            <AdminPage section={route.section} id={route.id} />
          ) : (
            <TokensPage />
          )}
        </Shell>
      </SessionContext.Provider>
    );
  }

  const org = 'org' in route ? session.orgs.find((o) => o.slug === route.org) : session.orgs[0];
  if (route.page === 'missing' || ('org' in route && !org)) {
    return (
      <SessionContext.Provider value={session}>
        <Shell session={session}>
          <Message title="Not found" body="There's nothing here, or you don't have access to it." />
        </Shell>
      </SessionContext.Provider>
    );
  }
  if (!org) return null;

  return (
    <SessionContext.Provider value={session}>
      <Shell session={session} org={org}>
        {route.page === 'diagram' ? (
          <EditorPage key={route.id} org={org} id={route.id} />
        ) : route.page === 'docs' ? (
          <DocsPage key={route.id} org={org} id={route.id} />
        ) : route.page === 'members' ? (
          <MembersPage key={org.id} org={org} />
        ) : (
          <DiagramList key={org.id} org={org} />
        )}
      </Shell>
    </SessionContext.Provider>
  );
}

/** The IsoDraw mark: an isometric capital I (also the favicon). */
export function Logo({ size = 22 }: { size?: number }) {
  return <img src="/favicon.svg" width={size} height={size} alt="" aria-hidden className="flex-none" />;
}

function Shell({ session, org, children }: { session: Session; org?: Org; children: React.ReactNode }) {
  const route = useRoute();
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 flex-none items-center gap-2 border-b bg-card px-3">
        <a className="flex items-center gap-2 rounded-md px-1.5 py-1 font-semibold hover:bg-accent" {...linkProps(org ? `/${org.slug}` : '/')}>
          <Logo />
          IsoDraw
        </a>
        <span className="text-muted-foreground/60">/</span>
        <OrgSwitcher orgs={session.orgs} current={org} />
        {/* The editor and docs pages put the diagram's title and actions here. */}
        <div id="app-bar-slot" className="flex min-w-0 flex-1 items-center gap-2" />
        <ConnectAiButton compact={route.page === 'diagram' || route.page === 'docs'} />
        <UserMenu user={session.user} admin={!!session.admin} />
      </header>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}

function OrgSwitcher({ orgs, current }: { orgs: Org[]; current?: Org }) {
  const [creating, setCreating] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 px-1.5 text-muted-foreground">
            {current?.name ?? 'Workspaces'}
            <ChevronsUpDown className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={current?.slug ?? ''} onValueChange={(slug) => navigate(`/${slug}`)}>
            {orgs.map((o) => (
              <DropdownMenuRadioItem key={o.id} value={o.slug}>
                <span className="truncate">{o.name}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          {current && !current.personal && (
            <DropdownMenuItem onSelect={() => navigate(`/${current.slug}/members`)}>
              <Users />
              Members
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setCreating(true)}>
            <Plus />
            New workspace…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewWorkspaceDialog open={creating} onOpenChange={setCreating} />
    </>
  );
}

/** Opens the guide to adding IsoDraw's MCP server to AI apps. */
function ConnectAiButton({ compact }: { compact: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* The editor's bar is full of its own actions, so there it's just the icon. */}
      <Button
        variant="ghost"
        size={compact ? 'icon' : 'sm'}
        className="flex-none text-muted-foreground"
        aria-label="Connect MCP"
        title="Connect Claude, ChatGPT, Cursor and other AI apps over MCP"
        onClick={() => setOpen(true)}
      >
        <Sparkles />
        {!compact && <span className="hidden sm:inline">Connect MCP</span>}
      </Button>
      <ConnectAiDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export function initials(user: { name: string; email: string }) {
  const source = user.name || user.email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase();
}

function UserMenu({ user, admin }: { user: User; admin: boolean }) {
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
        <DropdownMenuItem onSelect={() => navigate('/settings/plan')}>
          <InfinityIcon />
          Plan
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/settings/tokens')}>
          <KeyRound />
          API tokens
        </DropdownMenuItem>
        {admin && (
          <DropdownMenuItem onSelect={() => navigate('/admin')}>
            <ShieldCheck />
            Platform admin
          </DropdownMenuItem>
        )}
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

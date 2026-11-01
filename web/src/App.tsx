import { useCallback, useContext, useEffect, useState } from 'react';
import { ChevronsUpDown, KeyRound, Loader2, LogOut, Monitor, Moon, Plus, Sun, Users } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError, api, signIn, type Org, type User } from './api';
import { AuthPages } from './AuthPages';
import { CliLoginPage } from './CliLoginPage';
import { ConnectPage } from './ConnectPage';
import { DiagramList } from './DiagramList';
import { DocsPage } from './DocsPage';
import { EditorPage } from './EditorPage';
import { InvitePage } from './InvitePage';
import { MembersPage } from './MembersPage';
import { linkProps, navigate, useRoute } from './router';
import { SessionContext, type Session } from './session';
import { TokensPage } from './TokensPage';
import { setThemeSetting, useTheme, type ThemeSetting } from './theme';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';

export function App() {
  const route = useRoute();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  useTheme(); // keeps <html class="dark"> in step on every page

  const reload = useCallback(async (): Promise<Session> => {
    const me = await api.me();
    const next = { ...me, reload };
    setSession(next);
    return next;
  }, []);

  const authPage = route.page === 'login' || route.page === 'signup' || route.page === 'verify' || route.page === 'forgot' || route.page === 'reset';

  useEffect(() => {
    if (authPage) return;
    reload().catch((err) => {
      if (err instanceof ApiError && err.status === 401) signIn();
      else setError(err instanceof Error ? err.message : String(err));
    });
  }, [reload, authPage]);

  // "/" opens the first organization (the personal one).
  useEffect(() => {
    if (session && route.page === 'home' && session.orgs[0]) navigate(`/${session.orgs[0].slug}`, { replace: true });
  }, [session, route.page]);

  if (route.page === 'login' || route.page === 'signup' || route.page === 'verify' || route.page === 'forgot' || route.page === 'reset')
    return <AuthPages route={route} />;
  if (error) return <Message title="Can't reach IsoDraw" body={error} />;
  if (!session) return <Loading />;

  // Account-level pages, outside any workspace.
  if (route.page === 'invite' || route.page === 'cli-login' || route.page === 'connect' || route.page === 'tokens') {
    return (
      <SessionContext.Provider value={session}>
        <Shell session={session}>
          {route.page === 'invite' ? (
            <InvitePage token={route.token} />
          ) : route.page === 'cli-login' ? (
            <CliLoginPage />
          ) : route.page === 'connect' ? (
            <ConnectPage />
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

export function Logo() {
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
        <span className="text-muted-foreground/60">/</span>
        <OrgSwitcher orgs={session.orgs} current={org} />
        {/* The editor and docs pages put the diagram's title and actions here. */}
        <div id="app-bar-slot" className="flex min-w-0 flex-1 items-center gap-2" />
        <UserMenu user={session.user} />
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
            Create team…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTeamDialog open={creating} onOpenChange={setCreating} />
    </>
  );
}

function CreateTeamDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const session = useContext(SessionContext);
  useEffect(() => {
    if (open) setName('');
  }, [open]);
  const create = async () => {
    setBusy(true);
    try {
      const org = await api.createTeam(name);
      await session?.reload();
      onOpenChange(false);
      navigate(`/${org.slug}/members`);
      toast.success(`Created ${org.name}. Invite people to work on diagrams together.`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a team</DialogTitle>
          <DialogDescription>A shared workspace: its diagrams belong to the team, and you choose who can edit or just read them.</DialogDescription>
        </DialogHeader>
        <form
          id="create-team"
          onSubmit={(e) => {
            e.preventDefault();
            void create();
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Platform team" autoFocus />
          </label>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="create-team" disabled={busy || !name.trim()}>
            {busy && <Loader2 className="animate-spin" />}
            Create team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function initials(user: { name: string; email: string }) {
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
        <DropdownMenuItem onSelect={() => navigate('/settings/tokens')}>
          <KeyRound />
          API tokens
        </DropdownMenuItem>
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

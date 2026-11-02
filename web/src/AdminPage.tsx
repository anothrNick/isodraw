import { useEffect, useState } from 'react';
import { ArrowLeft, Infinity as InfinityIcon, Loader2, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, formatPrice, type AdminEvent, type AdminUser, type AdminUserDetail, type AdminWorkspace,
  type WorkspacePlan, type Invite, type Member, type Plan } from './api';
import { Loading, Message } from './App';
import { ago } from './DiagramList';
import { linkProps, navigate, type AdminSection } from './router';
import { ROLE_NAMES, useSession } from './session';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Platform admin: every user and workspace, for the people who run IsoDraw.
 * Only platform admins (the Cognito admins group) get here; the API answers
 * 404 to everyone else. It shows who and what exists, never diagram content.
 */
export function AdminPage({ section, id }: { section: AdminSection; id?: string }) {
  const session = useSession();
  if (!session.admin) return <Message title="Not found" body="There's nothing here, or you don't have access to it." />;
  return (
    <div className="overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <ShieldCheck className="size-6 text-primary" />
            Platform admin
          </h1>
          <nav className="inline-flex h-9 items-center rounded-md border bg-muted/50 p-0.5 text-sm">
            {(
              [
                ['overview', 'Overview', '/admin'],
                ['users', 'Users', '/admin/users'],
                ['workspaces', 'Workspaces', '/admin/workspaces'],
                ['log', 'Log', '/admin/log'],
              ] as const
            ).map(([s, label, href]) => (
              <a
                key={s}
                {...linkProps(href)}
                aria-current={section === s ? 'page' : undefined}
                className={cn(
                  'inline-flex h-full items-center rounded-[5px] px-3 text-muted-foreground transition-colors',
                  section === s ? 'bg-background text-foreground shadow-xs' : 'hover:text-foreground',
                )}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        {section === 'overview' ? (
          <Overview />
        ) : section === 'users' ? (
          id ? <UserDetail key={id} id={id} /> : <Users />
        ) : section === 'workspaces' ? (
          id ? <WorkspaceDetail key={id} id={id} /> : <Workspaces />
        ) : (
          <Log />
        )}
      </div>
    </div>
  );
}

// ---------- overview ----------

function Overview() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.admin.stats>> | null>(null);
  useEffect(() => {
    api.admin.stats().then(setData, (e: Error) => toast.error(e.message));
  }, []);
  if (!data) return <Loading />;
  const s = data.stats;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Users" value={s.users} note={`${s.usersLastWeek} new this week`} href="/admin/users" />
        <Stat label="Active this week" value={s.activeWeek} note="signed in in the last 7 days" />
        <Stat label="Lifetime" value={s.lifetime} note="accounts with lifetime access" />
        <Stat
          label="Founding seats sold"
          value={data.seats.sold}
          note={`of ${data.seats.total}${data.seats.pending ? `, ${data.seats.pending} in checkout` : ''}${data.checkout ? '' : ' · checkout off'}`}
        />
        <Stat label="Teams" value={s.teams} note="team workspaces" href="/admin/workspaces" />
        <Stat label="Diagrams" value={s.diagrams} note="not deleted" />
        <Stat label="Images" value={s.images} note={`${bytes(s.imageBytes)} stored`} />
      </div>
      <section className="mt-10">
        <h2 className="mb-3 flex items-baseline justify-between text-sm font-semibold">
          Recent admin changes
          <a className="font-normal text-muted-foreground hover:text-foreground" {...linkProps('/admin/log')}>
            Full log
          </a>
        </h2>
        <Events events={data.events} />
      </section>
    </>
  );
}

function Stat({ label, value, note, href }: { label: string; value: number; note: string; href?: string }) {
  const body = (
    <>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value.toLocaleString()}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{note}</div>
    </>
  );
  const cls = 'block rounded-lg border bg-card p-4';
  return href ? (
    <a className={cn(cls, 'transition-colors hover:border-primary/50')} {...linkProps(href)}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

// ---------- users ----------

/** A search box that reports what was typed after a short pause. */
function useSearch(): [string, React.ReactNode] {
  const [text, setText] = useState('');
  const [q, setQ] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQ(text.trim()), 250);
    return () => clearTimeout(t);
  }, [text]);
  const box = (
    <label className="relative block w-full max-w-sm">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search…" className="pl-8" aria-label="Search" />
    </label>
  );
  return [q, box];
}

function Users() {
  const [q, search] = useSearch();
  const [data, setData] = useState<{ users: AdminUser[]; limit: number } | null>(null);
  useEffect(() => {
    api.admin.users(q).then(setData, (e: Error) => toast.error(e.message));
  }, [q]);
  return (
    <>
      <div className="mb-4">{search}</div>
      {!data ? (
        <Loading />
      ) : (
        <Table
          head={['User', 'Joined', 'Last sign-in', 'Workspaces', 'Diagrams']}
          empty="No users match."
          rows={data.users.map((u) => ({
            key: u.id,
            href: `/admin/users/${u.id}`,
            cells: [
              <UserCell key="u" user={u} />,
              ago(u.createdAt),
              u.lastLoginAt ? ago(u.lastLoginAt) : '—',
              u.workspaces,
              u.diagrams,
            ],
          }))}
          more={data.users.length >= data.limit ? `Showing the newest ${data.limit}. Search to find others.` : undefined}
        />
      )}
    </>
  );
}

function UserCell({ user }: { user: AdminUser }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="truncate font-medium">{user.email}</span>
        {user.lifetimeSince && <LifetimeBadge />}
        {user.platformAdmin && <Badge variant="outline">Admin</Badge>}
      </div>
      {user.name && <div className="truncate text-xs text-muted-foreground">{user.name}</div>}
    </div>
  );
}

const LifetimeBadge = () => (
  <Badge variant="secondary" className="bg-primary/10 text-primary">
    <InfinityIcon />
    Lifetime
  </Badge>
);

function UserDetail({ id }: { id: string }) {
  const session = useSession();
  const [creating, setCreating] = useState(false);
  const [data, setData] = useState<AdminUserDetail | null>(null);
  const [confirm, setConfirm] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api.admin.user(id).then(setData, (e: Error) => toast.error(e.message));
  }, [id]);
  if (!data) return <Loading />;
  const u = data.user;
  const setLifetime = async (on: boolean) => {
    setBusy(true);
    try {
      setData(await api.admin.updateUser(u.id, { lifetime: on }));
      // Changing your own access shows in the rest of the app straight away.
      if (u.id === session.user.id) await session.reload();
      toast.success(on ? `${u.email} has lifetime access` : `Took back ${u.email}'s lifetime access`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };
  return (
    <>
      <Back href="/admin/users" label="Users" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
            <span className="truncate">{u.email}</span>
            {u.lifetimeSince && <LifetimeBadge />}
            {u.platformAdmin && <Badge variant="outline">Admin</Badge>}
          </h2>
          {u.name && <p className="text-muted-foreground">{u.name}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setCreating(true)}>
            <Plus />
            Create workspace…
          </Button>
          <Button variant={u.lifetimeSince ? 'outline' : 'default'} disabled={busy} onClick={() => setConfirm(!u.lifetimeSince)}>
            {busy && <Loader2 className="animate-spin" />}
            {u.lifetimeSince ? 'Take back lifetime access' : 'Grant lifetime access'}
          </Button>
        </div>
      </div>
      <CreateWorkspaceFor user={u} open={creating} onClose={() => setCreating(false)} />
      <Facts
        items={[
          ['Joined', new Date(u.createdAt).toLocaleString()],
          ['Last sign-in', u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'],
          ['Lifetime access', u.lifetimeSince ? `Since ${new Date(u.lifetimeSince).toLocaleDateString()}` : 'No (free plan)'],
          ['Diagrams created', String(u.diagrams)],
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-sm font-semibold">Workspaces · {data.workspaces.length}</h3>
        <Table
          head={['Workspace', 'Role', 'Members', 'Diagrams']}
          empty="Not in any workspace."
          rows={data.workspaces.map((w) => ({
            key: w.id,
            href: `/admin/workspaces/${w.id}`,
            cells: [<WorkspaceCell key="w" workspace={w} />, w.role ? ROLE_NAMES[w.role] : '', w.members, w.diagrams],
          }))}
        />
      </section>
      {data.purchases.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-3 text-sm font-semibold">Purchases · {data.purchases.length}</h3>
          <Table
            head={['Started', 'Status', 'Amount', 'Seat']}
            rows={data.purchases.map((p) => ({
              key: p.id,
              cells: [
                new Date(p.createdAt).toLocaleString(),
                p.status === 'paid' && p.paidAt
                  ? `Paid ${new Date(p.paidAt).toLocaleDateString()}`
                  : p.status === 'refunded' && p.refundedAt
                    ? `Refunded ${new Date(p.refundedAt).toLocaleDateString()}`
                    : p.status === 'pending'
                      ? 'In checkout'
                      : 'Expired',
                p.amount != null && p.currency ? formatPrice({ amount: p.amount, currency: p.currency }) : '—',
                p.seat ? `#${p.seat}` : '—',
              ],
            }))}
          />
          <p className="mt-2 text-xs text-muted-foreground">Refunds are made in the Stripe dashboard; access is taken back when Stripe reports it.</p>
        </section>
      )}
      <Confirm
        open={confirm !== null}
        title={confirm ? 'Grant lifetime access?' : 'Take back lifetime access?'}
        body={
          confirm
            ? `${u.email} gets unlimited diagrams and can own team workspaces. This is recorded in the admin log.`
            : `${u.email} goes back to the free plan. Teams they own without another lifetime owner turn read-only (nothing is deleted). This is recorded in the admin log.`
        }
        action={confirm ? 'Grant' : 'Take back'}
        onCancel={() => setConfirm(null)}
        onConfirm={() => setLifetime(!!confirm)}
      />
    </>
  );
}

// ---------- workspaces ----------

function Workspaces() {
  const [q, search] = useSearch();
  const [kind, setKind] = useState<'' | 'team' | 'personal'>('team');
  const [data, setData] = useState<{ workspaces: AdminWorkspace[]; limit: number } | null>(null);
  useEffect(() => {
    api.admin.workspaces(q, kind).then(setData, (e: Error) => toast.error(e.message));
  }, [q, kind]);
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {search}
        <div role="radiogroup" aria-label="Kind" className="inline-flex h-9 items-center rounded-md border bg-muted/50 p-0.5 text-sm">
          {(
            [
              ['team', 'Teams'],
              ['personal', 'Personal'],
              ['', 'All'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={kind === k}
              onClick={() => setKind(k)}
              className={cn(
                'inline-flex h-full items-center rounded-[5px] px-3 text-muted-foreground transition-colors',
                kind === k ? 'bg-background text-foreground shadow-xs' : 'hover:text-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {!data ? (
        <Loading />
      ) : (
        <Table
          head={['Workspace', 'Owner', 'Members', 'Diagrams', 'Created']}
          empty="No workspaces match."
          rows={data.workspaces.map((w) => ({
            key: w.id,
            href: `/admin/workspaces/${w.id}`,
            cells: [<WorkspaceCell key="w" workspace={w} />, w.owner || '—', w.members, w.diagrams, ago(w.createdAt)],
          }))}
          more={data.workspaces.length >= data.limit ? `Showing the newest ${data.limit}. Search to find others.` : undefined}
        />
      )}
    </>
  );
}

function WorkspaceCell({ workspace: w }: { workspace: AdminWorkspace }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="truncate font-medium">{w.personal ? 'Personal' : w.name}</span>
        {w.plan && <PlanBadge plan={w.plan} />}
        {w.grandfathered && <Badge variant="outline">Grandfathered</Badge>}
      </div>
      <div className="truncate text-xs text-muted-foreground">/{w.slug}</div>
    </div>
  );
}

type WorkspaceData = { workspace: AdminWorkspace; members: Member[]; invites: Invite[]; plan: Plan };

function WorkspaceDetail({ id }: { id: string }) {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [confirm, setConfirm] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api.admin.workspace(id).then(setData, (e: Error) => toast.error(e.message));
  }, [id]);
  if (!data) return <Loading />;
  const { workspace: w, plan: p } = data;
  const setGrandfathered = async (on: boolean) => {
    setBusy(true);
    try {
      setData(await api.admin.updateWorkspace(w.id, { grandfathered: on }));
      toast.success(on ? `${w.name} is grandfathered` : `${w.name} is on the lifetime plan rules`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };
  const planName = w.personal
    ? p.lifetime
      ? 'Lifetime'
      : 'Free'
    : p.plan
      ? `${PLAN_NAMES[p.plan]}${p.planSource === 'comp' ? ' (given by an admin, no payment)' : ''}`
      : p.grandfathered
        ? 'Grandfathered team'
        : p.lifetime
          ? 'Lifetime team'
          : 'Read-only team (no lifetime owner)';
  return (
    <>
      <Back href="/admin/workspaces" label="Workspaces" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
            {w.personal ? `Personal · ${w.owner}` : w.name}
            {p.plan && <PlanBadge plan={p.plan} />}
            {w.grandfathered && <Badge variant="outline">Grandfathered</Badge>}
            {!p.editable && <Badge variant="destructive">Read-only</Badge>}
          </h2>
          <p className="text-muted-foreground">/{w.slug}</p>
        </div>
        {!w.personal && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setPlanning(true)}>Set plan…</Button>
            <Button variant="outline" disabled={busy} onClick={() => setConfirm(!w.grandfathered)}>
              {busy && <Loader2 className="animate-spin" />}
              {w.grandfathered ? 'Remove grandfathering' : 'Grandfather this team'}
            </Button>
          </div>
        )}
      </div>
      <Facts
        items={[
          ['Plan', planName],
          ['Diagrams', p.diagramLimit ? `${p.diagrams} of ${p.diagramLimit}` : String(p.diagrams)],
          ...(w.personal
            ? []
            : ([
                p.peopleLimit
                  ? ['People', `${p.people} of ${p.peopleLimit}, open invites included`]
                  : ['Editor seats', p.editorLimit ? `${p.editors} of ${p.editorLimit} used` : `${p.editors} (no limit)`],
              ] as [string, string][])),
          ['Created', new Date(w.createdAt).toLocaleString()],
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-sm font-semibold">Members · {data.members.length}</h3>
        <Table
          head={['Member', 'Role', 'Joined']}
          empty="No members."
          rows={data.members.map((m) => ({
            key: m.userId,
            href: `/admin/users/${m.userId}`,
            cells: [
              <div key="m" className="min-w-0">
                <div className="truncate font-medium">{m.email}</div>
                {m.name && <div className="truncate text-xs text-muted-foreground">{m.name}</div>}
              </div>,
              ROLE_NAMES[m.role],
              ago(m.joinedAt),
            ],
          }))}
        />
      </section>
      {data.invites.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-3 text-sm font-semibold">Pending invites · {data.invites.length}</h3>
          <Table
            head={['Email', 'Role', 'Expires']}
            rows={data.invites.map((i) => ({ key: i.id, cells: [i.email, ROLE_NAMES[i.role], new Date(i.expiresAt).toLocaleDateString()] }))}
          />
        </section>
      )}
      {!w.personal && (
        <section className="mt-10 rounded-lg border border-destructive/40 p-4">
          <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Permanently delete this workspace, its diagrams, members, invites, image list and API tokens.</p>
            <Button variant="destructive" onClick={() => setDeleting(true)}>
              <Trash2 />
              Delete workspace…
            </Button>
          </div>
        </section>
      )}
      <SetPlan open={planning} data={data} onClose={() => setPlanning(false)} onChanged={setData} />
      <DeleteWorkspace
        open={deleting}
        data={data}
        onClose={() => setDeleting(false)}
        onDeleted={() => navigate('/admin/workspaces', { replace: true })}
      />
      <Confirm
        open={confirm !== null}
        title={confirm ? 'Grandfather this team?' : 'Remove grandfathering?'}
        body={
          confirm
            ? `${w.name} becomes free and editable with no editor seat limit, whatever its owners' plans. This is recorded in the admin log.`
            : `${w.name} follows the lifetime rules again: editable only while an owner has lifetime access, with ${p.editorLimit || 5} editor seats. Nobody is removed. This is recorded in the admin log.`
        }
        action={confirm ? 'Grandfather' : 'Remove'}
        onCancel={() => setConfirm(null)}
        onConfirm={() => setGrandfathered(!!confirm)}
      />
    </>
  );
}

/**
 * Deleting a team for good: says exactly what goes, and only enables the
 * button once the workspace's address is typed and the warning is ticked.
 * The API checks the typed address too.
 */
function DeleteWorkspace({ open, data, onClose, onDeleted }: { open: boolean; data: WorkspaceData; onClose: () => void; onDeleted: () => void }) {
  const { workspace: w, plan: p } = data;
  const [typed, setTyped] = useState('');
  const [sure, setSure] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (open) {
      setTyped('');
      setSure(false);
    }
  }, [open]);
  const ready = typed === w.slug && sure;
  const run = async () => {
    setBusy(true);
    try {
      const { deleted: d } = await api.admin.deleteWorkspace(w.id, typed);
      toast.success(`Deleted ${w.name}: ${d.diagrams} diagram${d.diagrams === 1 ? '' : 's'}, ${d.members} member${d.members === 1 ? '' : 's'}`);
      onClose();
      onDeleted();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {w.name}?</DialogTitle>
          <DialogDescription>This can't be undone. Everyone in it loses access, and its content is gone for good.</DialogDescription>
        </DialogHeader>
        <ul className="list-disc space-y-1 rounded-md border border-destructive/30 bg-destructive/5 py-3 pr-3 pl-8 text-sm">
          <li>
            {p.diagrams} diagram{p.diagrams === 1 ? '' : 's'}, with their docs and detail diagrams
          </li>
          <li>
            {data.members.length} member{data.members.length === 1 ? '' : 's'}: {data.members.map((m) => m.email).join(', ')}
          </li>
          {data.invites.length > 0 && (
            <li>
              {data.invites.length} pending invite{data.invites.length === 1 ? '' : 's'}
            </li>
          )}
          <li>Its image list and API tokens (image links used elsewhere keep working)</li>
        </ul>
        <label className="flex flex-col gap-1.5 text-sm">
          <span>
            Type <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{w.slug}</code> to confirm
          </span>
          <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} aria-label="Workspace address" />
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} className="mt-0.5 size-4 accent-destructive" />
          I understand this deletes the workspace and its diagrams permanently.
        </label>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={run} disabled={!ready || busy}>
            {busy && <Loader2 className="animate-spin" />}
            Delete workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const PLAN_NAMES: Record<WorkspacePlan, string> = { pro: 'Pro', team: 'Team', business: 'Business' };
const PLAN_HINTS: Record<WorkspacePlan, string> = {
  pro: 'Up to 4 people, unlimited diagrams',
  team: 'Unlimited people and diagrams',
  business: 'Team, plus SSO and audit features as they ship',
};

const PlanBadge = ({ plan }: { plan: WorkspacePlan }) => <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{PLAN_NAMES[plan]}</Badge>;

/** Pro, Team or Business as radio cards. */
function PlanChoice({ value, onChange }: { value: WorkspacePlan; onChange: (p: WorkspacePlan) => void }) {
  return (
    <div role="radiogroup" aria-label="Plan" className="grid gap-2">
      {(Object.keys(PLAN_NAMES) as WorkspacePlan[]).map((p) => (
        <button
          key={p}
          type="button"
          role="radio"
          aria-checked={value === p}
          onClick={() => onChange(p)}
          className={cn('rounded-md border px-3 py-2 text-left text-sm transition-colors', value === p ? 'border-primary bg-primary/5' : 'hover:bg-accent')}
        >
          <span className="font-medium">{PLAN_NAMES[p]}</span>
          <span className="ml-2 text-muted-foreground">{PLAN_HINTS[p]}</span>
        </button>
      ))}
    </div>
  );
}

/** A team workspace for a user, on a plan given without payment: for selling by hand and demos. */
function CreateWorkspaceFor({ user, open, onClose }: { user: AdminUser; open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<WorkspacePlan>('pro');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (open) {
      setName('');
      setPlan('pro');
      setNote('');
    }
  }, [open]);
  const run = async () => {
    setBusy(true);
    try {
      const w = await api.admin.createWorkspace({ name: name.trim(), ownerId: user.id, plan, note });
      toast.success(`Created ${w.name} for ${user.email} on ${PLAN_NAMES[plan]}`);
      onClose();
      navigate(`/admin/workspaces/${w.id}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a workspace for {user.email}</DialogTitle>
          <DialogDescription>They own it, on the plan you choose, with no payment. Use it to sell by hand or for a demo.</DialogDescription>
        </DialogHeader>
        <form
          id="create-for"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) void run();
          }}
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Workspace name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme" maxLength={80} autoFocus />
          </label>
          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Plan</span>
            <PlanChoice value={plan} onChange={setPlan} />
          </div>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Note for the admin log</span>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Demo for Acme, invoiced by hand" maxLength={200} />
          </label>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="create-for" disabled={busy || !name.trim()}>
            {busy && <Loader2 className="animate-spin" />}
            Create workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Give a team its own plan without payment, change it, or take it away. */
function SetPlan({ open, data, onClose, onChanged }: { open: boolean; data: WorkspaceData; onClose: () => void; onChanged: (d: WorkspaceData) => void }) {
  const { workspace: w, plan: p } = data;
  const [plan, setPlan] = useState<WorkspacePlan>('pro');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (open) {
      setPlan(p.plan || 'pro');
      setNote('');
    }
  }, [open, p.plan]);
  const run = async (next: '' | WorkspacePlan) => {
    setBusy(true);
    try {
      onChanged(await api.admin.updateWorkspace(w.id, { plan: next, note }));
      toast.success(next ? `${w.name} is on ${PLAN_NAMES[next]}` : `${w.name} has no plan of its own now`);
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Plan for {w.name}</DialogTitle>
          <DialogDescription>Given without payment. Nobody is removed if the new plan's limits are lower; they just can't add more.</DialogDescription>
        </DialogHeader>
        <PlanChoice value={plan} onChange={setPlan} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Note for the admin log</span>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Signed a yearly contract" maxLength={200} />
        </label>
        <DialogFooter className="sm:justify-between">
          {p.plan ? (
            <Button variant="ghost" className="text-destructive" disabled={busy} onClick={() => run('')}>
              Remove plan
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={busy || plan === p.plan} onClick={() => run(plan)}>
              {busy && <Loader2 className="animate-spin" />}
              Set {PLAN_NAMES[plan]}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- log ----------

function Log() {
  const [events, setEvents] = useState<AdminEvent[] | null>(null);
  useEffect(() => {
    api.admin.events().then((r) => setEvents(r.events), (e: Error) => toast.error(e.message));
  }, []);
  return events ? <Events events={events} /> : <Loading />;
}

const ACTIONS: Record<string, string> = {
  'lifetime.grant': 'Granted lifetime access to',
  'lifetime.revoke': 'Took back lifetime access from',
  'team.grandfather': 'Grandfathered',
  'team.ungrandfather': 'Removed grandfathering from',
  'purchase.paid': 'Lifetime bought by',
  'purchase.refunded': 'Lifetime refunded for',
  'team.delete': 'Deleted the workspace',
  'team.create': 'Created the workspace',
  'team.plan': 'Set the plan of',
};

function Events({ events }: { events: AdminEvent[] }) {
  return (
    <Table
      head={['When', 'Admin', 'Change']}
      empty="No admin changes yet."
      rows={events.map((e) => ({
        key: e.id,
        cells: [
          <span key="t" title={new Date(e.createdAt).toLocaleString()}>
            {ago(e.createdAt)}
          </span>,
          e.admin || 'Stripe',
          `${ACTIONS[e.action] ?? e.action} ${e.target}${e.detail ? ` (${e.detail})` : ''}`,
        ],
      }))}
    />
  );
}

// ---------- pieces ----------

function Table({
  head,
  rows,
  empty = 'Nothing here.',
  more,
}: {
  head: string[];
  rows: { key: string; href?: string; cells: React.ReactNode[] }[];
  empty?: string;
  more?: string;
}) {
  if (!rows.length) return <p className="rounded-lg border bg-card px-4 py-6 text-center text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            {head.map((h) => (
              <th key={h} className="px-4 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r) => (
            <tr
              key={r.key}
              className={cn(r.href && 'cursor-pointer hover:bg-accent/50')}
              onClick={r.href ? () => navigate(r.href!) : undefined}
            >
              {r.cells.map((c, i) => (
                <td key={i} className={cn('px-4 py-2.5', i === 0 ? 'max-w-80' : 'whitespace-nowrap text-muted-foreground')}>
                  {i === 0 && r.href ? (
                    // A real link too, for keyboards and opening in a new tab.
                    <a {...linkProps(r.href)} onClick={(e) => e.stopPropagation()} className="block min-w-0 outline-none focus-visible:underline">
                      {c}
                    </a>
                  ) : (
                    c
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {more && <p className="border-t px-4 py-2 text-xs text-muted-foreground">{more}</p>}
    </div>
  );
}

function Facts({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 rounded-lg border bg-card p-4 text-sm sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-muted-foreground">{k}</dt>
          <dd className="mt-0.5">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Back({ href, label }: { href: string; label: string }) {
  return (
    <a className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground" {...linkProps(href)}>
      <ArrowLeft className="size-4" />
      {label}
    </a>
  );
}

function Confirm({
  open,
  title,
  body,
  action,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: string;
  action: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function bytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(0)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}

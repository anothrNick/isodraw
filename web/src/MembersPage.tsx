import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Check, Copy, Link2, Loader2, LogOut, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { api, type Invite, type Member, type Org, type Role } from './api';
import { initials, Loading } from './App';
import { linkProps, navigate } from './router';
import { ROLE_HINTS, ROLE_NAMES, useSession } from './session';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ROLES: Role[] = ['owner', 'admin', 'editor', 'viewer'];

/** A team's members and invites. Everyone sees the members; owners and admins manage them. */
export function MembersPage({ org }: { org: Org }) {
  const session = useSession();
  const me = session.user.id;
  const manage = org.role === 'owner' || org.role === 'admin';
  const [data, setData] = useState<{ members: Member[]; invites: Invite[] } | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; body: string; action: string; run: () => Promise<void> } | null>(null);

  const load = useCallback(() => api.members(org.id).then(setData), [org.id]);
  useEffect(() => {
    load().catch((e: Error) => toast.error(e.message));
  }, [load]);

  const act = async (run: () => Promise<unknown>, done?: string) => {
    try {
      await run();
      await load();
      if (done) toast.success(done);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (org.personal) {
    return (
      <div className="mx-auto mt-20 max-w-md px-6 text-center">
        <h1 className="text-xl font-semibold">Your personal workspace</h1>
        <p className="mt-2 text-muted-foreground">It's just for you. To work on diagrams with other people, create a team from the workspace menu at the top.</p>
      </div>
    );
  }
  if (!data) return <Loading />;

  // Owners can change anyone; admins everyone below owner. Nobody changes their own role here.
  const canChange = (m: Member) => manage && m.userId !== me && (org.role === 'owner' || m.role !== 'owner');
  const assignable = ROLES.filter((r) => org.role === 'owner' || r !== 'owner');

  return (
    <div className="overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <a className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground" {...linkProps(`/${org.slug}`)}>
          <ArrowLeft className="size-4" />
          Diagrams
        </a>
        <TeamName org={org} editable={manage} onRenamed={() => session.reload()} />

        {manage && <InviteForm org={org} roles={assignable} onInvited={load} />}

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold">Members · {data.members.length}</h2>
          <ul className="divide-y rounded-lg border bg-card">
            {data.members.map((m) => (
              <li key={m.userId} className="flex items-center gap-3 px-4 py-3">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials(m)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {m.name || m.email}
                    {m.userId === me && <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>}
                  </div>
                  {m.name && <div className="truncate text-xs text-muted-foreground">{m.email}</div>}
                </div>
                {canChange(m) ? (
                  <RoleSelect
                    value={m.role}
                    roles={assignable}
                    label={`Role for ${m.email}`}
                    onChange={(role) => act(() => api.changeRole(org.id, m.userId, role), `${m.name || m.email} is now ${ROLE_NAMES[role].toLowerCase()}`)}
                  />
                ) : (
                  <Badge variant="secondary">{ROLE_NAMES[m.role]}</Badge>
                )}
                {canChange(m) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground"
                    aria-label={`Remove ${m.email}`}
                    onClick={() =>
                      setConfirm({
                        title: `Remove ${m.name || m.email}?`,
                        body: `They lose access to ${org.name} and its diagrams. You can invite them again later.`,
                        action: 'Remove',
                        run: () => act(() => api.removeMember(org.id, m.userId), 'Removed'),
                      })
                    }
                  >
                    <X />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>

        {manage && data.invites.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold">Pending invites · {data.invites.length}</h2>
            <ul className="divide-y rounded-lg border bg-card">
              {data.invites.map((i) => {
                const expired = new Date(i.expiresAt).getTime() < Date.now();
                return (
                  <li key={i.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{i.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {ROLE_NAMES[i.role]} · {expired ? 'expired' : `expires ${new Date(i.expiresAt).toLocaleDateString()}`}
                      </div>
                    </div>
                    {/* The link isn't stored, so "copy" makes a fresh one, which replaces the old. */}
                    <CopyInviteLink org={org} invite={i} onInvited={load} label={expired ? 'Resend' : 'New link'} />
                    <Button variant="ghost" size="sm" onClick={() => act(() => api.revokeInvite(org.id, i.id), 'Invite revoked')}>
                      Revoke
                    </Button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-10 border-t pt-6">
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() =>
              setConfirm({
                title: `Leave ${org.name}?`,
                body: 'You lose access to its diagrams until someone invites you again.',
                action: 'Leave team',
                run: async () => {
                  try {
                    await api.removeMember(org.id, me);
                    await session.reload();
                    navigate('/');
                    toast.success(`You left ${org.name}`);
                  } catch (e) {
                    toast.error((e as Error).message);
                  }
                },
              })
            }
          >
            <LogOut />
            Leave team
          </Button>
        </div>
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirm?.body}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => confirm && void confirm.run()}>
              {confirm?.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TeamName({ org, editable, onRenamed }: { org: Org; editable: boolean; onRenamed: () => void }) {
  const [name, setName] = useState(org.name);
  useEffect(() => setName(org.name), [org.name]);
  if (!editable) return <h1 className="text-2xl font-semibold tracking-tight">{org.name}</h1>;
  const save = async () => {
    const n = name.trim();
    if (!n || n === org.name) return setName(org.name);
    try {
      await api.renameOrg(org.id, n);
      onRenamed();
    } catch (e) {
      setName(org.name);
      toast.error((e as Error).message);
    }
  };
  return (
    <Input
      value={name}
      aria-label="Team name"
      onChange={(e) => setName(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      className="h-auto border-transparent bg-transparent px-1.5 py-1 text-2xl font-semibold tracking-tight shadow-none hover:border-input focus-visible:bg-card md:text-2xl dark:bg-transparent"
    />
  );
}

function RoleSelect({ value, roles, label, onChange }: { value: Role; roles: Role[]; label: string; onChange: (r: Role) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Role)}>
      <SelectTrigger size="sm" className="w-28" aria-label={label}>
        {/* Just the name in the button; the menu also explains each role. */}
        <SelectValue>{ROLE_NAMES[value]}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {roles.map((r) => (
          <SelectItem key={r} value={r}>
            <div className="flex flex-col">
              <span>{ROLE_NAMES[r]}</span>
              <span className="text-xs text-muted-foreground">{ROLE_HINTS[r]}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function InviteForm({ org, roles, onInvited }: { org: Org; roles: Role[]; onInvited: () => Promise<unknown> }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('editor');
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<{ email: string; url: string } | null>(null);

  const send = async () => {
    setBusy(true);
    try {
      const r = await api.invite(org.id, email, role);
      setLink({ email: r.invite.email, url: r.url });
      setEmail('');
      await onInvited();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-lg border bg-card p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <UserPlus className="size-4" />
        Invite people
      </h2>
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" aria-label="Email address" className="min-w-56 flex-1" />
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger className="w-32" aria-label="Role for the invite">
            <SelectValue>{ROLE_NAMES[role]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                <div className="flex flex-col">
                  <span>{ROLE_NAMES[r]}</span>
                  <span className="text-xs text-muted-foreground">{ROLE_HINTS[r]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={busy || !email.trim()}>
          {busy && <Loader2 className="animate-spin" />}
          Invite
        </Button>
      </form>
      {link && <LinkBox email={link.email} url={link.url} />}
    </section>
  );
}

/** The link to send. Email isn't sent yet, so the inviter copies it into a message. */
function LinkBox({ email, url }: { email: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="mt-3 rounded-md border border-dashed bg-muted/50 p-3">
      <p className="text-sm">
        Send this link to <span className="font-medium">{email}</span>. It works for 7 days, once, and only when they sign in with that address.
      </p>
      <div className="mt-2 flex gap-2">
        <Input readOnly value={url} aria-label="Invite link" className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
        <Button variant="outline" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}

function CopyInviteLink({ org, invite, onInvited, label }: { org: Org; invite: Invite; onInvited: () => Promise<unknown>; label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const make = async () => {
    try {
      const r = await api.invite(org.id, invite.email, invite.role);
      await navigator.clipboard.writeText(r.url).catch(() => undefined);
      setUrl(r.url);
      toast.success(`New link for ${invite.email} copied. The old link no longer works.`);
      await onInvited();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  return (
    <Button variant="ghost" size="sm" onClick={make} title={url ?? undefined}>
      <Link2 />
      {label}
    </Button>
  );
}

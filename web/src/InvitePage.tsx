import { useEffect, useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError, api, type InviteDetails } from './api';
import { Loading, Message } from './App';
import { navigate } from './router';
import { ROLE_HINTS, ROLE_NAMES, useSession } from './session';
import { Button } from '@/components/ui/button';

/** Where an invite link lands: say what it is, and join on Accept. */
export function InvitePage({ token }: { token: string }) {
  const session = useSession();
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .getInvite(token)
      .then(setInvite)
      .catch((e: Error) => setError(e.message));
  }, [token]);

  if (error) return <Message title="Invite not found" body={error} />;
  if (!invite) return <Loading />;

  const member = session.orgs.find((o) => o.id === invite.orgId);
  const wrongEmail = invite.email.toLowerCase() !== session.user.email.toLowerCase();

  const accept = async () => {
    setBusy(true);
    try {
      const org = await api.acceptInvite(token);
      await session.reload();
      toast.success(`You joined ${org.name}`);
      navigate(`/${org.slug}`, { replace: true });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : String(e));
      setBusy(false);
    }
  };
  const switchAccount = async () => {
    await api.signOut().catch(() => undefined);
    window.location.assign(`/auth/login?return=${encodeURIComponent(location.pathname)}`);
  };

  return (
    <div className="mx-auto mt-20 w-full max-w-md px-6">
      <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Users className="size-6" />
        </div>
        <h1 className="text-lg font-semibold">Join {invite.orgName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {invite.invitedBy ? `${invite.invitedBy} invited you` : 'You were invited'} as {ROLE_NAMES[invite.role].toLowerCase()}:{' '}
          {ROLE_HINTS[invite.role].toLowerCase()}.
        </p>

        {invite.accepted ? (
          <Outcome text="This invite has already been used." action={member ? ['Open the team', `/${member.slug}`] : undefined} />
        ) : invite.expired ? (
          <Outcome text="This invite has expired. Ask whoever sent it for a new one." />
        ) : wrongEmail ? (
          <div className="mt-5 rounded-md border border-warning/40 bg-warning/10 p-3 text-left text-sm">
            This invite is for <span className="font-medium">{invite.email}</span>, but you're signed in as{' '}
            <span className="font-medium">{session.user.email}</span>.
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={switchAccount}>
              Sign in as {invite.email}
            </Button>
          </div>
        ) : (
          <Button className="mt-6 w-full" onClick={accept} disabled={busy}>
            {busy && <Loader2 className="animate-spin" />}
            Accept and join
          </Button>
        )}
      </div>
    </div>
  );
}

function Outcome({ text, action }: { text: string; action?: [string, string] }) {
  return (
    <div className="mt-5 text-sm">
      <p className="text-muted-foreground">{text}</p>
      {action && (
        <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate(action[1])}>
          {action[0]}
        </Button>
      )}
    </div>
  );
}

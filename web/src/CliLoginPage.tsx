import { useState } from 'react';
import { Loader2, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { api, type Scope } from './api';
import { Message } from './App';
import { useSession } from './session';
import { AccessChoices } from './AccessChoices';
import { canWrite } from './TokensPage';
import { Button } from '@/components/ui/button';

/**
 * The page `isodraw login` opens. The CLI waits on a local port; authorizing
 * creates a token and sends the browser back to the CLI with it.
 */
export function CliLoginPage() {
  const session = useSession();
  const q = new URLSearchParams(location.search);
  const port = Number(q.get('port'));
  const state = q.get('state') ?? '';
  const machine = (q.get('name') ?? '').slice(0, 60) || 'this computer';
  const [orgId, setOrgId] = useState(session.orgs[0]?.id ?? '');
  const [scope, setScope] = useState<Scope>('write');
  const [days, setDays] = useState(90);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const org = session.orgs.find((o) => o.id === orgId);

  // The CLI only ever listens on a local port; anything else isn't a real login.
  if (!Number.isInteger(port) || port < 1024 || port > 65535 || !/^[A-Za-z0-9_-]{8,128}$/.test(state)) {
    return <Message title="This sign-in link isn't valid" body="Run isodraw login again in your terminal." />;
  }
  if (done) {
    return <Message title="The CLI is signed in" body="You can close this tab and go back to your terminal." />;
  }

  const authorize = async () => {
    setBusy(true);
    try {
      const effective = canWrite(org) ? scope : 'read';
      const r = await api.createToken(`CLI on ${machine}`, orgId, effective, days);
      setDone(true);
      const back = new URL(`http://127.0.0.1:${port}/callback`);
      back.searchParams.set('state', state);
      back.searchParams.set('token', r.secret);
      window.location.assign(back.toString());
    } catch (e) {
      toast.error((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-md px-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Terminal className="size-6" />
        </div>
        <h1 className="text-center text-lg font-semibold">Sign in the IsoDraw CLI</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{machine}</span> is asking to work with your diagrams as{' '}
          <span className="font-medium text-foreground">{session.user.email}</span>. AI agents using the CLI there will have this access too.
        </p>

        <AccessChoices orgId={orgId} onOrg={setOrgId} scope={scope} onScope={setScope} days={days} onDays={setDays} />

        <Button className="mt-6 w-full" onClick={authorize} disabled={busy || !orgId}>
          {busy && <Loader2 className="animate-spin" />}
          Authorize
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">You can revoke it any time under API tokens in your account menu.</p>
      </div>
    </div>
  );
}

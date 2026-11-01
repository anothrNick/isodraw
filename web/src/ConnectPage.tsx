import { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api, type Scope } from './api';
import { AccessChoices } from './AccessChoices';
import { Loading, Message } from './App';
import { useSession } from './session';
import { canWrite } from './TokensPage';
import { Button } from '@/components/ui/button';

/**
 * Where an AI app (Claude, ChatGPT, Cursor) sends someone to connect IsoDraw's
 * MCP server: /oauth/authorize lands here. Approving makes a token for the
 * workspace and access chosen, and goes back to the app with a one-time code.
 */
export function ConnectPage() {
  const session = useSession();
  const q = new URLSearchParams(location.search);
  const clientId = q.get('client_id') ?? '';
  const redirectUri = q.get('redirect_uri') ?? '';
  const codeChallenge = q.get('code_challenge') ?? '';
  const state = q.get('state') ?? '';
  const [app, setApp] = useState<{ clientName: string; redirectHost: string; redirectScheme: string } | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [orgId, setOrgId] = useState(session.orgs[0]?.id ?? '');
  const [scope, setScope] = useState<Scope>('write');
  const [days, setDays] = useState(90);
  const [busy, setBusy] = useState<'approve' | 'deny' | null>(null);
  const org = session.orgs.find((o) => o.id === orgId);

  useEffect(() => {
    if (!clientId || !redirectUri || !codeChallenge) return setFailed('The link is missing details.');
    api.oauthRequest(clientId, redirectUri).then(setApp, (e: Error) => setFailed(e.message));
  }, [clientId, redirectUri, codeChallenge]);

  if (failed) return <Message title="This connection link isn't valid" body={`${failed} Start connecting again from the app.`} />;
  if (!app) return <Loading label="Checking the app…" />;

  const answer = async (approve: boolean) => {
    setBusy(approve ? 'approve' : 'deny');
    try {
      const r = approve
        ? await api.oauthApprove({ clientId, redirectUri, codeChallenge, state, orgId, scope: canWrite(org) ? scope : 'read', expiresInDays: days })
        : await api.oauthDeny({ clientId, redirectUri, state });
      window.location.assign(r.redirect);
    } catch (e) {
      toast.error((e as Error).message);
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-md px-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-6" />
        </div>
        <h1 className="text-center text-lg font-semibold">Connect {app.clientName} to IsoDraw</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{app.clientName}</span> wants to work with your diagrams and docs as{' '}
          <span className="font-medium text-foreground">{session.user.email}</span>. It can do what you allow here, in one workspace.
        </p>

        <AccessChoices orgId={orgId} onOrg={setOrgId} scope={scope} onScope={setScope} days={days} onDays={setDays} />

        <div className="mt-6 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => answer(false)} disabled={!!busy}>
            {busy === 'deny' && <Loader2 className="animate-spin" />}
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => answer(true)} disabled={!!busy || !orgId}>
            {busy === 'approve' && <Loader2 className="animate-spin" />}
            Allow
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          You'll go back to {app.redirectScheme === 'https' ? app.redirectHost : `the ${app.clientName} app`}. Disconnect it any time by revoking its token under API tokens in your account menu.
        </p>
      </div>
    </div>
  );
}

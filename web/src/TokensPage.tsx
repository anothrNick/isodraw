import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, KeyRound, Loader2, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { api, type ApiToken, type Org, type Scope } from './api';
import { Loading } from './App';
import { useSession } from './session';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const EXPIRY_OPTIONS = [
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
  { days: 365, label: '1 year' },
  { days: 0, label: 'Never' },
];

export const SCOPE_NAMES: Record<Scope, string> = { write: 'Read and write', read: 'Read only' };

/** Where a token can work: workspaces the user can at least read. Viewers only get read-only tokens. */
export function canWrite(org: Org | undefined) {
  return !!org && org.role !== 'viewer';
}

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString() : '—');

/** API tokens for the CLI, AI agents and CI: list, create, revoke. */
export function TokensPage() {
  const session = useSession();
  const [tokens, setTokens] = useState<ApiToken[] | null>(null);
  const load = useCallback(() => api.tokens().then((r) => setTokens(r.tokens)), []);
  useEffect(() => {
    load().catch((e: Error) => toast.error(e.message));
  }, [load]);

  const revoke = async (t: ApiToken) => {
    try {
      await api.deleteToken(t.id);
      await load();
      toast.success(`Revoked “${t.name}”`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">API tokens</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tokens let the <code className="rounded bg-muted px-1 py-0.5 text-xs">isodraw</code> CLI, AI agents like Claude, and CI work with your diagrams. Each one acts as you, in one workspace. The easiest way to get one is{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">isodraw login</code>.
        </p>

        <NewToken orgs={session.orgs} onCreated={load} />

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold">Your tokens</h2>
          {!tokens ? (
            <Loading />
          ) : tokens.length === 0 ? (
            <p className="rounded-lg border border-dashed bg-card px-4 py-8 text-center text-sm text-muted-foreground">No tokens yet.</p>
          ) : (
            <ul className="divide-y rounded-lg border bg-card">
              {tokens.map((t) => {
                const expired = t.expiresAt && new Date(t.expiresAt).getTime() < Date.now();
                return (
                  <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <KeyRound className="size-4 flex-none text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.orgName} · created {when(t.createdAt)} · last used {when(t.lastUsedAt)} ·{' '}
                        {expired ? <span className="text-destructive">expired</span> : t.expiresAt ? `expires ${when(t.expiresAt)}` : 'never expires'}
                      </div>
                    </div>
                    <Badge variant={t.scope === 'write' ? 'default' : 'secondary'}>{SCOPE_NAMES[t.scope]}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => revoke(t)}>
                      Revoke
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function NewToken({ orgs, onCreated }: { orgs: Org[]; onCreated: () => Promise<unknown> }) {
  const [name, setName] = useState('');
  const [orgId, setOrgId] = useState(orgs[0]?.id ?? '');
  const [scope, setScope] = useState<Scope>('read');
  const [days, setDays] = useState(90);
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const org = orgs.find((o) => o.id === orgId);

  const create = async () => {
    setBusy(true);
    try {
      const r = await api.createToken(name, orgId, canWrite(org) ? scope : 'read', days);
      setSecret(r.secret);
      setName('');
      await onCreated();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-lg border bg-card p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Terminal className="size-4" />
        New token
      </h2>
      <form
        className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          void create();
        }}
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name, e.g. GitHub Actions" aria-label="Token name" required />
        <Select value={orgId} onValueChange={setOrgId}>
          <SelectTrigger className="w-36" aria-label="Workspace">
            <SelectValue>{org?.name}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {orgs.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={canWrite(org) ? scope : 'read'} onValueChange={(v) => setScope(v as Scope)} disabled={!canWrite(org)}>
          <SelectTrigger className="w-36" aria-label="Access">
            <SelectValue>{SCOPE_NAMES[canWrite(org) ? scope : 'read']}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="read">Read only</SelectItem>
            <SelectItem value="write">Read and write</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-28" aria-label="Expires">
            <SelectValue>{EXPIRY_OPTIONS.find((o) => o.days === days)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {EXPIRY_OPTIONS.map((o) => (
              <SelectItem key={o.days} value={String(o.days)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={busy || !name.trim()}>
          {busy && <Loader2 className="animate-spin" />}
          Create
        </Button>
      </form>
      {secret && (
        <div className="mt-3 rounded-md border border-dashed bg-muted/50 p-3">
          <p className="text-sm">
            Copy the token now; it won't be shown again. Use it as <code className="rounded bg-muted px-1 text-xs">ISODRAW_TOKEN</code>.
          </p>
          <div className="mt-2 flex gap-2">
            <Input readOnly value={secret} aria-label="New token" className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
            <Button
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(secret);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? <Check /> : <Copy />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

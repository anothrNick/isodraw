import type { Scope } from './api';
import { useSession } from './session';
import { EXPIRY_OPTIONS, SCOPE_NAMES, canWrite } from './TokensPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

/**
 * What a new token may do: the workspace, read or write, and when it expires.
 * The CLI's sign-in page and the AI-app connect page both ask this.
 */
export function AccessChoices({
  orgId,
  onOrg,
  scope,
  onScope,
  days,
  onDays,
}: {
  orgId: string;
  onOrg: (id: string) => void;
  scope: Scope;
  onScope: (s: Scope) => void;
  days: number;
  onDays: (d: number) => void;
}) {
  const session = useSession();
  const org = session.orgs.find((o) => o.id === orgId);
  return (
    <div className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Workspace</span>
        <Select value={orgId} onValueChange={onOrg}>
          <SelectTrigger className="w-full">
            <SelectValue>{org?.name}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {session.orgs.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium">Access</legend>
        {(['write', 'read'] as Scope[]).map((s) => {
          const disabled = s === 'write' && !canWrite(org);
          const checked = (canWrite(org) ? scope : 'read') === s;
          return (
            <label
              key={s}
              className={cn('flex cursor-pointer items-start gap-3 rounded-md border p-3', checked && 'border-primary bg-primary/5', disabled && 'cursor-not-allowed opacity-50')}
            >
              <input type="radio" name="scope" className="mt-1 accent-primary" checked={checked} disabled={disabled} onChange={() => onScope(s)} />
              <span>
                <span className="block text-sm font-medium">{SCOPE_NAMES[s]}</span>
                <span className="block text-xs text-muted-foreground">
                  {s === 'write' ? 'Create and change diagrams and their docs.' : 'List and read diagrams and docs, nothing else.'}
                  {disabled && ' You can only read in this workspace.'}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Expires</span>
        <Select value={String(days)} onValueChange={(v) => onDays(Number(v))}>
          <SelectTrigger className="w-full">
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
      </label>
    </div>
  );
}

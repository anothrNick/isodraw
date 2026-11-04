import { useContext, useEffect, useState } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, formatPrice, type Billing, type Org } from './api';
import { navigate } from './router';
import { SessionContext } from './session';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * New workspace: a name, then a plan. Every workspace besides your personal
 * one has a plan. Today only Pro can be chosen, bought once (founding
 * lifetime), and lifetime covers one workspace: with it unused, the workspace
 * is made straight away; without it, once checkout is paid (see PlanPage);
 * with it already on a workspace, there's nothing to choose yet.
 */

const PENDING = 'isodraw:new-workspace';

/** The workspace someone was creating when they went to checkout, made once lifetime access arrives. */
export async function createPendingWorkspace(): Promise<Org | null> {
  let name: string | null = null;
  try {
    name = sessionStorage.getItem(PENDING);
    sessionStorage.removeItem(PENDING);
  } catch {
    // No storage: nothing was saved.
  }
  return name ? api.createTeam(name) : null;
}

/** Checkout was abandoned: don't make the workspace if they buy later from the Plan page. */
export function forgetPendingWorkspace() {
  try {
    sessionStorage.removeItem(PENDING);
  } catch {
    // Nothing saved.
  }
}

type PlanId = 'pro' | 'team' | 'business';

export function NewWorkspaceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const session = useContext(SessionContext);
  const reload = session?.reload;
  const [step, setStep] = useState<'name' | 'plan'>('name');
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<PlanId>('pro');
  const [billing, setBilling] = useState<Billing | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep('name');
    setName('');
    setPlan('pro');
    // Lifetime access may have changed since the page loaded (a purchase, or an admin's grant).
    reload?.().catch(() => undefined);
    api.billing().then(setBilling, () => setBilling(null));
  }, [open, reload]);

  const lifetime = !!session?.lifetime || !!billing?.lifetime;
  // Lifetime covers one workspace; this is the one it's on, if it's been used.
  const used = billing ? billing.lifetimeWorkspace : (session?.lifetimeWorkspace ?? null);
  const unused = lifetime && !used;
  const canBuy = !lifetime && !!billing?.available && billing.seats.left > 0;

  const create = async () => {
    setBusy(true);
    try {
      if (unused) {
        const org = await api.createTeam(name.trim());
        await session?.reload();
        onOpenChange(false);
        navigate(`/${org.slug}/members`);
        toast.success(`Created ${org.name}. Invite people to work on diagrams together.`);
        return;
      }
      // Buy first; the workspace is made when the payment is confirmed.
      try {
        sessionStorage.setItem(PENDING, name.trim());
      } catch {
        // Without storage they'll create it again after paying.
      }
      const { url } = await api.checkout();
      window.location.assign(url);
    } catch (e) {
      toast.error((e as Error).message);
      setBusy(false);
    }
  };

  const plans: { id: PlanId; name: string; price: string; note: string; blurb: string; available: boolean }[] = [
    {
      id: 'pro',
      name: 'Pro',
      price: billing ? formatPrice(billing.price) : '$99',
      note: used ? `lifetime is on ${used.name}` : unused ? 'included with your lifetime access' : 'once · founding lifetime',
      blurb: 'Up to 4 people, unlimited diagrams.',
      available: unused || canBuy,
    },
    { id: 'team', name: 'Team', price: '$49', note: '/month · coming soon', blurb: 'Unlimited people, team features.', available: false },
    { id: 'business', name: 'Business', price: '$199', note: '/month · coming soon', blurb: 'SSO, audit log, priority support.', available: false },
  ];
  const chosen = plans.find((p) => p.id === plan)!;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {step === 'name' ? (
          <>
            <DialogHeader>
              <DialogTitle>New workspace</DialogTitle>
              <DialogDescription>A shared workspace: its diagrams belong to it, and you choose who can edit or just read them.</DialogDescription>
            </DialogHeader>
            <form
              id="new-workspace"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) setStep('plan');
              }}
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Name</span>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Platform team" maxLength={80} autoFocus />
              </label>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" form="new-workspace" disabled={!name.trim()}>
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Choose a plan for {name.trim()}</DialogTitle>
              <DialogDescription>Each workspace has its own plan: one flat price, never per person.</DialogDescription>
            </DialogHeader>
            <div role="radiogroup" aria-label="Plan" className="flex flex-col gap-2">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={plan === p.id}
                  disabled={!p.available}
                  onClick={() => setPlan(p.id)}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
                    plan === p.id && p.available ? 'border-primary bg-primary/5' : 'hover:bg-accent',
                    !p.available && 'cursor-not-allowed opacity-55 hover:bg-transparent',
                  )}
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{p.name}</span>
                    <span className="block text-sm text-muted-foreground">{p.blurb}</span>
                  </span>
                  <span className="flex flex-none items-center gap-3 text-right">
                    <span>
                      <span className="block font-semibold">{p.price}</span>
                      <span className="block text-xs text-muted-foreground">{p.note}</span>
                    </span>
                    <span className={cn('grid size-5 place-items-center rounded-full border', plan === p.id && p.available && 'border-primary bg-primary text-primary-foreground')}>
                      {plan === p.id && p.available && <Check className="size-3" />}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {used ? (
              <p className="text-sm text-muted-foreground">
                Your lifetime access covers one Pro workspace, and it's {used.name}. Monthly Pro, Team and Business, for more workspaces, are on their way.
              </p>
            ) : (
              !lifetime &&
              billing &&
              !canBuy && (
                <p className="text-sm text-muted-foreground">
                  {billing.available ? `All ${billing.seats.total} founding seats are taken.` : 'Buying Pro opens soon.'} Team and Business are on their way.
                </p>
              )
            )}
            <DialogFooter className="sm:justify-between">
              <Button variant="ghost" onClick={() => setStep('name')}>
                <ArrowLeft />
                Back
              </Button>
              <Button onClick={create} disabled={busy || !chosen.available}>
                {busy && <Loader2 className="animate-spin" />}
                {lifetime ? 'Create workspace' : `Continue to payment · ${chosen.price}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from 'react';
import { Check, Infinity as InfinityIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, formatPrice, type Billing } from './api';
import { Loading } from './App';
import { useSession } from './session';
import { Button } from '@/components/ui/button';

const FREE = ['Every feature in your personal workspace', 'Up to 10 diagrams', 'The CLI and the MCP server for AI apps'];
const LIFETIME = [
  'Unlimited diagrams',
  'Team workspaces: you and up to four other editors each, and as many viewers as you like',
  'Everything we add to the editor, for good',
];

/**
 * Your plan, and buying lifetime access. Stripe Checkout comes back here: with
 * ?session_id after paying (the webhook grants access, so this waits for it),
 * or ?canceled when someone backs out (their held seat is given back).
 */
export function PlanPage() {
  const session = useSession();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [confirming, setConfirming] = useState(() => new URLSearchParams(location.search).has('session_id'));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const clean = () => history.replaceState(null, '', location.pathname);
    if (params.has('canceled')) {
      clean();
      api.cancelCheckout().catch(() => undefined).finally(() => api.billing().then(setBilling));
      return;
    }
    if (!params.has('session_id')) {
      api.billing().then(setBilling, (e: Error) => toast.error(e.message));
      return;
    }
    // Paid: Stripe's webhook usually lands within seconds.
    let stop = false;
    void (async () => {
      for (let i = 0; i < 30 && !stop; i++) {
        const b = await api.billing().catch(() => null);
        if (b) setBilling(b);
        if (b?.lifetime) {
          clean();
          setConfirming(false);
          await session.reload();
          toast.success(b.purchase?.seat ? `Welcome, founding member #${b.purchase.seat}!` : 'You have lifetime access.');
          return;
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!stop) {
        clean();
        setConfirming(false);
        toast.message("Your payment is still being confirmed. It'll show here shortly; Stripe has emailed your receipt.");
      }
    })();
    return () => {
      stop = true;
    };
    // Runs once, for the address the page was opened with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!billing) return <Loading label={confirming ? 'Confirming your payment…' : 'Loading…'} />;
  const lifetime = billing.lifetime || session.lifetime;
  return (
    <div className="overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Your plan</h1>
        {confirming && (
          <p className="mt-4 flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Confirming your payment…
          </p>
        )}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PlanCard title="Free" price="$0" items={FREE} current={!lifetime} />
          <PlanCard
            title="Lifetime"
            price={`${formatPrice(billing.price)} once`}
            items={LIFETIME}
            current={lifetime}
            highlight
            footer={
              lifetime ? (
                <p className="text-sm text-muted-foreground">
                  {billing.purchase?.seat
                    ? `Founding member #${billing.purchase.seat}, since ${new Date(billing.purchase.paidAt!).toLocaleDateString()}.`
                    : 'Lifetime access is on your account.'}
                </p>
              ) : (
                <BuyLifetime billing={billing} />
              )
            }
          />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Lifetime is a one-time payment for founding members, limited to {billing.seats.total} seats. It doesn't include features that run
          AI models on our bill, enterprise features like SSO, or storage beyond fair use. Refunds within 30 days, no questions asked.
        </p>
      </div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  items,
  current,
  highlight,
  footer,
}: {
  title: string;
  price: string;
  items: string[];
  current: boolean;
  highlight?: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <section className={`flex flex-col rounded-lg border bg-card p-5 ${highlight ? 'border-primary/40 shadow-sm' : ''}`}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="flex items-center gap-1.5 font-semibold">
          {highlight && <InfinityIcon className="size-4 text-primary" />}
          {title}
        </h2>
        {current && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Your plan</span>}
      </div>
      <div className="mt-2 text-2xl font-semibold">{price}</div>
      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <Check className="mt-0.5 size-4 flex-none text-primary" />
            {i}
          </li>
        ))}
      </ul>
      {footer && <div className="mt-5">{footer}</div>}
    </section>
  );
}

/** "Get lifetime access" for the founding cohort, with seats left; it sends the browser to Stripe Checkout. */
export function BuyLifetime({ billing, className }: { billing: Billing; className?: string }) {
  const [busy, setBusy] = useState(false);
  if (!billing.available) return <p className="text-sm text-muted-foreground">Lifetime access opens soon.</p>;
  if (billing.seats.left === 0) return <p className="text-sm text-muted-foreground">All {billing.seats.total} founding seats are taken.</p>;
  const buy = async () => {
    setBusy(true);
    try {
      const { url } = await api.checkout();
      window.location.assign(url);
    } catch (e) {
      toast.error((e as Error).message);
      setBusy(false);
    }
  };
  return (
    <div className={className}>
      <Button className="w-full" onClick={buy} disabled={busy}>
        {busy && <Loader2 className="animate-spin" />}
        Get lifetime access · {formatPrice(billing.price)}
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {billing.seats.left} of {billing.seats.total} founding seats left
      </p>
    </div>
  );
}

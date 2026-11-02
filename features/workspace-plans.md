# Workspace plans and billing

**Status:** planned · **Priority:** high
**Summary:** Every workspace has its own plan and its own billing. You get one free personal workspace; any other workspace starts by choosing a plan (Pro, Team or Business), and its billing, plan and settings live in that workspace. No per-seat pricing anywhere. The founding lifetime offer becomes Pro, forever, for one workspace.

## Decided (2026-11-02)

- **No seat-based billing.** Prices are flat per workspace; plans differ by member limit and features, never by a per-person charge.
- **Billing belongs to a workspace, not a user.** A workspace's plan, payment method, invoices and settings are in that workspace, managed by its owners. Moving a workspace to someone else moves its billing too.
- **One free workspace per person:** the personal one. Creating any other workspace means choosing a plan and paying for it.
- **Pro allows 4 people,** counting everyone in the workspace (owner, editors and viewers) and open invites.
- **Lifetime = Pro limits, forever, on one workspace.** The founding purchase is the Pro plan paid once instead of monthly.
- **Limits apply to new changes only.** Nobody is ever removed: a workspace over its plan's limits can't add people or diagrams until it's back under, or upgrades. Grandfathered teams (from before plans) stay free and unlimited.

## The plans

| Plan | Price | People | Diagrams | Also |
| --- | --- | --- | --- | --- |
| **Free** (personal workspace only) | $0 | just you | 10 | every editor feature, the CLI and MCP |
| **Pro** | about $8/month | up to 4 | unlimited | shared images |
| **Pro lifetime** (founding, 100 seats) | $99 once | up to 4 | unlimited | Pro, forever |
| **Team** | about $49/month | unlimited | unlimited | team features as they ship: version history, GitHub sync, private published docs |
| **Business** | about $199/month | unlimited | unlimited | SSO/SAML, audit log, priority support, a signed agreement |

Yearly billing gets about two months free. Metered AI (features that call a model on our bill) is a separate add-on on any plan. Image storage has a fair-use cap per plan.

## How it could work

**Creating a workspace.** "New workspace" asks for a name and a plan. Paid plans go to Stripe Checkout (`mode=subscription`, or `payment` for the lifetime offer while seats last); the workspace is created when the webhook confirms payment, so there are no unpaid workspaces to clean up. Coming back from Stripe lands in the new workspace's members page.

**A workspace's billing page** (`/:org/billing`, owners and admins): the plan, what it allows and what's used (people, diagrams, storage), change plan, and Stripe's customer portal for the payment method, invoices and cancelling.

**Upgrading the personal workspace.** Personal stays just you. "Unlimited personal diagrams" means upgrading it to Pro, which also lets it have members, so it stops being purely personal. Alternative: personal can't be upgraded, and you make a Pro workspace instead. (Open question 1.)

**Cancelling or failing to pay.** At the end of the paid period (after Stripe's retries for failed payments) the workspace drops to read-only: everything stays viewable and exportable, nothing is deleted, and resubscribing brings it back.

**Data model.** `orgs` gets `plan` (free, pro, team, business), `plan_source` (subscription, lifetime, grandfathered, comp), and Stripe's customer and subscription ids. `users.lifetime_since` goes away: lifetime is a workspace's plan. Purchases and Stripe events are kept per workspace. The plan checks in `plans.go` read the workspace's plan instead of its owners' lifetime access.

**Admin screens.** A workspace's admin page shows and sets its plan (comps, grandfathering), with the Stripe subscription linked; the overview shows workspaces per plan and monthly recurring revenue.

## What changes from what's built

Built and deployed on 2026-11-01/02, before any seat was sold:

- Lifetime is a user flag (`users.lifetime_since`) that lifts the personal diagram limit and lets the person create unlimited teams of 5 editors with unlimited viewers. This becomes a workspace plan: one Pro workspace, 4 people total.
- Checkout buys lifetime for the user from the Plan page and the Create team dialog. This becomes "choose a plan" when creating a workspace, with lifetime as one choice.
- Admin grants lifetime to a user. This becomes setting a workspace's plan.

So nobody is affected; only the lifetime grant on the owner's own account needs moving to their workspace.

## Open questions

1. Can the personal workspace be upgraded to Pro (and so take members), or does Pro always mean a new workspace?
2. Should new workspaces get a free trial (say 14 days of Team) before choosing, or is choosing a plan up front the point?
3. After the founding 100 seats: retire the lifetime offer, or keep a Pro lifetime at a higher price for short windows?
4. Exact prices, and the storage cap per plan.
5. Founders who outgrow 4 people: a discount on Team, and does their lifetime purchase count toward it?

## Phases

1. Workspace plans in the data and the plan checks (with the personal free limit and Pro's 4 people), admin can set plans, the founding lifetime offer moved onto workspaces.
2. Creating a workspace with a plan, through Checkout; the workspace billing page.
3. Subscriptions for Pro, Team and Business: Stripe subscriptions, the customer portal, upgrades and downgrades, failed payments and cancelling.
4. Business features (SSO, audit log) as customers ask for them.

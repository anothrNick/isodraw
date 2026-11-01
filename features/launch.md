# Launch: lifetime access cohort

**Status:** planned · **Priority:** high
**Summary:** Take IsoDraw from "live for us" to "people pay for it": free for personal use, and $99 one-time lifetime access with teams for the first 100 buyers, on infrastructure that won't lose their work.

The app is live (see [hosting](hosting.md)): sign-in, workspaces and invites, diagrams and docs, preview links, workspace images, the CLI and the MCP server. There's no billing, no paid gating, no outgoing email of our own, and the database is a single unmanaged machine. This is the checklist from here to launch, roughly in order. Decisions come first because most of the build depends on them.

## 1. Decide

Decided 2026-11-01:

| Question | Decision |
| --- | --- |
| Who pays, for what | **Free:** everything in your personal workspace, MCP writes included, up to **10 diagrams**, with fair-use image storage. The aim is to be sticky for engineers, so no feature is held back. **Lifetime ($99, one-time):** team workspaces. |
| What lifetime covers | **The buyer.** They can create team workspaces with up to **5 editors** (the buyer plus 4 teammates, who don't need to buy) and unlimited viewers, and their personal workspace has no diagram limit. **No limit on the number of teams** (decided 2026-11-01): the 5-editor cap is per team, which is generous on purpose for the founding cohort. |
| Not included, in writing | **Metered AI** (features that call a model on our bill, like AI in the editor; MCP stays included because it uses the user's own AI), **enterprise features** (SSO/SAML, audit logs, teams over 5 editors) and storage beyond **fair use**. |
| Cohort | **100 seats**, no end date; it closes when they're gone. Seats left shown on the pricing page. |
| Refunds | **30 days, no questions.** A refund ends team access; the personal workspace drops back to the free limits. |
| Payments | **Stripe Checkout + Stripe Tax.** We register for and file sales tax and VAT ourselves where thresholds are crossed. |
| Domain | **Buy a dedicated domain** and move to it before launch. Keep `isodraw.sjostrom.io` redirecting for good. |
| Teams that exist before launch | **Grandfathered:** they keep working free, at their current size. |

Still open:

- [ ] Storage numbers: fair use for free (e.g. 250 MB of images) and for lifetime (e.g. 1 GB).
- [x] What happens at the 10-diagram limit: creating an 11th is refused with a note on exporting and deleting one, and nothing existing is locked or deleted.
- [x] Grandfathered teams have no editor cap for now (built that way; revisit if one grows past what's fair).
- [ ] Business basics: the entity that sells it, a bank account, and the support email on receipts.
- [ ] The domain name itself.

## 2. Billing and access

- [x] `purchases` table: user, provider's payment and customer ids, amount, currency, cohort seat number, created and refunded times.
- [x] Checkout: "Buy lifetime access" creates a one-time Checkout session for the signed-in user, then returns to a success page that waits for the webhook.
- [x] Webhook endpoint: verify the signature, handle each event once (store event ids), grant on payment and revoke on refund or dispute.
- [ ] Reconcile against Stripe daily in case a webhook was missed (Stripe retries failed webhooks for three days, so this is a backstop).
- [x] Cohort cap enforced on the server: reserve a seat when checkout starts, release it when the session expires, show "sold out" once full. Two buyers must not get the last seat.
- [x] Entitlements checked in the API, not just hidden in the UI, and so the same for API tokens, the CLI and MCP (`api/internal/httpapi/plans.go`; limits answer 402 `plan_limit`):
  - free: 10 diagrams in the personal workspace and no team workspaces;
  - lifetime (`users.lifetime_since`): team workspaces, 5 editor seats each (members who edit plus open invites to edit; invites and role changes past that are refused), unlimited viewers;
  - grandfathered (`orgs.grandfathered`, set on every team that existed when the migration ran): free, no seat limit;
  - a team whose owners lose lifetime (a refund) turns read-only, with nothing lost.
- [ ] Image storage cap per workspace (free and lifetime numbers still open).
- [x] Clear messages at each limit, with the way out: the app shows "n of 10 diagrams", seats used on the Members page, and a create-team dialog that explains lifetime. The buy button comes with checkout.
- [x] `isodraw lifetime grant|revoke <email>` on the server, for comps and testing before checkout exists (DEPLOY.md).
- [ ] Docs: how to export a diagram (JSON, Markdown docs, PNG/SVG) and import it back, so free users can keep 10 active and archive the rest.
- [x] Account page (`/settings/plan`): plan, purchase date, seat number ("Founding member #42"). Stripe emails the receipt and invoice; a receipt link on the page is still to do.
- [ ] Launch codes or coupons, if there'll be any.
- [ ] Stripe Tax: turn it on, set product tax codes (software, downloadable or SaaS), add tax registrations where needed, and put the business address on receipts.
- [ ] End-to-end in test mode: buy, get access, refund, lose access, webhook retried, cohort full.

## 3. Email

- [ ] **Cognito's built-in email sends at most 50 a day.** Move it to Amazon SES with our own sender before launch, or sign-ups will stall on launch day. SES starts in a sandbox, so ask AWS for production access early.
- [ ] A verified sending domain with SPF, DKIM and DMARC.
- [ ] Invite emails. Today the inviter copies the link; the API sends nothing.
- [ ] Purchase and refund emails (the provider can send receipts), plus a welcome email.

## 4. Data safety and reliability

- [ ] Move Postgres to Fly Managed Postgres or another managed host with automatic backups and point-in-time recovery (DEPLOY.md has the move).
- [ ] Practice a restore once, and write the steps down.
- [ ] Run at least two API machines, so a deploy or crash doesn't take the app down.
- [ ] Tigris: a lifecycle or backup plan for images, and a way to delete a workspace's images when the workspace goes.
- [ ] Error tracking (Sentry or similar) for the web app, the API and the Pages Functions.
- [ ] Uptime checks on the site, `/healthz`, a preview link and an image link, alerting your phone.
- [ ] A status page, even a simple one.
- [ ] Cost guardrails: the Workers paid plan (preview PNGs need more than the free CPU limit), billing alerts on Cloudflare, Fly and AWS, and limits on storage per workspace.

## 5. Security and abuse

- [ ] A security review of the whole app (`/security-review`), especially sign-in, sessions, OAuth for MCP, invites, preview signing and uploads.
- [ ] Rate limits on sign-up, sign-in, uploads, preview drawing and the public API, not just sign-in and OAuth registration.
- [ ] Upload abuse: public image links can host anything. Add a way to report an image and to take one down (set `removed_at` and delete the bytes).
- [ ] Security headers on the app (CSP, HSTS, frame options).
- [ ] Domain move: buy it, point Pages and the API at it (`PUBLIC_URL`), update Cognito callbacks and the SES sender, OAuth metadata and MCP docs, and redirect the old domain permanently.
- [ ] Dependency audit (`npm audit`, `govulncheck`) and a habit of updating.
- [ ] Rotate the secrets set up during development, and write down who can reach production and how.

## 6. Accounts and legal

- [ ] Terms of service, including what "lifetime" means and what happens if IsoDraw ever shuts down (for example, export everything and get notice).
- [ ] Privacy policy, a subprocessor list (Cloudflare, Fly.io, Tigris, AWS Cognito and SES, the payment provider) and the refund policy. Link them from the sign-up page and the footer.
- [ ] Delete account and delete workspace, including their images and tokens.
- [ ] Export: all of a workspace's diagrams and docs in one download.
- [ ] Transfer workspace ownership, so a team isn't stuck if its owner leaves.
- [ ] Cookie notice, if anything beyond the session cookie gets added (analytics, for instance).

## 7. Product and launch

- [ ] A landing page that shows the product: a live published diagram, the MCP demo, templates.
- [ ] A pricing page: free (personal, everything, 10 diagrams) next to founding lifetime ($99, teams of 5 editors, 100 seats, seats left), what lifetime doesn't include, and an FAQ (what does lifetime mean, refunds, teams).
- [ ] Onboarding: first diagram from a template, the Docs tab and MCP setup in a few steps, and docs or help pages.
- [ ] Privacy-friendly analytics (Cloudflare Web Analytics or Plausible) on sign-ups and purchases.
- [ ] Support: an email address, a feedback link in the app, a public changelog.
- [ ] Check Safari, Firefox, mobile layout and basic accessibility.
- [ ] A live-mode purchase with a real card, then refund it.
- [ ] A waitlist or launch list, and where to announce (Show HN, Product Hunt, X and Bluesky, Reddit, communities that draw architecture).
- [ ] Launch-day watch: webhook failures, sign-up email delivery, error rates, Cognito and SES quotas.

## After launch

- [ ] Close the cohort at 100 seats, and switch the pricing page to whatever comes next (a team plan, a higher lifetime price, or a subscription).
- [ ] Reconcile purchases weekly at first.
- [ ] Ask the founding cohort what to build next.

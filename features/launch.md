# Launch: lifetime access cohort

**Status:** planned · **Priority:** high
**Summary:** Take IsoDraw from "live for us" to "people pay for it": a one-time payment for lifetime access, sold to a capped first cohort, on infrastructure that won't lose their work.

The app is live (see [hosting](hosting.md)): sign-in, workspaces and invites, diagrams and docs, preview links, workspace images, the CLI and the MCP server. There's no billing, no paid gating, no outgoing email of our own, and the database is a single unmanaged machine. This is the checklist from here to launch, roughly in order. Decisions come first because most of the build depends on them.

## 1. Decide

- [ ] **What lifetime buys.** Per person, or per workspace (and so for a whole team)? Which features, now and future? Write down what's excluded, especially anything that costs us per use: AI in the editor, large storage, heavy preview rendering. "Lifetime of the product" is the usual wording.
- [ ] **Limits that come with it.** Diagrams, workspaces, members per workspace, image storage (uploads are 5 MB each with no workspace total yet), API tokens and MCP use. Generous, but finite, so one account can't run up a bill.
- [ ] **Price, cohort size and end date.** A hard cap (say the first 100–250 buyers) and a deadline. Is the cap visible on the pricing page?
- [ ] **What everyone else gets.** A free tier with limits, a trial, or nothing until the cohort closes? This decides what the gating code checks.
- [ ] **Payment provider.** Stripe Checkout plus Stripe Tax, or a merchant of record (Lemon Squeezy, Paddle) that collects and pays sales tax and VAT for you. A merchant of record costs a few points more but removes most tax paperwork for a solo seller.
- [ ] **Refund policy.** For example 30 days, no questions asked. A refund ends access.
- [ ] **Business basics.** The entity that sells it, a bank account, and the support email address on receipts.
- [ ] **The final domain.** Decide before launch. Image links (`/i/…`), preview links, the MCP connector URL, OAuth redirects and Cognito callbacks all contain `isodraw.sjostrom.io`. If it changes later, keep the old domain redirecting for good.

## 2. Billing and access

- [ ] `purchases` table: user (or workspace), provider's payment and customer ids, amount, currency, cohort seat number, created and refunded times.
- [ ] Checkout: "Buy lifetime access" creates a one-time Checkout session for the signed-in user, then returns to a success page that waits for the webhook.
- [ ] Webhook endpoint: verify the signature, handle each event once (store event ids), grant on payment and revoke on refund or dispute. Reconcile against the provider daily in case a webhook was missed.
- [ ] Cohort cap enforced on the server: reserve a seat when checkout starts, release it when the session expires, show "sold out" once full. Two buyers must not get the last seat.
- [ ] Entitlements checked in the API, not just hidden in the UI: diagram, member and storage limits, and the same checks for API tokens, the CLI and MCP.
- [ ] Account page: plan, purchase date, receipt link, seat number ("Founding member #42").
- [ ] Launch codes or coupons, if there'll be any.
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
- [ ] A pricing page: the lifetime offer, seats left, what's included, the free tier, an FAQ (what does lifetime mean, refunds, teams).
- [ ] Onboarding: first diagram from a template, the Docs tab and MCP setup in a few steps, and docs or help pages.
- [ ] Privacy-friendly analytics (Cloudflare Web Analytics or Plausible) on sign-ups and purchases.
- [ ] Support: an email address, a feedback link in the app, a public changelog.
- [ ] Check Safari, Firefox, mobile layout and basic accessibility.
- [ ] A live-mode purchase with a real card, then refund it.
- [ ] A waitlist or launch list, and where to announce (Show HN, Product Hunt, X and Bluesky, Reddit, communities that draw architecture).
- [ ] Launch-day watch: webhook failures, sign-up email delivery, error rates, Cognito and SES quotas.

## After launch

- [ ] Close the cohort at the cap or the date, and switch the pricing page to whatever comes next.
- [ ] Reconcile purchases weekly at first.
- [ ] Ask the founding cohort what to build next.

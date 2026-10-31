# Audit log and SSO enforcement

**Status:** idea · **Priority:** later
**Summary:** What larger customers ask for early: a record of who did what, and requiring company sign-in.

- **Audit log:** an append-only table of events (signed in, created, changed or deleted a diagram, changed a role, invited, created a token, shared a link) with who, when, from where (app, CLI, CI). A page for owners and admins with filters and a CSV export.
- **SSO enforcement:** a workspace setting that members must sign in through the company's identity provider (OIDC or SAML through Cognito federation), and that invites only work for the company's domain.

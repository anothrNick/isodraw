# Share links

**Status:** idea · **Priority:** next
**Summary:** Read-only public links to a diagram's docs page, for people without an account. Links can expire and be revoked.

## How it could work

- **Data:** a `share_links` table (`diagram_id`, hashed token, created by, expires at, revoked at, last viewed at).
- **Page:** `/s/<token>` renders the docs view (nested contents, a page per component) without the app's chrome or any editing. A small "Made with IsoDraw" footer.
- **API:** `GET /api/public/<token>` returns the diagram's content only, never ids of the organization or its other diagrams. Rate limited.
- **Managing:** a *Share* dialog on the diagram: create a link, choose an expiry (never, 7 days, 30 days), copy, revoke. Owners and admins see all links in the workspace.
- **Optional:** a password, or "only people at @company.com" (needs sign-in).

## Risks

Docs can contain internal details. The share dialog should say plainly that anyone with the link can read everything, including detail diagrams.

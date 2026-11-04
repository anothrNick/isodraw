# The Playground: draw without signing up

**Status:** in progress (phase 1 built) · **Priority:** next
**Summary:** A public editor, the Playground, at `isodraw.app/playground` (`/draw` also works) that runs entirely in the browser: one diagram, saved on the device, with import and export, and a one-click hand-off into a free account when someone wants to keep more.

## Why

Sign-up is the biggest drop-off between the landing page and someone actually drawing. Letting people start straight away shows what IsoDraw does better than any screenshot, and a diagram they've already made is the strongest reason to create an account. It costs nothing to run: no API calls, no storage, just the static site.

## What it includes

Everything the editor does on its own, which is nearly everything:

- One diagram, with detail diagrams inside its components.
- 2D and isometric views, every shape (notes, frames, lifelines), the isometric, AWS, GCP and Azure icon sets.
- Docs on the diagram and on every component, including embedded diagrams and Mermaid.
- Sequence diagrams and **Tidy** (ELK placement, routing, labels).
- **Open:** a diagram JSON file, or Terraform state or plan JSON.
- **Export:** JSON, SVG, PNG and Markdown docs.
- Images dropped in or loaded from a URL, kept in the browser.

And what needs an account (each one is a reason to sign up, said plainly where it would appear):

- More than one diagram, and diagrams kept across devices.
- Published pages and share links, preview images for chat.
- Teams and workspaces.
- The MCP connector and the CLI.

## How it could work

- **Page:** a new route, `/draw`, outside the sign-in check in `web/src/App.tsx`, rendering `IsoDiagramEditor` with a slim header: the IsoDraw mark, "Saved on this device", **Save to your account**, and **Sign up**. No workspace switcher, no account menu. The editor's own Open and Export buttons do the rest.
- **Saving:** every change saves to the browser, debounced. IndexedDB rather than localStorage, because dropped-in images are stored as data URLs and quickly pass localStorage's ~5 MB limit. On load, the saved diagram comes back; the first visit opens a starter (one of the examples, or blank with a hint).
- **One diagram:** **New** replaces the current one after a confirm that offers to download it first. Opening a JSON file does the same.
- **Images:** `onUploadImages` isn't passed, so the editor keeps images as data URLs in the diagram, as the demo does today. No upload, no Tigris.
- **Save to your account:** sends them to sign up (or sign in), with the diagram kept in the browser. After sign-in, the app sees the saved draft and offers to import it into the personal workspace (it counts toward the free 10). Once imported, the draft is cleared and `/draw` opens with a fresh one. If they're already signed in, `/draw` shows the same offer in its header.
- **Images on import:** data-URL images are uploaded to the workspace's image store as part of the import, so the saved diagram uses normal image links.
- **Landing page:** the hero's main call to action becomes **Start drawing, no sign-up** → `/draw`, with **Sign up free** beside it. The pricing table's Free column links there too.
- **Privacy:** a line in the header's info: nothing leaves the browser until you save to an account.
- **The GitHub Pages demo:** stays as the library's demo for developers, or redirects to `/draw`. `/draw` replaces it as the thing to send people.

## Phases

1. **The page.** `/draw` with local saving (IndexedDB), the slim header, New with download-first, and the starter. Open and Export come with the editor. *Built:* `web/src/DrawPage.tsx` and `web/src/draft.ts`; the starter is the three-tier example, New offers a blank diagram or any example, and an empty canvas says where to start. Sign in and Sign up free sit in the header; Save to your account is phase 2.
2. **The hand-off.** Save to your account: sign-up keeps the draft, the post-sign-in import with image upload, and the offer for people already signed in.
3. **Getting people there.** Landing page and pricing calls to action, the info line, and a decision on the GitHub Pages demo. *Built so far:* the hero's main button is **Try the Playground** (with **Sign up free** beside it), the nav has a Playground link, the hero demo has **Open in Playground** for the example on show (`/playground?example=<id>`, which asks before replacing a saved diagram), and the closing section offers it next to sign-up.

## Open questions

- **URL:** decided: `/playground`, named the Playground everywhere; `/draw` stays as an alias.
- **Starter:** blank with a hint, or an example to play with (the three-tier app shows the most). Possibly a small "Start from an example" picker.
- **Examples menu:** include the examples gallery in `/draw`? It's the fastest way to show what IsoDraw can do, at the cost of a busier first screen.
- **Limits beyond one diagram:** a size cap on images kept in the browser (IndexedDB allows far more, but a 50 MB draft would be slow to import).
- **Analytics:** count visits and "saved to account" to see whether it converts, without tracking what people draw.

## Risks

- **Losing work:** browser storage can be cleared, and private windows lose it on close. The header should say "Saved on this device" (not "Saved"), and New and closing should nudge towards Export or an account.
- **Cannibalising sign-ups:** unlikely, since one diagram with no sharing or agents is a taste rather than a substitute, but worth watching in the numbers.
- **Support load:** people may expect `/draw` work to appear in their account automatically. The hand-off has to be explicit and obvious.

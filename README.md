# IsoDraw

A React component for drawing Cloudcraft-style architecture diagrams, with a flat (2D) view and an isometric (2.5D) view, and a platform around it: a Go API and a web app where people sign in and keep their diagrams.

Deploying: see [DEPLOY.md](DEPLOY.md) (web app on Cloudflare Pages, API and Postgres on Fly.io, sign-in with Cognito).

## Run the platform locally

You need Docker, Go and Node.

```bash
npm install
npm run dev
```

Then open http://localhost:5190 and create an account. No email is sent locally: the verification code (and any password reset code) is printed in the terminal, in the API's log.

`npm run dev` starts Postgres and Dex in Docker (`compose.yaml`), then runs the Go API with live reload on :8080 and the web app's Vite server on :5190 in one terminal. Vite forwards `/api` and `/auth` to the API, so the app and the API share an origin and the session cookie just works. The first run copies `.env.example` to `.env`. Ctrl+C stops the API and the app; the containers keep running. `npm run dev:reset` removes them and their data.

- **Postgres** runs on host port 5433, so it can sit next to another local Postgres. The API applies its migrations on startup.
- **Sign-in:** `AUTH_MODE` picks how people sign in. All three start the same session; only where the password is checked differs.
  - `local` (the default in `.env.example`): IsoDraw's own sign-up, sign-in and reset pages (`/login`, `/signup`, `/verify`, `/forgot`, `/reset`), with accounts in Postgres. Codes go to the API log; a self-hoster can send them by email through `Auth.OnCode`.
  - `cognito` (production): the same pages, with the API calling the Cognito user pool's API, so Cognito keeps the passwords and sends the emails. People never see Cognito's hosted pages.
  - `oidc`: a redirect to any OIDC provider's own login. Locally that's [Dex](https://dexidp.io), in compose: set `AUTH_MODE=oidc` and sign in as `dev@isodraw.local` / `password` (or `alex@isodraw.local`; see `dev/dex.yaml`).
- **Saving:** the editor autosaves after a short pause. Each save names the version it started from. If someone else saved in between, the API answers `409` with their version, the app merges the two edits item by item (`mergeDiagrams` in the library) and saves the result.

### API

All routes sit under `/api`, as a namespace (not a version). Requests are signed in with the session cookie, and changing requests must come from the app's own origin.

| Route | |
| --- | --- |
| `GET /api/me` | The signed-in user and their organizations. The first sign-in creates a personal organization. |
| `GET /api/orgs/{org}/diagrams` | An organization's diagrams, newest first, without content |
| `POST /api/orgs/{org}/diagrams` | Create one: `{ title?, content? }` |
| `GET /api/diagrams/{id}` | A diagram with its content. `ETag` is its version. |
| `PUT /api/diagrams/{id}/content` | Save content. Send `If-Match: "<version>"`; a stale version gets `409` with the current diagram. |
| `PATCH /api/diagrams/{id}` | Rename: `{ title }` |
| `DELETE /api/diagrams/{id}` | Delete (soft) |
| `POST /api/orgs` | Create a team you own: `{ name }` |
| `PATCH /api/orgs/{org}` | Rename (owners and admins) |
| `GET /api/orgs/{org}/members` | Members, plus pending invites for owners and admins |
| `PATCH` / `DELETE /api/orgs/{org}/members/{user}` | Change a role, or remove someone (anyone can remove themselves to leave) |
| `POST /api/orgs/{org}/invites` | Invite `{ email, role }`. Returns the link to share; no email is sent yet. |
| `DELETE /api/orgs/{org}/invites/{invite}` | Revoke an invite |
| `GET /api/invites/{token}`, `POST …/accept` | See and accept an invite. Accepting needs the invited email. |
| `GET /api/tokens`, `POST /api/tokens`, `DELETE /api/tokens/{id}` | API tokens: list, create `{ name, orgId, scope, expiresInDays }` (the secret is in the answer once), revoke. In the app only. |
| `DELETE /api/tokens/current` | A token revokes itself (`isodraw logout`) |

Sign-in lives at `/auth/login`, `/auth/callback` and `POST /auth/logout`. People outside an organization get `404` for its diagrams, so ids don't leak; viewers get `403` when they try to change something.

Roles are owner, admin, editor and viewer. Owners and admins manage members and invites; only an owner can make or change another owner, and the last owner can't leave or step down. Personal workspaces are for one person; teams are for sharing. An invite link works once, for 7 days, and only for a signed-in user with the invited email; inviting the same address again replaces the old link.

## CLI (for people and AI agents)

`packages/cli` is the `isodraw` command: list, read and change diagrams and their docs from a terminal, built so AI agents like Claude Code can work on your diagrams reliably.

```bash
npm run build -w @isodraw/cli
npx isodraw login          # opens the browser to authorize this machine (on https://isodraw.sjostrom.io)
npx isodraw diagrams list
npx isodraw describe "Payments service"
npx isodraw guide          # how agents should use it
```

- **Server:** the hosted app at https://isodraw.sjostrom.io by default. Against the local stack, pass `--server http://localhost:5190` to `login` (it's saved with the token) or set `ISODRAW_SERVER`.
- **Sign-in:** `isodraw login` opens the app's *Authorize the CLI* page, where you pick a workspace, read-only or read-and-write access, and an expiry; the app hands the token back to the CLI on a localhost port (`--no-browser` just prints the link). The token is saved in `~/.config/isodraw/config.json` (mode 600). Agents, scripts and CI can pass a token as `ISODRAW_TOKEN` instead; create and revoke tokens under *API tokens* in the account menu.
- **Reading:** `describe` prints a compact outline of a level (components, areas, connections, docs) that fits in a prompt; `docs get` prints a doc as Markdown. Diagrams are named by id or title, items by id or label, levels by path (`--level orders/validate`).
- **Changing:** `nodes add|update|remove`, `edges add|update|remove`, `docs set`, and `apply` for a batch of changes as JSON (with `--dry-run`). New items are placed automatically, inside the right area, without overlapping; `--icon` takes a Terraform resource type such as `aws_lambda_function` (`isodraw icons` lists them). Saves name the version they started from; if someone saved in between, the CLI merges item by item, like the app.
- **Layout is the platform's job.** Items the CLI adds, and everything an import creates, are marked as placed by the platform (`node.placed: 'auto'`). After each change, a level made only of such items is laid out again in columns by flow (the Terraform import's layered layout, now shared in `layout.ts`), so diagrams built by agents stay tidy. Moving or resizing an item in the editor makes it manual, and automatic layout never moves manual items; on a level with manual items, new items are only placed beside what they connect to. `isodraw layout <diagram>` and the editor's *Tidy up* button lay out a whole level on request (undo with ⌘Z in the editor).
- **For agents:** `--json` on every command, stable exit codes (0 ok, 1 usage, 2 not found, 3 conflict, 4 not signed in or not allowed), and a Claude Code skill in `.claude/skills/isodraw/` that tells Claude when and how to use it. Copy that folder to `~/.claude/skills/` to use it outside this repo.
- **Preview links:** `isodraw preview <diagram> [--level a/b] [--expires 30d]` prints a signed link to a picture of the diagram (`/p/{id}.svg`) and the editor link, plus Markdown that shows one linking to the other. Anyone with the picture link can see it until it expires (a week by default, at most a year); it shows the diagram as it is when fetched, without docs or deeper levels, and stops working if the diagram is deleted. Agents end their work with it, so chat apps show what changed. Behind it: `GET /api/diagrams/{id}/preview` signs the link (HMAC from `SESSION_SECRET`, so rotating that secret revokes every link), `GET /public/previews/{id}` checks it and returns the stripped level, and `web/preview/render.ts` draws the SVG with the library's `StaticDiagram` and inlines the icons, in a Pages Function in production and in the Vite dev server locally. Add `&theme=dark` to the picture link for the dark theme.

### Tokens

Tokens look like `isd_…` and are stored hashed. A token acts as its user, in one workspace only; a read-only token acts as a viewer there and can only make `GET` requests. Tokens can't create teams, change members, accept invites or make other tokens; those stay in the app. Send one as `Authorization: Bearer isd_…`.

## Run the demo

```bash
npm run demo
```

Then open http://localhost:5173. Use the *Examples* menu to load a three-tier web app, a serverless API, a streaming IoT pipeline, or a Kubernetes cluster. Every example includes docs on its components. The demo saves your diagram and imported images to `localStorage`.

A hosted copy is at https://sjostrom.io/isodraw/. CI deploys it after every push to `main` that passes the checks: it builds the demo and publishes it to the `gh-pages` branch. `npm run deploy:demo` does the same by hand.

## Tests

```bash
npm test            # library unit tests (Vitest), then the API tests (Go)
npm run test:api    # just the API tests
npm run test:e2e    # browser tests (Playwright), against a fresh build of the demo
```

The API tests run against the compose Postgres, each in a fresh database that is dropped afterwards, the OIDC sign-in tests walk through Dex's real login form, the password tests run the whole sign-up, verify and reset flow in `local` mode, and the Cognito client is tested against a fake Cognito. Without the containers they skip (in CI they fail instead).

The library's unit tests sit next to the code they cover (`packages/isodraw/src/**/*.test.ts`). They cover diagram parsing, containers, routing, docs export, theme colors, the icon loaders and the example docs. The example-docs tests check that every `<!-- node:id -->` section and @ mention points at a real item.

The browser tests in `e2e/` use the demo the way a person would. They load the examples, drag and undo, switch the view and the theme, hover mentions, resize panels, open the cloud icon tabs and browse the published docs. They serve the GCP and Azure icon sets locally, so they don't depend on the CDN. Run `npx playwright install chromium` once before the first run.

GitHub Actions runs the typecheck, the unit and browser tests, the library and web app builds, and the API tests (with the compose services) on every push to `main` and on pull requests (`.github/workflows/ci.yml`). When the browser tests fail, the run uploads the Playwright report.

## Features

- **Two views:** flat top-down and 2.5D isometric. The 2.5D view rotates in 90° steps. Press `Tab` to switch views and `R` / `Shift+R` to rotate. The 2D/2.5D choice is saved on the diagram (`diagram.view`), so read-only, published and embedded copies are drawn the same way.
- **Shapes:** block, cylinder, hexagon, pyramid, cone, sphere, rectangular area, circular area and ground text. Every shape has a color, size, height, elevation, opacity and label.
- **Images and logos:** upload PNG/SVG/JPG files (or drop them on the editor), or add one by URL. Images can be drawn as a *tile* (an icon on a block, like Cloudcraft), *flat* on the ground, or *standing* upright.
- **Cloud icons:** AWS, Google Cloud and Azure tabs in the palette, all searchable and loaded at runtime from the jsDelivr CDN (nothing is bundled):
  - *AWS:* the official AWS architecture icon set (about 800 services, resources, groups and categories), from the MIT-licensed [`aws-icons`](https://www.npmjs.com/package/aws-icons) package.
  - *Google Cloud:* Google's current core-product and category icons ([`gcp-icons`](https://www.npmjs.com/package/gcp-icons), MIT) plus the full set of 216 product icons ([`@f5-sales-demo/icons-gcp`](https://www.npmjs.com/package/@f5-sales-demo/icons-gcp), Apache-2.0).
  - *Azure:* Microsoft's Azure architecture icons, release V24, 636 icons in Microsoft's categories ([`@squinch/pack-azure`](https://www.npmjs.com/package/@squinch/pack-azure)). They're redistributed unmodified, and Microsoft permits their use in architecture diagrams, training material and documentation.
  - GCP and Azure load the first time you open their tab. Turn any set off with `awsIcons`, `gcpIcons` or `azureIcons` set to `false`.
- **Connections:**
  - *Draw the route:* drag from a node (Connect tool, or one of the side dots on a selected node) and trace the path you want. IsoDraw turns your trail into straight horizontal and vertical runs, snaps them to the grid, and puts the bends where you turned. It also picks the side to leave from and the side to enter by.
  - *Edit the route:* drag a segment's square handle to slide it. Drag an end dot onto any side of a node to re-attach it there. For straight and curved lines, drag the small dots to add bends, and double-click a bend to remove it. *Reset route* goes back to automatic routing.
  - *Style:* right-angle (optionally rounded), straight or curved. Solid, dashed or dotted lines. Each end can have an arrow, an open arrow, a circle or a diamond. New connections copy the style of the last connection you edited.
  - *Animation:* marching dashes (flow), data packets, a travelling pulse, or a breathing glow. Each has a direction setting (forward, reverse or both ways), a speed, and a highlight color. The toolbar has a play/pause button, and exported SVGs keep the animations.
- **Editing:** drag to move (snaps to a 0.5 grid; hold `Alt` to move freely), drag the corner handle to resize, drag the blue dot to change height, `Shift+drag` for box select, copy/paste/duplicate, nudge with the arrow keys, lock, and undo/redo.
- **Containers:** areas hold whatever sits inside them. Moving an area moves its contents, including nested subnets and the bends on connections between them. Dragging a node into an area adds it, and the area is highlighted while you drag. Press `⌘G` to wrap the selection in a new area, and `⇧⌘G` to ungroup it. Deleting an area also deletes its contents; *Ungroup* keeps them. Membership comes purely from position, so it always matches what you see.
- **Detail diagrams:** any component can have its own diagram of what's inside it (`node.detail`), nested as deep as you like. Add one with *Add detail diagram* on the sidebar's Properties or Docs tab.
  - A component with a detail diagram shows a small layers badge when you hover over or select it, next to its doc badge (`docBadges` controls both). Double-click it, click the badge, or select it and press `Enter` to go in. The canvas zooms in, and a breadcrumb bar at the top left (*Diagram › orders-api*) shows where you are. Press `Esc` (with nothing selected) or `⌥↑`, or click a crumb, to go back up. Going up selects the component you came out of, and each level remembers where you were looking.
  - Inside a detail diagram, the docs panel's overview is the component's own doc, so a component never has two docs to keep in step. Type `/Detail diagram` in a component's doc to show its detail diagram at that point; published pages show it there too.
  - Undo and redo cover every level. Undoing a change made on another level takes you to that level first, so nothing changes out of sight.
  - The level is a prop (`level` / `onLevelChange`), so a host can keep it in the URL. The demo uses `#in/<component>`, so links work and the browser's Back button goes up.
  - *Open* imports into the level on screen, so you can import a Terraform file as one component's detail diagram.
  - Diagrams embedded in a component's doc by earlier versions become its detail diagram when the diagram is loaded.
- **Readable at any angle:** text on the ground, area labels and image tiles turn to stay upright as you rotate the 2.5D view.
- **One sidebar:** selecting a component or connection opens the right sidebar, with *Properties* and *Docs* tabs for that item. It stays on whichever tab you last picked, and both tabs share one width. Viewers (`readOnly`) get the docs only.
- **Help:** the *?* button in the toolbar (or the `?` key) opens the keyboard shortcuts.
- **Responsive:** below 1000px wide, the side panels become drawers over the canvas.
- **Resizable panels:** drag the inner border of the shapes panel or the sidebar to widen it. Default widths are the minimums. Widths are remembered in the browser, and double-clicking a border resets it.
- **Documentation:** every node, connection and area can have its own doc, and the diagram has an overview page.
  - Open the docs with `D`, the toolbar *Docs* button, the sidebar's *Docs* tab, a double-click, or a node's doc badge. The docs follow your selection, and breadcrumbs (*Diagram › VPC › App subnet*) lead to parent docs.
  - The editor is Tiptap-based and stores Markdown. It has headings, lists, task lists, quotes, code blocks, tables and links, a formatting menu that appears over selected text, and `/` commands.
  - Type `@` to link another component. Clicking the link selects that component, centers it, and shows its doc. Links are stored as ordinary Markdown links (`[@ALB](isodraw:node/alb)`).
  - A small doc marker appears when you hover over or select a documented item (set `docBadges="always"` or `"never"` to change this). In `readOnly` mode, selecting a documented item opens its doc read-only, which turns the embedded viewer into browsable architecture documentation. The demo's *View only* button shows this.
  - Type `/Diagram` to embed an IsoDraw diagram in a doc, for example the internals or data flow of one component. Edit it in a full editor that opens over the page. It's saved in the Markdown as a fenced ```` ```isodraw ```` block of diagram JSON.
  - *Export → Docs (Markdown)* writes a single `architecture.md`, nested by area, with mentions turned into links within the file.
  - The editor loads lazily, so pages that never open the docs never download Tiptap.
- **Published view:** `<IsoDiagramPublished diagram={…} useHash />` turns a diagram and its docs into a read-only reading page. A nested table of contents sits beside the text on the same background; areas start open and detail diagrams start closed, each expands and collapses, and the way to the current page is always open. The overview shows the full diagram and the overview doc. Each component page has breadcrumbs, its doc, and one diagram: its detail diagram if it has one, otherwise the diagram it sits in with it highlighted. Click a component in either to open its page. Documented connections follow the doc. Components inside detail diagrams get pages at any depth (`#/node/orders/validate/stock`). The demo's *Published* mode shows it.
- **Light and dark themes:** pass `theme="light" | "dark" | "system"` to the editor or the published view (`system` follows the OS). Every part of the UI switches, including the docs editor, embedded diagrams and the embed editor. Dark gray diagram ink, such as default text, slate connections and area labels, turns light in dark mode. Saturated colors stay exactly as picked. Exports from the dark theme get the dark canvas as their background so they stay readable.
- **Export:** PNG, SVG (images are embedded in the file) and JSON. Open a saved diagram from JSON.
- **Terraform import:** use *Open*, or drop a file onto the editor, to turn Terraform into a laid-out diagram. It reads a state file (`terraform.tfstate`, or `terraform state pull` output), `terraform show -json` output, or a plan (`terraform plan -out plan.out && terraform show -json plan.out`). It all runs in the browser, and the file never leaves it. The demo's *Imported from Terraform (AWS)* example is a sample state file imported as is.
  - *Components* get their AWS, Google Cloud or Azure icon. About 40 AWS, 35 Google Cloud and 45 Azure component types are mapped, along with the network areas and the supporting resources that link components (see `packages/isodraw/src/lib/terraformCatalog.ts`). Unmapped types become plain blocks, and the overview doc lists them.
  - *Areas:* VPCs and subnets (AWS), VPC networks and subnets (GCP), and resource groups, virtual networks and subnets (Azure) become nested areas. Components go in the area they're attached to, directly or through a subnet group, VPC connector or network interface. A component spread over sibling subnets (two availability zones) is drawn in the first, and its doc lists the rest. Areas with no components are left out.
  - *Connections:* in a plan, connections come from the references in the configuration, followed through module inputs and outputs. In state, they come from attribute values that contain another resource's ID, ARN, URL, hostname or name, such as a Lambda environment variable naming a table or an ECS task definition pointing at a database host. Supporting resources aren't drawn, but their links are: an event source mapping becomes *queue → function*, an SNS subscription *topic → queue*, a listener and target group *load balancer → service*, a DNS alias record *zone → distribution*, and a Pub/Sub push subscription *topic → service*. Each connection's doc says which references it came from.
  - *Layout:* components are placed in columns that follow the flow, left to right, inside their areas. Components with no connections go in a row underneath, so no line runs through them. It's a starting point to rearrange.
  - *Docs:* every component gets a starter doc with its Terraform address and its main settings (runtime, instance class, engine version, and so on). The settings come from a fixed list, and values Terraform marks sensitive are skipped, so passwords and keys in state never reach a doc. The overview doc counts what wasn't drawn, by type.
  - *As a library:* `importTerraform(json)` returns `{ diagram, summary }`. It loads the GCP icon set first if the file needs it. `terraformToDiagram(json, { gcpIcons })` does the same synchronously, and `isTerraformJson(json)` tells Terraform JSON apart from an IsoDraw diagram.

## Use as a library

```bash
npm run build   # → dist/
```

```tsx
import { IsoDiagramEditor, type Diagram } from 'isodraw';
import 'isodraw/style.css';

function App() {
  const [diagram, setDiagram] = useState<Diagram>({ version: 1, nodes: [], edges: [] });
  return (
    <div style={{ height: 700 }}>
      <IsoDiagramEditor value={diagram} onChange={setDiagram} defaultView="3d" />
    </div>
  );
}
```

### `IsoDiagramEditor` props

| Prop | Description |
| --- | --- |
| `value` / `onChange` | Controlled diagram |
| `defaultValue` | Starting diagram when uncontrolled |
| `defaultView` | `'3d'` (default) or `'2d'`, for diagrams without a saved `view` |
| `awsIcons` / `gcpIcons` / `azureIcons` | Offer that cloud's icon set in the palette (default `true`) |
| `iconLibraries` | Extra `IconLibrary[]` tabs for the palette |
| `userIcons` / `onUserIconsChange` | Images the user imported, so the host app can save them |
| `readOnly` | Hides the side panels and turns off editing |
| `theme` | `'light'` (default), `'dark'` or `'system'`. Colors are CSS variables (`--isd-bg`, `--isd-accent`, …) you can override |
| `docsButton` | Show the toolbar's *Docs* button (default `true`). The sidebar's *Docs* tab and the `D` key still open the docs |
| `level` / `onLevelChange` | The detail diagram on screen, as the ids of the components drilled into (`[]` is the top). The editor follows changes to `level` |

Docs are Markdown strings on `node.doc`, `edge.doc` and `diagram.doc`. The library is built as ES and CommonJS modules. React, React DOM, `@tiptap/*` and `tiptap-markdown` are dependencies of the package rather than bundled into it.

Lower-level exports: `StaticDiagram` (a responsive, non-interactive render), `IsoCanvas` (just the canvas, without the toolbar and panels), `SceneContent`, `Projector`, `loadAwsIconLibrary`, `loadGcpIconLibrary`, `loadAzureIconLibrary`, `exportSvg`, `exportPng`, `exportDocsMarkdown`, `createShape`, `createEdge`, `parseDiagram`.

### Data model

Coordinates are grid units on the ground plane: `x` points east, `y` points south and `z` (elevation) points up. Each node has a footprint (`w` × `d`) and a height `h`. Edges refer to node ids. A node's `detail` is a whole diagram of its own, whose ids only need to be unique within it. `levelAt(diagram, path)` and `withLevel(diagram, path, fn)` read and update one level. See `packages/isodraw/src/lib/types.ts`.

## Layout

```
packages/isodraw/   the component library (src/lib), the demo site (src/demo) and its browser tests (e2e)
packages/cli/       the isodraw CLI for people and AI agents
web/                the platform web app (React 19, Tailwind v4, shadcn/ui): diagram list, editor with autosave
api/                the Go API: cmd/isodraw, internal/{auth,config,db,httpapi,store}, migrations
dev/                local development: Dex config and the npm run dev script
infra/terraform/    Cognito for sign-in in production
compose.yaml        Postgres and Dex for local development
```

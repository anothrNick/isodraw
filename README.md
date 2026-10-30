# IsoDraw

A React component for drawing Cloudcraft-style architecture diagrams, with a flat (2D) view and an isometric (2.5D) view. It only draws diagrams. It does not sync with any cloud account.

## Run the demo

```bash
npm install
npm run dev
```

Then open http://localhost:5173. Use the *Examples* menu to load a three-tier web app, a serverless API, a streaming IoT pipeline, or a Kubernetes cluster. Every example includes docs on its components. The demo saves your diagram and imported images to `localStorage`.

A hosted copy is at https://sjostrom.io/isodraw/. To update it, run `npm run deploy`. That typechecks, runs the unit tests, builds the demo and pushes it to the `gh-pages` branch.

## Tests

```bash
npm test            # unit tests (Vitest)
npm run test:e2e    # browser tests (Playwright), against a fresh build of the demo
```

The unit tests sit next to the code they cover (`src/**/*.test.ts`). They cover diagram parsing, containers, routing, docs export, theme colors, the icon loaders and the example docs. The example-docs tests check that every `<!-- node:id -->` section and @ mention points at a real item.

The browser tests in `e2e/` use the demo the way a person would. They load the examples, drag and undo, switch the view and the theme, hover mentions, resize panels, open the cloud icon tabs and browse the published docs. They serve the GCP and Azure icon sets locally, so they don't depend on the CDN. Run `npx playwright install chromium` once before the first run.

GitHub Actions runs the typecheck, both test suites and the library build on every push to `main` and on pull requests (`.github/workflows/ci.yml`). When the browser tests fail, the run uploads the Playwright report.

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
- **Detail diagrams:** any component can have its own diagram of what's inside it (`node.detail`), nested as deep as you like. Add one with *Add detail diagram* in the inspector or the docs panel.
  - A component with a detail diagram shows a small layers badge when you hover over or select it, next to its doc badge (`docBadges` controls both). Double-click it, click the badge, or select it and press `Enter` to go in. The canvas zooms in, and a breadcrumb bar at the top left (*Diagram › orders-api*) shows where you are. Press `Esc` (with nothing selected) or `⌥↑`, or click a crumb, to go back up. Going up selects the component you came out of, and each level remembers where you were looking.
  - Inside a detail diagram, the docs panel's overview is the component's own doc, so a component never has two docs to keep in step. Type `/Detail diagram` in a component's doc to show its detail diagram at that point; published pages show it there too.
  - Undo and redo cover every level. Undoing a change made on another level takes you to that level first, so nothing changes out of sight.
  - The level is a prop (`level` / `onLevelChange`), so a host can keep it in the URL. The demo uses `#in/<component>`, so links work and the browser's Back button goes up.
  - *Open* imports into the level on screen, so you can import a Terraform file as one component's detail diagram.
  - Diagrams embedded in a component's doc by earlier versions become its detail diagram when the diagram is loaded.
- **Readable at any angle:** text on the ground, area labels and image tiles turn to stay upright as you rotate the 2.5D view.
- **Responsive:** below 1000px wide, the side panels become drawers you open from the toolbar, and the inspector opens when you select something.
- **Resizable panels:** drag the inner border of the shapes panel, the properties panel or the docs panel to widen it. Their default widths are the minimums. Widths are remembered in the browser, and double-clicking a border resets it.
- **Documentation:** every node, connection and area can have its own doc, and the diagram has an overview page.
  - Open the Docs panel with `D`, the toolbar *Docs* button, the inspector, a double-click, or a node's doc badge. The panel follows your selection, and breadcrumbs (*Diagram › VPC › App subnet*) lead to parent docs.
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
  - *Components* get their AWS, Google Cloud or Azure icon. About 40 AWS, 35 Google Cloud and 45 Azure component types are mapped, along with the network areas and the supporting resources that link components (see `src/lib/terraformCatalog.ts`). Unmapped types become plain blocks, and the overview doc lists them.
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
| `level` / `onLevelChange` | The detail diagram on screen, as the ids of the components drilled into (`[]` is the top). The editor follows changes to `level` |

Docs are Markdown strings on `node.doc`, `edge.doc` and `diagram.doc`. The library is built as ES and CommonJS modules. React, React DOM, `@tiptap/*` and `tiptap-markdown` are dependencies of the package rather than bundled into it.

Lower-level exports: `StaticDiagram` (a responsive, non-interactive render), `IsoCanvas` (just the canvas, without the toolbar and panels), `SceneContent`, `Projector`, `loadAwsIconLibrary`, `loadGcpIconLibrary`, `loadAzureIconLibrary`, `exportSvg`, `exportPng`, `exportDocsMarkdown`, `createShape`, `createEdge`, `parseDiagram`.

### Data model

Coordinates are grid units on the ground plane: `x` points east, `y` points south and `z` (elevation) points up. Each node has a footprint (`w` × `d`) and a height `h`. Edges refer to node ids. A node's `detail` is a whole diagram of its own, whose ids only need to be unique within it. `levelAt(diagram, path)` and `withLevel(diagram, path, fn)` read and update one level. See `src/lib/types.ts`.

## Layout

```
src/lib/      component library (geometry, rendering, canvas, editor UI) and its unit tests
src/demo/     demo site
e2e/          browser tests
```

# IsoDraw

A React component for drawing Cloudcraft-style architecture diagrams, with a flat (2D) view and an isometric (2.5D) view. It only draws diagrams. It does not sync with any cloud account.

## Run the demo

```bash
npm install
npm run dev
```

Then open http://localhost:5173. Use the *Examples* menu to load a three-tier web app, a serverless API, a streaming IoT pipeline, or a Kubernetes cluster. Every example includes docs on its components. The demo saves your diagram and imported images to `localStorage`.

A hosted copy is at https://sjostrom.io/isodraw/. To update it, run `npm run deploy`. That builds the demo and pushes it to the `gh-pages` branch.

## Features

- **Two views:** flat top-down and 2.5D isometric. The 2.5D view rotates in 90° steps. Press `Tab` to switch views and `R` / `Shift+R` to rotate. The 2D/2.5D choice is saved on the diagram (`diagram.view`), so read-only, published and embedded copies are drawn the same way.
- **Shapes:** block, cylinder, hexagon, pyramid, cone, sphere, rectangular area, circular area and ground text. Every shape has a color, size, height, elevation, opacity and label.
- **Images and logos:** upload PNG/SVG/JPG files (or drop them on the editor), or add one by URL. Images can be drawn as a *tile* (an icon on a block, like Cloudcraft), *flat* on the ground, or *standing* upright.
- **AWS icons:** the official AWS architecture icon set (about 800 icons: services, resources, groups and categories). They load at runtime from the jsDelivr CDN through the MIT-licensed [`aws-icons`](https://www.npmjs.com/package/aws-icons) npm package, and you can search them.
- **Connections:**
  - *Draw the route:* drag from a node (Connect tool, or one of the side dots on a selected node) and trace the path you want. IsoDraw turns your trail into straight horizontal and vertical runs, snaps them to the grid, and puts the bends where you turned. It also picks the side to leave from and the side to enter by.
  - *Edit the route:* drag a segment's square handle to slide it. Drag an end dot onto any side of a node to re-attach it there. For straight and curved lines, drag the small dots to add bends, and double-click a bend to remove it. *Reset route* goes back to automatic routing.
  - *Style:* right-angle (optionally rounded), straight or curved. Solid, dashed or dotted lines. Each end can have an arrow, an open arrow, a circle or a diamond. New connections copy the style of the last connection you edited.
  - *Animation:* marching dashes (flow), data packets, a travelling pulse, or a breathing glow. Each has a direction setting (forward, reverse or both ways), a speed, and a highlight color. The toolbar has a play/pause button, and exported SVGs keep the animations.
- **Editing:** drag to move (snaps to a 0.5 grid; hold `Alt` to move freely), drag the corner handle to resize, drag the blue dot to change height, `Shift+drag` for box select, copy/paste/duplicate, nudge with the arrow keys, lock, and undo/redo.
- **Containers:** areas hold whatever sits inside them. Moving an area moves its contents, including nested subnets and the bends on connections between them. Dragging a node into an area adds it, and the area is highlighted while you drag. Press `⌘G` to wrap the selection in a new area, and `⇧⌘G` to ungroup it. Deleting an area also deletes its contents; *Ungroup* keeps them. Membership comes purely from position, so it always matches what you see.
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
- **Published view:** `<IsoDiagramPublished diagram={…} useHash />` turns a diagram and its docs into a read-only docs site. It has a table of contents nested by area, an overview page with the full diagram, and a page per component. Each component page shows the component drawn at the top, a "where it sits" map, its doc, and its incoming and outgoing connections (with their docs) at the bottom. The demo's *Published* mode shows it.
- **Light and dark themes:** pass `theme="light" | "dark" | "system"` to the editor or the published view (`system` follows the OS). Every part of the UI switches, including the docs editor, embedded diagrams and the embed editor. Dark gray diagram ink, such as default text, slate connections and area labels, turns light in dark mode. Saturated colors stay exactly as picked. Exports from the dark theme get the dark canvas as their background so they stay readable.
- **Export:** PNG, SVG (images are embedded in the file) and JSON. Open a saved diagram from JSON.

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
| `awsIcons` | Load AWS icons from the CDN (default `true`) |
| `iconLibraries` | Extra `IconLibrary[]` tabs for the palette |
| `userIcons` / `onUserIconsChange` | Images the user imported, so the host app can save them |
| `readOnly` | Hides the side panels and turns off editing |
| `theme` | `'light'` (default), `'dark'` or `'system'`. Colors are CSS variables (`--isd-bg`, `--isd-accent`, …) you can override |

Docs are Markdown strings on `node.doc`, `edge.doc` and `diagram.doc`. The library is built as ES and CommonJS modules. React, React DOM, `@tiptap/*` and `tiptap-markdown` are dependencies of the package rather than bundled into it.

Lower-level exports: `StaticDiagram` (a responsive, non-interactive render), `IsoCanvas` (just the canvas, without the toolbar and panels), `SceneContent`, `Projector`, `loadAwsIconLibrary`, `exportSvg`, `exportPng`, `exportDocsMarkdown`, `createShape`, `createEdge`, `parseDiagram`.

### Data model

Coordinates are grid units on the ground plane: `x` points east, `y` points south and `z` (elevation) points up. Each node has a footprint (`w` × `d`) and a height `h`. Edges refer to node ids. See `src/lib/types.ts`.

## Layout

```
src/lib/      component library (geometry, rendering, canvas, editor UI)
src/demo/     demo site
```

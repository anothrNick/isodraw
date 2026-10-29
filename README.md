# IsoDraw

A React component for drawing Cloudcraft-style architecture diagrams, with a flat (2D) view and an isometric (2.5D) view. It only draws diagrams. It does not sync with any cloud account.

## Run the demo

```bash
npm install
npm run dev
```

Then open http://localhost:5173. The demo saves your diagram and imported images to `localStorage`.

A hosted copy is at https://sjostrom.io/isodraw/. To update it, run `npm run deploy`. That builds the demo and pushes it to the `gh-pages` branch.

## Features

- **Two views:** flat top-down and 2.5D isometric. The 2.5D view rotates in 90° steps. Press `Tab` to switch views and `R` / `Shift+R` to rotate.
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
| `defaultView` | `'3d'` (default) or `'2d'` |
| `awsIcons` | Load AWS icons from the CDN (default `true`) |
| `iconLibraries` | Extra `IconLibrary[]` tabs for the palette |
| `userIcons` / `onUserIconsChange` | Images the user imported, so the host app can save them |
| `readOnly` | Hides the side panels and turns off editing |

Lower-level exports: `IsoCanvas` (just the canvas, without the toolbar and panels), `SceneContent`, `Projector`, `loadAwsIconLibrary`, `exportSvg`, `exportPng`, `createShape`, `createEdge`, `parseDiagram`.

### Data model

Coordinates are grid units on the ground plane: `x` points east, `y` points south and `z` (elevation) points up. Each node has a footprint (`w` × `d`) and a height `h`. Edges refer to node ids. See `src/lib/types.ts`.

## Layout

```
src/lib/      component library (geometry, rendering, canvas, editor UI)
src/demo/     demo site
```

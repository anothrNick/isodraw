# Presentation mode

**Status:** in progress (phases 1 and 2 built) · **Priority:** next
**Summary:** Slides drawn as regions on the diagram, each with the docs to walk through there. Present opens a full-screen mode, beside Edit and Docs, where the camera flies from slide to slide and the docs follow along.

## Why

A diagram with docs already explains a system to someone reading on their own. Presenting it, in a design review, onboarding or an incident retro, still means zooming and panning by hand while hunting for the right docs page. A presentation turns the same diagram and docs into a guided walk-through, with nothing to export and nothing to keep in step.

## Decisions

- **Slides are regions on the graph:** a `slide` shape you drag out like an area. Not a separate slide editor, and not the `frame` shape, which is the titled outline for sequence fragments and steps.
- **It's a mode of the diagram, like Docs:** a Present button in the editor's top bar opens `/:org/d/:id/present`, and anyone who can read the diagram can present it. Public links and embeds come later, through share links.
- **Docs point to existing pages:** a slide lists the docs pages to walk through (a component's, a connection's or the diagram's), with optional notes of its own on top.
- **Slides can be any shape:** the region is fitted to the screen with a margin. It's a footprint on the floor, so a fixed 16:9 wouldn't hold in 3D anyway.
- **Moving between slides is an animated zoom and pan,** never a cut.
- **What's on a slide:** its own list of items (`shows`) when it has one: "Add a slide around these", the MCP's `around`, or picking items in its panel. Only those light up, even when others sit under its outline (a rectangle on a diagonal layout always takes in neighbours). Without a list, whatever is under the outline: items whose middle is inside, and areas only when they fit whole. A selected slide tints its items on the canvas.
- **New slides go last** in the order, whichever level they're drawn on. "Add a slide around these" (with several items selected) draws one around the selection.
- **Only a slide's border and badge pick it,** so clicking inside a slide still selects the components under it. Slides are never connection targets.

## How it works

### The slide shape

- A ground rectangle like an area (`kind: 'slide'`, `x, y, w, d`). In 3D it lies on the floor as a diamond, so it stays with the components through rotation and Tidy. Layout leaves slides where they are, like free text, and never moves things around them.
- **Shown only while editing:** a dashed outline with a number and title badge ("2 · Request path"). It's left out of exports, PNG previews, preview links, thumbnails, the docs site and View mode.
- **Inspector fields:** title, docs to walk through (by default the docs of whatever is inside, in reading order), notes (Markdown), and the view to show it in (2D/3D, rotation; defaults to the diagram's).
- **Contents:** whatever sits inside the region is the slide's focus. It stays bright and everything else dims. The camera fits the region, plus the tops of tall components inside it.
- Slides can be drawn in detail diagrams too.

### Data

```ts
// A slide is a DiagramNode with kind 'slide' and these extra fields:
interface SlideFields {
  docs?: DocTarget[];          // pages to walk through, in order; unset = contents' docs
  notes?: string;              // the slide's own Markdown
  slideView?: ViewMode;        // unset = the diagram's view
  slideRotation?: Rotation;
}

// On the top diagram: the order, across every level.
diagram.presentation?: { order: string[] };   // slide node ids
```

The order lives in one list because slides can sit in different detail diagrams. A slide that's missing from the list is added at the end, and ids that no longer exist are dropped, so the list can never break the presentation. It's all in the diagram JSON, so version history, merging, the CLI and MCP carry it with no extra work.

### Editing

- A Slide tile in the palette, under Notes and Frames.
- A small **Slides** list in the sidebar: every slide across levels, drag to reorder, click to jump to it (switching level if needed), and "Present from here".
- When no slides exist, the Present button offers to make a first draft (see Phase 3) or explains how to draw one.

### The presenter

- `IsoDiagramPresentation` in the library, loaded on demand like `IsoDiagramPublished`, and a `PresentPage` in the web app like `DocsPage`. The hash keeps the place (`#3`), so reloading or going Back works.
- **Layout:** the diagram fills the screen, with a docs panel on the right that can be collapsed and a slim bar showing the slide title, progress (3 / 9) and controls.
- **Keys:** → / Space / PageDown for next, ← / PageUp for back, Home / End, F for full screen, D to show or hide the docs panel, Esc to go back to the editor or docs.
- **Docs within a slide:** with several pages, → first steps through the pages, then moves to the next slide. Each page highlights the item it's about inside the slide.
- Clicking an item opens its docs in the panel without moving off the slide.

### The animated zoom and pan

- **Path:** the smooth zoom-pan path from van Wijk and Nuij (what d3's `interpolateZoom` uses). Nearby slides get a direct glide. Distant ones zoom out partway, travel, and zoom back in, so the audience keeps their bearings. The duration grows with the distance travelled, about 0.6–1.6 s, eased in and out. It's about 40 lines of our own code, so no new dependency.
- **Highlighting** fades from the old slide's contents to the new one's during the flight.
- **Changing level:** going into a detail diagram, the camera dives into the component, then the detail diagram fades in fitted to the component's box, so it seems to grow out of it. Coming back up reverses it. Several levels at once chain the steps.
- **Changing view or rotation:** a crossfade at the middle of the flight. Later, a true morph (both projections are linear, so they can be blended), with icons crossfading.
- **Interruptible:** a key press during a flight starts the next flight from wherever the camera is.
- **Reduced motion:** a short fade instead of the flight.
- **Speed:** the camera is React state today (`IsoDiagramEditor` → `IsoCanvas`). The presenter animates the canvas's view transform directly through a ref and settles the state at the end, so the diagram isn't re-rendered every frame. Check it on the largest example diagram.

## Phases

1. **The shape and the presenter (built):** the `slide` kind, its inspector fields and badge; filtering it out of every render path; `presentation.order` with repair; the Slides list; `IsoDiagramPresentation` with the flights, highlighting, level dives and docs panel; the Present route and button. Tests for the path maths, order repair and the export filtering.
2. **CLI and MCP (built):** `addSlide` (around items, with title, notes, docs, view and position), `updateSlide`, `orderSlides`; `describe` lists the slides in presenting order with what each shows and walks through. Slides are redrawn around their items whenever a level is laid out again (the platform's layout after AI changes, and Tidy). "Make a walk-through of this diagram" works in Claude and ChatGPT once the hosted MCP is deployed.
3. **A first draft:** "Draft slides" makes one slide per area or top-level group in reading order (the docs navigation's order), each with its contents' docs, as a starting point to edit.
4. **Sharing:** present from a share link, and a "Present" embed. Waits on [share links](share-links.md).
5. **Later:** per-slide connection animation (trace a request's path), revealing things step by step within a slide, the projection morph, presenter notes on a second screen, export to PDF.

## Open questions

- Does Present open in full screen right away, or in the app's frame with an F to go full screen? (Leaning: in the frame; full screen needs a click anyway.)
- Should a slide be able to show a different level than where it's drawn (for example, a slide on the top level that dives into a component)? Phase 1 says no: draw it in the detail diagram.
- Do viewers (read-only members) get the Slides list, or only Present?

## Risks

- **Slides leaking into output.** Every render path (SVG export, PNG previews, preview links, embeds, thumbnails, the docs site, `describe`'s picture) has to skip them. One shared filter, with a test per path.
- **Flight smoothness on big diagrams,** if the transform-only approach doesn't hold. Fallback: draw the diagram to a bitmap for the length of the flight.
- **Older copies of the library or CLI** that don't know `slide` will draw it as an unknown shape. Draw unknown kinds as nothing, and ship that first.

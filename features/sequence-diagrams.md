# Sequence diagrams

**Status:** in progress · **Priority:** high
**Summary:** A diagram can have sequences ("Checkout", "Sign in") whose participants are its own components. Each sequence is a classic sequence diagram drawn and edited next to the architecture, sharing its icons, names and docs.

## Why

Sequence diagrams are one of the most common diagrams engineers draw. Tools draw them apart from the architecture, so the two drift. In IsoDraw the participants *are* the architecture's components: rename a service and every sequence follows; open a step's participant and you're on the component with its docs.

## Decided (2026-11-02)

- **Flows on a diagram,** not a separate diagram type. Sequences belong to a diagram level (the top diagram or a component's detail diagram), and their participants are that level's components.
- **First version: the sequence view and its editor.** Lifelines, messages (call, async, return, self), activation bars and notes; adding, editing and reordering steps; docs on each sequence and step.
- **Later:** playing a sequence on the isometric diagram (packets along the real connections, step by step), fragments (alt / opt / loop / par), Mermaid import and export, MCP and CLI operations, sequences in published docs and preview pictures.

## Model

```ts
interface Sequence {
  id: string;
  title: string;
  /** Node ids on this level, left to right. */
  participants: string[];
  steps: SequenceStep[];
  doc?: string;
}

interface SequenceStep {
  id: string;
  /** call: a request that's answered (activates the receiver until its return); async: fire and forget; return: the answer; self: a call to itself; note: text over one or two participants. */
  kind: 'call' | 'async' | 'return' | 'self' | 'note';
  from: string;
  /** The receiver; for a note, the second participant it spans, if any. Unused for self. */
  to?: string;
  label?: string;
  doc?: string;
}
```

`Diagram.sequences?: Sequence[]`. Activation bars aren't stored: a call activates its receiver until the receiver's next return to it; self calls nest. Deleting a component removes it from sequences and drops their steps that involve it. Merging treats each sequence as one item, like a node.

## Where it stands

First version built 2026-11-02 (`sequences.ts`, `SequenceView.tsx`, `SequenceInspector.tsx`): sequences on any level, tabs over the canvas, the sequence view with activation bars, two-click messages, the Properties inspector, docs on sequences and steps, View mode, saving, parsing and merging.

Next, roughly in order:

1. Sequences in published docs, the docs site's table of contents, and Markdown export.
2. Playing a sequence on the isometric diagram, step by step.
3. Fragments (alt / opt / loop / par).
4. MCP and CLI: `addSequence`, `addStep` and friends in `apply_changes`, and sequences in `describe_diagram`.
5. Mermaid `sequenceDiagram` import and export.
6. Preview pictures and PNG/SVG export of a sequence.
7. Dragging steps to reorder, and a keyboard flow for adding many steps quickly.

## In the editor

- Tabs along the top of the canvas: **Diagram**, then each sequence, then **+ Sequence**. A sequence's tab shows the sequence view in place of the isometric canvas; the palette hides.
- Participants: added from the level's components (Properties), shown at the top with the component's own picture; reordered and removed there too.
- Steps: click a lifeline then another to add a call between them (the same one twice adds a self call); "Add step" adds one at the end. Selecting a step shows it in Properties: kind, from, to, label, move up or down, delete.
- Docs: the Docs tab shows the open sequence's doc, or the selected step's.
- View mode shows the sequences read-only.

# Live collaboration

**Status:** idea · **Priority:** later (deliberately deferred)
**Summary:** Several people editing one diagram at once, with presence and cursors.

## How it could work

- **Presence first:** show who else has the diagram open, and their selection, over a WebSocket. Cheap, and it makes concurrent saves less surprising.
- **Then live edits:** a CRDT (Yjs) for the diagram and the docs. Tiptap has Yjs support built in; the diagram would need a Yjs mapping of nodes and edges per level. The server relays and persists updates and keeps exporting the JSON document, so everything else (search, history, CLI) keeps working.
- Until then, autosave with item-level merging covers most real concurrency.

# Search across diagrams

**Status:** idea · **Priority:** next
**Summary:** Find any component, connection, doc text or Terraform address across all diagrams in a workspace.

## How it could work

- **An items index:** on every save the API writes one row per node and edge at every level (`diagram_id`, level path, item id, kind, title, doc text, Terraform address or cloud id, a `tsvector`). The diagram JSON stays the source of truth; the index is derived.
- **API:** `GET /api/orgs/{org}/search?q=` returns matches with the diagram, the level and a snippet.
- **App:** ⌘K opens search from anywhere; picking a result opens the diagram at that level with the item selected, or its docs page.
- **Uses beyond search:** the same index answers "which diagrams contain this database?", powers mentions across diagrams, and matches items during re-import and cloud sync.

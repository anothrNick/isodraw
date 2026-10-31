# Comments

**Status:** idea · **Priority:** next
**Summary:** Discussion threads attached to components, connections or the diagram, with @mentions of people and resolving.

## How it could work

- **Data:** `comments` (`diagram_id`, level path, item id or none for the diagram, author, Markdown body, `resolved_at`, thread parent).
- **In the editor:** a *Comments* tab in the sidebar beside Properties and Docs, for the selected item; a small count badge on items with open threads; a toggle to show all open threads.
- **Mentions:** @people notify them (email once hosting has email, an in-app inbox before that).
- **Items that disappear:** threads on deleted items stay visible under "on removed items" until resolved.
- **Viewers can comment,** so reviewers don't need edit access.

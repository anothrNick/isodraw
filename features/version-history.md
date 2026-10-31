# Version history

**Status:** idea · **Priority:** next
**Summary:** Keep snapshots of a diagram as it's edited, and let people look at and restore earlier versions.

## Why

Autosave writes over the diagram every second or so. Today there's no way back from a bad edit once the page is reloaded, or from an agent's change made through the CLI.

## How it could work

- **Snapshots:** a `revisions` table (`diagram_id`, `version`, `content`, `author`, `source` such as app, CLI or import, `created_at`). Saves less than about 5 minutes apart by the same person fold into one revision, so a session of edits is one entry, not hundreds.
- **Storage:** full snapshots at first; diagrams are tens to hundreds of KB. Switch to diffs only if storage grows.
- **History panel:** a list of revisions grouped by day, with author and source. Selecting one shows it read-only (canvas and docs) with what changed: items added, removed and changed.
- **Restore:** restoring saves the old content as a new version, so restoring is itself undoable.
- **Retention:** keep everything for 30 days, then one per day, then one per week. Tunable per plan.

## Open questions

- Show a visual diff on the canvas (added green, removed red), or just a list of changes?
- Restore a single item ("bring back this component") as well as the whole diagram?

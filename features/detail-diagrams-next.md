# Detail diagrams: next steps

**Status:** idea · **Priority:** later
**Summary:** The follow-ups to detail diagrams that make deep diagrams easier to work with.

- **Mentions across levels:** a component's doc can @mention items inside its own detail diagram, and any level's items. Links carry a level path (`isodraw:node/orders/validate/stock`); the picker groups items by level.
- **Expand in place:** show a component's detail diagram as an overlay on the parent canvas, read-only at first. Later, connection points: the detail marks which items face outward, so a parent connection into the component lands on the right item when expanded.
- **Extract into a component:** select items and turn them into a new component whose detail diagram holds them; connections crossing the selection become its connection points. *Inline* does the reverse.
- **Terraform modules as levels:** each module becomes a component with its resources inside.
- **Detail diagrams on connections:** for example a sequence diagram for "API → Queue".

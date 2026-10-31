# AI help in the editor

**Status:** idea · **Priority:** later
**Summary:** Use Claude inside the editor to draft docs, answer questions about a diagram, and make edits described in words.

- **Draft a doc:** for a selected component, write a starter doc from its type, settings (for example from Terraform) and connections. The author edits from there.
- **Ask the diagram:** "what depends on the orders database?", "what happens when an order is placed?", answered from the diagram and its docs, with links to the items.
- **Edit in words:** "add a Redis cache between the API and Postgres" becomes a proposed change shown on the canvas to accept or reject. It uses the same operations as the CLI's `apply`.
- **Shared setup with diagram-from-repo:** one place for the API key, per-workspace opt-in, usage limits and logging.

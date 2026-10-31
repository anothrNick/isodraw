# Terraform updates from CI

**Status:** idea · **Priority:** later
**Summary:** A CI step posts `terraform show -json` after each apply, and the linked diagram updates itself.

- Uses an **API token** (see the CLI write-up) scoped to one workspace.
- `isodraw import terraform plan.json --into <diagram>` in a pipeline, or a plain `curl` to an upload endpoint.
- The update merges with edits as in **Terraform re-import**, and is labeled in version history as coming from CI.
- A GitHub Action wrapping it is a small follow-up.

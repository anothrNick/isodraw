# Re-import Terraform with merge

**Status:** idea · **Priority:** later
**Summary:** Import a newer Terraform state into an existing diagram without losing your layout and docs.

## How it could work

- The diagram remembers that it came from Terraform (the source and the last imported version).
- A new import runs the normal importer, then merges three ways with `mergeDiagrams`: *base* is the last import, *mine* is the edited diagram, *theirs* is the new import. Moved components keep their positions and edited docs keep their text; new resources appear and deleted ones go.
- Item ids come from Terraform addresses, which are stable across imports, so matching is exact.
- A review dialog lists what will change (*3 added, 1 removed, 2 changed*) before applying.
- Pairs with **CI uploads** (posting state after each apply) and is the foundation for **cloud sync**.

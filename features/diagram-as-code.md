# Diagram as code: a schema, a linter and Mermaid import

**Status:** idea · **Priority:** next
**Summary:** A declarative file format for a diagram's structure (components, areas, connections, docs, detail levels; no coordinates), with a published JSON Schema, `describe`/`push` round trips in the CLI, an `isodraw lint` command for CI, and Mermaid import as an on-ramp.

## Why

Today there are three ways to describe a diagram, and none is something a person or agent writes as a whole:

- **The diagram JSON** is storage: coordinates, routing and styling.
- **`Op[]`** for `apply` ([ops.ts](../packages/cli/src/ops.ts)) is an *imperative* edit list: add this node, connect these.
- **`Outline`** ([describe.ts](../packages/cli/src/describe.ts)) is a *declarative* read model, but read-only and with docs cut to their first line.

What's missing is a declarative format that goes both ways: `describe` emits it, and the CLI accepts it, diffs it against the saved diagram and applies the difference. Because layout is the platform's job (`placed: 'auto'`), the format needs no coordinates. That's what makes Mermaid, D2 and Structurizr pleasant to write, and we already have it.

What it gets us:

- **Diagrams in the customer's repo.** An `architecture.isodraw.yaml` checked in, reviewed in pull requests and synced by CI. This is the input format [Diagram from a code repo](diagram-from-repo.md) and [Terraform updates from CI](ci-terraform-sync.md) need, and the repo keeps the history of the architecture.
- **Easier for agents.** Writing the target state is easier to get right than working out a sequence of ops. It's idempotent when re-run and uses fewer tokens.
- **One schema as the source of truth.** The same schema can generate the MCP tool schemas, validate `apply --file`, feed `isodraw guide`, and give autocomplete in editors through `$schema`. Today these are kept in step by hand.
- **Checks in CI.** [Architecture checks](architecture-checks.md) become lint rules that run on a pull request, before any UI exists for them.

## How it could work

### The format

YAML (or JSON), shaped like `Outline` plus full doc text, with nested levels for detail diagrams. Items are named by id; labels default to the id.

```yaml
# yaml-language-server: $schema=https://isodraw.app/schema/diagram-v1.json
title: Shop
doc: |
  # Shop
  The storefront and its order pipeline.
areas:
  vpc:
    label: Production VPC
    contains: [api, orders-db, cache]
components:
  web: { kind: icon, icon: isodraw:laptop, label: Storefront }
  api: { icon: aws_lambda_function, label: Orders API, doc: docs/orders-api.md }
  orders-db: { kind: cylinder, icon: aws_db_instance }
  cache: { icon: aws_elasticache_cluster, label: Redis }
connections:
  - web -> api: HTTPS
  - api -> orders-db: { label: SQL }
  - api -> cache: { style: dashed }
details:
  api:
    components:
      validate: { label: validate() }
      persist: { label: persist() }
    connections:
      - validate -> persist
```

- **Docs** inline or as a path to a Markdown file next to the YAML, so long docs stay readable in the repo.
- **Versioned** (`diagram-v1`) from the start, so the format can change without breaking files.
- **Presentation stays out:** colors and positions belong to the editor. A `color` field can come later if people ask.

### CLI

```text
isodraw describe <diagram> --format yaml [--full]   # the format, with full docs
isodraw push <file> [--into <diagram>] [--dry-run]  # diff the file against the saved diagram, apply as ops
isodraw lint <file | diagram> [--rules …] [--json]
isodraw import mermaid <file.md | file.mmd> [--into <diagram> | --title …]
```

- **`push` turns the diff into the existing `Op`s**, so it saves like `apply` does: `If-Match`, merge on conflict, `--dry-run` to preview. No second write path.
- **Who owns what:** the file owns *structure* (which components, areas, connections and docs exist). The editor owns *presentation* (positions, colors). An item missing from the file is removed only with `--prune`, so a person's additions in the editor aren't deleted by the next CI run.
- **Evidence:** an optional `source: docker-compose.yml:14` on items, which [Diagram from a code repo](diagram-from-repo.md) fills in.

### Schema

A Zod schema in the shared library, with JSON Schema generated from it and published at a stable URL. The same source generates the `Op` and MCP tool schemas, so the CLI, MCP and docs can't drift apart.

### Lint

Stable exit codes (0 clean, 1 findings at error level, 2 the file couldn't be read). Two kinds of rules:

- **Structural:** syntax and schema errors with line numbers; connections to items that don't exist; ambiguous labels; unknown icons; connections across levels; doc paths that don't exist; components with no doc or no connections (warnings).
- **Architecture:** the [Architecture checks](architecture-checks.md) rules: a database or cache in a public subnet, servers reached without a load balancer, a queue without a dead-letter queue, a single instance everything depends on.

Rules are configured in `.isodraw-lint.yaml` (enable, disable, severity, ignore with a reason), so teams can add their own later. `lint <diagram>` runs the same rules on a saved diagram, and the editor's *Checks* panel can later show the same findings.

### Mermaid import

Mermaid flowcharts are already in many READMEs. `import mermaid` maps `subgraph` to areas, nodes to components (shape to kind: `[( )]` to cylinder, and so on), and edges to connections with their labels and dashed style. It reads `.mmd` files or the ```` ```mermaid ```` blocks of a Markdown file. Other Mermaid diagram types (sequence, class) are skipped with a message.

Export to Mermaid is left out at first: it loses icons, docs and detail levels, and preview links already show a diagram on GitHub.

## Phases

1. **Schema and read:** the Zod schema, published JSON Schema, `describe --format yaml [--full]`.
2. **Write:** `push` with `--dry-run` and `--prune`, diffing into `Op`s. Doc files by path.
3. **Lint:** structural rules, exit codes, `--json`, the config file.
4. **Architecture rules** in lint, shared with [Architecture checks](architecture-checks.md).
5. **Mermaid import.**
6. **Generate the MCP and `Op` schemas** from the same source.

## Open questions

- **A terse syntax?** D2-style text (`api -> db: SQL`) is nicer to write than YAML, but it means a parser, error messages, an editor plugin and backward compatibility forever. Start with YAML and a schema, and only build a syntax if people ask for one.
- **Ids or labels as keys?** Ids keep renames from breaking connections; labels are friendlier. Ids, with labels defaulting to the id, seems the right trade.
- **Areas:** list members under the area (as above) or give each component an `in:` field? One should be canonical so `describe` output is stable.
- **One file or many** for big diagrams: should a detail level be able to live in its own file?
- **Does `push` label its versions** in [Version history](version-history.md) ("from CI, commit abc123")?

## Risks

- **Two sources of truth.** If a person edits in the editor and CI pushes the file, someone's change can be lost. The structure/presentation split, `--prune` being opt-in, and `mergeDiagrams` are the mitigations; the editor may also need a "this diagram is managed from a repo" notice.
- **Compatibility.** Once files are in customers' repos, the format can't change freely. Version it from day one.
- **Overlap with D2 and Structurizr.** The format is only worth having because of what's behind it (the editor, docs, detail levels, MCP); keep it small and don't try to compete as a general diagram language.

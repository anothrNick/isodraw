# CLI for people and AI agents

**Status:** in progress · **Priority:** high
**Summary:** An `isodraw` command line tool to list, read, create and change diagrams and their docs, designed so AI agents (Claude Code, Codex, ChatGPT through a connector) can work on a user's diagrams as reliably as a person: JSON output, item-level edits, safe concurrent saves.

## Why

People increasingly ask an assistant to do the work: "document the payments flow", "add the new Redis cache to the architecture diagram", "what talks to the orders database?". An assistant with a shell can do that today if IsoDraw has a CLI built for it. The same CLI serves people scripting their own workflows, and CI pipelines.

## How it could work

### Written in TypeScript, shipped on npm

All diagram logic already lives in the TypeScript library: `parseDiagram`, `mergeDiagrams`, the Terraform import, `exportDocsMarkdown`, detail levels, and (soon) the shared graph layout. A Node CLI uses it directly instead of porting it to Go. It ships as `packages/cli`, runs with `npx isodraw`, and needs nothing else installed.

### Commands

Everything takes `--json` for machine-readable output and `--org` to choose a workspace (default: the personal one).

```text
isodraw login | logout | whoami
isodraw orgs list

isodraw diagrams list
isodraw diagrams create --title "Shop" [--template serverless | --file diagram.json | --stdin]
isodraw diagrams get <diagram> [--format json | summary]
isodraw diagrams rename <diagram> <title>
isodraw diagrams delete <diagram> --yes

isodraw describe <diagram> [--level orders/validate]     # a compact text outline for reading
isodraw docs get <diagram> [--item <item>] [--level …]    # Markdown
isodraw docs set <diagram> [--item <item>] [--level …] --file doc.md | --stdin

isodraw nodes add <diagram> --label "Redis" --kind cylinder [--icon aws:…] [--in <area>] [--near <item>]
isodraw nodes update <diagram> <item> --label … --color …
isodraw nodes remove <diagram> <item>
isodraw edges add <diagram> <from> <to> [--label "SQL"] [--style dashed]
isodraw edges remove <diagram> <from> <to>
isodraw apply <diagram> --file changes.json [--dry-run]   # several changes as one save

isodraw import terraform <state.json> [--into <diagram> | --title …]
isodraw export <diagram> --format json | md
```

- **`describe` is the main way agents read diagrams.** The JSON has coordinates, colors and routing an agent doesn't need. `describe` prints the components (with areas and detail levels), connections and the outline of each doc, sized to fit in a prompt.
- **Items are addressed by id or by label.** `--item "orders-api"` matches a component's label; ambiguous matches fail with the candidates listed, so an agent can retry with an id. Detail levels use paths: `--level orders/validate`.
- **Agents don't place shapes.** `nodes add` without coordinates places the node next to what it connects to, inside its area, using the same layout the imports use.
- **`apply` batches changes** (add these three nodes, connect them, write their docs) into one save, with `--dry-run` to show what would change first.

### Saving safely

Every change is read → edit → `PUT` with `If-Match`. On a `409` the CLI merges with `mergeDiagrams` and retries, exactly like the web app, so an agent editing while a person has the diagram open never overwrites them. The person's open editor picks up the change on its next save.

### Sign-in

- **People:** `isodraw login` opens the browser to sign in as usual; the server issues a token and hands it back to the CLI on a localhost callback. Stored in the OS keychain (or a config file with `0600`).
- **Agents, scripts and CI:** a personal access token from the app's settings, passed as `ISODRAW_TOKEN`. Tokens have a name, a workspace, read-only or read-write scope, and an expiry, and can be revoked.

This needs **API tokens** on the backend: an `api_tokens` table (hashed, like sessions), `Authorization: Bearer` alongside the session cookie, and a settings page to create and revoke them. Requests made with a token skip the same-origin check, which only applies to cookies.

### Teaching agents to use it

- `isodraw guide` prints a short Markdown guide for agents: the concepts (workspaces, diagrams, items, detail levels, docs), the commands, and good patterns ("run `describe` first; use `apply` for related changes").
- The README links an `AGENTS.md` snippet people can paste into their projects.
- Errors are short, specific and say what to do next. Exit codes are stable: 0 OK, 1 usage, 2 not found, 3 conflict that couldn't merge, 4 not allowed.

### Chat apps: an MCP server on the same operations

Claude Desktop and ChatGPT reach tools through MCP, not a shell. After the CLI, the API can expose a remote MCP endpoint (`/mcp`, signed in with OAuth) offering the same operations as tools: `list_diagrams`, `describe_diagram`, `get_docs`, `set_docs`, `add_nodes`, `connect`, `apply_changes`. The CLI and MCP share one operations module, so behavior matches.

## Progress

- **Done:** API tokens (hashed, one workspace, read or write, browser-only management); `isodraw login` through the browser with a localhost callback, and a token settings page; read commands (`whoami`, `diagrams`, `describe`, `docs get`, `export`, `icons`); write commands (`diagrams create/rename/delete`, `docs set`, `nodes`, `edges`, `apply --dry-run`, `import terraform`) with automatic placement and merging on conflict; `isodraw guide` and a Claude Code skill in `.claude/skills/isodraw/`.
- **Seen in use:** an agent built a documented 7-component diagram with icons, an area and labeled connections in two commands.
- **Layout (done):** layout is the platform's job. Items the CLI or an import places are marked `placed: 'auto'`; a level made only of those is laid out again after every change; moving an item in the editor makes it manual and it is never moved automatically. `isodraw layout` and the editor's *Tidy up* lay out a whole level on request.
- **Next:**
  - Layout around manual items: today, once a level has any manual item, automatic layout only places new items beside what they connect to. Laying out all the auto items with the manual ones as fixed points would keep mixed levels tidy too.
  - The open editor doesn't show CLI changes until it saves (merging them) or reloads. Polling for a newer version, or a "changed elsewhere, reload" notice, would close that gap.
  - Publish to npm, and decide the name (see below).
  - Remote MCP for Claude Desktop and ChatGPT.

## Phases

1. **API tokens** on the backend, with a settings page.
2. **Read commands:** `login`, `orgs`, `diagrams list/get`, `describe`, `docs get`, `export`.
3. **Write commands:** `diagrams create/rename/delete`, `docs set`, `nodes`, `edges`, `apply` with merging on conflict, automatic placement.
4. **Agent polish:** `guide`, `AGENTS.md`, error and exit code review, tested end to end by having Claude Code do real tasks with it.
5. **Remote MCP** for Claude Desktop and ChatGPT.

## Open questions

- **Name and package:** `isodraw` on npm, or a scoped `@isodraw/cli`? The server binary is also called `isodraw` today; one of them should be renamed.
- **Placement quality:** is "next to what it connects to" good enough at first, or should adding several nodes re-run the layout for the level?
- **Undo for agents:** should changes made with a token be labeled in version history ("by Claude via CLI") so a person can roll them back? This leans on version history.
- **Rate limits** for token requests, so a looping agent can't hammer the API.

## Risks

- **An agent acting as the user can do anything the user can.** Mitigations: read-only tokens by default, `--yes` for deletes, tokens limited to one workspace, and labeled changes in history.
- **Prompt injection through docs.** Docs are user content and an agent reads them; an agent shouldn't follow instructions found inside a doc. `describe` and `docs get` can mark doc text as quoted content, and `isodraw guide` should say so.
- **Big diagrams overflow context.** `describe` summarizes by level, and `--level` narrows it.

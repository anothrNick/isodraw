# Diagram from a code repo

**Status:** idea · **Priority:** next
**Summary:** A GitHub Action keeps a repository's architecture diagram in step with its code. It runs in the customer's own CI: config files give the facts, an optional AI agent adds meaning, and the IsoDraw CLI saves the result. Pull requests get a comment with a picture of the architecture change.

## Why

Most teams have no up-to-date architecture diagram. Drawing one from scratch is the first problem; keeping it current is the second. The code already knows most of the answer: Compose files, Kubernetes manifests and Terraform list the components, and the code shows who calls whom. Starting from a generated diagram, and updating it as the code changes, removes both problems.

## What changed since the first write-up

The first version of this plan had IsoDraw's backend clone repositories, extract facts and call an AI model: a GitHub App, a job queue, customer code sent to an AI provider, and per-run cost caps, all before anyone saw a diagram. Since then we've built most of what an agent needs to do this work itself:

- **The CLI and API tokens:** `describe`, `apply`, `preview`, and token scopes per workspace.
- **The isodraw skill**, which teaches Claude to read and change diagrams through the CLI.
- **Layout is the platform's job:** agents name components and connections and never place shapes.
- **Preview links:** a signed SVG of a diagram that shows anywhere an image can, GitHub comments and READMEs included.
- **`mergeDiagrams`:** a three-way merge that keeps people's edits when a new version arrives.

So the work moves to **the customer's CI**, and the platform stays the place the diagram lives.

## How it could work

The principle stays: **deterministic extraction for facts, AI for meaning, our code for drawing.** Every component and connection carries the file and line it came from.

### 1. A GitHub Action: `isodraw/sync`

A composite Action that installs the CLI and runs in the repository's own workflow, with an `ISODRAW_TOKEN` secret (a write token scoped to one workspace).

```yaml
on:
  push: { branches: [main] }
  pull_request:
jobs:
  architecture:
    runs-on: ubuntu-latest
    permissions: { contents: read, pull-requests: write }
    steps:
      - uses: actions/checkout@v4
      - uses: isodraw/sync@v1
        with:
          token: ${{ secrets.ISODRAW_TOKEN }}
          diagram: shop-architecture       # created on the first run
          ai: claude                       # or "off"
          anthropic-key: ${{ secrets.ANTHROPIC_API_KEY }}
```

- **On push to main:** generate, merge with the saved diagram, save.
- **On a pull request:** generate without saving (`--dry-run`) and comment with what would change (see 4).
- **On demand:** `workflow_dispatch` for a first run or a full regenerate.

The code never leaves the customer's CI. They bring their own Anthropic key, or turn AI off.

### 2. Facts, without AI

Cheap, reliable and the same on every run. Each fact keeps its evidence (`docker-compose.yml:14`).

| Source | What it gives |
| --- | --- |
| Docker Compose | Services, `depends_on`, ports, images. Often the whole architecture of a small system. |
| Kubernetes / Helm | Deployments, Services, Ingresses: components and how traffic reaches them |
| Terraform HCL | Resources and their references, through the Terraform importer's catalog and linking |
| Serverless, SAM, CDK, CloudFormation | Functions and the events that trigger them |
| Dockerfiles, package files | Runtimes, and client libraries that imply dependencies (`pg`, `redis`, `@aws-sdk/client-sqs`, Kafka clients) |
| OpenAPI specs, `.env.example`, README | Interfaces, configuration names, the authors' own description |

This runs as a CLI command (`isodraw extract <dir>`), so it also works without the Action. With AI off, it is the whole result, and it's still useful.

### 3. Meaning, with AI (optional)

The Action runs an agent (Claude, through the Agent SDK or Claude Code in headless mode) with the isodraw skill, the extracted facts and read-only access to the checkout. The agent:

- adds connections the config doesn't state, from the code (`orders` publishes to `order-events`)
- names and groups things the way the team talks about them
- writes a doc for each component: what it does, its main files, how to run it
- applies everything in one `isodraw apply`

Rules the skill enforces: every claim needs evidence, or it is dropped; connections only the AI found are drawn **dashed** and their docs say "inferred", until someone confirms them.

### 4. Pull request comments

The part people will notice. On a PR, the Action builds the diagram as it would be after merging, compares it with the saved one, and posts (and later updates) one comment:

> **Architecture change**
> \+ 1 service (**billing**), + 2 connections (billing → Postgres, orders → billing), − 1 queue (**legacy-events**)
>
> *[preview image of the new diagram, with the changes highlighted]*
>
> [Open in IsoDraw](#) · generated from `a1b2c3d`

The image is a preview link, so it renders in the comment with no setup. Preview links today draw a *saved* diagram, and a PR's diagram isn't saved, so this needs **draft previews**: the Action uploads the proposed diagram as a draft attached to the real one (`POST /api/diagrams/{id}/drafts`), which expires after 30 days or when the PR closes, and the comment links the draft's picture. A later version can draw the changes in color (added green, removed red, changed amber).

### 5. The diagram remembers its source

Store `{ repo, path, commit }` on a generated diagram. The editor shows "Generated from `acme/shop` at `3f2a1c` · 4 commits behind" with links, and the docs link to files at that commit. Items keep their evidence, so a component's page can list "Defined in `deploy/k8s/orders.yaml:12`".

## Who owns the diagram after it's generated

Both: the Action owns what it found, people own what they changed.

- **Stable ids from evidence.** The Compose service `api` is always `api`; a Kubernetes Deployment is `k8s:<namespace>/<name>`. Re-runs find the same items.
- **Three-way merge on every sync.** *Base* is the last generated version, *mine* is the diagram as people edited it, *theirs* is the new generation. Layout, colors, docs and hand-added items survive; new services appear; removed ones go.
- **People's word wins.** Confirming an inferred connection makes it solid and keeps it. Deleting a generated item hides it on later runs instead of bringing it back.
- **Version history** labels each sync "from CI at `a1b2c3d`" (needs [Version history](version-history.md)).

## One diagram per repo, levels for monorepos

One diagram per repository. Its top level shows services, datastores, queues and what's outside (users, third-party APIs). In a monorepo, each service gets a **detail diagram** for its insides (handlers, workers, consumers), the C4-style drilling the editor and docs site already support.

## Phases

1. **Facts and PR comments, no AI.** `isodraw extract` for Compose, Kubernetes and Terraform HCL; the shared graph-to-diagram layer; the Action with push sync and the PR comment. On the server, only draft previews and storing the source. Shows the whole loop end to end before any AI is involved.
2. **AI meaning.** The agent step: inferred connections, grouping, generated docs. Top level only.
3. **Merge and ownership.** Stable ids, three-way merge on sync, confirm and hide, "commits behind".
4. **Monorepo depth.** Detail diagrams for each service's insides.
5. **GitHub App (later).** One-click setup instead of a secret per repo, webhooks, a check run instead of a comment. Worth it once teams use the Action.

## Open questions

- **AI in the Action:** Agent SDK script, Claude Code headless, or both? Which model by default, and how is cost capped per run?
- **First run on a big repo:** generate everything at once, or start from the facts and let the agent fill in one area at a time?
- **Comment noise:** comment on every PR, or only when the architecture changes? A label to skip it?
- **Where generated diagrams live:** a workspace per repo, or one shared workspace with a diagram per repo?
- **Other CI:** GitLab and Bitbucket can run the same CLI commands; worth packaging for them too?

## Risks

- **Accuracy.** Made-up connections are the main danger. Required evidence, dashed inferred items, and the PR comment (a person sees every change before it merges) cover most of it.
- **Privacy.** Much lower than the server-side plan: code stays in the customer's CI and goes to the AI provider only with their own key. Diagrams and docs still reach IsoDraw, and docs can quote code; the Action should say so and allow a no-docs mode.
- **Churn.** If each run reorders or renames things, people stop trusting it. Stable ids, deterministic extraction first and the merge are what prevent that.
- **Code is intent, not reality.** What's deployed can differ. [Terraform updates from CI](ci-terraform-sync.md) and [live cloud sync](cloud-sync.md) later show both, and where they disagree.

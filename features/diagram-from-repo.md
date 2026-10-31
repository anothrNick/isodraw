# Diagram from a code repo

**Status:** idea
**Summary:** Point IsoDraw at a repository and get a documented architecture diagram: services, datastores, queues and how they connect, with docs that link back to the code. Config files give the facts, AI adds what the code means, and IsoDraw's own layout draws it.

## Why

Most teams have no up-to-date architecture diagram, and drawing one from scratch is the main reason. The code already knows most of the answer: compose files, Kubernetes manifests and Terraform list the components, and the code shows who calls whom. Starting from a generated diagram, and keeping it in step as the code changes, removes the blank-canvas problem and the drift problem together.

## How it could work

The principle: **deterministic extraction for facts, AI for meaning, our code for drawing.** The AI never places shapes; it returns a structured list of components and connections, and every claim must point at the file and line it came from.

### 1. Get the code

- **First version:** upload a zip. No setup.
- **Proper version:** a GitHub App with read-only access to repo contents. It also brings push webhooks, which keeping diagrams in sync needs (phase 3).
- Clone shallowly in a background job. Skip vendored and generated paths (`node_modules`, `vendor`, `dist`, lockfiles) and anything `.gitignore` excludes.

### 2. Extract facts, without AI

Cheap and reliable. Each fact keeps its evidence (`docker-compose.yml:14`).

| Source | What it gives |
| --- | --- |
| Docker Compose | Services, `depends_on`, ports, images. Often the whole architecture of a small system. |
| Kubernetes / Helm | Deployments, Services, Ingresses, ConfigMaps: components, how traffic reaches them, configuration |
| Terraform HCL | Resources and their references. The existing importer's catalog and linking handle most of it, from code instead of state. |
| Serverless, SAM, CDK, CloudFormation | Functions and the events that trigger them |
| Dockerfiles, package files | Runtimes, and clients that imply dependencies (`pg`, `redis`, `@aws-sdk/client-sqs`, Kafka clients) |
| OpenAPI specs, `.env.example`, README | Interfaces, configuration names, the authors' own description |

### 3. Add meaning, with AI

Claude gets the file tree and the facts, plus tools to read files and search code within a token budget, so it fetches only what it needs. It answers through a strict schema:

- **components:** name, kind, technology, responsibilities, evidence
- **connections:** from, to, protocol, label, evidence
- **groups:** boundaries such as a VPC, a namespace, or a service
- **docs:** a Markdown summary per component

Claims without evidence are dropped. Connections the AI inferred but no config confirms are drawn dashed and say "inferred" in their docs, so it's clear what to check.

### 4. Draw it

Kinds map to the icon catalog; the layout reuses the Terraform import's column layout, which moves into a shared "graph to diagram" step that both imports use. Docs link to the exact files at the analyzed commit.

### 5. Review

The result opens as a proposal with a summary (*14 components, 3 inferred connections*). After that it's an ordinary diagram to edit.

## How it fits what exists

- **Detail diagrams fit monorepos (the C4 model).** The top level shows services and datastores; each service's detail diagram shows its parts (handlers, modules, consumers). Readers drill from system to service to internals.
- **`mergeDiagrams` makes re-syncing safe.** On a new commit, regenerate and merge three ways: *base* is the last generated version, *mine* is the edited diagram, *theirs* is the new generation. Layout and doc edits survive and new services appear. This needs stable ids derived from evidence (the compose service `api` keeps the same id across runs).
- **It runs as a backend job.** A job queue (River on Postgres) runs the pipeline, progress streams to the app, and the AI step calls the Anthropic API through the official Go SDK. Results are cached per commit, so re-running the same commit is free.

## Phases

1. **No AI:** zip upload; extract Compose, Kubernetes and Terraform HCL; draw. Useful on its own, deterministic, and builds the shared graph-to-diagram layer.
2. **AI for meaning:** services and connections from code, inferred edges, generated docs. Top level only.
3. **GitHub App and sync:** connect a repo, regenerate on push, merge with edits.
4. **Monorepo depth:** detail diagrams for each service's internals.

## Open questions

- **Source:** zip upload first, or straight to the GitHub App?
- **AI provider:** is sending customer code to Anthropic's API acceptable with org opt-in? Is a no-AI mode needed from day one (self-hosters, cautious customers)?
- **First target:** the top level only (services, datastores, queues), or also the inside of a service?
- **Where the source lives:** should a diagram remember its repo and commit, and show when it's out of date?

## Risks

- **Privacy.** Code goes to an AI provider. Needs per-organization opt-in, secrets stripped before sending (`.env`, keys, certificates), no code kept after the job, and for self-hosting a bring-your-own key or no AI at all.
- **Accuracy.** Made-up connections are the main danger. Required evidence, dashed inferred edges and the review step cover most of it.
- **Cost on large repos.** Deterministic extraction first and on-demand file reads keep a run to tens of thousands of tokens rather than the whole repo; still needs a hard cap per run.
- **Code is intent, not reality.** What's deployed can differ. Combining with Terraform state or cloud sync later shows both.

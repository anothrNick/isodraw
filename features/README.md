# Features

Write-ups of features we want to build: what they are, how they could work, and what's still undecided. One Markdown file per feature. A write-up is a starting point for discussion, not a spec; it changes as decisions are made.

## Writing one

Start each file with a short header, then whichever of these sections help:

```markdown
# Feature name

**Status:** idea · planned · in progress · shipped · **Priority:** high · next · later (the index shows status for shipped items)
**Summary:** one or two sentences.

## Why
## How it could work
## Phases
## Open questions
## Risks
```

Keep the status and priority current, and record decisions in the file as they're made, so it stays the place to look.

## Index

| Priority | Feature | Summary |
| --- | --- | --- |
| high · in progress | [CLI for people and AI agents](cli.md) | A command line tool built for Claude, ChatGPT and scripts to read and change diagrams and docs. |
| high · planned | [MCP server](mcp-server.md) | IsoDraw as a connector in Claude, ChatGPT and Cursor: read, draw and document diagrams in plain words, with pictures in the chat. |
| next | [Diagram from a code repo](diagram-from-repo.md) | A GitHub Action in the customer's CI keeps a repo's diagram in step with its code, and comments on PRs with the architecture change. |
| next | [Version history](version-history.md) | Snapshots as autosave runs, a History panel, and restore. |
| next | [Share links](share-links.md) | Read-only public links to a diagram's docs page, with expiry and revoke. |
| next | [Image storage](image-storage.md) | Uploaded images move out of the diagram JSON into an asset store. |
| shipped | [Hosting](hosting.md) | One container on Fly.io with Postgres, S3, Cognito in Terraform and email; the same image for self-hosting. |
| next | [Search across diagrams](search.md) | Find components, docs and Terraform addresses across a workspace, from an items index. |
| next | [Comments](comments.md) | Threads on components and connections, with @mentions and resolving. |
| next | [Cost estimates](cost-estimates.md) | Monthly cost per component and totals, from public cloud price lists. |
| later | [Re-import Terraform with merge](terraform-reimport.md) | A newer state updates a diagram without losing layout and docs. |
| later | [Terraform updates from CI](ci-terraform-sync.md) | A CI step posts state after each apply and the diagram follows. |
| later | [Live cloud sync](cloud-sync.md) | Diagrams from what's running in AWS, GCP and Azure, with drift from Terraform. |
| later | [Detail diagrams: next steps](detail-diagrams-next.md) | Mentions across levels, expand in place, extract into a component, modules as levels. |
| later | [AI help in the editor](ai-in-editor.md) | Draft docs, ask the diagram questions, edit in words. |
| later | [Architecture checks](architecture-checks.md) | Flag databases in public subnets, single points of failure and similar. |
| later | [Embeds](embeds.md) | Live read-only diagrams in Notion, Confluence and READMEs. |
| later | [Organization templates](org-templates.md) | Save a diagram as a template for the team. |
| later | [Audit log and SSO enforcement](audit-and-sso.md) | Who did what, and requiring company sign-in. |
| later | [Live collaboration](live-collaboration.md) | Presence, then simultaneous editing with Yjs. |
| later | [Small cleanups](small-cleanups.md) | Editor chunk, import card, export of detail docs, the shadcn CLI alias, demo redeploy. |

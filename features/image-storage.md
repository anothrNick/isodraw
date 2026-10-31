# Image storage

**Status:** idea · **Priority:** next
**Summary:** Move uploaded images out of the diagram JSON into an asset store, so diagrams stay small and images can be reused.

## Why

Images uploaded in the editor are stored as `data:` URLs inside the diagram. A few screenshots reach the 5 MB content limit, every save resends them, and the same logo is stored once per diagram.

## How it could work

- **Storage interface** in the API with two backends: files on disk (local development and single-server self-hosting) and S3 (hosted, or any S3-compatible service).
- **Upload:** the app asks the API for an upload (`POST /api/orgs/{org}/assets`), sends the file (directly to S3 with a presigned URL when hosted), and gets back a URL like `/assets/<id>`. Assets are deduplicated by content hash per workspace.
- **Serving:** `/assets/<id>` checks the viewer can read a diagram in that workspace (or a share link that includes it), and sets long cache headers since content never changes.
- **Migration:** on save, the API (or the app before saving) uploads any `data:` images it finds and rewrites the node's `src`.
- **The library** gets an `onUploadImage(file) → url` prop, so other hosts can store images their own way; without it, it keeps using `data:` URLs.

## Open questions

- Clean up assets no diagram uses any more (garbage collection), or keep them for version history?
- Limits per file and per workspace.

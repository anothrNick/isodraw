# Small cleanups

**Status:** idea · **Priority:** later
**Summary:** Small improvements worth doing when nearby.

- **Load the editor on demand:** the editor, Tiptap and the icon loaders are in the app's main bundle (over Vite's 500 KB warning). Load the editor page as its own chunk.
- **Import a file when creating:** an *Import file* card in the new-diagram dialog for IsoDraw JSON and Terraform state or plan files.
- **Detail diagrams in the Markdown export:** nest each component's detail diagram docs under it.
- **shadcn CLI:** it misreads the `@/` alias and installs an unrelated `cn` package each time a component is added. Find the cause in `components.json` or `tsconfig.json`.
- **Redeploy the demo** after the React 19 move.

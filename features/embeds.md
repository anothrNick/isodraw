# Embeds

**Status:** idea · **Priority:** later
**Summary:** Put a live, read-only diagram into Notion, Confluence, a README or any web page.

- **Iframe embed:** `/embed/<token>` shows just the diagram (pan and zoom, click a component to see its doc), using a share link's token.
- **Image embed:** `/embed/<token>.svg` or `.png` for places that only take images, such as READMEs; it re-renders when the diagram changes, with cache headers.
- **oEmbed** so Notion and others recognize pasted links.

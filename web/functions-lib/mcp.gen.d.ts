// Types for mcp.gen.js, which `npm run build:mcp` bundles from packages/cli/src/mcpHttp.ts.
export function handleMcp(request: Request, opts: { apiOrigin: string; fetch?: typeof fetch }): Promise<Response>;

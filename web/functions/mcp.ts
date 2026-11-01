import { handleMcp } from '../functions-lib/mcp.gen.js';
import type { Context } from '../functions-lib/proxy';

/**
 * /mcp — IsoDraw's MCP server for AI apps (Claude connectors, ChatGPT, …),
 * from packages/cli/src/mcpHttp.ts. Apps sign in with OAuth (the API's
 * /oauth endpoints); tools call the API on Fly with the token they get.
 */
export const onRequest = ({ request, env }: Context) => {
  if (!env.API_ORIGIN) return new Response('API_ORIGIN is not set on this Pages project.', { status: 500 });
  return handleMcp(request, { apiOrigin: env.API_ORIGIN });
};

import { proxy, type Context } from '../../functions-lib/proxy';

// OAuth discovery for /mcp (oauth-protected-resource, oauth-authorization-server), answered by the API.
export const onRequest = (ctx: Context) => {
  if (!new URL(ctx.request.url).pathname.startsWith('/.well-known/oauth-')) return new Response('Not found', { status: 404 });
  return proxy(ctx);
};

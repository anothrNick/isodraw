import { proxy, type Context } from '../../functions-lib/proxy';

// OAuth for AI apps connecting to /mcp: registration, authorize, token (on the API).
export const onRequest = (ctx: Context) => proxy(ctx);

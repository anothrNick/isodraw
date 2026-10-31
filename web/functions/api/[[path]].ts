import { proxy, type Context } from '../../functions-lib/proxy';

export const onRequest = (ctx: Context) => proxy(ctx);

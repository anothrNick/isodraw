import { proxy, type Context } from '../../functions-lib/proxy';

/**
 * GET /i/{token}.{ext} — an uploaded workspace image, from the API. A link
 * never changes what it points at, so answers are kept in Cloudflare's edge
 * cache and most views never reach the API.
 */
export const onRequestGet = async (ctx: Context & { waitUntil: (p: Promise<unknown>) => void }): Promise<Response> => {
  const cache = (caches as unknown as { default: Cache }).default;
  const hit = await cache.match(ctx.request);
  if (hit) return hit;
  const res = await proxy(ctx);
  if (res.status === 200) ctx.waitUntil(cache.put(ctx.request, res.clone()));
  return res;
};

import type { Env } from '../../functions-lib/proxy';
import { previewHeaders, previewSvg } from '../../functions-lib/preview.gen.js';

/**
 * GET /p/{id}.svg?l=&e=&s=[&theme=dark] — a preview link's picture, drawn with
 * the app's own renderer (web/preview/render.ts), icons inlined, so it shows
 * anywhere an image can: chat, Markdown, an <img>.
 */
interface PagesContext {
  request: Request;
  env: Env;
  waitUntil: (p: Promise<unknown>) => void;
}

export const onRequestGet = async ({ request, env, waitUntil }: PagesContext): Promise<Response> => {
  const cache = (caches as unknown as { default: Cache }).default;
  const hit = await cache.match(request);
  if (hit) return hit;
  // Icons come from public CDNs; keep them at Cloudflare's edge for a day.
  const getImage = (u: string) => fetch(u, { cf: { cacheEverything: true, cacheTtl: 86400 } } as RequestInit);
  const { status, svg, cacheable } = await previewSvg(new URL(request.url), env.API_ORIGIN, getImage);
  const res = new Response(svg, { status, headers: previewHeaders(cacheable) });
  if (cacheable) waitUntil(cache.put(request, res.clone()));
  return res;
};

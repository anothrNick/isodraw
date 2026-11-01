import type { Env } from '../../functions-lib/proxy';
import { previewImage, rasterizer, type PreviewStore } from '../../functions-lib/preview.gen.js';
// Copied from node_modules by `npm run build:preview`; Cloudflare loads .wasm as a module and .bin as bytes.
import resvg from '../../functions-lib/resvg.wasm';
import inter400 from '../../functions-lib/inter-400.bin';
import inter600 from '../../functions-lib/inter-600.bin';
import inter700 from '../../functions-lib/inter-700.bin';

/**
 * GET /p/{id}.svg or /p/{id}.png ?l=&e=&s=[&theme=dark][&size=thumb] — a
 * preview link's picture, drawn with the app's own renderer
 * (web/preview/render.ts), icons inlined, so it shows anywhere an image can:
 * chat, Markdown, an <img>. The PNG is the same picture, for apps that don't
 * show SVG. Each version of a diagram is drawn once and kept in R2 (the
 * PREVIEWS bucket, emptied by a lifecycle rule); the edge cache sits in front.
 */
interface PagesContext {
  request: Request;
  env: Env;
  waitUntil: (p: Promise<unknown>) => void;
}

const toPng = rasterizer(resvg, [inter400, inter600, inter700].map((b) => new Uint8Array(b)));

function r2Store(bucket: NonNullable<Env['PREVIEWS']>): PreviewStore {
  return {
    async get(key) {
      const o = await bucket.get(key);
      return o ? new Uint8Array(await o.arrayBuffer()) : null;
    },
    async put(key, body, contentType) {
      await bucket.put(key, body, { httpMetadata: { contentType } });
    },
  };
}

export const onRequestGet = async ({ request, env, waitUntil }: PagesContext): Promise<Response> => {
  const cache = (caches as unknown as { default: Cache }).default;
  const hit = await cache.match(request);
  if (hit) return hit;
  // Icons come from public CDNs; keep them at Cloudflare's edge for a day.
  const getImage = (u: string) => fetch(u, { cf: { cacheEverything: true, cacheTtl: 86400 } } as RequestInit);
  const out = await previewImage(new URL(request.url), env.API_ORIGIN, {
    getImage,
    toPng,
    store: env.PREVIEWS ? r2Store(env.PREVIEWS) : undefined,
    waitUntil,
  });
  const res = new Response(out.body as BodyInit, { status: out.status, headers: out.headers });
  if (out.status === 200) waitUntil(cache.put(request, res.clone()));
  return res;
};

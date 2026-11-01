import type { Env } from '../../functions-lib/proxy';
import { previewHeaders, previewSvg, rasterizer, wantsPng } from '../../functions-lib/preview.gen.js';
// Copied from node_modules by `npm run build:preview`; Cloudflare loads .wasm as a module and .bin as bytes.
import resvg from '../../functions-lib/resvg.wasm';
import inter400 from '../../functions-lib/inter-400.bin';
import inter600 from '../../functions-lib/inter-600.bin';
import inter700 from '../../functions-lib/inter-700.bin';

/**
 * GET /p/{id}.svg or /p/{id}.png ?l=&e=&s=[&theme=dark] — a preview link's
 * picture, drawn with the app's own renderer (web/preview/render.ts), icons
 * inlined, so it shows anywhere an image can: chat, Markdown, an <img>. The
 * PNG is the same picture, for apps that don't show SVG.
 */
interface PagesContext {
  request: Request;
  env: Env;
  waitUntil: (p: Promise<unknown>) => void;
}

const toPng = rasterizer(resvg, [inter400, inter600, inter700].map((b) => new Uint8Array(b)));

export const onRequestGet = async ({ request, env, waitUntil }: PagesContext): Promise<Response> => {
  const cache = (caches as unknown as { default: Cache }).default;
  const hit = await cache.match(request);
  if (hit) return hit;
  // Icons come from public CDNs; keep them at Cloudflare's edge for a day.
  const getImage = (u: string) => fetch(u, { cf: { cacheEverything: true, cacheTtl: 86400 } } as RequestInit);
  const url = new URL(request.url);
  const { status, svg, cacheable } = await previewSvg(url, env.API_ORIGIN, getImage);
  const png = wantsPng(url);
  const body: BodyInit = png ? ((await toPng(svg)) as Uint8Array<ArrayBuffer>) : svg;
  const res = new Response(body, { status, headers: previewHeaders(cacheable, png ? 'png' : 'svg') });
  if (cacheable) waitUntil(cache.put(request, res.clone()));
  return res;
};

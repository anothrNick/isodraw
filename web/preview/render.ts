/**
 * Draws a diagram as a standalone SVG file, on the server: the /p/{id}.svg
 * Pages Function uses it for preview links. It reuses the library's
 * StaticDiagram, so a preview looks like the diagram in the app.
 *
 * `npm run build:preview` bundles this (with React and the library) into
 * functions-lib/preview.gen.js, which the function imports.
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticDiagram } from '../../packages/isodraw/src/lib/render';
import { parseDiagram } from '../../packages/isodraw/src/lib/shapes';
import { CANVAS_BG, ThemeContext, type ResolvedTheme } from '../../packages/isodraw/src/lib/theme';

const SVG_NS = 'http://www.w3.org/2000/svg';
const FONT = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';

export type PreviewTheme = ResolvedTheme;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The diagram as an SVG document, with a background so it reads on any page. */
export function renderSvg(content: unknown, opts: { title?: string; theme?: PreviewTheme } = {}): string {
  const theme = opts.theme ?? 'light';
  const diagram = parseDiagram(content);
  const markup = renderToStaticMarkup(
    createElement(ThemeContext.Provider, { value: theme }, createElement(StaticDiagram, { diagram, animate: false, label: opts.title })),
  );
  // StaticDiagram draws for a page (width 100%, inline styles); give the file its own size instead.
  const open = /^<svg[^>]*>/.exec(markup);
  const viewBox = /viewBox="([^"]+)"/.exec(open?.[0] ?? '')?.[1];
  if (!open || !viewBox) throw new Error('unexpected StaticDiagram output');
  const [x, y, w, h] = viewBox.split(/\s+/).map(Number);
  const inner = markup.slice(open[0].length, -'</svg>'.length);
  const title = opts.title ? `<title>${esc(opts.title)}</title>` : '';
  return (
    `<svg xmlns="${SVG_NS}" viewBox="${viewBox}" width="${Math.ceil(w)}" height="${Math.ceil(h)}" role="img" aria-label="${esc(opts.title ?? 'Architecture diagram')}" font-family="${FONT}">` +
    title +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${CANVAS_BG[theme]}"/>` +
    inner +
    '</svg>'
  );
}

/** A small picture with a message, for links that no longer work. */
export function messageSvg(heading: string, detail: string, theme: PreviewTheme = 'light'): string {
  const dark = theme === 'dark';
  return (
    `<svg xmlns="${SVG_NS}" viewBox="0 0 480 140" width="480" height="140" role="img" aria-label="${esc(heading)}" font-family="${FONT}">` +
    `<rect width="480" height="140" rx="12" fill="${CANVAS_BG[theme]}" stroke="${dark ? '#1f2a3d' : '#dbe3ee'}"/>` +
    `<text x="240" y="64" text-anchor="middle" font-size="18" font-weight="600" fill="${dark ? '#e2e8f0' : '#0f172a'}">${esc(heading)}</text>` +
    `<text x="240" y="92" text-anchor="middle" font-size="13" fill="${dark ? '#94a3b8' : '#64748b'}">${esc(detail)}</text>` +
    '</svg>'
  );
}

const MAX_IMAGES = 40; // Workers allow 50 subrequests per request; one goes to the API.
const MAX_IMAGE_BYTES = 1_000_000;

/**
 * An SVG shown as an image (<img>, Markdown ![]()) loads nothing else, so
 * fetch every icon and put it inside as a data: URL. Icons that can't be
 * fetched keep their URL (they show when the SVG is opened directly).
 */
export async function inlineImages(svg: string, base: string, get: (url: string) => Promise<Response> = fetch): Promise<string> {
  const hrefs = [...new Set([...svg.matchAll(/<image\b[^>]*?\shref="([^"]+)"/g)].map((m) => m[1]))].filter((h) => !h.startsWith('data:'));
  const found = new Map<string, string>();
  await Promise.all(
    hrefs.slice(0, MAX_IMAGES).map(async (href) => {
      try {
        const url = new URL(href.replace(/&amp;/g, '&'), base);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
        const res = await get(url.toString());
        if (!res.ok) return;
        const bytes = new Uint8Array(await res.arrayBuffer());
        if (bytes.length > MAX_IMAGE_BYTES) return;
        let type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
        if (!type.startsWith('image/')) type = url.pathname.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
        found.set(href, `data:${type};base64,${toBase64(bytes)}`);
      } catch {
        /* keep the URL */
      }
    }),
  );
  return svg.replace(/(<image\b[^>]*?\shref=")([^"]+)"/g, (all, pre: string, href: string) => (found.has(href) ? `${pre}${found.get(href)}"` : all));
}

const MESSAGES: Record<number, [string, string]> = {
  403: ['Preview link not valid', 'Ask for a new link to this diagram.'],
  404: ['Diagram not found', 'It was deleted, or that part of it is gone.'],
  410: ['Preview link expired', 'Ask for a new link to this diagram.'],
};

/** Where finished pictures are kept, keyed by diagram version: R2 in production, memory in development. */
export interface PreviewStore {
  get(key: string): Promise<Uint8Array | null>;
  put(key: string, body: Uint8Array, contentType: string): Promise<void>;
}

/** Thumbnails for the app's grid of diagrams: small PNGs. */
const THUMB_WIDTH = 640;

export interface PreviewOptions {
  /** Fetches icons to inline (Workers pass one that caches them at the edge). */
  getImage?: (url: string) => Promise<Response>;
  /** SVG to PNG; without one, PNG requests are answered with an error picture. */
  toPng?: (svg: string, width?: number) => Promise<Uint8Array>;
  store?: PreviewStore;
  /** Lets a store write finish after the answer is sent. */
  waitUntil?: (p: Promise<unknown>) => void;
}

export interface PreviewAnswer {
  status: number;
  body: string | Uint8Array;
  headers: Record<string, string>;
}

const encoder = new TextEncoder();

/**
 * Answer GET /p/{id}.svg or .png ?l=&e=&s=[&theme=dark][&size=thumb][&v=]:
 * ask the API for the level the signed link names (it checks the signature,
 * leaves out docs, and says which version of the diagram it is). A picture of
 * that version already in the store is sent as is; otherwise it's drawn, its
 * icons inlined, rasterized for PNG, and kept in the store. So each version
 * of a diagram is drawn once per size, theme and format, however many links
 * and viewers there are. Links that don't work get a picture saying why.
 */
export async function previewImage(requestUrl: URL, apiOrigin: string, opts: PreviewOptions = {}): Promise<PreviewAnswer> {
  const theme: PreviewTheme = requestUrl.searchParams.get('theme') === 'dark' ? 'dark' : 'light';
  const thumb = requestUrl.searchParams.get('size') === 'thumb';
  const m = /^\/p\/([^/]+)\.(svg|png)$/.exec(requestUrl.pathname);
  const format = (m?.[2] ?? 'svg') as 'svg' | 'png';
  const send = (status: number, svg: string, cacheable: boolean, versioned = false): Promise<PreviewAnswer> =>
    format === 'png' && opts.toPng
      ? opts.toPng(svg, thumb ? THUMB_WIDTH : undefined).then((png) => ({ status, body: png, headers: previewHeaders(cacheable, 'png', versioned) }))
      : Promise.resolve({ status, body: svg, headers: previewHeaders(cacheable, format === 'png' ? 'png' : 'svg', versioned) });
  const fail = (status: number) => {
    const [heading, detail] = MESSAGES[status] ?? ['Preview unavailable', 'Try again in a moment.'];
    return send(status, messageSvg(heading, detail, theme), false);
  };
  if (!m) return fail(404);
  const id = decodeURIComponent(m[1]);
  const api = new URL(`/public/previews/${encodeURIComponent(id)}`, apiOrigin);
  for (const k of ['l', 'e', 's']) {
    const v = requestUrl.searchParams.get(k);
    if (v !== null) api.searchParams.set(k, v);
  }
  let res: Response;
  try {
    res = await fetch(api);
  } catch {
    return fail(502);
  }
  if (!res.ok) return fail(res.status in MESSAGES ? res.status : 502);
  const { title, diagram, version } = (await res.json()) as { title: string; diagram: unknown; version?: number };
  // A link naming the version it was made for can be kept by browsers; the list hands out a new one after edits.
  const versioned = requestUrl.searchParams.get('v') !== null;

  const level = requestUrl.searchParams.get('l') ?? '';
  const key =
    opts.store && typeof version === 'number'
      ? `previews/${id}/v${version}/${level ? encodeURIComponent(level) : '_'}/${theme}-${thumb ? 'thumb' : 'full'}.${format}`
      : null;
  if (key && (format === 'svg' || opts.toPng)) {
    const kept = await opts.store!.get(key).catch(() => null);
    if (kept) {
      const headers = { ...previewHeaders(true, format, versioned), 'X-Preview': 'stored' };
      return { status: 200, body: format === 'svg' ? new TextDecoder().decode(kept) : kept, headers };
    }
  }

  let svg: string;
  try {
    svg = await inlineImages(renderSvg(diagram, { title, theme }), requestUrl.origin, opts.getImage);
  } catch {
    return send(500, messageSvg('Preview unavailable', "This diagram couldn't be drawn.", theme), false);
  }
  const answer = await send(200, svg, true, versioned);
  if (key && opts.store && answer.status === 200 && (format === 'svg' || opts.toPng)) {
    const bytes = typeof answer.body === 'string' ? encoder.encode(answer.body) : answer.body;
    const saving = opts.store.put(key, bytes, answer.headers['Content-Type']).catch(() => undefined);
    if (opts.waitUntil) opts.waitUntil(saving);
    else await saving;
  }
  return { ...answer, headers: { ...answer.headers, 'X-Preview': 'drawn' } };
}

/**
 * Headers for a preview picture: an image, nothing active in it. Versioned
 * links (the app's thumbnails) can be kept for a day; others for a minute,
 * so edits show up soon.
 */
export function previewHeaders(cacheable: boolean, type: 'svg' | 'png' = 'svg', versioned = false): Record<string, string> {
  return {
    'Content-Type': type === 'png' ? 'image/png' : 'image/svg+xml; charset=utf-8',
    'Cache-Control': !cacheable ? 'no-store' : versioned ? 'public, max-age=86400' : 'public, max-age=60',
    'Content-Security-Policy': "default-src 'none'; img-src data:; style-src 'unsafe-inline'",
    'X-Content-Type-Options': 'nosniff',
  };
}

function toBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export { pngWidth, rasterizer } from './raster';

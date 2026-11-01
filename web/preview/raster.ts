/**
 * SVG to PNG for preview links (`/p/{id}.png`), for chat apps that show PNG
 * but not SVG. resvg runs as WebAssembly, so it works in a Pages Function and
 * in Node alike. Workers have no system fonts, so Inter (the font the
 * pictures use) comes along as font files.
 */
import { initWasm, Resvg } from '@resvg/resvg-wasm';

let ready: Promise<void> | null = null;

/**
 * Rendering time in Workers, in ms per megapixel: the picture itself, and each
 * embedded icon (cheap, since icons are drawn first as small PNGs). Measured
 * on resvg with real diagrams in Node and multiplied by 5, since Workers run
 * it several times slower and vary.
 */
const MS_PER_MP = 275;
const MS_PER_MP_PER_ICON = 10;
/** Keep a render well inside the Workers CPU limit. */
const BUDGET_MS = 700;

/**
 * How wide to draw the PNG: up to twice the picture's own width for sharp text,
 * as large as the time budget allows, and never under 600 px.
 */
export function pngWidth(svg: string): number {
  const open = /^<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
  const w = Number(/\swidth="(\d+(?:\.\d+)?)"/.exec(open)?.[1] ?? 800);
  const h = Number(/\sheight="(\d+(?:\.\d+)?)"/.exec(open)?.[1] ?? w * 0.6);
  const icons = (svg.match(/<image\b/g) ?? []).length;
  const megapixels = BUDGET_MS / (MS_PER_MP + MS_PER_MP_PER_ICON * icons);
  const affordable = Math.sqrt((megapixels * 1e6 * w) / h);
  return Math.round(Math.max(600, Math.min(2400, w * 2, affordable)));
}

/** Icons are drawn a little larger than their place in the picture, for transforms and nested scaling. */
const ICON_OVERSAMPLE = 1.5;

const fromBase64 = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
function toBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

/**
 * Embedded SVG icons as PNGs at about the size they're drawn. resvg composites
 * each embedded SVG on a layer the size of the whole picture, so with a dozen
 * icons that's most of the time; drawing them small first is 4-6x faster.
 */
function flattenIcons(svg: string, scale: number, draw: (svg: string, width: number) => Uint8Array): string {
  return svg.replace(/(<image\b[^>]*?\shref=")data:image\/svg\+xml(;base64)?,([^"]+)("[^>]*>)/g, (all, pre: string, b64: string | undefined, data: string, post: string) => {
    const w = Number(/\swidth="([\d.]+)"/.exec(pre + post)?.[1]);
    if (!w) return all;
    try {
      const icon = b64 ? new TextDecoder().decode(fromBase64(data)) : decodeURIComponent(data);
      const png = draw(icon, Math.max(1, Math.min(1024, Math.ceil(w * scale * ICON_OVERSAMPLE))));
      return `${pre}data:image/png;base64,${toBase64(png)}${post}`;
    } catch {
      return all;
    }
  });
}

/**
 * A rasterizer, given the resvg WebAssembly (a compiled module in Workers, the
 * file's bytes in Node) and font files. The module loads once per isolate.
 */
export function rasterizer(wasm: WebAssembly.Module | ArrayBuffer | Uint8Array, fonts: Uint8Array[]) {
  const draw = (svg: string, width: number, withFonts: boolean) => {
    const r = new Resvg(svg, {
      fitTo: { mode: 'width', value: width },
      font: { fontBuffers: withFonts ? fonts : [], loadSystemFonts: false, defaultFontFamily: 'Inter', sansSerifFamily: 'Inter' },
    });
    try {
      return r.render().asPng();
    } finally {
      r.free();
    }
  };
  return async (svg: string, width = pngWidth(svg)): Promise<Uint8Array> => {
    ready ??= initWasm(wasm as Parameters<typeof initWasm>[0]);
    await ready;
    const own = Number(/^<svg\b[^>]*?\swidth="(\d+(?:\.\d+)?)"/.exec(svg)?.[1] ?? width);
    // Icons have no text, so they don't need the fonts.
    return draw(flattenIcons(svg, width / own, (icon, w) => draw(icon, w, false)), width, true);
  };
}

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
 * embedded icon (icons are most of the cost). Measured on resvg with real
 * diagrams, with headroom; Workers run it about 2.7x slower than Node.
 */
const MS_PER_MP = 70;
const MS_PER_MP_PER_ICON = 40;
/** Keep a render well inside the Workers CPU limit. */
const BUDGET_MS = 700;

/**
 * How wide to draw the PNG: up to twice the picture's own width for sharp text,
 * as large as the time budget allows for its icons, and never under 600 px.
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

/**
 * A rasterizer, given the resvg WebAssembly (a compiled module in Workers, the
 * file's bytes in Node) and font files. The module loads once per isolate.
 */
export function rasterizer(wasm: WebAssembly.Module | ArrayBuffer | Uint8Array, fonts: Uint8Array[]) {
  return async (svg: string, width = pngWidth(svg)): Promise<Uint8Array> => {
    ready ??= initWasm(wasm as Parameters<typeof initWasm>[0]);
    await ready;
    const r = new Resvg(svg, {
      fitTo: { mode: 'width', value: width },
      font: { fontBuffers: fonts, loadSystemFonts: false, defaultFontFamily: 'Inter', sansSerifFamily: 'Inter' },
    });
    const png = r.render().asPng();
    r.free();
    return png;
  };
}

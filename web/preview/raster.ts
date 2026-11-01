/**
 * SVG to PNG for preview links (`/p/{id}.png`), for chat apps that show PNG
 * but not SVG. resvg runs as WebAssembly, so it works in a Pages Function and
 * in Node alike. Workers have no system fonts, so Inter (the font the
 * pictures use) comes along as font files.
 */
import { initWasm, Resvg } from '@resvg/resvg-wasm';

let ready: Promise<void> | null = null;

/** Twice the picture's own width, for sharp text, within limits that keep files small. */
export function pngWidth(svg: string): number {
  const w = Number(/^<svg\b[^>]*?\swidth="(\d+(?:\.\d+)?)"/.exec(svg)?.[1] ?? 800);
  return Math.round(Math.min(2400, Math.max(800, w * 2)));
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

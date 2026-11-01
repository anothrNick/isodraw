// Types for preview.gen.js, which `npm run build:preview` bundles from web/preview/render.ts.
export type PreviewTheme = 'light' | 'dark';
export function renderSvg(content: unknown, opts?: { title?: string; theme?: PreviewTheme }): string;
export function messageSvg(heading: string, detail: string, theme?: PreviewTheme): string;
export function inlineImages(svg: string, base: string, get?: (url: string) => Promise<Response>): Promise<string>;
export interface PreviewStore {
  get(key: string): Promise<Uint8Array | null>;
  put(key: string, body: Uint8Array, contentType: string): Promise<void>;
}
export interface PreviewOptions {
  getImage?: (url: string) => Promise<Response>;
  toPng?: (svg: string, width?: number) => Promise<Uint8Array>;
  store?: PreviewStore;
  waitUntil?: (p: Promise<unknown>) => void;
}
export function previewImage(
  requestUrl: URL,
  apiOrigin: string,
  opts?: PreviewOptions,
): Promise<{ status: number; body: string | Uint8Array; headers: Record<string, string> }>;
export function previewHeaders(cacheable: boolean, type?: 'svg' | 'png', versioned?: boolean): Record<string, string>;
export function pngWidth(svg: string): number;
export function rasterizer(wasm: WebAssembly.Module | ArrayBuffer | Uint8Array, fonts: Uint8Array[]): (svg: string, width?: number) => Promise<Uint8Array>;

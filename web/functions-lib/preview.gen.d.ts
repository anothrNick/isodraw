// Types for preview.gen.js, which `npm run build:preview` bundles from web/preview/render.ts.
export type PreviewTheme = 'light' | 'dark';
export function renderSvg(content: unknown, opts?: { title?: string; theme?: PreviewTheme }): string;
export function messageSvg(heading: string, detail: string, theme?: PreviewTheme): string;
export function inlineImages(svg: string, base: string, get?: (url: string) => Promise<Response>): Promise<string>;
export function previewSvg(
  requestUrl: URL,
  apiOrigin: string,
  getImage?: (url: string) => Promise<Response>,
): Promise<{ status: number; svg: string; cacheable: boolean }>;
export function previewHeaders(cacheable: boolean): Record<string, string>;

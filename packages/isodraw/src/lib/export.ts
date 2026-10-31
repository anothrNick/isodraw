import type { Diagram } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';

async function toDataUrl(url: string): Promise<string> {
  if (url.startsWith('data:')) return url;
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/**
 * Build a standalone SVG string of the diagram currently rendered in an
 * IsoCanvas `<svg>` element, cropped to its content, with images inlined.
 */
export async function exportSvg(svg: SVGSVGElement, opts: { padding?: number; background?: string } = {}): Promise<string> {
  const scene = svg.querySelector<SVGGElement>('[data-scene]');
  if (!scene) throw new Error('No scene found in SVG');
  const pad = opts.padding ?? 24;
  const box = scene.getBBox();
  const clone = scene.cloneNode(true) as SVGGElement;
  clone.querySelectorAll('[data-noexport]').forEach((el) => el.remove());
  clone.querySelectorAll('[data-node-id],[data-edge-id]').forEach((el) => {
    el.removeAttribute('style');
  });
  await Promise.all(
    [...clone.querySelectorAll('image')].map(async (img) => {
      const href = img.getAttribute('href');
      if (!href) return;
      try {
        img.setAttribute('href', await toDataUrl(href));
      } catch {
        /* keep the remote URL */
      }
    }),
  );
  const out = document.createElementNS(SVG_NS, 'svg');
  const w = Math.ceil(box.width + pad * 2);
  const h = Math.ceil(box.height + pad * 2);
  out.setAttribute('xmlns', SVG_NS);
  out.setAttribute('viewBox', `${box.x - pad} ${box.y - pad} ${w} ${h}`);
  out.setAttribute('width', String(w));
  out.setAttribute('height', String(h));
  out.setAttribute('font-family', 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif');
  if (opts.background) {
    const bg = document.createElementNS(SVG_NS, 'rect');
    bg.setAttribute('x', String(box.x - pad));
    bg.setAttribute('y', String(box.y - pad));
    bg.setAttribute('width', String(w));
    bg.setAttribute('height', String(h));
    bg.setAttribute('fill', opts.background);
    out.appendChild(bg);
  }
  out.appendChild(clone);
  return new XMLSerializer().serializeToString(out);
}

/** Rasterize the diagram to a PNG blob. */
export async function exportPng(svg: SVGSVGElement, opts: { scale?: number; background?: string } = {}): Promise<Blob> {
  const text = await exportSvg(svg, { background: opts.background ?? '#ffffff' });
  const scale = opts.scale ?? 2;
  const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(img.width * scale);
    canvas.height = Math.ceil(img.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encoding failed'))), 'image/png'),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function exportJson(diagram: Diagram): string {
  return JSON.stringify(diagram, null, 2);
}

export function downloadBlob(data: Blob | string, filename: string, type = 'application/octet-stream') {
  const blob = typeof data === 'string' ? new Blob([data], { type }) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

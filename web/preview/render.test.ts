import { describe, expect, it } from 'vitest';
import { inlineImages, messageSvg, renderSvg } from './render';

const diagram = {
  version: 1,
  nodes: [
    { id: 'api', kind: 'box', x: 0, y: 0, w: 2, d: 2, h: 1, z: 0, color: '#3b82f6', label: 'API & <workers>' },
    { id: 'db', kind: 'cylinder', x: 4, y: 0, w: 2, d: 2, h: 1, z: 0, color: '#10b981', label: 'Postgres' },
    { id: 'icon', kind: 'image', x: 0, y: 4, w: 1, d: 1, h: 1, z: 0, color: '#fff', src: 'https://cdn.example/icons/Cache.svg?v=1&x=2' },
  ],
  edges: [{ id: 'e1', from: 'api', to: 'db', label: 'SQL', color: '#334155' }],
};

describe('renderSvg', () => {
  it('draws a standalone SVG document', () => {
    const svg = renderSvg(diagram, { title: 'Payments "v2"' });
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg).toMatch(/ width="\d+" height="\d+"/);
    expect(svg).toContain('<title>Payments &quot;v2&quot;</title>');
    expect(svg).toContain('API &amp; &lt;workers&gt;');
    expect(svg).toContain('Postgres');
    expect(svg).toContain('#f4f7fb'); // the light canvas
    expect(svg).not.toContain('width="100%"');
    expect(svg.endsWith('</svg>')).toBe(true);
    // Only the outer <svg> was replaced.
    expect(svg.match(/<svg\b/g)).toHaveLength(1);
  });

  it('draws in the dark theme', () => {
    expect(renderSvg(diagram, { theme: 'dark' })).toContain('#0b1220');
  });

  it('draws isometric icons inline, in their color', () => {
    const svg = renderSvg({ version: 1, nodes: [{ id: 'l', kind: 'image', x: 0, y: 0, w: 2, d: 2, h: 1, z: 0, color: '#10b981', src: 'isodraw:laptop', label: 'Laptop' }], edges: [] });
    expect(svg).toContain('href="data:image/svg+xml,');
    expect(svg).toContain('%2310b981');
    expect(svg).not.toContain('isodraw:laptop');
  });

  it('refuses something that is not a diagram', () => {
    expect(() => renderSvg({ hello: 1 })).toThrow();
  });
});

describe('inlineImages', () => {
  it('puts icons inside as data URLs and leaves the rest alone', async () => {
    const svg = renderSvg(diagram);
    const asked: string[] = [];
    const out = await inlineImages(svg, 'https://isodraw.test/', async (url) => {
      asked.push(url);
      return new Response('<svg xmlns="http://www.w3.org/2000/svg"/>', { headers: { 'content-type': 'image/svg+xml' } });
    });
    expect(asked).toEqual(['https://cdn.example/icons/Cache.svg?v=1&x=2']);
    expect(out).toContain('href="data:image/svg+xml;base64,');
    expect(out).not.toContain('cdn.example');
  });

  it('keeps the URL when an icon cannot be fetched', async () => {
    const svg = renderSvg(diagram);
    const out = await inlineImages(svg, 'https://isodraw.test/', async () => new Response('nope', { status: 404 }));
    expect(out).toContain('cdn.example/icons/Cache.svg');
  });
});

describe('messageSvg', () => {
  it('escapes its text', () => {
    expect(messageSvg('Expired <link>', 'a & b')).toContain('Expired &lt;link&gt;');
  });
});

describe('PNG pictures', () => {
  it('are up to twice the picture width, within a time budget', async () => {
    const { pngWidth } = await import('./raster');
    const svg = (w: number, h: number, icons = 0) => `<svg xmlns="x" width="${w}" height="${h}">` + '<image href="x"/>'.repeat(icons) + '</svg>';
    expect(pngWidth(svg(500, 300))).toBe(1000);
    expect(pngWidth(svg(200, 100))).toBe(600);
    // IsoDraw's own architecture diagram (13 icons) in 2.5D: wide and short, so it stays large.
    expect(pngWidth(svg(1400, 483, 13))).toBeGreaterThan(2000);
    // Big, square, and full of icons: smaller, never below 600 px.
    expect(pngWidth(svg(3000, 3000, 13))).toBeLessThan(1700);
    expect(pngWidth(svg(3000, 3000, 400))).toBe(600);
  });

  it('rasterize a diagram with the bundled font', async () => {
    const { readFileSync } = await import('node:fs');
    const { createRequire } = await import('node:module');
    const { rasterizer } = await import('./raster');
    const require = createRequire(import.meta.url);
    const font = (f: string) => readFileSync(require.resolve(`@expo-google-fonts/inter/${f}`));
    const toPng = rasterizer(readFileSync(require.resolve('@resvg/resvg-wasm/index_bg.wasm')), [font('600SemiBold/Inter_600SemiBold.ttf')]);
    // Its icon is an embedded SVG, drawn first as a small PNG.
    const svg = renderSvg({ ...diagram, nodes: [...diagram.nodes, { id: 'phone', kind: 'image', x: 8, y: 0, w: 1, d: 1, h: 1, z: 0, color: '#3b82f6', src: 'isodraw:phone' }] }, { title: 'Shop' });
    expect(svg).toContain('data:image/svg+xml,');
    const png = await toPng(svg, 400);
    expect([...png.slice(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
    // The PNG's width (big-endian, bytes 16–19) is what was asked for.
    expect(new DataView(png.buffer, png.byteOffset).getUint32(16)).toBe(400);
  });
});

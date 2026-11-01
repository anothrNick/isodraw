import { describe, expect, it } from 'vitest';
import { ISO_ICON_NAMES, fitIsoIcon, imageHref, isIsoIcon, isoIconLibrary, isoIconMetrics, isoIconPlacement, isoIconScale, isoIconSvg } from './isoIcons';
import { createImageNode } from './shapes';

describe('isometric icons', () => {
  it('draws every icon as a standalone SVG', () => {
    expect(ISO_ICON_NAMES.length).toBeGreaterThanOrEqual(40);
    for (const name of ISO_ICON_NAMES) {
      const svg = isoIconSvg(name)!;
      expect(svg, name).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="-64 -100 128 140"/);
      expect(svg, name).toMatch(/<\/svg>$/);
      expect(svg, name).not.toMatch(/NaN|undefined/);
    }
  });

  it('takes the color it is given', () => {
    expect(isoIconSvg('laptop', '#10b981')).toContain('#10b981');
    expect(isoIconSvg('database', '#10b981')).not.toBe(isoIconSvg('database'));
    // Not a color: the default blue.
    expect(isoIconSvg('database', 'red')).toBe(isoIconSvg('database'));
  });

  it('turns isodraw: references into data URLs and leaves other sources alone', () => {
    expect(isIsoIcon('isodraw:laptop')).toBe(true);
    expect(isIsoIcon('isodraw:nope')).toBe(false);
    expect(isIsoIcon('https://x/icon.svg')).toBe(false);
    expect(imageHref('isodraw:laptop')).toMatch(/^data:image\/svg\+xml,/);
    expect(imageHref('https://x/icon.svg')).toBe('https://x/icon.svg');
    expect(imageHref('isodraw:nope')).toBe('isodraw:nope');
  });

  it('is a palette library, and its icons become components in the theme color', () => {
    const lib = isoIconLibrary();
    expect(lib.icons.map((i) => i.src)).toEqual(ISO_ICON_NAMES.map((n) => `isodraw:${n}`));
    expect(new Set(lib.icons.map((i) => i.category)).size).toBeGreaterThan(3);
    const node = createImageNode('isodraw:server', 'Server', 0, 0);
    expect(node).toMatchObject({ kind: 'image', src: 'isodraw:server', color: '#3b82f6' });
    expect(node.imageStyle).toBeUndefined();
  });
});

describe('isometric icon boxes', () => {
  it('measure what each icon draws', () => {
    for (const name of ISO_ICON_NAMES) {
      const m = isoIconMetrics(`isodraw:${name}`)!;
      expect(m.x1 - m.x0, name).toBeGreaterThanOrEqual(0.4);
      expect(m.y1 - m.y0, name).toBeGreaterThanOrEqual(0.4);
      expect(m.x0, name).toBeGreaterThanOrEqual(-1.05);
      expect(m.x1, name).toBeLessThanOrEqual(1.05);
      expect(m.h, name).toBeGreaterThan(0);
      expect(m.pic.w, name).toBeGreaterThan(0);
    }
    // A server rack is tall and square; a phone stands thin.
    const rack = isoIconMetrics('isodraw:server-rack')!;
    expect(rack.h).toBeCloseTo(2.05, 1);
    expect(rack.x1 - rack.x0).toBeCloseTo(1.24, 1);
    const phone = isoIconMetrics('isodraw:phone')!;
    expect(phone.x1 - phone.x0).toBeGreaterThan(phone.y1 - phone.y0);
  });

  it('new components get the drawing as their box', () => {
    const rack = createImageNode('isodraw:server-rack', 'Rack', 0, 0);
    const m = isoIconMetrics('isodraw:server-rack')!;
    expect(rack.w).toBeCloseTo(m.x1 - m.x0, 2);
    expect(rack.d).toBeCloseTo(m.y1 - m.y0, 2);
    expect(rack.h).toBeCloseTo(m.h, 2);
    expect(isoIconScale(rack)).toBeCloseTo(1, 2);
  });

  it('scale as a whole when one side changes', () => {
    const rack = createImageNode('isodraw:server-rack', 'Rack', 0, 0);
    const wider = fitIsoIcon({ ...rack, w: rack.w * 2 }, 'w');
    expect(wider.d).toBeCloseTo(rack.d * 2, 2);
    expect(wider.h).toBeCloseTo(rack.h * 2, 2);
    expect(isoIconScale(wider)).toBeCloseTo(2, 2);
    // Other components are left alone.
    const block = { kind: 'block', w: 3, d: 1, h: 1 };
    expect(fitIsoIcon(block)).toBe(block);
  });

  it('are the same size in 2D and 2.5D', () => {
    const m = isoIconMetrics('isodraw:laptop')!;
    const flat = isoIconPlacement('isodraw:laptop', 1.5, '2d')!;
    expect(flat.w).toBeCloseTo(m.pic.w * 1.5);
    expect(flat.viewBox).toBe(`${m.pic.x} ${m.pic.y} ${m.pic.w} ${m.pic.h}`);
    const iso = isoIconPlacement('isodraw:laptop', 1.5, '3d')!;
    expect(iso.w).toBeCloseTo(128 * 1.5);
  });
});

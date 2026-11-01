import { describe, expect, it } from 'vitest';
import { ISO_ICON_NAMES, imageHref, isIsoIcon, isoIconLibrary, isoIconSvg } from './isoIcons';
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
    expect(node).toMatchObject({ kind: 'image', src: 'isodraw:server', color: '#3b82f6', w: 2, d: 2 });
    expect(node.imageStyle).toBeUndefined();
  });
});

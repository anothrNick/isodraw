import { describe, expect, it } from 'vitest';
import { inkFor, themedDiagram } from './theme';
import { contrastText, shade } from './geometry';
import type { Diagram } from './types';

describe('inkFor', () => {
  it('leaves colors alone in the light theme', () => {
    expect(inkFor('#1f2937', 'light')).toBe('#1f2937');
  });

  it('flips dark grays and slates to light ones in the dark theme', () => {
    for (const dark of ['#1f2937', '#0f172a', '#475569', '#000000', '#333']) {
      const light = inkFor(dark, 'dark');
      expect(light, dark).not.toBe(dark);
      expect(contrastText(light), `${dark} → ${light}`).toBe('#1f2937');
    }
  });

  it('keeps light, saturated and non-hex colors', () => {
    for (const c of ['#ffffff', '#94a3b8', '#4f8cf7', '#e5534b', '#7c2d12', 'red', 'rgb(0,0,0)']) {
      expect(inkFor(c, 'dark'), c).toBe(c);
    }
  });
});

describe('themedDiagram', () => {
  const d: Diagram = {
    version: 1,
    nodes: [
      { id: 't', kind: 'text', x: 0, y: 0, z: 0, w: 4, d: 1, h: 0, color: '#1f2937', text: 'Hi' },
      { id: 'b', kind: 'block', x: 0, y: 0, z: 0, w: 2, d: 2, h: 1, color: '#232f3e', labelColor: '#1f2937' },
    ],
    edges: [{ id: 'e', from: 't', to: 'b', color: '#475569', width: 2, routing: 'orthogonal', animationColor: '#4f8cf7' }],
  };

  it('returns the same diagram in the light theme', () => {
    expect(themedDiagram(d, 'light')).toBe(d);
  });

  it('adapts text, labels and connections but not solid fills', () => {
    const t = themedDiagram(d, 'dark');
    expect(t.nodes[0].color).not.toBe('#1f2937');
    expect(t.nodes[1].color).toBe('#232f3e');
    expect(t.nodes[1].labelColor).not.toBe('#1f2937');
    expect(t.edges[0].color).not.toBe('#475569');
    expect(t.edges[0].animationColor).toBe('#4f8cf7');
    expect(d.nodes[0].color).toBe('#1f2937');
  });
});

describe('color helpers', () => {
  it('shade darkens below 1 and lightens above', () => {
    expect(shade('#808080', 0.5)).toBe('#404040');
    expect(shade('#000000', 2)).toBe('#ffffff');
    expect(shade('not-a-color', 0.5)).toBe('not-a-color');
  });

  it('contrastText picks readable text', () => {
    expect(contrastText('#ffffff')).toBe('#1f2937');
    expect(contrastText('#1d4ed8')).toBe('#ffffff');
  });
});

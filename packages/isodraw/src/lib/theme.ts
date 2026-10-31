import { createContext, useContext, useEffect, useState } from 'react';
import type { Diagram } from './types';

/** `system` follows the operating system's light/dark setting. */
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/** The theme in effect for everything below an editor or published view. */
export const ThemeContext = createContext<ResolvedTheme>('light');

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** Resolve a theme setting; `undefined` inherits from an enclosing IsoDraw component (light by default). */
export function useResolvedTheme(theme: Theme | undefined): ResolvedTheme {
  const inherited = useContext(ThemeContext);
  const [systemDark, setSystemDark] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(DARK_QUERY).matches);
  useEffect(() => {
    if (theme !== 'system' || !window.matchMedia) return;
    const m = window.matchMedia(DARK_QUERY);
    const update = () => setSystemDark(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, [theme]);
  if (theme === 'system') return systemDark ? 'dark' : 'light';
  return theme ?? inherited;
}

/** Canvas background for each theme; exports use it so light-on-dark ink stays readable. */
export const CANVAS_BG: Record<ResolvedTheme, string> = { light: '#f4f7fb', dark: '#0b1220' };

/** Colors the renderer draws itself (not taken from the diagram). */
export const INK: Record<ResolvedTheme, { text: string; halo: string; chip: string }> = {
  light: { text: '#1f2937', halo: '#ffffff', chip: '#ffffff' },
  dark: { text: '#e2e8f0', halo: '#0b1220', chip: '#1e293b' },
};

function parseHex(c: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((x) => x + x).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}

const toHex = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0');

/**
 * Diagram "ink" for the dark theme: dark, near-gray colors (default text,
 * slate connections) flip to the matching light gray so they stay readable.
 * Saturated colors are the author's choice and are left alone.
 */
export function inkFor(color: string, theme: ResolvedTheme): string {
  if (theme === 'light') return color;
  const rgb = parseHex(color);
  if (!rgb) return color;
  const max = Math.max(...rgb);
  const min = Math.min(...rgb);
  const l = (max + min) / 2;
  // Chroma rather than HSL saturation: very dark slates have high saturation but little visible color.
  if (l >= 0.5 || max - min > 0.2) return color;
  // Mirror the lightness, keeping the hue: l → 1 - l.
  const shift = 1 - 2 * l;
  return `#${rgb.map((v) => toHex(v + shift)).join('')}`;
}

/** The diagram with author colors adapted to the theme (see `inkFor`). */
export function themedDiagram(d: Diagram, theme: ResolvedTheme): Diagram {
  if (theme === 'light') return d;
  return {
    ...d,
    nodes: d.nodes.map((n) => ({
      ...n,
      ...(n.kind === 'text' ? { color: inkFor(n.color, theme) } : {}),
      ...(n.labelColor ? { labelColor: inkFor(n.labelColor, theme) } : {}),
    })),
    edges: d.edges.map((e) => ({
      ...e,
      color: inkFor(e.color, theme),
      ...(e.animationColor ? { animationColor: inkFor(e.animationColor, theme) } : {}),
    })),
  };
}

/** `ThemeContext` value hook for renderers. */
export const useTheme = () => useContext(ThemeContext);

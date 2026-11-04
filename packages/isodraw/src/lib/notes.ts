import { TILE } from './geometry';
import type { DiagramNode } from './types';

/**
 * Sticky notes: a flat box of wrapped text. The text decides how tall the
 * box needs to be, so the editor and the CLI size a note from its text and
 * the renderer never lets the text spill out.
 */

/** Padding inside the note, and the folded corner, in pixels at TILE scale. */
export const NOTE_PAD = 7;
export const NOTE_FOLD = 12;
export const NOTE_FONT = 0.42;

/** Break text into lines that fit a width (px), on spaces where possible. */
export function wrapText(text: string, fontPx: number, widthPx: number): string[] {
  const perLine = Math.max(4, Math.floor(widthPx / (fontPx * 0.55)));
  const out: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      if (!line) line = word;
      else if ((line + ' ' + word).length <= perLine) line += ' ' + word;
      else {
        out.push(line);
        line = word;
      }
      while (line.length > perLine) {
        out.push(line.slice(0, perLine));
        line = line.slice(perLine);
      }
    }
    out.push(line);
  }
  return out;
}

/** A note's text as the lines it's drawn in, for its width and font size. */
export function noteLines(n: Pick<DiagramNode, 'text' | 'w' | 'fontSize'>): string[] {
  const fs = (n.fontSize ?? NOTE_FONT) * TILE;
  const fold = Math.min(NOTE_FOLD, (n.w * TILE) / 4);
  return wrapText(n.text ?? '', fs, n.w * TILE - 2 * NOTE_PAD - fold / 2);
}

/** How deep (world units) a note must be for its text, on the half-unit grid. */
export function noteDepth(n: Pick<DiagramNode, 'text' | 'w' | 'fontSize'>): number {
  const fs = (n.fontSize ?? NOTE_FONT) * TILE;
  const px = 2 * NOTE_PAD + noteLines(n).length * fs * 1.25 + 2;
  return Math.max(1, Math.ceil((px / TILE) * 2) / 2);
}

import { describe, expect, it } from 'vitest';
import { EXAMPLES } from '../demo/examples';
import { terraformExample } from '../demo/terraform';
import { parentMap } from './containers';
import { layoutLevelElk } from './elkLayout';
import { layoutLevel } from './layout';
import { scoreLayout, type LayoutScore } from './layoutScore';
import type { Diagram } from './types';

/**
 * The layout test bench: every example, tidied as drawn and from shuffled
 * positions, by each engine, scored. Both engines must never overlap items or
 * move them out of their areas, and ELK (what Tidy uses; 'layered' is the
 * fallback) must keep lines off items, labels and each other.
 * `BENCH=1 npx vitest run layoutBench` prints the whole table for comparing them.
 */

/** Swap components' places with others in the same area, deterministically, as if they'd been added in a jumble. */
function shuffled(d: Diagram): Diagram {
  const parents = parentMap(d.nodes);
  const groups = new Map<string | undefined, string[]>();
  for (const n of d.nodes) if (n.kind !== 'area' && n.kind !== 'circleArea' && n.kind !== 'text') groups.set(parents.get(n.id), [...(groups.get(parents.get(n.id)) ?? []), n.id]);
  const spot = new Map<string, { x: number; y: number }>();
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (const ids of groups.values()) {
    const places = ids.map((id) => d.nodes.find((n) => n.id === id)!).map((n) => ({ x: n.x + n.w / 2, y: n.y + n.d / 2 }));
    for (let i = places.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [places[i], places[j]] = [places[j], places[i]];
    }
    ids.forEach((id, i) => spot.set(id, places[i]));
  }
  return {
    ...d,
    nodes: d.nodes.map((n) => (spot.has(n.id) ? { ...n, x: spot.get(n.id)!.x - n.w / 2, y: spot.get(n.id)!.y - n.d / 2 } : n)),
    // Bends and ends go too (a message's place on a lifeline is part of what it is, so that stays).
    edges: d.edges.map(({ waypoints: _w, fromAnchor: f, toAnchor: t, ...e }) => ({ ...e, ...(f?.line !== undefined ? { fromAnchor: f } : {}), ...(t?.line !== undefined ? { toAnchor: t } : {}) })),
  };
}

const CASES: [string, Diagram][] = [
  ...EXAMPLES.map((e) => [e.id, e.diagram] as [string, Diagram]),
  ...(EXAMPLES.some((e) => e.id === 'terraform') ? [] : [['terraform', terraformExample] as [string, Diagram]]),
].flatMap(([id, d]) => [[`${id}`, d] as [string, Diagram], [`${id} shuffled`, shuffled(d)] as [string, Diagram]]);

const ENGINES: [string, (d: Diagram) => Diagram | Promise<Diagram>][] = [
  ['layered', layoutLevel],
  ['elk', layoutLevelElk],
];

describe('layout bench', () => {
  const rows: (LayoutScore & { case: string; engine: string; ms: number })[] = [];

  for (const [name, d] of CASES) {
    for (const [engine, run] of ENGINES) {
      it(`${engine}: ${name}`, async () => {
        const t = performance.now();
        const out = await run(d);
        const ms = Math.round(performance.now() - t);
        const score = scoreLayout(out, d);
        rows.push({ case: name, engine, ms, ...score });
        expect(score.overlaps).toBe(0);
        expect(score.regrouped).toBe(0);
        if (engine === 'elk') {
          // The layout Tidy uses: no line through an item or a label, no two lines on one track.
          expect(score.through).toBe(0);
          expect(score.throughLabel).toBe(0);
          expect(score.parallel).toBeLessThan(0.5);
        }
      });
    }
  }

  it('prints the table', () => {
    if (!process.env.BENCH) return;
    console.table(rows.sort((a, b) => a.case.localeCompare(b.case) || a.engine.localeCompare(b.engine)));
    const total = (engine: string, k: keyof LayoutScore) => Math.round(rows.filter((r) => r.engine === engine).reduce((t, r) => t + r[k], 0));
    console.table(
      ENGINES.map(([engine]) => ({
        engine,
        ...Object.fromEntries((['through', 'throughLabel', 'parallel', 'close', 'crossings', 'labelOnItem', 'labelOnLine', 'labelOnLabel', 'overlaps', 'regrouped', 'length', 'sprawl'] as const).map((k) => [k, total(engine, k)])),
        ms: rows.filter((r) => r.engine === engine).reduce((t, r) => t + r.ms, 0),
      })),
    );
  });
});

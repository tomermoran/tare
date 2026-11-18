import { MIN_SHOTS, OPENED_WEIGHT } from "./constants";

/*
 * The bean-age term (STORY-04-02-01): a weighted least-squares line of each
 * shot's grind minus its own recipe's grind against the coffee's age since
 * roasting, read at the portion's age now. The since-opening clock adds a
 * smaller term (DQ-31). In grinder units, not yet rounded. Null with fewer
 * than 3 shots or fewer than 2 different ages (AC 2), or no age now.
 */

export type AgePoint = { roastDays: number | null; openedDays: number | null; delta: number; weight: number };

type Fit = { at: (x: number) => number; slope: number; meanX: number };

function fit(points: readonly { x: number; y: number; w: number }[]): Fit | null {
  if (points.length < MIN_SHOTS || new Set(points.map((p) => p.x)).size < 2) return null;
  const sw = points.reduce((s, p) => s + p.w, 0);
  const mx = points.reduce((s, p) => s + p.w * p.x, 0) / sw;
  const my = points.reduce((s, p) => s + p.w * p.y, 0) / sw;
  const sxx = points.reduce((s, p) => s + p.w * (p.x - mx) ** 2, 0);
  const sxy = points.reduce((s, p) => s + p.w * (p.x - mx) * (p.y - my), 0);
  const slope = sxy / sxx;
  return { at: (x) => my + slope * (x - mx), slope, meanX: mx };
}

export function ageTerm(points: readonly AgePoint[], now: { roastDays: number | null; openedDays: number | null }): number | null {
  if (now.roastDays === null) return null;
  const roast = fit(points.flatMap((p) => (p.roastDays === null ? [] : [{ x: p.roastDays, y: p.delta, w: p.weight }])));
  if (!roast) return null;
  let term = roast.at(now.roastDays);
  if (now.openedDays !== null) {
    const opened = fit(points.flatMap((p) => (p.openedDays === null ? [] : [{ x: p.openedDays, y: p.delta, w: p.weight }])));
    if (opened) term += OPENED_WEIGHT * opened.slope * (now.openedDays - opened.meanX);
  }
  return term;
}

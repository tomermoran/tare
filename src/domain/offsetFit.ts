import { STRETCH_LIMIT_PERCENT, TOO_CLOSE_STEPS, UNCERTAIN_STEPS } from "./offsetFitConstants";

/*
 * Shift and stretch from an event's re-dials (STORY-04-04-01, DQ-43b): a
 * least-squares line through (old grind, new grind with ageing taken off)
 * so that new = old x stretch + shift. One re-dial is a plain shift. Old
 * grinds too close together can't tell a stretch (it stays none); a fit
 * that misses by too much, or wants more than the wheel allows, is flagged
 * uncertain and still returned.
 */

export type ReDial = { old: number; new: number };

export type OffsetFit = {
  shift: number;
  /** In percent: 0 means the steps mean the same as before. */
  stretchPercent: number;
  /** The shift with no stretch: the mean move, for declining the stretch. */
  shiftAlone: number;
  uncertain: boolean;
  tooClose: boolean;
  coffees: number;
};

const roundTo = (n: number, step: number) => Number((Math.round(n / step) * step).toFixed(6)) || 0;
const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

export function fitOffset(pairs: readonly ReDial[], step: number): OffsetFit {
  const n = pairs.length;
  const shiftAlone = roundTo(mean(pairs.map((p) => p.new - p.old)), step);
  const plain = { shift: shiftAlone, stretchPercent: 0, shiftAlone, uncertain: false, tooClose: false, coffees: n };
  if (n < 2) return plain;
  const olds = pairs.map((p) => p.old);
  if (Math.max(...olds) - Math.min(...olds) < TOO_CLOSE_STEPS * step) return { ...plain, tooClose: true };

  const mx = mean(olds);
  const my = mean(pairs.map((p) => p.new));
  const sxx = pairs.reduce((s, p) => s + (p.old - mx) ** 2, 0);
  const sxy = pairs.reduce((s, p) => s + (p.old - mx) * (p.new - my), 0);
  const slope = sxy / sxx;
  const wanted = (slope - 1) * 100;
  const stretchPercent = Math.round(Math.max(-STRETCH_LIMIT_PERCENT, Math.min(STRETCH_LIMIT_PERCENT, wanted))) || 0;
  const factor = 1 + stretchPercent / 100;
  // With the stretch rounded (and limited), the shift that fits best for it.
  const shift = roundTo(mean(pairs.map((p) => p.new - p.old * factor)), step);
  const rms = Math.sqrt(mean(pairs.map((p) => (p.new - (p.old * factor + shift)) ** 2)));
  const uncertain = Math.abs(wanted) > STRETCH_LIMIT_PERCENT || rms > UNCERTAIN_STEPS * step;
  return { shift, stretchPercent, shiftAlone, uncertain, tooClose: false, coffees: n };
}

/** The stored factor for a percent, 1 meaning none. */
export const stretchFactor = (percent: number) => Number((1 + percent / 100).toFixed(4));
/** The percent for a stored factor (null as none). */
export const stretchPercent = (factor: number | null) => (factor === null ? 0 : Math.round((factor - 1) * 100));

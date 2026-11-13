/*
 * How much coffee is left in a portion (STORY-03-04-01, SQ-14): the latest
 * stock check, or the portion's weight, minus the dose of every shot after
 * it, measured and one-tap alike. Never negative: when the doses add up to
 * more, it's zero and `overLogged`, so the user can weigh what's left.
 * Derived on read, never stored.
 */

export type Remaining = { grams: number; overLogged: boolean };

export function remainingWeight({
  weight,
  latestCheck,
  doses,
}: {
  /** Grams, as the portion was made. */
  weight: number;
  latestCheck: { grams: number; at: Date } | null;
  doses: readonly { grams: number; at: Date }[];
}): Remaining {
  const from = latestCheck ? latestCheck.grams : weight;
  const used = doses.filter((d) => !latestCheck || d.at.getTime() > latestCheck.at.getTime()).reduce((sum, d) => sum + d.grams, 0);
  const left = Math.round((from - used) * 10) / 10;
  return left < 0 ? { grams: 0, overLogged: true } : { grams: left, overLogged: false };
}

/** A bag's total: the sum of its portions' remaining weights. */
export function totalRemaining(portions: readonly Remaining[]): Remaining {
  return {
    grams: Math.round(portions.reduce((sum, p) => sum + p.grams, 0) * 10) / 10,
    overLogged: portions.some((p) => p.overLogged),
  };
}

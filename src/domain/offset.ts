/*
 * The proposed shift after a re-dial (STORY-04-03-01): the new recipe's
 * grind minus the old one's, with the bean-ageing change between the two
 * dial-ins taken off first (AC 2) and returned so a quiet line can say so.
 * No age estimate means nothing is taken off. In the grinder's own units,
 * on its step; words only when its direction is known (AC 3).
 */

export type ShiftWheel = { step: number; coarser: "higher" | "lower" | null };

export type ShiftProposal = {
  shift: number;
  /** The ageing change taken off, on the grinder's step; null when none was. */
  ageTakenOff: number | null;
  /** "3 steps finer", when the grinder's direction is known and the shift isn't zero. */
  words: { steps: number; direction: "finer" | "coarser" } | null;
};

const roundTo = (n: number, step: number) => Number((Math.round(n / step) * step).toFixed(6));

export function shiftWords(shift: number, wheel: ShiftWheel): ShiftProposal["words"] {
  if (wheel.coarser === null || shift === 0) return null;
  const coarser = wheel.coarser === "higher" ? shift > 0 : shift < 0;
  return { steps: Math.round(Math.abs(shift) / wheel.step), direction: coarser ? "coarser" : "finer" };
}

export function proposeShift(input: { oldGrind: number; newGrind: number; ageChange: number | null; wheel: ShiftWheel }): ShiftProposal {
  const { wheel } = input;
  const age = input.ageChange === null ? 0 : roundTo(input.ageChange, wheel.step);
  const shift = roundTo(input.newGrind - input.oldGrind - age, wheel.step) || 0;
  return { shift, ageTakenOff: age === 0 ? null : age, words: shiftWords(shift, wheel) };
}

import { freshness } from "./freshness";
import { reasonParts, signals } from "./reason";
import { bodyRule, grindRule, prepRule, strengthRule, temperatureRule, type Rule } from "./rules";
import type { Change, SuggestInput, Suggestion } from "./types";

export type * from "./types";

/**
 * The lever order (S-02), in one place: puck prep, grind, yield (or dose and
 * milk for a milk drink), dose, temperature. The first lever with a change
 * wins; there is only ever one.
 */
export const LEVERS: readonly Rule[] = [prepRule, grindRule, strengthRule, bodyRule, temperatureRule];

/**
 * The next shot's one change, its reason and a freshness line
 * (STORY-02-03-05, 06). Freshness is an explanation beside the change,
 * never one itself. Nothing here is stored.
 */
export function suggest(input: SuggestInput): Suggestion {
  const change = signals(input).length ? pickLever(input) : null;
  return { change, reason: change ? reasonParts(input) : [], freshness: freshness(input.clocks) };
}

function pickLever(input: SuggestInput): Change | null {
  for (const rule of LEVERS) {
    const change = rule(input);
    if (change) return change;
  }
  return null;
}

import { freshness } from "./freshness";
import { reasonParts, signals } from "./reason";
import type { Change, SuggestInput, Suggestion } from "./types";

export type * from "./types";

/**
 * The next shot's one change, its reason and a freshness line
 * (STORY-02-03-05). The levers (puck prep, grind, yield, dose, temperature,
 * milk, in that order) come with STORY-02-03-06; until then there's never a
 * change. Freshness is an explanation beside the change, never one itself.
 */
export function suggest(input: SuggestInput): Suggestion {
  const change: Change | null = signals(input).length ? pickLever() : null;
  return { change, reason: change ? reasonParts(input) : [], freshness: freshness(input.clocks) };
}

/** The lever order (STORY-02-03-06); no lever logic yet. */
function pickLever(): Change | null {
  return null;
}

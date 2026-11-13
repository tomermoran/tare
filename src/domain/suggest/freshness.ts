import { PAST_PEAK_OPEN_DAYS, PAST_PEAK_ROASTED_DAYS, VERY_FRESH_DAYS } from "./constants";
import type { Freshness, SuggestInput } from "./types";

/**
 * The freshness explanation (STORY-02-03-05 AC 4), from the clocks, which
 * already leave out freezer time. Very fresh beats past its peak, and age
 * since roast beats time open. Only a roast or packing date gives an age; a
 * best-before date alone says nothing about it.
 */
export function freshness(clocks: SuggestInput["clocks"]): Freshness | null {
  const { roasting, opened } = clocks;
  const age = roasting && (roasting.kind === "roasted" || roasting.kind === "packed") ? roasting.days : null;
  if (age !== null && age < VERY_FRESH_DAYS) return "veryFresh";
  if (age !== null && age > PAST_PEAK_ROASTED_DAYS) return "pastPeakRoasted";
  if (opened?.kind === "open" && opened.days > PAST_PEAK_OPEN_DAYS) return "pastPeakOpen";
  return null;
}

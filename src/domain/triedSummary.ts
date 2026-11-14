/*
 * How a coffee's shots went, in words (STORY-03-06-02, DQ-28). It describes
 * the shots, not the coffee, and is never a colour or a score. "Most" means
 * more than half, so a tie is "mixed". Personas are ignored in the MVP.
 */

export type TriedSummary =
  | { kind: "mostlyGood" | "mostlyOff" | "mixed" | "noRatings" }
  | { kind: "lastRated"; rating: number };

export type TriedShot = { rating: number | null; reaction: "good" | "off" | null };

/** `shots` newest first. */
export function triedSummary(shots: readonly TriedShot[]): TriedSummary {
  const ratings = shots.flatMap((s) => (s.rating !== null ? [s.rating] : []));
  if (ratings.length >= 3) return mostly(ratings.filter((r) => r >= 4).length, ratings.filter((r) => r <= 2).length, ratings.length);
  if (ratings.length > 0) return { kind: "lastRated", rating: ratings[0] };
  const reactions = shots.flatMap((s) => (s.reaction ? [s.reaction] : []));
  if (reactions.length === 0) return { kind: "noRatings" };
  return mostly(reactions.filter((r) => r === "good").length, reactions.filter((r) => r === "off").length, reactions.length);
}

function mostly(good: number, off: number, total: number): TriedSummary {
  if (good * 2 > total) return { kind: "mostlyGood" };
  if (off * 2 > total) return { kind: "mostlyOff" };
  return { kind: "mixed" };
}

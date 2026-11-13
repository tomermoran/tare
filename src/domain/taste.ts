/**
 * Observation tags on a shot's taste (S-08, STORY-01-05-03). Stored as keys;
 * the words come from `taste.tags.*`. The single source for the tag choices
 * and for validating what's saved.
 */
export const TASTE_TAGS = [
  "sourAndBitter",
  "dryFinish",
  "flat",
  "burnt",
  "littleCrema",
  "channelling",
] as const;

export type TasteTag = (typeof TASTE_TAGS)[number];

export function isTasteTag(value: unknown): value is TasteTag {
  return typeof value === "string" && (TASTE_TAGS as readonly string[]).includes(value);
}

/**
 * Channelling signs: tags that point to puck prep before grind, since grind
 * won't fix uneven extraction (S-06 lever order).
 */
export const PREP_TAGS: ReadonlySet<TasteTag> = new Set(["channelling", "sourAndBitter", "dryFinish"]);

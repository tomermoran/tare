import type { TasteTag } from "./taste";

/**
 * The shot warnings: the only things allowed to use the signal colour.
 * Notice's warning tone takes one of these kinds and nothing else, so every
 * use of signal traces back to this list. "Ran fast" is never a warning; it
 * is only part of a suggestion's reason (DQ-09).
 */
export const SHOT_WARNINGS = ["channelling"] as const;

export type ShotWarningKind = (typeof SHOT_WARNINGS)[number];

/**
 * A shot's warnings, from its tags (STORY-01-05-04): channelling seen, and
 * nothing else, warns (AC 4).
 */
export function shotWarnings(tags: readonly TasteTag[] | null | undefined): ShotWarningKind[] {
  return tags?.includes("channelling") ? ["channelling"] : [];
}

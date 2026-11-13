import { isTasteTag, TASTE_TAGS, type TasteTag } from "./taste";
import type { TasteQuestion } from "./tastePhrase";

/*
 * What the tasting screen saves (STORY-01-05-01 to 03). Every field is
 * optional: a field left out is not written, so an untouched question stays
 * unanswered, which is not "just right" (STORY-01-05-02 AC 3). null clears
 * an earlier answer (rating later, in edit mode).
 */

export type Tasting = {
  /** 1 to 5, measured shots only (DQ-23). */
  rating?: number | null;
  /** -2..2, 0 is just right. */
  balance?: number | null;
  strength?: number | null;
  body?: number | null;
  /** -2..0: sweetness is one-sided. */
  sweetness?: number | null;
  tags?: TasteTag[];
};

export const RATINGS = [1, 2, 3, 4, 5] as const;

/** Each question's answers, from the start end to the end end. */
export const TASTE_SCALE: Record<TasteQuestion, readonly number[]> = {
  balance: [-2, -1, 0, 1, 2],
  strength: [-2, -1, 0, 1, 2],
  body: [-2, -1, 0, 1, 2],
  sweetness: [-2, -1, 0],
};

export class InvalidTastingError extends Error {
  constructor(field: string) {
    super(`Invalid tasting ${field}`);
    this.name = "InvalidTastingError";
  }
}

export type TastingColumns = Partial<{
  userRating: number | null;
  tasteBalance: number | null;
  tasteStrength: number | null;
  tasteBody: number | null;
  tasteSweetness: number | null;
  tasteTags: TasteTag[];
}>;

const COLUMN = { balance: "tasteBalance", strength: "tasteStrength", body: "tasteBody", sweetness: "tasteSweetness" } as const;

/**
 * Checks a tasting and returns the columns to write: only what was given.
 * Throws InvalidTastingError for anything out of range, an unknown tag, or a
 * rating on a one-tap shot.
 */
export function tastingColumns(tasting: Tasting, entryMode: "measured" | "one-tap"): TastingColumns {
  const out: TastingColumns = {};
  if (tasting.rating !== undefined) {
    if (tasting.rating !== null && (entryMode !== "measured" || !(RATINGS as readonly number[]).includes(tasting.rating))) {
      throw new InvalidTastingError("rating");
    }
    out.userRating = tasting.rating;
  }
  for (const q of Object.keys(TASTE_SCALE) as TasteQuestion[]) {
    const v = tasting[q];
    if (v === undefined) continue;
    if (v !== null && !TASTE_SCALE[q].includes(v)) throw new InvalidTastingError(q);
    out[COLUMN[q]] = v;
  }
  if (tasting.tags !== undefined) {
    if (!Array.isArray(tasting.tags) || !tasting.tags.every(isTasteTag)) throw new InvalidTastingError("tags");
    // Stored once each, in the list's order.
    out.tasteTags = TASTE_TAGS.filter((tag) => tasting.tags!.includes(tag));
  }
  return out;
}

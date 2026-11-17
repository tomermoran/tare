import { originParts, type Origin } from "./origin";
import { ROAST_LEVELS } from "./roast";
import type { TriedSummary } from "./triedSummary";

/*
 * Narrowing Beans (EPIC-03-07): by roaster, roast level, origin and how a
 * coffee's shots went. Pure. The row is offered only with six or more
 * distinct coffees, on hand and tried together. Each filter offers only the
 * values present, with a count; one value per filter, all combined (AND),
 * and the result narrows On hand and Tried together.
 */

/** Coffees needed before the filter row is offered (DQ-39c). A starting value. */
export const FILTER_MIN_COFFEES = 6;

export const RATING_WORDS = ["mostlyGood", "mixed", "mostlyOff", "noRatings"] as const;
export type RatingWord = (typeof RATING_WORDS)[number];

/** Origin's value for coffees with none recorded, so they can be found ("not stated"). */
export const ORIGIN_NONE = "none";

export type BeanFacet = {
  beanId: string;
  roasterId: string;
  roasterName: string;
  roastLevel: string | null;
  origin: Origin | null;
  rating: RatingWord;
};

export const FILTER_KINDS = ["roaster", "roast", "origin", "rating"] as const;
export type FilterKind = (typeof FILTER_KINDS)[number];
export type BeansFilters = Partial<Record<FilterKind, string>>;

/**
 * Tried's summary in the filter's words (DQ-28): the same words, so nothing
 * new is invented. A coffee rated once or twice goes by its last rating:
 * 4 or 5 good, 1 or 2 off, 3 mixed. No shots yet is "no ratings yet".
 */
export function ratingWord(summary: TriedSummary | null): RatingWord {
  if (!summary) return "noRatings";
  if (summary.kind !== "lastRated") return summary.kind;
  return summary.rating >= 4 ? "mostlyGood" : summary.rating <= 2 ? "mostlyOff" : "mixed";
}

const valueOf: Record<FilterKind, (f: BeanFacet) => string | null> = {
  roaster: (f) => f.roasterId,
  roast: (f) => f.roastLevel,
  origin: (f) => f.origin ?? ORIGIN_NONE,
  rating: (f) => f.rating,
};

export const offersFilters = (facets: readonly BeanFacet[]) => facets.length >= FILTER_MIN_COFFEES;

export type FilterOption = { value: string; count: number };

/**
 * Each filter's choices: only values present, with how many coffees have
 * them. Roasters by name, roast levels light to dark, origins with blends
 * and "not stated" last, ratings in Tried's order. Origin is offered only
 * once some coffee has one (STORY-03-07-03 AC 2). An empty list means the
 * chip isn't shown.
 */
export function filterOptions(
  facets: readonly BeanFacet[],
  { collator = new Intl.Collator(), originName = (o: Origin) => o }: { collator?: Intl.Collator; originName?: (origin: Origin) => string } = {},
): Record<FilterKind, FilterOption[]> {
  const counts = (kind: FilterKind) => {
    const map = new Map<string, number>();
    for (const f of facets) {
      const v = valueOf[kind](f);
      if (v !== null) map.set(v, (map.get(v) ?? 0) + 1);
    }
    return map;
  };
  const list = (map: Map<string, number>, order: (a: string, b: string) => number) =>
    [...map].map(([value, count]) => ({ value, count })).sort((a, b) => order(a.value, b.value));

  const roasterName = new Map(facets.map((f) => [f.roasterId, f.roasterName]));
  const originRank = (v: string) => (v === ORIGIN_NONE ? 3 : v === "blend" ? 2 : originParts(v as Origin).kind === "other" ? 1 : 0);
  return {
    roaster: list(counts("roaster"), (a, b) => collator.compare(roasterName.get(a)!, roasterName.get(b)!)),
    roast: list(counts("roast"), (a, b) => ROAST_LEVELS.indexOf(a as never) - ROAST_LEVELS.indexOf(b as never)),
    origin: facets.some((f) => f.origin)
      ? list(counts("origin"), (a, b) => originRank(a) - originRank(b) || (originRank(a) < 2 ? collator.compare(originName(a as Origin), originName(b as Origin)) : 0))
      : [],
    rating: list(counts("rating"), (a, b) => RATING_WORDS.indexOf(a as RatingWord) - RATING_WORDS.indexOf(b as RatingWord)),
  };
}

/** The coffees matching every filter that's on. */
export function applyFilters(facets: readonly BeanFacet[], filters: BeansFilters): Set<string> {
  const on = FILTER_KINDS.filter((k) => filters[k]);
  return new Set(facets.filter((f) => on.every((k) => valueOf[k](f) === filters[k])).map((f) => f.beanId));
}

export const anyFilterOn = (filters: BeansFilters) => FILTER_KINDS.some((k) => !!filters[k]);

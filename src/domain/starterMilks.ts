/**
 * The milks every new household starts with (STORY-01-01-08), in display
 * order. Kinds, not products: there are no brands (AC 4). Names come from the
 * `milks.*` messages, so they follow the app's language (AC 2); each
 * household gets its own copy (AC 3).
 */
export const STARTER_MILKS = [
  { nameKey: "milks.whole", kind: "dairy" },
  { nameKey: "milks.semiSkimmed", kind: "dairy" },
  { nameKey: "milks.skimmed", kind: "dairy" },
  { nameKey: "milks.oat", kind: "plant" },
  { nameKey: "milks.soy", kind: "plant" },
  { nameKey: "milks.almond", kind: "plant" },
  { nameKey: "milks.lactoseFree", kind: "dairy" },
] as const;

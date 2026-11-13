import type { JournalFilters } from "@/server/dal/journal";

/*
 * The Journal's filters live in its URL (STORY-02-06-04), so back from a
 * shot keeps them (STORY-02-06-05 AC 3) and a link can pre-set them.
 */

export const JOURNAL_PATH = "/journal";
const KEYS = ["drinkId", "beanId", "setupId"] as const;

/** The filters in search params; anything else is ignored. */
export function readJournalFilters(params: Record<string, string | string[] | undefined>): JournalFilters {
  const out: JournalFilters = {};
  for (const key of KEYS) {
    const value = params[key];
    if (typeof value === "string" && value) out[key] = value;
  }
  return out;
}

/** The Journal with these filters. */
export function journalHref(filters: JournalFilters = {}): string {
  const params = new URLSearchParams(KEYS.flatMap((key) => (filters[key] ? [[key, filters[key]!]] : [])));
  const query = params.toString();
  return query ? `${JOURNAL_PATH}?${query}` : JOURNAL_PATH;
}

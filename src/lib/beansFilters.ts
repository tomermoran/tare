import { FILTER_KINDS, type BeansFilters } from "@/domain/beansFilter";

/*
 * Beans' filters live in its URL (STORY-03-07-02), like the Journal's, so
 * back from a bag or a coffee keeps them and the tab's plain link clears
 * them.
 */

export const BEANS_PATH = "/beans";

/** The filters in search params; anything else is ignored. */
export function readBeansFilters(params: Record<string, string | string[] | undefined>): BeansFilters {
  const out: BeansFilters = {};
  for (const key of FILTER_KINDS) {
    const value = params[key];
    if (typeof value === "string" && value) out[key] = value;
  }
  return out;
}

/** Beans with these filters. */
export function beansHref(filters: BeansFilters = {}): string {
  const params = new URLSearchParams(FILTER_KINDS.flatMap((key) => (filters[key] ? [[key, filters[key]!]] : [])));
  const query = params.toString();
  return query ? `${BEANS_PATH}?${query}` : BEANS_PATH;
}

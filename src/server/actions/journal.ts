"use server";

import { fail, runAction, type ActionResult } from "@/lib/actionResult";
import { listJournal, type JournalCursor, type JournalFilters, type JournalPage } from "@/server/dal/journal";

const KEYS = ["drinkId", "beanId", "setupId"] as const;

/** "Show older shots": the next page before the cursor, with the same filters (STORY-02-06-04 AC 3). */
export async function loadOlderShotsAction(before: JournalCursor, filters: JournalFilters = {}): Promise<ActionResult<JournalPage>> {
  if (typeof before?.at !== "number" || typeof before?.id !== "string") return fail("notFound");
  const clean: JournalFilters = {};
  for (const key of KEYS) {
    const value = filters?.[key];
    if (value === undefined) continue;
    if (typeof value !== "string" || !value) return fail("notFound");
    clean[key] = value;
  }
  return runAction(() => listJournal({ before, filters: clean }));
}

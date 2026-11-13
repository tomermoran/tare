"use server";

import { fail, runAction, type ActionResult } from "@/lib/actionResult";
import { listJournal, type JournalCursor, type JournalPage } from "@/server/dal/journal";

/** "Show older shots": the next page before the cursor. */
export async function loadOlderShotsAction(before: JournalCursor): Promise<ActionResult<JournalPage>> {
  if (typeof before?.at !== "number" || typeof before?.id !== "string") return fail("notFound");
  return runAction(() => listJournal({ before }));
}

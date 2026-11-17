import "server-only";
import { count, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { extractions, pinnedRecipes } from "@/db/schema";
import { isLinkedToGoogle } from "@/server/auth/linked";
import { requireSession } from "@/server/auth/session";
import { isHouseholdEmpty } from "./emptiness";
import { requireHousehold } from "./scope";

/*
 * Keeping a history across phones (EPIC-05-03). Linking and switching
 * happen in the browser with Firebase; the server only answers whether this
 * account is linked, whether this device has anything entered, and whether
 * the one-time reminder is due.
 */

/** The household's shots that make a history worth keeping (STORY-05-03-03 AC 1). */
export const LINK_PROMPT_SHOTS = 10;

/** Profile's Account section: linked to Google or not. */
export async function getAccountLink(): Promise<{ linked: boolean }> {
  const { firebaseUid } = await requireSession();
  return { linked: await isLinkedToGoogle(firebaseUid) };
}

/** Nothing entered on this device's household yet: a switch loses nothing (STORY-05-03-04 AC 1). */
export async function canSwitchHistory(): Promise<boolean> {
  const { householdId } = await requireHousehold();
  return isHouseholdEmpty(db, householdId);
}

/** Brew's first-run link shows only while nothing is entered (STORY-05-03-02 AC 3, AC 6). */
export const isThisDeviceEmpty = canSwitchHistory;

/**
 * The one-time reminder (STORY-05-03-03 AC 1): a pinned recipe or the tenth
 * shot, whichever comes first, and not linked. Firebase is asked only once
 * the history is worth keeping, so Brew stays cheap before that.
 */
export async function getLinkPromptDue(): Promise<boolean> {
  const { householdId } = await requireHousehold();
  const [[recipe], [shots]] = await Promise.all([
    db.select({ id: pinnedRecipes.id }).from(pinnedRecipes).where(eq(pinnedRecipes.householdId, householdId)).limit(1),
    db.select({ n: count() }).from(extractions).where(eq(extractions.householdId, householdId)),
  ]);
  if (!recipe && (shots?.n ?? 0) < LINK_PROMPT_SHOTS) return false;
  const { firebaseUid } = await requireSession();
  return !(await isLinkedToGoogle(firebaseUid));
}

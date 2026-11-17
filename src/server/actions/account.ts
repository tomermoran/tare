"use server";

import { runAction, type ActionResult } from "@/lib/actionResult";
import { canSwitchHistory } from "@/server/dal/account";

/**
 * Asked when a Google account already has a Tare history (STORY-05-03-04):
 * true when this device has nothing entered, so switching loses nothing.
 * Nothing is ever merged.
 */
export async function canSwitchHistoryAction(): Promise<ActionResult<boolean>> {
  return runAction(() => canSwitchHistory());
}

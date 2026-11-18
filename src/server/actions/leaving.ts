"use server";

import { runAction, type ActionError } from "@/lib/actionResult";
import { AloneInHouseholdError, leaveHousehold } from "@/server/dal/leaving";

/*
 * SH-LEAVE's confirm (STORY-05-02-07). No one else left comes back by
 * name; any other failure changes nothing and offers a retry.
 */
export async function leaveHouseholdAction(): Promise<{ ok: true; data: null } | { ok: false; error: ActionError | "alone" }> {
  try {
    await leaveHousehold();
    return { ok: true, data: null };
  } catch (e) {
    if (e instanceof AloneInHouseholdError) return { ok: false, error: "alone" };
    return runAction(() => Promise.reject(e));
  }
}

"use server";

import { runAction, type ActionError } from "@/lib/actionResult";
import { checkJoinable, claimInvite, HasHistoryError, InvalidInviteError, type Joinable } from "@/server/dal/joining";

/*
 * SCR-JOIN's actions after Google sign-in (STORY-05-02-02, 05-02-03). An
 * unusable link and an account with history come back by name; anything
 * else is a failure that joined nothing.
 */

export type JoinError = ActionError | "invalid" | "hasHistory";
export type JoinResult<T> = { ok: true; data: T } | { ok: false; error: JoinError };

export async function checkJoinableAction(token: string): Promise<JoinResult<Joinable>> {
  if (typeof token !== "string" || !token) return { ok: false, error: "invalid" };
  return runAction(() => checkJoinable(token));
}

export async function claimInviteAction(token: string): Promise<JoinResult<null>> {
  if (typeof token !== "string" || !token) return { ok: false, error: "invalid" };
  try {
    await claimInvite(token);
    return { ok: true, data: null };
  } catch (e) {
    if (e instanceof InvalidInviteError) return { ok: false, error: "invalid" };
    if (e instanceof HasHistoryError) return { ok: false, error: "hasHistory" };
    return runAction(() => Promise.reject(e));
  }
}

"use server";

import { fail, ok, runAction, type ActionError, type ActionResult } from "@/lib/actionResult";
import { DATED_ACTIONS, type DatedAction } from "@/domain/portionActions";
import { InvalidPortionActionError, setPortionDate, splitPortion } from "@/server/dal/portions";
import { getTimeZone } from "@/server/time";

/** A date the sheet shows in ink on the field (SQ-09), or a general failure. */
export type PortionResult<T = void> =
  | ActionResult<T>
  | { ok: false; error: InvalidPortionActionError["reason"] | ActionError };

async function run<T>(body: () => Promise<T>): Promise<PortionResult<T>> {
  try {
    return ok(await body());
  } catch (e) {
    if (e instanceof InvalidPortionActionError) return { ok: false, error: e.reason };
    return runAction(() => Promise.reject(e));
  }
}

/** SH-DATE's confirm: open, freeze, thaw or finish on a local day, today by default. */
export async function setPortionDateAction(portionId: string, action: DatedAction, day?: string): Promise<PortionResult> {
  if (typeof portionId !== "string" || !portionId || !DATED_ACTIONS.includes(action)) return fail("notFound");
  if (day !== undefined && typeof day !== "string") return { ok: false, error: "badDay" };
  const timeZone = await getTimeZone();
  return run(() => setPortionDate(portionId, action, { day, timeZone }));
}

/** SH-SPLIT's confirm. */
export async function splitPortionAction(portionId: string, takeGrams: number, freezeNew = true): Promise<PortionResult<{ id: string }>> {
  if (typeof portionId !== "string" || !portionId) return fail("notFound");
  return run(() => splitPortion(portionId, takeGrams, { freezeNew: freezeNew !== false }));
}

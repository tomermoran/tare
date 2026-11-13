"use server";

import { fail, ok, runAction, type ActionError, type ActionResult } from "@/lib/actionResult";
import { InvalidBrewControlsError } from "@/domain/brewControls";
import { InvalidMilkError } from "@/domain/milk";
import { InvalidTastingError, type Tasting } from "@/domain/tasting";
import { InvalidShotError, PortionFinishedError, saveMeasuredShot, updateShot, type MeasuredShot, type ShotEdit } from "@/server/dal/shots";
import { saveTasting } from "@/server/dal/tasting";

export type SaveShotResult =
  | { ok: true; data: { id: string } }
  | { ok: false; error: ActionError | "portionFinished" };

/** The shot log's Save (SCR-LOG). Values are canonical: grams and ms. */
export async function saveMeasuredShotAction(input: MeasuredShot): Promise<SaveShotResult> {
  const ids = [input?.setupId, input?.drinkTypeId, input?.portionId];
  if (!ids.every((id) => typeof id === "string" && id)) return fail("notFound");
  try {
    return { ok: true, data: await saveMeasuredShot(input) };
  } catch (e) {
    if (e instanceof PortionFinishedError) return { ok: false, error: "portionFinished" };
    if (e instanceof InvalidShotError || e instanceof InvalidBrewControlsError || e instanceof InvalidMilkError) return fail("saveFailed");
    return runAction(() => Promise.reject(e));
  }
}

/** SCR-TASTE's save, on every way out (STORY-01-05-01 AC 3). */
export async function saveTastingAction(shotId: string, tasting: Tasting): Promise<ActionResult> {
  if (typeof shotId !== "string" || !shotId || !tasting || typeof tasting !== "object") return fail("notFound");
  try {
    await saveTasting(shotId, tasting);
    return ok();
  } catch (e) {
    if (e instanceof InvalidTastingError) return fail("saveFailed");
    return runAction(() => Promise.reject(e));
  }
}

/** Edit mode's "save changes" (STORY-02-06-02 AC 4). */
export async function updateShotAction(shotId: string, edit: ShotEdit): Promise<ActionResult> {
  if (typeof shotId !== "string" || !shotId || !edit || typeof edit !== "object") return fail("notFound");
  try {
    await updateShot(shotId, edit);
    return ok();
  } catch (e) {
    if (e instanceof InvalidShotError || e instanceof InvalidBrewControlsError || e instanceof InvalidMilkError || e instanceof InvalidTastingError) {
      return fail("saveFailed");
    }
    return runAction(() => Promise.reject(e));
  }
}

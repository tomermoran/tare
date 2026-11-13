"use server";

import { fail, runAction, type ActionError } from "@/lib/actionResult";
import { InvalidBrewControlsError } from "@/domain/brewControls";
import { InvalidMilkError } from "@/domain/milk";
import { InvalidShotError, PortionFinishedError, saveMeasuredShot, type MeasuredShot } from "@/server/dal/shots";

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

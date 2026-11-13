"use server";

import { fail, runAction, type ActionResult } from "@/lib/actionResult";
import { pullShot, undoPull, type PullInput, type PullResult } from "@/server/dal/pull";

/** Brew's "Pull this shot" (SCR-HOME); a retry sends the same `clientId`. */
export async function pullShotAction(input: PullInput): Promise<ActionResult<PullResult>> {
  const ids = [input?.clientId, input?.drinkTypeId, input?.beanId];
  if (!ids.every((id) => typeof id === "string" && id)) return fail("notFound");
  if (input.portionId !== undefined && typeof input.portionId !== "string") return fail("notFound");
  return runAction(() => pullShot({ clientId: input.clientId, drinkTypeId: input.drinkTypeId, beanId: input.beanId, portionId: input.portionId }));
}

/** Undo on the pulled state, within its window (STORY-02-02-04). */
export async function undoPullAction(shotId: string): Promise<ActionResult> {
  if (typeof shotId !== "string" || !shotId) return fail("notFound");
  return runAction(() => undoPull(shotId));
}

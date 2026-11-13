"use server";

import { fail, ok, runAction, type ActionResult } from "@/lib/actionResult";
import { InvalidTastingError, type Tasting } from "@/domain/tasting";
import { getOffContext, NotOneTapError, saveOffAnswers, setReaction, type OffContext, type Reaction } from "@/server/dal/reaction";

/** Good, off or none on a one-tap shot (STORY-02-03-01). */
export async function setReactionAction(shotId: string, reaction: Reaction | null): Promise<ActionResult> {
  if (typeof shotId !== "string" || !shotId) return fail("notFound");
  return guarded(() => setReaction(shotId, reaction));
}

/** SH-OFF's answers, on every way out (STORY-02-03-04 AC 2). */
export async function saveOffAnswersAction(shotId: string, tasting: Omit<Tasting, "rating">): Promise<ActionResult> {
  if (typeof shotId !== "string" || !shotId || !tasting || typeof tasting !== "object") return fail("notFound");
  return guarded(() => saveOffAnswers(shotId, tasting));
}

/** What SH-OFF opens with. */
export async function getOffContextAction(shotId: string): Promise<ActionResult<OffContext>> {
  if (typeof shotId !== "string" || !shotId) return fail("notFound");
  return guarded(() => getOffContext(shotId));
}

async function guarded<T>(body: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return ok(await body());
  } catch (e) {
    if (e instanceof InvalidTastingError || e instanceof NotOneTapError) return fail("saveFailed");
    return runAction(() => Promise.reject(e));
  }
}

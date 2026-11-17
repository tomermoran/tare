"use server";

import { fail, runAction, type ActionResult } from "@/lib/actionResult";
import {
  enteredPinPreview,
  pinEnteredRecipe,
  pinFromShot,
  pinPreview,
  removeBagRecipe,
  type EnteredRecipe,
  type PinPreview,
  type PinScope,
} from "@/server/dal/recipes";

/*
 * SH-PIN (EPIC-02-01): the preview it shows and its confirm. A one-tap shot
 * or a value out of range is a failed save; nothing is pinned (AC 6). The
 * scope says whether the pin is for the coffee or for one bag only
 * (STORY-02-04-01); a bag pin the server refuses is a failed save too.
 */

const validId = (id: unknown): id is string => typeof id === "string" && id.length > 0;
const asScope = (scope: unknown): PinScope => (scope === "batch" ? "batch" : "bean");

export async function pinPreviewAction(shotId: string): Promise<ActionResult<PinPreview>> {
  if (!validId(shotId)) return fail("notFound");
  return runAction(() => pinPreview(shotId));
}

export async function pinFromShotAction(shotId: string, scope: PinScope = "bean"): Promise<ActionResult<{ id: string }>> {
  if (!validId(shotId)) return fail("notFound");
  return runAction(() => pinFromShot(shotId, new Date(), asScope(scope)));
}

const validEntered = (input: EnteredRecipe) =>
  !!input && validId(input.batchId) && validId(input.setupId) && validId(input.drinkTypeId) && !!input.values && typeof input.values === "object";

export async function enteredPinPreviewAction(input: EnteredRecipe): Promise<ActionResult<PinPreview>> {
  if (!validEntered(input)) return fail("notFound");
  return runAction(() => enteredPinPreview(input));
}

export async function pinEnteredRecipeAction(input: EnteredRecipe, scope: PinScope = "bean"): Promise<ActionResult<{ id: string }>> {
  if (!validEntered(input)) return fail("notFound");
  return runAction(() => pinEnteredRecipe(input, new Date(), asScope(scope)));
}

/** Use the coffee's recipe for this bag again (STORY-02-04-04). */
export async function removeBagRecipeAction(input: { batchId: string; setupId: string; drinkTypeId: string }): Promise<ActionResult<void>> {
  if (!input || !validId(input.batchId) || !validId(input.setupId) || !validId(input.drinkTypeId)) return fail("notFound");
  return runAction(() => removeBagRecipe({ batchId: input.batchId, setupId: input.setupId, drinkTypeId: input.drinkTypeId }));
}

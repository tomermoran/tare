"use server";

import { fail, runAction, type ActionResult } from "@/lib/actionResult";
import {
  enteredPinPreview,
  pinEnteredRecipe,
  pinFromShot,
  pinPreview,
  type EnteredRecipe,
  type PinPreview,
} from "@/server/dal/recipes";

/*
 * SH-PIN (EPIC-02-01): the preview it shows and its confirm. A one-tap shot
 * or a value out of range is a failed save; nothing is pinned (AC 6).
 */

const validId = (id: unknown): id is string => typeof id === "string" && id.length > 0;

export async function pinPreviewAction(shotId: string): Promise<ActionResult<PinPreview>> {
  if (!validId(shotId)) return fail("notFound");
  return runAction(() => pinPreview(shotId));
}

export async function pinFromShotAction(shotId: string): Promise<ActionResult<{ id: string }>> {
  if (!validId(shotId)) return fail("notFound");
  return runAction(() => pinFromShot(shotId));
}

const validEntered = (input: EnteredRecipe) =>
  !!input && validId(input.batchId) && validId(input.setupId) && validId(input.drinkTypeId) && !!input.values && typeof input.values === "object";

export async function enteredPinPreviewAction(input: EnteredRecipe): Promise<ActionResult<PinPreview>> {
  if (!validEntered(input)) return fail("notFound");
  return runAction(() => enteredPinPreview(input));
}

export async function pinEnteredRecipeAction(input: EnteredRecipe): Promise<ActionResult<{ id: string }>> {
  if (!validEntered(input)) return fail("notFound");
  return runAction(() => pinEnteredRecipe(input));
}

"use server";

import { fail, ok, runAction, type ActionResult } from "@/lib/actionResult";
import { addMaintenance, InvalidMaintenanceError, type MaintenanceInput } from "@/server/dal/maintenance";
import {
  confirmShift,
  getOffsetProposal,
  InvalidShiftError,
  previewShift,
  setEventShift,
  getEvent,
  type EventDetail,
  type OffsetProposal,
  type ShiftPreview,
} from "@/server/dal/redial";
import { getTimeZone } from "@/server/time";

/** SH-MAINTENANCE's save (STORY-04-01-01): dated on the device's local day. */
export async function addMaintenanceAction(partId: string, input: MaintenanceInput): Promise<ActionResult<{ id: string }>> {
  if (typeof partId !== "string" || !partId || !input || typeof input !== "object") return fail("notFound");
  try {
    return ok(await addMaintenance(partId, input, { timeZone: await getTimeZone() }));
  } catch (e) {
    if (e instanceof InvalidMaintenanceError) return fail("saveFailed");
    return runAction(() => Promise.reject(e));
  }
}

/** SH-OFFSET's confirm, edit or decline (STORY-04-03-02); 0 declines. A stretch is a percent (STORY-04-04-02). */
export async function confirmShiftAction(eventId: string, shift: number, sourceRecipeId: string | null, stretch = 0): Promise<ActionResult<null>> {
  if (typeof eventId !== "string" || !eventId || typeof shift !== "number") return fail("notFound");
  if (sourceRecipeId !== null && typeof sourceRecipeId !== "string") return fail("notFound");
  return shiftResult(() => confirmShift(eventId, shift, sourceRecipeId, stretch));
}

/** SH-OFFSET in edit mode, from the grinder's screen (STORY-04-03-05); 0 removes the shift. */
export async function setEventShiftAction(eventId: string, shift: number, stretch = 0): Promise<ActionResult<null>> {
  if (typeof eventId !== "string" || !eventId || typeof shift !== "number") return fail("notFound");
  return shiftResult(() => setEventShift(eventId, shift, stretch));
}

/** What a shift would change, as the wheel moves (STORY-04-03-02 AC 1). */
export async function previewShiftAction(eventId: string, shift: number, exceptRecipeId: string | null, stretch = 0): Promise<ActionResult<ShiftPreview>> {
  if (typeof eventId !== "string" || !eventId || typeof shift !== "number" || !Number.isFinite(shift)) return fail("notFound");
  return runAction(() => previewShift(eventId, shift, exceptRecipeId, stretch));
}

/** The proposal after a pin (STORY-04-03-01); a failure tells the sheet no shift could be proposed (AC 6). */
export async function offsetProposalAction(recipeId: string): Promise<ActionResult<OffsetProposal>> {
  if (typeof recipeId !== "string" || !recipeId) return fail("notFound");
  return runAction(() => getOffsetProposal(recipeId));
}

async function shiftResult(write: () => Promise<void>): Promise<ActionResult<null>> {
  try {
    await write();
    return ok(null);
  } catch (e) {
    if (e instanceof InvalidShiftError) return fail("saveFailed");
    return runAction(() => Promise.reject(e));
  }
}

/** One event's shift and state, to open it from the grinder's screen (STORY-04-03-05). */
export async function getEventAction(eventId: string): Promise<ActionResult<EventDetail>> {
  if (typeof eventId !== "string" || !eventId) return fail("notFound");
  return runAction(() => getEvent(eventId));
}

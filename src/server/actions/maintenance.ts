"use server";

import { fail, ok, runAction, type ActionResult } from "@/lib/actionResult";
import { addMaintenance, InvalidMaintenanceError, type MaintenanceInput } from "@/server/dal/maintenance";
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

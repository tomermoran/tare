"use server";

import { isValidDayKey, localNoon } from "@/domain/localDay";
import { fail, runAction, type ActionResult } from "@/lib/actionResult";
import { addPart } from "@/server/dal/parts";
import { getTimeZone } from "@/server/time";

/**
 * Saves a part from SCR-UNIT-ADD. `acquired` is the date field's value
 * (YYYY-MM-DD, optional), stored at local noon so it stays on that day.
 */
export async function addPartAction(input: {
  hardwareId: string;
  nickname?: string;
  acquired?: string;
}): Promise<ActionResult<{ id: string; kind: string }>> {
  if (typeof input?.hardwareId !== "string" || !input.hardwareId) return fail("notFound");
  const acquired = input.acquired?.trim();
  if (acquired && !isValidDayKey(acquired)) return fail("saveFailed");
  return runAction(async () =>
    addPart({
      hardwareId: input.hardwareId,
      nickname: input.nickname,
      acquiredAt: acquired ? localNoon(acquired, await getTimeZone()) : null,
    }),
  );
}

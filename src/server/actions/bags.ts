"use server";

import { isValidDayKey, localDayKey, localNoon } from "@/domain/localDay";
import { fail, runAction, type ActionError } from "@/lib/actionResult";
import { addBag, WeightRequiredError } from "@/server/dal/bags";
import { getTimeZone } from "@/server/time";

export type AddBagResult =
  | { ok: true; data: { batchId: string; portionId: string } }
  | { ok: false; error: ActionError | "weightRequired" };

/**
 * Saves a bag from SCR-BAG-ADD. Dates are the date fields' values
 * (YYYY-MM-DD, optional), each stored at local noon in the device's zone so
 * it stays on that day. The purchase date defaults to today there.
 */
export async function addBagAction(input: {
  beanId: string;
  bagWeight: number;
  roastDate?: string;
  packedAt?: string;
  bestBefore?: string;
  lotCode?: string;
  purchasedAt?: string;
}): Promise<AddBagResult> {
  if (typeof input?.beanId !== "string" || !input.beanId) return fail("notFound");
  const dates = [input.roastDate, input.packedAt, input.bestBefore, input.purchasedAt].map((d) => d?.trim() || "");
  if (dates.some((d) => d && !isValidDayKey(d))) return fail("saveFailed");
  const zone = await getTimeZone();
  const day = (d: string) => (d ? localNoon(d, zone) : null);
  const [roastDate, packedAt, bestBefore, purchased] = dates;
  try {
    const data = await addBag({
      beanId: input.beanId,
      bagWeight: Number(input.bagWeight),
      roastDate: day(roastDate),
      packedAt: day(packedAt),
      bestBefore: day(bestBefore),
      lotCode: input.lotCode,
      purchasedAt: day(purchased || localDayKey(new Date(), zone)),
    });
    return { ok: true, data };
  } catch (e) {
    if (e instanceof WeightRequiredError) return { ok: false, error: "weightRequired" };
    return runAction(() => Promise.reject(e));
  }
}

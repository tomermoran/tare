import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, roasters } from "@/db/schema";
import { resolveEntity } from "./catalogMerge";
import { NotFoundError, requireHousehold } from "./scope";

/*
 * Bags (STORY-03-01-02). A bag is a batch; what physically exists is its
 * portions, and a new bag is one unopened portion of the whole weight.
 */

/** No usable weight was given; nothing was saved (AC 5). */
export class WeightRequiredError extends Error {
  constructor() {
    super("Weight required");
    this.name = "WeightRequiredError";
  }
}

/** Grams; a bag of coffee is never more than this. */
export const MAX_BAG_GRAMS = 10_000;

/** A bean the household can see, followed to its merge survivor; null if not. */
export async function visibleBean(householdId: string, beanId: string) {
  const id = await resolveEntity(db, canonicalBeans, beanId);
  if (!id) return null;
  const [row] = await db
    .select({
      id: canonicalBeans.id,
      name: canonicalBeans.name,
      roasterName: roasters.name,
      status: canonicalBeans.status,
      owner: canonicalBeans.createdByHouseholdId,
    })
    .from(canonicalBeans)
    .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
    .where(eq(canonicalBeans.id, id));
  if (!row || !(row.status === "verified" || row.owner === householdId)) return null;
  return { id: row.id, name: row.name, roasterName: row.roasterName };
}

/** The coffee chosen for a new bag, for SCR-BAG-ADD; null if it can't be used. */
export async function getBagBean(beanId: string) {
  const { householdId } = await requireHousehold();
  return visibleBean(householdId, beanId);
}

/**
 * Adds a bag of a coffee the household can see, with one unopened portion
 * holding the whole weight (AC 1). Dates are optional (AC 2, AC 4); each
 * new bag is its own batch, even of the same coffee (AC 6).
 */
export async function addBag(input: {
  beanId: string;
  bagWeight: number;
  roastDate?: Date | null;
  packedAt?: Date | null;
  bestBefore?: Date | null;
  lotCode?: string | null;
  purchasedAt?: Date | null;
}): Promise<{ batchId: string; portionId: string }> {
  const { householdId } = await requireHousehold();
  const weight = input.bagWeight;
  if (!Number.isFinite(weight) || weight <= 0 || weight > MAX_BAG_GRAMS) throw new WeightRequiredError();
  const bean = await visibleBean(householdId, input.beanId);
  if (!bean) throw new NotFoundError();

  const now = new Date();
  const batchId = newId();
  const portionId = newId();
  await db.batch([
    db.insert(batches).values({
      id: batchId,
      householdId,
      beanId: bean.id,
      bagWeight: weight,
      roastDate: input.roastDate ?? null,
      packedAt: input.packedAt ?? null,
      bestBefore: input.bestBefore ?? null,
      lotCode: input.lotCode?.trim().slice(0, 60) || null,
      purchasedAt: input.purchasedAt ?? null,
      createdAt: now,
    }),
    db.insert(batchPortions).values({ id: portionId, batchId, weight, createdAt: now }),
  ]);
  return { batchId, portionId };
}

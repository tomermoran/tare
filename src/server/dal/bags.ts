import "server-only";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, roasters } from "@/db/schema";
import { openSince, portionState, type PortionState } from "@/domain/portionState";
import { groupOnHand, pantryGroup, pantryOrder, type PantryGroup } from "@/domain/onHandGroups";
import { openedClock, type OpenedClock } from "@/domain/openedClock";
import { roastingClock, type RoastingClock } from "@/domain/roastingClock";
import { bagStatus, type BagStatus } from "@/domain/bagStatus";
import { getTimeZone } from "@/server/time";
import type { Remaining } from "@/domain/remaining";
import { getRemaining } from "./remaining";
import { resolveEntity } from "./catalogMerge";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";

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

export type PortionView = {
  id: string;
  weight: number;
  state: PortionState;
  openedAt: Date | null;
  /** When it became open (openSince); null while not open. */
  openSince: Date | null;
  frozenAt: Date | null;
  /** How long it's been open, less freezer days (STORY-03-03-04). */
  opened: OpenedClock;
  /** How old its coffee is, less its own freezer days (STORY-03-03-01, STORY-03-03-02). */
  roasting: RoastingClock;
  /** What's left (STORY-03-04-01): grams, and whether the doses ran over. */
  remaining: Remaining;
};

export type BagView = {
  id: string;
  bean: { id: string; name: string; roasterName: string };
  roastDate: Date | null;
  packedAt: Date | null;
  bestBefore: Date | null;
  lotCode: string | null;
  purchasedAt: Date | null;
  bagWeight: number;
  createdAt: Date;
  /** Open, finished or neither (STORY-03-04-03), from all its portions. */
  status: BagStatus;
  /** The bag's one roasting clock: that of the portion in use, else the bag's own (STORY-03-03-04 AC 3). */
  roasting: RoastingClock;
  portions: PortionView[];
};

/** The household's bags with their portions, beans followed to survivors (AC 6). */
async function bagsOf(householdId: string, batchIds?: string[], now = new Date()): Promise<BagView[]> {
  const timeZone = await getTimeZone();
  const rows = await db
    .select()
    .from(batches)
    .where(
      and(
        eq(batches.householdId, householdId),
        batchIds ? inArray(batches.id, batchIds.length ? batchIds : [""]) : undefined,
      ),
    )
    .orderBy(desc(batches.createdAt));
  if (!rows.length) return [];
  const portions = await db
    .select()
    .from(batchPortions)
    .where(inArray(batchPortions.batchId, rows.map((r) => r.id)))
    .orderBy(asc(batchPortions.createdAt));
  const remaining = await getRemaining(portions.map((p) => p.id));

  const beans = new Map<string, BagView["bean"]>();
  for (const r of rows) {
    if (beans.has(r.beanId)) continue;
    const id = (await resolveEntity(db, canonicalBeans, r.beanId)) ?? r.beanId;
    const [bean] = await db
      .select({ id: canonicalBeans.id, name: canonicalBeans.name, roasterName: roasters.name })
      .from(canonicalBeans)
      .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
      .where(eq(canonicalBeans.id, id));
    beans.set(r.beanId, bean);
  }

  return rows.map((r) => {
    const own = portions.filter((p) => p.batchId === r.id);
    const views: PortionView[] = own.map((p) => ({
      id: p.id,
      weight: p.weight,
      state: portionState(p),
      openedAt: p.openedAt,
      openSince: openSince(p),
      frozenAt: p.frozenAt,
      opened: openedClock(p, now, timeZone),
      roasting: roastingClock(r, p, now, timeZone),
      remaining: remaining.get(p.id) ?? { grams: p.weight, overLogged: false },
    }));
    // The portion in use is the first unfinished one in pantry order.
    const item = (v: PortionView) => ({ group: pantryGroup(v)!, openSince: v.openSince, addedAt: r.createdAt });
    const [inUse] = views.filter((v) => pantryGroup(v)).sort((a, b) => pantryOrder(item(a), item(b)));
    return {
      id: r.id,
      bean: beans.get(r.beanId)!,
      roastDate: r.roastDate,
      packedAt: r.packedAt,
      bestBefore: r.bestBefore,
      lotCode: r.lotCode,
      purchasedAt: r.purchasedAt,
      bagWeight: r.bagWeight,
      createdAt: r.createdAt,
      status: bagStatus(own),
      roasting: inUse ? inUse.roasting : roastingClock(r, null, now, timeZone),
      portions: views,
    };
  });
}

export type OnHandGroup = { group: PantryGroup; bags: BagView[] };

/**
 * On hand (STORY-03-01-04, STORY-03-02-05): bags with any portion not
 * finished, each with its unfinished portions (AC 1), in groups: open,
 * unopened, frozen. A bag sits once, in its first qualifying group; a bag
 * whose portions are all finished leaves (AC 3); empty groups are left out.
 */
export async function getOnHand(): Promise<OnHandGroup[]> {
  const { householdId } = await requireHousehold();
  const bags = (await bagsOf(householdId))
    .map((b) => ({ ...b, portions: b.portions.filter((p) => p.state !== "finished") }))
    .filter((b) => b.portions.length > 0);
  return groupOnHand(bags);
}

/** One bag with its facts and every portion (AC 2). */
export async function getBag(batchId: string): Promise<BagView> {
  const { householdId } = await requireHousehold();
  await assertOwned("batches", batchId, householdId);
  const [bag] = await bagsOf(householdId, [batchId]);
  return bag;
}

import "server-only";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalBeans, extractions, roasters } from "@/db/schema";
import { triedSummary, type TriedShot, type TriedSummary } from "@/domain/triedSummary";
import { resolveEntity } from "./catalogMerge";
import { requireHousehold } from "./scope";

/*
 * Tried (STORY-03-06-01, DQ-27): every coffee the household has brewed at
 * least once, measured or one-tap, newest-had first. Merged catalog entries
 * are one coffee. Worked out from the shots on every read, never stored.
 */

export type TriedCoffee = {
  /** The surviving catalog entry. */
  beanId: string;
  name: string;
  roasterName: string;
  lastHad: Date;
  /** Bags of it the household has had, finished or not (AC 2). */
  bagCount: number;
  summary: TriedSummary;
};

export async function getTried(): Promise<TriedCoffee[]> {
  const { householdId } = await requireHousehold();
  const [shots, bags] = await Promise.all([
    db
      .select({ beanId: batches.beanId, at: extractions.createdAt, rating: extractions.userRating, reaction: extractions.reaction })
      .from(extractions)
      .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
      .innerJoin(batches, eq(batches.id, batchPortions.batchId))
      .where(eq(extractions.householdId, householdId))
      .orderBy(desc(extractions.createdAt), desc(extractions.id)),
    db.select({ beanId: batches.beanId }).from(batches).where(eq(batches.householdId, householdId)),
  ]);

  const survivors = new Map<string, string>();
  for (const id of new Set([...shots, ...bags].map((r) => r.beanId))) survivors.set(id, (await resolveEntity(db, canonicalBeans, id)) ?? id);

  // Shots arrive newest first, so each coffee's first shot is its last had.
  const byCoffee = new Map<string, { lastHad: Date; shots: TriedShot[] }>();
  for (const s of shots) {
    const id = survivors.get(s.beanId)!;
    const entry = byCoffee.get(id) ?? byCoffee.set(id, { lastHad: s.at, shots: [] }).get(id)!;
    entry.shots.push({ rating: s.rating, reaction: s.reaction ?? null });
  }
  if (byCoffee.size === 0) return [];

  const bagCount = new Map<string, number>();
  for (const b of bags) {
    const id = survivors.get(b.beanId)!;
    bagCount.set(id, (bagCount.get(id) ?? 0) + 1);
  }
  const names = await db
    .select({ id: canonicalBeans.id, name: canonicalBeans.name, roasterName: roasters.name })
    .from(canonicalBeans)
    .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
    .where(inArray(canonicalBeans.id, [...byCoffee.keys()]));
  const nameOf = new Map(names.map((n) => [n.id, n]));

  return [...byCoffee].map(([beanId, { lastHad, shots: list }]) => ({
    beanId,
    name: nameOf.get(beanId)?.name ?? "",
    roasterName: nameOf.get(beanId)?.roasterName ?? "",
    lastHad,
    bagCount: bagCount.get(beanId) ?? 0,
    summary: triedSummary(list),
  }));
}

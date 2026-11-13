import "server-only";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions } from "@/db/schema";
import type { Remaining } from "@/domain/remaining";
import { requireHousehold } from "./scope";

/**
 * What's left in each portion (STORY-03-04-01), in one query: the latest
 * stock check (else the weight) minus the doses of every shot after it,
 * measured and one-tap alike. The same rule as `remainingWeight`, clamped
 * at zero with `overLogged`. Other households' portions are left out.
 */
export async function getRemaining(portionIds: readonly string[]): Promise<Map<string, Remaining>> {
  if (portionIds.length === 0) return new Map();
  const { householdId } = await requireHousehold();
  const latest = sql`(select s.id from stock_checks s where s.portion_id = ${batchPortions.id} order by s.checked_at desc limit 1)`;
  const rows = await db
    .select({
      id: batchPortions.id,
      start: sql<number>`coalesce((select c.remaining_weight from stock_checks c where c.id = ${latest}), ${batchPortions.weight})`,
      used: sql<number>`coalesce((
        select sum(e.dose_weight) from extractions e
        where e.portion_id = ${batchPortions.id}
          and e.created_at > coalesce((select c.checked_at from stock_checks c where c.id = ${latest}), -1)
      ), 0)`,
    })
    .from(batchPortions)
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(and(inArray(batchPortions.id, [...portionIds]), eq(batches.householdId, householdId)));

  return new Map(
    rows.map((r) => {
      const left = Math.round((Number(r.start) - Number(r.used)) * 10) / 10;
      return [r.id, left < 0 ? { grams: 0, overLogged: true } : { grams: left, overLogged: false }];
    }),
  );
}

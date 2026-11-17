import "server-only";
import { eq, inArray } from "drizzle-orm";
import { unstable_rethrow } from "next/navigation";
import { db } from "@/db/client";
import { batches, batchPortions, extractions, stockChecks } from "@/db/schema";
import { runOut, type RunOut } from "@/domain/runOut";
import { runOutSpan, type RunOutSpan } from "@/domain/runOutSpan";
import { requireHousehold } from "./scope";

/*
 * The run-out read (EPIC-03-05): every portion the household has had, the
 * dose of every shot on them and their stock checks, through the run-out
 * rule. Household-wide, never filtered by persona. Worked out on every read,
 * never stored. The line is secondary, so any failure is null and Beans
 * leaves it out (STORY-03-05-01 AC 5).
 */

export type RunOutView = RunOut & {
  /** How long what's on hand lasts, with an estimate only. */
  span: RunOutSpan | null;
};

export async function getRunOut(now: Date): Promise<RunOutView | null> {
  try {
    return await read(now);
  } catch (e) {
    // Next's own signals (a dynamic read while prerendering) aren't failures.
    unstable_rethrow(e);
    return null;
  }
}

async function read(now: Date): Promise<RunOutView> {
  const { householdId } = await requireHousehold();
  const portions = await db
    .select({
      id: batchPortions.id,
      weight: batchPortions.weight,
      frozenAt: batchPortions.frozenAt,
      thawedAt: batchPortions.thawedAt,
      openedAt: batchPortions.openedAt,
      finishedAt: batchPortions.finishedAt,
      createdAt: batchPortions.createdAt,
      purchasedAt: batches.purchasedAt,
    })
    .from(batchPortions)
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(eq(batches.householdId, householdId));
  const ids = portions.map((p) => p.id);
  const [doses, checks] = ids.length
    ? await Promise.all([
        db
          .select({ portionId: extractions.portionId, grams: extractions.doseWeight, at: extractions.createdAt })
          .from(extractions)
          .where(inArray(extractions.portionId, ids)),
        db
          .select({ portionId: stockChecks.portionId, grams: stockChecks.remainingWeight, at: stockChecks.checkedAt })
          .from(stockChecks)
          .where(inArray(stockChecks.portionId, ids)),
      ])
    : [[], []];

  const result = runOut({
    portions,
    doses: doses.flatMap((d) => (d.portionId ? [{ portionId: d.portionId, grams: d.grams, at: d.at }] : [])),
    stockChecks: checks,
    now,
  });
  const span =
    result.kind === "estimate"
      ? runOutSpan({ grams: result.onHand.grams, frozenGrams: result.onHand.frozenGrams, weeklyGrams: result.weeklyGrams, now })
      : null;
  return { ...result, span };
}

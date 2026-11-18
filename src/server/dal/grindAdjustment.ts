import "server-only";
import { eq } from "drizzle-orm";
import { unstable_rethrow } from "next/navigation";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalHardware, ownedHardware, setupParts } from "@/db/schema";
import { adjustGrind, type GrindAdjustment } from "@/domain/drift";
import { grindWheelConfig } from "@/domain/grind";
import { observe } from "@/server/observe";
import { getTimeZone } from "@/server/time";
import { grindScaleOf } from "./dialIn";
import { agesAt, readDrift } from "./driftShots";
import { requireHousehold } from "./scope";

/*
 * The grind adjustment for a recipe on Brew, a dial in and a one-tap pull
 * (TD-4): server side only, worked out on read and never stored. Any error
 * gives null, so Brew shows the recipe's grind and a pull is never blocked
 * (STORY-04-02-06 AC 6). Fix, dial in from a shot, edit and entering a
 * recipe never call it (DQ-34).
 */

export type { GrindAdjustment } from "@/domain/drift";

export async function getGrindAdjustment(input: {
  recipe: { beanId: string; setupId: string; grind: number };
  /** The portion in use; null when none is open. */
  portionId: string | null;
  now?: Date;
}): Promise<GrindAdjustment | null> {
  try {
    const { householdId } = await requireHousehold();
    const now = input.now ?? new Date();
    const parts = await db
      .select({ id: ownedHardware.id, kind: canonicalHardware.kind })
      .from(setupParts)
      .innerJoin(ownedHardware, eq(ownedHardware.id, setupParts.ownedHardwareId))
      .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
      .where(eq(setupParts.setupId, input.recipe.setupId));
    const grinderId = parts.find((p) => p.kind === "grinder")?.id;
    if (!grinderId) {
      observe("drift.outcome", { outcome: "none", reason: "noGrinder" });
      return null;
    }
    const [timeZone, scale, portion] = await Promise.all([
      getTimeZone(),
      grindScaleOf(grinderId),
      input.portionId
        ? db
            .select({
              batchId: batchPortions.batchId,
              roastDate: batches.roastDate,
              packedAt: batches.packedAt,
              bestBefore: batches.bestBefore,
              frozenAt: batchPortions.frozenAt,
              thawedAt: batchPortions.thawedAt,
              openedAt: batchPortions.openedAt,
              finishedAt: batchPortions.finishedAt,
            })
            .from(batchPortions)
            .innerJoin(batches, eq(batches.id, batchPortions.batchId))
            .where(eq(batchPortions.id, input.portionId))
            .then(([p]) => p ?? null)
        : null,
    ]);
    const read = await readDrift({
      householdId,
      grinderId,
      basketId: parts.find((p) => p.kind === "basket")?.id ?? null,
      beanId: input.recipe.beanId,
      now,
      timeZone,
    });
    const out = adjustGrind({
      now,
      wheel: grindWheelConfig(scale),
      recipe: { grind: input.recipe.grind },
      batchId: portion?.batchId ?? null,
      age: portion ? agesAt(portion, portion, now, timeZone) : { roastDays: null, openedDays: null },
      periodStart: read.periodStart,
      shots: read.shots,
      pins: read.pins,
    });
    if (out.kind === "none") {
      observe("drift.outcome", { outcome: "none", reason: out.reason });
      return null;
    }
    const e = out.adjustment.evidence;
    observe("drift.outcome", { outcome: out.kind, measured: e.measured, people: e.people, leftOut: e.leftOutPrep + e.leftOutNoRecipe });
    return out.adjustment;
  } catch (e) {
    unstable_rethrow(e);
    observe("drift.outcome", { outcome: "failed", reason: "error" });
    return null;
  }
}

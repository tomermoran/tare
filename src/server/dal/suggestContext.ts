import "server-only";
import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalBeans, canonicalHardware, drinkTypes, extractions, maintenanceEvents, ownedHardware, setupParts } from "@/db/schema";
import { parseCapabilities } from "@/domain/capabilities";
import { currentPeriodStart } from "@/domain/grindPeriods";
import { openedClock } from "@/domain/openedClock";
import { roastingClock } from "@/domain/roastingClock";
import type { SuggestInput } from "@/domain/suggest";
import { getTimeZone } from "@/server/time";
import { mergeGroup } from "./catalogMerge";
import { getCurrentRecipe } from "./recipes";
import { assertOwned, requireHousehold } from "./scope";

/*
 * Everything the suggestion engine needs about a saved shot except the
 * answers, which change on the device (TASK-02-03-05-FE2): the shot, its
 * recipe's time, what its setup can do, the shot before it in the same
 * grind period, and the portion's clocks. Read once when the screen opens;
 * the engine then runs on every answer change with nothing more fetched.
 */

export type SuggestContext = Omit<SuggestInput, "answers" | "tags"> & {
  /** The grinder, for telling Tare its direction when that's "not sure". */
  grinderPartId: string | null;
};

export async function getSuggestContext(shotId: string, now = new Date()): Promise<SuggestContext> {
  const { householdId } = await requireHousehold();
  await assertOwned("extractions", shotId, householdId);
  const [r] = await db
    .select({
      shot: extractions,
      milkDrink: drinkTypes.hasMilk,
      beanId: batches.beanId,
      roastDate: batches.roastDate,
      packedAt: batches.packedAt,
      bestBefore: batches.bestBefore,
      frozenAt: batchPortions.frozenAt,
      thawedAt: batchPortions.thawedAt,
      openedAt: batchPortions.openedAt,
      finishedAt: batchPortions.finishedAt,
    })
    .from(extractions)
    .innerJoin(drinkTypes, eq(drinkTypes.id, extractions.drinkTypeId))
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(eq(extractions.id, shotId));
  const s = r.shot;

  const parts = await db
    .select({ id: ownedHardware.id, kind: canonicalHardware.kind, capabilities: canonicalHardware.capabilities })
    .from(setupParts)
    .innerJoin(ownedHardware, eq(ownedHardware.id, setupParts.ownedHardwareId))
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(eq(setupParts.setupId, s.setupId));
  const part = (kind: string) => parts.find((p) => p.kind === kind);
  const grinder = part("grinder");
  const machine = part("machine") && parseCapabilities("machine", part("machine")!.capabilities);
  const basket = part("basket") && parseCapabilities("basket", part("basket")!.capabilities);
  const temperature = machine ? machine.temperature.control === "exact" || machine.temperature.control === "steps" : false;

  const [recipe, previous, timeZone] = await Promise.all([
    getCurrentRecipe({ beanId: r.beanId, personaId: s.personaId, setupId: s.setupId, drinkTypeId: s.drinkTypeId }),
    previousInPeriod(householdId, s, r.beanId, grinder?.id ?? null),
    getTimeZone(),
  ]);
  const portion = { frozenAt: r.frozenAt, thawedAt: r.thawedAt, openedAt: r.openedAt, finishedAt: r.finishedAt };

  return {
    shot: {
      grind: s.grindSize,
      dose: s.doseWeight,
      yield: s.yieldWeight,
      timeMs: s.yieldTime,
      brewTempC: s.brewTempC,
      prep: { wdt: s.usedWdt, puckScreen: s.usedPuckScreen },
      milkMl: s.milkMl,
      milkDrink: r.milkDrink,
    },
    recipe: recipe ? { timeMs: recipe.timeMs } : null,
    setup: {
      grind: grinder ? (parseCapabilities("grinder", grinder.capabilities)?.grind ?? null) : null,
      temperature,
      doseRange: basket ? basket.dose : null,
    },
    previous,
    clocks: {
      roasting: roastingClock({ roastDate: r.roastDate, packedAt: r.packedAt, bestBefore: r.bestBefore }, portion, now, timeZone),
      opened: openedClock(portion, now, timeZone),
    },
    grinderPartId: grinder?.id ?? null,
  };
}

/**
 * The measured shot just before this one on the same coffee, setup and
 * drink, if it's in the grinder's grind period at this shot's time. Shots
 * either side of a grinder event aren't comparable (STORY-04-01-03).
 */
async function previousInPeriod(
  householdId: string,
  s: typeof extractions.$inferSelect,
  beanId: string,
  grinderPartId: string | null,
): Promise<SuggestInput["previous"]> {
  const events = grinderPartId
    ? await db.select({ at: maintenanceEvents.occurredAt }).from(maintenanceEvents).where(eq(maintenanceEvents.ownedHardwareId, grinderPartId))
    : [];
  const since = currentPeriodStart(events, s.createdAt);
  const beans = await mergeGroup(db, canonicalBeans, beanId);
  const [row] = await db
    .select({ grind: extractions.grindSize, balance: extractions.tasteBalance })
    .from(extractions)
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(
      and(
        eq(extractions.householdId, householdId),
        eq(extractions.personaId, s.personaId),
        eq(extractions.setupId, s.setupId),
        eq(extractions.drinkTypeId, s.drinkTypeId),
        eq(extractions.entryMode, "measured"),
        inArray(batches.beanId, beans),
        lt(extractions.createdAt, s.createdAt),
        ...(since ? [gte(extractions.createdAt, since)] : []),
      ),
    )
    .orderBy(desc(extractions.createdAt))
    .limit(1);
  return row ? { grind: row.grind, balance: row.balance } : null;
}

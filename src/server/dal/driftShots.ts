import "server-only";
import { and, eq, gte, inArray, lte, ne } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalBeans, extractions, maintenanceEvents, pinnedRecipes, setupParts } from "@/db/schema";
import { CLEAN_STARTS_PERIOD, POOL_WITHIN_BASKET } from "@/domain/drift/constants";
import type { DriftPin, DriftShot } from "@/domain/drift/types";
import { currentPeriodStart } from "@/domain/grindPeriods";
import { openedClock } from "@/domain/openedClock";
import type { PortionDates } from "@/domain/portionState";
import { roastingClock, type BagDates } from "@/domain/roastingClock";
import { mergeGroup } from "./catalogMerge";

/*
 * What the drift engine reads (TASK-04-02-05-BE1, 02-BE1, 07-BE1): the
 * grinder's own events (a machine or basket event never moves it) and the
 * current period's start; the household's shots of the coffee on every
 * setup with that grinder unit since then, every persona's, each with the
 * coffee's ages when it was pulled; and every pin for the coffee, so each
 * shot is judged against its own recipe in memory. Never another grinder.
 */

export type DriftRead = { periodStart: Date | null; shots: DriftShot[]; pins: DriftPin[] };

/** A portion's dates as they were at `at`: later freezing, opening or finishing didn't happen yet. */
const asOf = (p: PortionDates, at: Date): PortionDates => {
  const by = (d: Date | null) => (d && d.getTime() <= at.getTime() ? d : null);
  return { frozenAt: by(p.frozenAt), thawedAt: by(p.thawedAt), openedAt: by(p.openedAt), finishedAt: by(p.finishedAt) };
};

/** The coffee's ages at `at`: days since roasting (or packing), and since opening; null when not known. */
export function agesAt(bag: BagDates, portion: PortionDates, at: Date, timeZone: string) {
  const then = asOf(portion, at);
  const roast = roastingClock(bag, then, at, timeZone);
  const opened = openedClock(then, at, timeZone);
  return {
    roastDays: roast.kind === "roasted" || roast.kind === "packed" ? roast.days : null,
    openedDays: opened.kind === "open" ? opened.days : null,
  };
}

export async function readDrift(input: {
  householdId: string;
  grinderId: string;
  /** The basket on the recipe's setup, for the within-basket fallback. */
  basketId: string | null;
  beanId: string;
  now: Date;
  timeZone: string;
}): Promise<DriftRead> {
  const { householdId, grinderId, now, timeZone } = input;
  const [events, withGrinder, withBasket, group] = await Promise.all([
    db
      .select({ at: maintenanceEvents.occurredAt })
      .from(maintenanceEvents)
      .where(and(eq(maintenanceEvents.ownedHardwareId, grinderId), CLEAN_STARTS_PERIOD ? undefined : ne(maintenanceEvents.kind, "clean"))),
    db.select({ setupId: setupParts.setupId }).from(setupParts).where(eq(setupParts.ownedHardwareId, grinderId)),
    POOL_WITHIN_BASKET && input.basketId
      ? db.select({ setupId: setupParts.setupId }).from(setupParts).where(eq(setupParts.ownedHardwareId, input.basketId))
      : null,
    mergeGroup(db, canonicalBeans, input.beanId),
  ]);
  const periodStart = currentPeriodStart(events, now);
  const basketSetups = withBasket && new Set(withBasket.map((r) => r.setupId));
  const setupIds = withGrinder.map((r) => r.setupId).filter((id) => !basketSetups || basketSetups.has(id));
  const beans = group.length ? group : [input.beanId];
  if (!setupIds.length) return { periodStart, shots: [], pins: [] };

  const [rows, pins] = await Promise.all([
    db
      .select({
        id: extractions.id,
        at: extractions.createdAt,
        entryMode: extractions.entryMode,
        reaction: extractions.reaction,
        personaId: extractions.personaId,
        setupId: extractions.setupId,
        drinkTypeId: extractions.drinkTypeId,
        batchId: batchPortions.batchId,
        grind: extractions.grindSize,
        timeMs: extractions.yieldTime,
        wdt: extractions.usedWdt,
        puckScreen: extractions.usedPuckScreen,
        roastDate: batches.roastDate,
        packedAt: batches.packedAt,
        bestBefore: batches.bestBefore,
        frozenAt: batchPortions.frozenAt,
        thawedAt: batchPortions.thawedAt,
        openedAt: batchPortions.openedAt,
        finishedAt: batchPortions.finishedAt,
      })
      .from(extractions)
      .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
      .innerJoin(batches, eq(batches.id, batchPortions.batchId))
      .where(
        and(
          eq(extractions.householdId, householdId),
          inArray(extractions.setupId, setupIds),
          inArray(batches.beanId, beans),
          periodStart ? gte(extractions.createdAt, periodStart) : undefined,
          lte(extractions.createdAt, now),
        ),
      ),
    db
      .select()
      .from(pinnedRecipes)
      .where(and(eq(pinnedRecipes.householdId, householdId), inArray(pinnedRecipes.beanId, beans))),
  ]);

  return {
    periodStart,
    shots: rows.map((r) => ({
      id: r.id,
      at: r.at,
      entryMode: r.entryMode,
      reaction: r.reaction ?? null,
      personaId: r.personaId,
      setupId: r.setupId,
      drinkTypeId: r.drinkTypeId,
      batchId: r.batchId,
      grind: r.grind,
      timeMs: r.timeMs,
      prep: { wdt: r.wdt, puckScreen: r.puckScreen },
      ...agesAt(r, r, r.at, timeZone),
    })),
    // Servicing applied on read joins with EPIC-04-03 (TD-5); until then the stored grind is the recipe's.
    pins: pins.map((p) => ({
      id: p.id,
      personaId: p.personaId,
      setupId: p.setupId,
      drinkTypeId: p.drinkTypeId,
      batchId: p.batchId,
      pinnedAt: p.pinnedAt,
      removedAt: p.removedAt ?? null,
      grind: p.grindSize,
      timeMs: p.yieldTime,
      prep: { wdt: p.usedWdt, puckScreen: p.usedPuckScreen },
    })),
  };
}

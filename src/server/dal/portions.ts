import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { batchPortions, stockChecks } from "@/db/schema";
import { isValidDayKey, localDayKey, localNoon } from "@/domain/localDay";
import { allowedActions, type DatedAction, type PortionAction } from "@/domain/portionActions";
import { portionState } from "@/domain/portionState";
import { MAX_BAG_GRAMS } from "./bags";
import { getRemaining } from "./remaining";
import { assertOwned, requireHousehold } from "./scope";

/*
 * A portion's life (EPIC-03-02): open, freeze, thaw, finish and split. Each
 * date is set once, today by default or an earlier local day at its noon,
 * never in the future (review M4). Only the actions its state allows.
 */

/** Not allowed in the portion's state, a bad date, or a bad weight. */
export class InvalidPortionActionError extends Error {
  constructor(
    readonly reason: "notAllowed" | "future" | "thawBeforeFreeze" | "badDay" | "badWeight",
  ) {
    super(`Invalid portion action: ${reason}`);
    this.name = "InvalidPortionActionError";
  }
}

export type When = { day?: string; now?: Date; timeZone?: string };

const COLUMN = { open: "openedAt", freeze: "frozenAt", thaw: "thawedAt", finish: "finishedAt" } as const;

async function load(portionId: string) {
  const { householdId } = await requireHousehold();
  await assertOwned("batchPortions", portionId, householdId);
  const [portion] = await db.select().from(batchPortions).where(eq(batchPortions.id, portionId));
  return portion;
}

function check(state: ReturnType<typeof portionState>, action: PortionAction) {
  if (!allowedActions(state).includes(action)) throw new InvalidPortionActionError("notAllowed");
}

/** The moment a dated action happened: now for today, else that day's local noon. */
export function actionTime({ day, now = new Date(), timeZone = "UTC" }: When): Date {
  const today = localDayKey(now, timeZone);
  if (day === undefined || day === today) return now;
  if (!isValidDayKey(day)) throw new InvalidPortionActionError("badDay");
  if (day > today) throw new InvalidPortionActionError("future");
  return localNoon(day, timeZone);
}

/** Open, freeze, thaw or finish, dated (STORY-03-02-02, 03-02-03). */
export async function setPortionDate(portionId: string, action: DatedAction, when: When = {}): Promise<void> {
  const portion = await load(portionId);
  check(portionState(portion), action);
  const at = actionTime(when);
  // Thawing can't come before freezing (AC 4).
  if (action === "thaw" && portion.frozenAt && at.getTime() < portion.frozenAt.getTime()) {
    throw new InvalidPortionActionError("thawBeforeFreeze");
  }
  await db.update(batchPortions).set({ [COLUMN[action]]: at }).where(eq(batchPortions.id, portionId));
}

/**
 * Splits grams off into a new portion of the same bag (STORY-03-02-01), in
 * one batch: the source's weight drops by what was taken, a stock check
 * moves down with it when the source has one (TQ-13), and the new portion
 * is frozen now unless asked not to. Old shots and the bag's facts stay.
 */
export async function splitPortion(
  portionId: string,
  takeGrams: number,
  { freezeNew = true, now = new Date() }: { freezeNew?: boolean; now?: Date } = {},
): Promise<{ id: string }> {
  const portion = await load(portionId);
  check(portionState(portion), "split");
  const left = (await getRemaining([portionId])).get(portionId)?.grams ?? 0;
  if (!Number.isFinite(takeGrams) || takeGrams <= 0 || takeGrams > left) throw new InvalidPortionActionError("badWeight");

  const [latest] = await db
    .select()
    .from(stockChecks)
    .where(eq(stockChecks.portionId, portionId))
    .orderBy(desc(stockChecks.checkedAt))
    .limit(1);
  const id = newId();
  await db.batch([
    db.update(batchPortions).set({ weight: portion.weight - takeGrams }).where(eq(batchPortions.id, portionId)),
    ...(latest
      ? [db.insert(stockChecks).values({ id: newId(), portionId, remainingWeight: Math.round((left - takeGrams) * 10) / 10, checkedAt: now })]
      : []),
    db.insert(batchPortions).values({
      id,
      batchId: portion.batchId,
      weight: takeGrams,
      frozenAt: freezeNew ? now : null,
      createdAt: now,
    }),
  ]);
  return { id };
}

/**
 * Weigh what's left (STORY-03-04-02): a stock check on an open or thawed
 * portion, now. Zero is allowed. The latest check wins and later doses come
 * off it (AC 2, AC 3), through getRemaining.
 */
export async function addStockCheck(portionId: string, grams: number, { now = new Date() }: { now?: Date } = {}): Promise<void> {
  const portion = await load(portionId);
  check(portionState(portion), "weigh");
  if (!Number.isFinite(grams) || grams < 0 || grams > MAX_BAG_GRAMS) throw new InvalidPortionActionError("badWeight");
  await db.insert(stockChecks).values({ id: newId(), portionId, remainingWeight: Math.round(grams * 10) / 10, checkedAt: now });
}

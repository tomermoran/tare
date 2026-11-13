import "server-only";
import { and, desc, eq, gte, inArray, lt, or, type SQL } from "drizzle-orm";
import { db } from "@/db/client";
import {
  batches,
  batchPortions,
  canonicalBeans,
  canonicalHardware,
  drinkTypes,
  extractions,
  milkTypes,
  ownedHardware,
  roasters,
  setupParts,
} from "@/db/schema";
import { localDayKey } from "@/domain/localDay";
import type { TasteTag } from "@/domain/taste";
import { getTimeZone } from "@/server/time";
import { resolveEntity } from "./catalogMerge";
import { requireHousehold } from "./scope";

/*
 * The Journal (STORY-02-06-01): the household's shots, newest first. The
 * first page is the last 30 days (DQ-13); "show older" pages on by a cursor
 * on (created_at, id), so no shot is skipped or shown twice. The query runs
 * on the (household_id, created_at) index.
 */

export const JOURNAL_WINDOW_DAYS = 30;
const DAY_MS = 86_400_000;
/** "Show older" adds this many shots at a time. */
export const OLDER_PAGE = 50;
/** A safety cap on the first page, for a very busy month. */
const WINDOW_CAP = 500;

export type JournalCursor = { at: number; id: string };

export type JournalShot = {
  id: string;
  at: Date;
  /** The shot's calendar day in the device's zone, "YYYY-MM-DD". */
  day: string;
  drink: { name: string | null; nameKey: string | null };
  coffee: { name: string; roasterName: string };
  milk: { name: string | null; nameKey: string | null; ml: number | null } | null;
  values: { grind: number; dose: number; yield: number; timeMs: number };
  entryMode: "measured" | "one-tap";
  reaction: "good" | "off" | null;
  tags: TasteTag[];
  /** Ground from a portion that was in the freezer at the time. */
  fromFrozen: boolean;
  /** The setup's grinder, for grind period dividers (EPIC-04-01). */
  grinderId: string | null;
};

export type JournalPage = { shots: JournalShot[]; older: JournalCursor | null };

/** Before a cursor, in (created_at, id) order. */
const beforeCursor = (c: JournalCursor): SQL =>
  or(lt(extractions.createdAt, new Date(c.at)), and(eq(extractions.createdAt, new Date(c.at)), lt(extractions.id, c.id)))!;

const wasFrozen = (
  at: Date,
  p: { frozenAt: Date | null; thawedAt: Date | null },
) => !!p.frozenAt && p.frozenAt <= at && !(p.thawedAt && p.thawedAt >= p.frozenAt && p.thawedAt <= at);

export async function listJournal({
  before,
  limit = OLDER_PAGE,
  now = new Date(),
}: { before?: JournalCursor; limit?: number; now?: Date } = {}): Promise<JournalPage> {
  const { householdId } = await requireHousehold();
  const timeZone = await getTimeZone();
  const windowStart = new Date(now.getTime() - JOURNAL_WINDOW_DAYS * DAY_MS);
  const own = eq(extractions.householdId, householdId);

  const rows = await db
    .select({
      id: extractions.id,
      at: extractions.createdAt,
      setupId: extractions.setupId,
      drinkName: drinkTypes.name,
      drinkKey: drinkTypes.nameKey,
      beanId: batches.beanId,
      milkName: milkTypes.name,
      milkKey: milkTypes.nameKey,
      milkMl: extractions.milkMl,
      grind: extractions.grindSize,
      dose: extractions.doseWeight,
      yield: extractions.yieldWeight,
      timeMs: extractions.yieldTime,
      entryMode: extractions.entryMode,
      reaction: extractions.reaction,
      tags: extractions.tasteTags,
      frozenAt: batchPortions.frozenAt,
      thawedAt: batchPortions.thawedAt,
    })
    .from(extractions)
    .innerJoin(drinkTypes, eq(drinkTypes.id, extractions.drinkTypeId))
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .leftJoin(milkTypes, eq(milkTypes.id, extractions.milkTypeId))
    .where(and(own, before ? beforeCursor(before) : gte(extractions.createdAt, windowStart)))
    .orderBy(desc(extractions.createdAt), desc(extractions.id))
    .limit(before ? limit : WINDOW_CAP);

  // Is there anything older than what's shown?
  const last = rows.at(-1);
  const edge: JournalCursor = last ? { at: last.at.getTime(), id: last.id } : before ?? { at: windowStart.getTime(), id: "" };
  const [more] = await db
    .select({ id: extractions.id })
    .from(extractions)
    .where(and(own, beforeCursor(edge)))
    .limit(1);

  const beans = new Map<string, JournalShot["coffee"]>();
  for (const id of new Set(rows.map((r) => r.beanId))) {
    const survivor = (await resolveEntity(db, canonicalBeans, id)) ?? id;
    const [bean] = await db
      .select({ name: canonicalBeans.name, roasterName: roasters.name })
      .from(canonicalBeans)
      .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
      .where(eq(canonicalBeans.id, survivor));
    beans.set(id, bean);
  }

  const setupIds = [...new Set(rows.map((r) => r.setupId))];
  const grinders = setupIds.length
    ? await db
        .select({ setupId: setupParts.setupId, id: ownedHardware.id })
        .from(setupParts)
        .innerJoin(ownedHardware, eq(ownedHardware.id, setupParts.ownedHardwareId))
        .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
        .where(and(inArray(setupParts.setupId, setupIds), eq(canonicalHardware.kind, "grinder")))
    : [];
  const grinderOf = new Map(grinders.map((g) => [g.setupId, g.id]));

  return {
    shots: rows.map((r) => ({
      id: r.id,
      at: r.at,
      day: localDayKey(r.at, timeZone),
      drink: { name: r.drinkName, nameKey: r.drinkKey },
      coffee: beans.get(r.beanId)!,
      milk: r.milkName || r.milkKey ? { name: r.milkName, nameKey: r.milkKey, ml: r.milkMl } : null,
      values: { grind: r.grind, dose: r.dose, yield: r.yield, timeMs: r.timeMs },
      entryMode: r.entryMode,
      reaction: r.reaction ?? null,
      tags: r.tags ?? [],
      fromFrozen: wasFrozen(r.at, r),
      grinderId: grinderOf.get(r.setupId) ?? null,
    })),
    older: more ? edge : null,
  };
}

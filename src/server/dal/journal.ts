import "server-only";
import { and, desc, eq, gte, inArray, lt, lte, or, type SQL } from "drizzle-orm";
import { db } from "@/db/client";
import {
  batches,
  batchPortions,
  canonicalBeans,
  canonicalHardware,
  drinkTypes,
  extractions,
  hardwareMakers,
  maintenanceEvents,
  milkTypes,
  ownedHardware,
  roasters,
  setupParts,
  setups,
} from "@/db/schema";
import type { HardwareKind } from "@/domain/capabilities";
import { isFromFrozen } from "@/domain/frozen";
import { localDayKey } from "@/domain/localDay";
import type { BrewValues } from "@/domain/brewControls";
import { isMaintenanceKind, type MaintenanceKind } from "@/domain/maintenance";
import type { TasteTag } from "@/domain/taste";
import { getTimeZone } from "@/server/time";
import { mergeGroup, resolveEntity } from "./catalogMerge";
import { assertOwned, requireHousehold } from "./scope";
import { PART_KINDS, partsOf, setupsOf, type SetupSummary } from "./parts";

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

/**
 * A grind period divider (STORY-04-01-04): work on a grinder of the listed
 * shots, at its place in time.
 */
export type JournalDivider = {
  id: string;
  at: Date;
  day: string;
  grinderId: string;
  /** Nickname, else model, so two grinders are never confused. */
  grinder: string;
  kind: MaintenanceKind;
  isRecalibration: boolean;
};

export type JournalPage = { shots: JournalShot[]; dividers: JournalDivider[]; older: JournalCursor | null };

/** Journal filters (STORY-02-06-04); unset means any. A coffee covers its merged catalog entries. */
export type JournalFilters = { drinkId?: string; beanId?: string; setupId?: string };

/** Before a cursor, in (created_at, id) order. */
const beforeCursor = (c: JournalCursor): SQL =>
  or(lt(extractions.createdAt, new Date(c.at)), and(eq(extractions.createdAt, new Date(c.at)), lt(extractions.id, c.id)))!;

export async function listJournal({
  before,
  limit = OLDER_PAGE,
  now = new Date(),
  filters = {},
}: { before?: JournalCursor; limit?: number; now?: Date; filters?: JournalFilters } = {}): Promise<JournalPage> {
  const { householdId } = await requireHousehold();
  const timeZone = await getTimeZone();
  const windowStart = new Date(now.getTime() - JOURNAL_WINDOW_DAYS * DAY_MS);
  // Filters hold for every page, "show older" too (AC 3).
  const beanIds = filters.beanId ? await mergeGroup(db, canonicalBeans, filters.beanId) : null;
  const own = and(
    eq(extractions.householdId, householdId),
    filters.drinkId ? eq(extractions.drinkTypeId, filters.drinkId) : undefined,
    filters.setupId ? eq(extractions.setupId, filters.setupId) : undefined,
    beanIds ? inArray(batches.beanId, beanIds.length ? beanIds : [filters.beanId!]) : undefined,
  );

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
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
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

  const dividers = await dividersFor(own, rows.at(-1)?.at ?? null, before ? new Date(before.at) : now, !before, timeZone);

  return {
    dividers,
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
      fromFrozen: isFromFrozen(r.at, r),
      grinderId: grinderOf.get(r.setupId) ?? null,
    })),
    older: more ? edge : null,
  };
}

/**
 * Grinder events from `from` (the page's oldest shot) up to `to`, for the
 * grinders of any shot the filters list (AC 3, AC 4). Pages meet without
 * overlapping, so "show older" never repeats a divider: the first page runs
 * to now inclusive, older pages stop just before the previous page's edge.
 */
async function dividersFor(own: SQL | undefined, from: Date | null, to: Date, inclusive: boolean, timeZone: string): Promise<JournalDivider[]> {
  if (!from) return [];
  const listedSetups = db
    .selectDistinct({ id: extractions.setupId })
    .from(extractions)
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(own);
  const grinders = db
    .select({ id: setupParts.ownedHardwareId })
    .from(setupParts)
    .where(inArray(setupParts.setupId, listedSetups));
  const rows = await db
    .select({
      id: maintenanceEvents.id,
      at: maintenanceEvents.occurredAt,
      kind: maintenanceEvents.kind,
      isRecalibration: maintenanceEvents.isRecalibration,
      grinderId: ownedHardware.id,
      nickname: ownedHardware.nickname,
      model: canonicalHardware.name,
    })
    .from(maintenanceEvents)
    .innerJoin(ownedHardware, eq(ownedHardware.id, maintenanceEvents.ownedHardwareId))
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(
      and(
        eq(canonicalHardware.kind, "grinder"),
        inArray(maintenanceEvents.ownedHardwareId, grinders),
        gte(maintenanceEvents.occurredAt, from),
        inclusive ? lte(maintenanceEvents.occurredAt, to) : lt(maintenanceEvents.occurredAt, to),
      ),
    )
    .orderBy(desc(maintenanceEvents.occurredAt), desc(maintenanceEvents.id));
  return rows.map((r) => ({
    id: r.id,
    at: r.at,
    day: localDayKey(r.at, timeZone),
    grinderId: r.grinderId,
    grinder: r.nickname ?? r.model,
    kind: isMaintenanceKind(r.kind) ? r.kind : "other",
    isRecalibration: r.isRecalibration,
  }));
}

export type JournalFilterOptions = {
  drinks: { id: string; name: string | null; nameKey: string | null }[];
  /** Coffees the household has shots of, by surviving catalog entry. */
  coffees: { id: string; name: string; roasterName: string }[];
  /** Offered as a filter only when there's more than one (AC 1). */
  setups: SetupSummary[];
  /** The asked-for coffee as listed in `coffees` (a merged duplicate becomes its survivor); null when not this household's. */
  beanId: string | null;
};

/**
 * What each Journal filter can be set to (STORY-02-06-04 AC 1). `beanId`, the
 * coffee on Brew, is offered too when the household has a bag of it, so the
 * default filter holds before its first shot (STORY-02-06-05 AC 1).
 */
export async function getJournalFilterOptions({ beanId }: { beanId?: string } = {}): Promise<JournalFilterOptions> {
  const { householdId } = await requireHousehold();
  const [drinks, beanRows, setupList] = await Promise.all([
    db
      .select({ id: drinkTypes.id, name: drinkTypes.name, nameKey: drinkTypes.nameKey })
      .from(drinkTypes)
      .where(eq(drinkTypes.householdId, householdId))
      .orderBy(drinkTypes.sortOrder),
    db
      .selectDistinct({ beanId: batches.beanId })
      .from(extractions)
      .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
      .innerJoin(batches, eq(batches.id, batchPortions.batchId))
      .where(eq(extractions.householdId, householdId)),
    partsOf(householdId).then((parts) => setupsOf(householdId, parts)),
  ]);
  const ids = beanRows.map((r) => r.beanId);
  if (beanId) {
    const group = await mergeGroup(db, canonicalBeans, beanId);
    const [bag] = group.length
      ? await db
          .select({ id: batches.id })
          .from(batches)
          .where(and(eq(batches.householdId, householdId), inArray(batches.beanId, group)))
          .limit(1)
      : [];
    if (bag) ids.push(beanId);
  }
  const asked = beanId && ids.includes(beanId) ? ((await resolveEntity(db, canonicalBeans, beanId)) ?? beanId) : null;
  const survivors = [...new Set(await Promise.all(ids.map(async (id) => (await resolveEntity(db, canonicalBeans, id)) ?? id)))];
  const coffees = survivors.length
    ? await db
        .select({ id: canonicalBeans.id, name: canonicalBeans.name, roasterName: roasters.name })
        .from(canonicalBeans)
        .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
        .where(inArray(canonicalBeans.id, survivors))
    : [];
  coffees.sort((a, b) => a.name.localeCompare(b.name));
  return { drinks, coffees, setups: setupList.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()), beanId: asked };
}

export type ShotDetail = Omit<JournalShot, "day" | "grinderId"> & {
  setup: {
    id: string;
    name: string | null;
    /** Machine, grinder and basket, in that order, by maker and model. */
    parts: { kind: HardwareKind; maker: string; model: string; nickname: string | null }[];
  };
  sweetened: boolean;
  /** The drink is a milk drink, which words strength differently. */
  milkDrink: boolean;
  /** The household milk chosen, for editing. */
  milkTypeId: string | null;
  /** Temperature and pressure as stored, for editing. */
  brew: BrewValues;
  prep: { wdt: boolean; puckScreen: boolean };
  rating: number | null;
  /** Just-right answers, -2..2 (sweetness -2..0); null when not answered. */
  taste: { balance: number | null; strength: number | null; body: number | null; sweetness: number | null };
};

/**
 * One shot with everything SCR-SHOT shows (STORY-02-06-03 AC 1, AC 2): its
 * setup's parts by maker and model (setups never change, so these are what
 * was used), milk, prep, sweetened and taste. Another household's shot is
 * not found.
 */
export async function getShot(id: string): Promise<ShotDetail> {
  const { householdId } = await requireHousehold();
  await assertOwned("extractions", id, householdId);
  const [r] = await db
    .select({
      shot: extractions,
      drinkName: drinkTypes.name,
      drinkKey: drinkTypes.nameKey,
      hasMilk: drinkTypes.hasMilk,
      beanId: batches.beanId,
      milkName: milkTypes.name,
      milkKey: milkTypes.nameKey,
      frozenAt: batchPortions.frozenAt,
      thawedAt: batchPortions.thawedAt,
      setupName: setups.name,
    })
    .from(extractions)
    .innerJoin(drinkTypes, eq(drinkTypes.id, extractions.drinkTypeId))
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .innerJoin(setups, eq(setups.id, extractions.setupId))
    .leftJoin(milkTypes, eq(milkTypes.id, extractions.milkTypeId))
    .where(eq(extractions.id, id));

  const survivor = (await resolveEntity(db, canonicalBeans, r.beanId)) ?? r.beanId;
  const [coffee] = await db
    .select({ name: canonicalBeans.name, roasterName: roasters.name })
    .from(canonicalBeans)
    .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
    .where(eq(canonicalBeans.id, survivor));

  const parts = await db
    .select({ kind: canonicalHardware.kind, maker: hardwareMakers.name, model: canonicalHardware.name, nickname: ownedHardware.nickname })
    .from(setupParts)
    .innerJoin(ownedHardware, eq(ownedHardware.id, setupParts.ownedHardwareId))
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .innerJoin(hardwareMakers, eq(hardwareMakers.id, canonicalHardware.makerId))
    .where(eq(setupParts.setupId, r.shot.setupId));
  parts.sort((a, b) => PART_KINDS.indexOf(a.kind) - PART_KINDS.indexOf(b.kind));

  const s = r.shot;
  return {
    id: s.id,
    at: s.createdAt,
    drink: { name: r.drinkName, nameKey: r.drinkKey },
    coffee,
    milk: r.milkName || r.milkKey ? { name: r.milkName, nameKey: r.milkKey, ml: s.milkMl } : null,
    values: { grind: s.grindSize, dose: s.doseWeight, yield: s.yieldWeight, timeMs: s.yieldTime },
    entryMode: s.entryMode,
    reaction: s.reaction ?? null,
    tags: s.tasteTags ?? [],
    fromFrozen: isFromFrozen(s.createdAt, r),
    setup: { id: s.setupId, name: r.setupName, parts },
    sweetened: s.sweetened === true,
    milkDrink: r.hasMilk,
    milkTypeId: s.milkTypeId,
    brew: { brewTempC: s.brewTempC, brewTempStep: s.brewTempStep, pressureBar: s.pressureBar, pressureStep: s.pressureStep },
    prep: { wdt: s.usedWdt, puckScreen: s.usedPuckScreen },
    rating: s.userRating ?? null,
    taste: { balance: s.tasteBalance, strength: s.tasteStrength, body: s.tasteBody, sweetness: s.tasteSweetness },
  };
}

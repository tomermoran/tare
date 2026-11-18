import "server-only";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalBeans, canonicalHardware, drinkTypes, extractions, maintenanceEvents, ownedHardware, pinnedRecipes, setupParts } from "@/db/schema";
import { ageTerm } from "@/domain/drift/age";
import { eligible } from "@/domain/drift/eligible";
import { grindWheelConfig } from "@/domain/grind";
import { proposeShift, type ShiftProposal, type ShiftWheel } from "@/domain/offset";
import { pinnedBefore, redialState, type RedialState } from "@/domain/redial";
import { applyServicing, type ServicingEvent } from "@/domain/servicing";
import { getTimeZone } from "@/server/time";
import { mergeGroup } from "./catalogMerge";
import { grindScaleOf } from "./dialIn";
import { agesAt, readDrift } from "./driftShots";
import { unfinishedPortions } from "./logContext";
import { partsOf, type Part } from "./parts";
import { actingPersonaId } from "./persona";
import { toRecipe, type Recipe } from "./recipes";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";

/*
 * Re-dialling after maintenance (EPIC-04-03, TD-5, TD-7). An event's state
 * is derived from it and the recipes pinned before it on any setup with the
 * grinder; the shift the household confirms is stored on the event and
 * applied on read, never by rewriting a recipe.
 */

export class InvalidShiftError extends Error {
  constructor() {
    super("Invalid grind shift");
    this.name = "InvalidShiftError";
  }
}

type EventRow = typeof maintenanceEvents.$inferSelect;

const setupsWith = async (grinderId: string) =>
  (await db.select({ id: setupParts.setupId }).from(setupParts).where(eq(setupParts.ownedHardwareId, grinderId))).map((r) => r.id);

/** Every coffee recipe pinned on a setup with this grinder, newest first; removed bag recipes left out. */
async function pinsOnGrinder(householdId: string, grinderId: string) {
  const setupIds = await setupsWith(grinderId);
  if (!setupIds.length) return [];
  const rows = await db
    .select()
    .from(pinnedRecipes)
    .where(and(eq(pinnedRecipes.householdId, householdId), inArray(pinnedRecipes.setupId, setupIds), isNull(pinnedRecipes.removedAt)))
    .orderBy(desc(pinnedRecipes.pinnedAt), desc(pinnedRecipes.id));
  return rows.map(toRecipe);
}

async function partKind(partId: string): Promise<string | null> {
  const [row] = await db
    .select({ kind: canonicalHardware.kind })
    .from(ownedHardware)
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(eq(ownedHardware.id, partId));
  return row?.kind ?? null;
}

/** A grinder's events as servicing reads them. */
export async function servicingEvents(grinderId: string): Promise<ServicingEvent[]> {
  return db
    .select({ id: maintenanceEvents.id, at: maintenanceEvents.occurredAt, grindShift: maintenanceEvents.grindShift, grindScale: maintenanceEvents.grindScale })
    .from(maintenanceEvents)
    .where(eq(maintenanceEvents.ownedHardwareId, grinderId));
}

async function ownedEvent(eventId: string): Promise<{ householdId: string; event: EventRow; isGrinder: boolean }> {
  const { householdId } = await requireHousehold();
  if (typeof eventId !== "string" || !eventId) throw new NotFoundError();
  await assertOwned("maintenanceEvents", eventId, householdId);
  const [event] = await db.select().from(maintenanceEvents).where(eq(maintenanceEvents.id, eventId));
  return { householdId, event, isGrinder: (await partKind(event.ownedHardwareId)) === "grinder" };
}

const stateOf = (event: EventRow, isGrinder: boolean, pins: readonly Recipe[]): RedialState =>
  redialState(
    { isGrinder, isRecalibration: event.isRecalibration, grindShift: event.grindShift, grindScale: event.grindScale },
    pins.some((p) => pinnedBefore(p.pinnedAt, event.occurredAt)),
  );

/** Each of a part's events with its re-dial state, by event ID (for `listMaintenance`). */
export async function eventStates(partId: string): Promise<Map<string, RedialState>> {
  const { householdId } = await requireHousehold();
  const isGrinder = (await partKind(partId)) === "grinder";
  const [events, pins] = await Promise.all([
    db.select().from(maintenanceEvents).where(eq(maintenanceEvents.ownedHardwareId, partId)),
    isGrinder ? pinsOnGrinder(householdId, partId) : [],
  ]);
  return new Map(events.map((e) => [e.id, stateOf(e, isGrinder, pins)]));
}

/** The grinder's latest event awaiting a re-dial, for its screen's status (AC 1); null otherwise. */
export async function getGrinderRedial(grinderPartId: string): Promise<{ eventId: string; at: Date } | null> {
  const { householdId } = await requireHousehold();
  await assertOwned("ownedHardware", grinderPartId, householdId);
  if ((await partKind(grinderPartId)) !== "grinder") return null;
  const [events, pins] = await Promise.all([
    db.select().from(maintenanceEvents).where(eq(maintenanceEvents.ownedHardwareId, grinderPartId)).orderBy(desc(maintenanceEvents.occurredAt)),
    pinsOnGrinder(householdId, grinderPartId),
  ]);
  const awaiting = events.find((e) => stateOf(e, true, pins) === "awaiting");
  return awaiting ? { eventId: awaiting.id, at: awaiting.occurredAt } : null;
}

/**
 * Brew's re-dial card (STORY-04-03-04 AC 2): when the current setup's
 * grinder has an event awaiting a re-dial. Names the grinder only when the
 * household has two or more.
 */
export async function getBrewRedialCard(currentSetupId: string): Promise<{ eventId: string; grinder: Part | null } | null> {
  const { householdId } = await requireHousehold();
  const [row] = await db
    .select({ id: ownedHardware.id })
    .from(setupParts)
    .innerJoin(ownedHardware, eq(ownedHardware.id, setupParts.ownedHardwareId))
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(and(eq(setupParts.setupId, currentSetupId), eq(canonicalHardware.kind, "grinder")));
  if (!row) return null;
  const due = await getGrinderRedial(row.id);
  if (!due) return null;
  const grinders = (await partsOf(householdId)).filter((p) => p.kind === "grinder");
  return { eventId: due.eventId, grinder: grinders.length > 1 ? (grinders.find((g) => g.id === row.id) ?? null) : null };
}

export type RedialCandidate = {
  recipeId: string;
  bean: { id: string; name: string; roasterName: string };
  drink: { id: string; name: string | null; nameKey: string | null };
  setupId: string;
};

/**
 * The coffees to re-dial (STORY-04-03-04 AC 5): on hand, with the acting
 * persona's recipe pinned before the event on a setup with this grinder,
 * newest per coffee, drink and setup; Brew's coffee first.
 */
export async function listRedialCandidates(eventId: string, firstBeanId?: string | null, now = new Date()): Promise<RedialCandidate[]> {
  const { householdId, event } = await ownedEvent(eventId);
  const [personaId, pins, portions] = await Promise.all([actingPersonaId(), pinsOnGrinder(householdId, event.ownedHardwareId), unfinishedPortions(householdId, now)]);
  const onHand = new Map(portions.map((p) => [p.bean.id, p.bean]));
  const seen = new Set<string>();
  const picked = pins.filter((p) => {
    const key = `${p.beanId}|${p.drinkTypeId}|${p.setupId}`;
    if (p.personaId !== personaId || p.batchId || !onHand.has(p.beanId) || !pinnedBefore(p.pinnedAt, event.occurredAt) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!picked.length) return [];
  const drinks = await db
    .select({ id: drinkTypes.id, name: drinkTypes.name, nameKey: drinkTypes.nameKey })
    .from(drinkTypes)
    .where(inArray(drinkTypes.id, [...new Set(picked.map((p) => p.drinkTypeId))]));
  const drinkOf = new Map(drinks.map((d) => [d.id, d]));
  return picked
    .map((p) => ({ recipeId: p.id, bean: onHand.get(p.beanId)!, drink: drinkOf.get(p.drinkTypeId)!, setupId: p.setupId }))
    .sort((a, b) => Number(b.bean.id === firstBeanId) - Number(a.bean.id === firstBeanId));
}

export type OffsetProposal =
  | ({
      kind: "proposal";
      eventId: string;
      baseline: { recipeId: string; grind: number; pinnedAt: Date };
      newGrind: number;
      wheel: ShiftWheel;
    } & ShiftProposal)
  | { kind: "noBaseline"; eventId: string }
  | { kind: "none" };

/** The bean-ageing change between two pins, from the old period's shots; null without an estimate (AC 2). */
async function ageChange(householdId: string, grinderId: string, beanId: string, eventAt: Date, oldPin: Recipe, newPin: Recipe): Promise<number | null> {
  if (!oldPin.sourceExtractionId || !newPin.sourceExtractionId) return null;
  const timeZone = await getTimeZone();
  const read = await readDrift({ householdId, grinderId, basketId: null, beanId, now: new Date(eventAt.getTime() - 1), timeZone });
  const points = eligible(read.shots, read.pins).kept.map((s) => ({ roastDays: s.roastDays, openedDays: s.openedDays, delta: s.grind - s.recipe.grind, weight: 1 }));
  const agesOf = async (shotId: string) => {
    const [r] = await db
      .select({
        at: extractions.createdAt,
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
      .where(eq(extractions.id, shotId));
    return r ? agesAt(r, r, r.at, timeZone) : null;
  };
  const [then, now] = await Promise.all([agesOf(oldPin.sourceExtractionId), agesOf(newPin.sourceExtractionId)]);
  if (!then || !now) return null;
  const a = ageTerm(points, then);
  const b = ageTerm(points, now);
  return a === null || b === null ? null : b - a;
}

/**
 * The shift a new pin proposes (STORY-04-03-01): the most recent
 * recalibrating event on its grinder awaiting a re-dial, between the
 * previous pin for this coffee, persona and drink (on any setup with the
 * grinder) and this one. That previous pin is the baseline, read with any
 * earlier shifts applied. No previous pin before the event: `noBaseline`.
 */
export async function getOffsetProposal(recipeId: string): Promise<OffsetProposal> {
  const { householdId } = await requireHousehold();
  const [row] = await db
    .select()
    .from(pinnedRecipes)
    .where(and(eq(pinnedRecipes.id, recipeId), eq(pinnedRecipes.householdId, householdId)));
  if (!row) throw new NotFoundError();
  const recipe = toRecipe(row);
  const [grinder] = await db
    .select({ id: ownedHardware.id })
    .from(setupParts)
    .innerJoin(ownedHardware, eq(ownedHardware.id, setupParts.ownedHardwareId))
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(and(eq(setupParts.setupId, recipe.setupId), eq(canonicalHardware.kind, "grinder")));
  if (!grinder) return { kind: "none" };

  const [events, pins, beans] = await Promise.all([
    db.select().from(maintenanceEvents).where(eq(maintenanceEvents.ownedHardwareId, grinder.id)).orderBy(desc(maintenanceEvents.occurredAt)),
    pinsOnGrinder(householdId, grinder.id),
    mergeGroup(db, canonicalBeans, recipe.beanId),
  ]);
  const group = new Set(beans.length ? beans : [recipe.beanId]);
  const sameKey = (p: Recipe) => p.id !== recipe.id && group.has(p.beanId) && p.personaId === recipe.personaId && p.drinkTypeId === recipe.drinkTypeId && p.batchId === recipe.batchId;
  const previous = pins.find((p) => sameKey(p) && p.pinnedAt.getTime() <= recipe.pinnedAt.getTime());
  // The newest event before this pin still awaiting a mapping.
  const event = events.find((e) => e.isRecalibration && e.grindShift === null && e.grindScale === null && e.occurredAt.getTime() <= recipe.pinnedAt.getTime());
  if (!event) return { kind: "none" };
  // Already re-dialled since the event: that earlier pin was the re-dial, not this one.
  if (previous && !pinnedBefore(previous.pinnedAt, event.occurredAt)) return { kind: "none" };
  if (!previous) return { kind: "noBaseline", eventId: event.id };

  const earlier = events.filter((e) => e.occurredAt.getTime() < event.occurredAt.getTime()).map((e) => ({ id: e.id, at: e.occurredAt, grindShift: e.grindShift, grindScale: e.grindScale }));
  const oldGrind = applyServicing(previous.grind, previous.pinnedAt, earlier).grind;
  const wheel = grindWheelConfig(await grindScaleOf(grinder.id));
  const age = await ageChange(householdId, grinder.id, recipe.beanId, event.occurredAt, previous, recipe).catch(() => null);
  const proposal = proposeShift({ oldGrind, newGrind: recipe.grind, ageChange: age, wheel: { step: wheel.step, coarser: wheel.coarser } });
  return {
    kind: "proposal",
    eventId: event.id,
    baseline: { recipeId: previous.id, grind: oldGrind, pinnedAt: previous.pinnedAt },
    newGrind: recipe.grind,
    wheel: { step: wheel.step, coarser: wheel.coarser },
    ...proposal,
  };
}

async function writeShift(eventId: string, shift: number, source: { recipeId: string | null } | null): Promise<void> {
  const { householdId, event, isGrinder } = await ownedEvent(eventId);
  if (!isGrinder || !event.isRecalibration || typeof shift !== "number" || !Number.isFinite(shift)) throw new InvalidShiftError();
  if (source?.recipeId) {
    const [pin] = await db
      .select({ id: pinnedRecipes.id })
      .from(pinnedRecipes)
      .where(and(eq(pinnedRecipes.id, source.recipeId), eq(pinnedRecipes.householdId, householdId)));
    if (!pin) throw new NotFoundError();
  }
  await db
    .update(maintenanceEvents)
    .set({ grindShift: shift, grindScale: 1, ...(source ? { offsetSourceRecipeId: source.recipeId } : {}) })
    .where(eq(maintenanceEvents.id, eventId));
}

/**
 * Confirm a shift, as proposed or edited, with the re-dial it came from
 * (STORY-04-03-02 AC 2). Declining is a shift of 0 (DQ-42d, AC 3).
 */
export function confirmShift(eventId: string, shift: number, sourceRecipeId: string | null): Promise<void> {
  return writeShift(eventId, shift, { recipeId: sourceRecipeId });
}

/** Change, remove (0) or set a shift later from the grinder's screen (STORY-04-03-05); the source re-dial stays. */
export function setEventShift(eventId: string, shift: number): Promise<void> {
  return writeShift(eventId, shift, null);
}

export type ShiftPreview = {
  rows: { bean: string; drink: { name: string | null; nameKey: string | null }; from: number; to: number }[];
  more: number;
};

/**
 * What a shift would change (STORY-04-03-02 AC 1): up to three other recipes
 * pinned before the event on any setup with the grinder, newest per coffee,
 * drink and setup across every profile, read with earlier shifts applied.
 */
export async function previewShift(eventId: string, shift: number, exceptRecipeId?: string | null): Promise<ShiftPreview> {
  const { householdId, event } = await ownedEvent(eventId);
  const [pins, events] = await Promise.all([pinsOnGrinder(householdId, event.ownedHardwareId), servicingEvents(event.ownedHardwareId)]);
  const earlier = events.filter((e) => e.at.getTime() < event.occurredAt.getTime());
  const except = exceptRecipeId ? pins.find((p) => p.id === exceptRecipeId) : null;
  const seen = new Set<string>();
  const before = pins.filter((p) => {
    const key = `${p.beanId}|${p.drinkTypeId}|${p.setupId}`;
    if (!pinnedBefore(p.pinnedAt, event.occurredAt) || seen.has(key)) return false;
    seen.add(key);
    return !except || key !== `${except.beanId}|${except.drinkTypeId}|${except.setupId}`;
  });
  const shown = before.slice(0, 3);
  const [beans, drinks] = await Promise.all([
    shown.length ? db.select({ id: canonicalBeans.id, name: canonicalBeans.name }).from(canonicalBeans).where(inArray(canonicalBeans.id, shown.map((p) => p.beanId))) : [],
    shown.length
      ? db.select({ id: drinkTypes.id, name: drinkTypes.name, nameKey: drinkTypes.nameKey }).from(drinkTypes).where(inArray(drinkTypes.id, shown.map((p) => p.drinkTypeId)))
      : [],
  ]);
  return {
    rows: shown.map((p) => {
      const from = applyServicing(p.grind, p.pinnedAt, earlier).grind;
      const d = drinks.find((x) => x.id === p.drinkTypeId)!;
      return { bean: beans.find((b) => b.id === p.beanId)?.name ?? "", drink: { name: d.name, nameKey: d.nameKey }, from, to: Number((from + shift).toFixed(6)) };
    }),
    more: before.length - shown.length,
  };
}

export type EventDetail = {
  id: string;
  at: Date;
  state: RedialState;
  shift: number | null;
  /** The re-dial the shift came from: its coffee and when (STORY-04-03-05 AC 2). */
  source: { bean: string; at: Date } | null;
  /** An event awaiting a re-dial can start one (AC 5). */
  canRedial: boolean;
  wheel: ShiftWheel & { min: number; max: number };
};

export async function getEvent(eventId: string): Promise<EventDetail> {
  const { householdId, event, isGrinder } = await ownedEvent(eventId);
  const pins = isGrinder ? await pinsOnGrinder(householdId, event.ownedHardwareId) : [];
  const state = stateOf(event, isGrinder, pins);
  const [source] = event.offsetSourceRecipeId
    ? await db
        .select({ bean: canonicalBeans.name, at: pinnedRecipes.pinnedAt })
        .from(pinnedRecipes)
        .innerJoin(canonicalBeans, eq(canonicalBeans.id, pinnedRecipes.beanId))
        .where(eq(pinnedRecipes.id, event.offsetSourceRecipeId))
    : [];
  const wheel = grindWheelConfig(isGrinder ? await grindScaleOf(event.ownedHardwareId) : null);
  return {
    id: event.id,
    at: event.occurredAt,
    state,
    shift: event.grindShift,
    source: source ?? null,
    canRedial: state === "awaiting",
    wheel: { step: wheel.step, coarser: wheel.coarser, min: wheel.min, max: wheel.max },
  };
}

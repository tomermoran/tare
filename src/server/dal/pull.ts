import "server-only";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db/client";
import { batchPortions, canonicalBeans, extractions, setups } from "@/db/schema";
import { isOpen } from "@/domain/portionState";
import type { Remaining } from "@/domain/remaining";
import { resolveEntity } from "./catalogMerge";
import { unfinishedPortions, type LogPortion } from "./logContext";
import { bagsWithOwnRecipe, getCurrentRecipe } from "./recipes";
import { getRemaining } from "./remaining";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";
import { currentSetupOf } from "./setups";
import { actingPersona } from "./persona";
import { getGrindAdjustment } from "./grindAdjustment";

/*
 * The one-tap pull (STORY-02-02-02), choosing a bag when none is open
 * (STORY-02-02-03), and undo (STORY-02-02-04). The client makes the shot's
 * ID, so a retried or doubled tap finds the shot it already made instead of
 * making a second (TQ-11).
 */

/** Brew showed a recipe that's no longer there; nothing was recorded. */
export class NoRecipeError extends Error {
  constructor() {
    super("No recipe on this setup");
    this.name = "NoRecipeError";
  }
}

/** Undo after its window, or of a shot that isn't this user's one-tap pull. */
export class UndoRefusedError extends Error {
  constructor() {
    super("Undo refused");
    this.name = "UndoRefusedError";
  }
}

/**
 * How long undo is accepted, server side: the 8 s Brew offers it (DQ-04)
 * plus room for a slow network.
 */
export const UNDO_WINDOW_MS = 13_000;

export type PullInput = {
  /** A UUID made on the client: the new shot's ID. */
  clientId: string;
  drinkTypeId: string;
  beanId: string;
  /** Chosen on SH-PORTION when none was open. */
  portionId?: string;
  /** "Use my recipe's grind for this shot": this pull only, never stored (STORY-04-02-08 AC 5). */
  useRecipeGrind?: boolean;
};

/** `ownRecipe`: the portion's bag has its own recipe (STORY-02-04-03 AC 3). */
export type PortionChoice = LogPortion & { remaining: Remaining | null; ownRecipe: boolean };

export type PullResult =
  | { kind: "pulled"; shotId: string; openedPortion: boolean; sweetened: boolean }
  /** None of the coffee is open: ask which portion, counter first, frozen last (AC 1). */
  | { kind: "needsPortion"; portions: PortionChoice[] }
  /** Nothing of the coffee is left (AC 4). */
  | { kind: "noneLeft" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function pullShot(input: PullInput, now = new Date()): Promise<PullResult> {
  const { householdId, userId } = await requireHousehold();
  if (!UUID.test(input.clientId)) throw new NotFoundError();

  // Already made by an earlier tap: the same answer, nothing new (AC 4).
  const done = await madeAlready(input.clientId, householdId);
  if (done) return done;

  await assertOwned("drinkTypes", input.drinkTypeId, householdId);
  const beanId = (await resolveEntity(db, canonicalBeans, input.beanId)) ?? input.beanId;
  const [setupList, persona] = await Promise.all([
    db.select({ id: setups.id, createdAt: setups.createdAt }).from(setups).where(eq(setups.householdId, householdId)),
    actingPersona(),
  ]);
  const setupId = await currentSetupOf(householdId, setupList);
  if (!setupId || !persona) throw new NotFoundError();

  // The recipe is resolved again here, never taken from the client (AC 1). Whether
  // there is one is the coffee's question: a bag recipe can't exist without it.
  const key = { beanId, personaId: persona.id, setupId, drinkTypeId: input.drinkTypeId };
  if (!(await getCurrentRecipe(key))) throw new NoRecipeError();

  const portions = (await unfinishedPortions(householdId, now)).filter((p) => p.bean.id === beanId);
  if (!portions.length) return { kind: "noneLeft" };
  // The earliest-opened open portion; open is never frozen (AC 3).
  const portion = input.portionId ? portions.find((p) => p.id === input.portionId) : portions.find((p) => p.openedAt !== null);
  if (input.portionId && !portion) throw new NotFoundError();
  if (!portion) return { kind: "needsPortion", portions: await withRemaining(portions) };
  // The portion's bag may have its own recipe (STORY-02-04-02 AC 1); split and frozen portions share it (AC 4).
  const recipe = (await getCurrentRecipe(key, portion.batchId))!;
  // The grind Brew showed, worked out again here (TD-4); the client never sends one. Any failure is the recipe's.
  const adjusted = input.useRecipeGrind
    ? null
    : await getGrindAdjustment({ recipe: { beanId, setupId, grind: recipe.grind }, portionId: portion.id, now });

  const shot = db.insert(extractions).values({
    id: input.clientId,
    householdId,
    personaId: persona.id,
    loggedByUserId: userId,
    setupId,
    portionId: portion.id,
    drinkTypeId: input.drinkTypeId,
    entryMode: "one-tap",
    grindSize: adjusted?.shown ?? recipe.grind,
    doseWeight: recipe.dose,
    yieldWeight: recipe.yield,
    yieldTime: recipe.timeMs,
    brewTempC: recipe.brewTempC,
    brewTempStep: recipe.brewTempStep,
    pressureBar: recipe.pressureBar,
    pressureStep: recipe.pressureStep,
    usedWdt: recipe.usedWdt,
    usedPuckScreen: recipe.usedPuckScreen,
    milkTypeId: recipe.milkTypeId,
    milkMl: recipe.milkMl,
    sweetened: recipe.sweetened, // Copied like prep and milk (STORY-02-01-09, DQ-44)
    // One-tap shots are never measurements (S-02).
    isNetworkEligible: false,
    createdAt: now,
  });
  // An unopened or sealed thawed portion opens with this shot (STORY-02-02-03
  // AC 2); a frozen one is ground from frozen with no date changed (AC 3).
  const opens = portion.state === "unopened" || portion.state === "thawed";
  try {
    if (opens) await db.batch([shot, db.update(batchPortions).set({ openedAt: now }).where(eq(batchPortions.id, portion.id))]);
    else await shot;
  } catch (e) {
    // Two taps raced past the check above: the other one made it.
    const raced = await madeAlready(input.clientId, householdId);
    if (raced) return raced;
    throw e;
  }
  return { kind: "pulled", shotId: input.clientId, openedPortion: opens, sweetened: recipe.sweetened };
}

async function withRemaining(portions: LogPortion[]): Promise<PortionChoice[]> {
  const [remaining, own] = await Promise.all([getRemaining(portions.map((p) => p.id)), bagsWithOwnRecipe(portions.map((p) => p.batchId))]);
  return portions.map((p) => ({ ...p, remaining: remaining.get(p.id) ?? null, ownRecipe: own.has(p.batchId) }));
}

/**
 * Which bag a dial-in uses when none of the coffee is open, as for a pull
 * (STORY-02-03-03 AC 4, AC 5): its unfinished portions; empty when none
 * are left.
 */
export async function portionChoices(beanId: string, now = new Date()): Promise<PortionChoice[]> {
  const { householdId } = await requireHousehold();
  const id = (await resolveEntity(db, canonicalBeans, beanId)) ?? beanId;
  return withRemaining((await unfinishedPortions(householdId, now)).filter((p) => p.bean.id === id));
}

async function madeAlready(shotId: string, householdId: string): Promise<PullResult | null> {
  const [row] = await db
    .select({
      householdId: extractions.householdId,
      at: extractions.createdAt,
      openedAt: batchPortions.openedAt,
      sweetened: extractions.sweetened,
    })
    .from(extractions)
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .where(eq(extractions.id, shotId));
  if (!row) return null;
  if (row.householdId !== householdId) throw new NotFoundError();
  return { kind: "pulled", shotId, openedPortion: row.openedAt?.getTime() === row.at.getTime(), sweetened: row.sweetened === true };
}

/**
 * Undo a one-tap pull (STORY-02-02-04): only the user's own, only within the
 * window (AC 4). It goes as if never pulled: the shot is deleted, and a
 * portion this shot opened is unopened again when no other shot used it
 * (AC 2). Remaining coffee and the Journal read the shots, so they follow.
 */
export async function undoPull(shotId: string, now = new Date()): Promise<void> {
  const { householdId, userId } = await requireHousehold();
  const [shot] = await db
    .select({
      householdId: extractions.householdId,
      userId: extractions.loggedByUserId,
      entryMode: extractions.entryMode,
      at: extractions.createdAt,
      portionId: extractions.portionId,
      openedAt: batchPortions.openedAt,
      frozenAt: batchPortions.frozenAt,
      thawedAt: batchPortions.thawedAt,
      finishedAt: batchPortions.finishedAt,
    })
    .from(extractions)
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .where(eq(extractions.id, shotId));
  if (!shot || shot.householdId !== householdId) throw new NotFoundError();
  if (shot.userId !== userId || shot.entryMode !== "one-tap") throw new UndoRefusedError();
  if (now.getTime() - shot.at.getTime() > UNDO_WINDOW_MS) throw new UndoRefusedError();

  const remove = db.delete(extractions).where(eq(extractions.id, shotId));
  const openedByThis = shot.openedAt?.getTime() === shot.at.getTime() && isOpen(shot);
  const others = openedByThis
    ? await db
        .select({ id: extractions.id })
        .from(extractions)
        .where(and(eq(extractions.portionId, shot.portionId), ne(extractions.id, shotId)))
        .limit(1)
    : [];
  if (openedByThis && !others.length) {
    await db.batch([remove, db.update(batchPortions).set({ openedAt: null }).where(eq(batchPortions.id, shot.portionId))]);
  } else {
    await remove;
  }
}

import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { batchPortions, drinkTypes, extractions, milkTypes, personas } from "@/db/schema";
import { validateBrewControls, type BrewValues } from "@/domain/brewControls";
import { validateMilk } from "@/domain/milk";
import { tastingColumns, type Tasting } from "@/domain/tasting";
import { portionState } from "@/domain/portionState";
import { setupMachine } from "./logContext";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";

/*
 * Saving a measured shot (STORY-01-03-03). A shot records its setup only;
 * the parts follow from the setup, which never changes, so the shot keeps
 * showing what it was pulled with (AC 2). Saving is one batch: the shot,
 * and opening an unopened portion, land together or not at all (AC 4).
 */

/** The portion is finished, so nothing more can be brewed from it. */
export class PortionFinishedError extends Error {
  constructor() {
    super("Portion finished");
    this.name = "PortionFinishedError";
  }
}

/** A value is missing or out of any sensible range; nothing was saved. */
export class InvalidShotError extends Error {
  constructor(field: string) {
    super(`Invalid ${field}`);
    this.name = "InvalidShotError";
  }
}

export type MeasuredShot = {
  setupId: string;
  drinkTypeId: string;
  portionId: string;
  /** In the grinder's own units. */
  grind: number;
  /** Grams. */
  dose: number;
  /** Grams. */
  yield: number;
  /** Milliseconds. */
  timeMs: number;
  sweetened?: boolean;
  /** Puck prep (STORY-01-03-06); never part of the setup. */
  usedWdt?: boolean;
  usedPuckScreen?: boolean;
  /** Milk drinks only (STORY-01-03-07): a household milk and 0 to 500 ml. */
  milkTypeId?: string | null;
  milkMl?: number | null;
} & Partial<BrewValues>;

const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function check(input: MeasuredShot) {
  if (!finite(input.grind) || input.grind < 0) throw new InvalidShotError("grind");
  if (!finite(input.dose) || input.dose <= 0 || input.dose > 100) throw new InvalidShotError("dose");
  if (!finite(input.yield) || input.yield <= 0 || input.yield > 500) throw new InvalidShotError("yield");
  if (!finite(input.timeMs) || input.timeMs < 0 || input.timeMs > 600_000) throw new InvalidShotError("time");
}

export async function saveMeasuredShot(input: MeasuredShot, now = new Date()): Promise<{ id: string }> {
  const { householdId, userId } = await requireHousehold();
  check(input);
  await Promise.all([
    assertOwned("setups", input.setupId, householdId),
    assertOwned("drinkTypes", input.drinkTypeId, householdId),
    assertOwned("batchPortions", input.portionId, householdId),
  ]);

  // Temperature and pressure must fit the setup's machine (EPIC-01-04); unset always does.
  const brew: BrewValues = {
    brewTempC: input.brewTempC ?? null,
    brewTempStep: input.brewTempStep ?? null,
    pressureBar: input.pressureBar ?? null,
    pressureStep: input.pressureStep ?? null,
  };
  if (Object.values(brew).some((v) => v !== null)) validateBrewControls(await setupMachine(input.setupId), brew);

  // Milk only for a drink with milk, from the household's own list (STORY-01-03-07).
  const milk = { milkTypeId: input.milkTypeId ?? null, ml: input.milkMl ?? null };
  if (milk.milkTypeId !== null || milk.ml !== null) {
    const [[drink], milks] = await Promise.all([
      db.select({ hasMilk: drinkTypes.hasMilk }).from(drinkTypes).where(eq(drinkTypes.id, input.drinkTypeId)),
      db.select({ id: milkTypes.id }).from(milkTypes).where(eq(milkTypes.householdId, householdId)),
    ]);
    validateMilk({ hasMilk: drink.hasMilk, ...milk, visibleMilkIds: milks.map((m) => m.id) });
  }

  const [portion] = await db.select().from(batchPortions).where(eq(batchPortions.id, input.portionId));
  const state = portionState(portion);
  if (state === "finished") throw new PortionFinishedError();

  const [persona] = await db
    .select({ id: personas.id })
    .from(personas)
    .where(and(eq(personas.householdId, householdId), eq(personas.isDefault, true)));
  if (!persona) throw new NotFoundError();

  const id = newId();
  const shot = db.insert(extractions).values({
    id,
    householdId,
    personaId: persona.id,
    loggedByUserId: userId,
    setupId: input.setupId,
    portionId: input.portionId,
    drinkTypeId: input.drinkTypeId,
    sweetened: input.sweetened === true,
    usedWdt: input.usedWdt === true,
    usedPuckScreen: input.usedPuckScreen === true,
    milkTypeId: milk.milkTypeId,
    milkMl: milk.ml,
    entryMode: "measured",
    grindSize: input.grind,
    doseWeight: input.dose,
    yieldWeight: input.yield,
    yieldTime: Math.round(input.timeMs),
    ...brew,
    createdAt: now,
  });
  // The first shot from an unopened portion opens it (STORY-03-01-03 AC 3).
  // A frozen portion is ground from frozen: none of its dates change.
  if (state === "unopened") {
    await db.batch([shot, db.update(batchPortions).set({ openedAt: now }).where(eq(batchPortions.id, input.portionId))]);
  } else {
    await shot;
  }
  return { id };
}

/**
 * What edit mode can change on a saved shot (STORY-02-06-02): values,
 * temperature and pressure, milk, prep, sweetened and taste. Context
 * (portion, drink, setup, persona, logger, entry mode) can't change, so it
 * isn't here. Each field left out keeps its stored value.
 */
export type ShotEdit = Partial<
  {
    grind: number;
    dose: number;
    yield: number;
    timeMs: number;
    sweetened: boolean;
    usedWdt: boolean;
    usedPuckScreen: boolean;
    milkTypeId: string | null;
    milkMl: number | null;
  } & BrewValues
> & { taste?: Tasting };

const RANGES = {
  grind: (v: number) => v >= 0,
  dose: (v: number) => v > 0 && v <= 100,
  yield: (v: number) => v > 0 && v <= 500,
  timeMs: (v: number) => v >= 0 && v <= 600_000,
} as const;
const COLUMNS = { grind: "grindSize", dose: "doseWeight", yield: "yieldWeight", timeMs: "yieldTime" } as const;

/**
 * Saves an edited shot. A one-tap shot takes answers and tags but never a
 * rating, and stays one-tap with its reaction. A stored value outside
 * today's ranges may stay as it is (STORY-01-06-09 AC 4); only a changed
 * value is checked. Remaining coffee follows the new dose, since it's
 * derived from the shots; recipes are never touched.
 */
export async function updateShot(shotId: string, edit: ShotEdit): Promise<void> {
  const { householdId } = await requireHousehold();
  await assertOwned("extractions", shotId, householdId);
  const [stored] = await db.select().from(extractions).where(eq(extractions.id, shotId));
  const set: Partial<typeof extractions.$inferInsert> = {};

  for (const key of ["grind", "dose", "yield", "timeMs"] as const) {
    const v = edit[key];
    if (v === undefined || v === stored[COLUMNS[key]]) continue;
    if (!finite(v) || !RANGES[key](v)) throw new InvalidShotError(key);
    set[COLUMNS[key]] = key === "timeMs" ? Math.round(v) : v;
  }

  // Temperature and pressure, a pair at a time: an unchanged pair stays as stored.
  const pairs = { temperature: ["brewTempC", "brewTempStep"], pressure: ["pressureBar", "pressureStep"] } as const;
  const changed: BrewValues = { brewTempC: null, brewTempStep: null, pressureBar: null, pressureStep: null };
  let brewChanged = false;
  for (const [a, b] of Object.values(pairs)) {
    if (edit[a] === undefined && edit[b] === undefined) continue;
    const next = { [a]: edit[a] ?? null, [b]: edit[b] ?? null } as Partial<BrewValues>;
    if (next[a] === stored[a] && next[b] === stored[b]) continue;
    Object.assign(changed, next);
    Object.assign(set, next);
    brewChanged = true;
  }
  if (brewChanged) validateBrewControls(await setupMachine(stored.setupId), changed);

  if (edit.milkTypeId !== undefined || edit.milkMl !== undefined) {
    const milk = { milkTypeId: edit.milkTypeId ?? null, ml: edit.milkMl ?? null };
    if (milk.milkTypeId !== stored.milkTypeId || milk.ml !== stored.milkMl) {
      const [[drink], milks] = await Promise.all([
        db.select({ hasMilk: drinkTypes.hasMilk }).from(drinkTypes).where(eq(drinkTypes.id, stored.drinkTypeId)),
        db.select({ id: milkTypes.id }).from(milkTypes).where(eq(milkTypes.householdId, householdId)),
      ]);
      validateMilk({ hasMilk: drink.hasMilk, ...milk, visibleMilkIds: milks.map((m) => m.id) });
      set.milkTypeId = milk.milkTypeId;
      set.milkMl = milk.ml;
    }
  }

  if (edit.sweetened !== undefined) set.sweetened = edit.sweetened === true;
  if (edit.usedWdt !== undefined) set.usedWdt = edit.usedWdt === true;
  if (edit.usedPuckScreen !== undefined) set.usedPuckScreen = edit.usedPuckScreen === true;
  if (edit.taste) Object.assign(set, tastingColumns(edit.taste, stored.entryMode));

  if (Object.keys(set).length === 0) return;
  await db.update(extractions).set(set).where(eq(extractions.id, shotId));
}

import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { batchPortions, extractions, personas } from "@/db/schema";
import { validateBrewControls, type BrewValues } from "@/domain/brewControls";
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

import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { canonicalBeans, canonicalHardware, extractions, ownedHardware, personas, setupParts } from "@/db/schema";
import type { BrewValues } from "@/domain/brewControls";
import { parseCapabilities } from "@/domain/capabilities";
import { carryOver, type SetupPartIds } from "@/domain/carryOver";
import { closestSetup } from "@/domain/closestSetup";
import { grindWheelConfig, middleGrind } from "@/domain/grind";
import type { Prep } from "@/domain/prep";
import { resolveEntity } from "./catalogMerge";
import { partsOf, setupsOf, type SetupSummary } from "./parts";
import { listCurrentRecipesForBean } from "./recipes";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";
import { setupsLastUsed } from "./setups";

/*
 * Where a dial-in starts when this setup has no recipe for the coffee and
 * drink (STORY-02-01-06): the recipe on the closest setup that has one
 * (most shared parts, then most recently used), carried over by DQ-20. Dose,
 * yield, time, prep and milk come with it; grind and temperature and
 * pressure only with the same grinder or machine.
 */

export type DialInStart = {
  /** The setup the values come from. */
  fromSetupId: string;
  values: { grind: number; dose: number; yield: number; timeMs: number };
  brew: BrewValues;
  prep: Prep;
  milk: { milkTypeId: string | null; milkMl: number | null };
  /** False when grind didn't carry over, so the log says so (AC 4). */
  grindCarried: boolean;
};

/** Null when no setup has a recipe: the dial-in starts blank (AC 6). */
export async function getDialInStart(input: { beanId: string; drinkTypeId: string; setupId: string }): Promise<DialInStart | null> {
  const { householdId } = await requireHousehold();
  await Promise.all([assertOwned("setups", input.setupId, householdId), assertOwned("drinkTypes", input.drinkTypeId, householdId)]);
  const [persona] = await db
    .select({ id: personas.id })
    .from(personas)
    .where(and(eq(personas.householdId, householdId), eq(personas.isDefault, true)));
  if (!persona) throw new NotFoundError();
  const beanId = (await resolveEntity(db, canonicalBeans, input.beanId)) ?? input.beanId;

  const recipes = (await listCurrentRecipesForBean(beanId, persona.id)).filter((r) => r.drinkTypeId === input.drinkTypeId);
  if (!recipes.length) return null;
  // A recipe here wins; otherwise the closest setup with one (AC 2).
  const setupList = await setupsOf(householdId, await partsOf(householdId));
  const target = setupList.find((s) => s.id === input.setupId)!;
  const own = recipes.find((r) => r.setupId === input.setupId);
  const shape = (s: SetupSummary) => ({ id: s.id, partIds: s.parts.map((p) => p.id) });
  const closest = own
    ? { id: own.setupId }
    : closestSetup(shape(target), setupList.map(shape), (id) => recipes.some((r) => r.setupId === id), await setupsLastUsed(householdId));
  if (!closest) return null;
  const recipe = recipes.find((r) => r.setupId === closest.id)!;
  const from = setupList.find((s) => s.id === closest.id)!;

  const to = partIds(target);
  const carried = carryOver({
    from: partIds(from),
    to,
    grind: recipe.grind,
    brew: { brewTempC: recipe.brewTempC, brewTempStep: recipe.brewTempStep, pressureBar: recipe.pressureBar, pressureStep: recipe.pressureStep },
    lastGrindOnGrinder: to.grinderId ? await lastGrindOn(householdId, to.grinderId) : null,
    middleGrind: middleGrind(grindWheelConfig(await grindScaleOf(to.grinderId))),
  });
  return {
    fromSetupId: from.id,
    values: { grind: carried.grind, dose: recipe.dose, yield: recipe.yield, timeMs: recipe.timeMs },
    brew: carried.brew,
    prep: { wdt: recipe.usedWdt, puckScreen: recipe.usedPuckScreen },
    milk: { milkTypeId: recipe.milkTypeId, milkMl: recipe.milkMl },
    grindCarried: carried.grindCarried,
  };
}

function partIds(s: SetupSummary): SetupPartIds {
  return {
    grinderId: s.parts.find((p) => p.kind === "grinder")?.id ?? null,
    machineId: s.parts.find((p) => p.kind === "machine")?.id ?? null,
  };
}

/** The grinder's last measured grind, on any setup it's part of. One-tap shots copy a recipe, so they don't count. */
export async function lastGrindOn(householdId: string, grinderPartId: string): Promise<number | null> {
  const [row] = await db
    .select({ grind: extractions.grindSize })
    .from(extractions)
    .innerJoin(setupParts, eq(setupParts.setupId, extractions.setupId))
    .where(
      and(
        eq(extractions.householdId, householdId),
        eq(extractions.entryMode, "measured"),
        eq(setupParts.ownedHardwareId, grinderPartId),
      ),
    )
    .orderBy(desc(extractions.createdAt))
    .limit(1);
  return row?.grind ?? null;
}

/** The same, for the signed-in household. */
export async function lastGrindOnPart(grinderPartId: string): Promise<number | null> {
  const { householdId } = await requireHousehold();
  return lastGrindOn(householdId, grinderPartId);
}

async function grindScaleOf(grinderPartId: string | null) {
  if (!grinderPartId) return null;
  const [row] = await db
    .select({ capabilities: canonicalHardware.capabilities })
    .from(ownedHardware)
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(eq(ownedHardware.id, grinderPartId));
  return row ? (parseCapabilities("grinder", row.capabilities)?.grind ?? null) : null;
}

import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { canonicalBeans, canonicalHardware, extractions, ownedHardware, setupParts } from "@/db/schema";
import type { BrewValues } from "@/domain/brewControls";
import { parseCapabilities } from "@/domain/capabilities";
import { carryOver, type SetupPartIds } from "@/domain/carryOver";
import { closestSetup } from "@/domain/closestSetup";
import { grindWheelConfig, middleGrind } from "@/domain/grind";
import type { Prep } from "@/domain/prep";
import { resolveEntity } from "./catalogMerge";
import { partsOf, setupsOf, type SetupSummary } from "./parts";
import { getBagOwnRecipe, getBorrowedRecipe, listCurrentRecipesForBean } from "./recipes";
import { assertOwned, requireHousehold } from "./scope";
import { setupsLastUsed } from "./setups";
import { actingPersona } from "./persona";

/*
 * Where a dial-in starts when this setup has no recipe for the coffee and
 * drink (STORY-02-01-06): the recipe on the closest setup that has one
 * (most shared parts, then most recently used), carried over by DQ-20. Dose,
 * yield, time, prep, milk and sweetened come with it; grind and temperature and
 * pressure only with the same grinder or machine.
 */

export type DialInStart = {
  /** The setup the values come from. */
  fromSetupId: string;
  values: { grind: number; dose: number; yield: number; timeMs: number };
  brew: BrewValues;
  prep: Prep;
  milk: { milkTypeId: string | null; milkMl: number | null };
  /** The recipe's sweetened tick; not tied to a part, so it carries over like prep (STORY-02-01-08). */
  sweetened: boolean;
  /** False when grind didn't carry over, so the log says so (AC 4). */
  grindCarried: boolean;
  /** Another profile's recipe on this setup, said on Brew and the log (STORY-05-01-05 AC 1). */
  borrowedFrom: { personaId: string; name: string | null } | null;
};

/**
 * Null when no setup has a recipe: the dial-in starts blank (AC 6). With the
 * bag in use (`batchId`), its own recipe on this setup wins (STORY-02-04-02);
 * a new bag has none, so the coffee's applies (AC 3).
 */
export async function getDialInStart(input: { beanId: string; drinkTypeId: string; setupId: string; batchId?: string | null }): Promise<DialInStart | null> {
  const { householdId } = await requireHousehold();
  await Promise.all([assertOwned("setups", input.setupId, householdId), assertOwned("drinkTypes", input.drinkTypeId, householdId)]);
  const persona = await actingPersona();
  const beanId = (await resolveEntity(db, canonicalBeans, input.beanId)) ?? input.beanId;

  const coffee = (await listCurrentRecipesForBean(beanId, persona.id)).filter((r) => r.drinkTypeId === input.drinkTypeId);
  // None of their own here: another profile's on this setup wins over the closest setup (STORY-05-01-05, Q4).
  if (!coffee.some((r) => r.setupId === input.setupId)) {
    const borrowed = await getBorrowedRecipe({ beanId, personaId: persona.id, setupId: input.setupId, drinkTypeId: input.drinkTypeId });
    if (borrowed) {
      const r = borrowed.recipe;
      return {
        fromSetupId: input.setupId,
        values: { grind: r.grind, dose: r.dose, yield: r.yield, timeMs: r.timeMs },
        brew: { brewTempC: r.brewTempC, brewTempStep: r.brewTempStep, pressureBar: r.pressureBar, pressureStep: r.pressureStep },
        prep: { wdt: r.usedWdt, puckScreen: r.usedPuckScreen },
        milk: { milkTypeId: r.milkTypeId, milkMl: r.milkMl },
        sweetened: r.sweetened,
        grindCarried: true,
        borrowedFrom: { personaId: borrowed.persona.id, name: borrowed.persona.name },
      };
    }
  }
  if (!coffee.length) return null;
  const bagOwn = input.batchId
    ? await getBagOwnRecipe({ beanId, personaId: persona.id, setupId: input.setupId, drinkTypeId: input.drinkTypeId }, input.batchId)
    : null;
  const recipes = bagOwn ? [bagOwn, ...coffee.filter((r) => r.setupId !== input.setupId)] : coffee;
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
    sweetened: recipe.sweetened,
    grindCarried: carried.grindCarried,
    borrowedFrom: null,
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

import "server-only";
import { and, asc, desc, eq, inArray, isNull, or } from "drizzle-orm";
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
  personas,
  roasters,
  setupParts,
} from "@/db/schema";
import { parseCapabilities, type GrindScale, type MachineCapabilities } from "@/domain/capabilities";
import { NO_BREW_VALUES, type BrewValues } from "@/domain/brewControls";
import { prepStart, type Prep } from "@/domain/prep";
import { grindWheelConfig, middleGrind } from "@/domain/grind";
import { isOpen, portionState, type PortionState } from "@/domain/portionState";
import { resolveEntity } from "./catalogMerge";
import { partsOf, setupsOf, type SetupSummary } from "./parts";
import { assertOwned, requireHousehold } from "./scope";
import { currentSetupOf } from "./setups";

/*
 * What the shot log opens with (STORY-01-03-01): the household's setups,
 * drinks, milks and unfinished portions, each with the one chosen to start.
 *
 * Milestone 1 starting values (TASK-01-03-01-BE1, revision 4): there is only
 * one setup until wave 6, so it is the default. The drink is the one of the
 * persona's latest shot, else the first visible drink. The coffee is the
 * latest shot's portion while it's neither finished nor frozen; else the
 * open portion opened earliest; else the newest unopened one.
 */

export type LogSetup = SetupSummary & {
  /** The setup grinder's scale, when its capabilities are known. */
  grind: GrindScale | null;
  /** The setup machine's temperature and pressure (EPIC-01-04), when parseable. */
  machine: MachineCapabilities | null;
};

export type LogDrink = {
  id: string;
  name: string | null;
  nameKey: string | null;
  hasMilk: boolean;
  typicalMilkMl: number | null;
};

export type LogMilk = { id: string; name: string | null; nameKey: string | null };

export type LogPortion = {
  id: string;
  batchId: string;
  bean: { id: string; name: string; roasterName: string };
  roastDate: Date | null;
  /** When the bag was added, to tell bags apart without a roast date. */
  bagAddedAt: Date;
  state: Exclude<PortionState, "finished">;
  /** When it was opened, or thawed if it never was; null while unopened. */
  openedAt: Date | null;
  weight: number;
  /** Frozen portions come last and are marked (AC 3). */
  frozen: boolean;
};

export type LogContext = {
  setups: LogSetup[];
  defaultSetupId: string | null;
  drinks: LogDrink[];
  defaultDrinkId: string | null;
  milks: LogMilk[];
  portions: LogPortion[];
  defaultPortionId: string | null;
  missingSetup: boolean;
  missingCoffee: boolean;
};

/**
 * Options in the order the log offers them (AC 2, AC 3): open portions by
 * when they were opened, then unopened ones newest bag first, then frozen.
 */
function portionOrder(a: LogPortion, b: LogPortion) {
  const rank = (p: LogPortion) => (p.frozen ? 2 : p.openedAt ? 0 : 1);
  return (
    rank(a) - rank(b) ||
    (rank(a) === 0 ? a.openedAt!.getTime() - b.openedAt!.getTime() : 0) ||
    b.bagAddedAt.getTime() - a.bagAddedAt.getTime()
  );
}

async function unfinishedPortions(householdId: string): Promise<LogPortion[]> {
  const rows = await db
    .select({
      id: batchPortions.id,
      batchId: batches.id,
      beanId: batches.beanId,
      roastDate: batches.roastDate,
      batchCreatedAt: batches.createdAt,
      weight: batchPortions.weight,
      frozenAt: batchPortions.frozenAt,
      thawedAt: batchPortions.thawedAt,
      openedAt: batchPortions.openedAt,
      finishedAt: batchPortions.finishedAt,
    })
    .from(batchPortions)
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(and(eq(batches.householdId, householdId), isNull(batchPortions.finishedAt)))
    .orderBy(asc(batchPortions.createdAt));

  const beans = new Map<string, LogPortion["bean"]>();
  for (const r of rows) {
    if (beans.has(r.beanId)) continue;
    const id = (await resolveEntity(db, canonicalBeans, r.beanId)) ?? r.beanId;
    const [bean] = await db
      .select({ id: canonicalBeans.id, name: canonicalBeans.name, roasterName: roasters.name })
      .from(canonicalBeans)
      .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
      .where(eq(canonicalBeans.id, id));
    beans.set(r.beanId, bean);
  }

  return rows
    .map((r) => {
      const state = portionState(r) as LogPortion["state"];
      return {
        id: r.id,
        batchId: r.batchId,
        bean: beans.get(r.beanId)!,
        roastDate: r.roastDate,
        state,
        openedAt: isOpen(r) ? (r.openedAt ?? r.thawedAt) : null,
        weight: r.weight,
        frozen: state === "frozen",
        bagAddedAt: r.batchCreatedAt,
      };
    })
    .sort(portionOrder);
}

/** Each setup part's model capabilities, by hardware ID. */
async function modelCapabilities(setupList: SetupSummary[]): Promise<Map<string, unknown>> {
  const ids = [...new Set(setupList.flatMap((s) => s.parts.filter((p) => p.kind !== "basket").map((p) => p.hardwareId)))];
  if (!ids.length) return new Map();
  const rows = await db
    .select({ id: canonicalHardware.id, capabilities: canonicalHardware.capabilities })
    .from(canonicalHardware)
    .where(inArray(canonicalHardware.id, ids));
  return new Map(rows.map((r) => [r.id, r.capabilities]));
}

/** The machine capabilities of a setup, for the log and for checking a save. */
export async function setupMachine(setupId: string): Promise<MachineCapabilities | null> {
  const [machine] = await db
    .select({ capabilities: canonicalHardware.capabilities })
    .from(setupParts)
    .innerJoin(ownedHardware, eq(ownedHardware.id, setupParts.ownedHardwareId))
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(and(eq(setupParts.setupId, setupId), eq(canonicalHardware.kind, "machine")));
  return machine ? parseCapabilities("machine", machine.capabilities) : null;
}

/**
 * The shot log's context. `drinkId` and `portionId` are what Brew (or a
 * side task coming back) chose; each is used when it's one of the options.
 */
export async function getLogContext(chosen: { drinkId?: string; portionId?: string } = {}): Promise<LogContext> {
  const { householdId } = await requireHousehold();

  const [setupList, drinks, milks, portions, latest] = await Promise.all([
    partsOf(householdId).then((parts) => setupsOf(householdId, parts)),
    db
      .select({
        id: drinkTypes.id,
        name: drinkTypes.name,
        nameKey: drinkTypes.nameKey,
        hasMilk: drinkTypes.hasMilk,
        typicalMilkMl: drinkTypes.typicalMilkMl,
      })
      .from(drinkTypes)
      .where(and(eq(drinkTypes.householdId, householdId), or(isNull(drinkTypes.hidden), eq(drinkTypes.hidden, false))))
      .orderBy(asc(drinkTypes.sortOrder)),
    db
      .select({ id: milkTypes.id, name: milkTypes.name, nameKey: milkTypes.nameKey })
      .from(milkTypes)
      .where(and(eq(milkTypes.householdId, householdId), or(isNull(milkTypes.hidden), eq(milkTypes.hidden, false))))
      .orderBy(asc(milkTypes.sortOrder)),
    unfinishedPortions(householdId),
    db
      .select({ drinkTypeId: extractions.drinkTypeId, portionId: extractions.portionId })
      .from(extractions)
      .innerJoin(personas, eq(personas.id, extractions.personaId))
      .where(and(eq(extractions.householdId, householdId), eq(personas.isDefault, true)))
      .orderBy(desc(extractions.createdAt))
      .limit(1)
      .then((r) => r[0] ?? null),
  ]);

  const caps = await modelCapabilities(setupList);
  const setups: LogSetup[] = setupList
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((s) => {
      const grinder = s.parts.find((p) => p.kind === "grinder");
      const machine = s.parts.find((p) => p.kind === "machine");
      return {
        ...s,
        grind: grinder ? (parseCapabilities("grinder", caps.get(grinder.hardwareId))?.grind ?? null) : null,
        machine: machine ? parseCapabilities("machine", caps.get(machine.hardwareId)) : null,
      };
    });

  const drinkIds = new Set(drinks.map((d) => d.id));
  const pick = (id: string | undefined | null) => (id && drinkIds.has(id) ? id : null);
  const defaultDrinkId = pick(chosen.drinkId) ?? pick(latest?.drinkTypeId) ?? drinks[0]?.id ?? null;

  const usable = (id: string | undefined | null) => portions.find((p) => p.id === id);
  const lastShot = usable(latest?.portionId);
  const defaultPortionId =
    usable(chosen.portionId)?.id ??
    (lastShot && !lastShot.frozen ? lastShot.id : undefined) ??
    // Ordered already: open by when opened, then unopened newest first, then frozen.
    portions[0]?.id ??
    null;

  return {
    setups,
    defaultSetupId: await currentSetupOf(householdId, setups),
    drinks: drinks.map((d) => ({ ...d, typicalMilkMl: d.typicalMilkMl ?? null })),
    defaultDrinkId,
    milks,
    portions,
    defaultPortionId,
    missingSetup: setups.length === 0,
    missingCoffee: portions.length === 0,
  };
}

/** DQ-07: neutral starting values for a setup with no measured shot. */
export const NEUTRAL_START = { dose: 18, yield: 36, timeMs: 28_000 } as const;

export type StartingValues = {
  grind: number;
  dose: number;
  yield: number;
  timeMs: number;
  /** The last temperature and pressure used on this setup, where "add" starts. New shots start unset (AC 2). */
  lastBrew: BrewValues;
  /** Puck prep: as on the last shot on this setup, or both off (STORY-01-03-06 AC 3). */
  prep: Prep;
};

/**
 * A blank log's values (STORY-01-03-02 AC 2): the latest measured shot on
 * this setup, else DQ-07's neutral values with grind in the middle of the
 * grinder's range. One-tap shots copy a recipe, so they never count.
 */
export async function getStartingValues(setupId: string): Promise<StartingValues> {
  const { householdId } = await requireHousehold();
  await assertOwned("setups", setupId, householdId);
  // Any shot counts for prep: a one-tap pull copies its recipe's ticks.
  const [lastAny] = await db
    .select({ wdt: extractions.usedWdt, puckScreen: extractions.usedPuckScreen })
    .from(extractions)
    .where(and(eq(extractions.householdId, householdId), eq(extractions.setupId, setupId)))
    .orderBy(desc(extractions.createdAt))
    .limit(1);
  const prep = prepStart({ lastShotOnSetup: lastAny ?? null });
  const [last] = await db
    .select({
      grind: extractions.grindSize,
      dose: extractions.doseWeight,
      yield: extractions.yieldWeight,
      timeMs: extractions.yieldTime,
      brewTempC: extractions.brewTempC,
      brewTempStep: extractions.brewTempStep,
      pressureBar: extractions.pressureBar,
      pressureStep: extractions.pressureStep,
    })
    .from(extractions)
    .where(
      and(
        eq(extractions.householdId, householdId),
        eq(extractions.setupId, setupId),
        eq(extractions.entryMode, "measured"),
      ),
    )
    .orderBy(desc(extractions.createdAt))
    .limit(1);
  if (last) {
    const { brewTempC, brewTempStep, pressureBar, pressureStep, ...values } = last;
    return { ...values, lastBrew: { brewTempC, brewTempStep, pressureBar, pressureStep }, prep };
  }

  const [grinder] = await db
    .select({ capabilities: canonicalHardware.capabilities })
    .from(setupParts)
    .innerJoin(ownedHardware, eq(ownedHardware.id, setupParts.ownedHardwareId))
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(and(eq(setupParts.setupId, setupId), eq(canonicalHardware.kind, "grinder")));
  const scale = grinder ? parseCapabilities("grinder", grinder.capabilities)?.grind : null;
  return { grind: middleGrind(grindWheelConfig(scale)), ...NEUTRAL_START, lastBrew: NO_BREW_VALUES, prep };
}

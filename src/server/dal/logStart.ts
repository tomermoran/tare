import "server-only";
import type { ServicingStep } from "@/domain/servicing";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalBeans, extractions, pinnedRecipes, setups } from "@/db/schema";
import { portionState } from "@/domain/portionState";
import { applyChange, type StartValues } from "@/domain/suggest/apply";
import { suggest, type Suggestion } from "@/domain/suggest";
import { mergeGroup, resolveEntity } from "./catalogMerge";
import { getDialInStart } from "./dialIn";
import { unfinishedPortions } from "./logContext";
import { portionChoices, type PortionChoice } from "./pull";
import { getCurrentRecipe, toRecipe } from "./recipes";
import { listRedialCandidates } from "./redial";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";
import { currentSetupOf } from "./setups";
import { getSuggestContext, type SuggestContext } from "./suggestContext";
import { actingPersonaId } from "./persona";
import { getGrindAdjustment, type GrindAdjustment } from "./grindAdjustment";

/*
 * Where the shot log starts in fix and dial-in modes (STORY-02-03-02, 03,
 * 07, STORY-02-01-06), and the pending suggestion Brew's "Dial in" offers.
 * A suggestion is never stored: it's worked out again from the saved
 * answers of the shot it came from.
 */

export type ShotSuggestion = Suggestion & { context: SuggestContext };

/** A shot's suggestion from its saved answers and tags. */
export async function suggestionForShot(shotId: string): Promise<ShotSuggestion> {
  const context = await getSuggestContext(shotId);
  const [s] = await db.select().from(extractions).where(eq(extractions.id, shotId));
  const { grinderPartId: _g, ...input } = context;
  void _g;
  const answers = { balance: s.tasteBalance, strength: s.tasteStrength, body: s.tasteBody, sweetness: s.tasteSweetness };
  return { ...suggest({ ...input, answers, tags: s.tasteTags ?? [] }), context };
}

/**
 * The suggestion from the latest shot on this coffee, setup and drink, when
 * it has a change (STORY-02-03-07 AC 3). Whether it was dismissed is known
 * only on the device, by the shot's ID.
 */
export async function getPendingSuggestion(key: { beanId: string; setupId: string; drinkTypeId: string }): Promise<{ shotId: string } | null> {
  const { householdId } = await requireHousehold();
  const personaId = await actingPersonaId();
  const beans = await mergeGroup(db, canonicalBeans, key.beanId);
  const [latest] = await db
    .select({ id: extractions.id })
    .from(extractions)
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(
      and(
        eq(extractions.householdId, householdId),
        eq(extractions.personaId, personaId),
        eq(extractions.setupId, key.setupId),
        eq(extractions.drinkTypeId, key.drinkTypeId),
        inArray(batches.beanId, beans),
      ),
    )
    .orderBy(desc(extractions.createdAt))
    .limit(1);
  if (!latest) return null;
  const s = await suggestionForShot(latest.id);
  return s.change ? { shotId: latest.id } : null;
}

export type LogStart = {
  setupId: string;
  drinkTypeId: string;
  /** The portion to log against; null to let the log pick as usual. */
  portionId: string | null;
  /** Fix mode: the one-tap shot's portion, drink and setup stay (STORY-02-03-02 AC 1). */
  locked: boolean;
  /** Before the change: what "was" shows. */
  start: StartValues;
  /** With the change made: where the dial opens. */
  applied: StartValues;
  milkTypeId: string | null;
  /** Where the sweetened tick starts: the recipe's, or a past shot's own (STORY-02-01-08). */
  sweetened: boolean;
  /** The change made, with what's needed to word it; null when none. */
  suggestion: ShotSuggestion | null;
  /** Dial-in from another setup's recipe (STORY-02-01-06 AC 3, AC 4). */
  from: { setupId: string; grindCarried: boolean } | null;
  /** "Dial in from this": when the past shot was made, for the log's note (STORY-02-06-06 AC 1). */
  fromShot: { at: Date } | null;
  /** The suggested grind the dial-in starts at, the recipe's as "was" (STORY-04-02-06 AC 3). */
  grindAdjustment?: GrindAdjustment | null;
  /** Starts from another profile's recipe, named in the log's note (STORY-05-01-05 AC 1). */
  borrowedFrom?: { name: string | null } | null;
  /** Confirmed servicing shifts already in the start's grind, to label it (STORY-04-03-03 AC 1). */
  servicing?: ServicingStep[];
  /** Re-dialling after servicing: the event, for the log's banner and the offset sheet (STORY-04-03-04 AC 5). */
  redialEventId?: string | null;
};

type Row = typeof extractions.$inferSelect;
const valuesOf = (s: Row | NonNullable<Awaited<ReturnType<typeof getCurrentRecipe>>>, kind: "shot" | "recipe"): StartValues => {
  if (kind === "shot") {
    const r = s as Row;
    return {
      grind: r.grindSize,
      dose: r.doseWeight,
      yield: r.yieldWeight,
      timeMs: r.yieldTime,
      brew: { brewTempC: r.brewTempC, brewTempStep: r.brewTempStep, pressureBar: r.pressureBar, pressureStep: r.pressureStep },
      prep: { wdt: r.usedWdt, puckScreen: r.usedPuckScreen },
      milkMl: r.milkMl,
    };
  }
  const r = s as NonNullable<Awaited<ReturnType<typeof getCurrentRecipe>>>;
  return {
    grind: r.grind,
    dose: r.dose,
    yield: r.yield,
    timeMs: r.timeMs,
    brew: { brewTempC: r.brewTempC, brewTempStep: r.brewTempStep, pressureBar: r.pressureBar, pressureStep: r.pressureStep },
    prep: { wdt: r.usedWdt, puckScreen: r.usedPuckScreen },
    milkMl: r.milkMl,
  };
};

async function shotRow(shotId: string) {
  const { householdId } = await requireHousehold();
  await assertOwned("extractions", shotId, householdId);
  const [r] = await db
    .select({ shot: extractions, beanId: batches.beanId, portion: batchPortions })
    .from(extractions)
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(eq(extractions.id, shotId));
  return r;
}

/** A suggestion to apply, only from a shot of this household; none when it has no change. */
async function applying(suggestedShotId: string | undefined): Promise<ShotSuggestion | null> {
  if (!suggestedShotId) return null;
  const { householdId } = await requireHousehold();
  await assertOwned("extractions", suggestedShotId, householdId);
  const s = await suggestionForShot(suggestedShotId);
  return s.change ? s : null;
}

/**
 * Fix mode (STORY-02-03-02): the current recipe's values, prep and milk, the
 * one-tap shot's setup, drink and portion, and with `suggested` its change.
 */
export async function getFixStart(shotId: string, suggested?: string): Promise<LogStart> {
  const r = await shotRow(shotId);
  const s = r.shot;
  // The shot's bag may have its own recipe (STORY-02-04-02).
  const recipe = await getCurrentRecipe({ beanId: r.beanId, personaId: s.personaId, setupId: s.setupId, drinkTypeId: s.drinkTypeId }, r.portion.batchId);
  // A one-tap shot is its recipe's copy, so it stands in when the recipe was replaced.
  const start = recipe ? valuesOf(recipe, "recipe") : valuesOf(s, "shot");
  const suggestion = await applying(suggested);
  return {
    setupId: s.setupId,
    drinkTypeId: s.drinkTypeId,
    portionId: s.portionId,
    locked: true,
    start,
    applied: applyChange(start, suggestion?.change ?? null),
    servicing: recipe?.servicing ?? [],
    milkTypeId: recipe ? recipe.milkTypeId : s.milkTypeId,
    sweetened: recipe ? recipe.sweetened : s.sweetened === true,
    suggestion,
    from: null,
    fromShot: null,
  };
}

/**
 * Dial in from a past shot (STORY-02-06-06), or "dial in with this change"
 * after tasting (STORY-02-03-07 AC 1): that shot's values, prep, milk, setup
 * and drink, plus the change when `suggested`. The coffee stays the shot's:
 * `portionId` is a bag of it chosen on SH-PORTION, else the shot's own while
 * it lasts. The past shot is only read (AC 5).
 */
export async function getDialInFromShot(shotId: string, suggested?: string, portionId?: string, now = new Date()): Promise<LogStart> {
  const r = await shotRow(shotId);
  const s = r.shot;
  const start = valuesOf(s, "shot");
  const suggestion = await applying(suggested);
  const chosen = portionId ? (await portionsOf(r.beanId, now)).find((p) => p.id === portionId) : undefined;
  if (portionId && !chosen) throw new NotFoundError();
  return {
    setupId: s.setupId,
    drinkTypeId: s.drinkTypeId,
    portionId: chosen?.id ?? (portionState(r.portion) === "finished" ? null : s.portionId),
    locked: false,
    start,
    applied: applyChange(start, suggestion?.change ?? null),
    milkTypeId: s.milkTypeId,
    sweetened: s.sweetened === true,
    suggestion,
    from: null,
    fromShot: suggested ? null : { at: s.createdAt },
  };
}

/** The coffee's unfinished portions, by its surviving catalog entry. */
async function portionsOf(beanId: string, now: Date) {
  const { householdId } = await requireHousehold();
  const id = (await resolveEntity(db, canonicalBeans, beanId)) ?? beanId;
  return (await unfinishedPortions(householdId, now)).filter((p) => p.bean.id === id);
}

export type DialInPortion =
  | { kind: "portion"; portionId: string }
  /** None of the coffee is open: which bag (STORY-02-06-06 AC 2); empty when it's finished (AC 3). */
  | { kind: "choose"; portions: PortionChoice[] };

/**
 * Which bag "dial in from this" uses, by the one-tap rule: the shot's own
 * portion while it's open, else the earliest-opened open one of that coffee.
 */
export async function dialInPortion(shotId: string, now = new Date()): Promise<DialInPortion> {
  const r = await shotRow(shotId);
  const portions = await portionsOf(r.beanId, now);
  const open = portions.find((p) => p.id === r.shot.portionId && p.openedAt !== null) ?? portions.find((p) => p.openedAt !== null);
  if (open) return { kind: "portion", portionId: open.id };
  return { kind: "choose", portions: await portionChoices(r.beanId, now) };
}

/**
 * The bag a dial-in is for (STORY-02-04-02): the chosen portion's, else the
 * earliest-opened open portion of the coffee, like the pull. None when
 * nothing of it is open.
 */
async function bagInUse(householdId: string, beanId: string, portionId: string | undefined): Promise<string | null> {
  const portions = (await unfinishedPortions(householdId, new Date())).filter((p) => p.bean.id === beanId);
  const portion = portionId ? portions.find((p) => p.id === portionId) : portions.find((p) => p.openedAt !== null);
  return portion?.batchId ?? null;
}

/**
 * Dial in from Brew (STORY-02-03-03, STORY-02-01-06): the recipe on the
 * current setup, else the closest setup's carried over; null when no setup
 * has one, so the log starts blank. A pending suggestion is applied when
 * Brew passes its shot.
 */
export async function getDialInFromRecipe(key: { drinkTypeId: string; beanId: string; portionId?: string; suggested?: string }): Promise<LogStart | null> {
  const { householdId } = await requireHousehold();
  const setupList = await db.select({ id: setups.id, createdAt: setups.createdAt }).from(setups).where(eq(setups.householdId, householdId));
  const setupId = await currentSetupOf(householdId, setupList);
  if (!setupId) return null;
  const beanId = (await resolveEntity(db, canonicalBeans, key.beanId)) ?? key.beanId;
  const dialIn = await getDialInStart({ beanId, drinkTypeId: key.drinkTypeId, setupId, batchId: await bagInUse(householdId, beanId, key.portionId) });
  if (!dialIn) return null;
  const start: StartValues = { ...dialIn.values, brew: dialIn.brew, prep: dialIn.prep, milkMl: dialIn.milk.milkMl };
  const suggestion = await applying(key.suggested);
  // Drift and suggestions never meet (DQ-34); a different grinder gets none.
  const grindAdjustment =
    suggestion || !dialIn.grindCarried
      ? null
      : await getGrindAdjustment({ recipe: { beanId, setupId: dialIn.fromSetupId, grind: start.grind }, portionId: key.portionId ?? null });
  const applied = applyChange(start, suggestion?.change ?? null);
  return {
    setupId,
    drinkTypeId: key.drinkTypeId,
    portionId: key.portionId ?? null,
    locked: false,
    start,
    applied: grindAdjustment ? { ...applied, grind: grindAdjustment.shown } : applied,
    grindAdjustment,
    servicing: dialIn.servicing ?? [],
    milkTypeId: dialIn.milk.milkTypeId,
    sweetened: dialIn.sweetened,
    suggestion,
    from: dialIn.fromSetupId === setupId ? null : { setupId: dialIn.fromSetupId, grindCarried: dialIn.grindCarried },
    fromShot: null,
    borrowedFrom: dialIn.borrowedFrom && { name: dialIn.borrowedFrom.name },
  };
}

/**
 * A re-dial after servicing (STORY-04-03-04 AC 5): the old recipe's raw
 * grind as the start and "was", its other values, prep, milk and
 * sweetened, on the current setup. No drift adjustment: the old number
 * only means something as a starting point.
 */
export async function getRedialStart(eventId: string, recipeId: string, portionId?: string): Promise<LogStart> {
  const { householdId } = await requireHousehold();
  const candidates = await listRedialCandidates(eventId);
  if (!candidates.some((c) => c.recipeId === recipeId)) throw new NotFoundError();
  const [row] = await db.select().from(pinnedRecipes).where(and(eq(pinnedRecipes.id, recipeId), eq(pinnedRecipes.householdId, householdId)));
  const recipe = toRecipe(row);
  const setupList = await db.select({ id: setups.id, createdAt: setups.createdAt }).from(setups).where(eq(setups.householdId, householdId));
  const setupId = (await currentSetupOf(householdId, setupList)) ?? recipe.setupId;
  const start = valuesOf(recipe, "recipe");
  // The coffee's open bag, else any unfinished one, so the log doesn't pick another coffee.
  const bags = (await unfinishedPortions(householdId, new Date())).filter((p) => p.bean.id === recipe.beanId);
  const portion = portionId ? bags.find((p) => p.id === portionId) : (bags.find((p) => p.openedAt !== null) ?? bags[0]);
  // Temperature and pressure belong to the recipe's machine; on another setup they start blank.
  if (setupId !== recipe.setupId) start.brew = { brewTempC: null, brewTempStep: null, pressureBar: null, pressureStep: null };
  return {
    setupId,
    drinkTypeId: recipe.drinkTypeId,
    portionId: portion?.id ?? null,
    locked: false,
    start,
    applied: start,
    milkTypeId: recipe.milkTypeId,
    sweetened: recipe.sweetened,
    suggestion: null,
    from: null,
    fromShot: null,
    grindAdjustment: null,
    redialEventId: eventId,
  };
}

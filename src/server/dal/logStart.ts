import "server-only";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalBeans, extractions, personas, setups } from "@/db/schema";
import { portionState } from "@/domain/portionState";
import { applyChange, type StartValues } from "@/domain/suggest/apply";
import { suggest, type Suggestion } from "@/domain/suggest";
import { mergeGroup, resolveEntity } from "./catalogMerge";
import { getDialInStart } from "./dialIn";
import { unfinishedPortions } from "./logContext";
import { portionChoices, type PortionChoice } from "./pull";
import { getCurrentRecipe } from "./recipes";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";
import { currentSetupOf } from "./setups";
import { getSuggestContext, type SuggestContext } from "./suggestContext";

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

async function defaultPersona(householdId: string) {
  const [p] = await db.select({ id: personas.id }).from(personas).where(and(eq(personas.householdId, householdId), eq(personas.isDefault, true)));
  if (!p) throw new NotFoundError();
  return p.id;
}

/**
 * The suggestion from the latest shot on this coffee, setup and drink, when
 * it has a change (STORY-02-03-07 AC 3). Whether it was dismissed is known
 * only on the device, by the shot's ID.
 */
export async function getPendingSuggestion(key: { beanId: string; setupId: string; drinkTypeId: string }): Promise<{ shotId: string } | null> {
  const { householdId } = await requireHousehold();
  const personaId = await defaultPersona(householdId);
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
  /** The change made, with what's needed to word it; null when none. */
  suggestion: ShotSuggestion | null;
  /** Dial-in from another setup's recipe (STORY-02-01-06 AC 3, AC 4). */
  from: { setupId: string; grindCarried: boolean } | null;
  /** "Dial in from this": when the past shot was made, for the log's note (STORY-02-06-06 AC 1). */
  fromShot: { at: Date } | null;
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
  const recipe = await getCurrentRecipe({ beanId: r.beanId, personaId: s.personaId, setupId: s.setupId, drinkTypeId: s.drinkTypeId });
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
    milkTypeId: recipe ? recipe.milkTypeId : s.milkTypeId,
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
  const dialIn = await getDialInStart({ beanId, drinkTypeId: key.drinkTypeId, setupId });
  if (!dialIn) return null;
  const start: StartValues = { ...dialIn.values, brew: dialIn.brew, prep: dialIn.prep, milkMl: dialIn.milk.milkMl };
  const suggestion = await applying(key.suggested);
  return {
    setupId,
    drinkTypeId: key.drinkTypeId,
    portionId: key.portionId ?? null,
    locked: false,
    start,
    applied: applyChange(start, suggestion?.change ?? null),
    milkTypeId: dialIn.milk.milkTypeId,
    suggestion,
    from: dialIn.fromSetupId === setupId ? null : { setupId: dialIn.fromSetupId, grindCarried: dialIn.grindCarried },
    fromShot: null,
  };
}

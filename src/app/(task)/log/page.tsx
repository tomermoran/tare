import { connection } from "next/server";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { RecipeLogFlow } from "@/components/log/RecipeLogFlow";
import { ShotEditFlow } from "@/components/log/ShotEditFlow";
import { ShotLogFlow, type DrinkMilk, type LogApplied, type LogSetupChoice } from "@/components/log/ShotLogFlow";
import type { SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import { brewTabs, brewToDial, NO_BREW_VALUES } from "@/domain/brewControls";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { MILK_FALLBACK_ML, milkStart } from "@/domain/milk";
import { NO_PREP } from "@/domain/prep";
import { grindWheelConfig, middleGrind } from "@/domain/grind";
import { setupLabel } from "@/domain/setupName";
import { getLogContext, getStartingValues, NEUTRAL_START, type LogContext, type LogPortion } from "@/server/dal/logContext";
import { lastGrindOnPart } from "@/server/dal/dialIn";
import { getShot } from "@/server/dal/journal";
import { getRecipeForBag } from "@/server/dal/recipes";
import { getDialInFromRecipe, getDialInFromShot, getFixStart, type LogStart } from "@/server/dal/logStart";
import { suggestionWords } from "@/lib/suggestionWords";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { notFound, redirect } from "next/navigation";
import { portionStateLabel } from "@/lib/portionStateLabel";
import { getTimeZone } from "@/server/time";

/**
 * SCR-LOG, a new shot: /log?drinkId=…&portionId=…, a saved one in edit
 * mode: /log?mode=edit&shotId=…, or a recipe typed in for a bag:
 * /log?mode=recipe&batchId=…(&setupId=…&drinkId=…). Fix mode starts from
 * a one-tap shot's recipe: /log?mode=fix&shotId=…; dial-in mode from Brew's
 * recipe, /log?mode=dialIn&drinkId=…&beanId=…, or from a tasted shot,
 * /log?mode=dialIn&fromShot=…. `suggested` names the shot whose suggestion
 * starts applied.
 * `selected` is a portion just added from the log; `resume` restores the
 * values set before leaving for an add task.
 */
export default function LogPage({ searchParams }: PageProps<"/log">) {
  return (
    <Suspense fallback={null}>
      <Log searchParams={searchParams} />
    </Suspense>
  );
}

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

async function Log({ searchParams }: Pick<PageProps<"/log">, "searchParams">) {
  const params = await searchParams;
  const shotId = one(params.shotId);
  if (one(params.mode) === "edit" && shotId) return <EditShot shotId={shotId} />;
  const batchId = one(params.batchId);
  if (one(params.mode) === "recipe" && batchId) {
    return <RecipeLog batchId={batchId} setupId={one(params.setupId)} drinkId={one(params.drinkId)} />;
  }
  const selected = one(params.selected);
  const suggested = one(params.suggested);
  const notFoundIfMissing = (e: unknown) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  };
  let prefilled: { start: LogStart; mode: "fix" | "dialIn" } | null = null;
  if (one(params.mode) === "fix" && shotId) {
    const start = await unlessSignedOut(getFixStart(shotId, suggested)).catch(notFoundIfMissing);
    if (!start) return null;
    prefilled = { start, mode: "fix" };
  } else if (one(params.mode) === "dialIn") {
    const fromShot = one(params.fromShot);
    const drinkTypeId = one(params.drinkId);
    const beanId = one(params.beanId);
    const start = fromShot
      ? await unlessSignedOut(getDialInFromShot(fromShot, suggested)).catch(notFoundIfMissing)
      : drinkTypeId && beanId
        ? await unlessSignedOut(getDialInFromRecipe({ drinkTypeId, beanId, portionId: one(params.portionId), suggested }))
        : null;
    // No recipe anywhere: the dial-in starts blank (STORY-02-01-06 AC 6).
    if (start) prefilled = { start, mode: "dialIn" };
  }
  const [context, t, format, timeZone] = await Promise.all([
    unlessSignedOut(
      getLogContext({
        drinkId: prefilled?.start.drinkTypeId ?? one(params.drinkId),
        portionId: selected ?? prefilled?.start.portionId ?? one(params.portionId),
      }),
    ),
    getTranslations(),
    getFormatter(),
    getTimeZone(),
  ]);
  // The open clocks count to today, which depends on the request time.
  await connection();
  if (!context) return null;

  const list = (items: string[]) => format.list(items, { type: "conjunction" });
  const date = (d: Date) => format.dateTime(d, { day: "numeric", month: "short", timeZone });
  // The opened clock, less freezer days (STORY-03-03-04).
  const state = (p: LogPortion) => (p.opened.kind === "open" ? t("portion.openFor", { days: p.opened.days }) : portionStateLabel(t, p.state));

  const drinks: SelectOption[] = context.drinks.map((d) => ({
    id: d.id,
    primary: drinkLabel(d, (key: DrinkKey) => t(key)),
    marker: d.id === context.defaultDrinkId ? t("home.usual") : undefined,
  }));
  const portions: SelectOption[] = context.portions.map((p) => ({
    id: p.id,
    primary: p.bean.name,
    secondary: t("log.portionLine", {
      roaster: p.bean.roasterName,
      bag: p.roastDate ? t("log.bagRoasted", { date: date(p.roastDate) }) : t("log.bagAdded", { date: date(p.bagAddedAt) }),
      state: state(p),
    }),
    marker: p.frozen ? portionStateLabel(t, "frozen") : undefined,
  }));

  const setup = context.setups.find((s) => s.id === (prefilled?.start.setupId ?? context.defaultSetupId));
  const grind = grindWheelConfig(setup?.grind);
  const start = setup
    ? await getStartingValues(setup.id)
    : { grind: middleGrind(grind), ...NEUTRAL_START, lastBrew: NO_BREW_VALUES, prep: NO_PREP };
  const brew = brewTabs(setup?.machine);
  // A fix keeps the one-tap shot's setup, so there's nothing to switch to.
  const setupChoices = prefilled?.mode === "fix" ? [] : await logSetupChoices(context, list, t("setup.current"));

  const p = prefilled?.start;
  const applied: LogApplied | undefined = p && {
    values: { grind: p.applied.grind, dose: p.applied.dose, yield: p.applied.yield, timeMs: p.applied.timeMs },
    brew: brewToDial(brew, p.applied.brew),
    prep: p.applied.prep,
    milk: p.milkTypeId || p.start.milkMl !== null ? { milkTypeId: p.milkTypeId, ml: p.applied.milkMl ?? MILK_FALLBACK_ML, wasMl: p.start.milkMl ?? MILK_FALLBACK_ML } : null,
  };
  const note: string[] = [];
  if (p) {
    const words = p.suggestion && suggestionWords(p.suggestion, { milkDrink: p.suggestion.context.shot.milkDrink, clocks: p.suggestion.context.clocks }, t, format);
    if (words?.change) note.push(t("log.fromSuggestion", { change: words.change }));
    else if (p.from) {
      const fromSetup = context.setups.find((s) => s.id === p.from!.setupId);
      if (fromSetup) note.push(t("log.fromRecipeOn", { setup: setupLabel(fromSetup, context.setups, list) }));
    } else if (prefilled?.mode === "fix") note.push(t("log.fromRecipe"));
    if (p.from && !p.from.grindCarried) note.push(t("log.grindNotCarried"));
  }

  return (
    <ShotLogFlow
      key={`${selected ?? "none"}|${prefilled?.mode ?? "new"}|${suggested ?? ""}`}
      mode={prefilled?.mode ?? "new"}
      applied={applied}
      brewStart={p ? brewToDial(brew, p.start.brew) : undefined}
      locked={prefilled?.mode === "fix"}
      note={note}
      tasteFrom={prefilled?.mode}
      setupId={setup?.id ?? null}
      setup={setup ? setupLabel(setup, context.setups, list) : null}
      drinks={drinks}
      defaultDrinkId={context.defaultDrinkId}
      portions={portions}
      defaultPortionId={context.defaultPortionId}
      selectedPortionId={selected && context.portions.some((p) => p.id === selected) ? selected : null}
      start={p ? { grind: p.start.grind, dose: p.start.dose, yield: p.start.yield, timeMs: p.start.timeMs } : start}
      grind={grind}
      brew={brew}
      brewLast={brewToDial(brew, start.lastBrew)}
      prep={p ? p.start.prep : start.prep}
      unknownPart={setup?.unknownPart ?? null}
      setupChoices={setupChoices}
      selectedSetupId={selected && context.setups.some((s) => s.id === selected) ? selected : null}
      drinkMilk={Object.fromEntries(
        context.drinks.map((d): [string, DrinkMilk] => [
          d.id,
          { hasMilk: d.hasMilk, typicalMilkMl: d.typicalMilkMl, lastMilkTypeId: d.lastMilkTypeId },
        ]),
      )}
      milks={context.milks.map((m) => ({ id: m.id, primary: milkLabel(m, (key: MilkKey) => t(key)) }))}
      resume={one(params.resume) === "1"}
      portionClocks={Object.fromEntries(
        context.portions.flatMap((p): [string, string][] =>
          p.frozen ? [[p.id, t("bag.fromFrozen")]] : p.opened.kind === "open" ? [[p.id, t("portion.openFor", { days: p.opened.days })]] : [],
        ),
      )}
    />
  );
}

/** Edit mode (STORY-02-06-02): the saved shot, with its context read-only. */
async function EditShot({ shotId }: { shotId: string }) {
  const [shot, context, t, format] = await Promise.all([
    unlessSignedOut(getShot(shotId)).catch((e) => {
      if (e instanceof NotFoundError) notFound();
      throw e;
    }),
    unlessSignedOut(getLogContext()),
    getTranslations(),
    getFormatter(),
  ]);
  if (!shot || !context) return null;

  const list = (items: string[]) => format.list(items, { type: "conjunction" });
  const setup = context.setups.find((s) => s.id === shot.setup.id);
  const brew = brewTabs(setup?.machine);
  const milkMl = shot.milk?.ml ?? null;

  return (
    <ShotEditFlow
      shotId={shot.id}
      oneTap={shot.entryMode === "one-tap"}
      setup={setup ? setupLabel(setup, context.setups, list) : (shot.setup.name ?? "")}
      drink={drinkLabel(shot.drink, (key: DrinkKey) => t(key))}
      coffee={shot.coffee.name}
      start={shot.values}
      grind={grindWheelConfig(setup?.grind)}
      brew={brew}
      brewStart={brewToDial(brew, shot.brew)}
      sweetened={shot.sweetened}
      prep={shot.prep}
      milk={shot.milkDrink ? { milkTypeId: shot.milkTypeId, ml: milkMl ?? MILK_FALLBACK_ML } : null}
      milks={context.milks.map((m) => ({ id: m.id, primary: milkLabel(m, (key: MilkKey) => t(key)) }))}
      milkDrink={shot.milkDrink}
      taste={{ rating: shot.rating, ...shot.taste, tags: shot.tags }}
      backTo={`/journal/${shot.id}`}
    />
  );
}

/** Recipe mode (STORY-02-01-02): pin values typed in for this bag's coffee. */
async function RecipeLog({ batchId, setupId, drinkId }: { batchId: string; setupId?: string; drinkId?: string }) {
  const [context, t, format] = await Promise.all([unlessSignedOut(getLogContext({ drinkId })), getTranslations(), getFormatter()]);
  if (!context) return null;
  const setup = context.setups.find((s) => s.id === setupId) ?? context.setups.find((s) => s.id === context.defaultSetupId);
  const drink = context.drinks.find((d) => d.id === drinkId) ?? context.drinks.find((d) => d.id === context.defaultDrinkId);
  // A recipe needs a setup and a drink; without them the bag is the place to start.
  if (!setup || !drink) redirect(`/beans/${batchId}`);

  const { bean, recipe } = await getRecipeForBag({ batchId, setupId: setup.id, drinkTypeId: drink.id }).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  const list = (items: string[]) => format.list(items, { type: "conjunction" });
  const grind = grindWheelConfig(setup.grind);
  const brew = brewTabs(setup.machine);
  const last = recipe ? null : await getStartingValues(setup.id);
  const start = recipe ?? last!;
  const stored = recipe ?? last!.lastBrew;
  const drinkName = drinkLabel(drink, (key: DrinkKey) => t(key));
  const setupName = setupLabel(setup, context.setups, list);

  return (
    <RecipeLogFlow
      key={`${setup.id}|${drink.id}`}
      batchId={batchId}
      setupId={setup.id}
      drinkTypeId={drink.id}
      setup={setupName}
      drink={drinkName}
      coffee={bean.name}
      setups={context.setups.map((s) => ({ id: s.id, primary: setupLabel(s, context.setups, list) }))}
      drinks={context.drinks.map((d) => ({ id: d.id, primary: drinkLabel(d, (key: DrinkKey) => t(key)) }))}
      milks={context.milks.map((m) => ({ id: m.id, primary: milkLabel(m, (key: MilkKey) => t(key)) }))}
      start={{ grind: start.grind, dose: start.dose, yield: start.yield, timeMs: start.timeMs }}
      grind={grind}
      brew={brew}
      brewStart={brewToDial(brew, {
        brewTempC: stored.brewTempC,
        brewTempStep: stored.brewTempStep,
        pressureBar: stored.pressureBar,
        pressureStep: stored.pressureStep,
      })}
      prep={recipe ? { wdt: recipe.usedWdt, puckScreen: recipe.usedPuckScreen } : last!.prep}
      milk={milkStart({
        drink,
        recipe: recipe ? { milkTypeId: recipe.milkTypeId, ml: recipe.milkMl } : null,
        lastMilkOfDrink: drink.lastMilkTypeId,
        milks: context.milks,
      })}
      pinTitle={t("recipe.pinTitle", { drink: drinkName, coffee: bean.name, setup: setupName })}
      backTo={`/beans/${batchId}`}
    />
  );
}

/**
 * Each setup the log can switch to (STORY-02-02-07), current first: its
 * dials, where prep starts, and where grind starts when it doesn't carry
 * over (the grinder's last measured grind, else the middle, DQ-20).
 */
async function logSetupChoices(context: LogContext, list: (items: string[]) => string, currentLabel: string): Promise<LogSetupChoice[]> {
  if (context.setups.length < 2) return [];
  const ordered = [...context.setups].sort((a, b) => Number(b.id === context.defaultSetupId) - Number(a.id === context.defaultSetupId));
  return Promise.all(
    ordered.map(async (s) => {
      const grinder = s.parts.find((p) => p.kind === "grinder")?.id ?? null;
      const machine = s.parts.find((p) => p.kind === "machine")?.id ?? null;
      const wheel = grindWheelConfig(s.grind);
      const [start, last] = await Promise.all([getStartingValues(s.id), grinder ? lastGrindOnPart(grinder) : null]);
      const brew = brewTabs(s.machine);
      return {
        id: s.id,
        primary: setupLabel(s, context.setups, list),
        marker: s.id === context.defaultSetupId ? currentLabel : undefined,
        grind: wheel,
        brew,
        brewLast: brewToDial(brew, start.lastBrew),
        prep: start.prep,
        startGrind: last ?? middleGrind(wheel),
        parts: { grinderId: grinder, machineId: machine },
        unknownPart: s.unknownPart,
      };
    }),
  );
}

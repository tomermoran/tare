import { connection } from "next/server";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { RecipeLogFlow } from "@/components/log/RecipeLogFlow";
import { ShotEditFlow } from "@/components/log/ShotEditFlow";
import { ShotLogFlow, type DrinkMilk } from "@/components/log/ShotLogFlow";
import type { SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import { brewTabs, brewToDial, NO_BREW_VALUES } from "@/domain/brewControls";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { MILK_FALLBACK_ML, milkStart } from "@/domain/milk";
import { NO_PREP } from "@/domain/prep";
import { grindWheelConfig, middleGrind } from "@/domain/grind";
import { setupLabel } from "@/domain/setupName";
import { getLogContext, getStartingValues, NEUTRAL_START, type LogPortion } from "@/server/dal/logContext";
import { getShot } from "@/server/dal/journal";
import { getRecipeForBag } from "@/server/dal/recipes";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { notFound, redirect } from "next/navigation";
import { portionStateLabel } from "@/lib/portionStateLabel";
import { getTimeZone } from "@/server/time";

/**
 * SCR-LOG, a new shot: /log?drinkId=…&portionId=…, a saved one in edit
 * mode: /log?mode=edit&shotId=…, or a recipe typed in for a bag:
 * /log?mode=recipe&batchId=…(&setupId=…&drinkId=…)
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
  const [context, t, format, timeZone] = await Promise.all([
    unlessSignedOut(getLogContext({ drinkId: one(params.drinkId), portionId: selected ?? one(params.portionId) })),
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

  const setup = context.setups.find((s) => s.id === context.defaultSetupId);
  const grind = grindWheelConfig(setup?.grind);
  const start = setup
    ? await getStartingValues(setup.id)
    : { grind: middleGrind(grind), ...NEUTRAL_START, lastBrew: NO_BREW_VALUES, prep: NO_PREP };
  const brew = brewTabs(setup?.machine);

  return (
    <ShotLogFlow
      key={selected ?? "none"}
      setupId={setup?.id ?? null}
      setup={setup ? setupLabel(setup, context.setups, list) : null}
      drinks={drinks}
      defaultDrinkId={context.defaultDrinkId}
      portions={portions}
      defaultPortionId={context.defaultPortionId}
      selectedPortionId={selected && context.portions.some((p) => p.id === selected) ? selected : null}
      start={start}
      grind={grind}
      brew={brew}
      brewLast={brewToDial(brew, start.lastBrew)}
      prep={start.prep}
      unknownPart={setup?.unknownPart ?? null}
      drinkMilk={Object.fromEntries(
        context.drinks.map((d): [string, DrinkMilk] => [
          d.id,
          { hasMilk: d.hasMilk, typicalMilkMl: d.typicalMilkMl, lastMilkTypeId: d.lastMilkTypeId },
        ]),
      )}
      milks={context.milks.map((m) => ({ id: m.id, primary: milkLabel(m, (key: MilkKey) => t(key)) }))}
      resume={one(params.resume) === "1"}
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

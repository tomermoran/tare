import { connection } from "next/server";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ShotEditFlow } from "@/components/log/ShotEditFlow";
import { ShotLogFlow, type DrinkMilk } from "@/components/log/ShotLogFlow";
import type { SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import { brewTabs, brewToDial, NO_BREW_VALUES } from "@/domain/brewControls";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { MILK_FALLBACK_ML } from "@/domain/milk";
import { NO_PREP } from "@/domain/prep";
import { grindWheelConfig, middleGrind } from "@/domain/grind";
import { daysBetween, localDayKey } from "@/domain/localDay";
import { setupLabel } from "@/domain/setupName";
import { getLogContext, getStartingValues, NEUTRAL_START, type LogPortion } from "@/server/dal/logContext";
import { getShot } from "@/server/dal/journal";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { notFound } from "next/navigation";
import { getTimeZone } from "@/server/time";

/**
 * SCR-LOG, a new shot: /log?drinkId=…&portionId=…, or a saved one in edit
 * mode: /log?mode=edit&shotId=…
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

  const today = localDayKey(new Date(), timeZone);
  const list = (items: string[]) => format.list(items, { type: "conjunction" });
  const date = (d: Date) => format.dateTime(d, { day: "numeric", month: "short", timeZone });
  const state = (p: LogPortion) =>
    p.openedAt
      ? t("portion.openFor", { days: daysBetween(localDayKey(p.openedAt, timeZone), today) })
      : t(`portion.state.${p.state}`);

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
    marker: p.frozen ? t("portion.state.frozen") : undefined,
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

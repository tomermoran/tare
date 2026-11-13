import { connection } from "next/server";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ShotLogFlow } from "@/components/log/ShotLogFlow";
import type { SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { grindWheelConfig, middleGrind } from "@/domain/grind";
import { daysBetween, localDayKey } from "@/domain/localDay";
import { setupLabel } from "@/domain/setupName";
import { getLogContext, getStartingValues, NEUTRAL_START, type LogPortion } from "@/server/dal/logContext";
import { unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";

/**
 * SCR-LOG, a new shot: /log?drinkId=…&portionId=…
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
  const start = setup ? await getStartingValues(setup.id) : { grind: middleGrind(grind), ...NEUTRAL_START };

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
      resume={one(params.resume) === "1"}
    />
  );
}

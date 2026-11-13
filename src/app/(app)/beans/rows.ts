import { getFormatter, getTranslations } from "next-intl/server";
import type { PortionRow } from "@/components/screens/BeansScreen/PortionRows";
import type { PortionInfo } from "@/components/beans/usePortionActions";
import { allowedActions } from "@/domain/portionActions";
import { totalRemaining } from "@/domain/remaining";
import { portionStateLabel } from "@/lib/portionStateLabel";
import type { BagView, PortionView } from "@/server/dal/bags";

/** The words and numbers for bag and portion rows, shared by Beans and the bag screen. */
export async function bagRows(timeZone: string) {
  const [t, format] = await Promise.all([getTranslations(), getFormatter()]);
  const grams = (g: number) => format.number(g, { style: "unit", unit: "gram", unitDisplay: "narrow", maximumFractionDigits: 1 });

  const row = (p: PortionView): PortionRow => ({
    id: p.id,
    state: portionStateLabel(t, p.state),
    remaining: t("portion.remaining", { grams: grams(p.remaining.grams) }),
    meter: {
      label: t("portion.meterLabel"),
      value: p.remaining.grams,
      max: p.weight,
      text: t("portion.meter", { remaining: grams(p.remaining.grams), total: grams(p.weight) }),
    },
    // Only where weighing is allowed: open or thawed (STORY-03-04-02 AC 1).
    overLogged: p.remaining.overLogged && allowedActions(p.state).includes("weigh") ? { message: t("portion.overLogged"), action: t("portion.weigh") } : undefined,
  });

  const info = (p: PortionView): PortionInfo => ({
    id: p.id,
    state: p.state,
    remaining: p.remaining.grams,
    weight: p.weight,
    frozenOn: p.frozenAt ? format.dateTime(p.frozenAt, { dateStyle: "medium", timeZone }) : null,
  });

  const status = (b: BagView) =>
    b.status === "open" ? t("bag.statusOpen") : b.status === "finished" ? t("bag.statusFinished") : undefined;

  const total = (portions: PortionView[]) => t("bag.total", { grams: grams(totalRemaining(portions.map((p) => p.remaining)).grams) });

  return { grams, row, info, status, total };
}

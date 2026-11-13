import { getFormatter, getTranslations } from "next-intl/server";
import { BeansFlow } from "@/components/beans/BeansFlow";
import type { BagCard, BagGroup } from "@/components/screens/BeansScreen/BeansScreen";
import type { PantryGroup } from "@/domain/onHandGroups";
import { portionStateLabel } from "@/lib/portionStateLabel";
import { getTimeZone } from "@/server/time";
import { getOnHand, type BagView } from "@/server/dal/bags";
import { unlessSignedOut } from "@/server/dal/scope";
import { ADD_BAG, beansLabels } from "./labels";

/** SCR-PANTRY, the Beans tab: what's on hand, then what's been tried. */
export default async function BeansPage() {
  const [t, format, onHand, timeZone] = await Promise.all([getTranslations(), getFormatter(), unlessSignedOut(getOnHand()), getTimeZone()]);
  const grams = (g: number) => format.number(g, { style: "unit", unit: "gram", unitDisplay: "narrow", maximumFractionDigits: 1 });

  const card = (b: BagView): BagCard => ({
    id: b.id,
    href: `/beans/${b.id}`,
    bean: b.bean.name,
    roaster: b.bean.roasterName,
    portions: b.portions.map((p) => ({ id: p.id, state: portionStateLabel(t, p.state), remaining: grams(p.remaining.grams) })),
  });
  const groupTitle: Record<PantryGroup, string> = {
    open: t("beans.groupOpen"),
    unopened: t("beans.groupUnopened"),
    frozen: t("beans.groupFrozen"),
  };
  const groups: BagGroup[] = (onHand ?? []).map((g) => ({ key: g.group, title: groupTitle[g.group], bags: g.bags.map(card) }));
  const info = (onHand ?? []).flatMap((g) => g.bags).flatMap((b) =>
    b.portions.map((p) => ({
      id: p.id,
      state: p.state,
      remaining: p.remaining.grams,
      frozenOn: p.frozenAt ? format.dateTime(p.frozenAt, { dateStyle: "medium", timeZone }) : null,
    })),
  );

  // Tried (EPIC-03-06) arrives with the journal; until then nothing counts as brewed.
  return <BeansFlow labels={await beansLabels()} state={onHand ? "ready" : "loading"} groups={groups} addBagHref={ADD_BAG} info={info} />;
}

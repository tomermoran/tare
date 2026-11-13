import { getTranslations } from "next-intl/server";
import { BeansFlow } from "@/components/beans/BeansFlow";
import type { BagCard, BagGroup } from "@/components/screens/BeansScreen/BeansScreen";
import type { PantryGroup } from "@/domain/onHandGroups";
import { getTimeZone } from "@/server/time";
import { getOnHand, type BagView } from "@/server/dal/bags";
import { unlessSignedOut } from "@/server/dal/scope";
import { ADD_BAG, beansLabels } from "./labels";
import { bagRows } from "./rows";

/** SCR-PANTRY, the Beans tab: what's on hand, then what's been tried. */
export default async function BeansPage() {
  const [t, onHand, timeZone] = await Promise.all([getTranslations(), unlessSignedOut(getOnHand()), getTimeZone()]);
  const rows = await bagRows(timeZone);
  const card = (b: BagView): BagCard => ({
    id: b.id,
    href: `/beans/${b.id}`,
    bean: b.bean.name,
    roaster: b.bean.roasterName,
    clock: rows.clock(b),
    status: rows.status(b),
    total: b.portions.length > 1 ? rows.total(b.portions) : undefined,
    portions: b.portions.map(rows.row),
  });
  const groupTitle: Record<PantryGroup, string> = {
    open: t("beans.groupOpen"),
    unopened: t("beans.groupUnopened"),
    frozen: t("beans.groupFrozen"),
  };
  const groups: BagGroup[] = (onHand ?? []).map((g) => ({ key: g.group, title: groupTitle[g.group], bags: g.bags.map(card) }));
  const info = (onHand ?? []).flatMap((g) => g.bags).flatMap((b) => b.portions.map(rows.info));

  // Tried (EPIC-03-06) arrives with the journal; until then nothing counts as brewed.
  return <BeansFlow labels={await beansLabels()} state={onHand ? "ready" : "loading"} groups={groups} addBagHref={ADD_BAG} info={info} />;
}

import { getLocale, getTranslations } from "next-intl/server";
import { BeansFlow } from "@/components/beans/BeansFlow";
import type { BagCard, BagGroup } from "@/components/screens/BeansScreen/BeansScreen";
import { TriedRows, type TriedRow } from "@/components/screens/BeansScreen/TriedRows";
import { daysBetween, localDayKey } from "@/domain/localDay";
import { coffeeHref } from "@/lib/coffeeRoutes";
import { lastHadLabel } from "@/lib/lastHad";
import type { PantryGroup } from "@/domain/onHandGroups";
import { getTimeZone } from "@/server/time";
import { getOnHand, type BagView } from "@/server/dal/bags";
import { unlessSignedOut } from "@/server/dal/scope";
import { getTried } from "@/server/dal/tried";
import { ADD_BAG, beansLabels } from "./labels";
import { bagRows } from "./rows";

/** SCR-PANTRY, the Beans tab: what's on hand, then what's been tried. */
export default async function BeansPage() {
  const [t, locale, onHand, tried, timeZone] = await Promise.all([
    getTranslations(),
    getLocale(),
    unlessSignedOut(getOnHand()),
    unlessSignedOut(getTried()),
    getTimeZone(),
  ]);
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

  // Tried (EPIC-03-06): every coffee brewed, with how its shots went in words.
  const today = localDayKey(new Date(), timeZone);
  const triedRows: TriedRow[] = (tried ?? []).map((c) => ({
    id: c.beanId,
    href: coffeeHref(c.beanId),
    bean: c.name,
    roaster: c.roasterName,
    lastHad: lastHadLabel(daysBetween(localDayKey(c.lastHad, timeZone), today), locale),
    bagCount: t("beans.bagCount", { count: c.bagCount }),
    summary: c.summary.kind === "lastRated" ? t("beans.summary.lastRated", { rating: c.summary.rating }) : t(`beans.summary.${c.summary.kind}`),
  }));
  return (
    <BeansFlow
      labels={await beansLabels()}
      state={onHand ? "ready" : "loading"}
      groups={groups}
      addBagHref={ADD_BAG}
      info={info}
      tried={triedRows.length ? <TriedRows rows={triedRows} /> : undefined}
    />
  );
}

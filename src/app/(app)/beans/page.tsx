import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { RunOutLineSkeleton } from "@/components/beans/RunOutLine";
import { BeansFilterRowLive } from "@/components/beans/BeansFilterRowLive";
import type { BeansFilterChip } from "@/components/beans/BeansFilterRow";
import { BeansFlow } from "@/components/beans/BeansFlow";
import type { BagCard, BagGroup } from "@/components/screens/BeansScreen/BeansScreen";
import { TriedRows, type TriedRow } from "@/components/screens/BeansScreen/TriedRows";
import { anyFilterOn, applyFilters, filterOptions, offersFilters, ORIGIN_NONE, type BeanFacet, type BeansFilters, type FilterKind } from "@/domain/beansFilter";
import { daysBetween, localDayKey } from "@/domain/localDay";
import { labelOrigin, type Origin } from "@/domain/origin";
import { BEANS_PATH, readBeansFilters } from "@/lib/beansFilters";
import { coffeeHref } from "@/lib/coffeeRoutes";
import { lastHadLabel } from "@/lib/lastHad";
import type { PantryGroup } from "@/domain/onHandGroups";
import { getTimeZone } from "@/server/time";
import { getBeanFacets } from "@/server/dal/beanFacets";
import { getOnHand, type BagView } from "@/server/dal/bags";
import { unlessSignedOut } from "@/server/dal/scope";
import { getTried } from "@/server/dal/tried";
import { actingOther } from "@/server/dal/persona";
import { personaLabel } from "@/domain/personaLabel";
import { ADD_BAG, beansLabels } from "./labels";
import { bagRows } from "./rows";
import { RunOut } from "./RunOut";

/** SCR-PANTRY, the Beans tab: what's on hand, then what's been tried, narrowed by its filters (EPIC-03-07). */
export default async function BeansPage({ searchParams }: PageProps<"/beans">) {
  const [t, locale, onHand, tried, timeZone, params, other] = await Promise.all([
    getTranslations(),
    getLocale(),
    unlessSignedOut(getOnHand()),
    unlessSignedOut(getTried()),
    getTimeZone(),
    searchParams,
    // Tried and its rating filter follow the person chosen on Brew (STORY-05-01-07).
    unlessSignedOut(actingOther()),
  ]);
  const facets = onHand && tried ? await getBeanFacets({ onHand: onHand.flatMap((g) => g.bags.map((b) => b.bean.id)), tried }) : [];
  // Filters only apply while the row is offered, so a stale link can't hide everything.
  const filters: BeansFilters = offersFilters(facets) ? readBeansFilters(params) : {};
  const filtering = anyFilterOn(filters);
  const shown = applyFilters(facets, filters);
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
  const groups: BagGroup[] = (onHand ?? [])
    .map((g) => ({ key: g.group, title: groupTitle[g.group], bags: g.bags.filter((b) => shown.has(b.bean.id)).map(card) }))
    .filter((g) => g.bags.length > 0);
  const info = (onHand ?? []).flatMap((g) => g.bags).flatMap((b) => b.portions.map(rows.info));

  // Tried (EPIC-03-06): every coffee brewed, with how its shots went in words.
  const today = localDayKey(new Date(), timeZone);
  const triedRows: TriedRow[] = (tried ?? []).filter((c) => shown.has(c.beanId)).map((c) => ({
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
      runOut={
        // The figure is for all coffee, so it would mislead under a filter (STORY-03-07-02 AC 5).
        filtering ? undefined : (
          <Suspense fallback={<RunOutLineSkeleton label={t("states.loading")} />}>
            <RunOut />
          </Suspense>
        )
      }
      filters={offersFilters(facets) ? <BeansFilterRowLive chips={filterChips(facets, t, locale)} filters={filters} /> : undefined}
      filtering={
        filtering
          ? {
              onHandNone: t("beans.filteredOnHandNone"),
              triedNone: t("beans.filteredTriedNone"),
              none: { title: t("beans.filteredNoneTitle"), body: t("beans.filteredNone"), clear: { label: t("beans.filterClear"), href: BEANS_PATH } },
            }
          : undefined
      }
      tried={triedRows.length ? <TriedRows rows={triedRows} /> : undefined}
      triedFor={other ? t("beans.triedFor", { name: personaLabel(other, t("profile.defaultName")) }) : undefined}
    />
  );
}

type T = Awaited<ReturnType<typeof getTranslations<never>>>;

/** Each filter worded, with only the values present and a count; a filter with none is left out. */
function filterChips(facets: BeanFacet[], t: T, locale: string): BeansFilterChip[] {
  const originName = (o: Origin) => labelOrigin(o, locale, { blend: t("catalog.origin.blend") });
  const options = filterOptions(facets, { collator: new Intl.Collator(locale), originName });
  const roasterName = new Map(facets.map((f) => [f.roasterId, f.roasterName]));
  const label: Record<FilterKind, (value: string) => string> = {
    roaster: (v) => roasterName.get(v) ?? v,
    roast: (v) => t(`catalog.roast.${v}` as "catalog.roast.Medium"),
    origin: (v) => (v === ORIGIN_NONE ? t("beans.originUnknown") : originName(v as Origin)),
    rating: (v) => t(`beans.summary.${v}` as "beans.summary.mixed"),
  };
  const words: Record<FilterKind, { title: string; any: string }> = {
    roaster: { title: t("beans.filterRoaster"), any: t("beans.filterAnyRoaster") },
    roast: { title: t("beans.filterRoast"), any: t("beans.filterAnyRoast") },
    origin: { title: t("beans.filterOrigin"), any: t("beans.filterAnyOrigin") },
    rating: { title: t("beans.filterRating"), any: t("beans.filterAnyRating") },
  };
  return (["roaster", "roast", "origin", "rating"] as const)
    .filter((kind) => options[kind].length > 0)
    .map((kind) => ({
      kind,
      ...words[kind],
      options: options[kind].map((o) => ({ id: o.value, primary: label[kind](o.value), secondary: t("beans.filterCount", { count: o.count }) })),
    }));
}

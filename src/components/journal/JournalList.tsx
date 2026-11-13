"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { JournalSkeletonRows, RecentShotsScreen, type RecentItem } from "@/components/screens/RecentShotsScreen/RecentShotsScreen";
import { Button } from "@/components/ui/Button/Button";
import { FilterChips, type FilterChip } from "@/components/ui/ChipGroup/FilterChips";
import { SelectSheet, type SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import { Notice } from "@/components/ui/Notice/Notice";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { daysBetween, localNoon } from "@/domain/localDay";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { setupLabel } from "@/domain/setupName";
import { shotWarnings } from "@/domain/shotWarnings";
import { journalHref } from "@/lib/journalFilters";
import { LOG_PATH } from "@/lib/logRoutes";
import { loadOlderShotsAction } from "@/server/actions/journal";
import type { JournalCursor, JournalFilterOptions, JournalFilters, JournalShot } from "@/server/dal/journal";

/*
 * The Journal tab, wired (STORY-02-06-01): the last 30 days from the
 * server, then "show older shots" a page at a time. Rows open the shot,
 * and show the reaction mark and the channelling warning in words. The
 * filters are in the URL, so back from a shot keeps them (STORY-02-06-04,
 * STORY-02-06-05 AC 3); setup is offered only with more than one setup.
 */

type Kind = "drinkId" | "beanId" | "setupId";

export function JournalList({
  shots: initial,
  older: initialOlder,
  today,
  timeZone,
  filters = {},
  options,
}: {
  shots: JournalShot[];
  older: JournalCursor | null;
  /** Today's day key in the device's zone. */
  today: string;
  timeZone: string;
  filters?: JournalFilters;
  options?: JournalFilterOptions;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [shots, setShots] = useState(initial);
  const [older, setOlder] = useState(initialOlder);
  const [state, setState] = useState<"idle" | "loading" | "failed">("idle");
  const [picking, setPicking] = useState<Kind | null>(null);
  const list = (items: string[]) => format.list(items, { type: "conjunction" });

  // Each filter's choices, worded (AC 1).
  const choices: Record<Kind, SelectOption[]> = {
    drinkId: (options?.drinks ?? []).map((d) => ({ id: d.id, primary: drinkLabel(d, (key: DrinkKey) => t(key)) })),
    beanId: (options?.coffees ?? []).map((c) => ({ id: c.id, primary: c.name, secondary: c.roasterName })),
    setupId: (options?.setups ?? []).map((s) => ({ id: s.id, primary: setupLabel(s, options!.setups, list) })),
  };
  const kinds: { kind: Kind; filter: string; any: string }[] = [
    { kind: "drinkId", filter: t("journal.filterDrink"), any: t("journal.filterAnyDrink") },
    { kind: "beanId", filter: t("journal.filterCoffee"), any: t("journal.filterAnyCoffee") },
    ...((options?.setups.length ?? 0) > 1 ? [{ kind: "setupId" as const, filter: t("journal.filterSetup"), any: t("journal.filterAnySetup") }] : []),
  ];
  const valueOf = (kind: Kind) => choices[kind].find((o) => o.id === filters[kind])?.primary ?? null;
  const chips: FilterChip[] = kinds.map(({ kind, filter, any }) => {
    const value = valueOf(kind);
    return value
      ? { id: kind, text: value, name: t("journal.filterName", { filter, value }), remove: t("journal.removeFilter", { filter, value }) }
      : { id: kind, text: any, name: t("journal.filterName", { filter, value: any }) };
  });
  const active = kinds.map(({ kind }) => valueOf(kind)).filter((v): v is string => v !== null);
  // Each change is a new history entry, so back undoes it.
  const go = (next: JournalFilters) => router.push(journalHref(next));
  const without = (kind: Kind) => {
    const next = { ...filters };
    delete next[kind];
    return next;
  };

  const dayLabel = (day: string) => {
    const ago = daysBetween(day, today);
    if (ago === 0) return t("journal.today");
    if (ago === 1) return t("journal.yesterday");
    return format.dateTime(localNoon(day, timeZone), { day: "numeric", month: "long", timeZone });
  };

  const items: RecentItem[] = shots.map((s) => ({
    kind: "shot",
    id: s.id,
    at: s.at,
    day: s.day,
    drink: drinkLabel(s.drink, (key: DrinkKey) => t(key)),
    coffee: s.coffee.name,
    milk: s.milk
      ? s.milk.ml !== null
        ? t("shot.milkLine", {
            milk: milkLabel(s.milk, (key: MilkKey) => t(key)),
            amount: format.number(s.milk.ml, { style: "unit", unit: "milliliter", unitDisplay: "short" }),
          })
        : milkLabel(s.milk, (key: MilkKey) => t(key))
      : undefined,
    values: s.values,
    oneTap: s.entryMode === "one-tap",
    reaction: s.reaction ?? undefined,
    fromFrozen: s.fromFrozen,
    channelling: shotWarnings(s.tags).includes("channelling"),
  }));

  const showOlder = async () => {
    if (!older) return;
    setState("loading");
    const result = await loadOlderShotsAction(older, filters);
    if (!result.ok) return setState("failed");
    setShots((list) => [...list, ...result.data.shots]);
    setOlder(result.data.older);
    setState("idle");
  };

  const footer =
    state === "failed" ? (
      <Notice urgent title={t("states.loadFailedTitle")} action={{ label: t("actions.retry"), onClick: showOlder }}>
        {t("states.loadFailed")}
      </Notice>
    ) : older ? (
      <>
        {state === "loading" && <JournalSkeletonRows label={t("journal.loading")} />}
        <Button
          variant="ghost"
          fullWidth
          disabled={state === "loading"}
          aria-busy={state === "loading" || undefined}
          onClick={showOlder}
        >
          {t("journal.showOlder")}
        </Button>
      </>
    ) : undefined;

  return (
    <>
      <RecentShotsScreen
        items={items}
        now={new Date(0)}
        dayLabel={dayLabel}
        timeZone={timeZone}
        emptyAction={{ label: t("home.dialIn"), href: LOG_PATH }}
        filters={
          options && (
            <FilterChips
              label={t("journal.filters")}
              chips={chips}
              all={t("journal.filterAll")}
              onOpen={(id) => setPicking(id as Kind)}
              onRemove={(id) => go(without(id as Kind))}
              onClearAll={() => go({})}
            />
          )
        }
        emptyFiltered={
          active.length
            ? {
                title: t("journal.emptyFilteredTitle"),
                body: t("journal.emptyFiltered", { filters: list(active) }),
                action: { label: t("journal.clearFilters"), onClick: () => go({}) },
              }
            : undefined
        }
        footer={footer}
        onOpen={(id) => router.push(`/journal/${id}`)}
      />
      <SelectSheet
        open={picking !== null}
        onClose={() => setPicking(null)}
        title={kinds.find((k) => k.kind === picking)?.filter ?? ""}
        closeLabel={t("actions.close")}
        options={picking ? choices[picking] : []}
        value={picking ? (filters[picking] ?? null) : null}
        onChoose={(id) => {
          if (!picking) return;
          setPicking(null);
          go({ ...filters, [picking]: id });
        }}
      />
    </>
  );
}

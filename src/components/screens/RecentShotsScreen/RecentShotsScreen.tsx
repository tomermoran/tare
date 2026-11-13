"use client";

import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ShotWarnings } from "@/components/shot/ShotWarnings";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton/Skeleton";

export type RecentItem =
  | {
      kind: "shot";
      id: string;
      drink: string;
      at: Date;
      /** The calendar day in the device's zone ("YYYY-MM-DD"), when the server knows it. */
      day?: string;
      coffee: string;
      /** The milk line for a milk drink, already formatted ("Oat, 180 ml"). */
      milk?: string;
      values: ShotValuesData;
      oneTap?: boolean;
      reaction?: "good" | "off";
      fromFrozen?: boolean;
      channelling?: boolean;
    }
  | { kind: "maintenance"; id: string; unit: string; work: "burrs" | "clean" | "rezero"; at: Date; day?: string };

type RecentShotsScreenProps = {
  items: RecentItem[];
  /** "Now", for grouping by day when items carry no day key. */
  now: Date;
  /** Labels a day key ("Today", "Yesterday", "12 October"); used with `day`. */
  dayLabel?: (day: string) => string;
  /** Times are shown in this zone (the device's). */
  timeZone?: string;
  state?: "loading" | "ready";
  /** The empty state's action: dial in a first shot. */
  emptyAction?: { label: string; href: string };
  /** The filter row under the title (STORY-02-06-04). */
  filters?: ReactNode;
  /** With filters set and nothing matching: what to say and how to clear (AC 4). */
  emptyFiltered?: { title: string; body: string; action: { label: string; onClick: () => void } };
  /** Under the list: "show older", its skeleton, or a failure. */
  footer?: ReactNode;
  onOpen?: (id: string) => void;
};

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function SkeletonRows({ label, count }: { label: string; count: number }) {
  return (
    <Skeleton label={label}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex justify-between gap-4 border-b border-line py-3.5">
          <div className="flex flex-1 flex-col gap-2">
            <SkeletonBlock shape="line" className="w-2/5" />
            <SkeletonBlock shape="line" className="w-3/5" />
          </div>
          <SkeletonBlock shape="line" className="w-1/4" />
        </div>
      ))}
    </Skeleton>
  );
}

/**
 * The Journal (SCR-SHOTS): shots grouped by day, newest first. One-tap and
 * measured shots are told apart by a text marker; maintenance on a grinder
 * shows as a divider.
 */
export function RecentShotsScreen({
  items,
  now,
  dayLabel,
  timeZone,
  state = "ready",
  emptyAction,
  filters,
  emptyFiltered,
  footer,
  onOpen,
}: RecentShotsScreenProps) {
  const t = useTranslations("journal");
  const tShot = useTranslations("shot");
  const tMaint = useTranslations("maintenance");
  const tBag = useTranslations("bag");
  const format = useFormatter();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const localLabel = (d: Date) =>
    dayKey(d) === dayKey(now)
      ? t("today")
      : dayKey(d) === dayKey(yesterday)
        ? t("yesterday")
        : format.dateTime(d, { day: "numeric", month: "long" });
  const labelOf = (item: RecentItem) => (item.day && dayLabel ? dayLabel(item.day) : localLabel(item.at));

  // Group consecutive items by day, keeping their order (newest first).
  const groups: { label: string; items: RecentItem[] }[] = [];
  for (const item of items) {
    const label = labelOf(item);
    const last = groups.at(-1);
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }

  const marker = (text: string) => <span className="text-overline uppercase text-ink-secondary">{text}</span>;

  return (
    <div className="flex flex-1 flex-col [&>*]:shrink-0">
      <PageHeader title={t("title")} />
      {filters && <div className="mt-4">{filters}</div>}
      {state === "loading" && (
        <div className="mt-6">
          <SkeletonRows label={t("loading")} count={5} />
        </div>
      )}
      {state === "ready" &&
        items.length === 0 &&
        !footer &&
        (emptyFiltered ? (
          <EmptyState title={emptyFiltered.title} action={emptyFiltered.action}>
            {emptyFiltered.body}
          </EmptyState>
        ) : (
          <EmptyState title={t("emptyTitle")} action={emptyAction}>
            {t("empty")}
          </EmptyState>
        ))}
      {groups.map((g) => (
        <section key={g.label} aria-label={g.label} className="mt-6">
          <h2 className="mb-1 text-overline uppercase text-ink-secondary">{g.label}</h2>
          <ul>
            {g.items.map((item) =>
              item.kind === "maintenance" ? (
                <li key={item.id} className="flex items-center gap-2.5 py-3 text-label text-ink-secondary">
                  <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                  {t("maintenanceDivider", {
                    unit: item.unit,
                    work: tMaint(item.work),
                    date: format.dateTime(item.at, { day: "numeric", month: "short", timeZone }),
                  })}
                  <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                </li>
              ) : (
                <li key={item.id}>
                  <ListRow
                    primary={t("rowTitle", {
                      drink: item.drink,
                      time: format.dateTime(item.at, { hour: "2-digit", minute: "2-digit", timeZone }),
                    })}
                    secondary={item.milk ? t("coffeeAndMilk", { coffee: item.coffee, milk: item.milk }) : item.coffee}
                    end={<ShotValues values={item.values} size="compact" />}
                    onClick={onOpen ? () => onOpen(item.id) : undefined}
                    footer={
                      item.oneTap || item.reaction || item.fromFrozen || item.channelling ? (
                        <>
                          {item.oneTap && marker(t("oneTap"))}
                          {item.reaction && marker(t(item.reaction))}
                          {item.fromFrozen && marker(tBag("fromFrozen"))}
                          <ShotWarnings
                            size="inline"
                            warnings={item.channelling ? ["channelling"] : []}
                            labels={{ channelling: tShot("warnings.channelling") }}
                          />
                        </>
                      ) : undefined
                    }
                  />
                </li>
              ),
            )}
          </ul>
        </section>
      ))}
      {footer && <div className="mt-4 flex flex-col gap-3">{footer}</div>}
    </div>
  );
}

/** Rows shown while older shots load. */
export function JournalSkeletonRows({ label }: { label: string }) {
  return <SkeletonRows label={label} count={3} />;
}

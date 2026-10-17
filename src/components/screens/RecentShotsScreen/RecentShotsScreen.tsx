"use client";

import { useFormatter, useTranslations } from "next-intl";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";

export type RecentItem =
  | {
      kind: "shot";
      id: string;
      drink: string;
      at: Date;
      coffee: string;
      values: ShotValuesData;
      oneTap?: boolean;
      reaction?: "good" | "off";
      channelling?: boolean;
    }
  | { kind: "maintenance"; id: string; unit: string; work: "burrs" | "clean" | "rezero"; at: Date };

type RecentShotsScreenProps = {
  items: RecentItem[];
  /** "Now", for grouping by day. */
  now: Date;
  onOpen?: (id: string) => void;
};

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/**
 * Recent shots (SCR-SHOTS): grouped by day, one-tap and measured shots told
 * apart by a text marker, maintenance on a grinder shown as a divider.
 */
export function RecentShotsScreen({ items, now, onOpen }: RecentShotsScreenProps) {
  const t = useTranslations("shots");
  const tShot = useTranslations("shot");
  const tMaint = useTranslations("maintenance");
  const format = useFormatter();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const dayLabel = (d: Date) =>
    dayKey(d) === dayKey(now)
      ? t("today")
      : dayKey(d) === dayKey(yesterday)
        ? t("yesterday")
        : format.dateTime(d, { day: "numeric", month: "long" });

  // Group consecutive items by day, keeping their order (newest first).
  const groups: { label: string; items: RecentItem[] }[] = [];
  for (const item of items) {
    const label = dayLabel(item.at);
    const last = groups.at(-1);
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title={t("title")} />
      {items.length === 0 && <p className="mt-6 text-body text-ink-secondary">{t("empty")}</p>}
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
                    date: format.dateTime(item.at, { day: "numeric", month: "short" }),
                  })}
                  <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                </li>
              ) : (
                <li key={item.id}>
                  <ListRow
                    primary={t("rowTitle", { drink: item.drink, time: format.dateTime(item.at, { hour: "2-digit", minute: "2-digit" }) })}
                    secondary={item.coffee}
                    end={<ShotValues values={item.values} size="compact" />}
                    onClick={onOpen ? () => onOpen(item.id) : undefined}
                    footer={
                      item.oneTap || item.reaction || item.channelling ? (
                        <>
                          {item.oneTap && <span className="text-overline uppercase text-ink-secondary">{t("oneTap")}</span>}
                          {item.reaction && (
                            <span className="text-overline uppercase text-ink-secondary">{t(item.reaction)}</span>
                          )}
                          {item.channelling && (
                            <span className="text-label text-signal">{tShot("warnings.channelling")}</span>
                          )}
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
    </div>
  );
}

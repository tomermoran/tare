"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { JournalSkeletonRows, RecentShotsScreen, type RecentItem } from "@/components/screens/RecentShotsScreen/RecentShotsScreen";
import { Button } from "@/components/ui/Button/Button";
import { Notice } from "@/components/ui/Notice/Notice";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { daysBetween, localNoon } from "@/domain/localDay";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { shotWarnings } from "@/domain/shotWarnings";
import { LOG_PATH } from "@/lib/logRoutes";
import { loadOlderShotsAction } from "@/server/actions/journal";
import type { JournalCursor, JournalShot } from "@/server/dal/journal";

/*
 * The Journal tab, wired (STORY-02-06-01): the last 30 days from the
 * server, then "show older shots" a page at a time. Rows open the shot,
 * and show the reaction mark and the channelling warning in words.
 */

export function JournalList({
  shots: initial,
  older: initialOlder,
  today,
  timeZone,
}: {
  shots: JournalShot[];
  older: JournalCursor | null;
  /** Today's day key in the device's zone. */
  today: string;
  timeZone: string;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [shots, setShots] = useState(initial);
  const [older, setOlder] = useState(initialOlder);
  const [state, setState] = useState<"idle" | "loading" | "failed">("idle");

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
    const result = await loadOlderShotsAction(older);
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
    <RecentShotsScreen
      items={items}
      now={new Date(0)}
      dayLabel={dayLabel}
      timeZone={timeZone}
      emptyAction={{ label: t("home.dialIn"), href: LOG_PATH }}
      footer={footer}
      onOpen={(id) => router.push(`/journal/${id}`)}
    />
  );
}

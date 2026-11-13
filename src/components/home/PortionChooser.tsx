"use client";

import { useFormatter, useTranslations } from "next-intl";
import { portionStateLabel } from "@/lib/portionStateLabel";
import type { PortionChoice } from "@/server/dal/pull";
import { PortionSheet, type PortionOption } from "./PortionSheet";

/**
 * SH-PORTION, worded (STORY-02-02-03): which bag of a coffee to use when
 * none is open, counter first and frozen last; with none, "no coffee left"
 * and add a bag. Brew's pull and dial-in, and "dial in from this".
 */
export function PortionChooser({
  portions,
  onClose,
  onChoose,
  addBagHref,
}: {
  /** Null keeps the sheet closed. */
  portions: PortionChoice[] | null;
  onClose: () => void;
  onChoose: (portionId: string) => void;
  addBagHref: string;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const date = (d: Date) => format.dateTime(d, { day: "numeric", month: "short" });
  const options: PortionOption[] = (portions ?? []).map((p) => ({
    id: p.id,
    primary: p.roastDate ? t("portion.bagRoasted", { date: date(p.roastDate) }) : t("portion.bagAdded", { date: date(p.bagAddedAt) }),
    secondary: portionStateLabel(t, p.state),
    end: p.remaining ? t("portion.remaining", { grams: format.number(p.remaining.grams, { style: "unit", unit: "gram", unitDisplay: "short", maximumFractionDigits: 0 }) }) : undefined,
    frozen: p.frozen,
  }));
  return (
    <PortionSheet
      open={portions !== null}
      onClose={onClose}
      portions={options}
      onChoose={onChoose}
      addBagHref={addBagHref}
      labels={{
        title: t("portion.chooseTitle"),
        body: t("portion.chooseBody"),
        close: t("actions.close"),
        grindFromFrozen: t("portion.grindFromFrozen"),
        noneLeft: t("portion.noneLeft"),
        addBag: t("home.addBag"),
      }}
    />
  );
}

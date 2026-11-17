import type { createFormatter, useTranslations } from "next-intl";
import type { getTranslations } from "next-intl/server";
import type { RunOutContent } from "@/components/beans/RunOutSheet";
import { LOW_SHARE } from "@/domain/runOutConstants";
import type { RunOutView } from "@/server/dal/runOut";

/*
 * The run-out line and sheet in words (STORY-03-05-01 to 03): spans with
 * Intl's unit style, grams with the gram unit, the share as a percentage.
 * "About" and "around" sit in the messages so a language can place them.
 * Null when there's no line: nothing on hand, or no use for a month.
 */

type T = ReturnType<typeof useTranslations<never>> | Awaited<ReturnType<typeof getTranslations<never>>>;
type Format = ReturnType<typeof createFormatter>;

export function runOutContent(view: RunOutView | null, { t, format, timeZone }: { t: T; format: Format; timeZone: string }): RunOutContent | null {
  if (!view || view.kind === "nothing" || view.kind === "stale") return null;

  const grams = (g: number) => format.number(Math.round(g), { style: "unit", unit: "gram", unitDisplay: "narrow" });
  const onHand = {
    label: t("beans.onHandLabel"),
    value: view.onHand.frozenGrams > 0 ? t("beans.onHandFrozen", { grams: grams(view.onHand.grams), frozen: grams(view.onHand.frozenGrams) }) : grams(view.onHand.grams),
  };
  const coverage = {
    label: t("beans.coverage.label"),
    // Over-logged reads as all of it: the share says how far to trust the estimate, not more.
    value: view.logged ? t("beans.coverage.value", { share: format.number(Math.min(1, view.logged.share), { style: "percent" }) }) : t("beans.coverage.unavailable"),
  };
  const meaning = view.logged && view.logged.share < LOW_SHARE ? t("beans.coverage.meaning") : undefined;

  if (view.kind === "learning") {
    return {
      line: t("beans.learning"),
      learning: true,
      progress: t("beans.learningProgress", { count: format.number(view.finished), needed: format.number(view.needed) }),
      rows: [onHand, coverage],
      meaning,
    };
  }

  const span = view.span!;
  const spanText =
    span.kind === "long"
      ? format.number(span.months, { style: "unit", unit: "month", unitDisplay: "long" })
      : format.number(span.value, { style: "unit", unit: span.unit, unitDisplay: "long" });
  const line =
    span.kind === "long"
      ? t("beans.runOutLong", { span: spanText })
      : span.frozen > 0
        ? t("beans.runOutFrozen", { span: spanText, frozen: format.number(span.frozen) })
        : t("beans.runOut", { span: spanText });
  return {
    line,
    learning: false,
    span: span.kind === "long" ? t("beans.runOutLongSpan", { span: spanText }) : spanText,
    by: t("beans.runOutBy", { date: format.dateTime(span.until, { day: "numeric", month: "long", timeZone }) }),
    rows: [
      onHand,
      { label: t("beans.useRateLabel"), value: t("beans.useRate", { grams: grams(view.weeklyGrams) }) },
      { label: t("beans.basedOnLabel"), value: t("beans.basedOn", { count: view.finished, weeks: view.weeks }) },
      coverage,
    ],
    meaning,
  };
}

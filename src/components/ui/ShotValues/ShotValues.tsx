"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { cx } from "@/lib/cx";
import { formatValueParts, msToSeconds, type CanonicalUnit } from "@/lib/units";

export type ShotValuesData = {
  /** In the grinder's own units. */
  grind: number;
  /** Grams. */
  dose: number;
  /** Grams. */
  yield: number;
  /** Milliseconds, as stored. Shown in seconds with one decimal. */
  timeMs: number;
};

type ShotValuesProps = {
  values: ShotValuesData;
  /** large: 2 x 2 grid (home, shot detail). compact: two short lines (list rows). */
  size?: "large" | "compact";
  className?: string;
};

const grindDecimals = (grind: number) => (Number.isInteger(grind) ? 0 : 1);

/** Read-only grind, dose, yield and time (NC-08). */
export function ShotValues({ values, size = "large", className }: ShotValuesProps) {
  const t = useTranslations("shot");
  const locale = useLocale();
  const format = useFormatter();
  const seconds = msToSeconds(values.timeMs);
  const full = (value: number, decimals: number, unit: CanonicalUnit) =>
    format.number(value, {
      style: "unit",
      unit,
      unitDisplay: unit === "gram" ? "short" : "narrow",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  if (size === "compact") {
    return (
      <span className={cx("flex flex-col text-end", className)}>
        <span className="text-label text-ink">
          {t("compact", {
            dose: full(values.dose, 1, "gram"),
            yield: full(values.yield, 1, "gram"),
            time: full(seconds, 1, "second"),
          })}
        </span>
        <span className="text-label text-ink-secondary">
          {t("grindValue", {
            grind: format.number(values.grind, {
              minimumFractionDigits: grindDecimals(values.grind),
              maximumFractionDigits: 1,
            }),
          })}
        </span>
      </span>
    );
  }

  const cells: { label: string; value: number; decimals: number; unit?: CanonicalUnit }[] = [
    { label: t("grind"), value: values.grind, decimals: grindDecimals(values.grind) },
    { label: t("dose"), value: values.dose, decimals: 1, unit: "gram" },
    { label: t("yield"), value: values.yield, decimals: 1, unit: "gram" },
    { label: t("time"), value: seconds, decimals: 1, unit: "second" },
  ];

  return (
    <div className={className}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
        {cells.map((c) => {
          const parts = formatValueParts(locale, c.value, c.decimals, c.unit);
          return (
            <div key={c.label} className="flex flex-col">
              <dt className="text-overline uppercase text-ink-secondary">{c.label}</dt>
              <dd className="flex items-baseline gap-1.5">
                <span className="text-display">{parts.number}</span>
                {parts.unit && <span className="text-h2 text-ink-tertiary">{parts.unit}</span>}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-3 text-label text-ink-secondary">
        {t("ratio", {
          ratio: format.number(values.yield / values.dose, { maximumFractionDigits: 1 }),
        })}
      </p>
    </div>
  );
}

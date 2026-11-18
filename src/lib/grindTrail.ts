import type { useFormatter } from "next-intl";
import type { GrindAdjustment } from "@/domain/drift";
import type { RoastingClock } from "@/domain/roastingClock";

/** The coffee's age in days for "beans aged N days", when the bag gives one. */
export const roastDays = (c: RoastingClock | undefined): number | null => (c && (c.kind === "roasted" || c.kind === "packed") ? c.days : null);

/*
 * SH-DRIFT's words (STORY-04-02-08), worked out where the adjustment is:
 * the recipe's grind, a signed row per step that moved it, the grind shown,
 * and what it rests on, in time and counts, never a name. "Finer" and
 * "coarser" only when the grinder's direction is known (AC 4); numbers in
 * the grinder's own units otherwise.
 */

export type GrindTrailView = {
  /** The quiet line on Brew and in the log: "Recipe 15 · beans have aged". */
  line: string;
  title: string;
  close: string;
  recipe: { label: string; value: string };
  rows: { label: string; value: string }[];
  shown: { label: string; value: string };
  evidence: string[];
  /** Brew's footer: the recipe's grind for this pull only. */
  useRecipe?: string;
};

type DriftKey = Exclude<keyof (typeof import("@/i18n/messages/en.json"))["drift"], never>;
type Key = `drift.${DriftKey}` | `home.grindReason.${"aged" | "bag" | "both"}` | "home.grindAdjusted" | "actions.close";
type Translate = (key: Key, values?: Record<string, string | number | Date>) => string;
type Format = Pick<ReturnType<typeof useFormatter>, "number" | "dateTime">;

const decimals = (step: number) => (step >= 1 ? 0 : Math.min(3, Math.ceil(-Math.log10(step) - 1e-9)));

export function grindTrailView(
  a: GrindAdjustment,
  t: Translate,
  format: Format,
  opts: { roastDays?: number | null; timeZone: string; useRecipe?: boolean },
): GrindTrailView {
  const digits = { minimumFractionDigits: decimals(a.wheel.step), maximumFractionDigits: decimals(a.wheel.step) };
  const grind = (n: number) => format.number(n, digits);
  const coarserIs = (delta: number) => (a.wheel.coarser === null ? null : a.wheel.coarser === "higher" ? delta > 0 : delta < 0);
  const signed = (delta: number) => {
    // With a direction the words carry the sign: "0.5 finer"; without, "+1".
    const coarser = coarserIs(delta);
    if (coarser === null) return format.number(delta, { ...digits, signDisplay: "always" });
    return t(coarser ? "drift.coarser" : "drift.finer", { value: format.number(Math.abs(delta), digits) });
  };
  const label = (row: GrindAdjustment["rows"][number]) => {
    if (row.kind === "aged") return opts.roastDays != null ? t("drift.agedDays", { days: opts.roastDays }) : t("drift.aged");
    if (row.kind === "limit") return t("drift.limit", { steps: Math.round(Math.abs(a.shown - a.recipeGrind) / a.wheel.step) });
    const coarser = coarserIs(row.delta);
    return coarser === null ? t("drift.bag") : t(coarser ? "drift.bagSlow" : "drift.bagFast");
  };

  const kinds = new Set(a.rows.map((r) => r.kind));
  const reason = kinds.has("aged") && kinds.has("bag") ? "both" : kinds.has("aged") ? "aged" : "bag";
  const e = a.evidence;
  const evidence = [
    e.sinceServicing
      ? t("drift.sinceServicing", { count: e.measured })
      : e.reachedBackTo
        ? t("drift.basedOnSince", { count: e.measured, date: format.dateTime(e.reachedBackTo, { day: "numeric", month: "long", timeZone: opts.timeZone }) })
        : t("drift.basedOn", { count: e.measured, days: e.windowDays }),
    t("drift.onlyMeasured"),
    t("drift.recentMore"),
    ...(e.leftOutPrep ? [t("drift.prepLeftOut", { count: e.leftOutPrep })] : []),
    ...(e.leftOutNoRecipe ? [t("drift.noRecipeLeftOut", { count: e.leftOutNoRecipe })] : []),
    ...(e.people > 1 ? [t("drift.pooled", { count: e.people })] : []),
    ...(e.acrossSetups ? [t("drift.acrossSetups")] : []),
    ...(e.people > 1 || e.acrossSetups ? [t("drift.perRecipe")] : []),
  ];

  return {
    line: t("home.grindAdjusted", { grind: grind(a.recipeGrind), reason: t(`home.grindReason.${reason}`) }),
    title: t("drift.title"),
    close: t("actions.close"),
    recipe: { label: t("drift.recipe"), value: grind(a.recipeGrind) },
    rows: a.rows.map((r) => ({ label: label(r), value: signed(r.delta) })),
    shown: { label: t("drift.shown"), value: grind(a.shown) },
    evidence,
    useRecipe: opts.useRecipe ? t("drift.useRecipe", { grind: grind(a.recipeGrind) }) : undefined,
  };
}

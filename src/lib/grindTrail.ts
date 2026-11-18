import type { useFormatter } from "next-intl";
import type { GrindAdjustment } from "@/domain/drift";
import type { RoastingClock } from "@/domain/roastingClock";
import type { ServicingStep } from "@/domain/servicing";

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
type Reason = "aged" | "bag" | "both" | "serviced" | "servicedAnd";
type Key = `drift.${DriftKey}` | `home.grindReason.${Reason}` | "home.grindAdjusted" | "actions.close";
type Translate = (key: Key, values?: Record<string, string | number | Date>) => string;
type Format = Pick<ReturnType<typeof useFormatter>, "number" | "dateTime">;

const decimals = (step: number) => (step >= 1 ? 0 : Math.min(3, Math.ceil(-Math.log10(step) - 1e-9)));

/**
 * The trail for a recipe whose grind isn't the stored one: confirmed
 * servicing shifts first, with their dates (STORY-04-03-03 AC 4), then the
 * drift steps. Null when neither moved it.
 */
export function grindTrailView(
  input: { adjustment: GrindAdjustment | null; servicing?: readonly ServicingStep[]; wheel: { step: number; coarser: "higher" | "lower" | null } },
  t: Translate,
  format: Format,
  opts: { roastDays?: number | null; timeZone: string; useRecipe?: boolean },
): GrindTrailView | null {
  const a = input.adjustment;
  const servicing = input.servicing ?? [];
  if (!a && !servicing.length) return null;
  const wheel = a?.wheel ?? input.wheel;
  const digits = { minimumFractionDigits: decimals(wheel.step), maximumFractionDigits: decimals(wheel.step) };
  const grind = (n: number) => format.number(n, digits);
  const coarserIs = (delta: number) => (wheel.coarser === null ? null : wheel.coarser === "higher" ? delta > 0 : delta < 0);
  const signed = (delta: number) => {
    // With a direction the words carry the sign: "0.5 finer"; without, "+1".
    const coarser = coarserIs(delta);
    if (coarser === null) return format.number(delta, { ...digits, signDisplay: "always" });
    return t(coarser ? "drift.coarser" : "drift.finer", { value: format.number(Math.abs(delta), digits) });
  };
  const label = (row: GrindAdjustment["rows"][number]) => {
    if (row.kind === "aged") return opts.roastDays != null ? t("drift.agedDays", { days: opts.roastDays }) : t("drift.aged");
    if (row.kind === "limit") return t("drift.limit", { steps: Math.round(Math.abs(a!.shown - a!.recipeGrind) / wheel.step) });
    const coarser = coarserIs(row.delta);
    return coarser === null ? t("drift.bag") : t(coarser ? "drift.bagSlow" : "drift.bagFast");
  };
  const day = (d: Date) => format.dateTime(d, { day: "numeric", month: "long", timeZone: opts.timeZone });

  const kinds = new Set(a?.rows.map((r) => r.kind));
  const drift: Reason | null = !a ? null : kinds.has("aged") && kinds.has("bag") ? "both" : kinds.has("aged") ? "aged" : "bag";
  const reason: Reason = servicing.length ? (drift ? "servicedAnd" : "serviced") : drift!;
  const stored = servicing.length ? servicing[0].from : a!.recipeGrind;
  const shown = a ? a.shown : servicing[servicing.length - 1].to;

  const evidence: string[] = servicing.length ? [t("drift.servicedNote")] : [];
  if (a) {
    const e = a.evidence;
    evidence.push(
      e.sinceServicing
        ? t("drift.sinceServicing", { count: e.measured })
        : e.reachedBackTo
          ? t("drift.basedOnSince", { count: e.measured, date: day(e.reachedBackTo) })
          : t("drift.basedOn", { count: e.measured, days: e.windowDays }),
      t("drift.onlyMeasured"),
      t("drift.recentMore"),
      ...(e.leftOutPrep ? [t("drift.prepLeftOut", { count: e.leftOutPrep })] : []),
      ...(e.leftOutNoRecipe ? [t("drift.noRecipeLeftOut", { count: e.leftOutNoRecipe })] : []),
      ...(e.people > 1 ? [t("drift.pooled", { count: e.people })] : []),
      ...(e.acrossSetups ? [t("drift.acrossSetups")] : []),
      ...(e.people > 1 || e.acrossSetups ? [t("drift.perRecipe")] : []),
    );
  }

  return {
    line: t("home.grindAdjusted", { grind: grind(stored), reason: t(`home.grindReason.${reason}`) }),
    title: t("drift.title"),
    close: t("actions.close"),
    recipe: { label: t("drift.recipe"), value: grind(stored) },
    rows: [
      ...servicing.map((s) => ({ label: t("drift.serviced", { date: day(s.at) }), value: signed(Number((s.to - s.from).toFixed(6))) })),
      ...(a?.rows ?? []).map((r) => ({ label: label(r), value: signed(r.delta) })),
    ],
    shown: { label: t("drift.shown"), value: grind(shown) },
    evidence,
    // Drift only: "use my recipe's grind" means the recipe as servicing left it.
    useRecipe: opts.useRecipe && a ? t("drift.useRecipe", { grind: grind(a.recipeGrind) }) : undefined,
  };
}

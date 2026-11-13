import type { useFormatter, useTranslations } from "next-intl";
import type { getFormatter, getTranslations } from "next-intl/server";
import type { Change, Freshness, ReasonPart, SuggestInput, Suggestion } from "@/domain/suggest";
import { tastePhraseKeys } from "@/domain/tastePhrase";

/** From useTranslations() on the device, or getTranslations() on the server. */
type T = ReturnType<typeof useTranslations<never>> | Awaited<ReturnType<typeof getTranslations<never>>>;
type F = ReturnType<typeof useFormatter> | Awaited<ReturnType<typeof getFormatter>>;

/** A suggestion in words, for SuggestionCard (design "the suggestion", DES-02-03-05). */
export type SuggestionWords = {
  change?: string;
  values?: { from: string; to: string };
  reason?: string;
  freshness?: string;
  /** The grinder's direction isn't known: offer to tell Tare (AC 6). */
  askDirection: boolean;
};

const grams = (format: F, n: number) => format.number(n, { style: "unit", unit: "gram", unitDisplay: "short", maximumFractionDigits: 1 });
const ml = (format: F, n: number) => format.number(n, { style: "unit", unit: "milliliter", unitDisplay: "short", maximumFractionDigits: 0 });
const celsius = (format: F, n: number) => format.number(n, { style: "unit", unit: "celsius", maximumFractionDigits: 1 });
const grind = (format: F, n: number) => format.number(n, { maximumFractionDigits: 2 });

function changeWords(c: Change, t: T, format: F): Pick<SuggestionWords, "change" | "values"> {
  switch (c.lever) {
    case "prep":
      return { change: t(c.tool === "checkDistribution" ? "suggest.change.prepAlready" : `suggest.change.${c.tool}`) };
    case "grind": {
      const finer = c.direction === "finer";
      if (c.from === null || c.to === null) return { change: t(finer ? "suggest.change.grindFinerUnknown" : "suggest.change.grindCoarserUnknown") };
      return {
        change: t(finer ? "suggest.change.grindFiner" : "suggest.change.grindCoarser", { steps: c.steps }),
        values: { from: grind(format, c.from), to: grind(format, c.to) },
      };
    }
    case "yield":
      return { change: t("suggest.change.yield", { from: grams(format, c.from), to: grams(format, c.to) }) };
    case "dose": {
      const amount = grams(format, Math.abs(c.to - c.from));
      return { change: t(c.direction === "more" ? "suggest.change.doseMore" : "suggest.change.doseLess", { amount }), values: { from: grams(format, c.from), to: grams(format, c.to) } };
    }
    case "milk": {
      const amount = ml(format, Math.abs(c.to - c.from));
      return { change: t(c.direction === "more" ? "suggest.change.milkMore" : "suggest.change.milkLess", { amount }), values: { from: ml(format, c.from), to: ml(format, c.to) } };
    }
    case "temperature": {
      const hotter = c.direction === "more";
      if (c.from === null || c.to === null) return { change: t(hotter ? "suggest.change.hotterUnknown" : "suggest.change.coolerUnknown") };
      const amount = format.number(Math.abs(c.to - c.from), { style: "unit", unit: "celsius", maximumFractionDigits: 1 });
      return { change: t(hotter ? "suggest.change.hotter" : "suggest.change.cooler", { amount }), values: { from: celsius(format, c.from), to: celsius(format, c.to) } };
    }
  }
}

/** "much too sour and ran fast": what was said, then how it ran. Lower case; the card capitalises its first letter. */
function reasonWords(parts: ReasonPart[], milkDrink: boolean, t: T, format: F): string | undefined {
  const words = parts.map((p) => {
    if (p.kind === "time") return t(p.ran === "fast" ? "suggest.why.ranFast" : "suggest.why.ranSlow");
    if (p.kind === "tag") return t(`suggest.why.tags.${p.tag}`);
    const answers = { balance: null, strength: null, body: null, sweetness: null, [p.question]: p.value };
    const [key] = tastePhraseKeys(answers, milkDrink);
    return key ? t(key.replace(/^taste\./, "suggest.why.") as Parameters<T>[0]) : "";
  });
  const said = words.filter(Boolean);
  return said.length ? format.list(said, { type: "conjunction" }) : undefined;
}

function freshnessWords(f: Freshness, clocks: SuggestInput["clocks"], t: T): string | undefined {
  if (f === "pastPeakOpen") return clocks.opened?.kind === "open" ? t("suggest.fresh.pastPeakOpen", { days: clocks.opened.days }) : undefined;
  const r = clocks.roasting;
  if (r?.kind !== "roasted" && r?.kind !== "packed") return undefined;
  return t(f === "veryFresh" ? "suggest.fresh.veryFresh" : "suggest.fresh.pastPeakRoasted", { days: r.days, from: r.kind });
}

/** Nothing to say (no change and no freshness line) gives null: no card. */
export function suggestionWords(
  s: Suggestion,
  context: { milkDrink: boolean; clocks: SuggestInput["clocks"] },
  t: T,
  format: F,
): SuggestionWords | null {
  const freshness = s.freshness ? freshnessWords(s.freshness, context.clocks, t) : undefined;
  if (!s.change && !freshness) return null;
  return {
    ...(s.change && changeWords(s.change, t, format)),
    reason: reasonWords(s.reason, context.milkDrink, t, format),
    freshness,
    askDirection: s.change?.lever === "grind" && s.change.from === null,
  };
}

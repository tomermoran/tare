/**
 * Units values are displayed in. They match the database except for shot
 * time, which is stored in milliseconds (see msToSeconds / secondsToMs).
 * Names are Intl.NumberFormat unit identifiers, so the browser supplies the
 * localised symbol ("g", "s", "°C") and no unit strings live in our code.
 * Pressure (bar) has no Intl unit; pass its label from the messages instead.
 */
export type CanonicalUnit = "gram" | "second" | "celsius";

/** Stored shot time (ms) → displayed seconds, to one decimal like a scale timer. */
export function msToSeconds(ms: number) {
  return Math.round(ms / 100) / 10;
}

/** Displayed seconds → stored shot time (whole ms). */
export function secondsToMs(seconds: number) {
  return Math.round(seconds * 1000);
}

/** The locale's decimal mark: "." in English, "," in German. */
export function decimalSeparator(locale: string) {
  return (
    new Intl.NumberFormat(locale)
      .formatToParts(1.1)
      .find((p) => p.type === "decimal")?.value ?? "."
  );
}

/**
 * Filters typed text down to a decimal number: digits plus one decimal mark
 * (".", or the locale's own), with at most `maxDecimals` digits after it.
 * Everything else is dropped as it is typed.
 */
export function sanitizeDecimal(
  raw: string,
  separator: string,
  maxDecimals: number,
) {
  let out = "";
  let seenMark = false;
  let decimals = 0;
  for (const ch of raw) {
    if (ch >= "0" && ch <= "9") {
      if (seenMark) {
        if (decimals >= maxDecimals) continue;
        decimals++;
      }
      out += ch;
    } else if ((ch === "." || ch === separator) && !seenMark) {
      // With no decimals allowed, the mark isn't shown and digits after it
      // are ignored, so "28.5" stays 28 rather than becoming 285.
      seenMark = true;
      if (maxDecimals > 0) out += separator;
    }
  }
  return out;
}

/** Parses sanitised text back to a number; null if there's nothing to parse. */
export function parseDecimal(text: string, separator: string) {
  if (!/\d/.test(text)) return null;
  const n = Number(text.replace(separator, "."));
  return Number.isFinite(n) ? n : null;
}

/** Number of decimals implied by a step: 0.1 → 1, 0.25 → 2, 1 → 0. */
export function decimalsOf(step: number) {
  return (String(step).split(".")[1] ?? "").length;
}

/** Splits a formatted value into number and unit parts, for different type sizes. */
export function formatValueParts(
  locale: string,
  value: number,
  decimals: number,
  unit?: CanonicalUnit,
) {
  const parts = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...(unit && { style: "unit", unit, unitDisplay: "narrow" }),
  }).formatToParts(value);
  return {
    number: parts
      .filter((p) => p.type !== "unit" && p.type !== "literal")
      .map((p) => p.value)
      .join(""),
    unit: parts
      .filter((p) => p.type === "unit")
      .map((p) => p.value)
      .join(""),
  };
}

/** The localised symbol for a unit, e.g. "g" for gram in English. */
export function unitSymbol(locale: string, unit: CanonicalUnit) {
  return formatValueParts(locale, 1, 0, unit).unit;
}

/*
 * Where a coffee comes from (EPIC-03-07, TD-9). Stored as one text value:
 * a producing country's ISO 3166-1 alpha-2 code, `blend`, or
 * `other:<text>` for anything the list doesn't have. The text of "other"
 * is normalised (trimmed, single spaces, case-folded) so spellings that
 * differ only in capitals or spacing are one origin (STORY-03-07-04 AC 2).
 * Country names come from Intl.DisplayNames, so this module holds no copy.
 */

/** The producing countries and territories, from planning/coffee-origins.json (81). */
export const ORIGIN_COUNTRIES = [
  "AO", "AU", "BI", "BJ", "BO", "BR", "BZ", "CD", "CF", "CG", "CI", "CK", "CM", "CN", "CO", "CR", "CU", "CV", "DM", "DO", "EC", "ET", "FJ", "GA", "GH", "GN", "GP", "GQ", "GT", "GY", "HN", "HT", "ID", "IN", "JM", "KE", "KH", "KM", "LA", "LC", "LK", "LR", "MG", "MM", "MQ", "MU", "MW", "MX", "MY", "MZ", "NC", "NG", "NI", "NP", "PA", "PE", "PF", "PG", "PH", "PR", "PY", "RW", "SA", "SL", "SR", "ST", "SV", "TG", "TH", "TL", "TT", "TZ", "UG", "US", "VC", "VE", "VN", "WS", "YE", "ZM", "ZW",
] as const;

export type OriginCountry = (typeof ORIGIN_COUNTRIES)[number];
export type Origin = OriginCountry | "blend" | `other:${string}`;

export const BLEND = "blend";
const OTHER = "other:";

/** The longest an "other" origin can be, after normalising. */
export const OTHER_MAX = 60;

const countries: ReadonlySet<string> = new Set(ORIGIN_COUNTRIES);

/** Trim, one space between words, case-folded and cut to length; null when nothing is left. */
export function normaliseOther(text: string): `other:${string}` | null {
  const clean = text.normalize("NFC").trim().replace(/\s+/g, " ").toLocaleLowerCase("und").slice(0, OTHER_MAX).trim();
  return clean ? `${OTHER}${clean}` : null;
}

/** A stored or submitted value as an origin, or null when it isn't one. "other:" text is normalised. */
export function parseOrigin(value: unknown): Origin | null {
  if (typeof value !== "string") return null;
  if (countries.has(value)) return value as OriginCountry;
  if (value === BLEND) return BLEND;
  if (value.startsWith(OTHER)) return normaliseOther(value.slice(OTHER.length));
  return null;
}

export type OriginParts = { kind: "country"; code: OriginCountry } | { kind: "blend" } | { kind: "other"; text: string };

export function originParts(origin: Origin): OriginParts {
  if (origin === BLEND) return { kind: "blend" };
  if (origin.startsWith(OTHER)) return { kind: "other", text: origin.slice(OTHER.length) };
  return { kind: "country", code: origin as OriginCountry };
}

/** The country's name in the locale, falling back to the code when the runtime has no name for it. */
export function countryName(code: OriginCountry, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region", fallback: "code" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** An origin in words. A blend's word is the caller's, from the messages. */
export function labelOrigin(origin: Origin, locale: string, words: { blend: string }): string {
  const parts = originParts(origin);
  if (parts.kind === "blend") return words.blend;
  if (parts.kind === "other") return parts.text.charAt(0).toLocaleUpperCase(locale) + parts.text.slice(1);
  return countryName(parts.code, locale);
}

/** The countries to choose from, sorted by name in the locale; empty when the runtime can't name them. */
export function originChoices(locale: string): { code: OriginCountry; name: string }[] {
  try {
    const names = new Intl.DisplayNames([locale], { type: "region" });
    const collator = new Intl.Collator(locale);
    return ORIGIN_COUNTRIES.map((code) => ({ code, name: names.of(code) ?? code })).sort((a, b) => collator.compare(a.name, b.name));
  } catch {
    return [];
  }
}

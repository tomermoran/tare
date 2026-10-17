export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Scripts written right-to-left. Checked by language subtag, so "he-IL" matches "he".
const rtlLanguages = new Set(["ar", "fa", "he", "ur", "yi"]);

export function getDirection(locale: string): "ltr" | "rtl" {
  const language = new Intl.Locale(locale).language;
  return rtlLanguages.has(language) ? "rtl" : "ltr";
}

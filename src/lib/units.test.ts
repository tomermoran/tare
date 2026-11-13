import { describe, expect, it } from "vitest";
import { decimalSeparator, formatValueParts, msToSeconds, parseDecimal, sanitizeDecimal, secondsToMs } from "./units";

const locales = ["en", "en-US", "de-DE", "fr-FR", "he-IL"];

describe("decimal entry across locales (STORY-01-03-05)", () => {
  it("knows each locale's decimal mark", () => {
    expect(decimalSeparator("en-US")).toBe(".");
    expect(decimalSeparator("de-DE")).toBe(",");
    expect(decimalSeparator("fr-FR")).toBe(",");
  });

  it.each(locales)("round-trips a formatted value back to the same number in %s", (locale) => {
    const sep = decimalSeparator(locale);
    for (const value of [0, 7.5, 18.2, 27.6, 36, 99.9]) {
      const { number } = formatValueParts(locale, value, 1);
      expect(parseDecimal(number, sep)).toBe(value);
    }
  });

  it("turns typed comma or point entry into the canonical number", () => {
    expect(parseDecimal(sanitizeDecimal("18,5", ",", 1), ",")).toBe(18.5);
    expect(parseDecimal(sanitizeDecimal("18.5", ",", 1), ",")).toBe(18.5);
    expect(parseDecimal(sanitizeDecimal("18.5", ".", 1), ".")).toBe(18.5);
    expect(parseDecimal(sanitizeDecimal("27,63", ",", 1), ",")).toBe(27.6);
    expect(parseDecimal("", ",")).toBeNull();
  });

  it("stores time in ms whatever the display (27.6 s is 27 600 ms)", () => {
    const typed = parseDecimal(sanitizeDecimal("27,6", ",", 1), ",")!;
    expect(secondsToMs(typed)).toBe(27_600);
    expect(msToSeconds(27_600)).toBe(27.6);
    expect(formatValueParts("de-DE", msToSeconds(27_600), 1, "second")).toMatchObject({ number: "27,6" });
    expect(formatValueParts("en", msToSeconds(27_600), 1, "second")).toMatchObject({ number: "27.6" });
  });
});

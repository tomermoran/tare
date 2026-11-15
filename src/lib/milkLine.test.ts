import { createFormatter, createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import messages from "@/i18n/messages/en.json";
import { milkLine } from "./milkLine";

const t = createTranslator({ locale: "en", messages });
const format = createFormatter({ locale: "en" });
// German number formatting (TQ-08): Intl directly, since only "en" ships.
const ml = (locale: string, v: number) => new Intl.NumberFormat(locale, { style: "unit", unit: "milliliter", unitDisplay: "short" }).format(v);
const de = { number: (v: number, o: Intl.NumberFormatOptions) => new Intl.NumberFormat("de-DE", o).format(v) };

describe("milkLine", () => {
  it("names the milk and its amount in millilitres", () => {
    expect(milkLine("Oat", 150, t, format)).toBe(`Oat, ${ml("en", 150)}`);
  });

  it("is the milk alone without an amount", () => {
    expect(milkLine("Oat", null, t, format)).toBe("Oat");
  });

  it("formats the amount for the locale", () => {
    expect(milkLine("Hafer", 1000, t, de)).toBe(`Hafer, ${ml("de-DE", 1000)}`);
    expect(milkLine("Hafer", 1000, t, de)).toContain("1.000");
  });
});

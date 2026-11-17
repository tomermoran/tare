import { describe, expect, it } from "vitest";
import origins from "../../planning/coffee-origins.json";
import { labelOrigin, normaliseOther, ORIGIN_COUNTRIES, originChoices, parseOrigin } from "./origin";

describe("origin (STORY-03-07-04)", () => {
  it("lists the planning file's 81 producing countries", () => {
    expect([...ORIGIN_COUNTRIES].sort()).toEqual(origins.coffee_origin_countries.map((c) => c.iso_alpha_2).sort());
  });

  it("takes a country code, blend, or other text, and nothing else", () => {
    expect(parseOrigin("ET")).toBe("ET");
    expect(parseOrigin("blend")).toBe("blend");
    expect(parseOrigin("other:Hawaiian kona")).toBe("other:hawaiian kona");
    expect(parseOrigin("et")).toBeNull();
    expect(parseOrigin("FR")).toBeNull();
    expect(parseOrigin("other:   ")).toBeNull();
    expect(parseOrigin(42)).toBeNull();
    expect(parseOrigin(null)).toBeNull();
  });

  it("makes spellings that differ only in capitals or spacing one origin (AC 2)", () => {
    expect(normaliseOther("Hawaiian kona")).toBe(normaliseOther("  hawaiian  Kona "));
    expect(normaliseOther("")).toBeNull();
    expect(normaliseOther("x".repeat(100))).toBe(`other:${"x".repeat(60)}`);
  });

  it("names a country through Intl, a blend with the caller's word, and other text as typed", () => {
    expect(labelOrigin("ET", "en", { blend: "Blend" })).toBe("Ethiopia");
    expect(labelOrigin("ET", "de", { blend: "Mischung" })).toBe("Äthiopien");
    expect(labelOrigin("blend", "en", { blend: "Blend" })).toBe("Blend");
    expect(labelOrigin("other:hawaiian kona", "en", { blend: "Blend" })).toBe("Hawaiian kona");
  });

  it("sorts the choices by name in the locale", () => {
    const names = originChoices("en").map((c) => c.name);
    expect(names).toHaveLength(81);
    expect(names.slice(0, 3)).toEqual(["Angola", "Australia", "Belize"]);
  });
});

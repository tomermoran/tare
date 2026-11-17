import { describe, expect, it } from "vitest";
import { applyFilters, filterOptions, offersFilters, ratingWord, type BeanFacet } from "./beansFilter";
import { countryName, type OriginCountry } from "./origin";

/*
 * The Beans filter rules (TASK-03-07-01-BE1, QA1): a fixed household of six
 * coffees, and one of five.
 */

const coffee = (beanId: string, over: Partial<BeanFacet> = {}): BeanFacet => ({
  beanId,
  roasterId: "r-north",
  roasterName: "North Roasters",
  roastLevel: "Medium",
  origin: null,
  rating: "noRatings",
  ...over,
});

const six: BeanFacet[] = [
  coffee("a", { roastLevel: "Dark", origin: "ET", rating: "mostlyGood" }),
  coffee("b", { roastLevel: "Light", origin: "KE", rating: "mostlyGood" }),
  coffee("c", { roasterId: "r-ash", roasterName: "Ash Lane", roastLevel: "Light", origin: "blend", rating: "mixed" }),
  coffee("d", { roasterId: "r-ash", roasterName: "Ash Lane", roastLevel: null, origin: "other:hawaiian kona" }),
  coffee("e", { rating: "mostlyOff" }),
  coffee("f", { roastLevel: "Medium-Light", origin: "CO" }),
];

describe("when the filters are offered (STORY-03-07-01 AC 1)", () => {
  it("needs six coffees", () => {
    expect(offersFilters(six)).toBe(true);
    expect(offersFilters(six.slice(0, 5))).toBe(false);
  });
});

describe("filter options (AC 2, AC 3)", () => {
  const options = filterOptions(six, { originName: (o) => (o.length === 2 ? countryName(o as OriginCountry, "en") : o) });

  it("gives only values present, with counts, roasters by name", () => {
    expect(options.roaster).toEqual([
      { value: "r-ash", count: 2 },
      { value: "r-north", count: 4 },
    ]);
  });

  it("runs roast levels light to dark, leaving out coffees with none", () => {
    expect(options.roast).toEqual([
      { value: "Light", count: 2 },
      { value: "Medium-Light", count: 1 },
      { value: "Medium", count: 1 },
      { value: "Dark", count: 1 },
    ]);
  });

  it("uses Tried's words in Tried's order", () => {
    expect(options.rating.map((o) => o.value)).toEqual(["mostlyGood", "mixed", "mostlyOff", "noRatings"]);
    expect(options.rating.find((o) => o.value === "noRatings")?.count).toBe(2);
  });

  it("lists origins by name, then other, blend and not stated (STORY-03-07-03 AC 1, AC 3, AC 4)", () => {
    expect(options.origin.map((o) => o.value)).toEqual(["CO", "ET", "KE", "other:hawaiian kona", "blend", "none"]);
    expect(options.origin.at(-1)).toEqual({ value: "none", count: 1 });
  });

  it("offers no origin filter while no coffee has one (STORY-03-07-03 AC 2)", () => {
    expect(filterOptions(six.map((f) => ({ ...f, origin: null }))).origin).toEqual([]);
  });
});

describe("applying filters (AC 4)", () => {
  it("is everything with none on", () => {
    expect(applyFilters(six, {}).size).toBe(6);
  });

  it("combines one value per filter", () => {
    expect(applyFilters(six, { roaster: "r-north", roast: "Light" })).toEqual(new Set(["b"]));
    expect(applyFilters(six, { roaster: "r-north", rating: "mostlyGood", origin: "ET" })).toEqual(new Set(["a"]));
    expect(applyFilters(six, { roaster: "r-ash", rating: "mostlyOff" })).toEqual(new Set());
  });

  it("finds coffees with no origin as not stated, and a blend under blend", () => {
    expect(applyFilters(six, { origin: "none" })).toEqual(new Set(["e"]));
    expect(applyFilters(six, { origin: "blend" })).toEqual(new Set(["c"]));
  });
});

describe("ratingWord", () => {
  it("follows Tried's summary, and a last rating for one or two rated shots", () => {
    expect(ratingWord(null)).toBe("noRatings");
    expect(ratingWord({ kind: "mixed" })).toBe("mixed");
    expect(ratingWord({ kind: "lastRated", rating: 5 })).toBe("mostlyGood");
    expect(ratingWord({ kind: "lastRated", rating: 3 })).toBe("mixed");
    expect(ratingWord({ kind: "lastRated", rating: 1 })).toBe("mostlyOff");
  });
});

import { describe, expect, it } from "vitest";
import { beansHref, readBeansFilters } from "./beansFilters";

describe("Beans filters in the URL (STORY-03-07-02)", () => {
  it("round-trips through the address", () => {
    const filters = { roaster: "r1", roast: "Medium-Light", origin: "other:hawaiian kona", rating: "mixed" };
    const href = beansHref(filters);
    expect(Object.fromEntries(new URL(href, "http://x").searchParams)).toEqual(filters);
    expect(readBeansFilters(Object.fromEntries(new URL(href, "http://x").searchParams))).toEqual(filters);
  });

  it("is plain /beans with none, and ignores anything else", () => {
    expect(beansHref()).toBe("/beans");
    expect(readBeansFilters({ roast: "", other: "x", rating: ["a", "b"] })).toEqual({});
  });
});

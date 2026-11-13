import { describe, expect, it } from "vitest";
import { BREW_CHOICE_RESET_MS, decodeBrewChoice, encodeBrewChoice, liveBrewChoice } from "./brewChoice";

describe("brewChoice (STORY-02-02-06 AC 6)", () => {
  const at = Date.UTC(2026, 2, 20, 8);

  it("round-trips through the cookie", () => {
    const choice = { drinkId: "latte", beanId: "seed:bean:x", at };
    expect(decodeBrewChoice(encodeBrewChoice(choice))).toEqual(choice);
  });

  it("ignores anything malformed", () => {
    expect(decodeBrewChoice(undefined)).toBeNull();
    expect(decodeBrewChoice("not json")).toBeNull();
    expect(decodeBrewChoice(encodeURIComponent(JSON.stringify({ drinkId: "x" })))).toBeNull();
    expect(decodeBrewChoice(encodeURIComponent(JSON.stringify({ drinkId: 3, at })))).toEqual({ drinkId: undefined, beanId: undefined, at });
  });

  it("applies for 30 minutes away from Brew, then lapses", () => {
    const choice = { drinkId: "latte", at };
    expect(liveBrewChoice(choice, new Date(at + BREW_CHOICE_RESET_MS))).toBe(choice);
    expect(liveBrewChoice(choice, new Date(at + BREW_CHOICE_RESET_MS + 1))).toBeNull();
    expect(liveBrewChoice(null, new Date(at))).toBeNull();
  });
});

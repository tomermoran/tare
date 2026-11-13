import { describe, expect, it } from "vitest";
import { InvalidMilkError, milkAfterDrinkChange, milkStart, validateMilk } from "./milk";

const milks = [{ id: "whole" }, { id: "oat" }];
const latte = { hasMilk: true, typicalMilkMl: 180 };
const espresso = { hasMilk: false, typicalMilkMl: null };

describe("milkStart (STORY-01-03-07)", () => {
  it("asks nothing for a drink without milk (AC 2)", () => {
    expect(milkStart({ drink: espresso, lastMilkOfDrink: "oat", milks })).toBeNull();
  });

  it("starts from the recipe (AC 3)", () => {
    expect(milkStart({ drink: latte, recipe: { milkTypeId: "oat", ml: 150 }, lastMilkOfDrink: "whole", milks })).toEqual({ milkTypeId: "oat", ml: 150 });
  });

  it("else the last milk of this drink, else the first, with the typical amount (AC 4)", () => {
    expect(milkStart({ drink: latte, lastMilkOfDrink: "oat", milks })).toEqual({ milkTypeId: "oat", ml: 180 });
    expect(milkStart({ drink: latte, milks })).toEqual({ milkTypeId: "whole", ml: 180 });
    expect(milkStart({ drink: latte, lastMilkOfDrink: "hidden", milks })).toEqual({ milkTypeId: "whole", ml: 180 });
    expect(milkStart({ drink: { hasMilk: true, typicalMilkMl: null }, milks })).toEqual({ milkTypeId: "whole", ml: 150 });
    expect(milkStart({ drink: { hasMilk: true, typicalMilkMl: 64 }, milks })!.ml).toBe(60);
  });
});

describe("milkAfterDrinkChange (AC 5)", () => {
  const next = { milkTypeId: "whole", ml: 240 };
  it("lets untouched values follow the new drink and keeps touched ones", () => {
    expect(milkAfterDrinkChange({ milkTypeId: "oat", ml: 180 }, new Set(), next)).toEqual(next);
    expect(milkAfterDrinkChange({ milkTypeId: "oat", ml: 180 }, new Set(["milkTypeId"]), next)).toEqual({ milkTypeId: "oat", ml: 240 });
  });

  it("drops milk for a drink without it, and starts it for one with", () => {
    expect(milkAfterDrinkChange({ milkTypeId: "oat", ml: 180 }, new Set(["ml"]), null)).toBeNull();
    expect(milkAfterDrinkChange(null, new Set(), next)).toEqual(next);
  });
});

describe("validateMilk", () => {
  const ok = (v: Partial<Parameters<typeof validateMilk>[0]>) => () =>
    validateMilk({ hasMilk: true, milkTypeId: "oat", ml: 150, visibleMilkIds: ["oat"], ...v });

  it("accepts a visible milk in tens from 0 to 500, and none at all", () => {
    expect(ok({})).not.toThrow();
    expect(ok({ ml: 0 })).not.toThrow();
    expect(ok({ ml: 500 })).not.toThrow();
    expect(ok({ hasMilk: false, milkTypeId: null, ml: null })).not.toThrow();
  });

  it("rejects milk on a drink without it, a half pair, an unknown milk and bad amounts", () => {
    for (const bad of [{ hasMilk: false }, { ml: null }, { milkTypeId: null }, { milkTypeId: "soy" }, { ml: 510 }, { ml: 155 }, { ml: -10 }]) {
      expect(ok(bad)).toThrow(InvalidMilkError);
    }
  });
});

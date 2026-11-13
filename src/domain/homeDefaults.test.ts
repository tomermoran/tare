import { describe, expect, it } from "vitest";
import { pickCoffee, pickDrink, type CoffeePortion } from "./homeDefaults";

const TZ = "Europe/London";
const at = (iso: string) => new Date(iso);

describe("pickDrink (DQ-02, STORY-02-02-01 AC 3)", () => {
  const drinkIds = ["espresso", "latte", "flat-white"];
  // Mornings: lattes. Afternoons: espresso.
  const shots = [
    { drinkTypeId: "latte", at: at("2026-03-10T07:30:00Z") },
    { drinkTypeId: "latte", at: at("2026-03-11T07:45:00Z") },
    { drinkTypeId: "espresso", at: at("2026-03-11T14:10:00Z") },
  ];

  it("shows the morning drink in the morning and the afternoon drink in the afternoon", () => {
    expect(pickDrink({ shots, drinkIds, now: at("2026-03-12T08:30:00Z"), timeZone: TZ })).toBe("latte");
    expect(pickDrink({ shots, drinkIds, now: at("2026-03-12T15:00:00Z"), timeZone: TZ })).toBe("espresso");
  });

  it("counts 90 minutes either side, and no further", () => {
    expect(pickDrink({ shots, drinkIds, now: at("2026-03-12T09:15:00Z"), timeZone: TZ })).toBe("latte");
    // 09:16 is 91 minutes after 07:45; the most recent drink wins instead.
    expect(pickDrink({ shots, drinkIds, now: at("2026-03-12T09:16:00Z"), timeZone: TZ })).toBe("espresso");
  });

  it("matches across midnight", () => {
    const late = [{ drinkTypeId: "flat-white", at: at("2026-03-10T23:30:00Z") }, ...shots];
    expect(pickDrink({ shots: late, drinkIds, now: at("2026-03-12T00:30:00Z"), timeZone: TZ })).toBe("flat-white");
  });

  it("looks back 14 days only", () => {
    const old = [{ drinkTypeId: "flat-white", at: at("2026-02-20T12:00:00Z") }, { drinkTypeId: "latte", at: at("2026-03-11T07:00:00Z") }];
    expect(pickDrink({ shots: old, drinkIds, now: at("2026-03-12T12:00:00Z"), timeZone: TZ })).toBe("latte");
  });

  it("uses the wall clock across a daylight-saving change", () => {
    // 08:00 GMT the day before the clocks go forward; 08:00 BST is 07:00Z after.
    const before = [{ drinkTypeId: "latte", at: at("2026-03-28T08:00:00Z") }, { drinkTypeId: "espresso", at: at("2026-03-28T13:00:00Z") }];
    expect(pickDrink({ shots: before, drinkIds, now: at("2026-03-29T07:00:00Z"), timeZone: TZ })).toBe("latte");
    expect(pickDrink({ shots: before, drinkIds, now: at("2026-03-29T12:00:00Z"), timeZone: TZ })).toBe("espresso");
  });

  it("falls back to the most recent drink, then the first on the list", () => {
    expect(pickDrink({ shots, drinkIds, now: at("2026-03-12T20:00:00Z"), timeZone: TZ })).toBe("espresso");
    expect(pickDrink({ shots: [], drinkIds, now: at("2026-03-12T20:00:00Z"), timeZone: TZ })).toBe("espresso");
    expect(pickDrink({ shots: [], drinkIds: [], now: at("2026-03-12T20:00:00Z"), timeZone: TZ })).toBeNull();
  });

  it("ignores hidden drinks", () => {
    expect(pickDrink({ shots, drinkIds: ["espresso", "flat-white"], now: at("2026-03-12T08:30:00Z"), timeZone: TZ })).toBe("espresso");
  });
});

describe("pickCoffee (DQ-03, STORY-02-02-01 AC 4 to AC 6)", () => {
  const p = (id: string, beanId: string, group: CoffeePortion["group"]): CoffeePortion => ({ id, beanId, group });
  const none = () => false;

  it("prefers the earliest-opened open portion with a recipe here", () => {
    const portions = [p("a1", "a", "open"), p("b1", "b", "open"), p("c1", "c", "unopened")];
    expect(pickCoffee({ portions, lastBeanId: null, hasRecipe: (b) => b === "b" })).toEqual({ kind: "coffee", beanId: "b", portionId: "b1" });
  });

  it("else the earliest-opened open portion, then the newest unopened, then frozen", () => {
    expect(pickCoffee({ portions: [p("a1", "a", "open"), p("c1", "c", "unopened")], lastBeanId: null, hasRecipe: none })).toMatchObject({ beanId: "a" });
    expect(pickCoffee({ portions: [p("c1", "c", "unopened"), p("f1", "f", "frozen")], lastBeanId: null, hasRecipe: none })).toMatchObject({ beanId: "c" });
    expect(pickCoffee({ portions: [p("f1", "f", "frozen")], lastBeanId: null, hasRecipe: () => true })).toEqual({ kind: "coffee", beanId: "f", portionId: "f1" });
    expect(pickCoffee({ portions: [], lastBeanId: null, hasRecipe: none })).toEqual({ kind: "none" });
  });

  it("never counts an opened-then-frozen portion as open (AC 5)", () => {
    // Bean a's only opened portion is in the freezer: it's in the frozen group.
    const portions = [p("c1", "c", "unopened"), p("a1", "a", "frozen")];
    expect(pickCoffee({ portions, lastBeanId: null, hasRecipe: (b) => b === "a" })).toMatchObject({ beanId: "c" });
  });

  it("stays on the last pull's coffee while it has a portion left, using one that isn't frozen", () => {
    const portions = [p("a1", "a", "open"), p("b1", "b", "unopened"), p("b2", "b", "frozen")];
    expect(pickCoffee({ portions, lastBeanId: "b", hasRecipe: (x) => x === "a" })).toEqual({ kind: "coffee", beanId: "b", portionId: "b1" });
    expect(pickCoffee({ portions: [p("b2", "b", "frozen")], lastBeanId: "b", hasRecipe: none })).toEqual({ kind: "coffee", beanId: "b", portionId: "b2" });
  });

  it("says the coffee is finished when the last pull's coffee has nothing left (AC 6)", () => {
    expect(pickCoffee({ portions: [p("a1", "a", "open")], lastBeanId: "z", hasRecipe: none })).toEqual({ kind: "finished", beanId: "z" });
  });
});

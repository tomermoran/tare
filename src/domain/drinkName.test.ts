import { describe, expect, it } from "vitest";
import messages from "@/i18n/messages/en.json";
import { drinkLabel, type DrinkKey } from "./drinkName";
import { STARTER_DRINKS } from "./starterDrinks";

/** A translator over a messages file, like next-intl's root `t`. */
function translator(m: { drinks: Record<string, string> }) {
  return (key: DrinkKey) => {
    const value = m.drinks[key.slice("drinks.".length)];
    if (value === undefined) throw new Error(`Missing message ${key}`);
    return value;
  };
}

const en = translator(messages);
// A test-only second language: every name visibly transformed (AC 2).
const pseudo = translator({
  drinks: Object.fromEntries(
    Object.entries(messages.drinks).map(([k, v]) => [k, `⟦${v.toUpperCase()}⟧`]),
  ),
});

const starter = STARTER_DRINKS.map((d) => ({ name: null, nameKey: d.nameKey }));

describe("drinkLabel", () => {
  it("names the nine starter drinks in order (AC 1)", () => {
    expect(starter.map((d) => drinkLabel(d, en))).toEqual([
      "Espresso",
      "Ristretto",
      "Lungo",
      "Americano",
      "Cortado",
      "Flat white",
      "Cappuccino",
      "Latte",
      "Macchiato",
    ]);
  });

  it("follows the language, from the same rows (AC 2)", () => {
    const inPseudo = starter.map((d) => drinkLabel(d, pseudo));
    expect(inPseudo[5]).toBe("⟦FLAT WHITE⟧");
    // Same rows, so switching back changes nothing else: nothing lost or duplicated.
    expect(new Set(inPseudo).size).toBe(9);
    expect(starter.map((d) => drinkLabel(d, en))).toHaveLength(9);
  });

  it("lets a stored name win over the key", () => {
    expect(drinkLabel({ name: "Morning flat white", nameKey: "drinks.flatWhite" }, en)).toBe(
      "Morning flat white",
    );
    expect(drinkLabel({ name: "Morning flat white", nameKey: "drinks.flatWhite" }, pseudo)).toBe(
      "Morning flat white",
    );
  });

  it("names a custom drink, which has no key", () => {
    expect(drinkLabel({ name: "Piccolo", nameKey: null }, en)).toBe("Piccolo");
  });

  it("ignores a blank name", () => {
    expect(drinkLabel({ name: "  ", nameKey: "drinks.latte" }, en)).toBe("Latte");
  });

  it("never shows a raw key it doesn't know", () => {
    expect(drinkLabel({ name: null, nameKey: "home.pull" }, en)).toBe("");
  });

  it("has a message for every starter drink key", () => {
    for (const d of STARTER_DRINKS) expect(() => en(d.nameKey)).not.toThrow();
  });
});

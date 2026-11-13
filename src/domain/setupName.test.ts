import { describe, expect, it } from "vitest";
import { setupLabel } from "./setupName";

const list = (items: string[]) => new Intl.ListFormat("en", { type: "conjunction" }).format(items);
const part = (id: string, kind: "machine" | "grinder" | "basket", model: string, nickname: string | null = null) => ({
  id,
  kind,
  model,
  nickname,
});
const machine = part("m", "machine", "Model One");
const grinder = part("g", "grinder", "Grinder Zero", "The grinder");
const double = part("b1", "basket", "Double Basket");
const single = part("b2", "basket", "Single Basket");

describe("setupLabel", () => {
  it("is the name when there is one", () => {
    const s = { id: "s", name: " Weekday ", parts: [machine, grinder, double] };
    expect(setupLabel(s, [s], list)).toBe("Weekday");
  });

  it("is the machine and grinder by nickname or model otherwise", () => {
    const s = { id: "s", name: null, parts: [double, grinder, machine] };
    expect(setupLabel(s, [s], list)).toBe("Model One and The grinder");
  });

  it("adds the basket when another setup shares machine and grinder (AC 6)", () => {
    const a = { id: "a", name: null, parts: [machine, grinder, double] };
    const b = { id: "b", name: "Named", parts: [machine, grinder, single] };
    expect(setupLabel(a, [a, b], list)).toBe("Model One, The grinder, and Double Basket");
    const c = { id: "c", name: null, parts: [machine, grinder, single] };
    expect(setupLabel(a, [a, c], list)).not.toBe(setupLabel(c, [a, c], list));
  });

  it("leaves the basket out when the other setup has a different grinder", () => {
    const a = { id: "a", name: null, parts: [machine, grinder, double] };
    const b = { id: "b", name: null, parts: [machine, part("g2", "grinder", "Other"), single] };
    expect(setupLabel(a, [a, b], list)).toBe("Model One and The grinder");
  });
});

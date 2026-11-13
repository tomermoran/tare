import { describe, expect, it } from "vitest";
import messages from "@/i18n/messages/en.json";
import { milkLabel, type MilkKey } from "./milkName";

const t = (key: MilkKey) => messages.milks[key.split(".")[1] as keyof typeof messages.milks];

describe("milkLabel", () => {
  it("translates starter milks, prefers a stored name, and never shows a raw key", () => {
    expect(milkLabel({ name: null, nameKey: "milks.oat" }, t)).toBe("Oat");
    expect(milkLabel({ name: "Oat (barista)", nameKey: "milks.oat" }, t)).toBe("Oat (barista)");
    expect(milkLabel({ name: null, nameKey: "something.else" }, t)).toBe("");
  });
});

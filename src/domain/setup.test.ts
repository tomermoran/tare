import { describe, expect, it } from "vitest";
import { matchSetup, validateParts } from "./setup";

const m = { id: "m", kind: "machine" as const };
const g = { id: "g", kind: "grinder" as const };
const b = { id: "b", kind: "basket" as const };

describe("validateParts", () => {
  it("accepts one of each kind, in any order", () => {
    const result = validateParts([b, m, g]);
    expect(result).toEqual({ ok: true, key: "b,g,m", ids: ["b", "m", "g"] });
  });

  it.each([
    ["the machine", [g, b], ["machine"]],
    ["the grinder", [m, b], ["grinder"]],
    ["the basket", [m, g], ["basket"]],
    ["everything", [], ["machine", "grinder", "basket"]],
  ])("names %s when it's missing (AC 5)", (_label, parts, missing) => {
    expect(validateParts(parts)).toEqual({ ok: false, missing, extra: [] });
  });

  it("refuses two of one kind", () => {
    expect(validateParts([m, g, b, { id: "g2", kind: "grinder" }])).toEqual({
      ok: false,
      missing: [],
      extra: ["grinder"],
    });
  });

  it("counts the same part once", () => {
    expect(validateParts([m, g, b, g]).ok).toBe(true);
  });
});

describe("matchSetup", () => {
  const setups = [{ id: "s1", key: "b,g,m" }];
  it("finds the setup with the same parts in any order", () => {
    expect(matchSetup(["m", "b", "g"], setups)?.id).toBe("s1");
  });
  it("finds nothing for a new combination", () => {
    expect(matchSetup(["m", "b", "g2"], setups)).toBeNull();
  });
});

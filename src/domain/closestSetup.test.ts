import { describe, expect, it } from "vitest";
import { closestSetup, sharedParts } from "./closestSetup";

const setup = (id: string, ...partIds: string[]) => ({ id, partIds });
const current = setup("now", "machine", "grinder", "basket");
const all = () => true;
const none = new Map<string, Date>();

describe("closestSetup", () => {
  it("counts shared parts", () => {
    expect(sharedParts(current, setup("a", "machine", "grinder", "other"))).toBe(2);
    expect(sharedParts(current, setup("b", "x", "y", "z"))).toBe(0);
  });

  it("picks the setup with a recipe sharing the most parts", () => {
    const others = [setup("one", "machine", "x", "y"), setup("two", "machine", "grinder", "z"), setup("zero", "x", "y", "z")];
    expect(closestSetup(current, others, all, none)).toEqual({ id: "two", shared: 2 });
  });

  it("only considers setups with a recipe", () => {
    const others = [setup("two", "machine", "grinder", "z"), setup("zero", "x", "y", "z")];
    expect(closestSetup(current, others, (id) => id === "zero", none)).toEqual({ id: "zero", shared: 0 });
  });

  it("breaks a tie by the most recently used, then by ID", () => {
    const others = [setup("a", "machine", "x", "y"), setup("b", "grinder", "x", "y")];
    const used = new Map([["b", new Date(2026, 0, 5)], ["a", new Date(2026, 0, 2)]]);
    expect(closestSetup(current, others, all, used)?.id).toBe("b");
    expect(closestSetup(current, others, all, none)?.id).toBe("a");
  });

  it("is none when no other setup has a recipe, and never the current one", () => {
    expect(closestSetup(current, [setup("a", "machine")], () => false, none)).toBeNull();
    expect(closestSetup(current, [current], all, none)).toBeNull();
  });
});

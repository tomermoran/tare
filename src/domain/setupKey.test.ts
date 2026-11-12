import { describe, expect, it } from "vitest";
import { partsKey } from "./setupKey";

describe("partsKey", () => {
  it("gives the same key for the same parts in any order", () => {
    const key = partsKey(["machine-1", "grinder-1", "basket-1"]);
    expect(partsKey(["basket-1", "machine-1", "grinder-1"])).toBe(key);
    expect(partsKey(["grinder-1", "basket-1", "machine-1"])).toBe(key);
  });

  it("gives a different key when any part changes", () => {
    expect(partsKey(["machine-1", "grinder-1", "basket-1"])).not.toBe(
      partsKey(["machine-1", "grinder-1", "basket-2"]),
    );
  });

  it("ignores a part listed twice", () => {
    expect(partsKey(["a", "b", "a"])).toBe(partsKey(["a", "b"]));
  });
});

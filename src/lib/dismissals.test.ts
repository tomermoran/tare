import { afterEach, describe, expect, it, vi } from "vitest";
import { dismissSuggestion, isSuggestionDismissed } from "./dismissals";

function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, v),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("dismissals", () => {
  it("lasts for that shot's suggestion only, so the next shot's can show (AC 4, AC 5)", () => {
    vi.stubGlobal("localStorage", fakeStorage());
    dismissSuggestion("shot-1");
    expect(isSuggestionDismissed("shot-1")).toBe(true);
    expect(isSuggestionDismissed("shot-2")).toBe(false);
  });

  it("falls back to session storage, then memory, when storage is unavailable", () => {
    const blocked = { ...fakeStorage(), setItem: () => { throw new Error("blocked"); } };
    vi.stubGlobal("localStorage", blocked);
    vi.stubGlobal("sessionStorage", fakeStorage());
    dismissSuggestion("shot-3");
    expect(isSuggestionDismissed("shot-3")).toBe(true);
    vi.stubGlobal("sessionStorage", blocked);
    dismissSuggestion("shot-4");
    expect(isSuggestionDismissed("shot-4")).toBe(true);
  });
});

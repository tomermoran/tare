import { describe, expect, it } from "vitest";
import { NO_PREP, prepAfterSetupChange, prepStart } from "./prep";

describe("prepStart (STORY-01-03-06)", () => {
  it("starts from the recipe in recipe-based modes (AC 2)", () => {
    expect(prepStart({ recipe: { wdt: true, puckScreen: false }, lastShotOnSetup: { wdt: false, puckScreen: true } })).toEqual({ wdt: true, puckScreen: false });
  });

  it("else from the last shot on this setup, else both off (AC 3)", () => {
    expect(prepStart({ lastShotOnSetup: { wdt: false, puckScreen: true } })).toEqual({ wdt: false, puckScreen: true });
    expect(prepStart({})).toEqual(NO_PREP);
    expect(prepStart({ recipe: null, lastShotOnSetup: null })).toEqual(NO_PREP);
  });
});

describe("prepAfterSetupChange (AC 4)", () => {
  const next = { wdt: true, puckScreen: true };
  it("lets untouched ticks follow the new setup", () => {
    expect(prepAfterSetupChange(NO_PREP, new Set(), next)).toEqual(next);
  });

  it("keeps a tick the user already changed", () => {
    expect(prepAfterSetupChange({ wdt: false, puckScreen: false }, new Set(["wdt"]), next)).toEqual({ wdt: false, puckScreen: true });
    expect(prepAfterSetupChange({ wdt: true, puckScreen: false }, new Set(["wdt", "puckScreen"]), next)).toEqual({ wdt: true, puckScreen: false });
  });
});

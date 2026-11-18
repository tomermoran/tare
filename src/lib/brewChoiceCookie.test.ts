import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BREW_CHOICE_COOKIE, decodeBrewChoice } from "@/domain/brewChoice";
import { choosePersona, clearBrewChoice, saveBrewChoice, touchBrewChoice } from "./brewChoiceCookie";

/*
 * Who Brew is for holds across pulls and lapses after 30 minutes away
 * (TASK-05-01-03-FE2, STORY-05-01-03 AC 5, AC 6), with a controllable clock.
 */

const jar = new Map<string, string>();
beforeEach(() => {
  jar.clear();
  vi.stubGlobal("document", {
    get cookie() {
      return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
    },
    set cookie(raw: string) {
      const [pair, ...attrs] = raw.split("; ");
      const [k, v] = [pair.slice(0, pair.indexOf("=")), pair.slice(pair.indexOf("=") + 1)];
      if (attrs.includes("max-age=0")) jar.delete(k);
      else jar.set(k, v);
    },
  });
});
afterEach(() => vi.unstubAllGlobals());

const T = 1_800_000_000_000;
const MIN = 60_000;
const stored = () => decodeBrewChoice(jar.get(BREW_CHOICE_COOKIE));

describe("the persona choice", () => {
  it("drops a drink and coffee picked for someone else", () => {
    saveBrewChoice({ drinkId: "d", beanId: "b" }, T);
    choosePersona("p", T);
    expect(stored()).toMatchObject({ personaId: "p", drinkId: undefined, beanId: undefined });
  });

  it("keeps the person when a drink is picked", () => {
    choosePersona("p", T);
    saveBrewChoice({ drinkId: "d" }, T + MIN);
    expect(stored()).toMatchObject({ personaId: "p", drinkId: "d" });
  });

  it("holds after a pull, which clears only the drink and coffee (AC 6)", () => {
    choosePersona("p", T);
    saveBrewChoice({ drinkId: "d" }, T);
    clearBrewChoice(T + MIN);
    expect(stored()).toMatchObject({ personaId: "p", drinkId: undefined });
  });

  it("holds while Brew is on screen, and resets after 30 minutes away", () => {
    choosePersona("p", T);
    expect(touchBrewChoice(T + 29 * MIN)).toBe(true);
    expect(touchBrewChoice(T + 58 * MIN)).toBe(true);
    expect(stored()?.personaId).toBe("p");
    expect(touchBrewChoice(T + 89 * MIN)).toBe(false);
    expect(stored()).toBeNull();
  });
});

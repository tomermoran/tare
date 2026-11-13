import { describe, expect, it } from "vitest";
import messages from "@/i18n/messages/en.json";
import { tastePhraseKeys } from "./tastePhrase";

const text = (key: string) => key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], messages);

describe("tastePhraseKeys", () => {
  it("phrases answered questions and skips the rest", () => {
    const keys = tastePhraseKeys({ balance: -1, strength: null, body: 2, sweetness: 0 });
    expect(keys.map(text)).toEqual(["A bit sour", "Much too heavy", "Sweet enough"]);
  });

  it("ignores values outside each question's scale", () => {
    expect(tastePhraseKeys({ balance: 3, strength: 0.5, body: null, sweetness: 1 })).toEqual([]);
  });

  it("has a message for every step it can return", () => {
    for (const v of [-2, -1, 0, 1, 2]) {
      for (const key of tastePhraseKeys({ balance: v, strength: v, body: v, sweetness: v })) {
        expect(typeof text(key)).toBe("string");
      }
    }
  });
});

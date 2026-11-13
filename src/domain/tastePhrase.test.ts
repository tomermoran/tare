import { describe, expect, it } from "vitest";
import messages from "@/i18n/messages/en.json";
import { tastePhraseKeys } from "./tastePhrase";

const text = (key: string) => key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], messages);

describe("tastePhraseKeys", () => {
  it("phrases answered questions and skips the rest", () => {
    const keys = tastePhraseKeys({ balance: -1, strength: null, body: 2, sweetness: 0 });
    expect(keys.map(text)).toEqual(["A bit sour", "Much too heavy", "Sweet enough"]);
  });

  it("words a milk drink's strength for milk (STORY-01-05-02 AC 2)", () => {
    expect(tastePhraseKeys({ balance: null, strength: -2, body: null, sweetness: null }, true).map(text)).toEqual(["Lost in the milk"]);
    expect(tastePhraseKeys({ balance: 0, strength: 1, body: null, sweetness: null }, true).map(text)).toEqual(["Balanced", "A bit overpowering"]);
  });

  it("ignores values outside each question's scale", () => {
    expect(tastePhraseKeys({ balance: 3, strength: 0.5, body: null, sweetness: 1 })).toEqual([]);
  });

  it("has a message for every step it can return", () => {
    for (const v of [-2, -1, 0, 1, 2]) {
      for (const key of [
        ...tastePhraseKeys({ balance: v, strength: v, body: v, sweetness: v }),
        ...tastePhraseKeys({ balance: v, strength: v, body: v, sweetness: v }, true),
      ]) {
        expect(typeof text(key)).toBe("string");
      }
    }
  });
});

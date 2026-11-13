import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en.json";
import { cleanPersonaName, personaLabel } from "./personaLabel";

const role = createTranslator({ locale: "en", messages: en })("profile.defaultName");
// Stand-in messages for a second language, to show the label follows the
// messages it's given (AC 2).
const testRole = createTranslator({ locale: "en", messages: { ...en, profile: { ...en.profile, defaultName: "[Me]" } } })(
  "profile.defaultName",
);

describe("personaLabel", () => {
  it("shows the translated role label until named, in each language (AC 1, AC 2)", () => {
    expect(personaLabel({ name: null }, role)).toBe("Me");
    expect(personaLabel({ name: null }, testRole)).toBe("[Me]");
    expect(personaLabel({ name: "  " }, role)).toBe("Me");
  });

  it("shows a chosen name the same in every language (AC 3)", () => {
    expect(personaLabel({ name: "Sam" }, role)).toBe("Sam");
    expect(personaLabel({ name: "Sam" }, testRole)).toBe("Sam");
  });
});

describe("cleanPersonaName", () => {
  it("trims, caps and turns empty into no name (AC 4)", () => {
    expect(cleanPersonaName("  Sam ")).toBe("Sam");
    expect(cleanPersonaName("")).toBeNull();
    expect(cleanPersonaName(null)).toBeNull();
    expect(cleanPersonaName("x".repeat(80))).toHaveLength(40);
  });
});

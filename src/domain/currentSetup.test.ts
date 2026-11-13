import { describe, expect, it } from "vitest";
import { currentSetupId, decodeSetupChoice, encodeSetupChoice, isOlder } from "./currentSetup";

const t = (iso: string) => new Date(iso);
const A = { id: "a", createdAt: t("2026-01-01T00:00:00Z") };
const B = { id: "b", createdAt: t("2026-02-01T00:00:00Z") };
const setups = [A, B];

describe("currentSetupId", () => {
  it("is the latest shot's setup (AC 1)", () => {
    expect(currentSetupId({ setups, latestShot: { setupId: "a", at: t("2026-03-01T08:00:00Z") }, choice: null })).toBe("a");
  });

  it("is the newest setup with no shot and no choice (AC 2)", () => {
    expect(currentSetupId({ setups, latestShot: null, choice: null })).toBe("b");
    expect(currentSetupId({ setups: [], latestShot: null, choice: null })).toBeNull();
  });

  it("follows a later choice over an earlier shot (AC 3)", () => {
    const latestShot = { setupId: "a", at: t("2026-03-01T08:00:00Z") };
    const choice = { setupId: "b", at: t("2026-03-01T09:00:00Z").getTime() };
    expect(currentSetupId({ setups, latestShot, choice })).toBe("b");
  });

  it("follows a later shot over an earlier choice (AC 1)", () => {
    const choice = { setupId: "b", at: t("2026-03-01T09:00:00Z").getTime() };
    const latestShot = { setupId: "a", at: t("2026-03-01T10:00:00Z") };
    expect(currentSetupId({ setups, latestShot, choice })).toBe("a");
  });

  it("ignores a choice or shot naming a setup that isn't one of these", () => {
    const choice = { setupId: "gone", at: t("2026-03-02T00:00:00Z").getTime() };
    expect(currentSetupId({ setups, latestShot: null, choice })).toBe("b");
    expect(currentSetupId({ setups, latestShot: { setupId: "gone", at: t("2026-03-02T00:00:00Z") }, choice: null })).toBe("b");
  });
});

describe("the cookie value", () => {
  it("round-trips and rejects anything malformed", () => {
    const choice = { setupId: "0b6c-uuid", at: 1_767_225_600_000 };
    expect(decodeSetupChoice(encodeSetupChoice(choice))).toEqual(choice);
    for (const bad of [undefined, "", "abc", ".123", "a.", "a.-5", "a.notanumber"]) {
      expect(decodeSetupChoice(bad)).toBeNull();
    }
  });
});

describe("isOlder", () => {
  const now = t("2026-06-01T00:00:00Z");
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000);

  it("is a setup unused for over 90 days, never the current one (AC 4)", () => {
    expect(isOlder({ id: "a", createdAt: daysAgo(400), lastUsedAt: daysAgo(91) }, "b", now)).toBe(true);
    expect(isOlder({ id: "a", createdAt: daysAgo(400), lastUsedAt: daysAgo(89) }, "b", now)).toBe(false);
    expect(isOlder({ id: "a", createdAt: daysAgo(400), lastUsedAt: daysAgo(200) }, "a", now)).toBe(false);
  });

  it("counts from when it was made if it was never used", () => {
    expect(isOlder({ id: "a", createdAt: daysAgo(10), lastUsedAt: null }, "b", now)).toBe(false);
    expect(isOlder({ id: "a", createdAt: daysAgo(100), lastUsedAt: null }, "b", now)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { bagStatus } from "./bagStatus";
import type { PortionDates } from "./portionState";

const day = (n: number) => new Date(Date.UTC(2026, 0, n));
const p = (dates: Partial<PortionDates> = {}): PortionDates => ({ frozenAt: null, thawedAt: null, openedAt: null, finishedAt: null, ...dates });

describe("bagStatus", () => {
  it.each([
    ["one open portion (AC 1)", [p({ openedAt: day(2) }), p()], "open"],
    ["open and frozen", [p({ openedAt: day(2) }), p({ frozenAt: day(2) })], "open"],
    ["opened then frozen isn't open (AC 1)", [p({ openedAt: day(2), frozenAt: day(3) })], null],
    ["opened, frozen, then thawed", [p({ openedAt: day(2), frozenAt: day(3), thawedAt: day(5) })], "open"],
    ["sealed and thawed isn't open", [p({ frozenAt: day(3), thawedAt: day(5) })], null],
    ["every portion finished (AC 2)", [p({ openedAt: day(2), finishedAt: day(4) }), p({ finishedAt: day(5) })], "finished"],
    ["some finished, the rest unopened (AC 3)", [p({ finishedAt: day(4) }), p()], null],
    ["all unopened (AC 3)", [p(), p()], null],
    ["no portions", [], null],
  ] as const)("%s", (_label, portions, status) => {
    expect(bagStatus(portions)).toBe(status);
  });
});

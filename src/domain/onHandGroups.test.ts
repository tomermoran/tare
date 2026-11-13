import { describe, expect, it } from "vitest";
import { groupOnHand, pantryGroup, pantryOrder, type PantryItem } from "./onHandGroups";
import type { PortionState } from "./portionState";

const day = (n: number) => new Date(Date.UTC(2026, 0, n));
const p = (state: PortionState, openSince: Date | null = null) => ({ state, openSince });
const bag = (id: string, added: number, ...portions: ReturnType<typeof p>[]) => ({ id, createdAt: day(added), portions });
const ids = (groups: { group: string; bags: { id: string }[] }[]) => groups.map((g) => [g.group, g.bags.map((b) => b.id)]);

describe("pantryGroup", () => {
  it.each([
    [p("counter", day(2)), "open"],
    [p("thawed", day(2)), "open"],
    [p("thawed"), "unopened"],
    [p("unopened"), "unopened"],
    [p("frozen"), "frozen"],
    [p("finished"), null],
  ] as const)("%o is %s", (portion, group) => {
    expect(pantryGroup(portion)).toBe(group);
  });
});

describe("pantryOrder", () => {
  const item = (group: PantryItem["group"], added: number, opened?: number): PantryItem => ({
    group,
    addedAt: day(added),
    openSince: opened ? day(opened) : null,
  });

  it("puts open first by earliest opening, then unopened and frozen newest bag first", () => {
    const items = [item("frozen", 1), item("unopened", 2), item("open", 9, 5), item("unopened", 4), item("open", 1, 8), item("frozen", 6)];
    expect(items.sort(pantryOrder)).toEqual([
      item("open", 9, 5),
      item("open", 1, 8),
      item("unopened", 4),
      item("unopened", 2),
      item("frozen", 6),
      item("frozen", 1),
    ]);
  });

  it("breaks a tie in opening by the newer bag", () => {
    expect([item("open", 1, 5), item("open", 3, 5)].sort(pantryOrder)).toEqual([item("open", 3, 5), item("open", 1, 5)]);
  });
});

describe("groupOnHand", () => {
  it("puts each bag in its first qualifying group (AC 1 to AC 3)", () => {
    const groups = groupOnHand([
      bag("sealed", 5, p("unopened")),
      bag("late", 1, p("counter", day(9))),
      bag("ice", 6, p("frozen")),
      bag("early", 2, p("counter", day(3))),
    ]);
    expect(ids(groups)).toEqual([
      ["open", ["early", "late"]],
      ["unopened", ["sealed"]],
      ["frozen", ["ice"]],
    ]);
  });

  it("shows a half open, half frozen bag once, under open, with both portions (AC 4)", () => {
    const half = bag("half", 1, p("counter", day(2)), p("frozen"));
    const groups = groupOnHand([half]);
    expect(groups).toEqual([{ group: "open", bags: [half] }]);
    expect(groups[0].bags[0].portions).toHaveLength(2);
  });

  it("counts a sealed thawed portion as unopened, and a frozen-and-sealed bag as unopened", () => {
    expect(ids(groupOnHand([bag("thawed", 1, p("thawed"), p("frozen"))]))).toEqual([["unopened", ["thawed"]]]);
  });

  it("leaves out empty groups and finished bags (AC 5)", () => {
    expect(ids(groupOnHand([bag("ice", 1, p("frozen")), bag("done", 2, p("finished"))]))).toEqual([["frozen", ["ice"]]]);
    expect(groupOnHand([])).toEqual([]);
  });
});

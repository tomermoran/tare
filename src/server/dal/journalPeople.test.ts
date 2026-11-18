import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, personas } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getJournalFilterOptions, getShot, listJournal } from "./journal";

/* The persona in the Journal (TASK-05-01-06-BE1, QA1): marker, filter on every page, detail. */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
let guest: string;
const db = () => testContext.db!;
const NOW = new Date("2026-03-30T12:00:00Z");
const ago = (h: number) => new Date(NOW.getTime() - h * 3_600_000);
const shot = async (at: Date, personaId = k.persona.id) => {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), personaId, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at });
  return id;
};

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
  guest = newId();
});
const addGuest = () => db().insert(personas).values({ id: guest, householdId: k.household.id, name: "Guest", isDefault: false });

describe("the persona in the Journal", () => {
  it("marks only shots that aren't the main profile's (AC 1)", async () => {
    await addGuest();
    const mine = await shot(ago(2));
    const theirs = await shot(ago(1), guest);
    const shots = new Map((await listJournal({ now: NOW })).shots.map((s) => [s.id, s.person]));
    expect(shots.get(mine)).toBeNull();
    expect(shots.get(theirs)).toEqual({ name: "Guest" });
  });

  it("filters by person on every page, show older too (AC 2)", async () => {
    await addGuest();
    const theirs = [];
    for (let i = 0; i < 6; i++) {
      await shot(ago(24 * 40 + i));
      theirs.push(await shot(ago(24 * 40 + i + 0.5), guest));
    }
    let page = await listJournal({ now: NOW, filters: { personaId: guest } });
    const seen = [...page.shots];
    while (page.older) {
      page = await listJournal({ before: page.older, limit: 2, now: NOW, filters: { personaId: guest } });
      seen.push(...page.shots);
    }
    expect(seen.map((s) => s.id).sort()).toEqual([...theirs].sort());
  });

  it("offers the people only as they are, main first (AC 2, AC 5)", async () => {
    expect((await getJournalFilterOptions()).people).toHaveLength(1);
    await addGuest();
    expect((await getJournalFilterOptions()).people).toEqual([
      { id: k.persona.id, name: null, main: true },
      { id: guest, name: "Guest", main: false },
    ]);
  });

  it("says whose taste a shot records and who logged it (AC 3)", async () => {
    await addGuest();
    const id = await shot(ago(1), guest);
    expect((await getShot(id)).people).toEqual({ forPerson: { name: "Guest" }, loggedBy: { name: null } });
  });

  it("says nothing extra with only the main profile (AC 5)", async () => {
    const id = await shot(ago(1));
    expect((await getShot(id)).people).toBeNull();
    expect((await listJournal({ now: NOW })).shots[0].person).toBeNull();
  });
});

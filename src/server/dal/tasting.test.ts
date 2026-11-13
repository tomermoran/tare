import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions } from "@/db/schema";
import { saveTastingAction } from "@/server/actions/shots";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getShot } from "./journal";
import { NotFoundError } from "./scope";
import { saveTasting } from "./tasting";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "Europe/London" }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function shot(entryMode: "measured" | "one-tap" = "measured") {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode, createdAt: new Date() });
  return id;
}
const row = async (id: string) => (await db().select().from(extractions).where(eq(extractions.id, id)))[0];

describe("saveTasting (TASK-01-05-01-BE1)", () => {
  it("saves the rating, answers and tags, and the shot read returns them (STORY-01-05-01 AC 5, 01-05-03 AC 4)", async () => {
    const id = await shot();
    await saveTasting(id, { rating: 4, balance: -1, strength: 0, body: 0, sweetness: -2, tags: ["dryFinish", "channelling"] });
    const read = await getShot(id);
    expect(read.rating).toBe(4);
    expect(read.taste).toEqual({ balance: -1, strength: 0, body: 0, sweetness: -2 });
    expect(read.tags).toEqual(["dryFinish", "channelling"]);
  });

  it("leaves an untouched question unanswered, not just right (STORY-01-05-02 AC 3)", async () => {
    const id = await shot();
    await saveTasting(id, { balance: 0 });
    expect(await row(id)).toMatchObject({ tasteBalance: 0, tasteStrength: null, tasteBody: null, tasteSweetness: null, userRating: null });
    expect((await row(id)).tasteTags).toBeNull();
  });

  it("writes nothing when nothing was chosen", async () => {
    const id = await shot();
    const before = await row(id);
    await saveTasting(id, {});
    expect(await row(id)).toEqual(before);
  });

  it("only changes the given fields, and null clears one", async () => {
    const id = await shot();
    await saveTasting(id, { rating: 5, body: 1 });
    await saveTasting(id, { rating: null });
    expect(await row(id)).toMatchObject({ userRating: null, tasteBody: 1 });
  });

  it("never rates a one-tap shot (DQ-23), and rejects values out of range", async () => {
    const tap = await shot("one-tap");
    expect(await saveTastingAction(tap, { rating: 3 })).toEqual({ ok: false, error: "saveFailed" });
    const id = await shot();
    expect(await saveTastingAction(id, { balance: 3 })).toEqual({ ok: false, error: "saveFailed" });
    expect(await saveTastingAction(id, { sweetness: 1 })).toEqual({ ok: false, error: "saveFailed" });
    expect(await saveTastingAction(id, { tags: ["ranFast" as never] })).toEqual({ ok: false, error: "saveFailed" });
    expect(await row(id)).toMatchObject({ tasteBalance: null, tasteSweetness: null, tasteTags: null });
    expect(await saveTastingAction(id, { rating: 2 })).toEqual({ ok: true, data: undefined });
  });

  it("refuses another household's shot", async () => {
    const id = await shot();
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(saveTasting(id, { rating: 4 })).rejects.toBeInstanceOf(NotFoundError);
    expect(await saveTastingAction(id, { rating: 4 })).toEqual({ ok: false, error: "notFound" });
    expect((await row(id)).userRating).toBeNull();
  });
});

import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions } from "@/db/schema";
import { InvalidTastingError } from "@/domain/tasting";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getOffContext, NotOneTapError, saveOffAnswers, setReaction } from "./reaction";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function shot(entryMode: "one-tap" | "measured" = "one-tap", over: Partial<typeof extractions.$inferInsert> = {}) {
  const id = newId();
  await db().insert(extractions).values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode, createdAt: new Date(), ...over });
  return id;
}
const row = async (id: string) => (await db().select().from(extractions).where(eq(extractions.id, id)))[0];

describe("setReaction", () => {
  it("records good or off, and null clears it (AC 1, AC 3, AC 4)", async () => {
    const id = await shot();
    await setReaction(id, "good");
    expect((await row(id)).reaction).toBe("good");
    await setReaction(id, "off");
    expect((await row(id)).reaction).toBe("off");
    await setReaction(id, null);
    expect((await row(id)).reaction).toBeNull();
  });

  it("rejects a measured shot and another household's shot", async () => {
    await expect(setReaction(await shot("measured"), "good")).rejects.toThrow(NotOneTapError);
    const id = await shot();
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(setReaction(id, "off")).rejects.toThrow(NotFoundError);
  });

  it("rejects anything but good, off or null", async () => {
    await expect(setReaction(await shot(), "great" as never)).rejects.toThrow(NotFoundError);
  });
});

describe("saveOffAnswers", () => {
  it("stores the answers and tags on the one-tap shot (STORY-02-03-04 AC 2)", async () => {
    const id = await shot("one-tap", { reaction: "off" });
    await saveOffAnswers(id, { balance: -2, tags: ["channelling"] });
    expect(await row(id)).toMatchObject({ tasteBalance: -2, tasteTags: ["channelling"], userRating: null, entryMode: "one-tap" });
  });

  it("never takes a rating", async () => {
    const id = await shot("one-tap", { reaction: "off" });
    await expect(saveOffAnswers(id, { rating: 3 } as never)).rejects.toThrow(InvalidTastingError);
  });

  it("only on a one-tap shot marked off", async () => {
    await expect(saveOffAnswers(await shot("one-tap", { reaction: "good" }), { balance: 1 })).rejects.toThrow(NotOneTapError);
    await expect(saveOffAnswers(await shot("measured"), { balance: 1 })).rejects.toThrow(NotOneTapError);
  });

  it("doesn't touch another household's shot", async () => {
    const id = await shot("one-tap", { reaction: "off" });
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(saveOffAnswers(id, { balance: 1 })).rejects.toThrow(NotFoundError);
  });
});

describe("getOffContext", () => {
  it("opens with the shot's answers so far and the suggestion context", async () => {
    const id = await shot("one-tap", { reaction: "off", tasteBody: -1, tasteTags: ["flat"] });
    const c = await getOffContext(id);
    expect(c.answers).toEqual({ balance: null, strength: null, body: -1, sweetness: null });
    expect(c.tags).toEqual(["flat"]);
    expect(c.suggest.shot).toMatchObject({ grind: 15, dose: 18 });
  });
});

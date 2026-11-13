import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { personas } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { NoSessionError } from "@/server/auth/session-shared";
import { renamePersonaAction } from "@/server/actions/profile";
import { getProfile, renamePersona } from "./profile";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

let me: Awaited<ReturnType<typeof makeHousehold>>;
const db = () => testContext.db!;

beforeEach(async () => {
  testContext.db = await createTestDb();
  me = await makeHousehold(testContext.db);
  signInAs(me.user.firebaseUid);
});

describe("profile", () => {
  it("starts with no name, so the role label shows (AC 1)", async () => {
    await expect(getProfile()).resolves.toEqual({ personaId: me.persona.id, name: null });
  });

  it("saves a trimmed name, and an empty one clears it (AC 3, AC 4)", async () => {
    await expect(renamePersona("  Sam  ")).resolves.toMatchObject({ name: "Sam" });
    await expect(getProfile()).resolves.toMatchObject({ name: "Sam" });
    await expect(renamePersona("   ")).resolves.toMatchObject({ name: null });
    await expect(getProfile()).resolves.toMatchObject({ name: null });
  });

  it("only ever renames the signed-in household's default persona", async () => {
    const other = await makeHousehold(db());
    await renamePersona("Mine");
    const [theirs] = await db().select().from(personas).where(eq(personas.id, other.persona.id));
    expect(theirs.name).toBeNull();
  });

  it("refuses without a session", async () => {
    signInAs(null);
    await expect(renamePersona("Sam")).rejects.toBeInstanceOf(NoSessionError);
  });
});

describe("renamePersonaAction", () => {
  const form = (name: string) => {
    const f = new FormData();
    f.set("name", name);
    return f;
  };
  const idle = { name: "", status: "idle" as const };

  it("returns the stored name on success", async () => {
    await expect(renamePersonaAction(idle, form("  Sam "))).resolves.toEqual({ name: "Sam", status: "saved" });
  });

  it("keeps the typed name when saving fails (AC 6)", async () => {
    signInAs(null);
    await expect(renamePersonaAction(idle, form("Sam "))).resolves.toEqual({ name: "Sam ", status: "failed", error: "noSession" });
  });
});

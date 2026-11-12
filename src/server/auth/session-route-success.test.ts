import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { households, users } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { testContext } from "@/test/mocks/context";

vi.mock("@/db/client", () => import("@/test/mocks/db"));

// Firebase itself is out of scope here: a verified token for a fixed uid.
vi.mock("@/server/auth/firebase-admin", () => ({
  adminAuth: () => ({
    verifyIdToken: async () => ({ uid: "test-uid-route" }),
    createSessionCookie: async () => "test-session-cookie",
  }),
}));

beforeEach(async () => {
  testContext.db = await createTestDb();
});

async function post() {
  const { POST } = await import("@/app/api/session/route");
  return POST(
    new Request("http://localhost/api/session", {
      method: "POST",
      body: JSON.stringify({ idToken: "verified-by-the-mock" }),
    }),
  );
}

describe("POST /api/session with a valid token", () => {
  it("creates the account and sets an httpOnly session cookie (AC 1, AC 2)", async () => {
    const res = await post();
    expect(res.status).toBe(204);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/^tare_session=test-session-cookie;/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=lax/i);

    const db = testContext.db!;
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, "test-uid-route"));
    expect(user).toBeDefined();
    expect(await db.select().from(households)).toHaveLength(1);
  });

  it("finds the same household on a later exchange (AC 5)", async () => {
    await post();
    const res = await post();
    expect(res.status).toBe(204);
    expect(await testContext.db!.select().from(households)).toHaveLength(1);
  });
});

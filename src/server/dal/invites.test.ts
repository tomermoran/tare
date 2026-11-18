import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { invites, personas } from "@/db/schema";
import { INVITE_TTL_MS } from "@/domain/invites";
import { inviteToken, verifyInviteToken } from "@/server/auth/inviteToken";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { createInvite, getPendingInvite, ProfileClaimedError, withdrawInvite } from "./invites";
import { addPerson, listPeople, removePerson } from "./people";
import { NotFoundError } from "./scope";

/*
 * Inviting and pending invites (TASK-05-02-01-BE2, 05-02-06-BE1). Names are
 * placeholders; the secret is a test value.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

const ORIGIN = "https://tare.test";
const now = new Date();
let k: Awaited<ReturnType<typeof makeKitchen>>;
let guest: string;
const db = () => testContext.db!;
const tokenOf = (link: string) => link.slice(`${ORIGIN}/join/`.length);

beforeAll(() => {
  process.env.INVITE_SECRET = "test-only-invite-secret-0123456789";
  delete process.env.APP_ORIGIN;
});

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
  guest = (await addPerson("Guest", "Me")).id;
});

describe("createInvite (TASK-05-02-01-BE2)", () => {
  it("makes a link that works once for 7 days, with nothing but the link out (AC 2)", async () => {
    const out = await createInvite(guest, ORIGIN, now);
    expect(Object.keys(out).sort()).toEqual(["expiresAt", "link"]);
    expect(out.link.startsWith(`${ORIGIN}/join/`)).toBe(true);
    expect(out.link).not.toContain(process.env.INVITE_SECRET);
    expect(out.expiresAt.getTime() - now.getTime()).toBe(INVITE_TTL_MS);
    const id = verifyInviteToken(tokenOf(out.link));
    const [row] = await db().select().from(invites).where(eq(invites.id, id!));
    expect(row).toMatchObject({ personaId: guest, householdId: k.household.id, createdByUserId: k.user.id, usedAt: null, withdrawnAt: null });
  });

  it("uses APP_ORIGIN when it is set", async () => {
    process.env.APP_ORIGIN = "https://app.example/";
    try {
      expect((await createInvite(guest, ORIGIN, now)).link.startsWith("https://app.example/join/")).toBe(true);
    } finally {
      delete process.env.APP_ORIGIN;
    }
  });

  it("replaces the profile's earlier link (AC 5)", async () => {
    const first = await createInvite(guest, ORIGIN, now);
    const second = await createInvite(guest, ORIGIN, new Date(now.getTime() + 1000));
    const [old] = await db().select().from(invites).where(eq(invites.id, verifyInviteToken(tokenOf(first.link))!));
    expect(old.withdrawnAt).not.toBeNull();
    expect((await getPendingInvite(guest, ORIGIN, new Date(now.getTime() + 2000)))?.link).toBe(second.link);
  });

  it("refuses a claimed profile and another household's (AC 4)", async () => {
    await expect(createInvite(k.persona.id, ORIGIN, now)).rejects.toBeInstanceOf(ProfileClaimedError);
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(createInvite(guest, ORIGIN, now)).rejects.toBeInstanceOf(NotFoundError);
    await expect(getPendingInvite(guest, ORIGIN, now)).rejects.toBeInstanceOf(NotFoundError);
    await expect(withdrawInvite(guest, now)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("tokens (TD-11)", () => {
  it("rejects a wrong, edited or malformed token", () => {
    const token = inviteToken("some-invite-id");
    expect(verifyInviteToken(token)).toBe("some-invite-id");
    expect(verifyInviteToken(token.slice(0, -1) + (token.endsWith("A") ? "B" : "A"))).toBeNull();
    expect(verifyInviteToken(`other-id.${token.split(".")[1]}`)).toBeNull();
    expect(verifyInviteToken("no-dot")).toBeNull();
    expect(verifyInviteToken(42)).toBeNull();
  });
});

describe("pending invites (TASK-05-02-06-BE1)", () => {
  it("is pending until withdrawn, and the people list says so (AC 1, AC 2, AC 3)", async () => {
    const made = await createInvite(guest, ORIGIN, now);
    expect(await getPendingInvite(guest, ORIGIN, now)).toEqual(made);
    expect((await listPeople()).find((p) => p.id === guest)?.invitePending).toBe(true);
    await withdrawInvite(guest, now);
    expect(await getPendingInvite(guest, ORIGIN, now)).toBeNull();
    expect((await listPeople()).find((p) => p.id === guest)?.invitePending).toBe(false);
  });

  it("is no longer pending once expired or used", async () => {
    await createInvite(guest, ORIGIN, now);
    expect(await getPendingInvite(guest, ORIGIN, new Date(now.getTime() + INVITE_TTL_MS))).toBeNull();
    await db().update(invites).set({ usedAt: now }).where(eq(invites.personaId, guest));
    expect(await getPendingInvite(guest, ORIGIN, now)).toBeNull();
  });

  it("goes with a removed profile", async () => {
    await createInvite(guest, ORIGIN, now);
    await removePerson(guest);
    expect(await db().select().from(invites)).toEqual([]);
    expect(await db().select().from(personas).where(eq(personas.id, guest))).toEqual([]);
  });
});

import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, householdMembers, households, invites, personas, users } from "@/db/schema";
import { INVITE_TTL_MS } from "@/domain/invites";
import { inviteToken } from "@/server/auth/inviteToken";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { createInvite } from "./invites";
import { getInvitePreview } from "./invitePreview";
import { addPerson } from "./people";

/*
 * The invitation preview, signed out (TASK-05-02-05-BE1). Names are
 * placeholders; the secret is a test value.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

const ORIGIN = "https://tare.test";
let k: Awaited<ReturnType<typeof makeKitchen>>;
let guest: string;
let token: string;
const db = () => testContext.db!;
const now = new Date();

beforeAll(() => {
  process.env.INVITE_SECRET = "test-only-invite-secret-0123456789";
});

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
  guest = (await addPerson("Guest", "Me")).id;
  const shot = (drinkTypeId: string, at: Date, personaId = guest) =>
    db().insert(extractions).values({ id: newId(), ...shotValues(k), personaId, drinkTypeId, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at });
  await shot(k.drinks.latte.id, new Date(now.getTime() - 3 * 86_400_000));
  await shot(k.drinks.latte.id, new Date(now.getTime() - 2 * 86_400_000));
  await shot(k.drinks.espresso.id, new Date(now.getTime() - 86_400_000));
  await shot(k.drinks.espresso.id, now, k.persona.id); // another profile's: never shown
  token = (await createInvite(guest, ORIGIN, now)).link.split("/join/")[1];
  signInAs(null);
});

const counts = async () => ({
  users: (await db().select().from(users)).length,
  households: (await db().select().from(households)).length,
  members: (await db().select().from(householdMembers)).length,
});

describe("getInvitePreview (TASK-05-02-05-BE1)", () => {
  it("shows only the invited profile, signed out, and writes nothing (AC 1, AC 2)", async () => {
    const before = await counts();
    const p = await getInvitePreview(token, now);
    expect(p).toEqual({
      kind: "ok",
      name: "Guest",
      shots: 3,
      drinks: [
        { name: null, nameKey: k.drinks.latte.nameKey },
        { name: null, nameKey: k.drinks.espresso.nameKey },
      ],
      lastBrewedAt: new Date(now.getTime() - 86_400_000),
    });
    expect(await counts()).toEqual(before);
  });

  it("reads every unusable link the same, giving no reason (AC 4)", async () => {
    const id = token.split(".")[0];
    const invalid = { kind: "invalid" };
    expect(await getInvitePreview("not-a-token", now)).toEqual(invalid);
    expect(await getInvitePreview(`${id}.wrong`, now)).toEqual(invalid);
    expect(await getInvitePreview(inviteToken("no-such-invite"), now)).toEqual(invalid);
    expect(await getInvitePreview(token, new Date(now.getTime() + INVITE_TTL_MS))).toEqual(invalid);
    await db().update(invites).set({ withdrawnAt: now }).where(eq(invites.id, id));
    expect(await getInvitePreview(token, now)).toEqual(invalid);
    await db().update(invites).set({ withdrawnAt: null, usedAt: now }).where(eq(invites.id, id));
    expect(await getInvitePreview(token, now)).toEqual(invalid);
    await db().update(invites).set({ usedAt: null }).where(eq(invites.id, id));
    await db().update(personas).set({ userId: k.user.id }).where(eq(personas.id, guest));
    expect(await getInvitePreview(token, now)).toEqual(invalid);
  });
});

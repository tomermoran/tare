import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalHardware, catalogUrls, hardwareMakers } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, seedIds, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { searchHardware } from "./catalog";
import { createHardwareEntry, DuplicateEntryError, findByNormalizedUrl, InvalidLinkError, MissingNameError } from "./catalogAdd";
import { assertVisibleCatalog } from "./catalogVisibility";
import { addPart } from "./parts";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

const BREVILLE = seedIds.maker("breville");
const BAMBINO = seedIds.model("breville", "bambino-plus");
const db = () => testContext.db!;
let me: Awaited<ReturnType<typeof makeHousehold>>;
let them: Awaited<ReturnType<typeof makeHousehold>>;

beforeEach(async () => {
  testContext.db = await createTestDb();
  await loadSeed(testContext.db, hardware as HardwareSeed, coffee as CoffeeSeed);
  me = await makeHousehold(testContext.db);
  them = await makeHousehold(testContext.db);
  signInAs(me.user.firebaseUid);
});

const grinder = (over: Partial<Parameters<typeof createHardwareEntry>[0]["model"]> = {}) => ({
  maker: { name: "Example Mills", url: "https://example.com/" },
  model: { name: "Hand Mill 40", kind: "grinder" as const, url: "https://example.com/products/hand-mill-40", ...over },
});

describe("createHardwareEntry", () => {
  it("saves a new maker and model atomically, user-added and unverified (AC 2, AC 3, AC 6)", async () => {
    const { id, kind } = await createHardwareEntry(grinder({ name: "  Hand   Mill 40 " }));
    expect(kind).toBe("grinder");
    const [model] = await db().select().from(canonicalHardware).where(eq(canonicalHardware.id, id));
    expect(model).toMatchObject({ name: "Hand Mill 40", source: "user", status: "unverified", createdByHouseholdId: me.household.id });
    expect(model.capabilities).toEqual({ grind: { type: "unknown", min: null, max: null, step: null, coarser: "unknown" } });
    const [maker] = await db().select().from(hardwareMakers).where(eq(hardwareMakers.id, model.makerId));
    expect(maker).toMatchObject({ name: "Example Mills", source: "user", status: "unverified" });
    const links = await db().select().from(catalogUrls).where(eq(catalogUrls.addedByHouseholdId, me.household.id));
    expect(links.map((l) => l.entityType).sort()).toEqual(["maker", "model"]);
    // Visible to us, marked as ours, and usable as a part.
    const found = await searchHardware(db(), me.household.id, { kind: "grinder", query: "hand mill" });
    expect(found[0]).toMatchObject({ id, addedByYou: true });
    await expect(addPart({ hardwareId: id })).resolves.toMatchObject({ kind: "grinder" });
  });

  it("adds a model to an existing maker", async () => {
    const { id } = await createHardwareEntry({
      maker: { id: BREVILLE },
      model: { name: "Example 58", kind: "machine", url: "https://example.com/machine-58" },
    });
    const [model] = await db().select().from(canonicalHardware).where(eq(canonicalHardware.id, id));
    expect(model.makerId).toBe(BREVILLE);
  });

  it("reuses a known maker typed by name instead of adding it twice", async () => {
    const { id } = await createHardwareEntry({ ...grinder(), maker: { name: "breville", url: "" } });
    const [model] = await db().select().from(canonicalHardware).where(eq(canonicalHardware.id, id));
    expect(model.makerId).toBe(BREVILLE);
  });

  it("saves nothing without a product link (AC 5)", async () => {
    await expect(createHardwareEntry(grinder({ url: "" }))).rejects.toMatchObject({ field: "url" });
    await expect(createHardwareEntry(grinder({ url: "not a link" }))).rejects.toBeInstanceOf(InvalidLinkError);
    await expect(createHardwareEntry({ ...grinder(), maker: { name: "New Maker", url: "" } })).rejects.toMatchObject({
      field: "makerUrl",
    });
    expect(await db().select().from(canonicalHardware).where(eq(canonicalHardware.source, "user"))).toHaveLength(0);
    expect(await db().select().from(hardwareMakers).where(eq(hardwareMakers.source, "user"))).toHaveLength(0);
  });

  it("needs a model name", async () => {
    await expect(createHardwareEntry(grinder({ name: "   " }))).rejects.toBeInstanceOf(MissingNameError);
  });

  it("stores a basket's dose range, or not sure, and nothing else (AC 4)", async () => {
    const basket = (capabilities: unknown, url: string) =>
      createHardwareEntry({ maker: { id: BREVILLE }, model: { name: "18 g Basket", kind: "basket", url, capabilities } });
    const a = await basket({ dose: { min: 17, max: 19 } }, "https://example.com/b1");
    const b = await basket({ dose: null }, "https://example.com/b2");
    const rows = await db().select().from(canonicalHardware).where(eq(canonicalHardware.source, "user"));
    expect(Object.fromEntries(rows.map((r) => [r.id, r.capabilities]))).toEqual({
      [a.id]: { dose: { min: 17, max: 19 } },
      [b.id]: { dose: null },
    });
    await expect(basket({ dose: { min: 17, max: 19 }, grind: {} }, "https://example.com/b3")).rejects.toBeInstanceOf(
      MissingNameError,
    );
  });

  it("won't use another household's private maker", async () => {
    signInAs(them.user.firebaseUid);
    const theirs = await createHardwareEntry(grinder());
    const [row] = await db().select().from(canonicalHardware).where(eq(canonicalHardware.id, theirs.id));
    signInAs(me.user.firebaseUid);
    await expect(
      createHardwareEntry({ maker: { id: row.makerId }, model: { name: "X", kind: "grinder", url: "https://example.com/x" } }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("refuses a duplicate link at save, offering the existing entry (STORY-01-06-04 AC 5)", async () => {
    const error = await createHardwareEntry(grinder({ url: "https://www.breville.com/en-us/product/bes500?utm_source=x" })).catch(
      (e) => e,
    );
    expect(error).toBeInstanceOf(DuplicateEntryError);
    expect(error.match).toMatchObject({ id: BAMBINO, kind: "machine", makerName: "Breville", addedByYou: false });
  });
});

describe("findByNormalizedUrl (STORY-01-06-04)", () => {
  it("matches a regional variant and tracking parameters (AC 1, AC 2)", async () => {
    for (const url of [
      "https://www.sageappliances.com/en-gb/product/bes500",
      "https://sageappliances.com/uk/product/bes500?gclid=abc",
      "http://www.breville.com/en-us/product/bes500",
    ]) {
      await expect(findByNormalizedUrl("hardware", url, me.household.id)).resolves.toMatchObject({ id: BAMBINO });
    }
    await expect(findByNormalizedUrl("hardware", "https://example.com/other", me.household.id)).resolves.toBeNull();
    await expect(findByNormalizedUrl("hardware", "nonsense", me.household.id)).resolves.toBeNull();
  });

  it("reports our own unverified entry, never another household's (AC 3)", async () => {
    signInAs(them.user.firebaseUid);
    await createHardwareEntry(grinder());
    signInAs(me.user.firebaseUid);
    const url = "https://example.com/products/hand-mill-40";
    await expect(findByNormalizedUrl("hardware", url, me.household.id)).resolves.toBeNull();
    // So we can add our own with the same link, and then it's found for us.
    const mine = await createHardwareEntry(grinder());
    await expect(findByNormalizedUrl("hardware", url, me.household.id)).resolves.toMatchObject({ id: mine.id, addedByYou: true });
  });
});

describe("catalog visibility (STORY-01-06-03)", () => {
  it("hides another household's unverified entry and shows it to all once verified (AC 1 to AC 3)", async () => {
    signInAs(them.user.firebaseUid);
    const theirs = await createHardwareEntry(grinder());
    const part = await addPart({ hardwareId: theirs.id });
    signInAs(me.user.firebaseUid);
    await expect(assertVisibleCatalog("model", theirs.id, me.household.id)).rejects.toBeInstanceOf(NotFoundError);
    await expect(addPart({ hardwareId: theirs.id })).rejects.toBeInstanceOf(NotFoundError);
    expect(await searchHardware(db(), me.household.id, { kind: "grinder", query: "hand mill" })).toEqual([]);

    await db().update(canonicalHardware).set({ status: "verified" }).where(eq(canonicalHardware.id, theirs.id));
    await db().update(hardwareMakers).set({ status: "verified" }).where(eq(hardwareMakers.source, "user"));
    await expect(assertVisibleCatalog("model", theirs.id, me.household.id)).resolves.toBe(theirs.id);
    const found = await searchHardware(db(), me.household.id, { kind: "grinder", query: "hand mill" });
    expect(found[0]).toMatchObject({ id: theirs.id, addedByYou: false });
    // Their part is unchanged by verification.
    signInAs(them.user.firebaseUid);
    await expect(addPart({ hardwareId: theirs.id })).resolves.toBeTruthy();
    expect(part.kind).toBe("grinder");
  });
});

import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { hardwareMakers } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { mergeGroup, resolveEntity } from "./catalogMerge";

let db: Db;

async function maker(id: string, mergedIntoId: string | null = null) {
  await db.insert(hardwareMakers).values({
    id,
    name: `Example ${id}`,
    source: "seed",
    status: "verified",
    mergedIntoId,
    createdAt: new Date(),
  });
}

beforeEach(async () => {
  db = await createTestDb();
});

describe("resolveEntity", () => {
  it("returns an unmerged row itself", async () => {
    await maker("a");
    expect(await resolveEntity(db, hardwareMakers, "a")).toBe("a");
  });

  it("follows a chain to the survivor", async () => {
    await maker("c");
    await maker("b", "c");
    await maker("a", "b");
    expect(await resolveEntity(db, hardwareMakers, "a")).toBe("c");
    expect(await resolveEntity(db, hardwareMakers, "b")).toBe("c");
  });

  it("stops on a self-cycle", async () => {
    await maker("a");
    await db.update(hardwareMakers).set({ mergedIntoId: "a" });
    expect(await resolveEntity(db, hardwareMakers, "a")).toBe("a");
  });

  it("stops on a longer cycle without looping", async () => {
    await maker("a");
    await maker("b", "a");
    const { eq } = await import("drizzle-orm");
    await db.update(hardwareMakers).set({ mergedIntoId: "b" }).where(eq(hardwareMakers.id, "a"));
    const result = await resolveEntity(db, hardwareMakers, "a");
    expect(["a", "b"]).toContain(result);
  });

  it("stops at the depth limit", async () => {
    // 15 rows chained 0 → 1 → … → 14.
    for (let i = 14; i >= 0; i--) await maker(`m${i}`, i === 14 ? null : `m${i + 1}`);
    const result = await resolveEntity(db, hardwareMakers, "m0");
    expect(result).toBe("m10");
  });

  it("stays on the last real row when a pointer dangles", async () => {
    await maker("a");
    const { eq } = await import("drizzle-orm");
    // Foreign keys stop this in normal use; simulate broken data.
    await db.run("PRAGMA foreign_keys = OFF");
    await db.update(hardwareMakers).set({ mergedIntoId: "gone" }).where(eq(hardwareMakers.id, "a"));
    expect(await resolveEntity(db, hardwareMakers, "a")).toBe("a");
  });

  it("returns null for a missing row", async () => {
    expect(await resolveEntity(db, hardwareMakers, "missing")).toBeNull();
  });
});

describe("mergeGroup", () => {
  it("gathers the survivor and everything merged into it", async () => {
    await maker("survivor");
    await maker("dup1", "survivor");
    await maker("dup2", "dup1");
    await maker("other");
    for (const id of ["survivor", "dup1", "dup2"]) {
      expect(await mergeGroup(db, hardwareMakers, id)).toEqual(["dup1", "dup2", "survivor"]);
    }
    expect(await mergeGroup(db, hardwareMakers, "other")).toEqual(["other"]);
  });

  it("is empty for a missing row", async () => {
    expect(await mergeGroup(db, hardwareMakers, "missing")).toEqual([]);
  });
});

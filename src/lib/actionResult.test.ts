import { describe, expect, it, vi } from "vitest";
import { NoSessionError } from "@/server/auth/session-shared";
import { NotFoundError } from "@/server/dal/scope";
import { fail, ok, runAction } from "./actionResult";

describe("runAction", () => {
  it("wraps a result", async () => {
    await expect(runAction(async () => 42)).resolves.toEqual(ok(42));
  });

  it("names the data layer's failures", async () => {
    await expect(
      runAction(async () => {
        throw new NotFoundError();
      }),
    ).resolves.toEqual(fail("notFound"));
    await expect(
      runAction(async () => {
        throw new NoSessionError();
      }),
    ).resolves.toEqual(fail("noSession"));
  });

  it("turns anything else into a failed save, without leaking the message", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await runAction(async () => {
      throw new Error("SQLITE_CONSTRAINT: secret detail");
    });
    expect(result).toEqual(fail("saveFailed"));
    expect(JSON.stringify(result)).not.toContain("SQLITE");
    log.mockRestore();
  });
});

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isNetworkEligible } from "./networkEligibility";

/* The network rule for claimed profiles (TASK-05-02-04-BE1). */

const base = { entryMode: "measured" as const, fullPayload: true, claimedByUserId: "user-1", claimantConsents: true };

describe("isNetworkEligible", () => {
  it("is eligible only when measured, complete, claimed and opted in", () => {
    expect(isNetworkEligible(base)).toBe(true);
  });

  it("never for a claimed profile whose person hasn't opted in, whoever logged it (AC 1)", () => {
    expect(isNetworkEligible({ ...base, claimantConsents: false })).toBe(false);
  });

  it("never for a profile with no login, even if the logger opted in (AC 2)", () => {
    expect(isNetworkEligible({ ...base, claimedByUserId: null })).toBe(false);
  });

  it("never for a one-tap or incomplete shot", () => {
    expect(isNetworkEligible({ ...base, entryMode: "one-tap" })).toBe(false);
    expect(isNetworkEligible({ ...base, fullPayload: false })).toBe(false);
  });
});

describe("writers (X-3)", () => {
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) && !/\.test\.tsx?$|\.stories\.tsx$/.test(name) ? [path] : [];
    });

  it("store shots as not eligible until the network exists", () => {
    const writes = files(join(process.cwd(), "src"))
      .filter((f) => !f.endsWith(join("db", "schema.ts")))
      .flatMap((f) => [...readFileSync(f, "utf8").matchAll(/isNetworkEligible:\s*([^,\n}]+)/g)].map((m) => `${f}: ${m[1].trim()}`));
    expect(writes.length).toBeGreaterThan(0);
    for (const w of writes) expect(w).toMatch(/: false$/);
  });
});

import { describe, expect, it } from "vitest";
import { inviteState, INVITE_TTL_MS } from "./invites";

const now = new Date(Date.UTC(2026, 10, 18));
const later = new Date(now.getTime() + INVITE_TTL_MS);

describe("inviteState (TASK-05-02-06-BE1)", () => {
  it("is pending until it expires", () => {
    expect(inviteState({ expiresAt: later, usedAt: null, withdrawnAt: null }, now)).toBe("pending");
    expect(inviteState({ expiresAt: later, usedAt: null, withdrawnAt: null }, later)).toBe("expired");
  });

  it("says used or withdrawn whatever the expiry", () => {
    expect(inviteState({ expiresAt: now, usedAt: now, withdrawnAt: null }, later)).toBe("used");
    expect(inviteState({ expiresAt: later, usedAt: null, withdrawnAt: now }, now)).toBe("withdrawn");
  });
});

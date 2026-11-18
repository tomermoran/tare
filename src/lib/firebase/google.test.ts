import { beforeEach, describe, expect, it, vi } from "vitest";

/*
 * Linking to Google (TASK-05-03-01-FE1), with firebase/auth mocked: each
 * result, offline, and the redirect's return. No real Firebase project.
 */

const user = { getIdToken: vi.fn(async () => "token") };
const auth = { authStateReady: vi.fn(async () => {}), currentUser: user };
const fa = vi.hoisted(() => ({
  linkWithPopup: vi.fn(),
  linkWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(),
  signInWithCredential: vi.fn(),
  credentialFromError: vi.fn(),
  customParameters: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  linkWithPopup: fa.linkWithPopup,
  linkWithRedirect: fa.linkWithRedirect,
  getRedirectResult: fa.getRedirectResult,
  signInWithCredential: fa.signInWithCredential,
  GoogleAuthProvider: class {
    static credentialFromError = fa.credentialFromError;
    setCustomParameters(params: Record<string, string>) {
      fa.customParameters(params);
    }
  },
}));
vi.mock("./client", () => ({ ensureSignedIn: async () => user, firebaseAuth: () => auth }));

const { completeLinkRedirect, linkGoogle, prefersRedirect, switchToHistory } = await import("./google");
const failWith = (code: string) => Object.assign(new Error(code), { code });

beforeEach(() => {
  for (const f of Object.values(fa)) f.mockReset();
});

describe("linkGoogle", () => {
  it("links in a pop-up", async () => {
    fa.linkWithPopup.mockResolvedValue({ user });
    expect(await linkGoogle({ redirect: false })).toEqual({ kind: "linked" });
    expect(fa.linkWithPopup).toHaveBeenCalledWith(user, expect.anything());
    // Google shows its account chooser, so a different account can be picked.
    expect(fa.customParameters).toHaveBeenCalledWith({ prompt: "select_account" });
  });

  it("is quietly cancelled when the window is closed", async () => {
    fa.linkWithPopup.mockRejectedValue(failWith("auth/popup-closed-by-user"));
    expect(await linkGoogle({ redirect: false })).toEqual({ kind: "cancelled" });
  });

  it("fails when offline or on any other error", async () => {
    fa.linkWithPopup.mockRejectedValue(failWith("auth/network-request-failed"));
    expect(await linkGoogle({ redirect: false })).toEqual({ kind: "failed" });
    fa.linkWithPopup.mockRejectedValue(new Error("boom"));
    expect(await linkGoogle({ redirect: false })).toEqual({ kind: "failed" });
  });

  it("carries the credential when the Google account already has a history", async () => {
    const credential = { providerId: "google.com" };
    fa.linkWithPopup.mockRejectedValue(failWith("auth/credential-already-in-use"));
    fa.credentialFromError.mockReturnValue(credential);
    expect(await linkGoogle({ redirect: false })).toEqual({ kind: "accountTaken", credential });
  });

  it("treats an already linked provider as linked", async () => {
    fa.linkWithPopup.mockRejectedValue(failWith("auth/provider-already-linked"));
    expect(await linkGoogle({ redirect: false })).toEqual({ kind: "linked" });
  });

  it("redirects instead on iOS", async () => {
    fa.linkWithRedirect.mockResolvedValue(undefined);
    expect(await linkGoogle({ redirect: true })).toEqual({ kind: "redirecting" });
    expect(fa.linkWithPopup).not.toHaveBeenCalled();
  });
});

describe("prefersRedirect", () => {
  it("is true on iPhone and an iPad that reports a Mac, false on a desktop", () => {
    expect(prefersRedirect({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)", maxTouchPoints: 5 })).toBe(true);
    expect(prefersRedirect({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", maxTouchPoints: 5 })).toBe(true);
    expect(prefersRedirect({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", maxTouchPoints: 0 })).toBe(false);
    expect(prefersRedirect({ userAgent: "Mozilla/5.0 (Linux; Android 15)", maxTouchPoints: 5 })).toBe(false);
  });
});

describe("completeLinkRedirect", () => {
  it("is linked on return from Google, null when there was no redirect", async () => {
    fa.getRedirectResult.mockResolvedValue({ user });
    expect(await completeLinkRedirect()).toEqual({ kind: "linked" });
    fa.getRedirectResult.mockResolvedValue(null);
    expect(await completeLinkRedirect()).toBeNull();
  });

  it("returns the same results as the pop-up for an error", async () => {
    fa.getRedirectResult.mockRejectedValue(failWith("auth/network-request-failed"));
    expect(await completeLinkRedirect()).toEqual({ kind: "failed" });
  });
});

describe("switchToHistory", () => {
  it("signs in with the credential and swaps its token for the session", async () => {
    const fetch = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetch);
    fa.signInWithCredential.mockResolvedValue({ user });
    await switchToHistory({ providerId: "google.com" } as never);
    expect(fetch).toHaveBeenCalledWith("/api/session", expect.objectContaining({ body: JSON.stringify({ idToken: "token" }) }));
  });

  it("throws when the exchange fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 401 })));
    fa.signInWithCredential.mockResolvedValue({ user });
    await expect(switchToHistory({} as never)).rejects.toThrow();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

/*
 * Signing in with Google to join (TASK-05-02-02-FE1), with firebase/auth
 * and the session exchange mocked. No real Firebase project or key.
 */

const anon = { isAnonymous: true, getIdToken: vi.fn(async () => "anon-token") };
const google = { isAnonymous: false, getIdToken: vi.fn(async () => "google-token") };
const auth: { authStateReady: () => Promise<void>; currentUser: unknown } = { authStateReady: async () => {}, currentUser: anon };
const fa = vi.hoisted(() => ({
  linkWithPopup: vi.fn(),
  linkWithRedirect: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(),
  signInWithCredential: vi.fn(),
  credentialFromError: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  ...fa,
  GoogleAuthProvider: class {
    static credentialFromError = fa.credentialFromError;
    setCustomParameters() {}
  },
}));
vi.mock("./client", () => ({ firebaseAuth: () => auth, ensureSignedIn: async () => auth.currentUser }));

const { signInForJoining, completeJoinRedirect } = await import("./googleJoin");
const failWith = (code: string) => Object.assign(new Error(code), { code });
const fetchMock = vi.fn();

beforeEach(() => {
  for (const f of Object.values(fa)) f.mockReset();
  auth.currentUser = anon;
  fetchMock.mockReset().mockResolvedValue({ ok: true, status: 204 });
  vi.stubGlobal("fetch", fetchMock);
});

const exchangedWith = () => JSON.parse(fetchMock.mock.calls[0][1].body).idToken;

describe("signInForJoining", () => {
  it("links Google to an anonymous browser, keeping its account", async () => {
    fa.linkWithPopup.mockResolvedValue({ user: anon });
    expect(await signInForJoining({ redirect: false })).toEqual({ kind: "signedIn" });
    expect(exchangedWith()).toBe("anon-token");
  });

  it("signs in as the Google account when it already has its own", async () => {
    fa.linkWithPopup.mockRejectedValue(failWith("auth/credential-already-in-use"));
    fa.credentialFromError.mockReturnValue({ providerId: "google.com" });
    fa.signInWithCredential.mockResolvedValue({ user: google });
    expect(await signInForJoining({ redirect: false })).toEqual({ kind: "signedIn" });
    expect(exchangedWith()).toBe("google-token");
  });

  it("signs in plainly with no anonymous account", async () => {
    auth.currentUser = null;
    fa.signInWithPopup.mockResolvedValue({ user: google });
    expect(await signInForJoining({ redirect: false })).toEqual({ kind: "signedIn" });
    expect(fa.linkWithPopup).not.toHaveBeenCalled();
  });

  it("is cancelled when the window is closed, and exchanges nothing (AC 2)", async () => {
    fa.linkWithPopup.mockRejectedValue(failWith("auth/popup-closed-by-user"));
    expect(await signInForJoining({ redirect: false })).toEqual({ kind: "cancelled" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails on any other error or a failed exchange (AC 3)", async () => {
    fa.linkWithPopup.mockRejectedValue(failWith("auth/network-request-failed"));
    expect(await signInForJoining({ redirect: false })).toEqual({ kind: "failed" });
    fa.linkWithPopup.mockResolvedValue({ user: anon });
    fetchMock.mockResolvedValue({ ok: false, status: 401 });
    expect(await signInForJoining({ redirect: false })).toEqual({ kind: "failed" });
  });

  it("redirects on iOS, and finishes on return", async () => {
    expect(await signInForJoining({ redirect: true })).toEqual({ kind: "redirecting" });
    expect(fa.linkWithRedirect).toHaveBeenCalled();
    fa.getRedirectResult.mockResolvedValue({ user: anon });
    expect(await completeJoinRedirect()).toEqual({ kind: "signedIn" });
    fa.getRedirectResult.mockResolvedValue(null);
    expect(await completeJoinRedirect()).toBeNull();
  });
});

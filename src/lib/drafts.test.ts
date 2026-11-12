import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** A minimal Storage over a Map. */
function fakeStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  };
}

/** Storage that exists but throws, like Safari's blocked storage. */
function brokenStorage(): Storage {
  const fail = () => {
    throw new DOMException("blocked", "SecurityError");
  };
  return { length: 0, clear: fail, getItem: fail, key: fail, removeItem: fail, setItem: fail };
}

// Fresh module per test, so the memory fallback starts empty.
async function drafts() {
  vi.resetModules();
  return import("./drafts");
}

const draft = { drink: "d1", dose: 18, yield: 36, timeMs: 27_600 };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("drafts with session storage", () => {
  beforeEach(() => {
    vi.stubGlobal("sessionStorage", fakeStorage());
  });

  it("restores a draft unchanged", async () => {
    const { saveDraft, loadDraft } = await drafts();
    saveDraft("log", draft);
    expect(loadDraft("log")).toEqual(draft);
  });

  it("survives a fresh page load (the module reloads, storage stays)", async () => {
    (await drafts()).saveDraft("log", draft);
    expect((await drafts()).loadDraft("log")).toEqual(draft);
  });

  it("clears a draft", async () => {
    const { saveDraft, loadDraft, clearDraft } = await drafts();
    saveDraft("log", draft);
    clearDraft("log");
    expect(loadDraft("log")).toBeNull();
  });

  it("returns null for a missing or corrupt draft", async () => {
    const { loadDraft } = await drafts();
    expect(loadDraft("nothing")).toBeNull();
    sessionStorage.setItem("tare:draft:bad", "{not json");
    expect(loadDraft("bad")).toBeNull();
  });
});

describe("drafts without usable storage", () => {
  it("falls back to memory when there is no session storage", async () => {
    vi.stubGlobal("sessionStorage", undefined);
    const { saveDraft, loadDraft, clearDraft } = await drafts();
    saveDraft("log", draft);
    expect(loadDraft("log")).toEqual(draft);
    clearDraft("log");
    expect(loadDraft("log")).toBeNull();
  });

  it("falls back to memory when storage throws", async () => {
    vi.stubGlobal("sessionStorage", brokenStorage());
    const { saveDraft, loadDraft } = await drafts();
    expect(() => saveDraft("log", draft)).not.toThrow();
    expect(loadDraft("log")).toEqual(draft);
  });
});

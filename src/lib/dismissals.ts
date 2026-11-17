/*
 * Dismissed suggestions, on this device only (STORY-02-03-07, DQ-25). A
 * suggestion belongs to the shot it was worked out from, so a dismissal is
 * kept by that shot's ID: the next shot on the same coffee, setup and drink
 * has a new ID, and its suggestion shows again (AC 5). Local storage, else
 * session storage, else memory for this page load.
 */

const KEY = "tare:dismissedSuggestions";
/** Only the latest few matter: each key's newest shot. */
const KEEP = 50;
const memory = new Set<string>();

function store(): Storage | null {
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try {
      const s = globalThis[name];
      if (!s) continue;
      s.setItem(`${KEY}:probe`, "1");
      s.removeItem(`${KEY}:probe`);
      return s;
    } catch {
      // Blocked or full: try the next.
    }
  }
  return null;
}

function read(): string[] {
  const s = store();
  if (!s) return [...memory];
  try {
    const list: unknown = JSON.parse(s.getItem(KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function dismissSuggestion(shotId: string): void {
  const list = [...read().filter((id) => id !== shotId), shotId].slice(-KEEP);
  const s = store();
  if (!s) {
    memory.add(shotId);
    return;
  }
  try {
    s.setItem(KEY, JSON.stringify(list));
  } catch {
    memory.add(shotId);
  }
}

export function isSuggestionDismissed(shotId: string): boolean {
  return memory.has(shotId) || read().includes(shotId);
}

/*
 * Things dismissed for good on this device, such as the reminder to link
 * Google (STORY-05-03-03 AC 2, DQ-40d). No schema change: a cleared browser
 * may show them again, which is accepted.
 */
const FOR_GOOD = "tare:dismissedForGood";
const forGoodMemory = new Set<string>();

function readForGood(): string[] {
  const s = store();
  if (!s) return [];
  try {
    const list: unknown = JSON.parse(s.getItem(FOR_GOOD) ?? "[]");
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function dismissForGood(key: string): void {
  const s = store();
  try {
    if (!s) throw new Error("no storage");
    s.setItem(FOR_GOOD, JSON.stringify([...new Set([...readForGood(), key])]));
  } catch {
    // No storage or full: kept in memory for this page load.
    forGoodMemory.add(key);
  }
}

export function isDismissedForGood(key: string): boolean {
  return forGoodMemory.has(key) || readForGood().includes(key);
}

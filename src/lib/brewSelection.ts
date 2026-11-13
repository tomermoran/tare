/*
 * What's on Brew right now, for the Journal tab's default filter
 * (STORY-02-06-05 AC 1, AC 2): Brew writes its drink and coffee each time it
 * shows them, including a change just made there; nothing on first run. It
 * lives in this tab's session, and a change is announced so the tab bar's
 * link follows at once.
 */

const KEY = "tare:brewSelection";
const EVENT = "tare:brewSelection";
let memory: string | null = null;

export type BrewSelection = { drinkId: string; beanId: string };

function store(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/** Brew's drink and coffee, or null when it has none. */
export function rememberBrewSelection(selection: BrewSelection | null) {
  const value = selection ? JSON.stringify(selection) : null;
  try {
    if (value) store()?.setItem(KEY, value);
    else store()?.removeItem(KEY);
  } catch {
    // Storage full or blocked: memory still has it.
  }
  memory = value;
  window.dispatchEvent(new Event(EVENT));
}

/** The raw remembered value, stable between changes (for useSyncExternalStore). */
export function brewSelectionSnapshot(): string | null {
  try {
    return store()?.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

export function parseBrewSelection(raw: string | null): BrewSelection | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return typeof v?.drinkId === "string" && typeof v?.beanId === "string" ? { drinkId: v.drinkId, beanId: v.beanId } : null;
  } catch {
    return null;
  }
}

export function subscribeBrewSelection(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

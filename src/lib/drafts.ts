/*
 * Keeps a task's unsaved values while the user is away on a side task, so
 * coming back restores them unchanged (STORY-01-01-05 AC 4). Session storage,
 * so a draft lives as long as the tab; when storage is unavailable (private
 * modes, blocked storage, quota) it falls back to memory for this page load.
 */

const PREFIX = "tare:draft:";
const memory = new Map<string, string>();

function storage(): Storage | null {
  try {
    const s = globalThis.sessionStorage;
    if (!s) return null;
    // Some browsers expose storage that throws on use.
    const probe = `${PREFIX}probe`;
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export function saveDraft(key: string, value: unknown): void {
  const json = JSON.stringify(value);
  const s = storage();
  try {
    if (s) {
      s.setItem(PREFIX + key, json);
      memory.delete(PREFIX + key);
      return;
    }
  } catch {
    // Quota or a storage error: keep it in memory instead.
  }
  memory.set(PREFIX + key, json);
}

export function loadDraft<T>(key: string): T | null {
  let json: string | null = null;
  try {
    json = storage()?.getItem(PREFIX + key) ?? null;
  } catch {
    json = null;
  }
  json ??= memory.get(PREFIX + key) ?? null;
  if (json === null) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function clearDraft(key: string): void {
  memory.delete(PREFIX + key);
  try {
    storage()?.removeItem(PREFIX + key);
  } catch {
    // Nothing to clear.
  }
}

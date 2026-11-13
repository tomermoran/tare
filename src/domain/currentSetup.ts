/*
 * Which setup is current (STORY-01-02-09, DQ-18, TQ-16): the setup of the
 * persona's latest shot, unless one was chosen ("use this") more recently.
 * With neither, the newest setup. The choice is a device cookie holding the
 * setup ID and when it was chosen, so a later shot on another setup wins
 * again. A choice or shot naming a setup that no longer exists is ignored.
 */

export const CURRENT_SETUP_COOKIE = "currentSetup";

/** Days without a shot before a setup is grouped under "older" (AC 4). */
export const OLDER_AFTER_DAYS = 90;

export type SetupChoice = { setupId: string; at: number };

export function currentSetupId({
  setups,
  latestShot,
  choice,
}: {
  setups: readonly { id: string; createdAt: Date }[];
  latestShot: { setupId: string; at: Date } | null;
  choice: SetupChoice | null;
}): string | null {
  const known = (id: string | undefined) => !!id && setups.some((s) => s.id === id);
  const shot = latestShot && known(latestShot.setupId) ? latestShot : null;
  const chosen = choice && known(choice.setupId) ? choice : null;
  if (chosen && (!shot || chosen.at >= shot.at.getTime())) return chosen.setupId;
  if (shot) return shot.setupId;
  if (setups.length === 0) return null;
  return setups.reduce((a, b) => (b.createdAt.getTime() > a.createdAt.getTime() ? b : a)).id;
}

/** The cookie's value: the setup ID and the time it was chosen. */
export function encodeSetupChoice(choice: SetupChoice): string {
  return `${choice.setupId}.${choice.at}`;
}

export function decodeSetupChoice(value: string | undefined): SetupChoice | null {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const at = Number(value.slice(dot + 1));
  if (!Number.isSafeInteger(at) || at <= 0) return null;
  return { setupId: value.slice(0, dot), at };
}

/** Not used for 90 days (or, never used, made over 90 days ago); never the current one. */
export function isOlder(
  setup: { id: string; createdAt: Date; lastUsedAt: Date | null },
  currentId: string | null,
  now: Date,
): boolean {
  if (setup.id === currentId) return false;
  const last = (setup.lastUsedAt ?? setup.createdAt).getTime();
  return now.getTime() - last > OLDER_AFTER_DAYS * 86_400_000;
}

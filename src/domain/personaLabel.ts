/*
 * How a persona is shown (STORY-01-01-03): the name it was given, else the
 * translated role label ("Me"), so an unnamed profile follows the app's
 * language and a chosen name shows the same in every language. The only
 * way a persona's name reaches the screen.
 */
export function personaLabel(persona: { name: string | null }, roleLabel: string): string {
  return persona.name?.trim() || roleLabel;
}

/** A name as stored: trimmed and capped, with empty meaning "no name" (AC 4). */
export function cleanPersonaName(name: string | null | undefined): string | null {
  return name?.trim().slice(0, 40) || null;
}

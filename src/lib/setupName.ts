/*
 * How a setup is shown (S-08): its name, or, without one, its parts name,
 * the three parts' nicknames or models as a list ("A, B and C"). The list
 * format comes from the caller's formatter, so it follows the locale.
 */
export function setupName(
  setup: { name: string | null; parts: { nickname: string | null; model: string }[] },
  list: (items: string[]) => string,
): string {
  return setup.name ?? list(setup.parts.map((p) => p.nickname ?? p.model));
}

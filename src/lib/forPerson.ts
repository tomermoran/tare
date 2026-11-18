import { personaLabel } from "@/domain/personaLabel";

type Translate = (key: "log.forPerson" | "recipe.forPerson" | "profile.defaultName", values?: { name: string }) => string;

/** "for {name}", or nothing with only one profile (STORY-05-01-04 AC 2). */
export function forPersonLine(
  t: Translate,
  persona: { name: string | null } | null,
  key: "log.forPerson" | "recipe.forPerson" = "log.forPerson",
): string | undefined {
  if (!persona) return undefined;
  return t(key, { name: personaLabel(persona, t("profile.defaultName")) });
}

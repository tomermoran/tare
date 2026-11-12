import type messages from "@/i18n/messages/en.json";

/*
 * The one way to show a drink's name (STORY-01-01-02). Starter drinks store
 * a message key, so they follow the app's language and switching language
 * changes no rows. A rename or a custom drink stores a name, which wins.
 */

export type DrinkKey = `drinks.${keyof (typeof messages)["drinks"]}`;

/** What's stored on a drink row that names it. */
export type NamedDrink = { name: string | null; nameKey: string | null };

/** Pass the root translator: `useTranslations()` or `getTranslations()`. */
export type DrinkTranslator = (key: DrinkKey) => string;

const KEY = /^drinks\.[A-Za-z]+$/;

export function drinkLabel(drink: NamedDrink, t: DrinkTranslator): string {
  const name = drink.name?.trim();
  if (name) return name;
  // Only keys from our own messages; anything else would be shown raw.
  if (drink.nameKey && KEY.test(drink.nameKey)) return t(drink.nameKey as DrinkKey);
  return "";
}

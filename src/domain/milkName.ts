import type messages from "@/i18n/messages/en.json";

/*
 * The one way to show a milk's name, like drinkLabel: starter milks store a
 * message key so they follow the app's language; a rename or a custom milk
 * stores a name, which wins.
 */

export type MilkKey = `milks.${keyof (typeof messages)["milks"]}`;
export type NamedMilk = { name: string | null; nameKey: string | null };

const KEY = /^milks\.[A-Za-z]+$/;

export function milkLabel(milk: NamedMilk, t: (key: MilkKey) => string): string {
  const name = milk.name?.trim();
  if (name) return name;
  if (milk.nameKey && KEY.test(milk.nameKey)) return t(milk.nameKey as MilkKey);
  return "";
}

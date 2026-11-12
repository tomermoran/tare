/** The four sections (S-02 round 6), in tab order, with their routes. */
export const APP_TABS = [
  { id: "brew", href: "/" },
  { id: "journal", href: "/journal" },
  { id: "beans", href: "/beans" },
  { id: "setup", href: "/setup" },
] as const;

export type AppTab = (typeof APP_TABS)[number]["id"];

/** Which tab a path belongs to: its first segment, or Brew for "/". */
export function tabForPath(pathname: string): AppTab {
  const first = pathname.split("/")[1] ?? "";
  return APP_TABS.find((t) => t.id === first)?.id ?? "brew";
}

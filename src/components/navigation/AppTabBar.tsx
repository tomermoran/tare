"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { TabBar } from "@/components/ui/TabBar/TabBar";
import { APP_TABS, tabForPath } from "@/lib/appTabs";
import { brewSelectionSnapshot, parseBrewSelection, subscribeBrewSelection } from "@/lib/brewSelection";
import { journalHref } from "@/lib/journalFilters";

export function AppTabBar({ className }: { className?: string }) {
  return <Tabs className={className} current={tabForPath(usePathname())} />;
}

/**
 * The same bar with no tab marked, for the Suspense fallback: on a route
 * with a dynamic segment (/beans/[batchId]) the pathname isn't known while
 * the static shell is prerendered.
 */
export function AppTabBarFallback({ className }: { className?: string }) {
  return <Tabs className={className} current="" />;
}

function Tabs({ className, current }: { className?: string; current: string }) {
  const t = useTranslations("nav");
  // The Journal opens on Brew's drink and coffee, never a setup (STORY-02-06-05 AC 1, AC 2).
  const brew = parseBrewSelection(useSyncExternalStore(subscribeBrewSelection, brewSelectionSnapshot, () => null));
  return (
    <TabBar
      label={t("label")}
      current={current}
      tabs={APP_TABS.map((tab) => ({ ...tab, ...(tab.id === "journal" && brew && { href: journalHref(brew) }), label: t(tab.id) }))}
      className={className}
    />
  );
}

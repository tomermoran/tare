"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { TabBar } from "@/components/ui/TabBar/TabBar";
import { APP_TABS, tabForPath } from "@/lib/appTabs";

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
  return (
    <TabBar
      label={t("label")}
      current={current}
      tabs={APP_TABS.map((tab) => ({ ...tab, label: t(tab.id) }))}
      className={className}
    />
  );
}

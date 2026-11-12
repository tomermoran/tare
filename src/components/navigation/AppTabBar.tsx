"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { TabBar } from "@/components/ui/TabBar/TabBar";
import { APP_TABS, tabForPath } from "@/lib/appTabs";

export function AppTabBar({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return (
    <TabBar
      label={t("label")}
      current={tabForPath(pathname)}
      tabs={APP_TABS.map((tab) => ({ ...tab, label: t(tab.id) }))}
      className={className}
    />
  );
}

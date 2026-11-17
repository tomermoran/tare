"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { BeansFilterRow } from "./BeansFilterRow";

/** Beans' filter row, navigating with the router; each change is a history entry. */
export function BeansFilterRowLive(props: Omit<ComponentProps<typeof BeansFilterRow>, "onGo" | "labels">) {
  const router = useRouter();
  const t = useTranslations();
  return (
    <BeansFilterRow
      {...props}
      onGo={(href) => router.push(href)}
      labels={{
        row: t("beans.filters"),
        all: t("beans.filterAll"),
        name: (filter, value) => t("beans.filterName", { filter, value }),
        remove: (filter, value) => t("beans.removeFilter", { filter, value }),
        close: t("actions.close"),
      }}
    />
  );
}

"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";

/** Interim catalog add (until wave 7): says so and goes back to the picker. */
export function CatalogAddInterim() {
  const t = useTranslations();
  const router = useRouter();
  return (
    <EmptyState
      title={t("catalog.addSoonTitle")}
      action={{ label: t("actions.back"), onClick: () => router.back() }}
    >
      {t("catalog.addSoon")}
    </EmptyState>
  );
}

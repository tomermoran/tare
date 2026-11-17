"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { setCoffeeOriginAction } from "@/server/actions/catalog";
import { CoffeeOrigin } from "./CoffeeOrigin";
import { useOriginLabels } from "./useOriginLabels";

/** The coffee screen's origin action, saving through the catalog action and refreshing. */
export function CoffeeOriginLive({ beanId, origin }: { beanId: string; origin: string | null }) {
  const t = useTranslations();
  const router = useRouter();
  const labels = useOriginLabels();
  return (
    <CoffeeOrigin
      origin={origin}
      labels={{ ...labels, set: t("catalog.origin.set"), change: t("catalog.origin.change"), saveFailed: t("states.saveFailed") }}
      onSave={async (next) => {
        const result = await setCoffeeOriginAction({ beanId, origin: next });
        if (result.ok) router.refresh();
        return result.ok;
      }}
    />
  );
}

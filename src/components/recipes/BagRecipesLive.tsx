"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { removeBagRecipeAction } from "@/server/actions/recipes";
import { BagRecipes } from "./BagRecipes";

/** BagRecipes with removal wired: the action, then a refresh so the coffee's recipe shows for the bag. */
export function BagRecipesLive({ batchId, ...props }: Omit<ComponentProps<typeof BagRecipes>, "remove"> & {
  batchId: string;
  removeLabels: ComponentProps<typeof BagRecipes>["remove"]["labels"];
}) {
  const router = useRouter();
  const { removeLabels, ...rest } = props;
  return (
    <BagRecipes
      {...rest}
      remove={{
        labels: removeLabels,
        onRemove: async (row) => {
          if (!row.setupId || !row.drinkTypeId) return false;
          const result = await removeBagRecipeAction({ batchId, setupId: row.setupId, drinkTypeId: row.drinkTypeId });
          if (result.ok) router.refresh();
          return result.ok;
        },
      }}
    />
  );
}

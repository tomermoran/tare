"use client";

import { useRouter } from "next/navigation";
import { SelectSheet, type SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import { redialHref } from "@/lib/logRoutes";

/**
 * "Which coffee?" (STORY-04-03-04 AC 5): the coffees on hand with a recipe
 * from before the servicing, Brew's first, each with its drink and setup.
 * Choosing one opens the log re-dialling it. Option IDs are recipe IDs.
 */
export function RedialPick({
  open,
  onClose,
  eventId,
  options,
  labels,
}: {
  open: boolean;
  onClose: () => void;
  eventId: string;
  options: SelectOption[];
  labels: { title: string; close: string };
}) {
  const router = useRouter();
  return (
    <SelectSheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      options={options}
      value={null}
      onChoose={(recipeId) => router.push(redialHref(eventId, recipeId))}
    />
  );
}

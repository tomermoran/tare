"use client";

import { useId } from "react";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { TASTE_TAGS, type TasteTag } from "@/domain/taste";

/*
 * What the user noticed (STORY-01-05-03): six tags, any number, under a
 * quiet overline. They describe, they don't judge, so a chosen chip stays
 * monochrome; the channelling warning is a separate Notice.
 */
export function TasteTags({
  labels,
  value,
  onChange,
}: {
  labels: { observed: string; tags: Record<TasteTag, string> };
  value: TasteTag[];
  onChange: (tags: TasteTag[]) => void;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-overline uppercase text-ink-secondary">
        {labels.observed}
      </h2>
      <ChipGroup
        multiple
        label={labels.observed}
        options={TASTE_TAGS.map((tag) => ({ value: tag, label: labels.tags[tag] }))}
        value={value}
        onChange={(v) => onChange(v as TasteTag[])}
      />
    </section>
  );
}

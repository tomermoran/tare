"use client";

import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { RATINGS } from "@/domain/tasting";

/**
 * The overall rating, 1 to 5 (STORY-01-05-01): optional, and tapping the
 * chosen number again unrates. Measured shots only (DQ-23).
 */
export function TasteRating({
  label,
  rating,
  onChange,
}: {
  label: string;
  rating: number | null;
  onChange: (rating: number | null) => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-body text-ink">{label}</h2>
      <ChipGroup
        clearable
        label={label}
        options={RATINGS.map((r) => ({ value: String(r), label: String(r) }))}
        value={rating === null ? null : String(rating)}
        onChange={(v) => onChange(v === null ? null : Number(v))}
      />
    </section>
  );
}

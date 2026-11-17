"use client";

import { useState } from "react";
import { FilterChips, type FilterChip } from "@/components/ui/ChipGroup/FilterChips";
import { SelectSheet, type SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import type { BeansFilters, FilterKind } from "@/domain/beansFilter";
import { beansHref } from "@/lib/beansFilters";

/*
 * Beans' filter row (DES-03-07-01): the Journal's FilterChips, each chip
 * opening SH-SELECT with only the values present and a count. One value per
 * chip; "All" clears them all. Every change is a new address, so Back
 * undoes it and Back from a bag keeps it. Props only, every word arrives
 * worded; `onGo` navigates.
 */

export type BeansFilterChip = {
  kind: FilterKind;
  /** The filter's name, e.g. "Roaster", the sheet's title. */
  title: string;
  /** What the chip shows while off, e.g. "Any roaster". */
  any: string;
  options: SelectOption[];
};

export type BeansFilterRowLabels = {
  row: string;
  all: string;
  /** "Roaster: Ash Lane", the chip's accessible name. */
  name: (filter: string, value: string) => string;
  /** "Remove filter Roaster: Ash Lane". */
  remove: (filter: string, value: string) => string;
  close: string;
};

export function BeansFilterRow({
  chips,
  filters,
  onGo,
  labels,
}: {
  /** Filters with no values present are left out by the caller. */
  chips: BeansFilterChip[];
  filters: BeansFilters;
  onGo: (href: string) => void;
  labels: BeansFilterRowLabels;
}) {
  const [picking, setPicking] = useState<FilterKind | null>(null);
  const valueOf = (c: BeansFilterChip) => c.options.find((o) => o.id === filters[c.kind])?.primary ?? null;
  const row: FilterChip[] = chips.map((c) => {
    const value = valueOf(c);
    return value
      ? { id: c.kind, text: value, name: labels.name(c.title, value), remove: labels.remove(c.title, value) }
      : { id: c.kind, text: c.any, name: labels.name(c.title, c.any) };
  });
  const without = (kind: FilterKind) => {
    const next = { ...filters };
    delete next[kind];
    return next;
  };
  const open = chips.find((c) => c.kind === picking);

  return (
    <>
      <FilterChips
        label={labels.row}
        chips={row}
        all={labels.all}
        onOpen={(id) => setPicking(id as FilterKind)}
        onRemove={(id) => onGo(beansHref(without(id as FilterKind)))}
        onClearAll={() => onGo(beansHref())}
      />
      <SelectSheet
        open={!!open}
        onClose={() => setPicking(null)}
        title={open?.title ?? ""}
        closeLabel={labels.close}
        options={open?.options ?? []}
        value={open ? (filters[open.kind] ?? null) : null}
        onChoose={(id) => {
          if (!open) return;
          setPicking(null);
          onGo(beansHref({ ...filters, [open.kind]: id }));
        }}
      />
    </>
  );
}

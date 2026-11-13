"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { SelectSheet } from "@/components/ui/SelectSheet/SelectSheet";
import { MARKETS } from "@/domain/markets";
import { normalizeUrl } from "@/domain/url";
import type { CatalogExtras, CatalogMatch } from "@/server/dal/catalogAdd";
import { MoreLinksAndNames, type ExtraKind, type ExtraRow } from "./MoreLinksAndNames";

/*
 * The state behind "more links and other names" (STORY-01-06-05), shared
 * by the hardware and coffee add flows: the rows, each extra link's
 * duplicate check, the market sheet, and the save input.
 */

const ANY = "any";
const empty = (): ExtraRow => ({ value: "", market: null });

export function useCatalogExtras({
  catalog,
  describe,
  onUseExisting,
}: {
  catalog: "hardware" | "coffee";
  /** The duplicate notice for a match. */
  describe: (match: CatalogMatch) => string;
  onUseExisting: (id: string) => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Record<ExtraKind, ExtraRow[]>>({ links: [], names: [] });
  const [duplicates, setDuplicates] = useState<(CatalogMatch | null)[]>([]);
  const [choosing, setChoosing] = useState<{ kind: ExtraKind; index: number } | null>(null);
  const checked = useRef<(string | null)[]>([]);

  const regions = useMemo(() => new Intl.DisplayNames([locale], { type: "region" }), [locale]);
  const marketName = (m: string | null) => (m ? (regions.of(m) ?? m) : t("catalog.anyMarket"));
  const marketOptions = useMemo(
    () => [
      { id: ANY, primary: t("catalog.anyMarket") },
      ...MARKETS.map((m) => ({ id: m, primary: regions.of(m) ?? m })).sort((a, b) => a.primary.localeCompare(b.primary, locale)),
    ],
    [regions, locale, t],
  );

  const update = (kind: ExtraKind, index: number, patch: Partial<ExtraRow>) =>
    setRows((r) => ({ ...r, [kind]: r[kind].map((row, i) => (i === index ? { ...row, ...patch } : row)) }));

  const checkLink = async (index: number) => {
    const url = rows.links[index]?.value ?? "";
    const normalized = normalizeUrl(url);
    if (!normalized || checked.current[index] === normalized) return;
    checked.current[index] = normalized;
    try {
      const res = await fetch(`/api/catalog/check-url?${new URLSearchParams({ catalog, url })}`);
      if (!res.ok) throw new Error(String(res.status));
      const { match } = (await res.json()) as { match: CatalogMatch | null };
      setDuplicates((d) => Object.assign([...d], { [index]: match }));
    } catch {
      // Save checks every link again.
      checked.current[index] = null;
    }
  };

  const reset = () => {
    setOpen(false);
    setRows({ links: [], names: [] });
    setDuplicates([]);
    checked.current = [];
  };

  const input: CatalogExtras = {
    urls: rows.links.filter((r) => r.value.trim()).map((r) => ({ url: r.value, market: r.market })),
    aliases: rows.names.filter((r) => r.value.trim()).map((r) => ({ name: r.value, market: r.market })),
  };
  const dirty = rows.links.some((r) => r.value.trim()) || rows.names.some((r) => r.value.trim());

  const more = (
    <MoreLinksAndNames
      labels={{
        more: t("catalog.more"),
        moreHint: t("catalog.moreHint"),
        link: (number) => t("catalog.extraLink", { number }),
        name: (number) => t("catalog.extraName", { number }),
        market: t("catalog.market"),
        marketFor: (item) => t("catalog.marketFor", { item }),
        marketName,
        addLink: t("catalog.addLink"),
        addName: t("catalog.addName"),
        remove: (item) => t("catalog.remove", { item }),
        useExisting: t("catalog.useExisting"),
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
        setRows((r) => (r.links.length || r.names.length ? r : { links: [empty()], names: [] }));
      }}
      links={rows.links}
      names={rows.names}
      onChange={(kind, index, value) => {
        update(kind, index, { value });
        if (kind === "links" && normalizeUrl(value) !== checked.current[index]) {
          setDuplicates((d) => Object.assign([...d], { [index]: null }));
        }
      }}
      onLinkBlur={checkLink}
      onChooseMarket={(kind, index) => setChoosing({ kind, index })}
      onAdd={(kind) => setRows((r) => ({ ...r, [kind]: [...r[kind], empty()].slice(0, 10) }))}
      onRemove={(kind, index) => {
        setRows((r) => ({ ...r, [kind]: r[kind].filter((_, i) => i !== index) }));
        if (kind === "links") {
          setDuplicates((d) => d.filter((_, i) => i !== index));
          checked.current = checked.current.filter((_, i) => i !== index);
        }
      }}
      linkDuplicates={rows.links.map((_, i) => (duplicates[i] ? describe(duplicates[i]) : undefined))}
      onUseExisting={(i) => duplicates[i] && onUseExisting(duplicates[i].id)}
    />
  );

  const chosen = choosing ? rows[choosing.kind][choosing.index] : undefined;
  const marketSheet = (
    <SelectSheet
      open={!!choosing}
      onClose={() => setChoosing(null)}
      title={t("catalog.market")}
      closeLabel={t("actions.close")}
      options={marketOptions}
      value={chosen ? (chosen.market ?? ANY) : null}
      onChoose={(id) => {
        if (choosing) update(choosing.kind, choosing.index, { market: id === ANY ? null : id });
        setChoosing(null);
      }}
    />
  );

  return { more, marketSheet, input, dirty, reset };
}

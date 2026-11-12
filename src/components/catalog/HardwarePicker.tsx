"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  CatalogPickScreen,
  type PickGroup,
  type PickRow,
} from "@/components/screens/CatalogPickScreen/CatalogPickScreen";
import type { HardwareKind } from "@/domain/capabilities";
import { RETURN_TO, returnWithSelection, safeReturnTo, withReturnTo } from "@/lib/returnTo";
import type { HardwareResult, MakerResult } from "@/server/dal/catalog";

const KINDS: HardwareKind[] = ["machine", "grinder", "basket"];
/** Wait this long after the last keystroke before searching. */
export const SEARCH_DEBOUNCE_MS = 200;

type Data =
  | { kind: "makers"; makers: MakerResult[]; stock: HardwareResult[] }
  | { kind: "models"; results: HardwareResult[] };

const toRow = (r: HardwareResult): PickRow => ({
  id: r.id,
  primary: r.name,
  secondary: r.makerName,
  addedByYou: r.addedByYou,
  alias: r.matchedAlias ?? undefined,
});

/**
 * The hardware picker (STORY-01-02-01): debounced search with stale
 * requests aborted, two-level browse with no query, and the chosen model
 * returned to `returnTo` as `selected`.
 */
export function HardwarePicker() {
  const t = useTranslations();
  const router = useRouter();
  const params = useSearchParams();
  const kind = (KINDS.includes(params.get("kind") as HardwareKind) ? params.get("kind") : "machine") as HardwareKind;
  const returnTo = safeReturnTo(params.get(RETURN_TO), "/setup");

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [maker, setMaker] = useState<MakerResult | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Next keeps a left page's state; the picker opens at the top each time.
  useLayoutEffect(
    () => () => {
      setMaker(null);
      setQuery("");
    },
     
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    const q = query.trim();
    const base = `/api/catalog/search?catalog=hardware&kind=${kind}`;
    const get = async (url: string) => {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    };
    const load = async (): Promise<Data> => {
      if (q) return { kind: "models", ...(await get(`${base}&q=${encodeURIComponent(q)}`)) };
      if (maker) return { kind: "models", ...(await get(`${base}&maker=${encodeURIComponent(maker.id)}`)) };
      const [{ makers }, { results }] = await Promise.all([
        get(`${base}&browse=makers`),
        kind === "basket" ? get(base) : Promise.resolve({ results: [] }),
      ]);
      return { kind: "makers", makers, stock: (results as HardwareResult[]).filter((r) => r.stock) };
    };
    const timer = setTimeout(
      () => {
        setData(null);
        load()
          .then((d) => {
            setFailed(false);
            setData(d);
          })
          .catch((error) => {
            if (!controller.signal.aborted) {
              console.error(error);
              setFailed(true);
            }
          });
      },
      q ? SEARCH_DEBOUNCE_MS : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, maker, kind, attempt]);

  const groups = useMemo((): PickGroup[] => {
    if (!data) return [];
    if (data.kind === "makers") {
      return [
        { label: t("setup.stockBaskets"), rows: data.stock.map(toRow) },
        {
          label: t("catalog.makers"),
          rows: data.makers.map((m) => ({ id: m.id, primary: m.name, addedByYou: m.addedByYou, drillIn: true })),
        },
      ];
    }
    const stock = data.results.filter((r) => r.stock);
    const rest = data.results.filter((r) => !r.stock);
    return [
      { label: stock.length ? t("setup.stockBaskets") : undefined, rows: stock.map(toRow) },
      { label: stock.length ? t("catalog.results") : maker?.name, rows: rest.map(toRow) },
    ];
  }, [data, maker, t]);

  const back = () => router.replace(returnTo);
  const pick = (row: PickRow) => {
    if (row.drillIn) {
      setMaker({ id: row.id, name: row.primary, addedByYou: !!row.addedByYou });
      return;
    }
    router.replace(returnWithSelection(returnTo, row.id));
  };
  const cantFind = () => {
    const add = `/catalog/add?catalog=hardware&kind=${kind}${query.trim() ? `&q=${encodeURIComponent(query.trim())}` : ""}`;
    router.push(withReturnTo(add, returnTo));
  };

  return (
    <CatalogPickScreen
      labels={{
        title: t(`catalog.pickTitle.${kind}`),
        search: t("catalog.search"),
        searchHint: t("catalog.searchHint"),
        addedByYou: t("catalog.addedByYou"),
        alsoKnownAs: (alias) => t("catalog.alsoKnownAs", { alias }),
        cantFind: t("catalog.cantFind"),
        noMatch: t("catalog.noMatch", { query: query.trim() }),
        loading: t("states.loading"),
        cancel: t("actions.cancel"),
        back: t("catalog.allMakers"),
        loadFailedTitle: t("states.loadFailedTitle"),
        loadFailed: t("states.loadFailed"),
        retry: t("actions.retry"),
      }}
      query={query}
      onQueryChange={(q) => {
        setQuery(q);
        if (q.trim()) setMaker(null);
      }}
      state={failed ? "failed" : data ? "ready" : "loading"}
      onRetry={() => setAttempt((n) => n + 1)}
      groups={groups}
      onPick={pick}
      onCantFind={cantFind}
      onCancel={back}
      onBack={maker && !query.trim() ? () => setMaker(null) : undefined}
    />
  );
}

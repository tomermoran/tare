"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  CatalogPickScreen,
  type PickGroup,
  type PickRow,
} from "@/components/screens/CatalogPickScreen/CatalogPickScreen";
import { RETURN_TO, returnWithSelection, safeReturnTo, withReturnTo } from "@/lib/returnTo";
import type { CoffeeResult, RoasterResult } from "@/server/dal/coffeeCatalog";
import { SEARCH_DEBOUNCE_MS } from "./HardwarePicker";

/**
 * The coffee picker (STORY-03-01-01): with no query, beans bought before
 * and then roasters to browse; with a query, beans with their roaster,
 * bought ones first. The chosen bean returns to `returnTo` as `selected`.
 */

type Data =
  | { kind: "browse"; roasters: RoasterResult[]; recent: CoffeeResult[] }
  | { kind: "beans"; results: CoffeeResult[] };

const toRow = (r: CoffeeResult): PickRow => ({
  id: r.id,
  primary: r.name,
  secondary: r.roasterName,
  addedByYou: r.addedByYou,
  alias: r.matchedAlias ?? undefined,
});

export function CoffeePicker() {
  const t = useTranslations();
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = safeReturnTo(params.get(RETURN_TO), "/beans");

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [roaster, setRoaster] = useState<RoasterResult | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Next keeps a left page's state; the picker opens at the top each time.
  useLayoutEffect(
    () => () => {
      setRoaster(null);
      setQuery("");
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    const q = query.trim();
    const base = "/api/catalog/search?catalog=coffee";
    const get = async (url: string) => {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    };
    const load = async (): Promise<Data> => {
      if (q) return { kind: "beans", ...(await get(`${base}&q=${encodeURIComponent(q)}`)) };
      if (roaster) return { kind: "beans", ...(await get(`${base}&roaster=${encodeURIComponent(roaster.id)}`)) };
      return { kind: "browse", ...(await get(`${base}&browse=roasters`)) };
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
  }, [query, roaster, attempt]);

  const groups = useMemo((): PickGroup[] => {
    if (!data) return [];
    if (data.kind === "browse") {
      return [
        { label: t("catalog.boughtBefore"), rows: data.recent.map(toRow) },
        {
          label: t("catalog.roasters"),
          rows: data.roasters.map((r) => ({ id: r.id, primary: r.name, addedByYou: r.addedByYou, drillIn: true })),
        },
      ];
    }
    const bought = data.results.filter((r) => r.bought);
    const rest = data.results.filter((r) => !r.bought);
    return [
      { label: bought.length ? t("catalog.boughtBefore") : undefined, rows: bought.map(toRow) },
      { label: bought.length ? t("catalog.results") : roaster?.name, rows: rest.map(toRow) },
    ];
  }, [data, roaster, t]);

  const pick = (row: PickRow) => {
    if (row.drillIn) {
      setRoaster({ id: row.id, name: row.primary, addedByYou: !!row.addedByYou });
      return;
    }
    router.replace(returnWithSelection(returnTo, row.id));
  };
  const cantFind = () => {
    const add = `/catalog/add?catalog=coffee${query.trim() ? `&q=${encodeURIComponent(query.trim())}` : ""}`;
    router.push(withReturnTo(add, returnTo));
  };

  return (
    <CatalogPickScreen
      labels={{
        title: t("catalog.pickTitle.coffee"),
        search: t("catalog.search"),
        searchHint: t("catalog.searchCoffeeHint"),
        addedByYou: t("catalog.addedByYou"),
        alsoKnownAs: (alias) => t("catalog.alsoKnownAs", { alias }),
        cantFind: t("catalog.cantFind"),
        noMatch: t("catalog.noMatch", { query: query.trim() }),
        loading: t("states.loading"),
        cancel: t("actions.cancel"),
        back: t("catalog.allRoasters"),
        loadFailedTitle: t("states.loadFailedTitle"),
        loadFailed: t("states.loadFailed"),
        retry: t("actions.retry"),
      }}
      query={query}
      onQueryChange={(q) => {
        setQuery(q);
        if (q.trim()) setRoaster(null);
      }}
      state={failed ? "failed" : data ? "ready" : "loading"}
      onRetry={() => setAttempt((n) => n + 1)}
      groups={groups}
      onPick={pick}
      onCantFind={cantFind}
      onCancel={() => router.replace(returnTo)}
      onBack={roaster && !query.trim() ? () => setRoaster(null) : undefined}
    />
  );
}

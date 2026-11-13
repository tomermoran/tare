import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SetupBuilderFlow, type BuilderSetup } from "@/components/setup/SetupBuilderFlow";
import type { HardwareKind } from "@/domain/capabilities";
import { SETUP_KINDS } from "@/domain/setup";
import { partsKey } from "@/domain/setupKey";
import { safeReturnTo } from "@/lib/returnTo";
import { setupLabel } from "@/domain/setupName";
import { getSetupTab } from "@/server/dal/parts";
import { unlessSignedOut } from "@/server/dal/scope";
import { getChangePartStart, suggestionFrom } from "@/server/dal/setups";

/**
 * SCR-TOOLKIT: /setup/builder?machine=…&grinder=…&basket=…&name=…&returnTo=…
 * Explicit choices win. Otherwise it starts from a setup's parts (`from`,
 * "change a part"), the current setup with a new part swapped in
 * (`newPart`, "use the new part?"), or the current setup; with no setup,
 * from the most recently added part of each kind. `selected` is a part
 * just added from one of the rows.
 */
export default function SetupBuilderPage({ searchParams }: PageProps<"/setup/builder">) {
  return (
    <Suspense fallback={null}>
      <Builder searchParams={searchParams} />
    </Suspense>
  );
}

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

async function Builder({ searchParams }: Pick<PageProps<"/setup/builder">, "searchParams">) {
  const params = await searchParams;
  const fromUrl = SETUP_KINDS.some((k) => one(params[k]));
  const [tab, t, format, start] = await Promise.all([
    unlessSignedOut(getSetupTab()),
    getTranslations("setup"),
    getFormatter(),
    fromUrl ? null : unlessSignedOut(getChangePartStart({ setupId: one(params.from), newPartId: one(params.newPart) })),
  ]);
  const parts = tab?.parts ?? { machine: [], grinder: [], basket: [] };
  const list = (items: string[]) => format.list(items, { type: "conjunction" });

  const options = Object.fromEntries(
    SETUP_KINDS.map((k) => [
      k,
      parts[k].map((p) => ({
        id: p.id,
        primary: p.nickname ?? p.model,
        secondary: t("partName", { maker: p.maker, model: p.model }),
      })),
    ]),
  ) as Record<HardwareKind, { id: string; primary: string; secondary: string }[]>;

  const has = (kind: HardwareKind, id: string | undefined) => !!id && parts[kind].some((p) => p.id === id);
  const suggestion = suggestionFrom(parts, []);
  const initial = Object.fromEntries(
    SETUP_KINDS.map((k) => {
      const id = one(params[k]);
      if (fromUrl) return [k, has(k, id) ? id : null];
      return [k, start?.[k] ?? suggestion?.parts[k].id ?? parts[k].at(-1)?.id ?? null];
    }),
  ) as Record<HardwareKind, string | null>;
  const selected = one(params.selected);
  for (const k of SETUP_KINDS) if (has(k, selected)) initial[k] = selected!;

  const setups: BuilderSetup[] = (tab?.setups ?? []).map((s) => ({
    id: s.id,
    key: partsKey(s.parts.map((p) => p.id)),
    partIds: s.parts.map((p) => p.id),
    name: setupLabel(s, tab?.setups ?? [], list),
    recipeCount: t("recipeCount", { count: s.recipeCount }),
    hasRecipes: s.recipeCount > 0,
  }));

  const returnTo = one(params.returnTo);
  return (
    <SetupBuilderFlow
      key={selected ?? "none"}
      options={options}
      initial={initial}
      initialName={one(params.name) ?? ""}
      setups={setups}
      returnTo={returnTo ? safeReturnTo(returnTo, "/setup") : null}
    />
  );
}

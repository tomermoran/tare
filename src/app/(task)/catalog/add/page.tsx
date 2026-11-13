import { Suspense } from "react";
import { CatalogAddInterim } from "@/components/catalog/CatalogAddInterim";
import { HardwareAddFlow } from "@/components/catalog/HardwareAddFlow";
import { db } from "@/db/client";
import type { HardwareKind } from "@/domain/capabilities";
import { safeReturnTo } from "@/lib/returnTo";
import { ADD_PART_PATH } from "@/lib/setupRoutes";
import { listMakers } from "@/server/dal/catalog";
import { requireHousehold, unlessSignedOut } from "@/server/dal/scope";

const KINDS: HardwareKind[] = ["machine", "grinder", "basket"];

/**
 * SCR-CATALOG-ADD: /catalog/add?catalog=hardware&kind=grinder&q=…&returnTo=…
 * Hardware is built (STORY-01-06-01); coffee follows in its own track and
 * keeps the interim screen until then.
 */
export default function CatalogAddPage({ searchParams }: PageProps<"/catalog/add">) {
  return (
    <Suspense fallback={null}>
      <CatalogAdd searchParams={searchParams} />
    </Suspense>
  );
}

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

async function makersFor() {
  const { householdId } = await requireHousehold();
  const lists = await Promise.all(KINDS.map((kind) => listMakers(db, householdId, { kind })));
  const byId = new Map(lists.flat().map((m) => [m.id, m]));
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function CatalogAdd({ searchParams }: Pick<PageProps<"/catalog/add">, "searchParams">) {
  const params = await searchParams;
  if (one(params.catalog) !== "hardware") return <CatalogAddInterim />;
  const kindParam = one(params.kind) as HardwareKind | undefined;
  const kind = kindParam && KINDS.includes(kindParam) ? kindParam : "machine";
  const returnTo = one(params.returnTo);
  const makers = await unlessSignedOut(makersFor());
  return (
    <HardwareAddFlow
      initialKind={kind}
      initialName={(one(params.q) ?? "").slice(0, 80)}
      makers={makers ?? []}
      returnTo={returnTo ? safeReturnTo(returnTo, ADD_PART_PATH) : `${ADD_PART_PATH}?kind=${kind}`}
    />
  );
}

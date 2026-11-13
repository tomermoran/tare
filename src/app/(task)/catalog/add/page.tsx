import { Suspense } from "react";
import { CoffeeAddFlow } from "@/components/catalog/CoffeeAddFlow";
import { HardwareAddFlow } from "@/components/catalog/HardwareAddFlow";
import { db } from "@/db/client";
import type { HardwareKind } from "@/domain/capabilities";
import { safeReturnTo } from "@/lib/returnTo";
import { ADD_PART_PATH } from "@/lib/setupRoutes";
import { listMakers } from "@/server/dal/catalog";
import { listRoasters } from "@/server/dal/coffeeCatalog";
import { requireHousehold, unlessSignedOut } from "@/server/dal/scope";

const KINDS: HardwareKind[] = ["machine", "grinder", "basket"];
const BAG_ADD_PATH = "/beans/add";

/**
 * SCR-CATALOG-ADD: /catalog/add?catalog=hardware&kind=grinder&q=…&returnTo=…
 * or /catalog/add?catalog=coffee&q=…&returnTo=… (STORY-01-06-01, 01-06-02).
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

async function roastersFor() {
  const { householdId } = await requireHousehold();
  return listRoasters(db, householdId);
}

async function CatalogAdd({ searchParams }: Pick<PageProps<"/catalog/add">, "searchParams">) {
  const params = await searchParams;
  const initialName = (one(params.q) ?? "").slice(0, 80);
  if (one(params.catalog) === "coffee") {
    const returnTo = one(params.returnTo);
    const roasters = await unlessSignedOut(roastersFor());
    return (
      <CoffeeAddFlow
        initialName={initialName}
        roasters={roasters ?? []}
        returnTo={returnTo ? safeReturnTo(returnTo, BAG_ADD_PATH) : BAG_ADD_PATH}
      />
    );
  }
  const kindParam = one(params.kind) as HardwareKind | undefined;
  const kind = kindParam && KINDS.includes(kindParam) ? kindParam : "machine";
  const returnTo = one(params.returnTo);
  const makers = await unlessSignedOut(makersFor());
  return (
    <HardwareAddFlow
      initialKind={kind}
      initialName={initialName}
      makers={makers ?? []}
      returnTo={returnTo ? safeReturnTo(returnTo, ADD_PART_PATH) : `${ADD_PART_PATH}?kind=${kind}`}
    />
  );
}

import { Suspense } from "react";
import { AddPartFlow } from "@/components/setup/AddPartFlow";
import type { HardwareKind } from "@/domain/capabilities";
import { localDayKey } from "@/domain/localDay";
import { safeReturnTo } from "@/lib/returnTo";
import { getPartModel, getSetupTab, PART_KINDS } from "@/server/dal/parts";
import { unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";

/**
 * SCR-UNIT-ADD: /setup/add-part?kind=grinder&walk=1&returnTo=…
 * `selected` is the model chosen in the picker; `resume` restores the draft.
 */
export default function AddPartPage({ searchParams }: PageProps<"/setup/add-part">) {
  return (
    <Suspense fallback={null}>
      <AddPart searchParams={searchParams} />
    </Suspense>
  );
}

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

async function AddPart({ searchParams }: Pick<PageProps<"/setup/add-part">, "searchParams">) {
  const params = await searchParams;
  const selected = one(params.selected);
  const kindParam = one(params.kind) as HardwareKind | undefined;
  const returnTo = one(params.returnTo);

  const [picked, tab, timeZone] = await Promise.all([
    selected ? unlessSignedOut(getPartModel(selected)) : null,
    unlessSignedOut(getSetupTab()),
    getTimeZone(),
  ]);
  const haveKinds = tab ? PART_KINDS.filter((k) => tab.parts[k].length > 0) : [];

  return (
    <AddPartFlow
      key={selected ?? "none"}
      initialKind={kindParam && PART_KINDS.includes(kindParam) ? kindParam : "machine"}
      picked={picked ?? null}
      resume={one(params.resume) === "1"}
      walk={one(params.walk) === "1"}
      returnTo={returnTo ? safeReturnTo(returnTo, "/setup") : null}
      haveKinds={haveKinds}
      today={localDayKey(new Date(), timeZone)}
    />
  );
}

import { connection } from "next/server";
import { Suspense } from "react";
import { AddBagFlow } from "@/components/beans/AddBagFlow";
import { localDayKey } from "@/domain/localDay";
import { safeReturnTo } from "@/lib/returnTo";
import { getBagBean } from "@/server/dal/bags";
import { unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";

/**
 * SCR-BAG-ADD: /beans/add?beanId=…&returnTo=…
 * `beanId` starts from a coffee; `selected` is the coffee chosen in the
 * picker; `resume` restores the draft.
 */
export default function AddBagPage({ searchParams }: PageProps<"/beans/add">) {
  return (
    <Suspense fallback={null}>
      <AddBag searchParams={searchParams} />
    </Suspense>
  );
}

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

async function AddBag({ searchParams }: Pick<PageProps<"/beans/add">, "searchParams">) {
  const params = await searchParams;
  const beanId = one(params.selected) ?? one(params.beanId);
  const [picked, timeZone] = await Promise.all([beanId ? unlessSignedOut(getBagBean(beanId)) : null, getTimeZone()]);
  const returnTo = one(params.returnTo);
  // Today depends on the request time, so it is never prerendered.
  await connection();
  const today = localDayKey(new Date(), timeZone);
  return (
    <AddBagFlow
      key={beanId ?? "none"}
      picked={picked ?? null}
      resume={one(params.resume) === "1"}
      returnTo={returnTo ? safeReturnTo(returnTo, "/beans") : null}
      today={today}
    />
  );
}

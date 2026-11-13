import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { BagFlow } from "@/components/beans/BagFlow";
import type { BagFact } from "@/components/screens/BagScreen/BagScreen";
import { getBag } from "@/server/dal/bags";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";
import { bagRows } from "../rows";

/** SCR-BAG: one bag's facts, portions and recipes. */
export default async function BagPage({ params }: PageProps<"/beans/[batchId]">) {
  const { batchId } = await params;
  const [t, format, timeZone] = await Promise.all([getTranslations(), getFormatter(), getTimeZone()]);
  const bag = await unlessSignedOut(getBag(batchId)).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  if (!bag) return null;

  const day = (d: Date) => format.dateTime(d, { dateStyle: "medium", timeZone });
  const rows = await bagRows(timeZone);
  const { grams } = rows;
  const facts: BagFact[] = [
    { label: t("bag.roastDate"), value: bag.roastDate ? day(bag.roastDate) : t("bag.notGiven") },
    ...(bag.packedAt ? [{ label: t("bag.packedDate"), value: day(bag.packedAt) }] : []),
    ...(bag.bestBefore ? [{ label: t("bag.bestBefore"), value: day(bag.bestBefore) }] : []),
    ...(bag.lotCode ? [{ label: t("bag.lot"), value: bag.lotCode }] : []),
    ...(bag.purchasedAt ? [{ label: t("bag.purchased"), value: day(bag.purchasedAt) }] : []),
    { label: t("bag.bagWeight"), value: grams(bag.bagWeight) },
  ];

  return (
    <BagFlow
      labels={{
        back: t("bag.back"),
        facts: t("bag.facts"),
        portions: t("beans.portions"),
        recipes: t("bag.recipes"),
        noRecipes: t("bag.noRecipes"),
      }}
      backHref="/beans"
      bean={bag.bean.name}
      roaster={bag.bean.roasterName}
      facts={facts}
      status={rows.status(bag)}
      total={rows.total(bag.portions.filter((p) => p.state !== "finished"))}
      portions={bag.portions.map(rows.row)}
      info={bag.portions.map(rows.info)}
    />
  );
}

import { getFormatter, getTranslations } from "next-intl/server";
import { BeansScreen, type BagCard } from "@/components/screens/BeansScreen/BeansScreen";
import { getOnHand } from "@/server/dal/bags";
import { unlessSignedOut } from "@/server/dal/scope";
import { ADD_BAG, beansLabels } from "./labels";

/** SCR-PANTRY, the Beans tab: what's on hand, then what's been tried. */
export default async function BeansPage() {
  const [t, format, onHand] = await Promise.all([getTranslations(), getFormatter(), unlessSignedOut(getOnHand())]);
  const grams = (g: number) => format.number(g, { style: "unit", unit: "gram", unitDisplay: "narrow", maximumFractionDigits: 1 });

  const bags: BagCard[] = (onHand ?? []).map((b) => ({
    id: b.id,
    href: `/beans/${b.id}`,
    bean: b.bean.name,
    roaster: b.bean.roasterName,
    portions: b.portions.map((p) => ({ id: p.id, state: t(`portion.state.${p.state}`), remaining: grams(p.weight) })),
  }));

  // Tried (EPIC-03-06) arrives with the journal; until then nothing counts as brewed.
  return <BeansScreen labels={await beansLabels()} state={onHand ? "ready" : "loading"} bags={bags} addBagHref={ADD_BAG} />;
}

import { BeansScreen } from "@/components/screens/BeansScreen/BeansScreen";
import { ADD_BAG, beansLabels } from "./labels";

export default async function BeansLoading() {
  return <BeansScreen state="loading" bags={[]} addBagHref={ADD_BAG} labels={await beansLabels()} />;
}

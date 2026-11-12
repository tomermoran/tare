import { getTranslations } from "next-intl/server";
import { SetupScreen, type PartRow } from "@/components/screens/SetupScreen/SetupScreen";
import type { HardwareKind } from "@/domain/capabilities";
import { getSetupTab, type Part } from "@/server/dal/parts";
import { unlessSignedOut } from "@/server/dal/scope";
import { ADD_PART, setupLabels } from "./labels";

/** SCR-KIT, the Setup tab: setups, then parts grouped by kind. */
export default async function SetupPage() {
  const t = await getTranslations("setup");
  const tab = await unlessSignedOut(getSetupTab());

  const row = (p: Part): PartRow => ({
    id: p.id,
    primary: p.nickname ?? p.model,
    secondary: t("partName", { maker: p.maker, model: p.model }),
  });
  const rows = (kind: HardwareKind) => (tab?.parts[kind] ?? []).map(row);

  return (
    <SetupScreen
      labels={await setupLabels()}
      state={tab ? "ready" : "loading"}
      parts={{ machine: rows("machine"), grinder: rows("grinder"), basket: rows("basket") }}
      addPartHref={ADD_PART}
      addMachineHref={`${ADD_PART}?kind=machine`}
    />
  );
}

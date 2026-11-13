import { getFormatter, getTranslations } from "next-intl/server";
import { SetupScreen, type PartRow } from "@/components/screens/SetupScreen/SetupScreen";
import { connection } from "next/server";
import { SetupList } from "@/components/setup/SetupList";
import { SetupOffer } from "@/components/setup/SetupOffer";
import type { HardwareKind } from "@/domain/capabilities";
import { SETUP_KINDS } from "@/domain/setup";
import { setupLabel } from "@/domain/setupName";
import { ADD_PART_PATH, BUILDER_PATH, changePartHref, partHref } from "@/lib/setupRoutes";
import { getSetupTab, type Part } from "@/server/dal/parts";
import { unlessSignedOut } from "@/server/dal/scope";
import { getSetups, suggestionFrom } from "@/server/dal/setups";
import { getTimeZone } from "@/server/time";
import { setupLabels } from "./labels";

/** SCR-KIT, the Setup tab: setups (current first), then parts grouped by kind. */
export default async function SetupPage() {
  // "Older" and "last used" depend on the request time.
  await connection();
  const [t, format, tab, setups, timeZone] = await Promise.all([
    getTranslations(),
    getFormatter(),
    unlessSignedOut(getSetupTab()),
    unlessSignedOut(getSetups()),
    getTimeZone(),
  ]);

  const partName = (p: Part) => t("setup.partName", { maker: p.maker, model: p.model });
  const row = (p: Part): PartRow => ({ id: p.id, primary: p.nickname ?? p.model, secondary: partName(p), href: partHref(p.id) });
  const rows = (kind: HardwareKind) => (tab?.parts[kind] ?? []).map(row);
  const list = (items: string[]) => format.list(items, { type: "conjunction" });

  const suggestion = tab ? suggestionFrom(tab.parts, tab.setups) : null;
  const builderHref = suggestion
    ? `${BUILDER_PATH}?${new URLSearchParams(SETUP_KINDS.map((k) => [k, suggestion.parts[k].id]))}`
    : BUILDER_PATH;

  return (
    <SetupScreen
      labels={await setupLabels()}
      state={tab ? "ready" : "loading"}
      parts={{ machine: rows("machine"), grinder: rows("grinder"), basket: rows("basket") }}
      addPartHref={ADD_PART_PATH}
      addMachineHref={`${ADD_PART_PATH}?kind=machine`}
      setupOffer={
        suggestion && (
          <SetupOffer
            title={t("setup.suggestTitle")}
            body={t("setup.suggestBody")}
            action={t("setup.suggest")}
            parts={SETUP_KINDS.map((k) => partName(suggestion.parts[k]))}
            oneTap={suggestion.oneTap}
            builderHref={builderHref}
            saveFailed={t("states.saveFailed")}
          />
        )
      }
      setups={
        setups?.length ? (
          <SetupList
            labels={{
              current: t("setup.current"),
              useThis: t("setup.useThis"),
              changePart: t("setup.changePart"),
              rename: t("setup.rename"),
              renameTitle: t("setup.renameTitle"),
              name: t("setup.name"),
              nameHint: t("setup.nameHint"),
              save: t("actions.save"),
              close: t("actions.close"),
              older: t("setup.older", { count: setups.filter((s) => s.older).length }),
              saveFailed: t("states.saveFailed"),
            }}
            items={setups.map((s) => ({
              id: s.id,
              label: setupLabel(s, setups, list),
              name: s.name,
              current: s.current,
              older: s.older,
              parts: s.parts.map(partName),
              recipeCount: t("setup.recipeCount", { count: s.recipeCount }),
              lastUsed: s.lastUsedAt
                ? t("setup.lastUsed", { date: format.dateTime(s.lastUsedAt, { day: "numeric", month: "long", timeZone }) })
                : t("setup.neverUsed"),
              changePartHref: changePartHref(s.id),
            }))}
          />
        ) : undefined
      }
    />
  );
}

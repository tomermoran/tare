import { getFormatter, getTranslations } from "next-intl/server";
import { SetupScreen, type PartRow } from "@/components/screens/SetupScreen/SetupScreen";
import { SetupCard } from "@/components/setup/SetupCards";
import { SetupOffer } from "@/components/setup/SetupOffer";
import { Notice } from "@/components/ui/Notice/Notice";
import type { HardwareKind } from "@/domain/capabilities";
import { SETUP_KINDS } from "@/domain/setup";
import { setupName } from "@/lib/setupName";
import { ADD_PART_PATH, BUILDER_PATH } from "@/lib/setupRoutes";
import { getSetupTab, type Part } from "@/server/dal/parts";
import { unlessSignedOut } from "@/server/dal/scope";
import { suggestionFrom } from "@/server/dal/setups";
import { setupLabels } from "./labels";

/** SCR-KIT, the Setup tab: setups, then parts grouped by kind. */
export default async function SetupPage({ searchParams }: PageProps<"/setup">) {
  const [t, format, tab, params] = await Promise.all([
    getTranslations(),
    getFormatter(),
    unlessSignedOut(getSetupTab()),
    searchParams,
  ]);

  const partName = (p: Part) => t("setup.partName", { maker: p.maker, model: p.model });
  const row = (p: Part): PartRow => ({ id: p.id, primary: p.nickname ?? p.model, secondary: partName(p) });
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
      notice={params.notice === "setupExists" ? <Notice>{t("setup.existsNotice")}</Notice> : undefined}
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
        tab?.setups.length ? (
          <div className="flex flex-col gap-4">
            {tab.setups.map((s, i) => (
              <SetupCard
                key={s.id}
                // Milestone 1 has one setup, so it's the current one.
                overline={i === 0 ? t("setup.current") : undefined}
                name={setupName(s, list)}
                parts={s.parts.map(partName)}
                recipeCount={t("setup.recipeCount", { count: s.recipeCount })}
              />
            ))}
          </div>
        ) : undefined
      }
    />
  );
}

import { getTranslations } from "next-intl/server";
import { Checklist, type ChecklistStep } from "@/components/ui/Checklist/Checklist";
import { SetupOffer } from "@/components/setup/SetupOffer";
import { SETUP_KINDS } from "@/domain/setup";
import { LOG_PATH } from "@/lib/logRoutes";
import { ADD_PART_PATH, BUILDER_PATH } from "@/lib/setupRoutes";
import { getSetupTab, type Part } from "@/server/dal/parts";
import type { SetupProgress } from "@/server/dal/progress";
import { suggestionFrom } from "@/server/dal/setups";

const HOME = "/";

/**
 * The first-run checklist on Brew (STORY-01-01-07): parts, a bag, the first
 * shot. Step 1 walks through machine, grinder and basket in one pass and
 * ends back here (AC 2); with all three and no setup it offers to make them
 * the setup (AC 4). The first step not done is the one offered (AC 3).
 */
export async function FirstRun({ progress }: { progress: SetupProgress }) {
  const t = await getTranslations();
  const missing = SETUP_KINDS.find((k) => !{ machine: progress.hasMachine, grinder: progress.hasGrinder, basket: progress.hasBasket }[k]);

  let offer = null;
  if (!missing && !progress.hasSetup) {
    const tab = await getSetupTab();
    const suggestion = suggestionFrom(tab.parts, tab.setups);
    if (suggestion) {
      const partName = (p: Part) => t("setup.partName", { maker: p.maker, model: p.model });
      offer = (
        <SetupOffer
          title={t("setup.suggestTitle")}
          body={t("setup.suggestBody")}
          action={t("setup.suggest")}
          parts={SETUP_KINDS.map((k) => partName(suggestion.parts[k]))}
          oneTap={suggestion.oneTap}
          builderHref={`${BUILDER_PATH}?${new URLSearchParams([...SETUP_KINDS.map((k): [string, string] => [k, suggestion.parts[k].id]), ["returnTo", HOME]])}`}
          saveFailed={t("states.saveFailed")}
        />
      );
    }
  }

  const done = [progress.hasSetup, progress.hasUnfinishedPortion, progress.hasShot];
  const nextIndex = done.indexOf(false);
  const state = (i: number): ChecklistStep["state"] => (done[i] ? "done" : i === nextIndex ? "next" : "later");
  const walk = new URLSearchParams({ kind: missing ?? "machine", walk: "1", returnTo: HOME });

  const steps: ChecklistStep[] = [
    {
      id: "parts",
      title: t("home.firstRun.parts"),
      hint: offer ? undefined : t("home.firstRun.partsHint"),
      state: state(0),
      action: { label: t("home.firstRun.addParts"), href: `${ADD_PART_PATH}?${walk}` },
      detail: offer ?? undefined,
    },
    {
      id: "bag",
      title: t("home.firstRun.bag"),
      hint: t("home.firstRun.bagHint"),
      state: state(1),
      action: { label: t("home.firstRun.addBag"), href: `/beans/add?${new URLSearchParams({ returnTo: HOME })}` },
    },
    {
      id: "shot",
      title: t("home.firstRun.shot"),
      hint: t("home.firstRun.shotHint"),
      state: state(2),
      action: { label: t("home.firstRun.logShot"), href: LOG_PATH },
    },
  ];

  return (
    <section aria-labelledby="first-run" className="flex flex-col gap-2">
      <h1 id="first-run" className="text-h1 font-light text-ink">
        {t("home.firstRun.title")}
      </h1>
      <p className="text-body text-ink-secondary">{t("home.firstRun.body")}</p>
      <Checklist steps={steps} doneLabel={t("home.firstRun.done")} className="mt-4" />
    </section>
  );
}

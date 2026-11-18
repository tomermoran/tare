"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { milkLabel } from "@/domain/milkName";
import type { ActionResult } from "@/lib/actionResult";
import { msToSeconds } from "@/lib/units";
import { pinEnteredRecipeAction, pinFromShotAction, pinPreviewAction, enteredPinPreviewAction } from "@/server/actions/recipes";
import type { EnteredRecipe, PinPreview, PinScope, RecipeField, RecipeValues } from "@/server/dal/recipes";
import { PinSheet, type PinRecipeView } from "./PinSheet";
import { forPersonLine } from "@/lib/forPerson";
import { useOffsetFlow } from "./useOffsetFlow";

type Source = { kind: "shot"; shotId: string } | { kind: "entered"; input: EnteredRecipe };

/**
 * Pinning (STORY-02-01-01, STORY-02-01-02): loads the preview, puts it into
 * words for SH-PIN, confirms, and says "pinned" in a live region. `title`
 * names the drink, coffee and setup. A failed preview or pin is said in the
 * same place, or on the sheet with a retry.
 */
export function usePinFlow({
  title,
  onPinned,
  redial = false,
}: {
  title: string;
  onPinned?: () => void;
  /** Came to re-dial after servicing: with no baseline, the offset sheet says why (STORY-04-03-01 AC 4). */
  redial?: boolean;
}): {
  pinShot: (shotId: string) => Promise<void>;
  pinEntered: (input: EnteredRecipe) => Promise<void>;
  sheet: ReactNode;
  status: ReactNode;
} {
  const t = useTranslations();
  const format = useFormatter();
  const [source, setSource] = useState<Source | null>(null);
  const [preview, setPreview] = useState<PinPreview | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const [said, setSaid] = useState<string | null>(null);
  const [scope, setScope] = useState<PinScope>("bean");
  // A pin after a grinder was serviced may propose a shift (STORY-04-03-01); onPinned waits for it.
  const offset = useOffsetFlow({ onDone: onPinned });

  const number = (n: number, unit?: "gram" | "second" | "celsius" | "milliliter", digits = 1) =>
    format.number(n, unit ? { style: "unit", unit, unitDisplay: "short", maximumFractionDigits: digits } : { maximumFractionDigits: digits });
  const milkName = (id: string | null) => (id && preview?.milks[id] ? milkLabel(preview.milks[id], (k) => t(k)) : t("recipe.none"));

  const LABEL: Record<RecipeField, string> = {
    grind: t("shot.grind"),
    dose: t("shot.dose"),
    yield: t("shot.yield"),
    timeMs: t("shot.time"),
    brewTempC: t("shot.temperature"),
    brewTempStep: t("shot.temperature"),
    pressureBar: t("shot.pressure"),
    pressureStep: t("shot.pressure"),
    usedWdt: t("log.prepWdt"),
    usedPuckScreen: t("log.prepPuckScreen"),
    milkTypeId: t("shot.milk"),
    milkMl: t("log.milkAmount"),
    sweetened: t("log.sweetened"),
  };

  const value = (v: RecipeValues, f: RecipeField): string => {
    const x = v[f];
    if (x === null || x === undefined) return t("recipe.none");
    switch (f) {
      case "grind":
        return number(x as number);
      case "dose":
      case "yield":
        return number(x as number, "gram");
      case "timeMs":
        return number(msToSeconds(x as number), "second");
      case "brewTempC":
        return number(x as number, "celsius");
      case "pressureBar":
        return t("shot.units.barValue", { value: number(x as number) });
      case "brewTempStep":
      case "pressureStep":
        return t("recipe.step", { step: number(x as number, undefined, 0) });
      case "usedWdt":
      case "usedPuckScreen":
        return t(x ? "recipe.yes" : "recipe.no");
      case "sweetened":
        return t(x ? "shot.sweetenedYes" : "shot.sweetenedNo");
      case "milkTypeId":
        return milkName(x as string);
      case "milkMl":
        return number(x as number, "milliliter", 0);
    }
  };

  const view = (v: RecipeValues): PinRecipeView => {
    const lines: string[] = [];
    if (v.milkTypeId || v.milkMl !== null) {
      lines.push(t("shot.milkLine", { milk: milkName(v.milkTypeId), amount: v.milkMl === null ? t("recipe.none") : value(v, "milkMl") }));
    }
    const tools = [v.usedWdt && t("log.prepWdt"), v.usedPuckScreen && t("log.prepPuckScreen")].filter((x): x is string => !!x);
    if (tools.length) lines.push(t("recipe.prepLine", { tools: format.list(tools, { type: "conjunction" }) }));
    // Said only when yes, like prep (design 5.0a, item 1).
    if (v.sweetened) lines.push(t("recipe.sweetenedLine"));
    const temp = v.brewTempC !== null ? "brewTempC" : v.brewTempStep !== null ? "brewTempStep" : null;
    if (temp) lines.push(t("recipe.valueLine", { field: LABEL[temp], value: value(v, temp) }));
    const pressure = v.pressureBar !== null ? "pressureBar" : v.pressureStep !== null ? "pressureStep" : null;
    if (pressure) lines.push(t("recipe.valueLine", { field: LABEL[pressure], value: value(v, pressure) }));
    return { values: { grind: v.grind, dose: v.dose, yield: v.yield, timeMs: v.timeMs }, lines };
  };

  const open = async (next: Source, load: () => Promise<ActionResult<PinPreview>>) => {
    setSaid(null);
    setState("idle");
    const result = await load();
    if (!result.ok) return setSaid(t("states.saveFailed"));
    setSource(next);
    setPreview(result.data);
    setScope(result.data.scope.default);
  };
  const close = () => {
    setPreview(null);
    setSource(null);
    setState("idle");
  };
  const confirm = async () => {
    if (!source) return;
    setState("saving");
    const chosen = preview?.scope.offered ? scope : "bean";
    const result = source.kind === "shot" ? await pinFromShotAction(source.shotId, chosen) : await pinEnteredRecipeAction(source.input, chosen);
    if (!result.ok) return setState("failed");
    close();
    setSaid(t(chosen === "batch" ? "recipe.pinnedBag" : "recipe.pinned"));
    await offset.afterPin(result.data.id, { redial });
  };

  // What the chosen scope replaces (STORY-02-04-01, design step 5): swapped in place, with no loading.
  const replaced = preview ? preview.scope.replaces[scope] : null;
  const differences = preview ? preview.scope.differences[scope] : [];
  const bagHasOwn = !!preview?.scope.replaces.batch && preview.scope.replaces.batch.id !== preview.scope.replaces.bean?.id;
  // A bag with no recipe of its own keeps the coffee's: it is shown "instead of", not replaced.
  const replacesLabel = scope === "batch" && !bagHasOwn ? t("recipe.insteadOf") : t("recipe.replaces");
  const effect = !preview
    ? ""
    : preview.scope.finished
      ? t("recipe.scope.bagFinished")
      : scope === "batch"
        ? t("recipe.scope.batchEffect")
        : bagHasOwn
          ? t("recipe.scope.bagKeeps")
          : t("recipe.scope.beanEffect");

  const pinSheet = preview && (
    <PinSheet
      open
      forPerson={forPersonLine(t, preview.persona, "recipe.forPerson")}
      onClose={close}
      labels={{
        title,
        close: t("actions.close"),
        newRecipe: t("recipe.newRecipe"),
        replaces: replacesLabel,
        changes: t("recipe.changes"),
        confirm: t("recipe.confirmPin"),
      }}
      scope={
        preview.scope.offered
          ? {
              label: t("recipe.scope.label"),
              options: [
                { value: "bean", label: t("recipe.scope.bean") },
                { value: "batch", label: t("recipe.scope.batch"), disabled: preview.scope.finished },
              ],
              value: scope,
              onChange: (v) => setScope(v === "batch" ? "batch" : "bean"),
              effect,
            }
          : undefined
      }
      recipe={view(preview.values)}
      replaces={
        replaced
          ? (() => {
              // The replaced recipe as it reads now, its servicing shift said (STORY-04-03-03 AC 1).
              const v = view(replaced);
              return replaced.servicing?.length ? { ...v, lines: [t("recipe.servicedLine", { grind: number(replaced.servicing[0].from) }), ...v.lines] } : v;
            })()
          : null
      }
      changes={replaced ? differences.map((f) => t("recipe.change", { field: LABEL[f], from: value(replaced, f), to: value(preview.values, f) })) : []}
      onConfirm={() => void confirm()}
      saving={state === "saving"}
      failure={state === "failed" ? { message: t("states.saveFailed"), retryLabel: t("actions.retry"), onRetry: () => void confirm() } : undefined}
    />
  );

  const status = (
    <p role="status" className="text-label text-ink-secondary empty:hidden">
      {offset.said ?? said}
    </p>
  );

  return {
    pinShot: (shotId) => open({ kind: "shot", shotId }, () => pinPreviewAction(shotId)),
    pinEntered: (input) => open({ kind: "entered", input }, () => enteredPinPreviewAction(input)),
    sheet: (
      <>
        {pinSheet}
        {offset.sheet}
      </>
    ),
    status,
  };
}

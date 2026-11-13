"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { milkLabel } from "@/domain/milkName";
import type { ActionResult } from "@/lib/actionResult";
import { msToSeconds } from "@/lib/units";
import { pinEnteredRecipeAction, pinFromShotAction, pinPreviewAction, enteredPinPreviewAction } from "@/server/actions/recipes";
import type { EnteredRecipe, PinPreview, RecipeField, RecipeValues } from "@/server/dal/recipes";
import { PinSheet, type PinRecipeView } from "./PinSheet";

type Source = { kind: "shot"; shotId: string } | { kind: "entered"; input: EnteredRecipe };

/**
 * Pinning (STORY-02-01-01, STORY-02-01-02): loads the preview, puts it into
 * words for SH-PIN, confirms, and says "pinned" in a live region. `title`
 * names the drink, coffee and setup. A failed preview or pin is said in the
 * same place, or on the sheet with a retry.
 */
export function usePinFlow({ title, onPinned }: { title: string; onPinned?: () => void }): {
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
  };
  const close = () => {
    setPreview(null);
    setSource(null);
    setState("idle");
  };
  const confirm = async () => {
    if (!source) return;
    setState("saving");
    const result = source.kind === "shot" ? await pinFromShotAction(source.shotId) : await pinEnteredRecipeAction(source.input);
    if (!result.ok) return setState("failed");
    close();
    setSaid(t("recipe.pinned"));
    onPinned?.();
  };

  const sheet = preview && (
    <PinSheet
      open
      onClose={close}
      labels={{
        title,
        close: t("actions.close"),
        newRecipe: t("recipe.newRecipe"),
        replaces: t("recipe.replaces"),
        changes: t("recipe.changes"),
        confirm: t("recipe.confirmPin"),
      }}
      recipe={view(preview.values)}
      replaces={preview.replaces ? view(preview.replaces) : null}
      changes={preview.replaces ? preview.differences.map((f) => t("recipe.change", { field: LABEL[f], from: value(preview.replaces!, f), to: value(preview.values, f) })) : []}
      onConfirm={() => void confirm()}
      saving={state === "saving"}
      failure={state === "failed" ? { message: t("states.saveFailed"), retryLabel: t("actions.retry"), onRetry: () => void confirm() } : undefined}
    />
  );

  const status = (
    <p role="status" className="text-label text-ink-secondary empty:hidden">
      {said}
    </p>
  );

  return {
    pinShot: (shotId) => open({ kind: "shot", shotId }, () => pinPreviewAction(shotId)),
    pinEntered: (input) => open({ kind: "entered", input }, () => enteredPinPreviewAction(input)),
    sheet,
    status,
  };
}

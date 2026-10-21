"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { SelectField } from "@/components/ui/SelectField/SelectField";
import { ShotDial, type DialField } from "@/components/ui/ShotDial/ShotDial";
import type { ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import { Toggle } from "@/components/ui/Toggle/Toggle";
import { msToSeconds, secondsToMs } from "@/lib/units";

type Mode = "new" | "dialIn" | "fix" | "edit";

type ShotLogScreenProps = {
  mode: Mode;
  setup: string;
  drink: string;
  coffee: string;
  /** Starting values: the recipe, the last shot or the saved shot, per mode. */
  start: ShotValuesData;
  /** The grinder's scale; the MVP default is a stepless 0-40 dial. */
  grind?: { min: number; max: number; step: number };
  onCancel?: () => void;
  onSave?: (values: ShotValuesData, sweetened: boolean) => void;
  onPick?: (field: "setup" | "drink" | "coffee") => void;
};

const titleKey = { new: "titleNew", dialIn: "titleDialIn", fix: "titleFix", edit: "titleEdit" } as const;
const noop = () => {};

/**
 * The shot log (SCR-LOG): context arrives pre-chosen, one value is edited at
 * a time, and Save is the only primary button.
 */
export function ShotLogScreen({
  mode,
  setup,
  drink,
  coffee,
  start,
  grind = { min: 0, max: 40, step: 0.5 },
  onCancel = noop,
  onSave = noop,
  onPick = noop,
}: ShotLogScreenProps) {
  const t = useTranslations("log");
  const tShot = useTranslations("shot");
  const tActions = useTranslations("actions");
  const format = useFormatter();
  const startSeconds = { grind: start.grind, dose: start.dose, yield: start.yield, time: msToSeconds(start.timeMs) };
  const [values, setValues] = useState(startSeconds);
  const [selected, setSelected] = useState("grind");
  const [sweetened, setSweetened] = useState(false);

  const fields: DialField[] = [
    { key: "grind", label: tShot("grind"), value: values.grind, startValue: startSeconds.grind, ...grind, majorEvery: 2 },
    { key: "dose", label: tShot("dose"), value: values.dose, startValue: startSeconds.dose, min: 5, max: 30, step: 0.1, majorEvery: 10, unit: "gram" },
    { key: "yield", label: tShot("yield"), value: values.yield, startValue: startSeconds.yield, min: 10, max: 80, step: 0.1, majorEvery: 10, unit: "gram" },
    { key: "time", label: tShot("time"), value: values.time, startValue: startSeconds.time, min: 0, max: 60, step: 0.1, majorEvery: 10, unit: "second" },
  ];

  return (
    <div className="flex flex-1 flex-col [&>*]:shrink-0">
      <PageHeader
        variant="task"
        title={t(titleKey[mode])}
        start={
          <Button variant="ghost" size="sm" className="-ms-4" onClick={onCancel}>
            {tActions("cancel")}
          </Button>
        }
      />
      <div data-testid="log-context" className="mt-2 grid gap-px overflow-hidden rounded-md bg-line">
        <SelectField label={t("setup")} value={setup} onClick={() => onPick("setup")} />
        <SelectField label={t("drink")} value={drink} onClick={() => onPick("drink")} />
        <SelectField label={t("coffee")} value={coffee} onClick={() => onPick("coffee")} />
      </div>
      <ShotDial
        label={t("values")}
        fields={fields}
        selected={selected}
        onSelect={setSelected}
        onChange={(key, v) => setValues((s) => ({ ...s, [key]: v }))}
        className="mt-6"
      />
      <p className="mt-2 text-center text-label text-ink-secondary">
        {tShot("ratio", { ratio: format.number(values.yield / values.dose, { maximumFractionDigits: 1 }) })}
      </p>
      <Toggle label={t("sweetened")} checked={sweetened} onChange={setSweetened} className="mt-5 border-t border-line py-4" />
      <div className="mt-auto pt-4">
        <Button
          variant="primary"
          fullWidth
          onClick={() =>
            onSave(
              { grind: values.grind, dose: values.dose, yield: values.yield, timeMs: secondsToMs(values.time) },
              sweetened,
            )
          }
        >
          {t("save")}
        </Button>
      </div>
    </div>
  );
}

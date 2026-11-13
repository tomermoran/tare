"use client";

import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
import { SETTING_COUNTS, type MachineAnswers, type PressureAnswer, type TemperatureAnswer } from "@/domain/capabilityQuestions";

/*
 * The machine's capability questions (STORY-01-06-06, SCR-CATALOG-ADD
 * step 4): can you set the brew temperature, and can you set or read the
 * pressure. A follow-up appears only after the answer that needs it, and
 * every question ends in "not sure". A machine with neither control needs
 * two taps. Props only; numbers and unit symbols come from the caller.
 */

export type MachineQuestionLabels = {
  notSure: string;
  yes: string;
  no: string;
  tempQ: string;
  fewSettings: string;
  exactNumber: string;
  howMany: string;
  /** The settings counts, formatted, by count. */
  counts: Record<(typeof SETTING_COUNTS)[number], string>;
  unitQ: string;
  /** "°C" and "°F", from Intl. */
  celsius: string;
  fahrenheit: string;
  lowest: string;
  highest: string;
  rangeHint: string;
  pressureQ: string;
  byHand: string;
  gaugeQ: string;
  /** The bar symbol, for the exact pressure fields. */
  bar: string;
};

const NOT_SURE = "notSure";

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-body text-ink">{label}</p>
      {children}
    </div>
  );
}

function FollowUp({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 border-s border-line ps-4">{children}</div>;
}

function Range({
  labels,
  unit,
  min,
  max,
  onChange,
}: {
  labels: Pick<MachineQuestionLabels, "lowest" | "highest" | "rangeHint">;
  unit?: string;
  min: string;
  max: string;
  onChange: (next: { min: string; max: string }) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-4">
        <Input label={labels.lowest} inputMode="decimal" unit={unit} value={min} onChange={(e) => onChange({ min: e.target.value, max })} />
        <Input label={labels.highest} inputMode="decimal" unit={unit} value={max} onChange={(e) => onChange({ min, max: e.target.value })} />
      </div>
      <p className="text-label text-ink-secondary">{labels.rangeHint}</p>
    </div>
  );
}

function CountQuestion({
  labels,
  count,
  onChange,
}: {
  labels: Pick<MachineQuestionLabels, "howMany" | "counts" | "notSure">;
  count: TemperatureAnswer["count"];
  onChange: (count: TemperatureAnswer["count"]) => void;
}) {
  return (
    <ChipGroup
      label={labels.howMany}
      options={[...SETTING_COUNTS.map((n) => ({ value: String(n), label: labels.counts[n] })), { value: NOT_SURE, label: labels.notSure }]}
      value={count === null ? null : String(count)}
      onChange={(v) => onChange(v === NOT_SURE ? NOT_SURE : Number(v))}
    />
  );
}

export function MachineQuestions({
  labels,
  answers,
  onChange,
}: {
  labels: MachineQuestionLabels;
  answers: MachineAnswers;
  onChange: (answers: MachineAnswers) => void;
}) {
  const temp = answers.temperature;
  const pressure = answers.pressure;
  const setTemp = (patch: Partial<TemperatureAnswer>) => onChange({ ...answers, temperature: { ...temp, ...patch } });
  const setPressure = (patch: Partial<PressureAnswer>) => onChange({ ...answers, pressure: { ...pressure, ...patch } });
  const tempUnit = temp.unit === "F" ? labels.fahrenheit : temp.unit === "C" ? labels.celsius : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Question label={labels.tempQ}>
        <ChipGroup
          label={labels.tempQ}
          options={[
            { value: "none", label: labels.no },
            { value: "steps", label: labels.fewSettings },
            { value: "exact", label: labels.exactNumber },
            { value: NOT_SURE, label: labels.notSure },
          ]}
          value={temp.choice}
          onChange={(v) => setTemp({ choice: v as TemperatureAnswer["choice"] })}
        />
        {temp.choice === "steps" && (
          <FollowUp>
            <Question label={labels.howMany}>
              <CountQuestion labels={labels} count={temp.count} onChange={(count) => setTemp({ count })} />
            </Question>
          </FollowUp>
        )}
        {temp.choice === "exact" && (
          <FollowUp>
            <Question label={labels.unitQ}>
              <ChipGroup
                label={labels.unitQ}
                options={[
                  { value: "C", label: labels.celsius },
                  { value: "F", label: labels.fahrenheit },
                  { value: NOT_SURE, label: labels.notSure },
                ]}
                value={temp.unit}
                onChange={(v) => setTemp({ unit: v as TemperatureAnswer["unit"] })}
              />
            </Question>
            <Range labels={labels} unit={tempUnit} min={temp.min} max={temp.max} onChange={setTemp} />
          </FollowUp>
        )}
      </Question>

      <Question label={labels.pressureQ}>
        <ChipGroup
          label={labels.pressureQ}
          options={[
            { value: "none", label: labels.no },
            { value: "manual", label: labels.byHand },
            { value: "steps", label: labels.fewSettings },
            { value: "exact", label: labels.exactNumber },
            { value: NOT_SURE, label: labels.notSure },
          ]}
          value={pressure.choice}
          onChange={(v) => setPressure({ choice: v as PressureAnswer["choice"] })}
        />
        {pressure.choice === "manual" && (
          <FollowUp>
            <Question label={labels.gaugeQ}>
              <ChipGroup
                label={labels.gaugeQ}
                options={[
                  { value: "yes", label: labels.yes },
                  { value: "no", label: labels.no },
                  { value: NOT_SURE, label: labels.notSure },
                ]}
                value={pressure.gauge}
                onChange={(v) => setPressure({ gauge: v as PressureAnswer["gauge"] })}
              />
            </Question>
          </FollowUp>
        )}
        {pressure.choice === "steps" && (
          <FollowUp>
            <Question label={labels.howMany}>
              <CountQuestion labels={labels} count={pressure.count} onChange={(count) => setPressure({ count })} />
            </Question>
          </FollowUp>
        )}
        {pressure.choice === "exact" && (
          <FollowUp>
            <Range labels={labels} unit={labels.bar} min={pressure.min} max={pressure.max} onChange={setPressure} />
          </FollowUp>
        )}
      </Question>
    </div>
  );
}

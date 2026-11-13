"use client";

import { useFormatter, useTranslations } from "next-intl";
import {
  parseCapabilities,
  type BasketCapabilities,
  type GrinderCapabilities,
  type HardwareKind,
  type MachineCapabilities,
} from "@/domain/capabilities";

/*
 * What a model can control, as short read-only lines (SCR-UNIT-ADD,
 * SCR-UNIT): a machine's temperature and pressure, a grinder's dial, a
 * basket's dose range. Built from unit.cap.* messages with Intl unit
 * formatting; every unknown value reads "not sure" (household additions).
 */

type Props = {
  kind: HardwareKind;
  /** As stored on the catalog row; checked against the kind before showing. */
  capabilities: unknown;
};

export function useCapabilityLines() {
  const t = useTranslations("unit");
  const format = useFormatter();
  const notSure = t("capNotSure");

  const num = (v: number | null, unit?: "celsius" | "fahrenheit" | "gram" | "bar") => {
    if (v === null) return notSure;
    // Intl has no bar unit, so it comes from a message around the number.
    if (unit === "bar") return t("barValue", { value: format.number(v, { maximumFractionDigits: 2 }) });
    if (!unit) return format.number(v, { maximumFractionDigits: 2 });
    // "short" keeps the scale on temperatures (°F, not a bare °).
    return format.number(v, { style: "unit", unit, unitDisplay: unit === "gram" ? "narrow" : "short", maximumFractionDigits: 2 });
  };
  const count = (v: number | null) => (v === null ? notSure : format.number(v));
  const gauge = (g: boolean | null) => (g === null ? "unknown" : String(g));

  return (kind: HardwareKind, raw: unknown): string[] => {
    // Household additions may have "not sure" values, so allow them here.
    const capabilities = parseCapabilities(kind, raw, { allowNotSure: true });
    if (!capabilities) return [];
    if (kind === "machine") {
      const { temperature: temp, pressure } = capabilities as MachineCapabilities;
      const tempUnit = temp.control === "exact" ? (temp.unit === "F" ? "fahrenheit" : temp.unit === "C" ? "celsius" : undefined) : undefined;
      const lines = [
        temp.control === "none"
          ? t("cap.temperatureNone")
          : temp.control === "steps"
            ? t("cap.temperatureSteps", { count: count(temp.count) })
            : temp.control === "exact"
              ? t("cap.temperatureExact", { min: num(temp.min, tempUnit), max: num(temp.max, tempUnit), step: num(temp.step, tempUnit) })
              : t("cap.temperatureUnknown"),
        pressure.control === "none"
          ? t("cap.pressureNone", { gauge: gauge(pressure.gauge) })
          : pressure.control === "manual"
            ? t("cap.pressureManual", { gauge: gauge(pressure.gauge) })
            : pressure.control === "steps"
              ? t("cap.pressureSteps", { count: count(pressure.count) })
              : pressure.control === "exact"
                ? t("cap.pressureExact", { min: num(pressure.min, "bar"), max: num(pressure.max, "bar"), step: num(pressure.step, "bar") })
                : t("cap.pressureUnknown"),
      ];
      return lines;
    }
    if (kind === "grinder") {
      const { grind } = capabilities as GrinderCapabilities;
      const values = { min: num(grind.min), max: num(grind.max), step: num(grind.step) };
      return [
        grind.type === "stepped"
          ? t("cap.grindStepped", values)
          : grind.type === "stepless"
            ? t("cap.grindStepless", values)
            : t("cap.grindUnknown", values),
        grind.coarser === "higher"
          ? t("cap.coarserHigher")
          : grind.coarser === "lower"
            ? t("cap.coarserLower")
            : t("cap.coarserUnknown"),
      ];
    }
    const { dose } = capabilities as BasketCapabilities;
    if (!dose) return [t("cap.doseUnknown")];
    return [t("cap.dose", { min: num(dose.min, "gram"), max: num(dose.max, "gram") })];
  };
}

export function CapabilitySummary(props: Props) {
  const lines = useCapabilityLines()(props.kind, props.capabilities);
  return (
    <ul className="flex flex-col gap-1 text-label text-ink-secondary">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

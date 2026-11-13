import type { BasketCapabilities, GrindScale, MachineCapabilities } from "./capabilities";

/*
 * DQ-11: what the shot log uses for "not sure" equipment (STORY-01-06-08,
 * design "Shot log with 'not sure' capabilities"). A "not sure" answer never
 * blocks logging and never invents a guess that matters: an unknown control
 * gets no tab, an unknown count or range gets a wide neutral one, and an
 * unknown grind direction gets no finer or coarser captions. An unknown
 * basket range gives no dose bound, so dose is never suggested.
 */

export const FALLBACKS = {
  /** Settings shown as a numbered ChipGroup when the count isn't known. */
  settingsCount: 5,
  temperature: {
    C: { min: 80, max: 100, step: 0.5 },
    // The same span for a machine that shows Fahrenheit.
    F: { min: 176, max: 212, step: 1 },
  },
  pressure: { min: 0, max: 12, step: 0.5 },
  grind: { min: 0, max: 100, smoothStep: 0.1, clickStep: 1 },
} as const;

export type EffectiveTemperature =
  | { control: "none" }
  | { control: "steps"; count: number }
  | { control: "exact"; unit: "C" | "F"; min: number; max: number; step: number };

export type EffectivePressure =
  | { control: "none" | "manual"; gauge: boolean }
  | { control: "steps"; count: number }
  | { control: "exact"; min: number; max: number; step: number };

export type EffectiveGrind = {
  type: "stepped" | "stepless";
  min: number;
  max: number;
  step: number;
  /** Null when the direction isn't known: no captions. */
  coarser: "higher" | "lower" | null;
};

/** A range with the fallback for whatever's missing or back to front. */
function range(min: number | null, max: number | null, fallback: { min: number; max: number }) {
  const lo = min ?? fallback.min;
  const hi = max ?? fallback.max;
  return lo < hi ? { min: lo, max: hi } : { min: fallback.min, max: fallback.max };
}

export function effectiveTemperature(t: MachineCapabilities["temperature"]): EffectiveTemperature {
  switch (t.control) {
    case "unknown":
    case "none":
      return { control: "none" };
    case "steps":
      return { control: "steps", count: t.count ?? FALLBACKS.settingsCount };
    case "exact": {
      const unit = t.unit ?? "C";
      const fallback = FALLBACKS.temperature[unit];
      return { control: "exact", unit, ...range(t.min, t.max, fallback), step: t.step ?? fallback.step };
    }
  }
}

export function effectivePressure(p: MachineCapabilities["pressure"]): EffectivePressure {
  switch (p.control) {
    case "unknown":
      return { control: "none", gauge: false };
    case "none":
    case "manual":
      // A gauge that might not be there can't be read: no pressure tab.
      return { control: p.control, gauge: p.gauge ?? false };
    case "steps":
      return { control: "steps", count: p.count ?? FALLBACKS.settingsCount };
    case "exact":
      return { control: "exact", ...range(p.min, p.max, FALLBACKS.pressure), step: p.step ?? FALLBACKS.pressure.step };
  }
}

export function effectiveGrind(scale: GrindScale | null | undefined): EffectiveGrind {
  const type = scale?.type === "stepped" ? "stepped" : "stepless";
  const step = scale?.step ?? (type === "stepped" ? FALLBACKS.grind.clickStep : FALLBACKS.grind.smoothStep);
  const coarser = scale?.coarser === "higher" || scale?.coarser === "lower" ? scale.coarser : null;
  return { type, ...range(scale?.min ?? null, scale?.max ?? null, FALLBACKS.grind), step, coarser };
}

/** The machine as the log uses it; unknown machine capabilities give no tabs. */
export function effectiveCapabilities(machine: MachineCapabilities | null | undefined) {
  return {
    temperature: machine ? effectiveTemperature(machine.temperature) : ({ control: "none" } as const),
    pressure: machine ? effectivePressure(machine.pressure) : ({ control: "none", gauge: false } as const),
  };
}

/** The basket's dose range for suggestions; null when it isn't known (AC 5). */
export function doseBound(basket: BasketCapabilities | null | undefined): { min: number; max: number } | null {
  return basket?.dose ?? null;
}

/** Whether any answer is "not sure", for the log's quiet link (AC 6). */
export function hasUnknowns(
  caps: { machine?: MachineCapabilities | null; grinder?: GrindScale | null; basket?: BasketCapabilities | null },
): boolean {
  const m = caps.machine;
  const t = m?.temperature;
  const p = m?.pressure;
  const machineUnknown =
    !!m &&
    (t!.control === "unknown" ||
      (t!.control === "steps" && t!.count === null) ||
      (t!.control === "exact" && (t!.unit === null || t!.min === null || t!.max === null)) ||
      p!.control === "unknown" ||
      ((p!.control === "none" || p!.control === "manual") && p!.gauge === null) ||
      (p!.control === "steps" && p!.count === null) ||
      (p!.control === "exact" && (p!.min === null || p!.max === null)));
  const g = caps.grinder;
  const grinderUnknown =
    !!g && (g.type === "unknown" || g.min === null || g.max === null || g.coarser === "unknown" || (g.type === "stepped" && g.step === null));
  const basketUnknown = !!caps.basket && caps.basket.dose === null;
  return machineUnknown || grinderUnknown || basketUnknown;
}

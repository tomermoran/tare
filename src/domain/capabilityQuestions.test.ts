import { describe, expect, it } from "vitest";
import { parseCapabilities, notSureCapabilities, type GrinderCapabilities, type MachineCapabilities } from "./capabilities";
import {
  answerFromDose,
  answersFromGrinder,
  answersFromMachine,
  DOSE_PRESETS,
  doseFromAnswer,
  emptyGrinderAnswers,
  emptyMachineAnswers,
  grinderFromAnswers,
  machineFromAnswers,
  parseDecimal,
  pressureFromAnswer,
  temperatureFromAnswer,
  type GrinderAnswers,
  type MachineAnswers,
  type PressureAnswer,
  type TemperatureAnswer,
} from "./capabilityQuestions";
import { grindWheelConfig } from "./grind";

describe("the basket dose question", () => {
  it("maps each chip to its range", () => {
    for (const p of DOSE_PRESETS) expect(doseFromAnswer({ choice: p.id })).toEqual({ min: p.min, max: p.max });
  });

  it("saves not sure and unanswered as unknown (AC 4)", () => {
    expect(doseFromAnswer({ choice: "notSure" })).toBeNull();
    expect(doseFromAnswer({ choice: null })).toBeNull();
    expect(doseFromAnswer({ choice: "other", min: "", max: "10" })).toBeNull();
  });

  it("reads other as typed, with either decimal separator, low to high", () => {
    expect(doseFromAnswer({ choice: "other", min: "7", max: "10,5" })).toEqual({ min: 7, max: 10.5 });
    expect(doseFromAnswer({ choice: "other", min: "25", max: "23" })).toEqual({ min: 23, max: 25 });
  });

  it("is lossless both ways", () => {
    for (const dose of [null, { min: 17, max: 19 }, { min: 7, max: 10.5 }, { min: 23, max: 25 }]) {
      expect(doseFromAnswer(answerFromDose(dose))).toEqual(dose);
    }
  });

  it("stores a range or not sure that parses as basket capabilities", () => {
    expect(parseCapabilities("basket", { dose: doseFromAnswer({ choice: "17-19" }) })).not.toBeNull();
    expect(parseCapabilities("basket", notSureCapabilities("basket"))).toEqual({ dose: null });
    expect(parseCapabilities("basket", { dose: null }, { allowNotSure: false })).toBeNull();
  });
});

describe("parseDecimal", () => {
  it("accepts positive decimals only", () => {
    expect(parseDecimal(" 18.5 ")).toBe(18.5);
    expect(parseDecimal("18,5")).toBe(18.5);
    for (const bad of ["", "0", "-1", "abc", "1e3", "1.2.3"]) expect(parseDecimal(bad)).toBeNull();
  });
});

describe("notSureCapabilities", () => {
  it("is valid not-sure capabilities for every kind", () => {
    for (const kind of ["machine", "grinder", "basket"] as const) {
      expect(parseCapabilities(kind, notSureCapabilities(kind))).not.toBeNull();
    }
  });
});

describe("the machine questions (STORY-01-06-06)", () => {
  const ask = (temperature: Partial<TemperatureAnswer>, pressure: Partial<PressureAnswer>): MachineAnswers => {
    const a = emptyMachineAnswers();
    return { temperature: { ...a.temperature, ...temperature }, pressure: { ...a.pressure, ...pressure } };
  };

  it("needs only two answers for a machine with no controls (AC 3)", () => {
    expect(machineFromAnswers(ask({ choice: "none" }, { choice: "none" }))).toEqual({
      temperature: { control: "none" },
      pressure: { control: "none", gauge: false },
    });
  });

  it("maps every row of the design's machine table", () => {
    const rows: [Partial<TemperatureAnswer>, MachineCapabilities["temperature"]][] = [
      [{ choice: "steps", count: 3 }, { control: "steps", count: 3 }],
      [{ choice: "steps", count: "notSure" }, { control: "steps", count: null }],
      [{ choice: "exact", unit: "C", min: "88", max: "96,5" }, { control: "exact", unit: "C", min: 88, max: 96.5, step: null }],
      [{ choice: "exact", unit: "F", min: "205", max: "190" }, { control: "exact", unit: "F", min: 190, max: 205, step: null }],
      [{ choice: "exact", unit: "notSure", min: "", max: "" }, { control: "exact", unit: null, min: null, max: null, step: null }],
      [{ choice: "notSure" }, { control: "unknown" }],
    ];
    for (const [answer, temperature] of rows) expect(temperatureFromAnswer({ ...emptyMachineAnswers().temperature, ...answer })).toEqual(temperature);

    const pressure: [Partial<PressureAnswer>, MachineCapabilities["pressure"]][] = [
      [{ choice: "manual", gauge: "yes" }, { control: "manual", gauge: true }],
      [{ choice: "manual", gauge: "no" }, { control: "manual", gauge: false }],
      [{ choice: "manual", gauge: "notSure" }, { control: "manual", gauge: null }],
      [{ choice: "steps", count: 2 }, { control: "steps", count: 2 }],
      [{ choice: "exact", min: "0", max: "12" }, { control: "exact", min: 0, max: 12, step: null }],
      [{ choice: "notSure" }, { control: "unknown" }],
    ];
    for (const [answer, p] of pressure) expect(pressureFromAnswer({ ...emptyMachineAnswers().pressure, ...answer })).toEqual(p);
  });

  it("saves unanswered questions and follow-ups as not sure (AC 4)", () => {
    const caps = machineFromAnswers(emptyMachineAnswers());
    expect(caps).toEqual(notSureCapabilities("machine"));
    expect(machineFromAnswers(ask({ choice: "steps" }, { choice: "manual" }))).toEqual({
      temperature: { control: "steps", count: null },
      pressure: { control: "manual", gauge: null },
    });
    for (const a of [emptyMachineAnswers(), ask({ choice: "exact" }, { choice: "exact", min: "x" })]) {
      expect(parseCapabilities("machine", machineFromAnswers(a))).not.toBeNull();
    }
  });

  it("is lossless both ways", () => {
    const caps: MachineCapabilities[] = [
      notSureCapabilities("machine"),
      { temperature: { control: "none" }, pressure: { control: "none", gauge: false } },
      { temperature: { control: "steps", count: 4 }, pressure: { control: "manual", gauge: null } },
      { temperature: { control: "steps", count: null }, pressure: { control: "steps", count: 3 } },
      { temperature: { control: "exact", unit: "F", min: 190, max: 205, step: null }, pressure: { control: "exact", min: 0, max: 12, step: null } },
      { temperature: { control: "exact", unit: null, min: null, max: 96, step: null }, pressure: { control: "manual", gauge: true } },
    ];
    for (const c of caps) expect(machineFromAnswers(answersFromMachine(c))).toEqual(c);
  });
});

describe("the grinder questions (STORY-01-06-07)", () => {
  const ask = (a: Partial<GrinderAnswers>) => ({ ...emptyGrinderAnswers(), ...a });

  it("maps each combination", () => {
    expect(grinderFromAnswers(ask({ dial: "stepped", min: "0", max: "40", step: "1", coarser: "higher" }))).toEqual({
      grind: { type: "stepped", min: 0, max: 40, step: 1, coarser: "higher" },
    });
    expect(grinderFromAnswers(ask({ dial: "stepless", min: "10", max: "1", step: "0.5", coarser: "lower" }))).toEqual({
      grind: { type: "stepless", min: 1, max: 10, step: null, coarser: "lower" },
    });
    expect(grinderFromAnswers(ask({ dial: "notSure", coarser: "notSure" }))).toEqual(notSureCapabilities("grinder"));
    expect(grinderFromAnswers(emptyGrinderAnswers())).toEqual(notSureCapabilities("grinder"));
  });

  it("ignores a step for a smooth dial (AC 2)", () => {
    expect(grinderFromAnswers(ask({ dial: "stepless", step: "0.2" })).grind.step).toBeNull();
  });

  it("is lossless both ways", () => {
    const caps: GrinderCapabilities[] = [
      notSureCapabilities("grinder"),
      { grind: { type: "stepped", min: 0, max: 40, step: 0.5, coarser: "higher" } },
      { grind: { type: "stepless", min: null, max: 10, step: null, coarser: "lower" } },
      { grind: { type: "unknown", min: 1, max: 30, step: null, coarser: "unknown" } },
    ];
    for (const c of caps) {
      expect(grinderFromAnswers(answersFromGrinder(c))).toEqual(c);
      expect(parseCapabilities("grinder", c)).not.toBeNull();
    }
  });
});

describe("saved grinder answers drive the grind wheel (STORY-01-06-07 AC 4)", () => {
  it("snaps to the dial's clicks, with captions the right way", () => {
    const { grind } = grinderFromAnswers({ dial: "stepped", min: "1", max: "30", step: "1", coarser: "lower" });
    expect(grindWheelConfig(grind)).toEqual({ min: 1, max: 30, step: 1, majorEvery: 5, coarser: "lower" });
  });

  it("falls back for not sure, with no captions", () => {
    const { grind } = grinderFromAnswers({ dial: "notSure", min: "", max: "", step: "", coarser: "notSure" });
    expect(grindWheelConfig(grind)).toEqual({ min: 0, max: 100, step: 0.1, majorEvery: 10, coarser: null });
  });
});

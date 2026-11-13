import { describe, expect, it } from "vitest";
import { parseCapabilities, notSureCapabilities } from "./capabilities";
import { answerFromDose, DOSE_PRESETS, doseFromAnswer, parseDecimal } from "./capabilityQuestions";

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

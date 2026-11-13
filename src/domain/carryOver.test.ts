import { describe, expect, it } from "vitest";
import { NO_BREW_VALUES } from "./brewControls";
import { carryOver } from "./carryOver";

const brew = { brewTempC: 93, brewTempStep: null, pressureBar: 9, pressureStep: null };
const base = { grind: 14, brew, lastGrindOnGrinder: 20, middleGrind: 25 };

describe("carryOver (DQ-20)", () => {
  it("carries grind and brew values on the same grinder and machine", () => {
    expect(carryOver({ ...base, from: { grinderId: "g", machineId: "m" }, to: { grinderId: "g", machineId: "m" } })).toEqual({
      grind: 14,
      grindCarried: true,
      brew,
    });
  });

  it("uses the new grinder's last measured grind, else the middle, and says so (AC 4)", () => {
    const from = { grinderId: "g", machineId: "m" };
    const to = { grinderId: "g2", machineId: "m" };
    expect(carryOver({ ...base, from, to })).toMatchObject({ grind: 20, grindCarried: false });
    expect(carryOver({ ...base, lastGrindOnGrinder: null, from, to })).toMatchObject({ grind: 25, grindCarried: false });
  });

  it("leaves temperature and pressure unset on another machine (AC 5)", () => {
    expect(carryOver({ ...base, from: { grinderId: "g", machineId: "m" }, to: { grinderId: "g", machineId: "m2" } }).brew).toEqual(NO_BREW_VALUES);
  });

  it("never treats two missing parts as the same", () => {
    expect(carryOver({ ...base, from: { grinderId: null, machineId: null }, to: { grinderId: null, machineId: null } })).toMatchObject({
      grindCarried: false,
      brew: NO_BREW_VALUES,
    });
  });
});

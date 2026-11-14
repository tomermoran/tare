import { describe, expect, it } from "vitest";
import { shotActions } from "./shotActions";

describe("shotActions (STORY-02-06-03 AC 3)", () => {
  it("leads a measured shot with pin as recipe, its primary", () => {
    expect(shotActions("measured")).toEqual({ actions: ["pin", "dialIn", "edit"], primary: "pin" });
  });

  it("never offers pin on a one-tap shot, whose primary is edit (STORY-02-01-01 AC 5)", () => {
    const { actions, primary } = shotActions("one-tap");
    expect(actions).not.toContain("pin");
    expect(actions).toEqual(["reaction", "edit", "dialIn"]);
    expect(primary).toBe("edit");
  });

  it("always has the primary among its actions", () => {
    for (const mode of ["measured", "one-tap"] as const) {
      const { actions, primary } = shotActions(mode);
      expect(actions).toContain(primary);
    }
  });
});

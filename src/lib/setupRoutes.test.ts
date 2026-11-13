import { describe, expect, it } from "vitest";
import { afterAddPart } from "./setupRoutes";

const kinds = (...k: string[]) => new Set(k);
const query = (to: string) => Object.fromEntries(new URL(to, "https://tare.invalid").searchParams);

describe("afterAddPart", () => {
  it("walks on to the next missing kind, keeping where the walk ends (STORY-01-01-07 AC 2)", () => {
    const to = afterAddPart({ partId: "p1", have: kinds("machine"), walk: true, returnTo: "/" });
    expect(to.startsWith("/setup/add-part?")).toBe(true);
    expect(query(to)).toEqual({ kind: "grinder", walk: "1", returnTo: "/" });
    expect(query(afterAddPart({ partId: "p2", have: kinds("machine", "grinder"), walk: true, returnTo: "/" })).kind).toBe("basket");
  });

  it("ends the walk at its returnTo once all three kinds exist, without a selection", () => {
    expect(afterAddPart({ partId: "p3", have: kinds("machine", "grinder", "basket"), walk: true, returnTo: "/" })).toBe("/");
    expect(afterAddPart({ partId: "p3", have: kinds("machine", "grinder", "basket"), walk: true, returnTo: null })).toBe("/setup");
  });

  it("walks without a returnTo from Setup", () => {
    expect(query(afterAddPart({ partId: "p1", have: kinds("grinder"), walk: true, returnTo: null }))).toEqual({ kind: "machine", walk: "1" });
  });

  it("returns a picker its new part, or goes to Setup, outside the walk", () => {
    expect(afterAddPart({ partId: "p1", have: kinds("machine"), walk: false, returnTo: "/setup/builder?grinder=g" })).toBe("/setup/builder?grinder=g&selected=p1");
    expect(afterAddPart({ partId: "p1", have: kinds("machine"), walk: false, returnTo: null })).toBe("/setup");
  });
});

import { createFormatter, createTranslator } from "next-intl";
import type { DriftEvidence, GrindAdjustment } from "@/domain/drift";
import messages from "@/i18n/messages/en.json";
import type { ServicingStep } from "@/domain/servicing";
import { grindTrailView, type GrindTrailView } from "@/lib/grindTrail";

/*
 * Example drift adjustments for stories, in words as the app words them.
 * A stepless grinder in half steps, higher is coarser, recipe at 15.
 */

const t = createTranslator({ locale: "en", messages });
const format = createFormatter({ locale: "en", timeZone: "UTC" });

const evidence = (over: Partial<DriftEvidence> = {}): DriftEvidence => ({
  measured: 5,
  windowDays: 3,
  reachedBackTo: null,
  sinceServicing: false,
  leftOutPrep: 0,
  leftOutNoRecipe: 0,
  oneTap: 0,
  people: 1,
  acrossSetups: false,
  ...over,
});

const adjustment = (over: Partial<GrindAdjustment> = {}): GrindAdjustment => ({
  shown: 14.5,
  recipeGrind: 15,
  rows: [{ kind: "aged", delta: -0.5 }],
  limited: false,
  evidence: evidence(),
  wheel: { step: 0.5, coarser: "higher" },
  ...over,
});

const wheel = { step: 0.5, coarser: "higher" as const };
const view = (a: GrindAdjustment | null, roastDays: number | null = 18, useRecipe = true, servicing: ServicingStep[] = []): GrindTrailView =>
  grindTrailView({ adjustment: a, servicing, wheel }, t, format, { roastDays, timeZone: "UTC", useRecipe })!;

/** New burrs on 9 October moved the dial 3 finer; a re-zero on 2 November, 1 coarser. */
const serviced: ServicingStep[] = [{ eventId: "e1", at: new Date(Date.UTC(2026, 9, 9, 12)), from: 18, to: 15, scale: 1 }];
const twice: ServicingStep[] = [...serviced, { eventId: "e2", at: new Date(Date.UTC(2026, 10, 2, 12)), from: 15, to: 16, scale: 1 }];

/** New burrs of another design: steps 10% larger, then the shift, as one step (18 x 1.1 - 3 = 16.8). */
const stretched: ServicingStep[] = [{ eventId: "e3", at: new Date(Date.UTC(2026, 9, 9, 12)), from: 18, to: 16.8, scale: 1.1 }];

export const exampleTrails = {
  aged: view(adjustment()),
  bag: view(adjustment({ shown: 14, rows: [{ kind: "bag", delta: -1 }] })),
  both: view(adjustment({ shown: 14, rows: [{ kind: "aged", delta: -0.5 }, { kind: "bag", delta: -0.5 }] })),
  reachedBack: view(adjustment({ evidence: evidence({ measured: 3, reachedBackTo: new Date(Date.UTC(2026, 9, 28)) }) })),
  pooled: view(adjustment({ evidence: evidence({ people: 2, acrossSetups: true }) })),
  prepLeftOut: view(adjustment({ evidence: evidence({ leftOutPrep: 2, leftOutNoRecipe: 1 }) })),
  directionUnknown: view(adjustment({ shown: 16, rows: [{ kind: "aged", delta: 1 }], wheel: { step: 1, coarser: null } }), null),
  limited: view(
    adjustment({
      shown: 14,
      limited: true,
      rows: [
        { kind: "aged", delta: -1.5 },
        { kind: "bag", delta: -0.5 },
        { kind: "limit", delta: 1 },
      ],
    }),
  ),
  log: view(adjustment(), 18, false),
  serviced: view(null, 18, true, serviced),
  servicedTwice: view(null, 18, true, twice),
  servicedAndAged: view(adjustment(), 18, true, serviced),
  servicedStretch: view(null, 18, true, stretched),
};

"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useRef, useState, type ReactNode } from "react";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { shiftWords } from "@/domain/offset";
import { partHref } from "@/lib/setupRoutes";
import { confirmShiftAction, offsetProposalAction, previewShiftAction, setEventShiftAction } from "@/server/actions/maintenance";
import type { EventDetail, ShiftPreview } from "@/server/dal/redial";
import { OffsetSheet } from "./OffsetSheet";

type Wheel = { step: number; coarser: "higher" | "lower" | null; min: number; max: number };

/** A burrs event's stretch in the sheet (EPIC-04-04): what it rests on, and the shift alone for declining it. */
type Stretch = { count: number; uncertain: boolean; tooClose: boolean; shiftAlone: number };

type Open =
  | { mode: "propose"; eventId: string; recipeId: string; grinderId: string; line: string; aged: number | null; wheel: Wheel; proposed: number; stretch: Stretch | null }
  | { mode: "edit"; eventId: string; line: string | null; wheel: Wheel; current: number; stretch: boolean; onRedialMore?: () => void }
  | { mode: "noBaseline"; grinderId: string }
  | { mode: "awaiting"; eventId: string; onRedial?: () => void };

const decimals = (step: number) => (step >= 1 ? 0 : Math.min(3, Math.ceil(-Math.log10(step) - 1e-9)));

/**
 * SH-OFFSET, wired (STORY-04-03-01, 02, 05). `afterPin` asks for a
 * proposal once a recipe is pinned and opens the sheet when there is one;
 * with no baseline it says why only when the user came to re-dial (AC 4),
 * and a failed proposal says the pin is saved (AC 6). `edit` opens an
 * event's shift from the grinder's screen. The preview follows the wheel.
 * `onDone` runs when the sheet is finished with, or straight away when
 * none opens. After new burrs the sheet carries the stretch too (EPIC-04-04).
 */
export function useOffsetFlow({ onDone }: { onDone?: () => void } = {}): {
  afterPin: (recipeId: string, opts?: { redial?: boolean }) => Promise<void>;
  /**
   * From the grinder's screen; an event awaiting a re-dial offers to start
   * one (STORY-04-03-05 AC 5), and a burrs event with one re-dial a second
   * (STORY-04-04-03 AC 1).
   */
  edit: (event: EventDetail, opts?: { onRedial?: () => void; onRedialMore?: () => void }) => void;
  sheet: ReactNode;
  said: string | null;
} {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [open, setOpen] = useState<Open | null>(null);
  const [shift, setShift] = useState(0);
  const [stretch, setStretch] = useState(0);
  const [preview, setPreview] = useState<ShiftPreview | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const [said, setSaid] = useState<string | null>(null);
  const asked = useRef(0);
  const tried = useRef({ shift: 0, stretch: 0 });

  const grind = (n: number, step: number) => format.number(n, { minimumFractionDigits: decimals(step), maximumFractionDigits: decimals(step) });

  const loadPreview = async (eventId: string, value: number, except: string | null, percent: number) => {
    const ask = ++asked.current;
    const result = await previewShiftAction(eventId, value, except, percent);
    // A later move of the wheel wins.
    if (ask === asked.current) setPreview(result.ok ? result.data : null);
  };

  const show = (next: Open, value: number, percent = 0) => {
    setState("idle");
    setOpen(next);
    setShift(value);
    setStretch(percent);
    setPreview(null);
    if (next.mode === "propose" || next.mode === "edit") void loadPreview(next.eventId, value, next.mode === "propose" ? next.recipeId : null, percent);
  };

  const finish = (message: string | null) => {
    setOpen(null);
    setSaid(message);
    router.refresh();
    onDone?.();
  };

  const afterPin = async (recipeId: string, opts: { redial?: boolean } = {}) => {
    setSaid(null);
    const result = await offsetProposalAction(recipeId);
    if (!result.ok) {
      setSaid(t("offset.failed"));
      return onDone?.();
    }
    const p = result.data;
    if (p.kind === "noBaseline" && opts.redial) return show({ mode: "noBaseline", grinderId: p.grinderId }, 0);
    if (p.kind !== "proposal") return onDone?.();
    const s = p.stretch;
    const line = s
      ? t("offset.lineMany", {
          list: format.list(
            s.coffees.map((c) => t("offset.evidence", { coffee: c.coffee, was: grind(c.was, p.wheel.step), now: grind(c.now, p.wheel.step) })),
            { type: "conjunction" },
          ),
        })
      : t("offset.line", { coffee: p.coffee, was: grind(p.baseline.grind, p.wheel.step), now: grind(p.newGrind, p.wheel.step) });
    show(
      {
        mode: "propose",
        eventId: p.eventId,
        recipeId,
        grinderId: p.grinderId,
        line,
        // With several coffees, one coffee's ageing doesn't describe the fit.
        aged: s ? null : p.ageTakenOff,
        wheel: p.wheel,
        proposed: p.shift,
        stretch: s ? { count: s.coffees.length, uncertain: s.uncertain, tooClose: s.tooClose, shiftAlone: s.shiftAlone } : null,
      },
      p.shift,
      s?.percent ?? 0,
    );
  };

  const edit = (event: EventDetail, opts: { onRedial?: () => void; onRedialMore?: () => void } = {}) =>
    event.state === "awaiting"
      ? show({ mode: "awaiting", eventId: event.id, onRedial: opts.onRedial }, 0)
      : show(
          {
            mode: "edit",
            eventId: event.id,
            line: event.source ? t("offset.editFrom", { coffee: event.source.bean, date: format.dateTime(event.source.at, { day: "numeric", month: "long" }) }) : null,
            wheel: event.wheel,
            current: event.shift ?? 0,
            // Burrs can have a stretch; any other event only shows one it already has (STORY-04-04-02 AC 5).
            stretch: event.kind === "burrs" || event.stretchPercent !== 0,
            onRedialMore: event.redialMore ? opts.onRedialMore : undefined,
          },
          event.shift ?? 0,
          event.stretchPercent,
        );

  const save = async (value: number, percent = 0) => {
    if (!open || open.mode === "noBaseline") return;
    const mode = open.mode;
    tried.current = { shift: value, stretch: percent };
    setState("saving");
    const result =
      open.mode === "propose" ? await confirmShiftAction(open.eventId, value, open.recipeId, percent) : await setEventShiftAction(open.eventId, value, percent);
    if (!result.ok) return setState("failed");
    setState("idle");
    finish(mode === "edit" ? t("offset.saved") : value === 0 && percent === 0 ? t("offset.declined") : t("offset.confirmed"));
  };

  const close = () => {
    setOpen(null);
    onDone?.();
  };

  let sheet: ReactNode = null;
  if (open) {
    const labels = { title: t("offset.title"), close: t("actions.close"), shift: t("offset.shift"), preview: t("offset.preview"), to: t("offset.to") };
    if (open.mode === "noBaseline") {
      sheet = (
        <OffsetSheet
          open
          onClose={close}
          labels={labels}
          message={t("offset.noBaseline")}
          primary={{ label: t("offset.pickAnother"), onClick: () => router.push(partHref(open.grinderId)) }}
        />
      );
    } else if (open.mode === "awaiting") {
      const decline = { label: t("offset.decline"), onClick: () => void save(0) };
      const redial = open.onRedial;
      sheet = (
        <OffsetSheet
          open
          onClose={close}
          labels={labels}
          message={t("maintenance.redialAwaiting")}
          primary={
            redial
              ? {
                  label: t("maintenance.redialStart"),
                  onClick: () => {
                    setOpen(null);
                    redial();
                  },
                }
              : decline
          }
          secondary={redial ? decline : undefined}
          saving={state === "saving"}
          failure={state === "failed" ? { message: t("states.saveFailed"), retryLabel: t("actions.retry"), onRetry: () => void save(0) } : undefined}
        />
      );
    } else {
      const { wheel } = open;
      const span = Math.max(wheel.step * 10, Math.round((wheel.max - wheel.min) / 2 / wheel.step) * wheel.step);
      const words = shiftWords(shift, wheel);
      const except = open.mode === "propose" ? open.recipeId : null;
      const fit = open.mode === "propose" ? open.stretch : null;
      // A stretch shows for a burrs fit that can tell one, and on a burrs event (or one that has one) from the grinder's screen.
      const showStretch = open.mode === "edit" ? open.stretch : !!fit && !fit.tooClose;
      const percent = (n: number) => format.number(Math.abs(n), { style: "unit", unit: "percent" });
      const redialMore = open.mode === "edit" ? open.onRedialMore : undefined;
      sheet = (
        <OffsetSheet
          open
          onClose={close}
          labels={labels}
          line={open.line ?? undefined}
          wheel={{
            value: shift,
            onChange: (v) => {
              setShift(v);
              void loadPreview(open.eventId, v, except, stretch);
            },
            min: -span,
            max: span,
            step: wheel.step,
          }}
          words={words ? t(words.direction === "finer" ? "offset.finer" : "offset.coarser", { count: words.steps }) : shift === 0 ? t("offset.noChange") : null}
          agedNote={open.mode === "propose" && open.aged !== null ? t("offset.agedNote", { amount: grind(Math.abs(open.aged), wheel.step) }) : null}
          notice={fit?.uncertain ? t("offset.uncertain") : undefined}
          stretch={
            showStretch
              ? {
                  label: t("offset.stretch.label"),
                  wheel: {
                    value: stretch,
                    onChange: (v) => {
                      setStretch(v);
                      void loadPreview(open.eventId, shift, except, v);
                    },
                    min: -30,
                    max: 30,
                  },
                  explain: stretch === 0 ? t("offset.stretch.none") : t(stretch > 0 ? "offset.stretch.more" : "offset.stretch.less", { percent: percent(stretch) }),
                  basedOn: fit && fit.count > 2 ? t("offset.basedOn", { count: fit.count }) : undefined,
                }
              : undefined
          }
          tooClose={fit?.tooClose && open.mode === "propose" ? { message: t("offset.tooClose"), action: { label: t("offset.pickAnother"), onClick: () => router.push(partHref(open.grinderId)) } } : undefined}
          invite={
            redialMore
              ? {
                  body: t("maintenance.redialMore.body"),
                  action: {
                    label: t("maintenance.redialMore.action"),
                    onClick: () => {
                      setOpen(null);
                      redialMore();
                    },
                  },
                }
              : undefined
          }
          preview={
            preview
              ? {
                  rows: preview.rows.map((r) => ({
                    label: t("offset.previewRow", { coffee: r.bean, drink: drinkLabel(r.drink, (key: DrinkKey) => t(key)) }),
                    from: grind(r.from, wheel.step),
                    to: grind(r.to, wheel.step),
                  })),
                  more: preview.more ? t("offset.more", { count: preview.more }) : undefined,
                  none: t("offset.noOthers"),
                }
              : undefined
          }
          primary={{ label: open.mode === "propose" ? t("offset.confirm") : t("offset.save"), onClick: () => void save(shift, showStretch ? stretch : 0) }}
          secondary={
            // Declining a stretch keeps the shift alone (STORY-04-04-02 AC 2).
            fit && showStretch
              ? { label: t("offset.declineStretch"), onClick: () => void save(fit.shiftAlone, 0) }
              : { label: open.mode === "propose" ? t("offset.decline") : t("offset.remove"), onClick: () => void save(0, 0) }
          }
          saving={state === "saving"}
          failure={state === "failed" ? { message: t("states.saveFailed"), retryLabel: t("actions.retry"), onRetry: () => void save(tried.current.shift, tried.current.stretch) } : undefined}
        />
      );
    }
  }

  return { afterPin, edit, sheet, said };
}

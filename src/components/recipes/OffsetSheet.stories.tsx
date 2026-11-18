import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { OffsetSheet, type OffsetPreviewRow } from "./OffsetSheet";

const t = createTranslator({ locale: "en", messages });
const { offset, actions } = messages;
const labels = { title: offset.title, close: actions.close, shift: offset.shift, preview: offset.preview, to: offset.to };

const rows: OffsetPreviewRow[] = [
  { label: t("offset.previewRow", { coffee: "House Blend", drink: messages.drinks.latte }), from: "15", to: "12" },
  { label: t("offset.previewRow", { coffee: "Second Coffee", drink: messages.drinks.espresso }), from: "18.5", to: "15.5" },
  { label: t("offset.previewRow", { coffee: "Third Coffee", drink: messages.drinks.espresso }), from: "14", to: "11" },
];

/** The proposal after a re-dial, with its own wheel state. */
function Propose({ aged = true, more = true, failed = false, onConfirm = fn(), onDecline = fn() }) {
  const [shift, setShift] = useState(-3);
  const words = shift === 0 ? offset.noChange : t(shift < 0 ? "offset.finer" : "offset.coarser", { count: Math.abs(shift) });
  return (
    <OffsetSheet
      open
      onClose={fn()}
      labels={labels}
      line={t("offset.line", { coffee: "House Blend", was: "15", now: "12" })}
      wheel={{ value: shift, onChange: setShift, min: -25, max: 25, step: 1 }}
      words={words}
      agedNote={aged ? t("offset.agedNote", { amount: "0.5" }) : null}
      preview={{ rows, more: more ? t("offset.more", { count: 4 }) : undefined, none: offset.noOthers }}
      primary={{ label: offset.confirm, onClick: () => onConfirm(shift) }}
      secondary={{ label: offset.decline, onClick: onDecline }}
      failure={failed ? { message: messages.states.saveFailed, retryLabel: actions.retry, onRetry: fn() } : undefined}
    />
  );
}

async function opened() {
  const dialog = await within(document.body).findByRole("dialog", { name: offset.title });
  await waitFor(() => expect(dialog).toBeVisible());
  return within(dialog);
}

const meta = {
  title: "Recipes/OffsetSheet",
  component: OffsetSheet,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OffsetSheet>;

export default meta;
type Story = StoryObj<typeof meta>;
const args = {} as Story["args"];

/** The evidence, the shift with its words, ageing taken off, and three recipes it changes (STORY-04-03-01 AC 1–3, 04-03-02 AC 1). */
export const Proposal: Story = {
  args,
  render: () => <Propose />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText("Your recipe for House Blend was 15 and is now 12.")).toBeVisible();
    await expect(sheet.getByText("3 steps finer")).toBeVisible();
    await expect(sheet.getByText("0.5 of that was the beans ageing, taken off first.")).toBeVisible();
    await expect(sheet.getAllByRole("listitem")).toHaveLength(3);
    await expect(sheet.getByText("and 4 more")).toBeVisible();
  },
};

/** Changing the shift before confirming: the words follow, and confirm saves the edited value (04-03-02 AC 2). */
export const EditBeforeConfirming: Story = {
  args,
  render: () => <Propose onConfirm={fn()} />,
  play: async () => {
    const sheet = await opened();
    const slider = sheet.getByRole("slider", { name: offset.shift });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(sheet.getByText("2 steps finer")).toBeVisible();
  },
};

export const NoAgeingNoMore: Story = { args, render: () => <Propose aged={false} more={false} /> };

/** A failed save keeps the sheet, with a retry (04-03-02 AC 4). */
export const SaveFailed: Story = {
  args,
  render: () => <Propose failed />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText(messages.states.saveFailed)).toBeVisible();
    await expect(sheet.getByRole("button", { name: actions.retry })).toBeVisible();
  },
};

/** No recipe from before the servicing: says why and offers another coffee (04-03-01 AC 4). */
export const NoBaseline: Story = {
  args,
  render: () => <OffsetSheet open onClose={fn()} labels={labels} message={offset.noBaseline} primary={{ label: offset.pickAnother, onClick: fn() }} />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText(offset.noBaseline)).toBeVisible();
    await expect(sheet.queryByRole("slider")).toBeNull();
  },
};

/** From the grinder's screen: where the shift came from, save or remove (STORY-04-03-05 AC 2). */
export const EditFromGrinder: Story = {
  args,
  render: () => (
    <OffsetSheet
      open
      onClose={fn()}
      labels={labels}
      line={t("offset.editFrom", { coffee: "House Blend", date: "9 October" })}
      wheel={{ value: -3, onChange: fn(), min: -25, max: 25, step: 1 }}
      words={t("offset.finer", { count: 3 })}
      preview={{ rows: rows.slice(0, 1), none: offset.noOthers }}
      primary={{ label: offset.save, onClick: fn() }}
      secondary={{ label: offset.remove, onClick: fn() }}
    />
  ),
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText("From your re-dial of House Blend on 9 October.")).toBeVisible();
    await expect(sheet.getByRole("button", { name: offset.remove })).toBeVisible();
  },
};

/** Without the grinder's direction, no words: only the signed number on the wheel (04-03-01 AC 3). */
export const DirectionUnknown: Story = {
  args,
  render: () => (
    <OffsetSheet
      open
      onClose={fn()}
      labels={labels}
      line={t("offset.line", { coffee: "House Blend", was: "15", now: "17" })}
      wheel={{ value: 2, onChange: fn(), min: -25, max: 25, step: 1 }}
      preview={{ rows: [], none: offset.noOthers }}
      primary={{ label: offset.confirm, onClick: fn() }}
      secondary={{ label: offset.decline, onClick: fn() }}
    />
  ),
  play: async () => {
    const sheet = await opened();
    await expect(sheet.queryByText(/finer|coarser/)).toBeNull();
    await expect(sheet.getByText(offset.noOthers)).toBeVisible();
  },
};

export const RightToLeft: Story = { args, render: () => <Propose />, globals: { direction: "rtl" } };

/** The stretch with the shift, after a second coffee's re-dial (STORY-04-04-01, DES-04-04-01). */
function Stretched({ coffees = 2, uncertain = false, tooClose = false, onConfirm = fn() }) {
  const [shift, setShift] = useState(-1);
  const [stretch, setStretch] = useState(tooClose ? 0 : -10);
  const pct = (n: number) => new Intl.NumberFormat("en", { style: "unit", unit: "percent" }).format(Math.abs(n));
  const evidence = [
    t("offset.evidence", { coffee: "House Blend", was: "15", now: "13" }),
    t("offset.evidence", { coffee: "Second Coffee", was: tooClose ? "15.5" : "30", now: tooClose ? "13.5" : "26" }),
    ...(coffees > 2 ? [t("offset.evidence", { coffee: "Third Coffee", was: "22", now: "19" })] : []),
  ];
  return (
    <OffsetSheet
      open
      onClose={fn()}
      labels={labels}
      notice={uncertain ? offset.uncertain : undefined}
      line={t("offset.lineMany", { list: new Intl.ListFormat("en", { type: "conjunction" }).format(evidence) })}
      wheel={{ value: shift, onChange: setShift, min: -25, max: 25, step: 0.5 }}
      words={shift === 0 ? offset.noChange : t(shift < 0 ? "offset.finer" : "offset.coarser", { count: Math.abs(shift) / 0.5 })}
      stretch={
        tooClose
          ? undefined
          : {
              label: offset.stretch.label,
              wheel: { value: stretch, onChange: setStretch, min: -30, max: 30 },
              explain: stretch === 0 ? offset.stretch.none : t(stretch > 0 ? "offset.stretch.more" : "offset.stretch.less", { percent: pct(stretch) }),
              basedOn: coffees > 2 ? t("offset.basedOn", { count: coffees }) : undefined,
            }
      }
      tooClose={tooClose ? { message: offset.tooClose, action: { label: offset.pickAnother, onClick: fn() } } : undefined}
      preview={{ rows: rows.slice(0, 1), none: offset.noOthers }}
      primary={{ label: offset.confirm, onClick: () => onConfirm(shift, stretch) }}
      secondary={{ label: tooClose ? offset.decline : offset.declineStretch, onClick: fn() }}
    />
  );
}

/** Two coffees: the evidence names each, the stretch in percent with a plain sentence (STORY-04-04-01 AC 1). */
export const StretchTwoCoffees: Story = {
  args,
  render: () => <Stretched onConfirm={fn()} />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText("Your recipes moved: House Blend 15 to 13 and Second Coffee 30 to 26.")).toBeVisible();
    const wheel = sheet.getByRole("slider", { name: offset.stretch.label });
    await expect(wheel).toHaveAttribute("aria-valuenow", "-10");
    await expect(sheet.getByText(t("offset.stretch.less", { percent: "10%" }))).toBeVisible();
    await expect(sheet.queryByText(/Based on/)).toBeNull();
    wheel.focus();
    await userEvent.keyboard("{End}");
    await expect(sheet.getByText(t("offset.stretch.more", { percent: "30%" }))).toBeVisible();
  },
};

/** Three or more coffees say what the fit rests on (AC 1). */
export const StretchThreeCoffees: Story = {
  args,
  render: () => <Stretched coffees={3} />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText("Based on 3 coffees")).toBeVisible();
  },
};

/** The re-dials disagree: a neutral notice leads, the values stay editable (AC 3). */
export const StretchUncertain: Story = {
  args,
  render: () => <Stretched uncertain />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByRole("status")).toHaveTextContent(offset.uncertain);
    await expect(sheet.getByRole("slider", { name: offset.stretch.label })).toBeVisible();
  },
};

/** Two coffees too close to tell: no stretch, a quiet line and another coffee to try (AC 4). */
export const StretchTooClose: Story = {
  args,
  render: () => <Stretched tooClose />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText(offset.tooClose)).toBeVisible();
    await expect(sheet.getByRole("button", { name: offset.pickAnother })).toBeVisible();
    await expect(sheet.queryByRole("slider", { name: offset.stretch.label })).toBeNull();
  },
};

/** From the grinder's screen, a burrs event with one re-dial invites a second coffee (STORY-04-04-03 AC 1). */
export const InviteSecondCoffee: Story = {
  args,
  render: () => (
    <OffsetSheet
      open
      onClose={fn()}
      labels={labels}
      line={t("offset.editFrom", { coffee: "House Blend", date: "9 October" })}
      wheel={{ value: -3, onChange: fn(), min: -25, max: 25, step: 1 }}
      words={t("offset.finer", { count: 3 })}
      stretch={{ label: offset.stretch.label, wheel: { value: 0, onChange: fn(), min: -30, max: 30 }, explain: offset.stretch.none }}
      preview={{ rows: rows.slice(0, 1), none: offset.noOthers }}
      invite={{ body: messages.maintenance.redialMore.body, action: { label: messages.maintenance.redialMore.action, onClick: fn() } }}
      primary={{ label: offset.save, onClick: fn() }}
      secondary={{ label: offset.remove, onClick: fn() }}
    />
  ),
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText(messages.maintenance.redialMore.body)).toBeVisible();
    await expect(sheet.getByRole("button", { name: messages.maintenance.redialMore.action })).toBeVisible();
    await expect(sheet.getByText(offset.stretch.none)).toBeVisible();
  },
};

export const StretchRightToLeft: Story = { args, render: () => <Stretched coffees={3} />, globals: { direction: "rtl" } };

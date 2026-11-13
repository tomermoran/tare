import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { allowedActions } from "@/domain/portionActions";
import type { PortionState } from "@/domain/portionState";
import { DateSheet, PortionActionsSheet, SplitSheet, StockSheet } from "./PortionSheets";

const t = createTranslator({ locale: "en", messages });
const { actions, portion, states } = messages;
const grams = (g: number) => new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "narrow", maximumFractionDigits: 1 }).format(g);

function Actions({ state }: { state: PortionState }) {
  return (
    <PortionActionsSheet
      open
      onClose={fn()}
      title={t("portion.actionsTitle", { state: portion.state[state], remaining: grams(180) })}
      closeLabel={actions.close}
      actions={allowedActions(state).map((a) => ({ action: a, label: portion.action[a] }))}
      onChoose={fn()}
    />
  );
}

const meta = {
  title: "Beans/Portion sheets",
  component: PortionActionsSheet,
  args: { open: true, onClose: fn(), title: "", closeLabel: actions.close, actions: [], onChoose: fn() },
} satisfies Meta<typeof PortionActionsSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const offered = (canvas: ReturnType<typeof within>) => canvas.getAllByRole("button").filter((b: HTMLElement) => b.textContent !== "" && b.getAttribute("aria-label") !== actions.close);

/** Each state shows only its actions (STORY-03-02-02 AC 5). */
export const Unopened: Story = {
  render: () => <Actions state="unopened" />,
  play: async () => {
    const canvas = within(document.body);
    await expect(offered(canvas).map((b: HTMLElement) => b.textContent)).toEqual([portion.action.open, portion.action.freeze, portion.action.split]);
  },
};

export const OnTheCounter: Story = {
  render: () => <Actions state="counter" />,
  play: async () => {
    const canvas = within(document.body);
    await expect(offered(canvas).map((b: HTMLElement) => b.textContent)).toEqual([portion.action.weigh, portion.action.split, portion.action.freeze, portion.action.finish]);
  },
};

export const Frozen: Story = {
  render: () => <Actions state="frozen" />,
  play: async () => {
    const canvas = within(document.body);
    await expect(offered(canvas).map((b: HTMLElement) => b.textContent)).toEqual([portion.action.thaw, portion.action.split]);
    await expect(canvas.queryByRole("button", { name: portion.action.freeze })).toBeNull();
  },
};

export const Thawed: Story = {
  render: () => <Actions state="thawed" />,
  play: async () => {
    const canvas = within(document.body);
    // No second freeze after a thaw (AC 3).
    await expect(offered(canvas).map((b: HTMLElement) => b.textContent)).toEqual([portion.action.open, portion.action.weigh, portion.action.finish]);
  },
};

function Dated({ error, failed }: { error?: string; failed?: boolean }) {
  const [day, setDay] = useState("2026-03-20");
  return (
    <DateSheet
      open
      onClose={fn()}
      title={portion.dateTitle.thaw}
      closeLabel={actions.close}
      label={portion.date}
      hint={portion.dateHint}
      value={day}
      max="2026-03-20"
      onChange={setDay}
      error={error}
      confirmLabel={portion.confirm.thaw}
      onConfirm={fn()}
      failure={failed ? { message: states.saveFailed, retryLabel: actions.retry, onRetry: fn() } : undefined}
    />
  );
}

/** Today by default, one tap to confirm. */
export const DateToday: Story = {
  render: () => <Dated />,
  play: async () => {
    const canvas = within(document.body);
    await expect(canvas.getByLabelText(portion.date)).toHaveValue("2026-03-20");
    await expect(canvas.getByRole("button", { name: portion.confirm.thaw })).toBeEnabled();
  },
};

/** A thaw before its freeze: the error in ink on the field (STORY-03-02-02 AC 4, SQ-09). */
export const ThawBeforeFreeze: Story = {
  render: () => <Dated error={t("portion.thawBeforeFreeze", { date: "12 Mar 2026" })} />,
  play: async () => {
    const field = within(document.body).getByLabelText(portion.date);
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAccessibleDescription(t("portion.thawBeforeFreeze", { date: "12 Mar 2026" }));
  },
};

/** A failed action keeps the sheet open with retry. */
export const DateFailed: Story = { render: () => <Dated failed /> };

function Split() {
  const [take, setTake] = useState(90);
  const [freeze, setFreeze] = useState(true);
  return (
    <SplitSheet
      open
      onClose={fn()}
      labels={{
        title: portion.splitTitle,
        close: actions.close,
        takeOut: portion.takeOut,
        remainder: (g) => t("portion.splitRemainder", { grams: grams(g) }),
        freezeNew: portion.freezeNew,
        confirm: portion.splitConfirm,
      }}
      remaining={180}
      take={take}
      onTakeChange={setTake}
      freezeNew={freeze}
      onFreezeNewChange={setFreeze}
      onConfirm={fn()}
    />
  );
}

/** The remainder follows the wheel; the wheel stops at what's left; freeze is on (STORY-03-02-01 AC 1 to AC 3). */
export const SplitInHalf: Story = {
  render: () => <Split />,
  play: async () => {
    const canvas = within(document.body);
    await waitFor(() => expect(canvas.getByText(t("portion.splitRemainder", { grams: grams(90) }))).toBeVisible());
    const wheel = canvas.getByRole("slider", { name: portion.takeOut });
    await expect(wheel).toHaveAttribute("aria-valuemax", "180");
    wheel.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect(canvas.getByText(t("portion.splitRemainder", { grams: grams(88) }))).toBeInTheDocument();
    await expect(canvas.getByRole("switch", { name: portion.freezeNew })).toBeChecked();
  },
};

export const RightToLeft: Story = { render: () => <Split />, globals: { direction: "rtl" } };

function Stock({ failed, onSave = fn() }: { failed?: boolean; onSave?: () => void }) {
  const [g, setG] = useState(120);
  return (
    <StockSheet
      open
      onClose={fn()}
      labels={{ title: portion.stockTitle, close: actions.close, weight: portion.stockWeight, hint: portion.stockHint, save: portion.saveWeight }}
      grams={g}
      max={250}
      onGramsChange={setG}
      onSave={onSave}
      failure={failed ? { message: states.saveFailed, retryLabel: actions.retry, onRetry: onSave } : undefined}
    />
  );
}

/** A grams wheel from zero, one primary to save (STORY-03-04-02 AC 1). */
export const WeighWhatsLeft: Story = {
  render: () => <Stock />,
  play: async () => {
    const canvas = within(document.body);
    const wheel = await waitFor(() => canvas.getByRole("slider", { name: portion.stockWeight }));
    await expect(wheel).toHaveAttribute("aria-valuemin", "0");
    await expect(wheel).toHaveAttribute("aria-valuemax", "250");
    await waitFor(() => expect(canvas.getByRole("button", { name: portion.saveWeight })).toBeVisible());
  },
};

const retried = fn();
/** A failed save keeps the sheet, with a retry (STORY-03-04-02 AC 4). */
export const WeighFailed: Story = {
  render: () => <Stock failed onSave={retried} />,
  play: async () => {
    const canvas = within(document.body);
    await waitFor(() => expect(canvas.getByText(states.saveFailed)).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: actions.retry }));
    await expect(retried).toHaveBeenCalled();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { recalibrationDefault } from "@/domain/maintenance";
import messages from "@/i18n/messages/en.json";
import { MaintenanceSheet, RecalibrationToggle, type MaintenanceDraft } from "./MaintenanceSheet";

const { actions, maintenance } = messages;
const labels = {
  title: maintenance.sheetTitle,
  close: actions.close,
  kind: maintenance.kindLabel,
  kinds: maintenance.kind,
  date: maintenance.date,
  dateHint: maintenance.dateHint,
  note: maintenance.note,
  noteHint: maintenance.noteHint,
  save: maintenance.save,
  saveFailed: maintenance.saveFailed,
  retry: actions.retry,
};
const TODAY = "2026-10-18";

/** The sheet as the part screen wires it: the toggle follows the kind until touched. */
function Sheet({ partKind, state, onSave = fn() }: { partKind: "grinder" | "machine" | "basket"; state?: "idle" | "failed"; onSave?: (draft: MaintenanceDraft & { recalibration: boolean }) => void }) {
  const [draft, setDraft] = useState<MaintenanceDraft>({ kind: null, day: TODAY, note: "" });
  const [touched, setTouched] = useState<boolean | null>(null);
  const recalibration = touched ?? (draft.kind ? recalibrationDefault(partKind, draft.kind) : false);
  return (
    <MaintenanceSheet
      open
      onClose={fn()}
      labels={labels}
      value={draft}
      onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
      today={TODAY}
      recalibration={
        partKind === "grinder" ? (
          <RecalibrationToggle label={maintenance.isRecalibration} hint={maintenance.isRecalibrationHint} checked={recalibration} onChange={setTouched} />
        ) : undefined
      }
      state={state}
      onSave={() => onSave({ ...draft, recalibration })}
    />
  );
}

/** The sheet, once its fade-in has started. */
async function opened() {
  const dialog = await within(document.body).findByRole("dialog", { name: maintenance.sheetTitle });
  await waitFor(() => expect(dialog).toBeVisible());
  return within(dialog);
}

const meta = {
  title: "Maintenance/MaintenanceSheet",
  component: MaintenanceSheet,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MaintenanceSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { args: { open: true, onClose: fn(), labels, value: { kind: null, day: TODAY, note: "" }, onChange: fn(), today: TODAY, onSave: fn() } };

/**
 * A grinder: a re-zero today is three taps (add, re-zero, save), and it's
 * marked a recalibration unless turned off (STORY-04-01-02 AC 2).
 */
export const Grinder: Story = {
  ...base,
  args: { ...base.args, onSave: fn() },
  render: (args) => <Sheet partKind="grinder" onSave={args.onSave as never} />,
  play: async ({ args }) => {
    const sheet = await opened();
    const save = sheet.getByRole("button", { name: maintenance.save });
    await expect(save).toBeDisabled();
    await userEvent.click(sheet.getByRole("radio", { name: maintenance.kind.rezero }));
    await expect(sheet.getByRole("switch", { name: maintenance.isRecalibration })).toBeChecked();
    await userEvent.click(save);
    await expect(args.onSave).toHaveBeenCalledWith(expect.objectContaining({ kind: "rezero", day: TODAY, recalibration: true }));
  },
};

/** A clean isn't a recalibration by default, but can be marked (AC 1). */
export const GrinderClean: Story = {
  ...base,
  render: () => <Sheet partKind="grinder" />,
  play: async () => {
    const sheet = await opened();
    await userEvent.click(sheet.getByRole("radio", { name: maintenance.kind.clean }));
    const toggle = sheet.getByRole("switch", { name: maintenance.isRecalibration });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    // Once touched, it no longer follows the kind.
    await userEvent.click(sheet.getByRole("radio", { name: maintenance.kind.repair }));
    await expect(toggle).toBeChecked();
  },
};

/** A machine: no recalibration is offered (AC 4). */
export const Machine: Story = {
  ...base,
  render: () => <Sheet partKind="machine" />,
  play: async () => {
    const sheet = await opened();
    await userEvent.click(sheet.getByRole("radio", { name: maintenance.kind.burrs }));
    await expect(sheet.queryByRole("switch")).toBeNull();
    await expect(sheet.getByLabelText(maintenance.date)).toHaveValue(TODAY);
  },
};

/** The save failed: the sheet stays, with a retry. */
export const Failed: Story = {
  ...base,
  render: () => <Sheet partKind="grinder" state="failed" />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText(maintenance.saveFailed)).toBeVisible();
    await expect(sheet.getByRole("button", { name: actions.retry })).toBeVisible();
  },
};

export const RightToLeft: Story = { ...Grinder, globals: { direction: "rtl" } };

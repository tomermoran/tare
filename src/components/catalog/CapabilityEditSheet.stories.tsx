import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { answersFromGrinder } from "@/domain/capabilityQuestions";
import messages from "@/i18n/messages/en.json";
import { CapabilityEditSheet } from "./CapabilityEditSheet";
import { GrinderQuestions } from "./GrinderQuestions";

const { actions, catalog, states, unit } = messages;
const { cap } = catalog;

const labels = {
  open: unit.editCapabilities,
  hint: unit.editCapabilitiesHint,
  title: unit.editCapabilitiesTitle,
  why: cap.why,
  save: actions.save,
  close: actions.close,
  saveFailed: states.saveFailed,
};

const grinderLabels = {
  notSure: cap.notSure,
  lowest: cap.lowest,
  highest: cap.highest,
  rangeHint: cap.rangeHint,
  dialQ: cap.dialQ,
  clicks: cap.clicks,
  smooth: cap.smooth,
  rangeQ: cap.rangeQ,
  stepQ: cap.stepQ,
  coarserQ: cap.coarserQ,
  higher: cap.higher,
  lower: cap.lower,
};

/** A grinder added as "not sure" except its range, reopened prefilled. */
function Live({ onSave, state }: { onSave: () => void; state?: "idle" | "saving" | "failed" }) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState(() =>
    answersFromGrinder({ grind: { type: "unknown", min: 1, max: 30, step: null, coarser: "unknown" } }),
  );
  return (
    <CapabilityEditSheet labels={labels} open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} onSave={onSave} state={state}>
      <GrinderQuestions labels={grinderLabels} answers={answers} onChange={setAnswers} />
    </CapabilityEditSheet>
  );
}

const meta = {
  title: "Catalog/Capability edit sheet",
  component: CapabilityEditSheet,
  decorators: [(Story) => <div className="w-80"><Story /></div>],
  args: { labels, open: false, onOpen: fn(), onClose: fn(), onSave: fn(), children: null },
} satisfies Meta<typeof CapabilityEditSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The questions reopen prefilled, with not sure where it was (STORY-01-06-09 AC 1). */
export const Reopen: Story = {
  render: (args) => <Live onSave={args.onSave} />,
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole("button", { name: unit.editCapabilities }));
    const dial = await page.findByRole("radiogroup", { name: cap.dialQ });
    await waitFor(() => expect(dial).toBeVisible());
    await expect(within(dial).getByRole("radio", { name: cap.notSure })).toBeChecked();
    await expect(page.getByLabelText(cap.highest)).toHaveValue("30");
    await userEvent.click(within(dial).getByRole("radio", { name: cap.clicks }));
    await userEvent.click(page.getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledOnce();
  },
};

export const SaveFailed: Story = {
  args: { open: true, state: "failed", children: <p>{cap.why}</p> },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).getByText(states.saveFailed)).toBeVisible());
  },
};

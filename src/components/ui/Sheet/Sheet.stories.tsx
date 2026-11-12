import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Button } from "../Button/Button";
import { ConfirmSheet } from "./ConfirmSheet";
import { Sheet } from "./Sheet";

const { actions, confirm, drinks, log, journal } = messages;

/** A trigger and its sheet, so the stories open, close and return focus for real. */
function WithTrigger({
  initiallyOpen = false,
  ...props
}: Omit<ComponentProps<typeof Sheet>, "open" | "onClose"> & { initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{log.drink}</Button>
      <Sheet {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const meta = {
  title: "Components/Sheet",
  component: WithTrigger,
  args: { title: log.drink, closeLabel: actions.close },
} satisfies Meta<typeof WithTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

const drinkList = (
  <ul className="flex flex-col">
    {Object.values(drinks).map((name) => (
      <li key={name}>
        <button type="button" className="h-12 w-full text-start">
          {name}
        </button>
      </li>
    ))}
  </ul>
);

export const Open: Story = {
  args: { children: drinkList },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole("button", { name: log.drink });
    await userEvent.click(trigger);
    const dialog = await body.findByRole("dialog", { name: log.drink });
    // It fades in from opacity 0, so wait for the transition to start.
    await waitFor(() => expect(dialog).toBeVisible());

    // Focus trap: Tab from the last item wraps to the first, and back.
    const close = within(dialog).getByRole("button", { name: actions.close });
    const items = within(dialog).getAllByRole("button");
    items[items.length - 1].focus();
    await userEvent.tab();
    await expect(close).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(items[items.length - 1]).toHaveFocus();

    // Escape closes and focus goes back to the trigger.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(trigger).toHaveFocus();
  },
};

export const LongContent: Story = {
  args: {
    initiallyOpen: true,
    title: journal.title,
    children: (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>{journal.empty}</p>
        ))}
      </div>
    ),
    footer: <Button variant="primary" fullWidth>{actions.save}</Button>,
  },
};

export const CloseButton: Story = {
  args: { children: drinkList },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole("button", { name: log.drink });
    await userEvent.click(trigger);
    const dialog = await body.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: actions.close }));
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(trigger).toHaveFocus();
  },
};

export const RightToLeft: Story = {
  args: { initiallyOpen: true, children: drinkList },
  globals: { direction: "rtl" },
};

/** The OS reduced-motion setting turns off the slide; the sheet just appears. */
export const ReducedMotion: Story = {
  args: { initiallyOpen: true, children: drinkList },
  play: async ({ canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole("dialog");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = parseFloat(getComputedStyle(dialog).transitionDuration);
    await expect(reduced ? duration === 0 : duration > 0).toBe(true);
  },
};

function ConfirmDemo(props: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{actions.cancel}</Button>
      <ConfirmSheet
        open={open}
        title={confirm.discardTitle}
        confirmLabel={actions.discard}
        cancelLabel={actions.keepEditing}
        closeLabel={actions.close}
        onConfirm={() => {
          props.onConfirm();
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      >
        {confirm.discard}
      </ConfirmSheet>
    </>
  );
}

/** SH-CONFIRM: one primary button; keep editing leaves everything as it was. */
export const Confirm: StoryObj<typeof ConfirmDemo> = {
  render: (args) => <ConfirmDemo {...args} />,
  args: { onConfirm: fn() },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(within(canvasElement).getByRole("button", { name: actions.cancel }));
    const dialog = await body.findByRole("dialog", { name: confirm.discardTitle });
    await userEvent.click(within(dialog).getByRole("button", { name: actions.keepEditing }));
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(args.onConfirm).not.toHaveBeenCalled();

    await userEvent.click(within(canvasElement).getByRole("button", { name: actions.cancel }));
    await userEvent.click(within(dialog).getByRole("button", { name: actions.discard }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
  },
};

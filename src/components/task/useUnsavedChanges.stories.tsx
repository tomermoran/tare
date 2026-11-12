import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useUnsavedChanges } from "./useUnsavedChanges";

const { actions, confirm, log } = messages;

/** A minimal task: a header with Cancel and one field. */
function DemoTask({ onLeave }: { onLeave: () => void }) {
  const [value, setValue] = useState("");
  const { leave, confirm } = useUnsavedChanges(value !== "", onLeave);
  return (
    <div className="w-[358px]">
      <PageHeader
        variant="task"
        title={log.titleNew}
        start={
          <Button variant="ghost" size="sm" onClick={leave}>
            {actions.cancel}
          </Button>
        }
      />
      <Input label={log.coffee} value={value} onChange={(e) => setValue(e.target.value)} />
      {confirm}
    </div>
  );
}

const meta = {
  title: "Task/Unsaved changes",
  component: DemoTask,
  args: { onLeave: fn() },
} satisfies Meta<typeof DemoTask>;

export default meta;
type Story = StoryObj<typeof meta>;

const page = (el: HTMLElement) => within(el.ownerDocument.body);

/** Nothing changed: Cancel leaves at once. */
export const CleanLeavesAtOnce: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: actions.cancel }));
    await expect(args.onLeave).toHaveBeenCalledOnce();
    await expect(page(canvasElement).queryByRole("dialog")).toBeNull();
  },
};

/** Changed: Cancel asks; keep editing stays; discard leaves once. */
export const DirtyAsksOnce: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(log.coffee), "Signia");
    await userEvent.click(canvas.getByRole("button", { name: actions.cancel }));
    const sheet = await page(canvasElement).findByRole("dialog", { name: confirm.discardTitle });
    await userEvent.click(within(sheet).getByRole("button", { name: actions.keepEditing }));
    await waitFor(() => expect(sheet).not.toBeVisible());
    await expect(args.onLeave).not.toHaveBeenCalled();
    await expect(canvas.getByLabelText(log.coffee)).toHaveValue("Signia");

    await userEvent.click(canvas.getByRole("button", { name: actions.cancel }));
    await userEvent.click(within(sheet).getByRole("button", { name: actions.discard }));
    await expect(args.onLeave).toHaveBeenCalledOnce();
  },
};

/** Changed, then the back button: the guard entry pops and the sheet asks. */
export const DirtyBackAsks: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(log.coffee), "Signia");
    // Stands in for the browser popping the guard entry.
    window.dispatchEvent(new PopStateEvent("popstate"));
    const sheet = await page(canvasElement).findByRole("dialog", { name: confirm.discardTitle });
    await userEvent.click(within(sheet).getByRole("button", { name: actions.keepEditing }));
    await expect(args.onLeave).not.toHaveBeenCalled();
    await expect(canvas.getByLabelText(log.coffee)).toHaveValue("Signia");
  },
};

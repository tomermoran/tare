import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useTranslations } from "next-intl";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { fail, ok, type ActionResult } from "@/lib/actionResult";
import { useActionForm } from "@/lib/useActionForm";
import { LoadFailed } from "./LoadFailed";

const { states, actions, log } = messages;

const meta = {
  title: "Patterns/Loading and errors",
  component: LoadFailed,
  args: { retry: fn() },
  decorators: [(Story) => <div className="w-[358px]"><Story /></div>],
} satisfies Meta<typeof LoadFailed>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A tab that couldn't load: neutral notice and retry, never signal (AC 3, AC 4). */
export const LoadFailedWithRetry: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole("alert");
    await expect(alert).toHaveTextContent(states.loadFailedTitle);
    await expect(alert.className).not.toMatch(/signal/);
    await userEvent.click(within(alert).getByRole("button", { name: actions.retry }));
    await expect(args.retry).toHaveBeenCalledOnce();
  },
};

let saves = 0;

/** The first save fails, the second works: what was typed survives the failure. */
function NameForm({ onSaved }: { onSaved: (name: string) => void }) {
  const t = useTranslations();
  const { onSubmit, pending, error } = useActionForm(
    async (data: FormData): Promise<ActionResult<string>> =>
      saves++ === 0 ? fail("saveFailed") : ok(String(data.get("name"))),
    { onSuccess: onSaved },
  );
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input name="name" label={t("log.coffee")} defaultValue="" />
      {error && <Notice urgent>{t(`states.${error}`)}</Notice>}
      <Button type="submit" variant="primary" disabled={pending}>
        {t("actions.save")}
      </Button>
    </form>
  );
}

export const FormKeepsValuesOnFailure: StoryObj<typeof NameForm> = {
  render: (args) => <NameForm {...args} />,
  args: { onSaved: fn() },
  beforeEach: () => {
    saves = 0;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText(log.coffee);
    await userEvent.type(field, "Signia");
    await userEvent.click(canvas.getByRole("button", { name: actions.save }));

    const alert = await canvas.findByRole("alert");
    await expect(alert).toHaveTextContent(states.saveFailed);
    await expect(alert.className).not.toMatch(/signal/);
    await expect(field).toHaveValue("Signia");
    await expect(args.onSaved).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole("button", { name: actions.save }));
    await waitFor(() => expect(args.onSaved).toHaveBeenCalledWith("Signia"));
    await waitFor(() => expect(canvas.queryByRole("alert")).toBeNull());
  },
};

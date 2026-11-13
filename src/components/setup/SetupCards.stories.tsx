import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useTranslations } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Button } from "@/components/ui/Button/Button";
import { SetupCard, SetupOfferCard } from "./SetupCards";

const { setup } = messages;

// Fictional parts, by maker and model.
const parts = ["Example Espresso Co. Model One", "Sample Grinders Grinder Zero", "Example Espresso Co. 54mm Double Shot Basket"];

const meta = {
  title: "Setup/Cards",
  component: SetupOfferCard,
  decorators: [(Story) => <div className="w-80"><Story /></div>],
  args: {
    title: setup.suggestTitle,
    body: setup.suggestBody,
    parts,
    action: setup.suggest,
    onAccept: fn(),
  },
} satisfies Meta<typeof SetupOfferCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Names the three parts it will use; one tap (STORY-01-02-05 AC 1, AC 4). */
export const Offer: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem").map((li) => li.textContent)).toEqual(parts);
    await userEvent.click(canvas.getByRole("button", { name: setup.suggest }));
    await expect(args.onAccept).toHaveBeenCalledOnce();
  },
};

export const OfferBusy: Story = {
  args: { busy: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: setup.suggest })).toBeDisabled();
  },
};

/** A setup with no name is shown by its parts. */
export const Setup: Story = {
  render: function Render() {
    const t = useTranslations("setup");
    const name = new Intl.ListFormat("en").format(["Model One", "Grinder Zero", "54mm Double Shot Basket"]);
    return <SetupCard overline={t("current")} name={name} parts={parts} recipeCount={t("recipeCount", { count: 0 })} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(setup.current)).toBeVisible();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
  },
};

/** Another setup: last used, with "use this", "change a part" and "rename" (STORY-01-02-09 AC 3, AC 4). */
export const SetupWithActions: Story = {
  render: function Render() {
    const t = useTranslations("setup");
    return (
      <SetupCard
        name="Weekend"
        parts={parts}
        recipeCount={t("recipeCount", { count: 2 })}
        lastUsed={t("lastUsed", { date: "3 May" })}
        actions={
          <>
            <Button size="sm">{t("useThis")}</Button>
            <Button size="sm" variant="ghost">
              {t("changePart")}
            </Button>
            <Button size="sm" variant="ghost">
              {t("rename")}
            </Button>
          </>
        }
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Weekend" })).toBeVisible();
    await expect(canvas.getByText("Last used 3 May")).toBeVisible();
    for (const name of [setup.useThis, setup.changePart, setup.rename]) {
      await expect(canvas.getByRole("button", { name })).toBeVisible();
    }
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };

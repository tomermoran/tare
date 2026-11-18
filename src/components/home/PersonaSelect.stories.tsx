import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PersonaSelect } from "./PersonaSelect";

/* Brew's "who is it for?" with placeholder profiles (STORY-05-01-03). */

const t = createTranslator({ locale: "en", messages });
const { home, actions, profile } = messages;

const options = [
  { id: "main", primary: profile.defaultName, marker: home.usual, secondary: t("home.personUsual", { drink: "Flat white" }) },
  { id: "a", primary: "Person A", secondary: t("home.personUsual", { drink: "Espresso" }) },
  { id: "b", primary: "Person B", secondary: t("home.personUsual", { drink: "Latte" }) },
];

const meta = {
  title: "Home/Persona select",
  component: PersonaSelect,
  args: {
    value: profile.defaultName,
    chosenId: "main",
    options,
    labels: { change: home.changePerson, title: home.whoFor, close: actions.close, profileAndPeople: home.profileAndPeople },
    onChoose: fn(),
    onProfile: fn(),
  },
} satisfies Meta<typeof PersonaSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Several profiles: the main one first and marked, each with their usual drink, and a way to Profile (AC 2). */
export const Several: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: new RegExp(home.changePerson) }));
    const sheet = within(await within(document.body).findByRole("dialog", { name: home.whoFor }));
    await waitFor(() => expect(sheet.getByText("Person A")).toBeVisible());
    await expect(sheet.getAllByRole("button").map((b) => b.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining(home.usual), expect.stringContaining(home.profileAndPeople)]),
    );
    await userEvent.click(sheet.getByRole("button", { name: /Person A/ }));
    await expect(args.onChoose).toHaveBeenCalledWith("a");
  },
};

/** Someone else chosen: the label says who it's for (AC 3). */
export const Chosen: Story = {
  args: { value: t("home.brewingFor", { name: "Person A" }), chosenId: "a" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("for Person A")).toBeVisible();
  },
};

export const RightToLeft: Story = { args: Chosen.args, globals: { direction: "rtl" } };

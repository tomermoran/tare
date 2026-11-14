import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PeriodDivider } from "./PeriodDivider";

const t = createTranslator({ locale: "en", messages });
const text = t("journal.maintenanceDivider", { unit: "Grinder", work: messages.maintenance.kind.rezero, date: "3 Oct" });

const meta = {
  title: "Components/PeriodDivider",
  component: PeriodDivider,
  decorators: [
    (Story) => (
      <ul className="w-[358px]">
        <li>
          <Story />
        </li>
      </ul>
    ),
  ],
  args: { text, href: "/setup/parts/grinder" },
} satisfies Meta<typeof PeriodDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Names the grinder, the work and the date, and opens the grinder. */
export const Plain: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("listitem")).toBeVisible();
    await expect(canvas.getByRole("link", { name: text })).toHaveAttribute("href", "/setup/parts/grinder");
  },
};

/** A recalibration is said in words, not by colour or an icon (STORY-04-01-02 AC 3). */
export const Recalibration: Story = {
  args: { marker: messages.maintenance.recalibration },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link");
    await expect(link).toHaveTextContent(messages.maintenance.recalibration);
  },
};

export const WithoutLink: Story = { args: { href: undefined } };
export const RightToLeft: Story = { ...Recalibration, globals: { direction: "rtl" } };

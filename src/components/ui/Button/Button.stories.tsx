import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useTranslations } from "next-intl";
import messages from "@/i18n/messages/en.json";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: messages.actions.logShot },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost"] },
    size: { control: "inline-radio", options: ["md", "sm"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Disabled: Story = { args: { variant: "primary", disabled: true } };

function ActionsRow() {
  const t = useTranslations("actions");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="primary">{t("logShot")}</Button>
        <Button>{t("edit")}</Button>
        <Button variant="ghost">{t("cancel")}</Button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="primary" size="sm">
          {t("logShot")}
        </Button>
        <Button size="sm">{t("edit")}</Button>
        <Button variant="ghost" size="sm">
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}

/** One primary action per view; everything else is secondary or ghost. */
export const InContext: Story = { render: () => <ActionsRow /> };

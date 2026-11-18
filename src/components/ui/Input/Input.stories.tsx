import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { defaultLocale } from "@/i18n/config";
import messages from "@/i18n/messages/en.json";
import { unitSymbol } from "@/lib/units";
import { Button } from "../Button/Button";
import { Input } from "./Input";

const { shot, beans, setup } = messages;
const grams = unitSymbol(defaultLocale, "gram");

const meta = {
  title: "Components/Input",
  component: Input,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { label: shot.bean, placeholder: shot.beanPlaceholder },
};

export const WithUnitAndHint: Story = {
  args: {
    label: shot.dose,
    unit: grams,
    hint: shot.doseHint,
    inputMode: "decimal",
    defaultValue: "18.0",
  },
};

export const WithError: Story = {
  args: {
    label: shot.dose,
    unit: grams,
    hint: shot.doseHint,
    error: shot.doseRequired,
    inputMode: "decimal",
  },
};

export const Disabled: Story = {
  args: { label: shot.bean, defaultValue: shot.beanPlaceholder, disabled: true },
};

/** A decimal with a placeholder: the placeholder must pass contrast (axe). */
export const Decimal: Story = {
  args: {
    label: shot.dose,
    unit: grams,
    inputMode: "decimal",
    placeholder: "18.0",
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText(shot.dose);
    await expect(input).toHaveAttribute("inputmode", "decimal");
    // Placeholder text uses ink-secondary, not ink-tertiary (DES-01-01-04).
    await expect(input.className).toContain("placeholder:text-ink-secondary");
    await expect(input.className).not.toContain("ink-tertiary");
  },
};

export const DateField: Story = {
  args: { label: beans.roastDate, hint: beans.roastDateHint, type: "date" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText(beans.roastDate)).toHaveAttribute(
      "type",
      "date",
    );
  },
};

export const UrlField: Story = {
  args: {
    label: setup.productLink,
    hint: setup.productLinkHint,
    placeholder: setup.productLinkPlaceholder,
    type: "url",
    inputMode: "url",
    autoComplete: "url",
  },
};

/** A read-only link with copy at its end (SH-INVITE, TASK-05-02-01-FE1); the URL stays left to right. */
export const ReadOnlyWithCopy: Story = {
  args: {
    label: messages.invite.link,
    value: "https://tare.example/join/an-example-token",
    readOnly: true,
    dir: "ltr",
    end: (
      <Button variant="ghost" size="sm" className="-me-3 shrink-0">
        {messages.invite.copy}
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(messages.invite.link)).toHaveAttribute("readonly");
    await expect(canvas.getByRole("button", { name: messages.invite.copy })).toBeVisible();
  },
};

export const ReadOnlyWithCopyRightToLeft: Story = { ...ReadOnlyWithCopy, play: undefined, globals: { direction: "rtl" } };

export const RightToLeft: Story = {
  ...WithUnitAndHint,
  globals: { direction: "rtl" },
};

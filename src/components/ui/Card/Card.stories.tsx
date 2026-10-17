import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useFormatter, useTranslations } from "next-intl";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    tone: { control: "inline-radio", options: ["surface", "outline"] },
    padding: { control: "inline-radio", options: ["md", "lg"] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-overline text-ink-secondary uppercase">{label}</span>
      <span className="text-h2">{value}</span>
    </div>
  );
}

/** A shot summary: hierarchy from size and weight, colour only for the warning. */
function ShotCard(props: React.ComponentProps<typeof Card>) {
  const t = useTranslations("shot");
  const format = useFormatter();
  const dose = 18;
  const yieldGrams = 38;
  const seconds = 21;
  return (
    <Card className="flex max-w-md flex-col gap-8" {...props}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-h3">{t("beanPlaceholder")}</span>
          <span className="text-display">
            {t("ratio", {
              ratio: format.number(yieldGrams / dose, { maximumFractionDigits: 1 }),
            })}
          </span>
        </div>
        <span className="rounded-full bg-signal-subtle px-3 py-1 text-label text-signal">
          {t("warnings.tooFast")}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Stat
          label={t("dose")}
          value={format.number(dose, { style: "unit", unit: "gram", minimumFractionDigits: 1 })}
        />
        <Stat
          label={t("yield")}
          value={format.number(yieldGrams, { style: "unit", unit: "gram", minimumFractionDigits: 1 })}
        />
        <Stat
          label={t("time")}
          value={format.number(seconds, { style: "unit", unit: "second" })}
        />
      </div>
    </Card>
  );
}

export const Surface: Story = { render: (args) => <ShotCard {...args} /> };
export const Outline: Story = {
  args: { tone: "outline" },
  render: (args) => <ShotCard {...args} />,
};

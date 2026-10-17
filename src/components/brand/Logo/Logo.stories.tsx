import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useTranslations } from "next-intl";
import messages from "@/i18n/messages/en.json";
import { LogoAppIcon, LogoMark, LogoWordmark } from "./Logo";

/**
 * The Tare mark: a digit-style zero (the scale's tare reset) with a coffee
 * bean's crease through it. Outer line about 3x the crease; strokes keep a
 * minimum on-screen width so the mark survives favicon sizes.
 */
const meta = {
  title: "Brand/Logo",
  component: LogoMark,
  args: { size: 128, label: messages.app.name },
  argTypes: { size: { control: { type: "range", min: 16, max: 256, step: 8 } } },
} satisfies Meta<typeof LogoMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mark: Story = {};

export const Wordmark: Story = {
  render: ({ size }) => <WordmarkStory size={size} />,
  args: { size: 64 },
};

function WordmarkStory({ size }: { size?: number }) {
  const t = useTranslations("app");
  return <LogoWordmark name={t("wordmark")} size={size} />;
}

export const AppIcons: Story = {
  render: () => <AppIconsStory />,
};

function AppIconsStory() {
  const t = useTranslations("app");
  return (
    <div className="flex items-center gap-8">
      <LogoAppIcon tone="light" size={160} label={t("name")} />
      <LogoAppIcon tone="dark" size={160} label={t("name")} />
    </div>
  );
}

/** Legibility check across the sizes the mark ships at. */
export const Sizes: Story = {
  render: () => <SizesStory />,
};

const SIZES = [16, 32, 64, 128];

function SizesStory() {
  const t = useTranslations("app");
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-end gap-10 text-ink">
        {SIZES.map((size) => (
          <LogoMark key={size} size={size} label={t("name")} />
        ))}
      </div>
      <div className="flex items-end gap-10">
        {SIZES.map((size) => (
          <LogoAppIcon key={size} size={size} label={t("name")} />
        ))}
      </div>
      <div className="flex items-end gap-10">
        {SIZES.map((size) => (
          <LogoAppIcon key={size} tone="dark" size={size} label={t("name")} />
        ))}
      </div>
    </div>
  );
}

/** Reversed: paper on charcoal, for dark headers and splash screens. */
export const OnDark: Story = {
  render: () => <OnDarkStory />,
};

function OnDarkStory() {
  const t = useTranslations("app");
  return (
    <div className="flex items-center gap-12 rounded-lg bg-action p-12 text-on-action">
      <LogoMark size={96} label={t("name")} />
      <LogoWordmark name={t("wordmark")} size={56} className="text-on-action" />
    </div>
  );
}

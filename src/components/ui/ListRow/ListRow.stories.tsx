import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { exampleRecipe } from "@/components/screens/fixtures";
import messages from "@/i18n/messages/en.json";
import { ShotValues } from "../ShotValues/ShotValues";
import { ListRow } from "./ListRow";

const meta = {
  title: "Components/ListRow",
  component: ListRow,
  decorators: [
    (Story) => (
      <div className="w-[390px] px-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    primary: messages.drinks.latte,
    secondary: messages.shot.beanPlaceholder,
    end: <ShotValues values={exampleRecipe} size="compact" />,
    onClick: () => {},
  },
};

export const WithMarkers: Story = {
  args: {
    ...Default.args,
    footer: (
      <span className="text-overline uppercase text-ink-secondary">{messages.shots.oneTap}</span>
    ),
  },
};

export const RightToLeft: Story = { ...WithMarkers, globals: { direction: "rtl" } };

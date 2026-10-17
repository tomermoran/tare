import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import messages from "@/i18n/messages/en.json";
import { Button } from "../Button/Button";
import { PageHeader } from "./PageHeader";

const meta = {
  title: "Components/PageHeader",
  component: PageHeader,
  decorators: [
    (Story) => (
      <div className="w-[390px] px-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = { args: { title: messages.shots.title } };

export const Task: Story = {
  args: {
    variant: "task",
    title: messages.log.titleDialIn,
    start: (
      <Button variant="ghost" size="sm" className="-ms-4">
        {messages.actions.cancel}
      </Button>
    ),
  },
};

export const TaskRightToLeft: Story = { ...Task, globals: { direction: "rtl" } };

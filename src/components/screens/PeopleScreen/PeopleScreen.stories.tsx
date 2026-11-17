import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import { ListSkeleton } from "@/components/ui/Skeleton/Skeleton";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { PeopleScreen } from "./PeopleScreen";

/* SCR-PEOPLE with placeholder profiles; the app holds no personal data. */

const t = createTranslator({ locale: "en", messages });
const { people, profile, actions, states } = messages;

const rows = [
  { id: "main", name: profile.defaultName, main: true, secondary: t("people.summary", { count: 12, when: "3 days ago" }) },
  { id: "a", name: "Person A", main: false, secondary: t("people.summary", { count: 1, when: "yesterday" }) },
  { id: "b", name: "Person B", main: false, secondary: people.noShots },
];

const meta = {
  title: "Screens/People",
  component: PeopleScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: {
    labels: { title: people.title, back: actions.back, intro: people.intro, you: people.you, add: people.add },
    backHref: "/profile",
    rows,
    onOpen: fn(),
    onAdd: fn(),
  },
} satisfies Meta<typeof PeopleScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The user's own profile first, marked "you", then the others with shots and when last (STORY-05-01-01 AC 2). */
export const List: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");
    await expect(buttons[0]).toHaveTextContent(`${people.you}${profile.defaultName}`);
    await expect(canvas.getByText(people.noShots)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: /Person A/ }));
    await expect(args.onOpen).toHaveBeenCalledWith("a");
    await userEvent.click(canvas.getByRole("button", { name: people.add }));
    await expect(args.onAdd).toHaveBeenCalled();
  },
};

/** Just the user: their own profile and "Add someone". */
export const JustYou: Story = { args: { rows: rows.slice(0, 1) } };

export const Loading: Story = { render: () => <ListSkeleton label={states.loading} rows={3} /> };

export const RightToLeft: Story = { globals: { direction: "rtl" } };

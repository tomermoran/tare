import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { TabBar } from "@/components/ui/TabBar/TabBar";
import type { ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import messages from "@/i18n/messages/en.json";
import { exampleCoffee, exampleNow, exampleRecipe, exampleRemainingGrams, exampleShots, exampleSetup } from "./fixtures";
import { HomeScreen } from "./HomeScreen/HomeScreen";
import { PhoneFrame } from "./PhoneFrame";
import type { RecentItem } from "./RecentShotsScreen/RecentShotsScreen";
import { RecentShotsScreen } from "./RecentShotsScreen/RecentShotsScreen";
import { ShotLogScreen } from "./ShotLogScreen/ShotLogScreen";

const { nav } = messages;
const grams = new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "short" });
const tabs = [
  { id: "brew", label: nav.brew },
  { id: "journal", label: nav.journal },
  { id: "beans", label: nav.beans },
  { id: "setup", label: nav.setup },
];

/**
 * The daily flow, clickable: pull a shot, mark it off, dial in on the shot
 * log, save, and see it in the Journal. Beans and Setup aren't built yet.
 */
function DailyFlow() {
  const [tab, setTab] = useState("brew");
  const [logMode, setLogMode] = useState<"dialIn" | "fix" | null>(null);
  const [pulled, setPulled] = useState(false);
  const [reaction, setReaction] = useState<"good" | "off" | null>(null);
  const [remaining, setRemaining] = useState(exampleRemainingGrams);
  const [recipe] = useState<ShotValuesData>(exampleRecipe);
  const [shots, setShots] = useState<RecentItem[]>(exampleShots);
  const drink = messages.drinks.latte;

  const addShot = (values: ShotValuesData, oneTap: boolean) => {
    setShots((s) => [
      { kind: "shot", id: `new-${s.length}`, drink, at: exampleNow, coffee: exampleCoffee.bean, values, oneTap },
      ...s,
    ]);
    setRemaining((g) => g - values.dose);
  };

  if (logMode) {
    return (
      <PhoneFrame>
        <ShotLogScreen
          mode={logMode}
          setup={exampleSetup}
          drink={drink}
          coffee={exampleCoffee.bean}
          start={recipe}
          onCancel={() => setLogMode(null)}
          onSave={(values) => {
            addShot(values, false);
            setLogMode(null);
            setTab("journal");
          }}
        />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame
      bottom={
        <TabBar
          label={nav.label}
          tabs={tabs}
          current={tab}
          onSelect={(id) => {
            setTab(id);
            setPulled(false);
          }}
        />
      }
    >
      {tab === "brew" && (
        <HomeScreen
          drink={drink}
          coffee={messages.home.coffeeLine.replace("{bean}", exampleCoffee.bean).replace("{roaster}", exampleCoffee.roaster)}
          values={recipe}
          setup={exampleSetup}
          footnote={messages.home.remaining.replace("{amount}", grams.format(remaining))}
          labels={{ changeDrink: messages.home.changeDrink, changeCoffee: messages.home.changeCoffee }}
          actions={
            pulled ? (
              <div className="grid justify-items-center gap-3 text-center">
                <p className="text-h3" role="status">
                  {messages.home.pulled}
                </p>
                <ChipGroup
                  label={messages.home.reactionLabel}
                  options={[
                    { value: "good", label: messages.home.reactionGood },
                    { value: "off", label: messages.home.reactionOff },
                  ]}
                  value={reaction}
                  onChange={(v) => {
                    const r = v as "good" | "off";
                    setReaction(r);
                    if (r === "off") {
                      setPulled(false);
                      setLogMode("fix");
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShots((s) => s.slice(1));
                    setRemaining((g) => g + recipe.dose);
                    setPulled(false);
                  }}
                >
                  {messages.home.undo}
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    addShot(recipe, true);
                    setPulled(true);
                    setReaction(null);
                  }}
                >
                  {messages.home.pull}
                </Button>
                <Button variant="ghost" fullWidth onClick={() => setLogMode("dialIn")}>
                  {messages.home.dialIn}
                </Button>
              </>
            )
          }
        />
      )}
      {tab === "journal" && <RecentShotsScreen items={shots} now={exampleNow} onOpen={() => {}} />}
      {(tab === "beans" || tab === "setup") && (
        <p className="m-auto text-center text-body text-ink-secondary">{messages.states.notBuilt}</p>
      )}
    </PhoneFrame>
  );
}

const meta = {
  title: "Screens/Daily flow",
  component: DailyFlow,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DailyFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Clickable: Story = {};

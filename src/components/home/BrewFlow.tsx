"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { HomeScreen } from "@/components/screens/HomeScreen/HomeScreen";
import { buttonClass } from "@/components/ui/Button/Button";
import { Button } from "@/components/ui/Button/Button";
import { SelectSheet, type SelectOption } from "@/components/ui/SelectSheet/SelectSheet";

type Field = "drink" | "coffee";

export type BrewAction =
  | { kind: "link"; label: string; href: string }
  | { kind: "chooseCoffee"; label: string };

/**
 * Brew's client side: the drink and coffee selects (SH-SELECT), which put
 * the choice in the URL for this visit only, never as a setting (DQ-17).
 * The page computes everything shown. The one-tap pull joins in its own task.
 */
export function BrewFlow({
  screen,
  primary,
  secondary,
  drinks,
  coffees,
  drinkId,
  beanId,
  sheetTitles,
  closeLabel,
}: {
  screen: Omit<ComponentProps<typeof HomeScreen>, "actions" | "onChangeDrink" | "onChangeCoffee">;
  primary: BrewAction;
  secondary?: BrewAction;
  drinks: SelectOption[];
  coffees: SelectOption[];
  drinkId: string;
  beanId: string | null;
  sheetTitles: Record<Field, string>;
  closeLabel: string;
}) {
  const router = useRouter();
  const [picking, setPicking] = useState<Field | null>(null);

  const choose = (field: Field, id: string) => {
    setPicking(null);
    const params = new URLSearchParams({ drink: field === "drink" ? id : drinkId });
    const coffee = field === "coffee" ? id : beanId;
    if (coffee) params.set("coffee", coffee);
    router.replace(`/?${params}`, { scroll: false });
  };

  const action = (a: BrewAction, variant: "primary" | "ghost") =>
    a.kind === "link" ? (
      <Link key={a.label} href={a.href} className={buttonClass({ variant, fullWidth: true })}>
        {a.label}
      </Link>
    ) : (
      <Button key={a.label} variant={variant} fullWidth onClick={() => setPicking("coffee")}>
        {a.label}
      </Button>
    );

  const sheet = picking === "drink" ? { options: drinks, value: drinkId } : { options: coffees, value: beanId };
  return (
    <>
      <HomeScreen
        {...screen}
        onChangeDrink={() => setPicking("drink")}
        onChangeCoffee={coffees.length ? () => setPicking("coffee") : undefined}
        actions={
          <>
            {action(primary, "primary")}
            {secondary && action(secondary, "ghost")}
          </>
        }
      />
      <SelectSheet
        open={picking !== null}
        onClose={() => setPicking(null)}
        title={picking ? sheetTitles[picking] : ""}
        closeLabel={closeLabel}
        options={sheet.options}
        value={sheet.value}
        onChoose={(id) => picking && choose(picking, id)}
      />
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ListScreen } from "@/components/screens/ListScreen/ListScreen";
import { Notice } from "@/components/ui/Notice/Notice";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { addDrinkAction, moveDrinkAction, saveDrinkAction, type ListError } from "@/server/actions/lists";
import type { ListDrink } from "@/server/dal/drinks";
import { DrinkSheet, type DrinkSheetError, type DrinkSheetValues } from "./DrinkSheet";

type Editing = { id: string | null; busy: boolean; error: DrinkSheetError; key: number } | null;

const sheetError = (e: ListError): DrinkSheetError => (e === "nameRequired" || e === "nameTaken" ? e : "saveFailed");

/**
 * SCR-DRINKS wired (EPIC-02-05): the sheet saves through the list actions
 * and refreshes; each move saves at once and a failed one puts the row back
 * with a notice (STORY-02-05-04 AC 3).
 */
export function DrinksFlow({ drinks, backHref }: { drinks: ListDrink[]; backHref: string }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [list, setList] = useState(drinks);
  const [reordering, setReordering] = useState(false);
  const [said, setSaid] = useState("");
  const [moveFailed, setMoveFailed] = useState<{ id: string; to: number } | null>(null);
  const [editing, setEditing] = useState<Editing>(null);
  // The server's list wins once it's refreshed.
  const [server, setServer] = useState(drinks);
  if (server !== drinks) {
    setServer(drinks);
    setList(drinks);
  }

  const nameOf = (d: Pick<ListDrink, "name" | "nameKey">) => drinkLabel(d, (key: DrinkKey) => t(key));
  const ml = (n: number) => format.number(n, { style: "unit", unit: "milliliter", unitDisplay: "short" });
  const shownCount = list.filter((d) => !d.hidden).length;

  const move = async (id: string, to: number) => {
    const before = list;
    const from = before.findIndex((d) => d.id === id);
    const next = before.filter((d) => d.id !== id);
    next.splice(to, 0, before[from]);
    setList(next);
    setMoveFailed(null);
    setSaid(t("drinkList.moved", { name: nameOf(before[from]), position: to + 1, count: next.length }));
    const result = await moveDrinkAction(id, to);
    if (!result.ok) {
      setList(before);
      setMoveFailed({ id, to });
      setSaid(t("drinkList.reorderFailed"));
      return;
    }
    router.refresh();
  };

  const save = async (values: DrinkSheetValues) => {
    if (!editing) return;
    setEditing({ ...editing, busy: true, error: null });
    const result = editing.id
      ? await saveDrinkAction(editing.id, {
          name: values.name,
          hidden: values.hidden,
          typicalMilkMl: values.hasMilk && values.typicalMilkMl !== null ? values.typicalMilkMl : undefined,
        })
      : await addDrinkAction({ name: values.name ?? "", hasMilk: values.hasMilk, typicalMilkMl: values.typicalMilkMl ?? undefined });
    if (!result.ok) return setEditing({ ...editing, busy: false, error: sheetError(result.error) });
    setEditing(null);
    router.refresh();
  };

  const open = editing?.id ? list.find((d) => d.id === editing.id) : undefined;
  return (
    <>
      <ListScreen
        backHref={backHref}
        reordering={reordering}
        announcement={said}
        onToggleReorder={() => setReordering((r) => !r)}
        onMove={(id, to) => void move(id, to)}
        onOpen={(id) => setEditing({ id, busy: false, error: null, key: Date.now() })}
        onAdd={() => setEditing({ id: null, busy: false, error: null, key: Date.now() })}
        notice={
          moveFailed && (
            <Notice urgent action={{ label: t("actions.retry"), onClick: () => void move(moveFailed.id, moveFailed.to) }}>
              {t("drinkList.reorderFailed")}
            </Notice>
          )
        }
        rows={list.map((d) => ({
          id: d.id,
          name: nameOf(d),
          hidden: d.hidden,
          secondary: d.hasMilk
            ? d.typicalMilkMl !== null
              ? t("drinkList.withMilk", { amount: ml(d.typicalMilkMl) })
              : t("drinkList.withMilkNoAmount")
            : t("drinkList.noMilk"),
        }))}
        labels={{
          title: t("drinkList.title"),
          back: t("actions.back"),
          intro: t("drinkList.intro"),
          add: t("drinkList.add"),
          reorder: t("drinkList.reorder"),
          done: t("actions.done"),
          hidden: t("drinkList.hidden"),
        }}
        reorderLabels={{
          moveUp: (name) => t("drinkList.moveUp", { name }),
          moveDown: (name) => t("drinkList.moveDown", { name }),
          moved: (name, position, count) => t("drinkList.moved", { name, position, count }),
        }}
      />
      {editing && (
        <DrinkSheet
          key={editing.key}
          open
          busy={editing.busy}
          error={editing.error}
          onSave={(v) => void save(v)}
          onClose={() => setEditing(null)}
          drink={
            open && {
              name: nameOf(open),
              originalName: open.name && open.nameKey ? nameOf({ name: null, nameKey: open.nameKey }) : null,
              hasMilk: open.hasMilk,
              typicalMilkMl: open.typicalMilkMl,
              hidden: open.hidden,
              canHide: open.hidden || shownCount > 1,
            }
          }
          labels={{
            editTitle: t("drinkList.editTitle"),
            addTitle: t("drinkList.addTitle"),
            close: t("actions.close"),
            name: t("drinkList.name"),
            resetName: t("drinkList.resetName"),
            nameRequired: t("drinkList.nameRequired"),
            nameTaken: t("drinkList.nameTaken"),
            usualMilk: t("drinkList.usualMilk"),
            hasMilk: t("drinkList.hasMilk"),
            hasMilkLine: t("drinkList.hasMilkLine"),
            noMilkLine: t("drinkList.noMilkLine"),
            hasMilkFixed: t("drinkList.hasMilkFixed"),
            hasMilkHint: t("drinkList.hasMilkHint"),
            show: t("drinkList.show"),
            keepOne: t("drinkList.keepOne"),
            save: t("actions.save"),
            saveFailed: t("states.saveFailed"),
            retry: t("actions.retry"),
            discardTitle: t("drinkList.discardTitle"),
            discardBody: t("drinkList.discardBody"),
            discard: t("actions.discard"),
            keepEditing: t("actions.keepEditing"),
          }}
        />
      )}
    </>
  );
}

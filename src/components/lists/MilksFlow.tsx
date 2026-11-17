"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ListScreen } from "@/components/screens/ListScreen/ListScreen";
import { Notice } from "@/components/ui/Notice/Notice";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { addMilkAction, moveMilkAction, saveMilkAction, type ListError } from "@/server/actions/lists";
import type { ListMilk } from "@/server/dal/milks";
import { MilkSheet, type MilkSheetError, type MilkSheetValues } from "./MilkSheet";

type Editing = { id: string | null; busy: boolean; error: MilkSheetError; key: number } | null;

const sheetError = (e: ListError): MilkSheetError => (e === "nameRequired" || e === "nameTaken" ? e : "saveFailed");

/**
 * SCR-MILKS wired (STORY-02-05-05), like the drinks: the sheet saves
 * through the list actions and refreshes; each move saves at once and a
 * failed one puts the row back with a notice (AC 4).
 */
export function MilksFlow({ milks, backHref }: { milks: ListMilk[]; backHref: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [list, setList] = useState(milks);
  const [reordering, setReordering] = useState(false);
  const [said, setSaid] = useState("");
  const [moveFailed, setMoveFailed] = useState<{ id: string; to: number } | null>(null);
  const [editing, setEditing] = useState<Editing>(null);
  // The server's list wins once it's refreshed.
  const [server, setServer] = useState(milks);
  if (server !== milks) {
    setServer(milks);
    setList(milks);
  }

  const nameOf = (m: Pick<ListMilk, "name" | "nameKey">) => milkLabel(m, (key: MilkKey) => t(key));
  const shownCount = list.filter((m) => !m.hidden).length;

  const move = async (id: string, to: number) => {
    const before = list;
    const from = before.findIndex((m) => m.id === id);
    const next = before.filter((m) => m.id !== id);
    next.splice(to, 0, before[from]);
    setList(next);
    setMoveFailed(null);
    setSaid(t("milkList.moved", { name: nameOf(before[from]), position: to + 1, count: next.length }));
    const result = await moveMilkAction(id, to);
    if (!result.ok) {
      setList(before);
      setMoveFailed({ id, to });
      setSaid(t("milkList.reorderFailed"));
      return;
    }
    router.refresh();
  };

  const save = async (values: MilkSheetValues) => {
    if (!editing) return;
    setEditing({ ...editing, busy: true, error: null });
    const result = editing.id
      ? await saveMilkAction(editing.id, { name: values.name, hidden: values.hidden })
      : await addMilkAction({ name: values.name ?? "", kind: values.kind });
    if (!result.ok) return setEditing({ ...editing, busy: false, error: sheetError(result.error) });
    setEditing(null);
    router.refresh();
  };

  const open = editing?.id ? list.find((m) => m.id === editing.id) : undefined;
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
              {t("milkList.reorderFailed")}
            </Notice>
          )
        }
        rows={list.map((m) => ({
          id: m.id,
          name: nameOf(m),
          hidden: m.hidden,
          secondary: m.kind === "plant" ? t("milkList.plant") : t("milkList.dairy"),
        }))}
        labels={{
          title: t("milkList.title"),
          back: t("actions.back"),
          intro: t("milkList.intro"),
          add: t("milkList.add"),
          reorder: t("milkList.reorder"),
          done: t("actions.done"),
          hidden: t("milkList.hidden"),
        }}
        reorderLabels={{
          moveUp: (name) => t("milkList.moveUp", { name }),
          moveDown: (name) => t("milkList.moveDown", { name }),
          moved: (name, position, count) => t("milkList.moved", { name, position, count }),
        }}
      />
      {editing && (
        <MilkSheet
          key={editing.key}
          open
          busy={editing.busy}
          error={editing.error}
          onSave={(v) => void save(v)}
          onClose={() => setEditing(null)}
          milk={
            open && {
              name: nameOf(open),
              originalName: open.name && open.nameKey ? nameOf({ name: null, nameKey: open.nameKey }) : null,
              kind: open.kind,
              hidden: open.hidden,
              canHide: open.hidden || shownCount > 1,
            }
          }
          labels={{
            editTitle: t("milkList.editTitle"),
            addTitle: t("milkList.addTitle"),
            close: t("actions.close"),
            name: t("milkList.name"),
            resetName: t("milkList.resetName"),
            nameRequired: t("milkList.nameRequired"),
            nameTaken: t("milkList.nameTaken"),
            kind: t("milkList.kind"),
            dairy: t("milkList.dairy"),
            plant: t("milkList.plant"),
            kindFixed: t("milkList.kindFixed"),
            kindRequired: t("milkList.kindRequired"),
            show: t("milkList.show"),
            keepOne: t("milkList.keepOne"),
            save: t("actions.save"),
            saveFailed: t("states.saveFailed"),
            retry: t("actions.retry"),
            discardTitle: t("milkList.discardTitle"),
            discardBody: t("milkList.discardBody"),
            discard: t("actions.discard"),
            keepEditing: t("actions.keepEditing"),
          }}
        />
      )}
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PeopleScreen, type PeopleRow } from "@/components/screens/PeopleScreen/PeopleScreen";
import { addPersonAction, removePersonAction, renamePersonAction, type PeopleError } from "@/server/actions/people";
import { PersonSheet, type PersonSheetError, type SheetPerson } from "./PersonSheet";

/** A row with what its sheet needs: the name as typed (empty for an unnamed main profile). */
export type PeopleFlowRow = PeopleRow & { editName: string; sheet: Omit<SheetPerson, "name"> };

type Editing = { id: string | null; busy: boolean; error: PersonSheetError; removeFailed: boolean; key: number } | null;

const sheetError = (e: PeopleError): PersonSheetError => (e === "nameRequired" || e === "nameTaken" ? e : "saveFailed");

/**
 * SCR-PEOPLE wired (STORY-05-01-01, 05-01-02): the sheet adds, renames and
 * removes through the people actions, then refreshes; adding and removing
 * say so politely.
 */
export function PeopleFlow({ rows, backHref }: { rows: PeopleFlowRow[]; backHref: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [said, setSaid] = useState("");
  const open = editing?.id ? rows.find((r) => r.id === editing.id) : undefined;

  const save = async (name: string) => {
    if (!editing) return;
    setEditing({ ...editing, busy: true, error: null });
    const result = editing.id ? await renamePersonAction(editing.id, name) : await addPersonAction(name);
    if (!result.ok) return setEditing({ ...editing, busy: false, error: sheetError(result.error) });
    if (!editing.id) setSaid(t("people.added", { name: name.trim() }));
    setEditing(null);
    router.refresh();
  };

  const remove = async () => {
    if (!editing?.id || !open) return;
    setEditing({ ...editing, busy: true, removeFailed: false });
    const result = await removePersonAction(editing.id);
    if (!result.ok) return setEditing({ ...editing, busy: false, removeFailed: true });
    setSaid(t("people.removed", { name: open.name }));
    setEditing(null);
    router.refresh();
  };

  const start = (id: string | null) => setEditing({ id, busy: false, error: null, removeFailed: false, key: Date.now() });
  return (
    <>
      <PeopleScreen
        backHref={backHref}
        rows={rows}
        announcement={said}
        onOpen={start}
        onAdd={() => start(null)}
        labels={{ title: t("people.title"), back: t("actions.back"), intro: t("people.intro"), you: t("people.you"), add: t("people.add") }}
      />
      {editing && (
        <PersonSheet
          key={editing.key}
          open
          busy={editing.busy}
          error={editing.error}
          removeFailed={editing.removeFailed}
          person={open && { name: open.editName, ...open.sheet }}
          onSave={(name) => void save(name)}
          onRemove={() => void remove()}
          onClose={() => setEditing(null)}
          labels={{
            addTitle: t("people.addTitle"),
            editTitle: t("people.editTitle"),
            close: t("actions.close"),
            name: t("people.name"),
            nameHint: t("people.nameHint"),
            nameRequired: t("people.nameRequired"),
            nameTaken: t("people.nameTaken"),
            save: t("actions.save"),
            saveFailed: t("states.saveFailed"),
            remove: t("people.remove"),
            removeTitle: t("people.removeTitle"),
            removeBody: t("people.removeBody"),
            removeConfirm: t("people.removeConfirm"),
            cancel: t("actions.cancel"),
          }}
        />
      )}
    </>
  );
}

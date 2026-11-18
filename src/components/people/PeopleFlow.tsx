"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { createInviteAction, pendingInviteAction, withdrawInviteAction } from "@/server/actions/invites";
import { PeopleScreen, type PeopleRow } from "@/components/screens/PeopleScreen/PeopleScreen";
import { addPersonAction, removePersonAction, renamePersonAction, type PeopleError } from "@/server/actions/people";
import { InviteSheet } from "./InviteSheet";
import { PersonSheet, type PersonSheetError, type SheetPerson } from "./PersonSheet";

/**
 * A row with what its sheet needs: the name as typed (empty for an unnamed
 * main profile), and whether it can be invited for or has a link pending.
 */
export type PeopleFlowRow = PeopleRow & { editName: string; sheet: Omit<SheetPerson, "name" | "invite"> & { invite?: "can" | "pending" } };

type Inviting = { id: string; name: string; link: string | null; expiresAt: Date | null; busy: boolean; failure: "create" | "withdraw" | "load" | null };

type Editing = { id: string | null; busy: boolean; error: PersonSheetError; removeFailed: boolean; key: number } | null;

const sheetError = (e: PeopleError): PersonSheetError => (e === "nameRequired" || e === "nameTaken" ? e : "saveFailed");

/**
 * SCR-PEOPLE wired (STORY-05-01-01, 05-01-02): the sheet adds, renames and
 * removes through the people actions, then refreshes; adding and removing
 * say so politely. A profile with no login opens SH-INVITE to make a link,
 * or to see and withdraw the pending one (STORY-05-02-01, 05-02-06).
 */
export function PeopleFlow({ rows, backHref }: { rows: PeopleFlowRow[]; backHref: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [said, setSaid] = useState("");
  const [inviting, setInviting] = useState<Inviting | null>(null);
  const format = useFormatter();
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
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

  const startInvite = async (row: PeopleFlowRow, pending: boolean) => {
    setEditing(null);
    const base: Inviting = { id: row.id, name: row.name, link: null, expiresAt: null, busy: pending, failure: null };
    setInviting(base);
    if (!pending) return;
    const result = await pendingInviteAction(row.id);
    if (!result.ok) return setInviting({ ...base, busy: false, failure: "load" });
    // Expired or used meanwhile: a new one can be made.
    setInviting({ ...base, busy: false, link: result.data?.link ?? null, expiresAt: result.data?.expiresAt ?? null });
  };

  const create = async () => {
    if (!inviting) return;
    setInviting({ ...inviting, busy: true, failure: null });
    const result = await createInviteAction(inviting.id);
    if (!result.ok) return setInviting({ ...inviting, busy: false, failure: "create" });
    setInviting({ ...inviting, busy: false, failure: null, link: result.data.link, expiresAt: result.data.expiresAt });
    router.refresh();
  };

  const withdraw = async () => {
    if (!inviting) return;
    setInviting({ ...inviting, busy: true, failure: null });
    const result = await withdrawInviteAction(inviting.id);
    if (!result.ok) return setInviting({ ...inviting, busy: false, failure: "withdraw" });
    setInviting(null);
    setSaid(t("invite.withdrawn"));
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
        labels={{ title: t("people.title"), back: t("actions.back"), intro: t("people.intro"), you: t("people.you"), add: t("people.add"), invitePending: t("people.invitePending") }}
      />
      {editing && (
        <PersonSheet
          key={editing.key}
          open
          busy={editing.busy}
          error={editing.error}
          removeFailed={editing.removeFailed}
          person={
            open && {
              name: open.editName,
              ...open.sheet,
              invite: open.sheet.invite
                ? {
                    label: open.sheet.invite === "pending" ? t("people.showInvite") : t("people.invite", { name: open.name }),
                    onClick: () => void startInvite(open, open.sheet.invite === "pending"),
                  }
                : undefined,
            }
          }
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
      {inviting && (
        <InviteSheet
          open
          onClose={() => setInviting(null)}
          link={inviting.link}
          valid={inviting.expiresAt ? t("invite.valid", { date: format.dateTime(inviting.expiresAt, { day: "numeric", month: "long" }) }) : undefined}
          busy={inviting.busy}
          failure={
            inviting.failure
              ? {
                  message: inviting.failure === "withdraw" ? t("invite.withdrawFailed") : inviting.failure === "load" ? t("states.loadFailed") : t("states.saveFailed"),
                  onRetry: () => void (inviting.failure === "withdraw" ? withdraw() : inviting.failure === "load" ? startInvite(rows.find((r) => r.id === inviting.id)!, true) : create()),
                }
              : undefined
          }
          onCreate={() => void create()}
          onShare={inviting.link && canShare ? () => void navigator.share({ url: inviting.link! }).catch(() => undefined) : undefined}
          onWithdraw={inviting.link ? () => void withdraw() : undefined}
          labels={{
            title: t("invite.title", { name: inviting.name }),
            close: t("actions.close"),
            sharesIntro: t("invite.sharesIntro"),
            shares: [t("invite.shares.signIn"), t("invite.shares.takeOver"), t("invite.shares.household")],
            create: t("invite.create"),
            link: t("invite.link"),
            copy: t("invite.copy"),
            copied: t("invite.copied"),
            share: t("invite.share"),
            sendYourself: t("invite.sendYourself"),
            withdraw: t("invite.withdraw"),
            retry: t("actions.retry"),
          }}
        />
      )}
    </>
  );
}

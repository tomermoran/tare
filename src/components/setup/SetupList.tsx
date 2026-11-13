"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonClass } from "@/components/ui/Button/Button";
import { Notice } from "@/components/ui/Notice/Notice";
import { chooseSetupAction, renameSetupAction } from "@/server/actions/setups";
import { SetupCard } from "./SetupCards";
import { SetupRenameSheet } from "./SetupRenameSheet";

/*
 * The setups on SCR-KIT, wired (STORY-01-02-09): the current one first and
 * marked, the rest by last used; setups unused for 90 days collapse under
 * "older". The current setup offers "change a part"; the others "use this"
 * (current at once, AC 3) and "change a part". "Rename" opens a sheet with
 * the name only, so naming never changes the setup (AC 5).
 */

export type SetupListItem = {
  id: string;
  /** Name or parts name. */
  label: string;
  /** The saved name, for the rename field. */
  name: string | null;
  current: boolean;
  older: boolean;
  /** Each by maker and model, in kind order. */
  parts: string[];
  recipeCount: string;
  lastUsed?: string;
  changePartHref: string;
};

export type SetupListLabels = {
  current: string;
  useThis: string;
  changePart: string;
  rename: string;
  renameTitle: string;
  name: string;
  nameHint: string;
  save: string;
  close: string;
  /** "2 older setups", counted by the caller. */
  older: string;
  saveFailed: string;
};

export function SetupList({ items, labels }: { items: SetupListItem[]; labels: SetupListLabels }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [showOlder, setShowOlder] = useState(false);
  const [renaming, setRenaming] = useState<SetupListItem | null>(null);
  const [draft, setDraft] = useState("");
  const [renameState, setRenameState] = useState<"idle" | "saving" | "failed">("idle");

  const use = async (id: string) => {
    setBusy(id);
    setFailed(null);
    const result = await chooseSetupAction(id);
    setBusy(null);
    if (!result.ok) {
      setFailed(id);
      return;
    }
    router.refresh();
  };

  const openRename = (item: SetupListItem) => {
    setRenaming(item);
    setDraft(item.name ?? "");
    setRenameState("idle");
  };

  const saveName = async () => {
    if (!renaming) return;
    setRenameState("saving");
    const result = await renameSetupAction({ id: renaming.id, name: draft });
    if (!result.ok) {
      setRenameState("failed");
      return;
    }
    setRenaming(null);
    router.refresh();
  };

  const card = (item: SetupListItem) => (
    <SetupCard
      key={item.id}
      overline={item.current ? labels.current : undefined}
      name={item.label}
      parts={item.parts}
      recipeCount={item.recipeCount}
      lastUsed={item.lastUsed}
      actions={
        <>
          {!item.current && (
            <Button
              size="sm"
              onClick={() => use(item.id)}
              disabled={busy === item.id}
              aria-busy={busy === item.id || undefined}
            >
              {labels.useThis}
            </Button>
          )}
          <Link
            href={item.changePartHref}
            className={buttonClass({ size: "sm", variant: item.current ? "secondary" : "ghost" })}
          >
            {labels.changePart}
          </Link>
          <Button size="sm" variant="ghost" onClick={() => openRename(item)}>
            {labels.rename}
          </Button>
          {failed === item.id && (
            <Notice size="inline" urgent>
              {labels.saveFailed}
            </Notice>
          )}
        </>
      }
    />
  );

  const recent = items.filter((i) => !i.older);
  const older = items.filter((i) => i.older);

  return (
    <div className="flex flex-col gap-4">
      {recent.map(card)}
      {older.length > 0 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            aria-expanded={showOlder}
            aria-controls="setup-older"
            onClick={() => setShowOlder((v) => !v)}
          >
            {labels.older}
          </Button>
          <div id="setup-older" hidden={!showOlder} className="flex flex-col gap-4">
            {showOlder && older.map(card)}
          </div>
        </>
      )}
      <SetupRenameSheet
        open={renaming !== null}
        labels={{
          title: labels.renameTitle,
          name: labels.name,
          nameHint: labels.nameHint,
          save: labels.save,
          close: labels.close,
          saveFailed: labels.saveFailed,
        }}
        value={draft}
        placeholder={renaming?.label ?? ""}
        state={renameState}
        onChange={setDraft}
        onSave={saveName}
        onClose={() => setRenaming(null)}
      />
    </div>
  );
}

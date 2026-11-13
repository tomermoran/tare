"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { CatalogAddScreen, type CatalogAddErrors } from "@/components/screens/CatalogAddScreen/CatalogAddScreen";
import { useUnsavedChanges } from "@/components/task/useUnsavedChanges";
import { SelectSheet } from "@/components/ui/SelectSheet/SelectSheet";
import { ROAST_LEVELS, type RoastLevel } from "@/domain/roast";
import { normalizeUrl } from "@/domain/url";
import { returnWithSelection } from "@/lib/returnTo";
import { createCoffeeEntryAction } from "@/server/actions/catalog";
import type { CatalogMatch } from "@/server/dal/catalogAdd";
import { CoffeeDetails, NOT_SURE } from "./CoffeeDetails";
import { useCatalogExtras } from "./useCatalogExtras";

/*
 * SCR-CATALOG-ADD for a coffee, wired (STORY-01-06-02, 01-06-05). The
 * search text is the coffee's name; the roaster is chosen or added with
 * its own link. Roast level (the fixed list) and tasting notes are
 * optional. Saving goes back to adding the bag with the coffee chosen.
 */

const NEW_ROASTER = "new";

export function CoffeeAddFlow({
  initialName,
  roasters,
  returnTo,
}: {
  initialName: string;
  roasters: { id: string; name: string; addedByYou: boolean }[];
  returnTo: string;
}) {
  const t = useTranslations();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [roasterId, setRoasterId] = useState<string | null>(null);
  const [roasterName, setRoasterName] = useState("");
  const [roasterUrl, setRoasterUrl] = useState("");
  const [name, setName] = useState(initialName);
  const [roast, setRoast] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [picking, setPicking] = useState(false);
  const [check, setCheck] = useState<"idle" | "checking" | "failed">("idle");
  const [duplicate, setDuplicate] = useState<CatalogMatch | null>(null);
  const [errors, setErrors] = useState<CatalogAddErrors>({});
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const checked = useRef<string | null>(null);
  const describe = (m: CatalogMatch) =>
    t("catalog.duplicateFound", { name: m.name, maker: m.catalog === "coffee" ? m.roasterName : m.makerName });
  const extras = useCatalogExtras({ catalog: "coffee", describe, onUseExisting: (id) => backWith(id) });

  // Next keeps a left page's state; the task starts fresh each time.
  useLayoutEffect(
    () => () => {
      setUrl("");
      setRoasterId(null);
      setName(initialName);
      setRoast(null);
      setNotes("");
      setDuplicate(null);
      setErrors({});
      setState("idle");
      checked.current = null;
      extras.reset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on hide only
    [],
  );

  const dirty =
    url.trim() !== "" || roasterId !== null || name !== initialName || roast !== null || notes.trim() !== "" || extras.dirty;
  const { leave, proceed, confirm } = useUnsavedChanges(dirty, () => router.replace(returnTo));
  const backWith = (id: string) => proceed(() => router.replace(returnWithSelection(returnTo, id)));

  const checkUrl = async () => {
    const normalized = normalizeUrl(url);
    if (!normalized || checked.current === normalized) return;
    checked.current = normalized;
    setCheck("checking");
    try {
      const res = await fetch(`/api/catalog/check-url?${new URLSearchParams({ catalog: "coffee", url })}`);
      if (!res.ok) throw new Error(String(res.status));
      const { match } = (await res.json()) as { match: CatalogMatch | null };
      setDuplicate(match);
      setCheck("idle");
    } catch {
      checked.current = null;
      setCheck("failed");
    }
  };

  const save = async () => {
    const next: CatalogAddErrors = {};
    if (!normalizeUrl(url)) next.url = t("catalog.urlMissing");
    if (!roasterId) next.parent = t("catalog.roasterMissing");
    if (roasterId === NEW_ROASTER) {
      if (!roasterName.trim()) next.parentName = t("catalog.roasterNameMissing");
      if (!normalizeUrl(roasterUrl)) next.parentUrl = t("catalog.roasterUrlMissing");
    }
    if (!name.trim()) next.name = t("catalog.beanMissing");
    setErrors(next);
    if (Object.keys(next).length) return;

    setState("saving");
    const result = await createCoffeeEntryAction({
      roaster: roasterId === NEW_ROASTER ? { name: roasterName, url: roasterUrl } : { id: roasterId! },
      bean: {
        name,
        url,
        roastLevel: roast && roast !== NOT_SURE ? roast : undefined,
        tastingNotes: notes.split(","),
      },
      ...extras.input,
    });
    if (result.ok) return backWith(result.data.id);
    setState("idle");
    if (result.error === "duplicate") return setDuplicate(result.match);
    if (result.error === "invalidLink") {
      return setErrors(result.field === "url" ? { url: t("catalog.urlMissing") } : { parentUrl: t("catalog.roasterUrlMissing") });
    }
    if (result.error === "missingName") {
      return setErrors(result.field === "maker" ? { parentName: t("catalog.roasterNameMissing") } : { name: t("catalog.beanMissing") });
    }
    setState("failed");
  };

  const chosenRoaster =
    roasterId === NEW_ROASTER ? t("catalog.newRoaster") : (roasters.find((r) => r.id === roasterId)?.name ?? null);

  return (
    <>
      <CatalogAddScreen
        labels={{
          title: t("catalog.addTitle.coffee"),
          cancel: t("actions.cancel"),
          url: t("catalog.url"),
          urlHint: t("catalog.urlCoffeeHint"),
          checking: t("catalog.checking"),
          checkFailed: t("catalog.checkFailed"),
          useExisting: t("catalog.useExisting"),
          parent: t("catalog.roaster"),
          chooseParent: t("catalog.chooseMaker"),
          parentName: t("catalog.roasterName"),
          parentUrl: t("catalog.roasterUrl"),
          parentUrlHint: t("catalog.roasterUrlHint"),
          name: t("catalog.bean"),
          save: t("catalog.save"),
          saveFailedTitle: t("catalog.saveFailedTitle"),
          saveFailed: t("states.saveFailed"),
        }}
        url={url}
        onUrlChange={(v) => {
          setUrl(v);
          setErrors((e) => ({ ...e, url: undefined }));
          if (normalizeUrl(v) !== checked.current) setDuplicate(null);
        }}
        onUrlBlur={checkUrl}
        check={check}
        duplicate={duplicate ? describe(duplicate) : undefined}
        onUseExisting={duplicate ? () => backWith(duplicate.id) : undefined}
        parent={chosenRoaster}
        onChooseParent={() => setPicking(true)}
        newParent={roasterId === NEW_ROASTER}
        parentName={roasterName}
        onParentNameChange={setRoasterName}
        parentUrl={roasterUrl}
        onParentUrlChange={setRoasterUrl}
        name={name}
        onNameChange={setName}
        capabilities={
          <CoffeeDetails
            labels={{
              roastLevel: t("catalog.roastLevel"),
              levels: Object.fromEntries(ROAST_LEVELS.map((l) => [l, t(`catalog.roast.${l}`)])) as Record<RoastLevel, string>,
              notSure: t("catalog.cap.notSure"),
              notes: t("catalog.tastingNotes"),
              notesHint: t("catalog.tastingNotesHint"),
            }}
            roast={roast}
            onRoastChange={setRoast}
            notes={notes}
            onNotesChange={setNotes}
          />
        }
        more={extras.more}
        errors={errors}
        state={state}
        onSave={save}
        onCancel={leave}
      />
      <SelectSheet
        open={picking}
        onClose={() => setPicking(false)}
        title={t("catalog.roaster")}
        closeLabel={t("actions.close")}
        options={roasters.map((r) => ({ id: r.id, primary: r.name, marker: r.addedByYou ? t("catalog.addedByYou") : undefined }))}
        value={roasterId}
        onChoose={(id) => {
          setRoasterId(id);
          setErrors((e) => ({ ...e, parent: undefined }));
          setPicking(false);
        }}
        footerRow={{
          label: t("catalog.newRoaster"),
          icon: "plus",
          onClick: () => {
            setRoasterId(NEW_ROASTER);
            setErrors((e) => ({ ...e, parent: undefined }));
            setPicking(false);
          },
        }}
      />
      {extras.marketSheet}
      {confirm}
    </>
  );
}

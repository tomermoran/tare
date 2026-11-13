"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  SetupBuilderScreen,
  type BuilderMatch,
  type BuilderOption,
} from "@/components/screens/SetupBuilderScreen/SetupBuilderScreen";
import type { HardwareKind } from "@/domain/capabilities";
import { matchSetup, SETUP_KINDS } from "@/domain/setup";
import { returnWithSelection, withReturnTo } from "@/lib/returnTo";
import { resolveSetupAction } from "@/server/actions/setups";
import { ADD_PART_PATH, BUILDER_PATH, SETUP_PATH } from "@/lib/setupRoutes";

/*
 * The setup builder, wired (STORY-01-02-04). Matching is by the exact set of
 * parts, done here from the household's setups, so the line is instant.
 * "Add a part" from a row goes to the add-part task and comes back with the
 * new part chosen. Saving finds or makes the setup, which becomes current,
 * and goes back where the builder was opened from.
 */

export type BuilderSetup = {
  id: string;
  key: string;
  partIds: string[];
  /** Name or parts name. */
  name: string;
  /** Already formatted. */
  recipeCount: string;
};

type Chosen = Record<HardwareKind, string | null>;

export function SetupBuilderFlow({
  options,
  initial,
  initialName,
  setups,
  returnTo,
}: {
  options: Record<HardwareKind, BuilderOption[]>;
  initial: Chosen;
  initialName: string;
  setups: BuilderSetup[];
  returnTo: string | null;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();

  const [chosen, setChosen] = useState<Chosen>(initial);
  const [openKind, setOpenKind] = useState<HardwareKind | null>(null);
  const [nameOpen, setNameOpen] = useState(initialName !== "");
  const [name, setName] = useState(initialName);
  const [missing, setMissing] = useState<HardwareKind[]>([]);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");

  // Next keeps a left page's state; the builder starts from the URL each time.
  useLayoutEffect(
    () => () => {
      setChosen(initial);
      setOpenKind(null);
      setMissing([]);
      setState("idle");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on hide only
    [],
  );

  const ids = useMemo(
    () => SETUP_KINDS.map((k) => chosen[k]).filter((id): id is string => !!id),
    [chosen],
  );
  const match = useMemo((): BuilderMatch | null => {
    if (ids.length !== SETUP_KINDS.length) return null;
    const found = matchSetup(ids, setups);
    if (found) return { kind: "existing", name: found.name, recipeCount: found.recipeCount };
    // The setup sharing the most parts gives the dial-in a head start (DQ-19).
    const closest = setups
      .map((s) => ({ s, shared: s.partIds.filter((id) => ids.includes(id)).length }))
      .filter((c) => c.shared > 0)
      .sort((a, b) => b.shared - a.shared)[0];
    return { kind: "new", closest: closest?.s.name };
  }, [ids, setups]);

  const here = () => {
    const params = new URLSearchParams();
    for (const k of SETUP_KINDS) if (chosen[k]) params.set(k, chosen[k]!);
    if (name.trim()) params.set("name", name.trim());
    if (returnTo) params.set("returnTo", returnTo);
    return `${BUILDER_PATH}?${params}`;
  };

  const done = (id: string) => {
    router.replace(returnTo ? returnWithSelection(returnTo, id) : SETUP_PATH);
    router.refresh();
  };

  const save = async () => {
    const lacking = SETUP_KINDS.filter((k) => !chosen[k]);
    if (lacking.length) {
      setMissing(lacking);
      return;
    }
    setMissing([]);
    setState("saving");
    const result = await resolveSetupAction({ partIds: ids, name: match?.kind === "new" ? name : undefined });
    if (result.ok) return done(result.data.id);
    if (result.error === "missingParts") {
      setMissing([...result.missing, ...result.extra]);
      setState("idle");
      return;
    }
    setState("failed");
  };

  const kinds = (list: HardwareKind[]) =>
    format.list(list.map((k) => t(`setup.kindLower.${k}`)), { type: "conjunction" });

  return (
    <SetupBuilderScreen
      labels={{
        title: t("setup.builderTitle"),
        cancel: t("actions.cancel"),
        close: t("actions.close"),
        kinds: { machine: t("setup.kind.machine"), grinder: t("setup.kind.grinder"), basket: t("setup.kind.basket") },
        kindPlural: {
          machine: t("setup.kindPlural.machine"),
          grinder: t("setup.kindPlural.grinder"),
          basket: t("setup.kindPlural.basket"),
        },
        notChosen: t("setup.notChosen"),
        addPart: t("setup.addPart"),
        matchFound: (n) => t("setup.matchFound", { name: n }),
        newSetup: t("setup.newSetup"),
        closest: (n) => t("setup.closest", { name: n }),
        addName: t("setup.addName"),
        name: t("setup.name"),
        nameHint: t("setup.nameHint"),
        useThis: t("setup.useThis"),
        makeThis: t("setup.makeThis"),
        saveFailedTitle: t("setup.saveFailedTitle"),
        saveFailed: t("states.saveFailed"),
      }}
      options={options}
      chosen={chosen}
      openKind={openKind}
      onOpenKind={setOpenKind}
      onChoose={(kind, id) => {
        setChosen((c) => ({ ...c, [kind]: id }));
        setMissing((m) => m.filter((k) => k !== kind));
        setOpenKind(null);
      }}
      onAddPart={(kind) => router.replace(withReturnTo(`${ADD_PART_PATH}?kind=${kind}`, here()))}
      match={match}
      nameOpen={nameOpen}
      onOpenName={() => setNameOpen(true)}
      name={name}
      onNameChange={setName}
      missing={missing.length ? t("setup.missingParts", { kinds: kinds(missing) }) : undefined}
      state={state}
      onSave={save}
      onCancel={() => router.replace(returnTo ?? SETUP_PATH)}
    />
  );
}

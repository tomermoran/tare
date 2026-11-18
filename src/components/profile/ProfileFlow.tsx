"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, type ComponentProps } from "react";
import { GoogleLink } from "@/components/account/GoogleLink";
import { LeaveSheet, type LeaveLabels } from "@/components/account/LeaveSheet";
import { LEFT_FLAG } from "@/components/home/SwitchedNote";
import { googleLinkDeps } from "@/components/account/googleLinkDeps";
import type { GoogleLinkDeps } from "@/components/account/useGoogleLink";
import { ProfileScreen, type ProfileLabels } from "@/components/screens/ProfileScreen/ProfileScreen";
import { Button } from "@/components/ui/Button/Button";
import { leaveHouseholdAction } from "@/server/actions/leaving";
import { renamePersonaAction, type ProfileFormState } from "@/server/actions/profile";

/**
 * SCR-PROFILE, wired: renaming goes through useActionState. The field is
 * controlled, so a failed save keeps the typed name (AC 6); a saved name
 * comes back trimmed, and the pages showing the label refresh. Linking to
 * Google keeps the account, so it only shows as linked (STORY-05-03-01).
 * With more than one login, the account section offers to leave the
 * household; leaving reloads into the new household's Brew (STORY-05-02-07).
 */
export function ProfileFlow({
  labels,
  backHref,
  initialName,
  linked: initialLinked,
  linkLabel,
  deps = googleLinkDeps,
  lists,
  people,
  leave,
}: {
  labels: ProfileLabels;
  backHref: string;
  initialName: string;
  linked: boolean;
  linkLabel: string;
  deps?: GoogleLinkDeps;
  lists?: ComponentProps<typeof ProfileScreen>["lists"];
  people?: ComponentProps<typeof ProfileScreen>["people"];
  /** Offered only with more than one login. */
  leave?: { row: string; onlyOwner: boolean; labels: LeaveLabels };
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [linked, setLinked] = useState(initialLinked);
  const [leaving, setLeaving] = useState<{ busy: boolean; failed: boolean; alone: boolean } | null>(null);

  const confirmLeave = async () => {
    setLeaving({ busy: true, failed: false, alone: false });
    const result = await leaveHouseholdAction();
    if (!result.ok) return setLeaving({ busy: false, failed: result.error !== "alone", alone: result.error === "alone" });
    try {
      sessionStorage.setItem(LEFT_FLAG, "1");
    } catch {
      // No storage: Brew just won't say it.
    }
    router.replace("/");
    router.refresh();
  };
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(renamePersonaAction, {
    name: initialName,
    status: "idle",
  });

  useEffect(() => {
    if (state.status !== "saved") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the name as stored (trimmed)
    setName(state.name);
    router.refresh();
  }, [state, router]);

  return (
    <ProfileScreen
      labels={labels}
      backHref={backHref}
      name={name}
      onNameChange={setName}
      action={action}
      status={state.status}
      pending={pending}
      linked={linked}
      lists={lists}
      people={people}
      leaveAction={
        leave && (
          <>
            <Button variant="ghost" className="-ms-4" onClick={() => setLeaving({ busy: false, failed: false, alone: false })}>
              {leave.row}
            </Button>
            <LeaveSheet
              open={leaving !== null}
              labels={leave.labels}
              onlyOwner={leave.onlyOwner}
              alone={leaving?.alone}
              busy={leaving?.busy}
              failed={leaving?.failed}
              onConfirm={() => void confirmLeave()}
              onCancel={() => setLeaving(null)}
            />
          </>
        )
      }
      linkAction={
        <GoogleLink
          deps={deps}
          onLinked={() => {
            setLinked(true);
            router.refresh();
          }}
        >
          {({ start, status }) => (
            <Button variant="secondary" onClick={start} disabled={status === "linking"} aria-busy={status === "linking" || undefined}>
              {linkLabel}
            </Button>
          )}
        </GoogleLink>
      }
    />
  );
}

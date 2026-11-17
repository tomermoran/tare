"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, type ComponentProps } from "react";
import { GoogleLink } from "@/components/account/GoogleLink";
import { googleLinkDeps } from "@/components/account/googleLinkDeps";
import type { GoogleLinkDeps } from "@/components/account/useGoogleLink";
import { ProfileScreen, type ProfileLabels } from "@/components/screens/ProfileScreen/ProfileScreen";
import { Button } from "@/components/ui/Button/Button";
import { renamePersonaAction, type ProfileFormState } from "@/server/actions/profile";

/**
 * SCR-PROFILE, wired: renaming goes through useActionState. The field is
 * controlled, so a failed save keeps the typed name (AC 6); a saved name
 * comes back trimmed, and the pages showing the label refresh. Linking to
 * Google keeps the account, so it only shows as linked (STORY-05-03-01).
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
}: {
  labels: ProfileLabels;
  backHref: string;
  initialName: string;
  linked: boolean;
  linkLabel: string;
  deps?: GoogleLinkDeps;
  lists?: ComponentProps<typeof ProfileScreen>["lists"];
  people?: ComponentProps<typeof ProfileScreen>["people"];
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [linked, setLinked] = useState(initialLinked);
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

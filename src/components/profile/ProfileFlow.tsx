"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { ProfileScreen, type ProfileLabels } from "@/components/screens/ProfileScreen/ProfileScreen";
import { renamePersonaAction, type ProfileFormState } from "@/server/actions/profile";

/**
 * SCR-PROFILE, wired: renaming goes through useActionState. The field is
 * controlled, so a failed save keeps the typed name (AC 6); a saved name
 * comes back trimmed, and the pages showing the label refresh.
 */
export function ProfileFlow({ labels, backHref, initialName }: { labels: ProfileLabels; backHref: string; initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
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
    />
  );
}

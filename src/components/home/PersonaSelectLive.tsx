"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { choosePersona } from "@/lib/brewChoiceCookie";
import { PROFILE_PATH } from "@/lib/profileRoutes";
import { PersonaSelect } from "./PersonaSelect";

/** PersonaSelect, wired: the choice goes in Brew's cookie and Brew updates in place (AC 3). */
export function PersonaSelectLive(props: Omit<ComponentProps<typeof PersonaSelect>, "onChoose" | "onProfile">) {
  const router = useRouter();
  return (
    <PersonaSelect
      {...props}
      onChoose={(id) => {
        choosePersona(id);
        router.refresh();
      }}
      onProfile={() => router.push(PROFILE_PATH)}
    />
  );
}

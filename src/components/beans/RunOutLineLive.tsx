"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { RunOutLine } from "./RunOutLine";

/** The run-out line on Beans: a retry reads the figures again. */
export function RunOutLineLive(props: Omit<ComponentProps<typeof RunOutLine>, "onRetry">) {
  const router = useRouter();
  return <RunOutLine {...props} onRetry={() => router.refresh()} />;
}

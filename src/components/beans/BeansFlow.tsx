"use client";

import type { ComponentProps } from "react";
import { BeansScreen } from "@/components/screens/BeansScreen/BeansScreen";
import { usePortionActions, type PortionInfo } from "./usePortionActions";

/** SCR-PANTRY with its portion rows opening the portion actions. */
export function BeansFlow({ info, ...props }: Omit<ComponentProps<typeof BeansScreen>, "onPortion" | "onWeigh"> & { info: PortionInfo[] }) {
  const { open, weigh, sheets } = usePortionActions(info);
  return (
    <>
      <BeansScreen {...props} onPortion={open} onWeigh={weigh} />
      {sheets}
    </>
  );
}

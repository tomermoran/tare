"use client";

import type { ComponentProps } from "react";
import { BagScreen } from "@/components/screens/BagScreen/BagScreen";
import { usePortionActions, type PortionInfo } from "./usePortionActions";

/** SCR-BAG with its portion rows opening the portion actions. */
export function BagFlow({ info, ...props }: Omit<ComponentProps<typeof BagScreen>, "onPortion"> & { info: PortionInfo[] }) {
  const { open, sheets } = usePortionActions(info);
  return (
    <>
      <BagScreen {...props} onPortion={open} />
      {sheets}
    </>
  );
}

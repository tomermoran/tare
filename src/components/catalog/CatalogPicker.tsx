"use client";

import { useSearchParams } from "next/navigation";
import { CoffeePicker } from "./CoffeePicker";
import { HardwarePicker } from "./HardwarePicker";

/** SCR-CATALOG-PICK for either catalog, by `?catalog=`. */
export function CatalogPicker() {
  return useSearchParams().get("catalog") === "coffee" ? <CoffeePicker /> : <HardwarePicker />;
}

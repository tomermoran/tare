import { Suspense } from "react";
import { HardwarePicker } from "@/components/catalog/HardwarePicker";

/** SCR-CATALOG-PICK: /catalog/pick?catalog=hardware&kind=grinder&returnTo=… */
export default function CatalogPickPage() {
  return (
    <Suspense fallback={null}>
      <HardwarePicker />
    </Suspense>
  );
}

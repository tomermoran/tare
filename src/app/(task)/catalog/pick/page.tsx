import { Suspense } from "react";
import { CatalogPicker } from "@/components/catalog/CatalogPicker";

/** SCR-CATALOG-PICK: /catalog/pick?catalog=hardware&kind=grinder&returnTo=… or ?catalog=coffee */
export default function CatalogPickPage() {
  return (
    <Suspense fallback={null}>
      <CatalogPicker />
    </Suspense>
  );
}

"use client";

import { LoadFailed } from "@/components/states/LoadFailed";

/** This tab couldn't load: say so and offer retry, inside the tab shell. */
export default function TabError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <LoadFailed retry={retry} />;
}

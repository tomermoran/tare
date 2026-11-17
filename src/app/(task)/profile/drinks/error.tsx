"use client";

import { LoadFailed } from "@/components/states/LoadFailed";

/** The drinks list couldn't load: say so and offer retry. */
export default function DrinksError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <LoadFailed retry={retry} />;
}

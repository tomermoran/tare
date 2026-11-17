"use client";

import { LoadFailed } from "@/components/states/LoadFailed";

/** The milks list couldn't load: say so and offer retry. */
export default function MilksError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <LoadFailed retry={retry} />;
}

import { Suspense } from "react";
import { SessionGate } from "@/components/session/SessionGate";
import { APP_SHELL_ID } from "@/components/session/StartGate";

/**
 * Full-screen tasks (shot log, add a bag, add a part): no tab bar. Each task
 * page renders its own task header with a ghost Cancel that goes through
 * useUnsavedChanges. Same session gate as the tabs.
 */
export default function TaskLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div id={APP_SHELL_ID} className="flex min-h-dvh flex-col">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {children}
        </main>
      </div>
      <Suspense fallback={null}>
        <SessionGate />
      </Suspense>
    </>
  );
}

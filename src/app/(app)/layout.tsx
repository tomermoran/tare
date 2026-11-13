import { Suspense } from "react";
import { AppTabBar, AppTabBarFallback } from "@/components/navigation/AppTabBar";
import { SessionGate } from "@/components/session/SessionGate";
import { APP_SHELL_ID } from "@/components/session/StartGate";

/**
 * The tabbed part of the app: each tab's screen above the tab bar. The shell
 * is static so tab switches stay instant; the session is read in its own
 * boundary beside it, and without one the start gate covers the shell.
 * Data is protected by the data layer (requireHousehold), not by this gate.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div id={APP_SHELL_ID} className="flex min-h-dvh flex-col">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-12">
          {children}
        </main>
        <Suspense fallback={<AppTabBarFallback className="sticky bottom-0" />}>
          <AppTabBar className="sticky bottom-0" />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <SessionGate />
      </Suspense>
    </>
  );
}

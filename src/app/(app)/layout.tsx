import { AppTabBar } from "@/components/navigation/AppTabBar";

/** The tabbed part of the app: each tab's screen above the tab bar. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-12">{children}</div>
      <AppTabBar className="sticky bottom-0" />
    </div>
  );
}

import type { ReactNode } from "react";

/**
 * Storybook-only frame: a phone-sized screen (390 x 780) with an optional
 * bottom bar, so screen stories show real proportions.
 */
export function PhoneFrame({ children, bottom }: { children: ReactNode; bottom?: ReactNode }) {
  return (
    <div className="flex h-[780px] w-[390px] flex-col overflow-hidden rounded-[28px] border border-line bg-paper">
      <main className="flex flex-1 flex-col overflow-y-auto px-6 pt-5 pb-6">{children}</main>
      {bottom}
    </div>
  );
}

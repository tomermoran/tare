import type { ReactNode } from "react";

/**
 * Storybook-only frame: a phone-sized screen (390 x 780, or a small 375 x
 * 667) with an optional bottom bar, so screen stories show real proportions.
 */
export function PhoneFrame({ children, bottom, small = false }: { children: ReactNode; bottom?: ReactNode; small?: boolean }) {
  return (
    <div
      data-testid="phone-frame"
      className={`flex ${small ? "h-[667px] w-[375px]" : "h-[780px] w-[390px]"} flex-col overflow-hidden rounded-[28px] border border-line bg-paper`}
    >
      <main className="flex flex-1 flex-col overflow-y-auto px-6 pt-5 pb-6">{children}</main>
      {bottom}
    </div>
  );
}

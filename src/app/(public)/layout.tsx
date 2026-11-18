/**
 * Pages reachable signed out (TD-11): no session gate, no tab bar, and
 * nothing here creates an account by being opened.
 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return <main className="flex min-h-dvh flex-col">{children}</main>;
}

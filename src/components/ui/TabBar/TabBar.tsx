import { cx } from "@/lib/cx";

type Tab = { id: string; label: string };

type TabBarProps = {
  /** Accessible name for the navigation landmark. */
  label: string;
  tabs: Tab[];
  current: string;
  onSelect: (id: string) => void;
  className?: string;
};

/**
 * Bottom navigation (NC-01): text tabs, no icons. The current tab is ink with
 * a 2px bar at its top edge; the others are ink-secondary.
 */
export function TabBar({ label, tabs, current, onSelect, className }: TabBarProps) {
  return (
    <nav
      aria-label={label}
      className={cx(
        "border-t border-line bg-paper pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => {
          const active = tab.id === current;
          return (
            <li key={tab.id}>
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onSelect(tab.id)}
                className={cx(
                  "-mt-px min-h-14 w-full border-t-2 text-label transition-colors",
                  active ? "border-ink text-ink" : "border-transparent text-ink-secondary hover:text-ink",
                )}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

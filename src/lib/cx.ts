/** Joins class names, skipping falsy values: cx("a", isOn && "b"). */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

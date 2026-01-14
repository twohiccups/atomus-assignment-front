import type { HTMLAttributes } from "react";

type PillProps = HTMLAttributes<HTMLSpanElement>;

export function Pill({ className, ...props }: PillProps) {
  const classes = [
    "inline-flex items-center rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-wide",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={classes} {...props} />;
}

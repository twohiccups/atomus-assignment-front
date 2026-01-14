import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  const classes = ["rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} {...props} />;
}

import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  const classes = ["rounded-md border border-slate-300 bg-white", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} {...props} />;
}

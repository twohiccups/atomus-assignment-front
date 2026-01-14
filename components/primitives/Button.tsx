import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-950 text-white shadow-sm hover:bg-slate-900 focus-visible:ring-slate-950",
  ghost:
    "bg-transparent text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-600",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <button className={classes} {...props} />;
}

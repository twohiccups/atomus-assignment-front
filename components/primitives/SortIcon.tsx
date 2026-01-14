import type { HTMLAttributes } from "react";

export type SortIconDirection = "asc" | "desc" | "none";

type SortIconProps = HTMLAttributes<SVGElement> & {
  direction: SortIconDirection;
};

export function SortIcon({ direction, className, ...props }: SortIconProps) {
  const classes = ["h-3 w-3", className].filter(Boolean).join(" ");

  if (direction === "asc") {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={classes}
        aria-hidden="true"
        {...props}
      >
        <path d="M8 3l-4 4h8l-4-4z" />
        <path d="M8 13V7" />
      </svg>
    );
  }

  if (direction === "desc") {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={classes}
        aria-hidden="true"
        {...props}
      >
        <path d="M8 13l4-4H4l4 4z" />
        <path d="M8 3v6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={classes}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 5h8" />
      <path d="M4 8h8" />
      <path d="M4 11h8" />
    </svg>
  );
}

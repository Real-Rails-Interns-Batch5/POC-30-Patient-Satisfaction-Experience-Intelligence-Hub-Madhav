import type { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-rail/40 bg-rail/10 px-4 text-sm font-semibold text-rail transition hover:border-rail hover:bg-rail/15 hover:shadow-pulse ${className}`} {...props} />;
}


import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl border border-stroke bg-surface/90 shadow-[inset_0_1px_0_rgba(255,255,255,.025)] backdrop-blur ${className}`} {...props} />;
}


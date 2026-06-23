import type { SelectHTMLAttributes } from "react";

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`h-11 w-full rounded-lg border border-stroke bg-[#070d13] px-3 text-sm text-slate-200 outline-none transition focus:border-rail focus:shadow-pulse ${className}`} {...props} />;
}


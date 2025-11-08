import Link from "next/link";
import React from "react";

interface BottomNavButtonProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  emphasis?: "regular" | "center";
}

export default function BottomNavButton({
  href,
  label,
  icon,
  active = false,
  emphasis = "regular",
}: BottomNavButtonProps) {
  const circleBase = emphasis === "center" ? "w-14 h-14" : "w-11 h-11";
  const circleColors = active
    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
    : "bg-white text-slate-500 border border-slate-200";
  const labelClasses = active ? "text-slate-900" : "text-slate-500";

  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-1 px-1"
      aria-current={active ? "page" : undefined}
      aria-label={label}
      prefetch
    >
      <span
        className={`flex items-center justify-center rounded-full transition-all duration-200 ${circleBase} ${circleColors} group-hover:-translate-y-0.5`}
      >
        {icon}
      </span>
      <span className={`text-[11px] font-medium uppercase tracking-wide ${labelClasses}`}>
        {label}
      </span>
    </Link>
  );
}

"use client";

import React from "react";
import BottomNavigation from "../organisms/navigation/BottomNavigation";

interface MobileAppLayoutProps {
  children: React.ReactNode;
}

export default function MobileAppLayout({ children }: MobileAppLayoutProps) {
  return (
    <div
      className="flex w-full justify-center text-slate-900"
      style={{ paddingInline: "clamp(0px, calc((100vw - 420px) / 2), 48px)" }}
    >
      <div
        className="relative flex w-full max-w-[420px] flex-1 flex-col overflow-hidden border border-white/30 bg-white/95 shadow-[0_40px_80px_-24px_rgba(15,23,42,0.45)] sm:rounded-[32px]"
        style={{ height: "min(calc(100dvh - (var(--app-vertical-padding) * 2)), 844px)" }}
      >
        <div className="flex-1 overflow-y-auto px-4 pb-28 pt-6 sm:px-6">
          {children}
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}

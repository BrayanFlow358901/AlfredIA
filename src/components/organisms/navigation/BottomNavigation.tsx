"use client";

import React from "react";
import { usePathname } from "next/navigation";
import BottomNavButton from "../../molecules/navigation/BottomNavButton";
import HomeIcon from "../../atoms/icons/HomeIcon";
import SettingsIcon from "../../atoms/icons/SettingsIcon";
import BellIcon from "../../atoms/icons/BellIcon";

const NAV_ITEMS = [
  {
    id: "notifications",
    label: "Notificaciones",
    href: "/notificaciones",
    emphasis: "regular" as const,
    icon: <BellIcon className="w-5 h-5" />,
  },
  {
    id: "home",
    label: "Inicio",
    href: "/",
    emphasis: "center" as const,
    icon: <HomeIcon className="w-6 h-6" />,
  },
  {
    id: "settings",
    label: "Configuración",
    href: "/configuracion",
    emphasis: "regular" as const,
    icon: <SettingsIcon className="w-5 h-5" />,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-auto border-t border-white/60 bg-white/90 backdrop-blur-lg shadow-[0_-18px_45px_-32px_rgba(15,23,42,0.65)] sm:rounded-t-[32px]">
      <div
        className="flex items-center justify-between px-6"
        style={{ paddingTop: "0.75rem", paddingBottom: "calc(env(safe-area-inset-bottom, 0) + 0.75rem)" }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <BottomNavButton
              key={item.id}
              href={item.href}
              label={item.label}
              icon={item.icon}
              emphasis={item.emphasis}
              active={isActive}
            />
          );
        })}
      </div>
    </nav>
  );
}

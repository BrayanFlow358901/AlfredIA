"use client";

import React, { useMemo, useState } from "react";

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  timeAgo: string;
  type: "recordatorio" | "sistema" | "mapa";
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Recordatorio de cita",
    description: "Tienes una reunión mañana a las 10:00. Revisa tu agenda para más detalles.",
    timeAgo: "Hace 12 min",
    type: "recordatorio",
    read: false,
  },
  {
    id: 2,
    title: "Alarma activada",
    description: "Tu alarma de ejercicio se activará en 30 minutos.",
    timeAgo: "Hace 40 min",
    type: "sistema",
    read: false,
  },
  {
    id: 3,
    title: "Nuevo lugar guardado",
    description: "Farmacia San José agregada a tus ubicaciones frecuentes.",
    timeAgo: "Ayer",
    type: "mapa",
    read: true,
  },
  {
    id: 4,
    title: "Actualización disponible",
    description: "Hay nuevas recomendaciones personalizadas esperándote.",
    timeAgo: "Hace 2 días",
    type: "sistema",
    read: true,
  },
];

export default function NotificationFeed() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"todas" | "noLeidas">("todas");

  const filteredNotifications = useMemo(() => {
    if (filter === "noLeidas") {
      return notifications.filter((item) => !item.read);
    }
    return notifications;
  }, [filter, notifications]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  function markAsRead(id: number) {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item
      )
    );
  }

  function toggleReadState(id: number) {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              read: !item.read,
            }
          : item
      )
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notificaciones</p>
            <h1 className="text-xl font-semibold text-slate-900">Centro de alertas</h1>
            <p className="text-xs text-slate-500">{unreadCount} notificación{unreadCount === 1 ? "" : "es"} sin leer</p>
          </div>
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Marcar todo leído
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("todas")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filter === "todas"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-500 border border-slate-200"
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFilter("noLeidas")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filter === "noLeidas"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-500 border border-slate-200"
            }`}
          >
            Sin leer
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {filteredNotifications.length === 0 && (
          <div className="rounded-3xl border border-slate-100 bg-white/70 p-6 text-center text-sm text-slate-500 shadow-sm">
            No tienes notificaciones en esta vista.
          </div>
        )}
        {filteredNotifications.map((notification) => (
          <article
            key={notification.id}
            className={`rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg ${
              notification.read ? "opacity-75" : "opacity-100"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      notification.type === "recordatorio"
                        ? "bg-amber-100 text-amber-700"
                        : notification.type === "mapa"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {notification.type}
                  </span>
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />}
                </div>
                <h2 className="mt-3 text-base font-semibold text-slate-900">{notification.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{notification.description}</p>
                <span className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {notification.timeAgo}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => markAsRead(notification.id)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
              >
                Marcar leído
              </button>
              <button
                type="button"
                onClick={() => toggleReadState(notification.id)}
                className="rounded-full border border-slate-900 bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                {notification.read ? "Marcar sin leer" : "Mantener sin leer"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarIcon, AlarmIcon, LocationIcon } from "./QuickActionIcons";

function formatToday() {
  const today = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return today.charAt(0).toUpperCase() + today.slice(1);
}

export default function MainDashboard() {
  const router = useRouter();
  const today = formatToday();

  const quickActions = [
    {
      id: "alfred",
      title: "Recomendaciones",
      description: "Sugerencias de AlfredIA",
      href: "/alfred",
      accent: "bg-amber-400 text-amber-950",
      surface: "border-amber-200/70 bg-amber-50/80 hover:bg-amber-100",
      icon: <span className="text-2xl">🤖</span>,
    },
    {
      id: "agenda",
      title: "Agendar Cita",
      description: "Programa eventos y recordatorios",
      href: "/agenda",
      accent: "bg-blue-500 text-white",
      surface: "border-blue-200/70 bg-blue-50/80 hover:bg-blue-100",
      icon: <CalendarIcon width={26} height={26} />,
    },
    {
      id: "alarmas",
      title: "Crear Alarma",
      description: "Configura alarmas personalizadas",
      href: "/alarmas",
      accent: "bg-emerald-500 text-white",
      surface: "border-emerald-200/70 bg-emerald-50/80 hover:bg-emerald-100",
      icon: <AlarmIcon width={26} height={26} />,
    },
    {
      id: "mapa",
      title: "Buscar Lugar",
      description: "Encuentra ubicaciones cercanas",
      href: "/mapa",
      accent: "bg-violet-500 text-white",
      surface: "border-violet-200/70 bg-violet-50/80 hover:bg-violet-100",
      icon: <LocationIcon width={26} height={26} />,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      label: "Reunión de trabajo mañana a las 10:00",
      timeAgo: "2h",
      icon: <CalendarIcon width={20} height={20} />,
      surface: "bg-blue-50 text-blue-700",
    },
    {
      id: 2,
      label: "Alarma para ejercicio configurada",
      timeAgo: "1d",
      icon: <AlarmIcon width={20} height={20} />,
      surface: "bg-emerald-50 text-emerald-600",
    },
    {
      id: 3,
      label: "Farmacia encontrada a 500m",
      timeAgo: "3h",
      icon: <LocationIcon width={20} height={20} />,
      surface: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <section className="flex flex-col gap-5 pb-4">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-300">{today}</p>
            <h1 className="text-2xl font-semibold">¡Hola, usuario!</h1>
            <p className="text-sm text-slate-300">¿En qué puedo ayudarte hoy?</p>
          </div>
          <Image
            src="/AlfredIA.png"
            alt="avatar AlfredIA"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border border-white/30 bg-white/80"
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/agenda")}
            className="flex flex-col items-start gap-1 rounded-2xl bg-white/10 p-3 text-left text-xs font-medium text-white transition hover:bg-white/20"
            type="button"
          >
            <span className="text-sm font-semibold">Próxima cita</span>
            <span className="opacity-80">Organiza tu semana con agenda inteligente</span>
          </button>
          <button
            onClick={() => router.push("/alfred")}
            className="flex flex-col items-start gap-1 rounded-2xl bg-white/10 p-3 text-left text-xs font-medium text-white transition hover:bg-white/20"
            type="button"
          >
            <span className="text-sm font-semibold">Hablar con Alfred</span>
            <span className="opacity-80">Recibe recomendaciones personalizadas al instante</span>
          </button>
        </div>
        <div className="pointer-events-none absolute -bottom-24 right-[-60px] h-48 w-48 rounded-full bg-slate-700/60 blur-3xl" aria-hidden="true" />
      </header>

  <section className="rounded-3xl border border-slate-100 bg-white/85 p-4 shadow-sm backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Acciones rápidas</h2>
  <div className="mt-4 flex flex-col gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => router.push(action.href)}
              className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-200 ease-out ${action.surface} shadow-sm hover:-translate-y-0.5 hover:shadow-lg`}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl font-semibold ${action.accent}`}>
                  {action.icon}
                </span>
                <div>
                  <p className="text-base font-semibold text-slate-800">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
              </div>
              <span className="text-2xl font-light text-slate-400 transition group-hover:text-slate-500">›</span>
            </button>
          ))}
        </div>
      </section>

  <section className="rounded-3xl border border-slate-100 bg-white/85 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Actividad reciente</h2>
          <button
            onClick={() => router.push("/agenda")}
            className="text-xs font-medium text-slate-500 underline underline-offset-2"
            type="button"
          >
            Ver agenda
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 p-3 shadow-sm"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${activity.surface}`}>
                {activity.icon}
              </span>
              <div className="flex-1 text-sm text-slate-700">{activity.label}</div>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {activity.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

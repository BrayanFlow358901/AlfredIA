import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarIcon, AlarmIcon, LocationIcon } from "./QuickActionIcons";

export default function MainDashboard() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-6 px-2">
      {/* Header */}
      <div className="w-full max-w-md bg-white rounded-xl shadow p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold">¡Hola, usuario!</h2>
            <p className="text-sm text-gray-500">¿En qué puedo ayudarte hoy?</p>
          </div>
          <Image src="/AlfredIA.png" alt="avatar AlfredIA" width={40} height={40} className="w-10 h-10 rounded-full border" />
        </div>

        {/* Acciones rápidas */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Acciones Rápidas</h3>
          <div className="flex flex-col gap-3">
            <div
              className="flex items-center justify-between bg-yellow-50 rounded-lg p-3 hover:shadow cursor-pointer transition"
              onClick={() => router.push('/alfred')}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push('/alfred'); }}
            >
              <div className="flex items-center gap-3">
                <span className="bg-yellow-400 text-white rounded-full p-2 text-lg">🤖</span>
                <div>
                  <span className="font-semibold text-yellow-700">Recomendaciones</span>
                  <p className="text-xs text-gray-500">Sugerencias de AlfredIA</p>
                </div>
              </div>
              <span className="text-gray-400 text-2xl font-bold">+</span>
            </div>
            <div
              className="flex items-center justify-between bg-blue-50 rounded-lg p-3 hover:shadow cursor-pointer transition"
              onClick={() => router.push('/agenda')}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push('/agenda'); }}
            >
              <div className="flex items-center gap-3">
                <CalendarIcon />
                <div>
                  <span className="font-semibold text-blue-700">Agendar Cita</span>
                  <p className="text-xs text-gray-500">Programa eventos y recordatorios</p>
                </div>
              </div>
              <span className="text-gray-400 text-2xl font-bold">+</span>
            </div>
            <div
              className="flex items-center justify-between bg-green-50 rounded-lg p-3 hover:shadow cursor-pointer transition"
              onClick={() => router.push('/alarmas')}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push('/alarmas'); }}
            >
              <div className="flex items-center gap-3">
                <AlarmIcon />
                <div>
                  <span className="font-semibold text-green-700">Crear Alarma</span>
                  <p className="text-xs text-gray-500">Configura alarmas personalizadas</p>
                </div>
              </div>
              <span className="text-gray-400 text-2xl font-bold">+</span>
            </div>
            <div
              className="flex items-center justify-between bg-purple-50 rounded-lg p-3 hover:shadow cursor-pointer transition"
              onClick={() => router.push('/mapa')}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push('/mapa'); }}
            >
              <div className="flex items-center gap-3">
                <LocationIcon />
                <div>
                  <span className="font-semibold text-purple-700">Buscar Lugar</span>
                  <p className="text-xs text-gray-500">Encuentra ubicaciones cercanas</p>
                </div>
              </div>
              <span className="text-gray-400 text-2xl font-bold">+</span>
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Actividad Reciente</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <span className="bg-gray-200 rounded-full p-2">
                <CalendarIcon width={20} height={20} />
              </span>
              <div className="flex-1">
                <span className="text-sm">Reunión de trabajo mañana a las 10:00</span>
              </div>
              <span className="text-xs text-gray-400">2h</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <span className="bg-gray-200 rounded-full p-2">
                <AlarmIcon width={20} height={20} />
              </span>
              <div className="flex-1">
                <span className="text-sm">Alarma para ejercicio configurada</span>
              </div>
              <span className="text-xs text-gray-400">1d</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <span className="bg-gray-200 rounded-full p-2">
                <LocationIcon width={20} height={20} />
              </span>
              <div className="flex-1">
                <span className="text-sm">Farmacia encontrada a 500m</span>
              </div>
              <span className="text-xs text-gray-400">3h</span>
            </div>
          </div>
        </div>

        {/* Botón de configuración debajo de la última actividad reciente */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => router.push('/configuracion')}
            className="w-12 h-12 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-2xl shadow hover:bg-blue-600 hover:text-white transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Configuración"
            style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
          >
            <span className="transition-transform duration-300 group-hover:rotate-90">⚙️</span>
          </button>
        </div>
      </div>
    </main>
  );
}

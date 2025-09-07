"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState(true);
  const router = useRouter();

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <div className="bg-white rounded-xl shadow p-4">
        {/* Header */}
        <div className="h-12 flex items-center justify-center mb-4 border-b pb-2 relative">
          <button
            onClick={() => router.push("/")}
            className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Volver al inicio"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">←</span>
          </button>
          <span className="font-semibold text-lg absolute left-1/2 -translate-x-1/2">Configuración</span>
        </div>
        {/* Perfil */}
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white text-3xl">
            <span role="img" aria-label="user">👤</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-base">usuario</div>
            <div className="text-xs text-gray-500">usuario@ejemplo.com</div>
          </div>
          <button className="px-3 py-1 rounded bg-gray-200 text-sm font-medium hover:bg-gray-300">Editar</button>
        </div>
        {/* Cuenta */}
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Cuenta</div>
          <div className="bg-white rounded-xl border flex flex-col divide-y">
            <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
              <span className="text-lg">👤</span>
              <span className="flex-1 text-left">
                <span className="block font-medium text-sm">Perfil de Usuario</span>
                <span className="block text-xs text-gray-400">usuario</span>
              </span>
              <span className="text-gray-400">›</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
              <span className="text-lg">🛡️</span>
              <span className="flex-1 text-left font-medium text-sm">Privacidad y Seguridad</span>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>
        {/* Preferencias */}
        <div>
          <div className="text-xs text-gray-500 mb-1 mt-4">Preferencias</div>
          <div className="bg-white rounded-xl border flex flex-col divide-y">
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="text-lg">🔔</span>
              <span className="flex-1 text-sm">Notificaciones</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications} onChange={()=>setNotifications(v=>!v)} />
                <div className={`w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black transition relative`}>
                  <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition peer-checked:translate-x-4`}></div>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="text-lg">🌙</span>
              <span className="flex-1 text-sm">Modo Oscuro</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={()=>setDarkMode(v=>!v)} />
                <div className={`w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black transition relative`}>
                  <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition peer-checked:translate-x-4`}></div>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="text-lg">📍</span>
              <span className="flex-1 text-sm">Servicios de Ubicación</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={location} onChange={()=>setLocation(v=>!v)} />
                <div className={`w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black transition relative`}>
                  <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition peer-checked:translate-x-4`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

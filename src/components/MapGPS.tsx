"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const mockPlaces = [
  {
    id: 1,
    name: "Farmacia San Miguel",
    type: "Farmacia",
    address: "Av. Principal 123",
    distance: 0.2,
    rating: 4.5,
    open: "Abierto hasta 22:00",
    open24: false,
  },
  {
    id: 2,
    name: "Supermercado Central",
    type: "Supermercado",
    address: "Calle Comercio 456",
    distance: 0.5,
    rating: 4.3,
    open: "Abierto 24 horas",
    open24: true,
  },
];


export default function MapGPS() {
  const [search, setSearch] = useState("");
  const [places] = useState(mockPlaces);
  const [location] = useState({
    address: "Av. Libertadores 234, Lima",
  });
  const router = useRouter();

  // Filtro simulado para la búsqueda
  const filteredPlaces = search
    ? places.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase())
      )
    : places;

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <div className="bg-white rounded-xl shadow p-4">
        {/* Buscador */}
        <div className="flex items-center gap-2 mb-2">
          <button className="text-lg" onClick={() => router.push("/")}>←</button>
          <span className="font-semibold">Buscar Ubicaciones</span>
          <span className="ml-auto text-gray-400"><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="#ccc" strokeWidth="2"/></svg></span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50"
            placeholder="Buscar lugares, servicios..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="bg-black text-white rounded-lg p-2"><svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M7.5 2a5.5 5.5 0 014.47 8.77l3.12 3.13a1 1 0 01-1.42 1.42l-3.13-3.12A5.5 5.5 0 117.5 2zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" fill="#fff"/></svg></button>
        </div>
        {/* Mapa simulado */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl p-4 flex flex-col items-center mb-4 relative">
          <div className="absolute left-4 top-4"><span className="text-red-500 text-2xl">📍</span></div>
          <div className="absolute right-4 top-4"><span className="text-green-500 text-2xl">📍</span></div>
          <div className="flex flex-col items-center">
            <span className="text-4xl text-gray-400">📍</span>
            <div className="text-gray-500 text-sm font-medium">Mapa Interactivo</div>
            <div className="text-xs text-gray-400">Tu ubicación actual</div>
          </div>
        </div>
        {/* Ubicación actual */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3 mb-4">
          <span className="text-blue-600 text-2xl">🧭</span>
          <div className="flex-1">
            <div className="font-medium text-blue-700 text-sm">Tu ubicación actual</div>
            <div className="text-xs text-blue-700">{location.address}</div>
          </div>
          <button className="bg-white border border-blue-300 text-blue-700 rounded-lg px-3 py-1 text-xs font-medium hover:bg-blue-100">Compartir</button>
        </div>
        {/* Lugares cercanos */}
        <div>
          <div className="font-medium text-gray-700 mb-2">Lugares Cercanos</div>
          <div className="flex flex-col gap-3">
            {filteredPlaces.map(place => (
              <div key={place.id} className="bg-white border rounded-xl p-4 flex flex-col gap-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white rounded-full p-2 text-lg">📍</span>
                    <div>
                      <div className="font-semibold text-black text-sm">{place.name}</div>
                      <div className="text-xs text-gray-500">{place.type}</div>
                      <div className="text-xs text-gray-400">{place.address}</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{place.distance} km</span>
                </div>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className="text-yellow-500">★ {place.rating}</span>
                  <span className={place.open24 ? "text-green-500" : "text-green-600"}>{place.open}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 rounded bg-white border text-xs">Llamar</button>
                  <button className="px-3 py-1 rounded bg-white border text-xs">Cómo llegar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

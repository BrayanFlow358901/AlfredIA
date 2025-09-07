"use client";
import React, { useState } from "react";

const mockRecommendations = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    title: "Café Luna",
    status: "Abierto",
    desc: "Café artesanal con ambiente acogedor y wifi gratis",
    rating: 4.5,
    distance: 250,
    price: "$$",
    tags: ["Café", "Wifi"],
    category: "Comida",
    time: "7:00 - 22:00",
    liked: false,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    title: "Concierto Jazz en Vivo",
    status: "",
    desc: "Noche de jazz con músicos locales",
    rating: 4.8,
    distance: 800,
    price: "$$$",
    tags: ["Música", "Nocturno"],
    category: "Actividades",
    time: "20:00 - 23:00",
    liked: false,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    title: "Restaurante Terra",
    status: "Abierto",
    desc: "Cocina mediterránea con ingredientes orgánicos",
    rating: 4.3,
    distance: 340,
    price: "$$$",
    tags: ["Comida"],
    category: "Comida",
    time: "12:00 - 23:00",
    liked: false,
  },
];

const categories = [
  { label: "Todos", icon: "", value: "all" },
  { label: "Comida", icon: "🍽️", value: "Comida" },
  { label: "Actividades", icon: "🎵", value: "Actividades" },
  { label: "Eventos", icon: "🎫", value: "Eventos" },
];

const tips = [
  "Café Luna está menos concurrido a las 3 PM",
  "El Restaurante Terra tiene menú vegetariano los jueves",
  "El concierto de jazz suele llenarse rápido, llega temprano",
  "Muchos locales ofrecen descuentos con pago digital",
];

export default function AlfredRecommendations() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [recs, setRecs] = useState(mockRecommendations);
  const [showAgenda, setShowAgenda] = useState<number|null>(null);
  const [tip] = useState(tips[Math.floor(Math.random()*tips.length)]);
  const router = useRouter();

  const filtered = selectedCat === "all" ? recs : recs.filter(r => r.category === selectedCat);

  function toggleLike(id:number) {
    setRecs(recs => recs.map(r => r.id === id ? { ...r, liked: !r.liked } : r));
  }

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <h2 className="text-center text-xl font-medium mb-4">Recomendaciones IA</h2>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-center mb-2 relative">
          <button
            className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fadein"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
            onClick={() => router.push("/")}
            title="Volver al inicio"
          >
            <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">←</span>
          </button>
          <div className="flex flex-col items-center justify-center mx-auto">
            <span className="font-semibold text-base">Recomendaciones</span>
            <span className="text-gray-400 text-xs flex items-center gap-1">📍 Centro Ciudad, Colombia</span>
          </div>
          <style jsx global>{`
            @keyframes fadein {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fadein {
              animation: fadein 0.25s;
            }
          `}</style>
        </div>
        {/* Categorías */}
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`px-3 py-1 rounded-lg text-sm font-medium border ${selectedCat===cat.value ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200'}`}
              onClick={() => setSelectedCat(cat.value)}
            >{cat.icon} {cat.label}</button>
          ))}
        </div>
        {/* Lista de recomendaciones */}
        <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-2">
          {filtered.map(r => (
            <div key={r.id} className="bg-white border rounded-xl p-3 flex gap-3 shadow-sm">
              <span className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg text-3xl">🏠</span>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black text-sm">{r.title}</span>
                  {r.status && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">{r.status}</span>}
                </div>
                <div className="text-xs text-gray-500">{r.desc}</div>
                <div className="flex items-center gap-2 text-xs mt-1 flex-wrap">
                  <span className="text-yellow-500">★ {r.rating}</span>
                  <span className="text-gray-400">{r.distance}m</span>
                  <span className="text-gray-400">{r.price}</span>
                </div>
                {/* Tags below rating/price */}
                <div className="flex gap-1 flex-wrap mt-1">
                  {r.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{tag}</span>)}
                </div>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span>🕒 {r.time}</span>
                </div>
              </div>
              {/* Vertical action buttons */}
              <div className="flex flex-col items-center justify-center gap-5 ml-2">
                <button onClick={() => toggleLike(r.id)} className="" title="Me gusta" style={{fontSize: '1.5rem'}}>
                  {r.liked ? <span className="text-red-500">♥</span> : <span className="text-gray-400">♡</span>}
                </button>
                <button className="text-blue-600 hover:underline" title="Ver en mapa" style={{fontSize: '1.25rem', lineHeight: '1.25rem'}}>
                  📍
                </button>
                <button className="text-green-600 hover:underline" title="Agendar" onClick={() => setShowAgenda(r.id)} style={{fontSize: '1.25rem', lineHeight: '1.25rem'}}>
                  📅
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pop up de agendar */}
        {showAgenda && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative flex flex-col items-center">
              <span className="text-3xl mb-2">📅</span>
              <p className="mb-4 text-center">¿Deseas agendar esta recomendación?</p>
              <div className="flex gap-2">
                <button onClick={() => setShowAgenda(null)} className="px-4 py-1 rounded bg-gray-200">Cancelar</button>
                <button onClick={() => setShowAgenda(null)} className="px-4 py-1 rounded bg-green-600 text-white">Confirmar</button>
              </div>
            </div>
          </div>
        )}
        {/* Tip de Alfred */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs flex items-center gap-2">
          <span className="font-semibold text-blue-700">AlfredIA sugiere:</span> {tip}
        </div>
      </div>
    </div>
  );
}

import { useRouter } from "next/navigation";

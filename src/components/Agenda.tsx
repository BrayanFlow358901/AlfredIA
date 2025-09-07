"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

function getTodayString() {
  const today = new Date();
  return format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: undefined });
}
const initialEvents = [
  {
    id: 1,
    type: "work",
    title: "Reunión de trabajo",
    date: "jueves, 28 de agosto",
    time: "10:00",
    place: "Oficina Principal",
    description: "Revisión del proyecto trimestral",
    color: "bg-blue-50 border-blue-200",
    icon: "user",
  },
  {
    id: 2,
    type: "medical",
    title: "Cita médica",
    date: "viernes, 29 de agosto",
    time: "15:30",
    place: "Centro Médico San Juan",
    description: "Chequeo general",
    color: "bg-red-50 border-red-200",
    icon: "plus",
  },
];

export default function Agenda() {
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [reminderIds, setReminderIds] = useState<number[]>([]);
  const today = getTodayString();
  const todayEvents = events.filter(e => e.date.includes("29 de agosto"));
  const router = useRouter();

  function handleAddEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const type = (form.elements.namedItem('type') as HTMLSelectElement).value;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
    const time = (form.elements.namedItem('time') as HTMLInputElement).value;
    const place = (form.elements.namedItem('place') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLInputElement).value;
    if (editId !== null) {
      setEvents(events.map(ev => ev.id === editId ? {
        ...ev, type, title, date, time, place, description,
        color: type === "work" ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200",
        icon: type === "work" ? "user" : "plus"
      } : ev));
      setEditId(null);
    } else {
      const newEvent = {
        id: Date.now(),
        type,
        title,
        date,
        time,
        place,
        description,
        color: type === "work" ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200",
        icon: type === "work" ? "user" : "plus",
      };
      setEvents([ ...events, newEvent ]);
    }
    setShowForm(false);
    form.reset();
  }

  function handleDelete(id: number) {
    setEvents(events.filter(ev => ev.id !== id));
    setReminderIds(reminderIds.filter(rid => rid !== id));
    if (editId === id) setEditId(null);
  }

  type EventType = typeof initialEvents[number];
  function handleEdit(ev: EventType) {
    setShowForm(true);
    setEditId(ev.id);
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        (form.elements.namedItem('type') as HTMLSelectElement).value = ev.type;
        (form.elements.namedItem('title') as HTMLInputElement).value = ev.title;
        (form.elements.namedItem('date') as HTMLInputElement).value = ev.date;
        (form.elements.namedItem('time') as HTMLInputElement).value = ev.time;
        (form.elements.namedItem('place') as HTMLInputElement).value = ev.place;
        (form.elements.namedItem('description') as HTMLInputElement).value = ev.description;
      }
    }, 0);
  }

  function handleReminder(id: number) {
    setReminderIds(ids => ids.includes(id) ? ids.filter(rid => rid !== id) : [...ids, id]);
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow p-4">
      {/* Header */}
      <div className="flex items-center justify-center mb-4 relative">
        <button
          onClick={() => router.push("/")}
          className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          title="Volver al inicio"
        >
          <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">←</span>
        </button>
        <div className="flex items-center gap-2 mx-auto">
          <span className="text-xl">🗓️</span>
          <span className="font-semibold text-lg text-center">Mi Agenda</span>
        </div>
        <button onClick={() => setShowForm(true)} className="absolute right-0 flex items-center gap-1 bg-black text-white px-3 py-1 rounded-lg font-semibold text-sm hover:bg-gray-800">
          + <span>Nuevo</span>
        </button>
      </div>

      {/* Día actual y resumen */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 mb-4 text-center">
        <div className="text-xl font-bold text-blue-700 mb-1">{today}</div>
        <div className="text-blue-600 text-sm">Tienes {todayEvents.length} evento{todayEvents.length !== 1 && 's'} programado{todayEvents.length !== 1 && 's'} para hoy</div>
      </div>

      {/* Formulario para nuevo evento */}
      {showForm && (
        <form 
          onSubmit={handleAddEvent}
          className="mb-4 p-4 border rounded-xl bg-gray-50 flex flex-col gap-3 max-w-full overflow-hidden"
          style={{ minWidth: 0 }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Tipo</span>
            <select name="type" className="border rounded p-2 w-full">
              <option value="work">Trabajo</option>
              <option value="medical">Médico</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Título</span>
            <input name="title" required placeholder="Título" className="border rounded p-2 w-full" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Fecha</span>
            <input name="date" required placeholder="Fecha (ej: viernes, 29 de agosto)" className="border rounded p-2 w-full" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Hora</span>
            <input name="time" required placeholder="Hora" className="border rounded p-2 w-full" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Lugar</span>
            <input name="place" required placeholder="Lugar" className="border rounded p-2 w-full" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Descripción</span>
            <input name="description" required placeholder="Descripción" className="border rounded p-2 w-full" />
          </label>
          <div className="flex gap-2 justify-end mt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1 rounded bg-gray-200">Cancelar</button>
            <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">Guardar</button>
          </div>
        </form>
      )}

      {/* Próximos eventos */}
      <div>
        <div className="font-medium text-gray-700 mb-2">Próximos Eventos</div>
        <div className="flex flex-col gap-3">
          {events.map(ev => (
            <div key={ev.id} className={`border ${ev.color} rounded-xl p-4 flex flex-col gap-2`}>
              <div className="flex items-center gap-3 font-semibold">
                <span className="bg-white border rounded-full flex items-center justify-center" style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}>
                  <span className="text-xl">{ev.icon === "user" ? "👤" : "+"}</span>
                </span>
                <span>{ev.title}</span>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-700 pl-12 -mt-2">
                <span className="flex items-center gap-1"><span role="img" aria-label="fecha">📅</span> {ev.date}</span>
                <span className="flex items-center gap-1"><span role="img" aria-label="hora">⏰</span> {ev.time}</span>
                <span className="flex items-center gap-1"><span role="img" aria-label="ubicacion">📍</span> {ev.place}</span>
              </div>
              <div className="text-xs text-gray-500 pl-12">{ev.description}</div>
              <div className="flex gap-2 mt-2 pl-12">
                <button
                  className={`px-3 py-1 rounded border text-sm flex items-center gap-1 ${reminderIds.includes(ev.id) ? 'bg-yellow-200 border-yellow-400' : 'bg-white'}`}
                  onClick={() => handleReminder(ev.id)}
                  type="button"
                >
                  <span role="img" aria-label="bell">🔔</span> Recordatorio
                </button>
                <button
                  className="px-3 py-1 rounded bg-white border text-sm"
                  onClick={() => handleEdit(ev)}
                  type="button"
                >Editar</button>
                <button
                  className="px-3 py-1 rounded bg-white border text-sm text-red-600 hover:bg-red-100"
                  onClick={() => handleDelete(ev.id)}
                  type="button"
                >Borrar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

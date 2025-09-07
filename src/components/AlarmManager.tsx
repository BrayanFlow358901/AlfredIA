"use client";
import React, { useState } from "react";

const initialAlarms = [
  {
    id: 1,
    time: "7:00 AM",
    label: "Despertar",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie"],
    tag: "Clásico",
    enabled: true,
    style: "",
  },
  {
    id: 2,
    time: "12:30 PM",
    label: "Almuerzo",
    days: ["Todos los días"],
    tag: "Suave",
    enabled: false,
    style: "text-gray-400",
  },
  {
    id: 3,
    time: "6:00 PM",
    label: "Ejercicio",
    days: ["Lun", "Mié", "Vie"],
    tag: "Enérgico",
    enabled: true,
    style: "",
  },
];

export default function AlarmManager() {
  const [alarms, setAlarms] = useState(initialAlarms);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [showDelete, setShowDelete] = useState<{id:number|null, open:boolean}>({id:null, open:false});
  // For dynamic time and days selection
  const [formTime, setFormTime] = useState("07:00");
  const [formDays, setFormDays] = useState<string[]>([]);

  const activeCount = alarms.filter(a => a.enabled).length;

  function handleDelete(id: number) {
    setAlarms(alarms.filter(a => a.id !== id));
    setShowDelete({id:null, open:false});
  }

  function handleToggle(id: number) {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  }

  function handleEdit(alarm: typeof initialAlarms[number]) {
    setShowForm(true);
    setEditId(alarm.id);
    // Parse time to 24h format for input type="time"
    const t = alarm.time;
    let hour = 7, minute = 0;
    try {
      const match = t.match(/(\d{1,2}):(\d{2}) ?([AP]M)?/i);
      if (match) {
        hour = parseInt(match[1], 10);
        minute = parseInt(match[2], 10);
        if (match[3]) {
          if (match[3].toUpperCase() === "PM" && hour < 12) hour += 12;
          if (match[3].toUpperCase() === "AM" && hour === 12) hour = 0;
        }
      }
    } catch {}
    setFormTime(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
    setFormDays(alarm.days);
    setTimeout(() => {
      const form = document.querySelector('#alarm-form') as HTMLFormElement;
      if (form) {
        (form.elements.namedItem('label') as HTMLInputElement).value = alarm.label;
        (form.elements.namedItem('tag') as HTMLInputElement).value = alarm.tag;
      }
    }, 0);
  }

  function handleAddOrEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // Convert 24h to 12h format for display
  const [h, m] = formTime.split(":");
  const hour = parseInt(h, 10);
  const minute = parseInt(m, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  const time = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
    const label = (form.elements.namedItem('label') as HTMLInputElement).value;
    const tag = (form.elements.namedItem('tag') as HTMLInputElement).value;
    const days = formDays.length > 0 ? formDays : ["Todos los días"];
    if (editId) {
      setAlarms(alarms.map(a => a.id === editId ? { ...a, time, label, tag, days } : a));
      setEditId(null);
    } else {
      setAlarms([...alarms, { id: Date.now(), time, label, tag, days, enabled: true, style: "" }]);
    }
    setShowForm(false);
    setFormTime("07:00");
    setFormDays([]);
    form.reset();
  }

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <div className="bg-white rounded-xl shadow p-4 flex flex-col min-h-[500px] relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()} className="text-lg">←</button>
            <span className="font-semibold">Alarmas</span>
          </div>
          {activeCount > 0 && (
            <span className="text-gray-500 text-sm">{activeCount} activa{activeCount > 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="flex flex-col gap-4 flex-1">
          {alarms.map(alarm => (
            <div key={alarm.id} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold transition-colors ${alarm.enabled ? 'text-black' : 'text-gray-400'}`}>{alarm.time}</div>
                  <div className={`text-sm transition-colors ${alarm.enabled ? 'text-black' : 'text-gray-400'}`}>{alarm.label}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(alarm)} className="text-gray-600 hover:text-black" title="Editar"><span role="img" aria-label="edit">✏️</span></button>
                  <button onClick={() => setShowDelete({id:alarm.id, open:true})} className="text-red-500 hover:text-red-700" title="Borrar"><span role="img" aria-label="delete">🗑️</span></button>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={alarm.enabled} onChange={() => handleToggle(alarm.id)} className="sr-only peer" />
                    <div className={`w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black transition relative`}>
                      <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition peer-checked:translate-x-4`}></div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                <span>📅 {alarm.days.join(", ")}</span>
                <span>🏷️ {alarm.tag}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Botón para agregar alarma, ahora dentro de la tarjeta principal */}
        <div className="flex justify-end mt-4">
          <button onClick={() => { setShowForm(true); setEditId(null); }} className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-gray-800">
            +
          </button>
        </div>
        {/* Confirmación de borrado */}
        {showDelete.open && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 animate-fadein"
            style={{
              backdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.5)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'background 0.3s',
            }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative flex flex-col items-center border border-gray-200">
              <span className="text-3xl mb-2">⚠️</span>
              <p className="mb-4 text-center">¿Seguro que deseas eliminar esta alarma?</p>
              <div className="flex gap-2">
                <button onClick={() => setShowDelete({id:null, open:false})} className="px-4 py-1 rounded bg-gray-200">Cancelar</button>
                <button onClick={() => handleDelete(showDelete.id!)} className="px-4 py-1 rounded bg-red-600 text-white">Eliminar</button>
              </div>
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
        )}
        {/* Formulario para agregar/editar alarma */}
        {showForm && (
          <form 
            id="alarm-form" 
            onSubmit={handleAddOrEdit} 
            className="fixed inset-0 flex items-center justify-center z-50 animate-fadein"
            style={{
              backdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.5)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'background 0.3s',
            }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative flex flex-col gap-3 border border-gray-200">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">×</button>
              <h4 className="font-semibold mb-2">{editId ? 'Editar Alarma' : 'Nueva Alarma'}</h4>
              {/* Dynamic time picker */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Hora</span>
                <input 
                  type="time" 
                  name="time" 
                  required 
                  className="border rounded p-2" 
                  value={formTime}
                  onChange={e => setFormTime(e.target.value)}
                />
              </label>
              <input name="label" required placeholder="Etiqueta (ej: Despertar)" className="border rounded p-2" />
              {/* Days of week selector */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Días</span>
                <div className="flex flex-wrap gap-1">
                  {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(day => (
                    <button
                      type="button"
                      key={day}
                      className={`px-2 py-1 rounded border text-xs font-medium transition-colors ${formDays.includes(day) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100'}`}
                      onClick={() => setFormDays(formDays.includes(day) ? formDays.filter(d => d !== day) : [...formDays, day])}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-500 mt-1">{formDays.length > 0 ? formDays.join(', ') : 'Todos los días'}</span>
              </label>
              <input name="tag" required placeholder="Tag (ej: Clásico)" className="border rounded p-2" />
              <button type="submit" className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800">Guardar</button>
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
          </form>
        )}
      </div>
    </div>
  );
}

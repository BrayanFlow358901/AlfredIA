import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/types";
import { COLORS, SPACING } from "../theme";
import { usePersistentState } from "../lib/usePersistentState";

const initialEvents = [
  {
    id: 1,
    type: "work",
    title: "Reunión de trabajo",
    date: "Jueves, 28 de agosto",
    time: "10:00",
    place: "Oficina Principal",
    description: "Revisión del proyecto trimestral",
  },
  {
    id: 2,
    type: "medical",
    title: "Cita médica",
    date: "Viernes, 29 de agosto",
    time: "15:30",
    place: "Centro Médico San Juan",
    description: "Chequeo general",
  },
];

type EventType = (typeof initialEvents)[number];
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

type TimeParts = { hour: number; minute: number; meridian: "AM" | "PM" };
const EVENTS_STORAGE_KEY = "@alfredia:events";
const REMINDERS_STORAGE_KEY = "@alfredia:event-reminders";

export default function AgendaScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [events, setEvents] = usePersistentState<EventType[]>(EVENTS_STORAGE_KEY, initialEvents);
  const [reminders, setReminders] = usePersistentState<number[]>(REMINDERS_STORAGE_KEY, [1]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventType>({
    id: 0,
    type: "work",
    title: "",
    date: "",
    time: "",
    place: "",
    description: "",
  });
  const [liveTime, setLiveTime] = useState<string>(new Date().toLocaleTimeString());
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [timeDraft, setTimeDraft] = useState<TimeParts>(toParts("10:00"));
  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], []);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleToggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openForm = (event?: EventType) => {
    if (event) {
      setEditingId(event.id);
      setForm(event);
      setTimeDraft(toParts(event.time || "10:00"));
    } else {
      setEditingId(null);
      setForm({ id: 0, type: "work", title: "", date: "", time: "", place: "", description: "" });
      setTimeDraft(toParts("10:00"));
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      setEvents((prev) => prev.map((ev) => (ev.id === editingId ? { ...form, id: editingId } : ev)));
    } else {
      setEvents((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setModalVisible(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    setReminders((prev) => prev.filter((rid) => rid !== id));
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md }}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Mi Agenda</Text>
          <Pressable style={styles.newButton} onPress={() => openForm()}>
            <Text style={{ color: COLORS.surface, fontWeight: "600" }}>+ Nuevo</Text>
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Hoy</Text>
          <Text style={styles.summarySubtitle}>Tienes {events.length} eventos programados</Text>
        </View>

        <View style={{ gap: SPACING.md }}>
          {events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <View style={styles.eventEmoji}>
                  <Text>{event.type === "work" ? "👤" : "➕"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>{event.date}</Text>
                  <Text style={styles.eventMeta}>{event.time} · {event.place}</Text>
                </View>
                <Pressable onPress={() => handleToggleReminder(event.id)} style={styles.reminderButton}>
                  <Text style={{ fontSize: 14 }}>{reminders.includes(event.id) ? "🔔" : "🔕"}</Text>
                </Pressable>
              </View>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <View style={styles.eventActions}>
                <Pressable style={styles.secondaryBtn} onPress={() => openForm(event)}>
                  <Text style={styles.secondaryText}>Editar</Text>
                </Pressable>
                <Pressable style={styles.secondaryBtn} onPress={() => handleDelete(event.id)}>
                  <Text style={[styles.secondaryText, { color: "#dc2626" }]}>Borrar</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingId ? "Editar evento" : "Nuevo evento"}</Text>
            <View style={styles.typeToggle}>
              {[
                { value: "work", label: "Trabajo" },
                { value: "medical", label: "Médico" },
              ].map((item) => (
                <Pressable
                  key={item.value}
                  style={[styles.typeButton, form.type === item.value && styles.typeButtonActive]}
                  onPress={() => setForm((prev) => ({ ...prev, type: item.value as EventType["type"] }))}
                >
                  <Text style={form.type === item.value ? styles.typeTextActive : styles.typeText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
            {(["title", "date", "time", "place", "description"] as const).map((field) => (
              <TextInput
                key={field}
                style={styles.input}
                placeholder={{
                  title: "Título",
                  date: "Fecha (ej: viernes, 29 de agosto)",
                  time: "Hora",
                  place: "Lugar",
                  description: "Descripción",
                }[field]}
                value={field === "time" ? displayTime(form.time) : form[field]}
                onChangeText={(text) => setForm((prev) => ({ ...prev, [field]: text }))}
                editable={field !== "time"}
              />
            ))}
            <Pressable style={styles.timeButton} onPress={() => setTimePickerVisible(true)}>
              <Text style={styles.timeButtonText}>Elegir hora</Text>
            </Pressable>
            <View style={styles.clockBox}>
              <Text style={styles.clockLabel}>Reloj en vivo</Text>
              <Text style={styles.clockValue}>{liveTime}</Text>
              <Text style={styles.clockHint}>
                Evento programado: {form.date ? form.date : "Fecha pendiente"} {form.time ? `· ${form.time}` : ""}
              </Text>
            </View>
            <View style={styles.modalActions}>
              <Pressable style={styles.secondaryBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.secondaryText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={handleSave}>
                <Text style={{ color: COLORS.surface, fontWeight: "600" }}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {timePickerVisible && (
        <Modal transparent animationType="fade" visible={timePickerVisible}>
          <View style={styles.timeModalBackdrop}>
            <View style={styles.timeModalCard}>
              <Text style={styles.timeModalTitle}>Selecciona la hora</Text>
              <View style={styles.meridianRow}>
                {["AM", "PM"].map((m) => (
                  <Pressable
                    key={m}
                    style={[styles.meridianChip, timeDraft.meridian === m && styles.meridianChipActive]}
                    onPress={() => setTimeDraft((prev) => ({ ...prev, meridian: m as TimeParts["meridian"] }))}
                  >
                    <Text style={timeDraft.meridian === m ? styles.meridianTextActive : styles.meridianText}>{m}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.timeSectionLabel}>Hora</Text>
              <View style={styles.grid}>
                {hours.map((h) => (
                  <Pressable
                    key={h}
                    style={[styles.timeChip, timeDraft.hour === h && styles.timeChipActive]}
                    onPress={() => setTimeDraft((prev) => ({ ...prev, hour: h }))}
                  >
                    <Text style={timeDraft.hour === h ? styles.timeChipTextActive : styles.timeChipText}>{h}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.timeSectionLabel}>Minutos</Text>
              <View style={styles.grid}>
                {minutes.map((m) => (
                  <Pressable
                    key={m}
                    style={[styles.timeChip, timeDraft.minute === m && styles.timeChipActive]}
                    onPress={() => setTimeDraft((prev) => ({ ...prev, minute: m }))}
                  >
                    <Text style={timeDraft.minute === m ? styles.timeChipTextActive : styles.timeChipText}>
                      {String(m).padStart(2, "0")}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.timeModalActions}>
                <Pressable style={styles.secondaryBtn} onPress={() => setTimePickerVisible(false)}>
                  <Text style={styles.secondaryText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => {
                    const time24 = to24FromParts(timeDraft);
                    setForm((prev) => ({ ...prev, time: time24 }));
                    setTimePickerVisible(false);
                  }}
                >
                  <Text style={{ color: COLORS.surface, fontWeight: "600" }}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

function displayTime(time: string) {
  if (!time) return "";
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  const meridian = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  if (h > 12) h -= 12;
  return `${h}:${String(parseInt(mStr, 10) || 0).padStart(2, "0")} ${meridian}`;
}

function toParts(time: string): TimeParts {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10) || 0;
  const meridian: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1;
  return { hour: hour12, minute: parseInt(mStr, 10) || 0, meridian };
}

function to24FromParts(parts: TimeParts) {
  let h = parts.hour % 12;
  if (parts.meridian === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  newButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    shadowColor: COLORS.text,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  summarySubtitle: {
    color: COLORS.muted,
    marginTop: 4,
  },
  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.md,
    gap: SPACING.sm,
    shadowColor: COLORS.text,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  eventEmoji: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  eventMeta: {
    color: COLORS.muted,
    fontSize: 12,
  },
  reminderButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  eventDescription: {
    color: COLORS.muted,
    fontSize: 13,
  },
  eventActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.sm,
  },
  secondaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  modalCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  typeToggle: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  typeButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeText: {
    color: COLORS.text,
  },
  typeTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
  },
  timeButton: {
    marginTop: SPACING.xs,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  timeButtonText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  clockBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    gap: 4,
  },
  clockLabel: {
    color: COLORS.muted,
    fontSize: 12,
  },
  clockValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  clockHint: {
    color: COLORS.muted,
    fontSize: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  timeModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  timeModalCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  timeModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  meridianRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  meridianChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  meridianChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  meridianText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  meridianTextActive: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  timeSectionLabel: {
    color: COLORS.muted,
    fontSize: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  timeChip: {
    width: 60,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  timeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeChipText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  timeChipTextActive: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  timeModalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.sm,
  },
});

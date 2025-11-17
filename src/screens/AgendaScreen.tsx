import { useState } from "react";
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

  const handleToggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openForm = (event?: EventType) => {
    if (event) {
      setEditingId(event.id);
      setForm(event);
    } else {
      setEditingId(null);
      setForm({ id: 0, type: "work", title: "", date: "", time: "", place: "", description: "" });
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
                value={form[field]}
                onChangeText={(text) => setForm((prev) => ({ ...prev, [field]: text }))}
              />
            ))}
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
    </View>
  );
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
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});

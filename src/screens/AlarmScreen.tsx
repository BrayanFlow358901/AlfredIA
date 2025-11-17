import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Switch,
  Modal,
  TextInput,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SPACING } from "../theme";
import { HomeStackParamList } from "../navigation/types";

const initialAlarms = [
  {
    id: 1,
    time: "7:00 AM",
    label: "Despertar",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie"],
    tag: "Clásico",
    enabled: true,
  },
  {
    id: 2,
    time: "12:30 PM",
    label: "Almuerzo",
    days: ["Todos los días"],
    tag: "Suave",
    enabled: false,
  },
];

type AlarmType = (typeof initialAlarms)[number];

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function AlarmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [alarms, setAlarms] = useState(initialAlarms);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AlarmType>({
    id: 0,
    time: "07:00",
    label: "",
    days: [],
    tag: "",
    enabled: true,
  });

  const openForm = (alarm?: AlarmType) => {
    if (alarm) {
      setEditingId(alarm.id);
      setForm({ ...alarm, time: to24h(alarm.time) });
    } else {
      setEditingId(null);
      setForm({ id: 0, time: "07:00", label: "", days: [], tag: "", enabled: true });
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.label) return;
    const parsed = { ...form, time: toDisplay(form.time) };
    if (editingId) {
      setAlarms((prev) => prev.map((alarm) => (alarm.id === editingId ? { ...parsed, id: editingId } : alarm)));
    } else {
      setAlarms((prev) => [...prev, { ...parsed, id: Date.now() }]);
    }
    setModalVisible(false);
  };

  const toggleAlarm = (id: number) => {
    setAlarms((prev) => prev.map((alarm) => (alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm)));
  };

  const deleteAlarm = (id: number) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md }}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Alarmas</Text>
          <Pressable style={styles.newButton} onPress={() => openForm()}>
            <Text style={{ color: COLORS.surface, fontWeight: "600" }}>+</Text>
          </Pressable>
        </View>

        {alarms.map((alarm) => (
          <View key={alarm.id} style={styles.alarmCard}>
            <View style={styles.alarmRow}>
              <View>
                <Text style={[styles.alarmTime, !alarm.enabled && styles.disabledText]}>{alarm.time}</Text>
                <Text style={[styles.alarmLabel, !alarm.enabled && styles.disabledText]}>{alarm.label}</Text>
              </View>
              <Switch value={alarm.enabled} onValueChange={() => toggleAlarm(alarm.id)} />
            </View>
            <View style={styles.alarmMeta}>
              <Text style={styles.metaText}>{alarm.days.join(", ")}</Text>
              <Text style={styles.metaText}>🏷️ {alarm.tag}</Text>
            </View>
            <View style={styles.actionsRow}>
              <Pressable style={styles.secondaryBtn} onPress={() => openForm(alarm)}>
                <Text style={styles.secondaryText}>Editar</Text>
              </Pressable>
              <Pressable style={styles.secondaryBtn} onPress={() => deleteAlarm(alarm.id)}>
                <Text style={[styles.secondaryText, { color: "#dc2626" }]}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal transparent animationType="slide" visible={modalVisible}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingId ? "Editar alarma" : "Nueva alarma"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Hora (24h, ej: 07:00)"
              value={form.time}
              onChangeText={(text) => setForm((prev) => ({ ...prev, time: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Etiqueta"
              value={form.label}
              onChangeText={(text) => setForm((prev) => ({ ...prev, label: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Días (ej: Lun, Mié, Vie)"
              value={form.days.join(", ")}
              onChangeText={(text) => setForm((prev) => ({ ...prev, days: text.split(/,\s*/) }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Tag"
              value={form.tag}
              onChangeText={(text) => setForm((prev) => ({ ...prev, tag: text }))}
            />
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

function to24h(display: string) {
  const [time, modifier] = display.split(" ");
  let [hours, minutes] = time.split(":");
  let h = parseInt(hours, 10);
  if (modifier === "PM" && h < 12) h += 12;
  if (modifier === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${minutes}`;
}

function toDisplay(time: string) {
  const [h, m] = time.split(":");
  let hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  if (hour > 12) hour -= 12;
  return `${hour}:${m} ${suffix}`;
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
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
  },
  newButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  alarmCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.md,
    gap: SPACING.sm,
    shadowColor: COLORS.text,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  alarmRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  alarmTime: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  alarmLabel: {
    color: COLORS.text,
  },
  disabledText: {
    color: COLORS.muted,
  },
  alarmMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  metaText: {
    color: COLORS.muted,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.sm,
  },
  secondaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
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
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});

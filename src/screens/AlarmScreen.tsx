import { useEffect, useMemo, useState } from "react";
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
import { usePersistentState } from "../lib/usePersistentState";

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

const ALARM_STORAGE_KEY = "@alfredia:alarms";

type TimeParts = { hour: number; minute: number; meridian: "AM" | "PM" };

export default function AlarmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [alarms, setAlarms] = usePersistentState<AlarmType[]>(ALARM_STORAGE_KEY, initialAlarms);
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
  const [liveTime, setLiveTime] = useState<string>(new Date().toLocaleTimeString());
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [timeDraft, setTimeDraft] = useState<TimeParts>(toParts("07:00"));
  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], []);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const openForm = (alarm?: AlarmType) => {
    if (alarm) {
      setEditingId(alarm.id);
      setForm({ ...alarm, time: to24h(alarm.time) });
      setTimeDraft(toParts(to24h(alarm.time)));
    } else {
      setEditingId(null);
      setForm({ id: 0, time: "07:00", label: "", days: [], tag: "", enabled: true });
      setTimeDraft(toParts("07:00"));
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
    setEditingId(null);
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
              style={[styles.input, { color: COLORS.text }]}
              placeholder="Selecciona la hora"
              value={toDisplay(form.time)}
              editable={false}
            />
            <Pressable style={styles.timeButton} onPress={() => setTimePickerVisible(true)}>
              <Text style={styles.timeButtonText}>Elegir hora</Text>
            </Pressable>
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
            <View style={styles.clockBox}>
              <Text style={styles.clockLabel}>Reloj en vivo</Text>
              <Text style={styles.clockValue}>{liveTime}</Text>
              <Text style={styles.clockHint}>Próxima alarma: {toDisplay(form.time || "00:00")}</Text>
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

function toParts(time: string): TimeParts {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const meridian: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1; // 0->12,13->1
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
    backgroundColor: COLORS.surface,
    borderRadius: 24,
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

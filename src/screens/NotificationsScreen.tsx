import { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { COLORS, SPACING } from "../theme";

const notifications = [
  {
    id: 1,
    title: "Recordatorio de cita",
    description: "Tienes una reunión mañana a las 10:00. Revisa tu agenda para más detalles.",
    timeAgo: "Hace 12 min",
    type: "recordatorio" as const,
    read: false,
  },
  {
    id: 2,
    title: "Alarma activada",
    description: "Tu alarma de ejercicio se activará en 30 minutos.",
    timeAgo: "Hace 40 min",
    type: "sistema" as const,
    read: false,
  },
  {
    id: 3,
    title: "Nuevo lugar guardado",
    description: "Farmacia San José agregada a tus ubicaciones frecuentes.",
    timeAgo: "Ayer",
    type: "mapa" as const,
    read: true,
  },
];

type Notification = (typeof notifications)[number];

export default function NotificationsScreen() {
  const [items, setItems] = useState<Notification[]>(notifications);
  const [filter, setFilter] = useState<"todas" | "noLeidas">("todas");

  const filtered = useMemo(() => {
    if (filter === "noLeidas") return items.filter((item) => !item.read);
    return items;
  }, [filter, items]);

  const unreadCount = items.filter((item) => !item.read).length;

  const markAllRead = () => setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  const toggleRead = (id: number) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Centro de alertas</Text>
            <Text style={styles.headerSubtitle}>{unreadCount} notificación(es) sin leer</Text>
          </View>
          <Pressable style={styles.secondaryBtn} onPress={markAllRead}>
            <Text style={styles.secondaryText}>Marcar todo leído</Text>
          </Pressable>
        </View>

        <View style={styles.filterRow}>
          {["todas", "noLeidas"].map((value) => (
            <Pressable
              key={value}
              style={[styles.filterChip, filter === value && styles.filterChipActive]}
              onPress={() => setFilter(value as "todas" | "noLeidas")}
            >
              <Text style={filter === value ? styles.filterTextActive : styles.filterText}>
                {value === "todas" ? "Todas" : "Sin leer"}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ gap: SPACING.md }}>
          {filtered.map((notification) => (
            <View
              key={notification.id}
              style={[styles.card, notification.read && { opacity: 0.6 }]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>{notification.type}</Text>
                {!notification.read && <Text style={styles.unreadDot}>●</Text>}
              </View>
              <Text style={styles.cardTitle}>{notification.title}</Text>
              <Text style={styles.cardDescription}>{notification.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.time}>{notification.timeAgo}</Text>
                <Pressable style={styles.secondaryBtn} onPress={() => toggleRead(notification.id)}>
                  <Text style={styles.secondaryText}>
                    {notification.read ? "Marcar sin leer" : "Marcar leído"}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No tienes notificaciones en esta vista.</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: COLORS.muted,
  },
  filterRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  filterTextActive: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    gap: SPACING.sm,
    shadowColor: COLORS.text,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardType: {
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: 1,
    color: COLORS.secondary,
  },
  unreadDot: {
    color: "#22c55e",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  cardDescription: {
    color: COLORS.muted,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  secondaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  emptyState: {
    padding: SPACING.lg,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.muted,
  },
});

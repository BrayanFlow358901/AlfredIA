import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SPACING } from "../theme";
import { HomeStackParamList } from "../navigation/types";

const recommendations = [
  {
    id: 1,
    title: "Café Luna",
    status: "Abierto",
    desc: "Café artesanal con ambiente acogedor y wifi gratis",
    rating: 4.5,
    distance: 250,
    price: "$$",
    tags: ["Café", "Wifi"],
    category: "Comida",
    time: "7:00 - 22:00",
  },
  {
    id: 2,
    title: "Concierto Jazz en Vivo",
    status: "",
    desc: "Noche de jazz con músicos locales",
    rating: 4.8,
    distance: 800,
    price: "$$$",
    tags: ["Música", "Nocturno"],
    category: "Actividades",
    time: "20:00 - 23:00",
  },
  {
    id: 3,
    title: "Restaurante Terra",
    status: "Abierto",
    desc: "Cocina mediterránea con ingredientes orgánicos",
    rating: 4.3,
    distance: 340,
    price: "$$$",
    tags: ["Comida"],
    category: "Comida",
    time: "12:00 - 23:00",
  },
];

const categories = [
  { label: "Todos", value: "all" },
  { label: "Comida", value: "Comida" },
  { label: "Actividades", value: "Actividades" },
  { label: "Eventos", value: "Eventos" },
];

const tips = [
  "Café Luna está menos concurrido a las 3 PM",
  "El Restaurante Terra tiene menú vegetariano los jueves",
  "El concierto de jazz suele llenarse rápido, llega temprano",
  "Muchos locales ofrecen descuentos con pago digital",
];

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function AlfredScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState("all");
  const [agendaId, setAgendaId] = useState<number | null>(null);
  const tip = useMemo(() => tips[Math.floor(Math.random() * tips.length)], []);

  const filtered = selected === "all" ? recommendations : recommendations.filter((rec) => rec.category === selected);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md }}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Recomendaciones</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.sm }}>
          {categories.map((cat) => (
            <Pressable
              key={cat.value}
              style={[styles.categoryChip, selected === cat.value && styles.categoryChipActive]}
              onPress={() => setSelected(cat.value)}
            >
              <Text style={selected === cat.value ? styles.categoryTextActive : styles.categoryText}>{cat.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ gap: SPACING.md }}>
          {filtered.map((rec) => (
            <View key={rec.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>{rec.title}</Text>
                  {!!rec.status && <Text style={styles.status}>{rec.status}</Text>}
                </View>
                <Pressable onPress={() => toggleFavorite(rec.id)}>
                  <Text style={{ fontSize: 22 }}>{favorites.includes(rec.id) ? "♥" : "♡"}</Text>
                </Pressable>
              </View>
              <Text style={styles.cardDescription}>{rec.desc}</Text>
              <View style={styles.cardMeta}>
                <Text>★ {rec.rating}</Text>
                <Text>{rec.distance}m</Text>
                <Text>{rec.price}</Text>
              </View>
              <View style={styles.tagsRow}>
                {rec.tags.map((tag) => (
                  <Text key={tag} style={styles.tag}>
                    {tag}
                  </Text>
                ))}
              </View>
              <Text style={styles.time}>🕒 {rec.time}</Text>
              <View style={styles.actionsRow}>
                <Pressable style={styles.secondaryBtn} onPress={() => setAgendaId(rec.id)}>
                  <Text style={styles.secondaryText}>Agendar</Text>
                </Pressable>
                <Pressable style={styles.secondaryBtn} onPress={() => navigation.navigate("Mapa")}> 
                  <Text style={styles.secondaryText}>Ver mapa</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>AlfredIA sugiere:</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      </ScrollView>

      <Modal transparent animationType="fade" visible={agendaId !== null}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>¿Agendar recomendación?</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.secondaryBtn} onPress={() => setAgendaId(null)}>
                <Text style={styles.secondaryText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={() => setAgendaId(null)}>
                <Text style={{ color: COLORS.surface, fontWeight: "600" }}>Confirmar</Text>
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
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.text,
  },
  categoryTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.md,
    gap: SPACING.sm,
    shadowColor: COLORS.text,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    color: "#16a34a",
    fontSize: 12,
    marginTop: 2,
  },
  cardDescription: {
    color: COLORS.muted,
  },
  cardMeta: {
    flexDirection: "row",
    gap: SPACING.md,
    color: COLORS.muted,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: COLORS.muted,
    fontSize: 12,
  },
  time: {
    color: COLORS.muted,
    fontSize: 12,
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
  tipCard: {
    backgroundColor: "#dbeafe",
    borderRadius: 24,
    padding: SPACING.lg,
  },
  tipTitle: {
    fontWeight: "700",
    marginBottom: 4,
    color: COLORS.secondary,
  },
  tipText: {
    color: COLORS.secondary,
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
    gap: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
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

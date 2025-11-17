import { useEffect, useMemo, useState } from "react";
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

const recommendationPool = [
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
    time: "07:00 - 22:00",
  },
  {
    id: 2,
    title: "Concierto Jazz en Vivo",
    status: "Esta noche",
    desc: "Noche de jazz con músicos locales",
    rating: 4.8,
    distance: 800,
    price: "$$$",
    tags: ["Música", "Nocturno"],
    category: "Eventos",
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
    tags: ["Comida", "Orgánico"],
    category: "Comida",
    time: "12:00 - 23:00",
  },
  {
    id: 4,
    title: "Tour Histórico Centro",
    status: "Próximo",
    desc: "Recorrido guiado por los edificios icónicos del centro",
    rating: 4.7,
    distance: 1200,
    price: "$$",
    tags: ["Historia", "Guiado"],
    category: "Actividades",
    time: "16:00 - 18:00",
  },
  {
    id: 5,
    title: "Gimnasio 24/7 Pulse",
    status: "Abierto",
    desc: "Entrena con instructores certificados todo el día",
    rating: 4.2,
    distance: 600,
    price: "$$",
    tags: ["Fitness", "24/7"],
    category: "Actividades",
    time: "00:00 - 23:59",
  },
  {
    id: 6,
    title: "Mercado Orgánico Verde",
    status: "Fin de semana",
    desc: "Productores locales con degustaciones frescas",
    rating: 4.6,
    distance: 1500,
    price: "$$",
    tags: ["Orgánico", "Local"],
    category: "Eventos",
    time: "09:00 - 14:00",
  },
  {
    id: 7,
    title: "Taller de Cerámica",
    status: "Quedan cupos",
    desc: "Aprende técnicas básicas para crear tus piezas",
    rating: 4.9,
    distance: 500,
    price: "$$",
    tags: ["Arte", "Manual"],
    category: "Actividades",
    time: "18:00 - 20:00",
  },
  {
    id: 8,
    title: "Brunch Botánico",
    status: "Abierto",
    desc: "Desayunos creativos entre plantas tropicales",
    rating: 4.4,
    distance: 420,
    price: "$$",
    tags: ["Brunch", "Vegetariano"],
    category: "Comida",
    time: "09:00 - 13:00",
  },
  {
    id: 9,
    title: "Ruta de Senderismo Mirador",
    status: "Mañana",
    desc: "Subida guiada con vistas panorámicas y snack",
    rating: 4.8,
    distance: 3200,
    price: "$",
    tags: ["Outdoor", "Guía"],
    category: "Actividades",
    time: "06:00 - 10:00",
  },
  {
    id: 10,
    title: "Exposición Arte Digital",
    status: "Nuevo",
    desc: "Instalaciones inmersivas de artistas emergentes",
    rating: 4.5,
    distance: 900,
    price: "$$",
    tags: ["Arte", "Interactivo"],
    category: "Eventos",
    time: "11:00 - 21:00",
  },
  {
    id: 11,
    title: "Cine al Aire Libre",
    status: "Esta noche",
    desc: "Películas clásicas con mantas y popcorn",
    rating: 4.6,
    distance: 1100,
    price: "$",
    tags: ["Cine", "Exterior"],
    category: "Eventos",
    time: "19:30 - 22:00",
  },
  {
    id: 12,
    title: "Taller Barista Express",
    status: "Quedan 5 cupos",
    desc: "Domina el espresso perfecto en dos horas",
    rating: 4.9,
    distance: 350,
    price: "$$",
    tags: ["Café", "Curso"],
    category: "Actividades",
    time: "15:00 - 17:00",
  },
  {
    id: 13,
    title: "Restaurante Fuego y Sal",
    status: "Abierto",
    desc: "Carnes a la parrilla y vinos de autor",
    rating: 4.7,
    distance: 610,
    price: "$$$",
    tags: ["Parrilla", "Vinos"],
    category: "Comida",
    time: "13:00 - 00:00",
  },
  {
    id: 14,
    title: "Food Truck Plaza",
    status: "Abierto",
    desc: "Rotación diaria de camiones gourmet",
    rating: 4.3,
    distance: 780,
    price: "$",
    tags: ["Street Food", "Casual"],
    category: "Comida",
    time: "12:00 - 23:00",
  },
  {
    id: 15,
    title: "Yoga al Amanecer",
    status: "Reserva previa",
    desc: "Clase al aire libre frente al lago",
    rating: 4.8,
    distance: 2000,
    price: "$$",
    tags: ["Bienestar", "Outdoor"],
    category: "Actividades",
    time: "05:30 - 07:00",
  },
  {
    id: 16,
    title: "Conferencia TechNow",
    status: "Próximo",
    desc: "Paneles sobre IA y startups latinoamericanas",
    rating: 4.5,
    distance: 5000,
    price: "$$$",
    tags: ["Tech", "Networking"],
    category: "Eventos",
    time: "09:00 - 18:00",
  },
  {
    id: 17,
    title: "Galería Minimal",
    status: "Abierto",
    desc: "Colección permanente de arte contemporáneo",
    rating: 4.1,
    distance: 980,
    price: "$",
    tags: ["Arte", "Minimal"],
    category: "Eventos",
    time: "10:00 - 19:00",
  },
  {
    id: 18,
    title: "Pizza Forno Napo",
    status: "Abierto",
    desc: "Masa madre y horno de leña napolitano",
    rating: 4.6,
    distance: 430,
    price: "$$",
    tags: ["Pizza", "Familiar"],
    category: "Comida",
    time: "12:00 - 00:00",
  },
  {
    id: 19,
    title: "Burger Lab 57",
    status: "Abierto",
    desc: "Hamburguesas experimentales con sabores únicos",
    rating: 4.4,
    distance: 520,
    price: "$$",
    tags: ["Casual", "Gourmet"],
    category: "Comida",
    time: "11:30 - 23:30",
  },
  {
    id: 20,
    title: "Rooftop Lounge Eclipse",
    status: "DJ invitado",
    desc: "Cocteles de autor con vista panorámica",
    rating: 4.7,
    distance: 870,
    price: "$$$",
    tags: ["Cocteles", "Vista"],
    category: "Actividades",
    time: "18:00 - 02:00",
  },
  {
    id: 21,
    title: "Festival Sabores del Mundo",
    status: "Fin de semana",
    desc: "30 puestos con gastronomía internacional",
    rating: 4.9,
    distance: 2600,
    price: "$$",
    tags: ["Festival", "Gastronomía"],
    category: "Eventos",
    time: "11:00 - 22:00",
  },
  {
    id: 22,
    title: "Clase de Mixología",
    status: "Quedan 2 cupos",
    desc: "Aprende a crear cocteles de temporada",
    rating: 4.8,
    distance: 640,
    price: "$$",
    tags: ["Cocteles", "Curso"],
    category: "Actividades",
    time: "19:00 - 21:00",
  },
  {
    id: 23,
    title: "Biblioteca Nocturna",
    status: "Hasta medianoche",
    desc: "Espacio silencioso con café ilimitado",
    rating: 4.3,
    distance: 300,
    price: "$",
    tags: ["Lectura", "24/7"],
    category: "Actividades",
    time: "08:00 - 00:00",
  },
  {
    id: 24,
    title: "Heladería Polar",
    status: "Abierto",
    desc: "Helados artesanales con toppings ilimitados",
    rating: 4.2,
    distance: 150,
    price: "$",
    tags: ["Postres", "Familiar"],
    category: "Comida",
    time: "12:00 - 23:00",
  },
  {
    id: 25,
    title: "Mercado Vintage",
    status: "Solo sábado",
    desc: "Ropa y vinilos con música en vivo",
    rating: 4.4,
    distance: 1800,
    price: "$$",
    tags: ["Vintage", "Retro"],
    category: "Eventos",
    time: "10:00 - 18:00",
  },
  {
    id: 26,
    title: "Maratón 5K Solidaria",
    status: "Inscripciones abiertas",
    desc: "Circuito urbano con kit deportivo incluido",
    rating: 4.6,
    distance: 4200,
    price: "$$",
    tags: ["Deporte", "Solidario"],
    category: "Eventos",
    time: "07:00 - 11:00",
  },
  {
    id: 27,
    title: "Club de Lectura Aurora",
    status: "Miércoles",
    desc: "Discusión guiada de novela latinoamericana",
    rating: 4.5,
    distance: 700,
    price: "$",
    tags: ["Lectura", "Club"],
    category: "Actividades",
    time: "19:30 - 21:00",
  },
  {
    id: 28,
    title: "Taller Fotografía Urbana",
    status: "Próximo",
    desc: "Recorrido práctico para capturar la ciudad",
    rating: 4.7,
    distance: 1350,
    price: "$$",
    tags: ["Foto", "Caminar"],
    category: "Actividades",
    time: "15:00 - 19:00",
  },
  {
    id: 29,
    title: "Restaurante Verde Vivo",
    status: "Abierto",
    desc: "Menú plant-based con ingredientes locales",
    rating: 4.6,
    distance: 560,
    price: "$$",
    tags: ["Vegano", "Fresco"],
    category: "Comida",
    time: "12:00 - 22:00",
  },
  {
    id: 30,
    title: "Degustación Chocolates Andinos",
    status: "Solo hoy",
    desc: "Tabla guiada de cacao premium y maridajes",
    rating: 4.9,
    distance: 480,
    price: "$$$",
    tags: ["Gourmet", "Cacao"],
    category: "Eventos",
    time: "18:00 - 20:00",
  },
];

type Recommendation = (typeof recommendationPool)[number];

const RECOMMENDATION_ROTATION_SIZE = 3;
const RECOMMENDATION_ROTATION_INTERVAL = 60_000;

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
  const [rotationIndex, setRotationIndex] = useState(0);
  const [agendaId, setAgendaId] = useState<number | null>(null);
  const tip = useMemo(() => tips[Math.floor(Math.random() * tips.length)], []);
  const filteredPool = useMemo<Recommendation[]>(
    () => (selected === "all" ? recommendationPool : recommendationPool.filter((rec) => rec.category === selected)),
    [selected]
  );

  const visibleRecommendations = useMemo<Recommendation[]>(() => {
    if (!filteredPool.length) return [];
    const limit = Math.min(RECOMMENDATION_ROTATION_SIZE, filteredPool.length);
    return Array.from({ length: limit }, (_, idx) => {
      const pointer = (rotationIndex + idx) % filteredPool.length;
      return filteredPool[pointer];
    });
  }, [filteredPool, rotationIndex]);

  useEffect(() => {
    if (!filteredPool.length) {
      setRotationIndex(0);
      return;
    }
    setRotationIndex((prev) => prev % filteredPool.length);
  }, [filteredPool.length]);

  useEffect(() => {
    setRotationIndex(0);
  }, [selected]);

  useEffect(() => {
    if (!filteredPool.length) return;
    const intervalId = setInterval(() => {
      setRotationIndex((prev) => (prev + RECOMMENDATION_ROTATION_SIZE) % filteredPool.length);
    }, RECOMMENDATION_ROTATION_INTERVAL);
    return () => clearInterval(intervalId);
  }, [filteredPool.length]);

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
          {visibleRecommendations.length ? (
            visibleRecommendations.map((rec) => (
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
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptyText}>Prueba con otra categoría para ver nuevas propuestas.</Text>
            </View>
          )}
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
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  emptyText: {
    color: COLORS.muted,
    textAlign: "center",
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

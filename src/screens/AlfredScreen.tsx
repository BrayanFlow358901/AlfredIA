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
import { RECOMMENDATION_POOL, Recommendation } from "../data/recommendations";
import { formatDistance, haversineDistanceKm, useCurrentLocation } from "../lib/location";

type RecommendationWithDistance = Recommendation & { distanceKm: number | null };

const RECOMMENDATION_ROTATION_SIZE = 3;
const RECOMMENDATION_ROTATION_INTERVAL = 60_000;
const RADIUS_OPTIONS = [1, 2, 3, 4, 5];

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
  const [radiusKm, setRadiusKm] = useState(3);
  const [rotationTick, setRotationTick] = useState(0);
  const [agendaId, setAgendaId] = useState<number | null>(null);
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);
  const { location, hasPermission, isRequesting, error, refresh } = useCurrentLocation();

  const locationCoords = useMemo(
    () =>
      location?.coords
        ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
        : null,
    [location]
  );

  const locationKey = locationCoords ? `${locationCoords.latitude}-${locationCoords.longitude}` : "none";

  const poolWithDistance = useMemo<RecommendationWithDistance[]>(() => {
    return RECOMMENDATION_POOL.map((rec) => ({
      ...rec,
      distanceKm: locationCoords ? haversineDistanceKm(locationCoords, rec.coords) : null,
    }));
  }, [locationCoords]);

  const chatSuggestions = useMemo<RecommendationWithDistance[]>(() => {
    const sorted = [...poolWithDistance].sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
    );
    return sorted.slice(0, 3);
  }, [poolWithDistance]);

  const filteredPool = useMemo<RecommendationWithDistance[]>(() => {
    const byCategory =
      selected === "all" ? poolWithDistance : poolWithDistance.filter((rec) => rec.category === selected);
    if (!locationCoords) {
      return byCategory;
    }
    return byCategory.filter((rec) => rec.distanceKm !== null && rec.distanceKm <= radiusKm);
  }, [locationCoords, poolWithDistance, radiusKm, selected]);

  const rotationResetKey = `${selected}-${radiusKm}-${locationKey}-${filteredPool.length}`;
  const rotationBaseTick = useMemo(() => rotationTick, [rotationResetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const rotationStartIndex = useMemo(() => {
    if (!filteredPool.length) return 0;
    const raw = rotationTick - rotationBaseTick;
    const modulo = raw % filteredPool.length;
    return modulo < 0 ? modulo + filteredPool.length : modulo;
  }, [filteredPool.length, rotationBaseTick, rotationTick]);

  const visibleRecommendations = useMemo<RecommendationWithDistance[]>(() => {
    if (!filteredPool.length) return [];
    const limit = Math.min(RECOMMENDATION_ROTATION_SIZE, filteredPool.length);
    return Array.from({ length: limit }, (_, idx) => {
      const pointer = (rotationStartIndex + idx) % filteredPool.length;
      return filteredPool[pointer];
    });
  }, [filteredPool, rotationStartIndex]);

  useEffect(() => {
    if (!filteredPool.length) return;
    const intervalId = setInterval(() => {
      setRotationTick((prev) => prev + RECOMMENDATION_ROTATION_SIZE);
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

        <View style={styles.locationBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationTitle}>Tu ubicación</Text>
            {locationCoords ? (
              <Text style={styles.locationSubtitle}>
                {locationCoords.latitude.toFixed(4)}, {locationCoords.longitude.toFixed(4)}
              </Text>
            ) : (
              <Text style={styles.locationSubtitle}>
                {hasPermission ? "Obteniendo coordenadas..." : "Activa los permisos para filtrar por cercanía"}
              </Text>
            )}
            {!!error && <Text style={styles.locationError}>{error}</Text>}
          </View>
          <Pressable
            style={[styles.secondaryBtn, styles.refreshBtn, isRequesting && styles.refreshBtnDisabled]}
            onPress={refresh}
            disabled={isRequesting}
          >
            <Text style={styles.secondaryText}>{isRequesting ? "Actualizando..." : "Actualizar"}</Text>
          </Pressable>
        </View>

        <View style={styles.radiusRow}>
          {RADIUS_OPTIONS.map((value) => (
            <Pressable
              key={value}
              style={[
                styles.radiusChip,
                radiusKm === value && styles.radiusChipActive,
                !locationCoords && styles.radiusChipDisabled,
              ]}
              onPress={() => setRadiusKm(value)}
              disabled={!locationCoords}
            >
              <Text style={radiusKm === value ? styles.radiusTextActive : styles.radiusText}>{value} km</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.radiusHint}>
          {locationCoords
            ? `Mostrando propuestas a ${radiusKm} km`
            : "Activa tu ubicación para filtrar por distancia (1 km - 5 km)."}
        </Text>

        {chatSuggestions.length ? (
          <View style={styles.aiChatCard}>
            <Text style={styles.aiChatTitle}>AlfredIA te recomienda</Text>
            <Text style={styles.aiChatSubtitle}>
              {locationCoords
                ? `Estoy encontrando ${chatSuggestions.length} opciones a menos de ${radiusKm} km de ti.`
                : "Activa tu ubicación para personalizar aún más la conversación."}
            </Text>
            <View style={{ gap: 8 }}>
              {chatSuggestions.map((rec) => (
                <View key={`chat-${rec.id}`} style={styles.aiChatRow}>
                  <View>
                    <Text style={styles.aiChatRowTitle}>{rec.title}</Text>
                    <Text style={styles.aiChatRowMeta}>
                      {rec.category} · {formatDistance(rec.distanceKm)}
                    </Text>
                  </View>
                  <Pressable style={styles.aiChatAction} onPress={() => navigation.navigate("Mapa")}>
                    <Text style={styles.aiChatActionText}>Ver</Text>
                  </Pressable>
                </View>
              ))}
            </View>
            <Pressable style={styles.chatPrimaryBtn} onPress={() => navigation.navigate("Mapa")}>
              <Text style={styles.chatPrimaryBtnText}>Abrir mapa y chat</Text>
            </Pressable>
          </View>
        ) : null}

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
                  <Text>{formatDistance(rec.distanceKm)}</Text>
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
  locationBanner: {
    flexDirection: "row",
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.md,
    alignItems: "center",
  },
  aiChatCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    gap: SPACING.sm,
    shadowColor: COLORS.text,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  aiChatTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  aiChatSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
  },
  aiChatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  aiChatRowTitle: {
    color: COLORS.text,
    fontWeight: "600",
  },
  aiChatRowMeta: {
    color: COLORS.muted,
    fontSize: 12,
  },
  aiChatAction: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  aiChatActionText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  chatPrimaryBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  chatPrimaryBtnText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  locationSubtitle: {
    color: COLORS.muted,
    marginTop: 4,
  },
  locationError: {
    color: "#dc2626",
    marginTop: 4,
    fontSize: 12,
  },
  refreshBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  refreshBtnDisabled: {
    opacity: 0.6,
  },
  radiusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  radiusChip: {
    flexGrow: 1,
    minWidth: 70,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  radiusChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radiusChipDisabled: {
    opacity: 0.5,
  },
  radiusText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  radiusTextActive: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  radiusHint: {
    color: COLORS.muted,
    fontSize: 12,
    marginLeft: 4,
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

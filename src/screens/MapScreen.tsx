import { useMemo, useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/types";
import { COLORS, SPACING } from "../theme";
import { RECOMMENDATION_POOL, Recommendation } from "../data/recommendations";
import { formatDistance, haversineDistanceKm, useCurrentLocation } from "../lib/location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const RADIUS_OPTIONS = [1, 2, 3, 4, 5];

const FALLBACK_REGION = {
  latitude: RECOMMENDATION_POOL[0]?.coords.latitude ?? -12.0464,
  longitude: RECOMMENDATION_POOL[0]?.coords.longitude ?? -77.0428,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const FALLBACK_COORDS = {
  latitude: FALLBACK_REGION.latitude,
  longitude: FALLBACK_REGION.longitude,
};

type PlaceWithDistance = Recommendation & { distanceKm: number | null };

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function MapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState("");
  const [radiusKm, setRadiusKm] = useState(3);
  const { location, hasPermission, isRequesting, error, refresh } = useCurrentLocation();

  const locationCoords = useMemo(
    () =>
      location?.coords
        ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
        : null,
    [location]
  );

  const referenceCoords = locationCoords ?? FALLBACK_COORDS;

  const places = useMemo<PlaceWithDistance[]>(() => {
    return RECOMMENDATION_POOL.map((rec) => ({
      ...rec,
      distanceKm: haversineDistanceKm(referenceCoords, rec.coords),
    }));
  }, [referenceCoords]);

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo<PlaceWithDistance[]>(() => {
    const base = normalizedSearch
      ? places.filter((place) => {
          const text = `${place.title} ${place.category} ${place.tags.join(" ")}`.toLowerCase();
          return text.includes(normalizedSearch);
        })
      : places;
    const sorted = [...base].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    if (!locationCoords) return sorted.slice(0, 6); // muestras cuando no hay ubicación
    return sorted.filter((place) => place.distanceKm !== null && place.distanceKm <= radiusKm);
  }, [locationCoords, normalizedSearch, places, radiusKm]);

  const mapRegion = useMemo(() => {
    if (locationCoords) {
      const delta = 0.01 * Math.max(1, radiusKm / 2);
      return {
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
      };
    }
    return FALLBACK_REGION;
  }, [locationCoords, radiusKm]);

  const mapKey = locationCoords
    ? `region-${locationCoords.latitude}-${locationCoords.longitude}-${radiusKm}`
    : "region-fallback";

  const mapPlaces = useMemo(() => filtered.slice(0, 10), [filtered]);
  const aiHighlights = useMemo(() => filtered.slice(0, 3), [filtered]);

  const [isMapReady, setIsMapReady] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Check if Google Maps script is loaded
      const checkGoogleMaps = () => {
        if ((window as any).google && (window as any).google.maps) {
          setIsMapReady(true);
        }
      };
      
      checkGoogleMaps();
      const interval = setInterval(checkGoogleMaps, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const emptyStateLabel = normalizedSearch
    ? "No encontramos coincidencias para tu búsqueda en este radio."
    : locationCoords
    ? "Sin propuestas dentro del radio seleccionado. Amplía el rango para ver más lugares."
    : "Autoriza tu ubicación para ver recomendaciones cercanas.";

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md }}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Buscar ubicaciones</Text>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Buscar lugares, servicios..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.searchButton}>
            <Text style={{ color: COLORS.surface }}>🔍</Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          {Platform.OS === 'web' && !isMapReady ? (
             <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e5e7eb' }]}>
               <Text style={{ color: COLORS.muted, textAlign: 'center', padding: 20 }}>
                 El mapa requiere una API Key de Google Maps para web.{'\n'}
                 Asegúrate de cargar el script en tu index.html o app.json.
               </Text>
             </View>
          ) : (
            <MapView
              key={mapKey}
              provider={Platform.OS === 'web' ? 'google' : PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={mapRegion}
            >
              {locationCoords && (
                <Marker
                  coordinate={locationCoords}
                  title="Estás aquí"
                  description="Ubicación detectada por AlfredIA"
                  pinColor="#2563eb"
                />
              )}
              {mapPlaces.map((place) => (
                <Marker
                  key={place.id}
                  coordinate={place.coords}
                  title={place.title}
                  description={`${place.category} · ${formatDistance(place.distanceKm)}`}
                />
              ))}
            </MapView>
          )}
          <View style={styles.mapStatusBox}>
            <Text style={styles.mapStatusTitle}>
              {locationCoords ? "Ubicación detectada" : "Muestra de lugares cercanos"}
            </Text>
            <Text style={styles.mapStatusSubtitle}>
              {locationCoords
                ? `${mapPlaces.length} lugares dentro de ${radiusKm} km`
                : "Mostrando ejemplos cerca de la ubicación de referencia"}
            </Text>
          </View>
        </View>

        <View style={styles.locationCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationTitle}>Tu ubicación actual</Text>
            {locationCoords ? (
              <>
                <Text style={styles.locationCoords}>
                  Lat {locationCoords.latitude.toFixed(4)} · Lon {locationCoords.longitude.toFixed(4)}
                </Text>
                {!!location?.coords?.accuracy && (
                  <Text style={styles.locationAccuracy}>
                    Precisión ±{Math.round(location.coords.accuracy)} m
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.locationCoords}>
                {hasPermission ? "Detectando..." : "Activa los permisos para continuar"}
              </Text>
            )}
            {!!error && <Text style={styles.locationError}>{error}</Text>}
          </View>
          <Pressable
            style={[styles.secondaryBtn, styles.refreshBtn, isRequesting && styles.refreshBtnDisabled]}
            onPress={refresh}
            disabled={isRequesting}
          >
            <Text style={styles.secondaryText}>{isRequesting ? "Buscando..." : "Actualizar"}</Text>
          </Pressable>
        </View>

        <View style={styles.radiusRow}>
          {RADIUS_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={[
                styles.radiusChip,
                radiusKm === option && styles.radiusChipActive,
                !locationCoords && styles.radiusChipDisabled,
              ]}
              onPress={() => setRadiusKm(option)}
              disabled={!locationCoords}
            >
              <Text style={radiusKm === option ? styles.radiusTextActive : styles.radiusText}>{option} km</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.radiusHint}>
          {locationCoords
            ? "Selecciona un radio entre 1 km y 5 km para ajustar tus búsquedas."
            : "Esperando permiso de ubicación para activar el filtro por distancia."}
        </Text>

        {aiHighlights.length ? (
          <View style={styles.aiCard}>
            <Text style={styles.aiCardTitle}>
              {locationCoords ? "AlfredIA detecta cerca de ti" : "Opciones recomendadas"}
            </Text>
            <Text style={styles.aiCardSubtitle}>
              {locationCoords
                ? "Estas son las paradas ideales dentro de tu radio actual"
                : "Activa tu ubicación para personalizar mejor las sugerencias"}
            </Text>
            <View style={{ gap: SPACING.xs }}>
              {aiHighlights.map((place) => (
                <View key={`ai-${place.id}`} style={styles.aiRow}>
                  <View>
                    <Text style={styles.aiRowTitle}>{place.title}</Text>
                    <Text style={styles.aiRowMeta}>
                      {formatDistance(place.distanceKm)} · {place.category}
                    </Text>
                  </View>
                  <Text style={styles.aiRowTag}>{place.tags[0]}</Text>
                </View>
              ))}
            </View>
            <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate("Alfred")}>
              <Text style={styles.primaryBtnText}>Chatear con AlfredIA</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>Recomendaciones cercanas</Text>
          <Text style={styles.sectionSubtitle}>
            {locationCoords ? `Radio actual ${radiusKm} km` : "Ubicación pendiente"}
          </Text>
        </View>

        <View style={{ gap: SPACING.md }}>
          {filtered.length ? (
            filtered.map((place) => (
              <View key={place.id} style={styles.placeCard}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                    <Text style={styles.placeName}>{place.title}</Text>
                    <Text style={styles.placeType}>{place.category}</Text>
                    <Text style={styles.placeAddress}>{place.desc}</Text>
                  </View>
                  <Text style={styles.distance}>{formatDistance(place.distanceKm)}</Text>
                </View>
                <View style={styles.placeMeta}>
                  <Text>★ {place.rating}</Text>
                  <Text>{place.price}</Text>
                  <Text>{place.time}</Text>
                </View>
                <View style={styles.tagsRow}>
                  {place.tags.slice(0, 3).map((tag) => (
                    <Text key={tag} style={styles.tag}>
                      {tag}
                    </Text>
                  ))}
                </View>
                <View style={styles.actionsRow}>
                  <Pressable style={styles.secondaryBtn}>
                    <Text style={styles.secondaryText}>Guardar</Text>
                  </Pressable>
                  <Pressable style={styles.secondaryBtn}>
                    <Text style={styles.secondaryText}>Cómo llegar</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nada que mostrar</Text>
              <Text style={styles.emptyText}>{emptyStateLabel}</Text>
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
  },
  searchRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  searchButton: {
    width: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  mapContainer: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  map: {
    height: 220,
  },
  mapStatusBox: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  mapStatusTitle: {
    fontWeight: "700",
    color: COLORS.text,
  },
  mapStatusSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  locationCard: {
    backgroundColor: "#e0f2fe",
    borderRadius: 24,
    padding: SPACING.lg,
    gap: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  locationTitle: {
    fontWeight: "700",
    color: COLORS.secondary,
  },
  locationCoords: {
    color: COLORS.text,
    marginTop: 4,
  },
  locationAccuracy: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  locationError: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
  },
  refreshBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
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
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: "center",
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
  aiCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    gap: SPACING.sm,
    shadowColor: COLORS.text,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  aiCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  aiCardSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
  },
  aiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  aiRowTitle: {
    fontWeight: "600",
    color: COLORS.text,
  },
  aiRowMeta: {
    color: COLORS.muted,
    fontSize: 12,
  },
  aiRowTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: COLORS.secondary,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
  },
  placeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.md,
    gap: SPACING.sm,
    shadowColor: COLORS.text,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
  },
  placeType: {
    color: COLORS.muted,
  },
  placeAddress: {
    color: COLORS.muted,
    fontSize: 12,
  },
  distance: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
  placeMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: SPACING.sm,
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
    fontSize: 12,
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
    backgroundColor: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  primaryBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    alignItems: "center",
    gap: 4,
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
});

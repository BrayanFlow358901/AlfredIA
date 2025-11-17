import { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/types";
import { COLORS, SPACING } from "../theme";

const mockPlaces = [
  {
    id: 1,
    name: "Farmacia San Miguel",
    type: "Farmacia",
    address: "Av. Principal 123",
    distance: 0.2,
    rating: 4.5,
    open: "Abierto hasta 22:00",
    open24: false,
  },
  {
    id: 2,
    name: "Supermercado Central",
    type: "Supermercado",
    address: "Calle Comercio 456",
    distance: 0.5,
    rating: 4.3,
    open: "Abierto 24 horas",
    open24: true,
  },
];

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function MapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState("");
  const filtered = search
    ? mockPlaces.filter((place) =>
        place.name.toLowerCase().includes(search.toLowerCase()) ||
        place.type.toLowerCase().includes(search.toLowerCase())
      )
    : mockPlaces;

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

        <View style={styles.mapStub}>
          <Text style={{ fontSize: 40 }}>🗺️</Text>
          <Text style={{ color: COLORS.muted }}>Mapa interactivo</Text>
          <Text style={{ color: COLORS.muted, fontSize: 12 }}>Tu ubicación actual</Text>
        </View>

        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>Tu ubicación actual</Text>
          <Text style={{ color: COLORS.muted }}>Av. Libertadores 234, Lima</Text>
          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Compartir</Text>
          </Pressable>
        </View>

        <View style={{ gap: SPACING.md }}>
          {filtered.map((place) => (
            <View key={place.id} style={styles.placeCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeType}>{place.type}</Text>
                  <Text style={styles.placeAddress}>{place.address}</Text>
                </View>
                <Text style={styles.distance}>{place.distance} km</Text>
              </View>
              <View style={styles.placeMeta}>
                <Text>★ {place.rating}</Text>
                <Text style={{ color: place.open24 ? "#16a34a" : "#15803d" }}>{place.open}</Text>
              </View>
              <View style={styles.actionsRow}>
                <Pressable style={styles.secondaryBtn}>
                  <Text style={styles.secondaryText}>Llamar</Text>
                </Pressable>
                <Pressable style={styles.secondaryBtn}>
                  <Text style={styles.secondaryText}>Cómo llegar</Text>
                </Pressable>
              </View>
            </View>
          ))}
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
  mapStub: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: SPACING.xl,
    alignItems: "center",
    gap: 4,
  },
  locationCard: {
    backgroundColor: "#dbeafe",
    borderRadius: 24,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  locationTitle: {
    fontWeight: "700",
    color: COLORS.secondary,
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
    color: COLORS.muted,
  },
  placeMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});

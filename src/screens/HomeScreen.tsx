import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../navigation/types";
import { ScrollView, View, Text, StyleSheet, Pressable, Image } from "react-native";
import { COLORS, SPACING } from "../theme";

const quickActions = [
  {
    id: "alfred",
    title: "Recomendaciones",
    description: "Sugerencias de AlfredIA",
    route: "Alfred" as const,
    accent: "#fef3c7",
    icon: "🤖",
  },
  {
    id: "agenda",
    title: "Agendar Cita",
    description: "Programa eventos y recordatorios",
    route: "Agenda" as const,
    accent: "#dbeafe",
    icon: "📅",
  },
  {
    id: "alarmas",
    title: "Crear Alarma",
    description: "Configura alarmas personalizadas",
    route: "Alarmas" as const,
    accent: "#dcfce7",
    icon: "⏰",
  },
  {
    id: "mapa",
    title: "Buscar Lugar",
    description: "Encuentra ubicaciones cercanas",
    route: "Mapa" as const,
    accent: "#ede9fe",
    icon: "📍",
  },
];

const recentActivity = [
  {
    id: 1,
    label: "Reunión de trabajo mañana a las 10:00",
    timeAgo: "2h",
    icon: "📅",
    surface: "#dbeafe",
  },
  {
    id: 2,
    label: "Alarma para ejercicio configurada",
    timeAgo: "1d",
    icon: "⏰",
    surface: "#dcfce7",
  },
  {
    id: 3,
    label: "Farmacia encontrada a 500m",
    timeAgo: "3h",
    icon: "📍",
    surface: "#ede9fe",
  },
];

function formatToday(): string {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formatted = formatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const today = formatToday();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: SPACING.md, gap: SPACING.lg }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={styles.date}>{today}</Text>
            <Text style={styles.title}>¡Hola, usuario!</Text>
            <Text style={styles.subtitle}>¿En qué puedo ayudarte hoy?</Text>
          </View>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80" }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.heroButtons}>
          <Pressable style={styles.heroButton} onPress={() => navigation.navigate("Agenda")}> 
            <Text style={styles.heroButtonTitle}>Próxima cita</Text>
            <Text style={styles.heroButtonSubtitle}>Organiza tu semana</Text>
          </Pressable>
          <Pressable style={styles.heroButton} onPress={() => navigation.navigate("Alfred")}> 
            <Text style={styles.heroButtonTitle}>Hablar con Alfred</Text>
            <Text style={styles.heroButtonSubtitle}>Recomendaciones inmediatas</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <View style={{ marginTop: SPACING.md, gap: SPACING.sm }}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              style={[styles.quickAction, { backgroundColor: action.accent }]}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md }}>
                <View style={styles.quickIcon}><Text style={{ fontSize: 22 }}>{action.icon}</Text></View>
                <View>
                  <Text style={styles.quickTitle}>{action.title}</Text>
                  <Text style={styles.quickSubtitle}>{action.description}</Text>
                </View>
              </View>
              <Text style={styles.quickChevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.sectionTitle}>Actividad reciente</Text>
          <Pressable onPress={() => navigation.navigate("Agenda")}>
            <Text style={styles.link}>Ver agenda</Text>
          </Pressable>
        </View>
        <View style={{ marginTop: SPACING.md, gap: SPACING.sm }}>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityRow}>
              <View style={[styles.activityIcon, { backgroundColor: activity.surface }]}>
                <Text style={{ fontSize: 20 }}>{activity.icon}</Text>
              </View>
              <Text style={styles.activityLabel}>{activity.label}</Text>
              <Text style={styles.activityMeta}>{activity.timeAgo}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  date: {
    color: "#cbd5f5",
    textTransform: "capitalize",
  },
  title: {
    color: COLORS.surface,
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#cbd5f5",
    marginTop: 4,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  heroButtons: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  heroButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: SPACING.md,
  },
  heroButtonTitle: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  heroButtonSubtitle: {
    color: "#cbd5f5",
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 28,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  link: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 24,
    padding: SPACING.md,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  quickSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
  },
  quickChevron: {
    fontSize: 30,
    color: COLORS.muted,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activityLabel: {
    flex: 1,
    color: COLORS.text,
  },
  activityMeta: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
});

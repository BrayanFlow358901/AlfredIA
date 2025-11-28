import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../navigation/types";
import { ScrollView, View, Text, StyleSheet, Pressable, Image, useColorScheme } from "react-native";
import { COLORS_LIGHT, COLORS_DARK, SPACING, COLORS } from "../theme";

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
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? COLORS_DARK : COLORS_LIGHT;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={{ padding: SPACING.md, gap: SPACING.lg }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.hero, { backgroundColor: themeColors.primary }] }>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={[styles.date, { color: themeColors.muted }]}>{today}</Text>
            <Text style={[styles.title, { color: themeColors.surface }]}>¡Hola, usuario!</Text>
            <Text style={[styles.subtitle, { color: themeColors.muted }]}>¿En qué puedo ayudarte hoy?</Text>
          </View>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80" }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.heroButtons}>
          <Pressable style={[styles.heroButton, { backgroundColor: themeColors.surface }]} onPress={() => navigation.navigate("Agenda")}> 
            <Text style={[styles.heroButtonTitle, { color: themeColors.text }]}>Próxima cita</Text>
            <Text style={[styles.heroButtonSubtitle, { color: themeColors.muted }]}>Organiza tu semana</Text>
          </Pressable>
          <Pressable style={[styles.heroButton, { backgroundColor: themeColors.surface }]} onPress={() => navigation.navigate("Alfred")}> 
            <Text style={[styles.heroButtonTitle, { color: themeColors.text }]}>Hablar con Alfred</Text>
            <Text style={[styles.heroButtonSubtitle, { color: themeColors.muted }]}>Recomendaciones inmediatas</Text>
          </Pressable>
          <Pressable style={[styles.heroButton, { backgroundColor: themeColors.surface }]} onPress={() => navigation.navigate("Chat")}> 
            <Text style={[styles.heroButtonTitle, { color: themeColors.text }]}>Chat IA</Text>
            <Text style={[styles.heroButtonSubtitle, { color: themeColors.muted }]}>Habla con AlfredIA</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: themeColors.surface }] }>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Acciones rápidas</Text>
        <View style={{ marginTop: SPACING.md, gap: SPACING.sm }}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              style={[styles.quickAction, { backgroundColor: colorScheme === "dark" ? themeColors.primary : action.accent }]}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md }}>
                <View style={[styles.quickIcon, { backgroundColor: themeColors.surface }]}><Text style={{ fontSize: 22, color: themeColors.text }}>{action.icon}</Text></View>
                <View>
                  <Text style={[styles.quickTitle, { color: themeColors.text }]}>{action.title}</Text>
                  <Text style={[styles.quickSubtitle, { color: themeColors.muted }]}>{action.description}</Text>
                </View>
              </View>
              <Text style={[styles.quickChevron, { color: themeColors.muted }]}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: themeColors.surface }] }>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Actividad reciente</Text>
          <Pressable onPress={() => navigation.navigate("Agenda")}>
            <Text style={[styles.link, { color: themeColors.secondary }]}>Ver agenda</Text>
          </Pressable>
        </View>
        <View style={{ marginTop: SPACING.md, gap: SPACING.sm }}>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={[styles.activityRow, { backgroundColor: colorScheme === "dark" ? themeColors.background : "#f8fafc" }] }>
              <View style={[styles.activityIcon, { backgroundColor: colorScheme === "dark" ? themeColors.primary : activity.surface }]}> 
                <Text style={{ fontSize: 20, color: themeColors.text }}>{activity.icon}</Text>
              </View>
              <Text style={[styles.activityLabel, { color: themeColors.text }]}>{activity.label}</Text>
              <Text style={[styles.activityMeta, { color: themeColors.muted }]}>{activity.timeAgo}</Text>
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
  },
  hero: {
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
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  quickSubtitle: {
    fontSize: 12,
  },
  quickChevron: {
    fontSize: 30,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
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
  },
  activityMeta: {
    fontSize: 12,
    fontWeight: "600",
  },
});

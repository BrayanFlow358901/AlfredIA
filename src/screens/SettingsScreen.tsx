import { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import { COLORS, SPACING } from "../theme";

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    smartSuggestions: true,
    notifications: true,
    biometricUnlock: false,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.subtitle}>Controla cómo Alfred cuida tu día</Text>
        </View>

        <View style={{ gap: SPACING.md }}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Personalización inteligente</Text>
            <View style={styles.row}>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Sugerencias contextuales</Text>
                <Text style={styles.rowSubtitle}>Recomendaciones según tu agenda y actividad</Text>
              </View>
              <Switch
                value={settings.smartSuggestions}
                onValueChange={() => handleToggle("smartSuggestions")}
                trackColor={{ true: COLORS.primary, false: COLORS.border }}
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Notificaciones</Text>
            <View style={styles.row}>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Alertas prioritarias</Text>
                <Text style={styles.rowSubtitle}>Citas médicas, medicación y alarmas críticas</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleToggle("notifications")}
                trackColor={{ true: COLORS.primary, false: COLORS.border }}
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Seguridad</Text>
            <View style={styles.row}>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Desbloqueo biométrico</Text>
                <Text style={styles.rowSubtitle}>Usar huella o rostro para funciones sensibles</Text>
              </View>
              <Switch
                value={settings.biometricUnlock}
                onValueChange={() => handleToggle("biometricUnlock")}
                trackColor={{ true: COLORS.primary, false: COLORS.border }}
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Apariencia</Text>
            <View style={styles.row}>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Modo oscuro</Text>
                <Text style={styles.rowSubtitle}>Ideal para uso nocturno o entornos con poca luz</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={() => handleToggle("darkMode")}
                trackColor={{ true: COLORS.primary, false: COLORS.border }}
              />
            </View>
          </View>
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
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.muted,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 26,
    padding: SPACING.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  rowTextContainer: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
  },
});

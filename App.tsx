
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigator from "./src/navigation/RootNavigator";
import { useColorScheme } from "react-native";
import { COLORS_LIGHT, COLORS_DARK } from "./src/theme";


export default function App() {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? COLORS_DARK : COLORS_LIGHT;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

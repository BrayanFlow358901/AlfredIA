import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import AgendaScreen from "../screens/AgendaScreen";
import AlarmScreen from "../screens/AlarmScreen";
import AlfredScreen from "../screens/AlfredScreen";
import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import { HomeStackParamList, RootTabParamList } from "./types";
import { View } from "react-native";

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();


function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <HomeStack.Screen name="Inicio" component={HomeScreen} />
      <HomeStack.Screen name="Agenda" component={AgendaScreen} />
      <HomeStack.Screen name="Alarmas" component={AlarmScreen} />
      <HomeStack.Screen name="Alfred" component={AlfredScreen} />
      <HomeStack.Screen name="Mapa" component={MapScreen} />
      <HomeStack.Screen name="Chat" component={ChatScreen} />
    </HomeStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0f172a",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 78,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          backgroundColor: "#ffffff",
          shadowColor: "#0f172a",
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let icon = "circle";
          if (route.name === "Principal") icon = "home";
          if (route.name === "Notificaciones") icon = "bell";
          if (route.name === "Configuracion") icon = "settings";
          return (
            <View
              style={{
                backgroundColor: focused ? "#0f172a" : "transparent",
                padding: focused ? 8 : 0,
                borderRadius: 999,
              }}
            >
              <Feather name={icon as any} size={size} color={focused ? "#ffffff" : color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Principal" component={HomeStackNavigator} options={{ title: "Inicio" }} />
      <Tab.Screen name="Notificaciones" component={NotificationsScreen} />
      <Tab.Screen name="Configuracion" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

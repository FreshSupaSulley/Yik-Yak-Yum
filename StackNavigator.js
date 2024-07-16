import { Platform } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "react-native-paper";

// Screens
import FoodScreen from "./screens/FoodScreen";
import MapScreen from "./screens/MapScreen";

import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

function Tabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="FoodScreen"
        component={FoodScreen}
        options={{
          title: "Food",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "fast-food" : "fast-food-outline"}
              size={24}
              color={focused ? theme.colors.primary : theme.colors.onBackground}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={24}
              color={focused ? theme.colors.primary : theme.colors.onBackground}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={Tabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default Navigation;

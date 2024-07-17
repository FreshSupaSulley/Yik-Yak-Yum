
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton, useTheme } from "react-native-paper";

// Screens
import FoodScreen from "./screens/FoodScreen";
import MapScreen from "./screens/MapScreen";
import PostScreen from "./screens/PostScreen";

import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

// Fancy add post button
function AddButton({ onPress }) {
  const theme = useTheme();
  return (
    <>
      <IconButton iconColor="white" containerColor={theme.colors.primary} icon="plus" style={{ borderWidth: 3, borderColor: 'white', justifyContent: 'center', alignSelf: 'flex-end' }} size={50} onPress={onPress} />
    </>
  );
}

// Navigation is passed in
function Tabs({ navigation }) {
  const theme = useTheme();
  return (
    <Tab.Navigator>
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
      {/* Fancy add button */}
      <Tab.Screen name="Logout" children={() => { }} options={{ tabBarButton: () => (<AddButton onPress={() => navigation.navigate('PostScreen')} />) }} />
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
          {/* Popup modal when add button is clicked */}
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="PostScreen" component={PostScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default Navigation;

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, Animated, TouchableOpacity, View } from "react-native";
import { Button, IconButton, useTheme } from "react-native-paper";
import { FoodDataProvider } from "./components/FoodDataContext";

// Screens
import FoodScreen from "./screens/FoodScreen";
import MapScreen from "./screens/MapScreen";
import PostScreen from "./screens/PostScreen";
import SplashScreen from "./screens/SplashScreen";
import MapSelectScreen from "./screens/MapSelectScreen";

import ScalablePress from "./components/ScalablePress";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from "react";

// Custom tab button so we can add fancy click effects
const TabButton = (props) => {
  const { children, onPress } = props;
  return (
    <ScalablePress onPress={onPress}>
      {/* Add icon back */}
      {children}
    </ScalablePress>
    // <TouchableOpacity onPressIn={zoomIn} onPressOut={zoomOut} onPress={onPress} style={{ flex: 1 }}>
    // </TouchableOpacity>
  )
}

// Navigation is passed in automagically
function Tabs({ navigation }) {
  const Tab = createBottomTabNavigator();
  const iconSize = 30;
  const theme = useTheme();
  return (
    <Tab.Navigator screenOptions={{ tabBarButton: (props) => <TabButton {...props} />, tabBarShowLabel: false, headerShown: false, tabBarActiveTintColor: theme.colors.primary, tabBarInactiveTintColor: theme.colors.onBackground }}>
      {/* Food screen */}
      <Tab.Screen
        name="FoodScreen"
        component={FoodScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "fast-food" : "fast-food-outline"} size={iconSize} color={color} />
          ),
        }}
      />
      {/* Fancy add button. Overrides tabBarButton */}
      <Tab.Screen name="Add Post" children={() => null} options={{
        tabBarButton: (props) => {
          const animation = useRef(new Animated.Value(0)).current;
          // Smooth scale when pressed and held
          function onPressIn() {
            console.log("pressed");
            Animated.spring(animation, {
              toValue: 1, useNativeDriver: true,
            }).start();
          }
          function onPressOut() {
            console.log("out");
            Animated.spring(animation, {
              toValue: 0, useNativeDriver: true,
            }).start();
          }
          const spin = animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
          });
          const color = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [theme.colors.primary, '#1DB954']
          });
          return (
            <ScalablePress onPressIn={onPressIn} onPressOut={onPressOut} activeScale={0.9} activeOpacity={1} onPress={() => navigation.navigate('PostScreen')} style={{ flex: 0, flexBasis: 'auto', transform: [{ translateY: -15 }] }}>
              {/* Shadow is broken on web and idc enough to fix it */}
              <Animated.View style={[{ transform: [{ rotateZ: spin }] }]}>
                <IconButton iconColor="white" containerColor={color} icon="plus" style={{ alignItems: 'center' }} size={38} />
              </Animated.View>
            </ScalablePress>
          )
        }
      }} />
      {/* Map screen */}
      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={iconSize} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function Navigation() {
  const navigationRef = useRef(null);
  return (
    <NavigationContainer ref={navigationRef}>
      <FoodDataProvider initialized={() => navigationRef.current.navigate("Main")}>
        {/* Configure global screen options */}
        <Stack.Navigator screenOptions={{ gestureEnabled: false, headerShown: false, headerBackTitle: "Back" }}>
          {/* Splash */}
          <Stack.Group>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
          </Stack.Group>
          {/* Content */}
          <Stack.Screen name="Main" component={Tabs} options={{ animation: 'fade' }} />
          {/* Popup modal when add button is clicked */}
          <Stack.Group screenOptions={{ headerTitle: "Share Free Food", headerShown: true, gestureEnabled: true }}>
            <Stack.Screen name="PostScreen" component={PostScreen} />
            <Stack.Screen options={{ headerBackTitle: "Cancel", headerTitle: "Select Location" }} name="MapSelectScreen" component={MapSelectScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </FoodDataProvider>
    </NavigationContainer>
  );
}

export default Navigation;

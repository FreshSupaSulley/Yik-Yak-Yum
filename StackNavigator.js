import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Animated, View } from "react-native";
import { Banner, IconButton, Snackbar, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FoodDataContext, FoodDataProvider } from "./components/FoodDataContext";

// Screens
import FoodScreen from "./screens/FoodScreen";
import MapScreen from "./screens/MapScreen";
import MapSelectScreen from "./screens/MapSelectScreen";
import PostScreen from "./screens/PostScreen";
import SplashScreen from "./screens/SplashScreen";

import ScalablePress from "./components/ScalablePress";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";

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
            Animated.spring(animation, {
              toValue: 1, useNativeDriver: true,
            }).start();
          }
          function onPressOut() {
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

export const Navigation = () => {
  // SafeAreaView insets for banner
  const insets = useSafeAreaInsets();
  // Navigator ref
  const navigationRef = useRef(null);
  // Request to show location
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [currentRoute, setCurrentRoute] = useState(0);
  // Snackbar
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarVisible, setSnackbarVisibility] = useState(false);
  const addMessage = (message) => {
    setSnackbarVisibility(false);
    // Need to re-render snackbar to get duration timer to reset
    setTimeout(() => {
      setSnackbarText(message);
      setSnackbarVisibility(true);
    }, 0);
  };
  return (
    <NavigationContainer ref={navigationRef} onStateChange={(e) => setCurrentRoute(e.index)}>
      <FoodDataProvider initialized={() => navigationRef.current.navigate("Main")} failed={(error) => navigationRef.current.navigate("SplashScreen", { error })} onSnackbar={addMessage} >
        {/* Show banner to allow user location if not enabled */}
        <FoodDataContext.Consumer>
          {({ userLocation, foodData, requestUserLocation }) => (
            <Banner
              visible={bannerEnabled && foodData && !userLocation}
              actions={[
                { label: 'Enable Location Services', icon: 'near-me', onPress: requestUserLocation },
                { label: 'Close', onPress: () => setBannerEnabled(false) }
              ]}
            >
              <View style={{ paddingTop: insets.top, gap: 4 }}>
                <Text style={{ fontWeight: 'bold' }} variant="titleLarge">Location disabled</Text>
                <Text>Enable location services to calculate your distance to posts.</Text>
              </View>
            </Banner>
          )}
        </FoodDataContext.Consumer>
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
      {/* Snackbar for popup alerts */}
      <Snackbar style={{ marginBottom: 70 }} duration={3000} onIconPress={() => { setSnackbarVisibility(false) }} icon='close' visible={snackbarVisible} onDismiss={() => setSnackbarVisibility(false)}>
        {snackbarText}
      </Snackbar>
    </NavigationContainer>
  );
}

export default Navigation
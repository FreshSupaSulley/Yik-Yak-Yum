import Entypo from "@expo/vector-icons/Entypo";
import * as Font from "expo-font";
import React, { useCallback, useEffect, useState } from "react";
import { View, Appearance, StyleSheet } from "react-native";
import { ActivityIndicator, Text, PaperProvider } from "react-native-paper";
import Navigation from "./StackNavigator";
import * as Theme from "./themes";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        // LOAD SHIT HERE (API calls go here)
        // Artificially delay for two seconds to simulate a slow loading
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);
  // What to return while app is still loading
  if (!appIsReady) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Spoiling JJK...</Text>
        <ActivityIndicator animating={true} />
      </SafeAreaView>
    );
  }
  return (
    <>
      <PaperProvider
        theme={
          Appearance.getColorScheme() == "light"
            ? Theme.lightTheme
            : Theme.darkTheme
        }
      >
        {/* <PaperProvider theme={Appearance.getColorScheme() == 'light' ? DefaultLight : DefaultDark}> */}
        <Navigation />
      </PaperProvider>
    </>
    // <Text>hi</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

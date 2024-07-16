import React from "react";
import { Appearance, StatusBar, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import Navigation from "./StackNavigator";
import * as Theme from "./themes";

export default function App() {
  let colorScheme = Appearance.getColorScheme();
  // colorScheme = "dark";
  // What to return while app is still loading
  return (
    <>
      {/* Including this seems to theme the bar correctly without any params. Maybe it's based off PaperProvider */}
      <StatusBar />
      <PaperProvider
        theme={colorScheme == "light" ? Theme.lightTheme : Theme.darkTheme}
      >
        <Navigation />
      </PaperProvider>
    </>
    // <Text>hi</Text>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "red",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

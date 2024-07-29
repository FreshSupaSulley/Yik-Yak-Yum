import React, { useEffect, useState, createContext } from "react";
import { Appearance, StatusBar, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import Navigation from "./StackNavigator";
import * as Theme from "./themes";
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'

export default function App() {
  // Call API
  let colorScheme = Appearance.getColorScheme();
  colorScheme = "light";
  return (
    <AutocompleteDropdownContextProvider>
      {/* Including this seems to theme the bar correctly without any params. Maybe it's based off PaperProvider */}
      <StatusBar />
      <PaperProvider theme={colorScheme == "light" ? Theme.lightTheme : Theme.darkTheme}>
        <Navigation />
      </PaperProvider>
    </AutocompleteDropdownContextProvider>
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

import React, { useContext, useEffect, useRef, useState } from "react";

import { SectionList, StyleSheet, View } from "react-native";
import { Button, Card, Divider, Snackbar, useTheme } from 'react-native-paper';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FoodDataContext } from "../components/FoodDataContext";
import FoodPost from "../components/FoodPost";

// Navigator is supplied by default
export default function FoodScreen({ navigation }) {
  // Get data
  const { foodData, refreshData } = useContext(FoodDataContext);
  console.log(foodData, refreshData);
  // Set first title of data
  // foodData[0].title = "Today";

  const [myTime, setMyTime] = useState(new Date());
  useEffect(() => {
    var timerID = setInterval(() => {
      setMyTime(new Date(myTime.getTime() + 1));
    }, 60000);
    return () => clearInterval(timerID);
  }, []);
  const scrollRef = useRef(null);
  // Swipe to refresh
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const theme = useTheme();
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
  const insets = useSafeAreaInsets();
  return (
    // <>
    <SafeAreaProvider>
      {/* Adding paddingBottom seems to break shit */}
      <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: theme.colors.onPrimary }}>
        <SectionList
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 0 }}
          sections={foodData}
          extraData={myTime}
          renderItem={({ item, index }) => {
            return (
              <FoodPost onPress={() => {
                navigation.navigate("MapScreen", { index });
              }} addMessage={addMessage} data={item} theme={theme} />
            )
          }} renderSectionHeader={({ section: { title, index } }) => (
            <>
              <Card.Title titleVariant={'headlineMedium'} style={[styles.titleContainer, { backgroundColor: theme.colors.onPrimary }]} title={title} subtitle={foodData[index].data.length > 0 ? foodData[index].data.length + " items" : "No items"} right={(props) => index > 0 && <Button compact onPress={() => scrollRef.current.scrollToLocation({ itemIndex: 0 })}>Back to Today</Button>} />
              <Divider bold />
            </>
          )} onRefresh={onRefresh} refreshing={refreshing}>
        </SectionList>
        {/* Snackbar for popup alerts */}
        <Snackbar duration={3000} onIconPress={() => { setSnackbarVisibility(false) }} icon='close' visible={snackbarVisible} onDismiss={() => setSnackbarVisibility(false)}>
          {snackbarText}
        </Snackbar>
      </View>
    </SafeAreaProvider>

    // </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    padding: 10,
    paddingBottom: 20,
    fontSize: 28,
    // fontWeight: "bold",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

import React, { useRef, useState } from "react";

import { SectionList, StyleSheet, View } from "react-native";
import { Button, Card, Divider, Portal, Snackbar, useTheme } from 'react-native-paper';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import FoodData from "../components/FoodData";
import FoodPost from "../components/FoodPost";

// Get the date
const date = new Date();
const foodData = [];

// Pretend we called the API, got the last 5 days
[...Array(2)].map((x, i) => {
  // API response
  let posts = [];
  // Temp offset the date
  var prevDate = new Date();
  prevDate.setDate(date.getDate() - i);
  for (let i = 0; i < 10; i++) {
    posts[i] = new FoodData('Buckeye Donuts', 'go to buckeye donuts and get a free donut with a student id because when you go and you get a student id they will give you af re donut because it sa special thig today and joh cena will be there and he gies every student with an a on their report card a high 5 and', 'lat and long lol', prevDate.getTime(), true, true, true);
  }
  // Fill in array
  foodData[i] = {
    title: prevDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }),
    data: posts,
    index: i
  };
});

// Set first title of data
foodData[0].title = "Today";

export default function FoodScreen() {
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
            renderItem={({ item, index }) => {
              return (
                <FoodPost addMessage={addMessage} data={item} theme={theme} />
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

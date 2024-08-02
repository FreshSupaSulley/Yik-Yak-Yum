import React, { useContext, useEffect, useRef, useState } from "react";

import { FlatList, Image, SectionList, StyleSheet, View } from "react-native";
import { Banner, Button, Card, Divider, Icon, useTheme } from 'react-native-paper';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FoodDataContext } from "../components/FoodDataContext";
import FoodPost from "../components/FoodPost";

// Navigator is supplied by default
export default function FoodScreen({ navigation }) {
  // Get data
  const { foodData, userLocation, requestUserLocation, refreshData } = useContext(FoodDataContext);

  // Set first title of data
  // foodData[0].title = "Today";
  // Constantly check each minute for new updates
  const [myTime, setMyTime] = useState(new Date());
  useEffect(() => {
    var timerID = setInterval(() => {
      // Check for new updates
      refreshData();
      // Update local time
      setMyTime(new Date(myTime.getTime() + 1));
    }, 60000);
    return () => clearInterval(timerID);
  }, []);
  const scrollRef = useRef(null);
  // Swipe to refresh
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refreshData().finally(() => {
      setRefreshing(false);
    })
  }, []);

  function navigateTest(index) {
    navigation.navigate("MapScreen", { index });
  }
  const [showBanner, setShowBanner] = useState<boolean>(true);

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    // <>
    <SafeAreaProvider>
      {/* Adding paddingBottom seems to break shit */}
      <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: theme.colors.onPrimary }}>
        {/* Show banner to allow user location if not enabled */}
        <Banner visible={showBanner && !userLocation}
          actions={[{ label: 'Enable Location Services', onPress: requestUserLocation }, { label: 'Close', onPress: () => setShowBanner(false), }]}
          icon={({ size }) => (
            <Icon size={24} source="near-me"></Icon>
          )}>
          Enable location services to calculate your distance to food listings.
        </Banner>
        <FlatList
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 0 }}
          data={foodData}
          extraData={myTime}
          renderItem={({ item, index }) => {
            return (
              <FoodPost key={index} style={{ margin: 8 }} data={item} theme={theme}>
                {item.location && <Button mode="contained" onPress={() => navigateTest(index)}>Map</Button>}
              </FoodPost>
            )
          }}
          onRefresh={onRefresh} refreshing={refreshing}>
        </FlatList>
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

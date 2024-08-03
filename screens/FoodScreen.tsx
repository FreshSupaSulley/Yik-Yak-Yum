import React, { useContext, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import { Banner, Button, useTheme } from 'react-native-paper';
import { FoodDataContext } from "../components/FoodDataContext";
import FoodPost from "../components/FoodPost";

// Background image
const backgroundImage = require('../assets/red_background.jpg');

export default function FoodScreen({ navigation }) {
  // Get data from context
  const { foodData, refreshData } = useContext(FoodDataContext);

  // Constantly check each minute for new updates
  const [myTime, setMyTime] = useState(new Date());
  useEffect(() => {
    const timerID = setInterval(() => {
      // Check for new updates
      refreshData();
      // Update local time
      setMyTime(new Date(myTime.getTime() + 1));
    }, 60000);
    return () => clearInterval(timerID);
  }, [myTime]);

  // Swipe to refresh
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  function navigateTest(index) {
    navigation.navigate("MapScreen", { index });
  }

  const theme = useTheme(); // Get theme from react-native-paper

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        {/* FlatList to display posts */}
        <FlatList
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          data={foodData}
          extraData={myTime}
          renderItem={({ item, index }) => (
            <FoodPost
              key={index}
              style={styles.foodPost}
              data={item}
              theme={theme} // Pass theme prop
            >
              {item.location && (
                <Button mode="contained" onPress={() => navigateTest(index)} style={styles.mapButton}>
                  Map
                </Button>
              )}
            </FoodPost>
          )}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, 
    paddingRight: 10, 
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  // no
  // banner: {
  //   backgroundColor: '#cf7e85', // New York Pink
  // },
  listContent: {
    paddingTop: 10,
  },
  foodPost: {
    marginBottom: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#d89e9a', // Can Can
    borderRadius: 8,
    padding: 12,
    borderColor: '#baacac', // Nobel
    borderWidth: 0.5, 
  },
  mapButton: {
    backgroundColor: '#d89e9a', // Can Can
    marginTop: 8,
  },
});

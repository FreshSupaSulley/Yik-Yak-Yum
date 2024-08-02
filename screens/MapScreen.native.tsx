import { Button, Card, DataTable, Divider, IconButton, Text, useTheme } from "react-native-paper";
import { StyleSheet, Image, Platform, SafeAreaView, View, Linking, useWindowDimensions } from "react-native";
import { Marker, Callout, LatLng, Region } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { useContext, useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { FoodDataContext } from "../components/FoodDataContext";
import FoodPost from "../components/FoodPost";

export const osuRegion = {
  latitude: 39.9995,
  longitude: -83.0127,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

const mapDelta = 0.02;

export default function MapScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { foodData, userLocation } = useContext(FoodDataContext);
  const [processedData, setProcessedData] = useState([]);
  const theme = useTheme();
  const route = useRoute();
  const mapRef = useRef<MapView>();

  // Only show posts with locations attached
  useEffect(() => {
    setProcessedData(foodData.filter(value => value.location));
  }, [foodData]);

  // Route doesn't become available until rendered apparently
  useEffect(() => {
    let index = route.params?.['index'];
    if(index >= 0) {
      // Add deltas back
      mapRef.current.animateToRegion({ ...osuRegion, ...foodData[index].location });
    }
  }, [route.params]);

  return (
    <>
      {/* Map */}
      <MapView
        ref={mapRef}
        spiderLineColor="#00000033"
        clusterColor={theme.colors.primary}
        showsUserLocation
        showsMyLocationButton
        style={{ flex: 1 }}
        initialRegion={osuRegion}
      >
        {/* Show all markers on food posts where locations are attached. Clustering comes in clutch for us */}
        {processedData.map((value, index) => {
          return (
            <Marker key={index} coordinate={value.location}>
              <Callout style={{ width: width - width / 5, padding: 0, margin: 0, borderWidth: 0 }}>
                <FoodPost data={value} theme={theme} style={{ margin: 0, padding: 0 }}>
                  <Button icon={"open-in-new"} compact mode="text" onPress={() => Linking.openURL(Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' }) + `${value.location.latitude},${value.location.longitude}`)}>Open in Maps</Button>
                </FoodPost>
              </Callout>
            </Marker>
          )
        })}
      </MapView>
      {/* Info */}
      <SafeAreaView style={{ position: 'absolute', left: 0, right: 0, flex: 1, flexDirection: 'row', margin: 8, justifyContent: 'space-between' }}>
        <View>
          <Card mode="contained" style={{ backgroundColor: theme.colors.onPrimary }}>
            <Card.Content>
              <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{processedData.length} posts marked</Text>
              {processedData.length != foodData.length && <Text variant="bodyMedium">{foodData.length - processedData.length} without location data</Text>}
            </Card.Content>
          </Card>
        </View>
        {/* Next line over, on the right */}
        <IconButton disabled={!userLocation} icon="near-me" mode="contained" size={24} onPress={() => mapRef.current.animateToRegion(userLocation)} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

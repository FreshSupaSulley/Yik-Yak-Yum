import { Text } from "react-native-paper";
import { StyleSheet, Image, Platform, SafeAreaView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useContext, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { FoodDataContext } from "../components/FoodDataContext";

export const osuRegion = {
  latitude: 39.9995,
  longitude: -83.0127,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

const mapDelta = 0.02;

export default function MapScreen({ navigation }) {
  const route = useRoute();
  const { foodData } = useContext(FoodDataContext);

  // Get selected item
  useEffect(() => {
    const index = route.params?.['index'];
    if (index !== undefined) {
      // If we were allowed to click on it, we assume the data at the index has the location
      let data = foodData;
      console.log(data);
      // mapRef.current.animateToRegion({ latitude: data.location.latitude, longitude: data.location.longitude, latitudeDelta: mapDelta, longitudeDelta: mapDelta });
    }
  }, [route.params]);

  const mapRef = useRef<MapView>();
  return (
    <View>
      <MapView
        ref={mapRef}
        showsUserLocation
        showsMyLocationButton
        style={{ width: "100%", height: "100%" }}
        initialRegion={osuRegion}
      >
        <Marker title={"Hi"} coordinate={osuRegion} />
      </MapView>
    </View>
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

import { Text } from "react-native-paper";
import { StyleSheet, Image, Platform, SafeAreaView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRef } from "react";
import { useRoute } from "@react-navigation/native";

export const osuRegion = {
  latitude: 39.9995,
  longitude: -83.0127,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

export default function MapScreen({ navigation }) {
  const route = useRoute();
  const index = route.params && route.params.index;
  // If index was never passed in, this is the first time opening the map
  if(!index) {
  }
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

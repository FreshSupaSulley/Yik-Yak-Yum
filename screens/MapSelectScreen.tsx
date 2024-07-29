import { Button, Text } from "react-native-paper";
import { StyleSheet, Image, Platform, SafeAreaView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute } from "@react-navigation/native";

const osuRegion = {
  latitude: 39.9995,
  longitude: -83.0127,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

export default function MapScreen({ navigation }) {
  return (
    <View>
      <Text>Nah.</Text>
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

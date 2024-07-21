import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Button, Icon, Text } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

export const osuRegion = {
    latitude: 39.9995,
    longitude: -83.0127,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

export default function MapSelectScreen({ navigation }) {
    const [region, setRegion] = useState<{ latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number }>(osuRegion);
    // const [region, setRegion] = useState<[number, number]>([osuRegion.latitude, osuRegion.longitude]);
    const navigator = useNavigation();
    const route = useRoute();

    // Route doesn't become available until rendered apparently
    useEffect(() => {
        const location = route.params?.['location'];
        if (location) {
            console.log("setting this bitch")
            setRegion({ latitude: location[0], longitude: location[1], latitudeDelta: osuRegion.latitudeDelta, longitudeDelta: osuRegion.longitudeDelta });
        }
    }, [route.params?.['location']]);
    return (
        // SafeAreaView is required. Weird bug in iOS where the region isn't exactly centered
        <SafeAreaView style={{ flex: 1 }}>
            {/* Instructions */}
            <View style={{ padding: 10 }}>
                <Text style={{ textAlign: 'center' }}>Align the crosshair on top of the location</Text>
            </View>
            {/* Map */}
            <MapView
                // provider={PROVIDER_GOOGLE}
                rotateEnabled={false}
                showsUserLocation={true}
                style={{ flex: 1 }}
                initialRegion={region}
                onRegionChangeComplete={(region) => {
                    console.log("settingUH");
                    setRegion(region);
                }}>
                <View style={styles.markerFixed}>
                    <Icon color="rgba(0, 0, 0, 0.2)" source="crosshairs-gps" size={80} />
                </View>
                {/* Confirm button */}
                <Button onPress={() => navigation.navigate("PostScreen", { location: [region.latitude, region.longitude] })} style={{ justifyContent: 'center', margin: 20 }} mode="contained">Confirm</Button>
            </MapView>
        </SafeAreaView>
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
    map: {
        flex: 1
    },
    markerFixed: {
        pointerEvents: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    marker: {
        height: 48,
        width: 48
    },
    footer: {
        position: 'absolute',
        flex: 1,
        // margin: 10
    },
    region: {
        color: '#fff',
        lineHeight: 20,
        margin: 20
    }
});

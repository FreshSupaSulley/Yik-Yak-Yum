import { useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Dimensions, Linking, Platform, Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { ChevronDown } from 'react-native-feather';
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import { Button, Icon, IconButton, Text, useTheme } from "react-native-paper";

const osuRegion = {
    latitude: 39.9995,
    longitude: -83.0127,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

export type DetailedLocation = LatLng & {
    title?: string
};

export default function MapSelectScreen({ navigation }) {
    const [selectedItem, setSelectedItem] = useState<DetailedLocation>({ ...osuRegion });
    const [userLocation, setUserLocation] = useState<Region>(null);
    const [nearbyResults, setUhh] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [suggestionsList, setSuggestionsList] = useState(null);

    function setNearbyResults(value) {
        // Only set the results if we have a user location
        if(userLocation) {
            setUhh(value);
        } else {
            setUhh(false);
        }
    }
    function itemSelected(item: DetailedLocation, animate = true) {
        if (item) {
            let region = { latitude: item.latitude, longitude: item.longitude };
            setSelectedItem({ ...region, title: item.title });
            // Smooth animate to location with deltas
            if (animate) {
                mapRef.current.animateToRegion({ ...osuRegion, ...region });
            }
        }
    };

    const mapRef = useRef(null);
    const dropdownController = useRef(null);
    const searchRef = useRef(null);

    const theme = useTheme();
    const route = useRoute();

    // Route doesn't become available until rendered apparently
    useEffect(() => {
        // If the location was already set, set the map to center on the location already chosen
        const location = route.params?.['location'];
        if (location) {
            itemSelected(location, true);
        }
        // Requests and fills the users location
        const askLocation = async () => {
            let { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
            // If permission was given
            if (status === 'granted') {
                let { coords } = await Location.getCurrentPositionAsync();
                setUserLocation({ ...osuRegion, latitude: coords.latitude, longitude: coords.longitude });
            } else {
                // Update permissions
                setUserLocation(null);
                setNearbyResults(false);
            }
        };
        // Add listener for when the app is reopened after location is enabled
        const subscription = AppState.addEventListener('change', async nextAppState => {
            if (nextAppState === 'active') askLocation();
        });
        // Initialize user's location
        askLocation();
    }, [route.params?.['location']]);
    // Gets map autocomplete suggestions
    const getSuggestions = useCallback(async query => {
        // Need at least 3 characters to search for something
        if (typeof query !== 'string' || query.length < 3) {
            setSuggestionsList(null);
            return;
        }
        const getDistance = ((lat1, lon1, lat2, lon2) => {
            // distance between latitudes
            // and longitudes
            let dLat = (lat2 - lat1) * Math.PI / 180.0;
            let dLon = (lon2 - lon1) * Math.PI / 180.0;
            // convert to radiansa
            lat1 = (lat1) * Math.PI / 180.0;
            lat2 = (lat2) * Math.PI / 180.0;
            // apply formulae
            let a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) *
                Math.cos(lat1) *
                Math.cos(lat2);
            let rad = 3961;
            let c = 2 * Math.asin(Math.sqrt(a));
            return rad * c;
        });
        setLoading(true);
        // Default to OSU location if not available
        let location = userLocation || osuRegion;
        const viewboxScale = 10;
        const viewbox = {
            lat1: location.latitude - location.latitudeDelta * viewboxScale,
            lon1: location.longitude - location.longitudeDelta * viewboxScale,
            lat2: location.latitude + location.latitudeDelta * viewboxScale,
            lon2: location.longitude + location.longitudeDelta * viewboxScale,
        }
        // Not even entertaining the idea of paying Google a single dime
        // OG URL: https://nominatim.openstreetmap.org/search?q=McDonalds&format=json&lat=37.7749&lon=-122.4194&bounded=1&viewbox=-124.482003,32.528832,-114.131211,42.009519
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&lat=${location.latitude}&lon=${location.longitude}&bounded=1&viewbox=${viewbox.lon1},${viewbox.lat1},${viewbox.lon2},${viewbox.lat2}`;
        const response = fetch(url).then(async (response) => {
            const json = await response.json();
            const suggestions = json.map(value => {
                // Calculate distance to user for each location
                let distance = getDistance(value.lat, value.lon, location.latitude, location.longitude);
                return { ...value, distanceToUser: distance >= 10 ? Math.floor(distance) : distance.toFixed(1) };
            }).sort((a, b) => {
                // Assort locations by distance to user
                return a.distanceToUser - b.distanceToUser;
            }).map((item, index) => ({
                id: index,
                title: item.name || item.display_name,
                caption: item.name && item.display_name,
                distanceToUser: `${item.distanceToUser} mile${item.distanceToUser != 1 && 's'}`,
                latitude: item.lat,
                longitude: item.lon
            }));
            // Sort by distance to campus
            setSuggestionsList(suggestions);
        }).catch((error) => {
            console.error("Failed to call OSM", error);
        }).finally(() => {
            setLoading(false);
        });
    }, []);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Instructions */}
            <View style={{ padding: 10 }}>
                <Text style={{ textAlign: 'center' }}>Align the crosshair to the location, then hit confirm</Text>
                {/* Enable location services if disabled */}
                {!userLocation && <Button style={{ marginTop: 8, backgroundColor: 'white' }} mode="text" icon="near-me" compact onPress={Linking.openSettings}>Enable location services</Button>}
            </View >
            <View style={{ flex: 1 }}>
                {/* Map */}
                <MapView
                    ref={mapRef}
                    rotateEnabled={false}
                    showsUserLocation
                    style={{ flex: 1 }}
                    initialRegion={{ ...selectedItem, latitudeDelta: osuRegion.latitudeDelta, longitudeDelta: osuRegion.longitudeDelta }}
                    onRegionChangeComplete={(item) => itemSelected(item, false)}>
                    {/* Show current location with a marker cause why not */}
                    <Marker coordinate={{ latitude: selectedItem.latitude, longitude: selectedItem.longitude }}></Marker>
                    {/* Crosshair */}
                    <View style={styles.markerFixed}>
                        <Icon color="rgba(0, 0, 0, 0.2)" source="crosshairs-gps" size={80} />
                    </View>
                </MapView>
                {/* Elements that overlay the map */}
                <View style={{ position: 'absolute', left: 0, right: 0, margin: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Search bar needs to fill all space */}
                        <View style={{ flex: 1 }}>
                            {/* Forward geocoding search */}
                            <AutocompleteDropdown
                                ref={searchRef}
                                EmptyResultComponent={
                                    <View style={{ padding: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>No results.</Text>
                                        {nearbyResults &&
                                            <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                                                <Text style={{ alignSelf: 'center' }}>Click </Text>
                                                <Icon source="google-nearby" color={theme.colors.primary} size={20} />
                                                <Text style={{ alignSelf: 'center' }}> to search globally.</Text>
                                            </View>}
                                    </View>
                                }
                                controller={controller => {
                                    dropdownController.current = controller
                                }}
                                direction={Platform.select({ ios: 'down' })}
                                dataSet={suggestionsList}
                                onChangeText={getSuggestions}
                                onSelectItem={(item) => itemSelected(item as any)}
                                debounce={600}
                                suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                                onClear={() => setSuggestionsList(null)}
                                loading={loading}
                                useFilter={false} // set false to prevent rerender twice
                                showChevron={true}
                                textInputProps={{
                                    placeholder: `Search${nearbyResults ? ' nearby' : ''}`,
                                    autoCorrect: false,
                                    autoCapitalize: 'none',
                                    style: {
                                        borderRadius: 25,
                                        backgroundColor: 'white',
                                        // color: '#fff',
                                        paddingLeft: 18,
                                    },
                                }}
                                RightIconComponent={
                                    <>
                                        {/* Show nearby results only */}
                                        <IconButton icon="google-nearby" iconColor={nearbyResults ? theme.colors.primary : theme.colors.backdrop} style={{ alignSelf: 'center' }} size={20} onPress={() => setNearbyResults(!nearbyResults)} />
                                    </>
                                }
                                inputContainerStyle={{ backgroundColor: 'white', borderRadius: 25 }}
                                suggestionsListContainerStyle={{ backgroundColor: 'white' }}
                                renderItem={(item, text) => {
                                    return (
                                        <View style={{ padding: 15 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }} variant="bodyLarge">{item.title}</Text>
                                            <Text style={{ color: 'grey' }} variant="bodyMedium" numberOfLines={2}>
                                                <Text style={{ fontWeight: '500' }}>{(item as any).distanceToUser}</Text>
                                                <Text>{(item as any).caption && ' - ' + (item as any).caption}</Text>
                                            </Text>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                        {/* Show my location button */}
                        <IconButton disabled={!userLocation} icon="near-me" mode="contained" style={{ alignSelf: 'center' }} size={20} onPress={() => mapRef.current.animateToRegion(userLocation)} />
                    </View>
                </View>
                {/* Bottom */}
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 20, margin: 20 }}>
                    {/* Confirm button */}
                    <Button onPress={() => navigation.navigate("PostScreen", { location: selectedItem })} style={{ justifyContent: 'center' }} mode="contained">Confirm</Button>
                </View>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    markerFixed: {
        pointerEvents: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

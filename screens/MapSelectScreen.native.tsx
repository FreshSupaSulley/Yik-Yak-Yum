import { useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Dimensions, Linking, Platform, Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { ChevronDown } from 'react-native-feather';
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import { Button, Icon, IconButton, Text, useTheme } from "react-native-paper";

const mapDelta = 0.02;

export default function MapSelectScreen({ navigation }) {
    const [region, setRegion] = useState<LatLng>(); // Current location on the map
    const [userLocation, setUserLocation] = useState<LatLng>(); // User's location. Always provided by PostScreen

    const [searchTerm, setSearchTerm] = useState<string>(''); // Search term
    const [nearbyResults, setNearbyResults] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [suggestionsList, setSuggestionsList] = useState();

    // Sets the region and updates the maps to show it
    function selectItem(item: any, animate = true) {
        if (item) {
            setRegion({ latitude: item.latitude.toFixed(5), longitude: item.longitude.toFixed(5) });
            // Smooth animate to location with deltas
            if (animate) {
                mapRef.current.animateToRegion({ latitude: item.latitude, longitude: item.longitude, latitudeDelta: mapDelta, longitudeDelta: mapDelta });
            }
        }
    };

    // Refs
    const mapRef = useRef(null);
    const searchRef = useRef(null);
    const theme = useTheme();
    const route = useRoute();

    // Route doesn't become available until rendered apparently
    useEffect(() => {
        // User location is always expected to be provided
        setUserLocation(route.params?.['userLocation']);
        // If a location was already selected use that, otherwise snap to user location
        selectItem(route.params?.['location'] ?? route.params?.['userLocation']);
    }, [route.params, nearbyResults]);

    // Update search results when nearby results is toggled
    useEffect(() => {
        getSuggestions(searchTerm);
    }, [nearbyResults]);

    // Gets map autocomplete suggestions
    const getSuggestions = useCallback((query: string) => {
        setSearchTerm(query);
        // Need at least 3 characters to search for something
        if (typeof query !== 'string' || query.length < 3) {
            setSuggestionsList(null);
            return;
        }
        const getDistance = ((lat1: number, lon1: number, lat2: number, lon2: number) => {
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
        const mapDeltaScaled = mapDelta * 10;
        const viewbox = {
            lat1: userLocation.latitude - mapDeltaScaled,
            lon1: userLocation.longitude - mapDeltaScaled,
            lat2: userLocation.latitude + mapDeltaScaled,
            lon2: userLocation.longitude + mapDeltaScaled,
        };
        // Not even entertaining the idea of paying Google a single dime
        // OG URL: https://nominatim.openstreetmap.org/search?q=McDonalds&format=json&lat=37.7749&lon=-122.4194&bounded=1&viewbox=-124.482003,32.528832,-114.131211,42.009519
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json` + (nearbyResults ? `&lat=${userLocation.latitude}&lon=${userLocation.longitude}&bounded=1&viewbox=${viewbox.lon1},${viewbox.lat1},${viewbox.lon2},${viewbox.lat2}` : ``);
        const response = fetch(url).then(async (response) => {
            const json = await response.json().catch(error => {
                console.log("Failed to parse response as JSON: ", response);
                // Assume no results
                return [];
            });
            const suggestions = json.map(value => {
                // Calculate distance to user for each location
                let distance = getDistance(value.lat, value.lon, userLocation.latitude, userLocation.longitude);
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
    }, [nearbyResults, userLocation]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Instructions */}
            <View style={{ padding: 10 }}>
                <Text style={{ textAlign: 'center' }}>Align the crosshair to the location, then hit confirm</Text>
            </View >
            <View style={{ flex: 1 }}>
                {/* Map */}
                <MapView
                    ref={mapRef}
                    rotateEnabled={false}
                    showsUserLocation
                    style={{ flex: 1 }}
                    // initialRegion={{ ...selectedItem, latitudeDelta: mapDelta, longitudeDelta: mapDelta }}
                    onRegionChangeComplete={(item) => selectItem(item, false)}>
                    {/* Show current location with a marker cause why not */}
                    {region && <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}></Marker>}
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
                                direction={Platform.select({ ios: 'down' })}
                                dataSet={suggestionsList}
                                onChangeText={getSuggestions}
                                onSelectItem={(item) => selectItem(item as any)}
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
                                        <IconButton icon="google-nearby" iconColor={nearbyResults ? theme.colors.primary : theme.colors.backdrop} style={{ alignSelf: 'center' }} size={20} onPress={() => setNearbyResults(!nearbyResults) } />
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
                    <Button onPress={() => navigation.navigate("PostScreen", { location: region })} style={{ justifyContent: 'center' }} mode="contained">Confirm</Button>
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

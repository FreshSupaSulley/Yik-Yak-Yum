import { collection, DocumentData, getDocsFromServer, query, QueryDocumentSnapshot } from 'firebase/firestore';
import { createContext, useEffect, useState } from "react";
import { LatLng } from "react-native-maps";
import { db } from '../firebase.js';
import FoodData from "./FoodData";
import * as Location from 'expo-location';
import { Linking } from 'react-native';

type FoodDataContextType = {
    foodData: any[],
    userLocation: LatLng | null,
    requestUserLocation: () => void,
    setSnackbar: (text: string) => void,
    refreshData: () => Promise<void>;
};

// Initial value of nothing
export const FoodDataContext = createContext<FoodDataContextType>(null);

// Probably should have a caching system
export const FoodDataProvider = ({ children, initialized = () => { }, failed = (error: string) => { }, onSnackbar = (message: string) => { } }) => {
    const [foodData, setFoodData] = useState(null);
    const [userLocation, setUserLocation] = useState<LatLng | null>(null);

    // Requests user location, and if we can't ask for it again, opens in the settings app
    const requestUserLocation = () => {
        Location.requestForegroundPermissionsAsync().then(async response => {
            // await new Promise(resolve => setTimeout(resolve, 1000));
            // If location services are enabled
            if (response.status === 'granted') {
                // Get location
                let { coords } = await Location.getCurrentPositionAsync();
                setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
            } else if (!response.canAskAgain) {
                // Open settings app
                Linking.openSettings();
            }
        });
    }

    const refreshData = async () => {
        console.log("Refreshing data");
        // Fill user location only if permission is already enabled
        Location.getForegroundPermissionsAsync().then(async response => {
            // await new Promise(resolve => setTimeout(resolve, 1000));
            // If location services are enabled
            if (response.status === 'granted') {
                // Get location
                let { coords } = await Location.getCurrentPositionAsync();
                setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
            }
        });
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        // Seems like this won't ever fail if offline, but will fail when rules deny the request?? How do we catch what happens when offline?
        // Never use caching, always call from server. No point in calling if we're just gonna get cached responses
        await getDocsFromServer(query(collection(db, "Posts"))).then((response) => {
            let posts = [];
            let index = 0;
            response.forEach((post) => {
                // Temp offset the date
                var date = new Date();
                date.setDate(date.getDate() - ++index);
                // Add to FoodData
                let data = post.data();
                posts.push(new FoodData(data.title, data.description, data.location, date.getTime(), data.tags));
            });
            // Update global data
            setFoodData(posts);
            // Fire when data is ready
            initialized();
        }).catch((error) => {
            // Shit can fail, for instance, when firebase rules prevent reading
            console.error("Failed to load food data", error);
            failed(error.message);
        });
    }
    useEffect(() => {
        // Fetch data when the component mounts. Children fire methods first
        refreshData();
    }, []);
    return (
        <FoodDataContext.Provider value={{ foodData, userLocation, requestUserLocation, setSnackbar: onSnackbar, refreshData }}>
            {children}
        </FoodDataContext.Provider>
    );
}

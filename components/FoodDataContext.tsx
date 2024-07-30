import { collection, getDocsFromServer, query } from 'firebase/firestore';
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
            let dbPosts = response;
            // Pretend we called the API, got the last 5 days
            const date = new Date();
            let newData = [];
            [...Array(1)].map((post, index) => {
                // API response
                let posts = [];
                // Temp offset the date
                var prevDate = new Date();
                prevDate.setDate(date.getDate() - index);

                let j = 0;
                dbPosts.forEach((snap) => {
                    let data = snap.data();
                    posts[j] = new FoodData(data.title, data.description, data.location, prevDate.getTime(), data.tags);
                    j++;
                })

                // Fill in array
                newData[index] = {
                    title: prevDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }),
                    index: index,
                    data: posts,
                };
            });
            // Update global data
            setFoodData(newData);
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

import { createContext, useEffect, useState } from "react";
import FoodData from "./FoodData";
import {getDocs, collection, query} from 'firebase/firestore'
import {db} from '../firebase.js'

type FoodDataContextType = {
    foodData: any[],
    refreshData: () => void;
};

// Initial value of nothing
export const FoodDataContext = createContext<FoodDataContextType>(null);

// Probably should have a caching system
const postQuery = query(collection(db, "Posts"));

export const FoodDataProvider = ({ children, initialized = () => {} }) => {
    const [foodData, setFoodData] = useState(null);
    const refreshData = async () => {
        // Seems like this won't ever fail. If firebase can't be reached it still returns a response?
        const dbPosts = await getDocs(postQuery).then((response) => {
            console.log(response, "yay");
            return response;
        }).catch((error) => {
            console.error(error, "aww");
        });
        // Pretend we called the API, got the last 5 days
        const date = new Date();
        let newData = [];
        [...Array(1)].map((x, i) => {
            // API response
            let posts = [];
            // Temp offset the date
            var prevDate = new Date();
            prevDate.setDate(date.getDate() - i);

            let j = 0;
            dbPosts.forEach((snap) =>{
                posts[j] = new FoodData(snap.data().location, snap.data().description, 'lat and long lol', prevDate.getTime(), snap.data().tags);
                j++;
            })
            
            // Fill in array
            newData[i] = {
                title: prevDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }),
                index: i,
                data: posts,
            };
        });
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        // Update global data
        setFoodData(newData);
        console.log("NEW DATA!!!");
    }
    useEffect(() => {
        // Fetch data when the component mounts. Children fire methods first
        refreshData().then(() => {
            initialized();
        });
    }, []);
    return (
        <FoodDataContext.Provider value={{ foodData, refreshData }}>
            {children}
        </FoodDataContext.Provider>
    );
}

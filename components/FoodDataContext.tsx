import { createContext, useEffect, useState } from "react";
import FoodData from "./FoodData";

type FoodDataContextType = {
    foodData: any[],
    refreshData: () => void;
};

// Initial value of nothing
export const FoodDataContext = createContext<FoodDataContextType>(null);

export const FoodDataProvider = ({ children, initialized = () => {} }) => {
    const [foodData, setFoodData] = useState(null);
    const refreshData = async () => {
        // Pretend we called the API, got the last 5 days
        const date = new Date();
        let newData = [];
        [...Array(1)].map((x, i) => {
            // API response
            let posts = [];
            // Temp offset the date
            var prevDate = new Date();
            prevDate.setDate(date.getDate() - i);
            for (let i = 0; i < 10; i++) {
                posts[i] = new FoodData('Buckeye Donuts', 'go to buckeye donuts and get a free donut with a student id because when you go and you get a student id they will give you af re donut because it sa special thig today and joh cena will be there and he gies every student with an a on their report card a high 5 and', 'lat and long lol', prevDate.getTime(), true, true, true);
            }
            // Fill in array
            newData[i] = {
                title: prevDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }),
                index: i,
                data: posts,
            };
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
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

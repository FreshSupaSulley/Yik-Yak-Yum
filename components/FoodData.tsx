export default class FoodData {
    location: string;
    details: string;
    coords: string;
    date: number;
    tags: Array<string>;
    
    constructor(location: string, details: string, coords: string, date: number, tags: Array<string>) {
        this.location = location;
        this.details = details;
        this.coords = coords;
        this.date = date;
        this.tags = tags;
    }
}

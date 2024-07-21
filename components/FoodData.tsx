export default class FoodData {
    location: string;
    details: string;
    coords: string;
    date: number;
    tags: Array<Tag>;

    constructor(location: string, details: string, coords: string, date: number, tags: Array<Tag>) {
        this.location = location;
        this.details = details;
        this.coords = coords;
        this.date = date;
        this.tags = tags;
    }
}

export enum Tag {
    OffCampus = "Off-Campus",
    NeedEntry = "Need Entry",
    NeedPhone = "Need Phone",
    StudentID = "Need Student ID",
}

export const TagDetails = {
    [Tag.OffCampus]: {
        name: Tag.OffCampus,
        description: "This item requires you to leave campus or use transportation",
        icon: "car",
    },
    [Tag.NeedEntry]: {
        name: Tag.NeedEntry,
        description: "Food is behind locked doors or in a private event",
        icon: "sliding-door-lock",
    },
    [Tag.NeedPhone]: {
        name: Tag.NeedPhone,
        description: "Bring your phone (fill out form, show voucher, etc.)",
        icon: "phone",
    },
    [Tag.StudentID]: {
        name: Tag.StudentID,
        description: "Requires your student ID",
        icon: "id",
    },
};

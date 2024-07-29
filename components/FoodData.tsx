export default class FoodData {
    title: string;
    details: string;
    location: string;
    date: number;
    tags: Array<Tag>;

    constructor(title: string, details: string, location: string, date: number, tags: Array<Tag>) {
        this.title = title;
        this.details = details;
        this.location = location;
        this.date = date;
        this.tags = tags;
    }
}

// If you add any more tags, you need to allow them with Firestore rules
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
        icon: "door-sliding-lock",
    },
    [Tag.NeedPhone]: {
        name: Tag.NeedPhone,
        description: "Bring your phone (fill out form, show voucher, etc.)",
        icon: "phone",
    },
    [Tag.StudentID]: {
        name: Tag.StudentID,
        description: "Requires your student ID",
        icon: "credit-card",
    },
};

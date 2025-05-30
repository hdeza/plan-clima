import { Activity } from "./activity";

export interface Itinerary {
    id: number;
    firebase_uid: string;
    city: string;
    creation_date: Date;
    predicted_temperature: number;
    state: string;
    activities: Activity[];
}
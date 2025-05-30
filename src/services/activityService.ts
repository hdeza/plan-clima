import { AuthContext } from "@/contexts/AuthProvider";
import React from "react";
import axios from "axios";
import { baseUrl } from "./itineraryService";


export const activityService = () => {
    const authContext = React.useContext(AuthContext);

    const createItinerary = async (activity: any) => {
        try {
            const token = authContext?.getToken ? await authContext.getToken() : '';
            const response = await axios.post(
                `${baseUrl}/api/activities`,
                activity,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating activity:', error);
            throw error;
        }
    }

    const updateActivity = async (activityId: number, activity: any) => {
        try {
            const token = authContext?.getToken ? await authContext.getToken() : '';
            const response = await axios.put(
                `${baseUrl}/api/activities/${activityId}`,
                activity,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating activity:', error);
            throw error;
        }
    }

    const deleteActivity = async (activityId: number) => {
        try {
            const token = authContext?.getToken ? await authContext.getToken() : '';
            const response = await axios.delete(
                `${baseUrl}/api/activities/${activityId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting activity:', error);
            throw error;
        }
    }


    return { createItinerary, updateActivity, deleteActivity };
  
}

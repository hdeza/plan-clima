/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthContext, AuthContextType } from "@/contexts/AuthProvider";
import React from "react";
import axios from "axios";
import { baseUrl } from "./itineraryService";

// Tipos para las requests y responses
interface CreateActivityRequest {
  itinerary: number;
  hour: string;
  description: string;
  state: string;
}

interface UpdateActivityRequest {
  itinerary?: number;
  hour?: string;
  description?: string;
  state?: string;
}

interface ActivityResponse {
  id: number;
  itinerary: number;
  hour: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
}

export const useActivityService = (authContext: AuthContextType | null) => {
 

  const createActivity = async (
    activity: CreateActivityRequest
  ): Promise<ActivityResponse> => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.post(
        `${baseUrl}/api/activities/`,
        activity,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  };

  const updateActivity = async (
    activityId: number,
    activity: UpdateActivityRequest
  ): Promise<ActivityResponse> => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.put(
        `${baseUrl}/api/activities/${activityId}/`,
        activity,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  };

  const deleteActivity = async (activityId: number): Promise<void> => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.delete(
        `${baseUrl}/api/activities/${activityId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  };

  // Función para crear múltiples actividades de una vez
  const createMultipleActivities = async (
    activities: CreateActivityRequest[]
  ): Promise<{
    success: ActivityResponse[];
    failed: Array<{ activity: CreateActivityRequest; error: any }>;
  }> => {
    const success: ActivityResponse[] = [];
    const failed: Array<{ activity: CreateActivityRequest; error: any }> = [];

    console.log(`🔄 Creating ${activities.length} activities...`);

    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      console.log(
        `📌 Creating activity ${i + 1}/${activities.length}:`,
        activity.description
      );

      try {
        const createdActivity = await createActivity(activity);
        success.push(createdActivity);
        console.log(
          `✅ Activity ${i + 1} created with ID:`,
          createdActivity.id
        );

        // Pequeña pausa entre requests para evitar sobrecarga
        if (i < activities.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`❌ Error creating activity ${i + 1}:`, error);
        failed.push({ activity, error });
      }
    }

    console.log(
      `🎉 Activities creation completed: ${success.length} success, ${failed.length} failed`
    );

    return { success, failed };
  };

  return {
    createActivity,
    updateActivity,
    deleteActivity,
    createMultipleActivities,
  };
};

// Exportar tipos para usar en otros archivos
export type { CreateActivityRequest, UpdateActivityRequest, ActivityResponse };

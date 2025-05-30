/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthContextType } from "@/contexts/AuthProvider";
import {
  itineraryService,
  type CreateItineraryRequest,
  type ItineraryResponse,
} from "./itineraryService";
import {
  useActivityService,
  type CreateActivityRequest,
  type ActivityResponse,
} from "./activityService";
import axios from "axios";

// Tipo para actividades sin el campo itinerary (se agregará automáticamente)
type ActivityForCreation = Omit<CreateActivityRequest, "itinerary">;

// Tipo para el resultado completo
interface CompleteItineraryResult {
  itinerary: ItineraryResponse;
  activities: ActivityResponse[];
  success: boolean;
  message: string;
  failedActivities?: Array<{ activity: CreateActivityRequest; error: any }>;
}

// Hook personalizado para el servicio completo de itinerario
export const useCompleteItineraryService = () => {
  // Call useActivityService at the top level of the hook (pass authContext later)
  // We'll call useActivityService inside saveCompleteItinerary with the correct authContext

  // Función principal para guardar itinerario completo
  const saveCompleteItinerary = async (
    authContext: AuthContextType | null,
    itineraryData: CreateItineraryRequest,
    activitiesData: ActivityForCreation[]
  ): Promise<CompleteItineraryResult> => {
    try {
      console.log("🚀 Starting to save complete itinerary...");
      console.log("📍 Itinerary data:", itineraryData);
      console.log("📋 Activities count:", activitiesData.length);

      // Paso 1: Crear el itinerario
      console.log("📝 Creating itinerary...");
      const { createItinerary } = itineraryService(authContext);
      const createdItinerary = await createItinerary(itineraryData);
      console.log("✅ Itinerary created with ID:", createdItinerary.id);

      // Paso 2: Preparar actividades con el ID del itinerario
      const activitiesWithItineraryId: CreateActivityRequest[] =
        activitiesData.map((activity) => ({
          ...activity,
          itinerary: createdItinerary.id,
        }));

      // Paso 3: Crear todas las actividades
      console.log("🔄 Creating activities...");
      const { createMultipleActivities } = useActivityService(authContext);
      const activitiesResult = await createMultipleActivities(
        activitiesWithItineraryId
      );

      const successMessage =
        activitiesResult.failed.length > 0
          ? `Itinerary saved! ${activitiesResult.success.length}/${activitiesData.length} activities created successfully.`
          : `Itinerary saved successfully with all ${activitiesResult.success.length} activities!`;

      console.log(
        `🎉 Complete! Created ${activitiesResult.success.length}/${activitiesData.length} activities`
      );

      return {
        itinerary: createdItinerary,
        activities: activitiesResult.success,
        success: true,
        message: successMessage,
        failedActivities:
          activitiesResult.failed.length > 0
            ? activitiesResult.failed
            : undefined,
      };
    } catch (error) {
      console.error("❌ Error saving complete itinerary:", error);

      // Manejo de errores específicos
      let errorMessage = "Failed to save itinerary. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error.response?.status === 403) {
          errorMessage = "You don't have permission to create itineraries.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      throw new Error(errorMessage);
    }
  };

  return { saveCompleteItinerary };
};

// Función helper para transformar actividades del componente al formato de la API
export const transformActivitiesDataForAPI = (
  activities: Array<{
    hour: string;
    description: string;
    state: string;
  }>
): ActivityForCreation[] => {
  return activities.map((activity) => ({
    hour: activity.hour,
    description: activity.description,
    state: activity.state,
  }));
};

// Exportar tipos
export type { ActivityForCreation, CompleteItineraryResult };

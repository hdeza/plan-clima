import { AuthContextType } from "@/contexts/AuthProvider";
import axios from "axios";

export const baseUrl = "http://localhost:8000";

// Tipos para las requests y responses
interface CreateItineraryRequest {
  city: string;
  predicted_temperature: number;
  state: string;
}

interface UpdateItineraryRequest {
  city?: string;
  predicted_temperature?: number;
  state?: string;
}

interface ItineraryResponse {
  id: number;
  city: string;
  predicted_temperature: number;
  state: string;
  created_at: string;
  updated_at: string;
}

export const itineraryService = (authContext: AuthContextType | null) => {
  const createItinerary = async (
    itineraryData: CreateItineraryRequest
  ): Promise<ItineraryResponse> => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.post(
        `${baseUrl}/api/itineraries/`,
        itineraryData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating itinerary:", error);
      throw error;
    }
  };

  const getItineraries = async (): Promise<ItineraryResponse[]> => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.get(`${baseUrl}/api/itineraries/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      throw error;
    }
  };

  const getItineraryById = async (
    itineraryId: number
  ): Promise<ItineraryResponse> => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.get(
        `${baseUrl}/api/itineraries/${itineraryId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      throw error;
    }
  };

  const updateItinerary = async (
    itineraryId: number,
    itineraryData: UpdateItineraryRequest
  ): Promise<ItineraryResponse> => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.put(
        `${baseUrl}/api/itineraries/${itineraryId}/`,
        itineraryData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating itinerary:", error);
      throw error;
    }
  };

  const deleteItinerary = async (itineraryId: number): Promise<void> => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.delete(
        `${baseUrl}/api/itineraries/${itineraryId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      throw error;
    }
  };

  return {
    createItinerary,
    getItineraries,
    getItineraryById,
    updateItinerary,
    deleteItinerary,
  };
};

// Función helper para transformar datos del componente al formato de la API
export const transformItineraryDataForAPI = (
  city: string,
  predictedTemperature: number,
  state: string = "planificado"
): CreateItineraryRequest => {
  return {
    city,
    predicted_temperature: predictedTemperature,
    state,
  };
};

// Exportar tipos para usar en otros archivos
export type {
  CreateItineraryRequest,
  UpdateItineraryRequest,
  ItineraryResponse,
};

import { AuthContextType } from "@/contexts/AuthProvider";
import axios from "axios";

export const baseUrl = "http://localhost:8000";

export const itineraryService = (authContext: AuthContextType | null) => {
  const createItinerary = async (itineraryData: any) => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.post(
        `${baseUrl}/api/itineraries`,
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

  const getItineraries = async () => {
    try {
      const token = authContext?.getToken ? await authContext.getToken() : "";
      const response = await axios.get(`${baseUrl}/api/itineraries`, {
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

  return { createItinerary, getItineraries };
};

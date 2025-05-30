// lib/api.ts - Fixed version

// Remove the React import and AuthContext usage from this file
// import React from "react"; // Remove this
// import { AuthContext } from "@/contexts/AuthProvider"; // Remove this

// Keep all your existing interfaces...
export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface ClimaFormatter {
  tavg: number;
  tmin: number;
  tmax: number;
  prcp: number;
  wdir: number;
  wspd: number;
  pres: number;
  latitude: number;
  longitude: number;
}

export interface TemperaturePredictionResponse {
  temperatura_predicha: number;
}

export interface Activity {
  hour: string;
  description: string;
  state: string;
}

export interface ItineraryData {
  city: string;
  predicted_temperature: number;
  state: string;
}

export interface GeminiItineraryResponse {
  itinerary: ItineraryData;
  activities: Activity[];
}

export interface ItineraryRequest {
  city: string;
  temperature: number;
  days: number;
}

export interface WeatherResponse {
  data: Array<{
    tavg: number;
    tmin: number;
    tmax: number;
    prcp: number;
    wdir: number;
    wspd: number;
    pres: number;
  }>;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface CityResult {
  name: string;
  lat: number;
  lng: number;
  display_name: string;
}

// Configuration
const WEATHER_CONFIG = {
  API_URL: "https://meteostat.p.rapidapi.com/point/daily",
  API_KEY: "b1932eaad6msh4b2d6ba5ad36701p1dd6ccjsn90affbdb3cc4",
  API_HOST: "meteostat.p.rapidapi.com",
};

// Generic request function
const makeRequest = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.detail ||
          `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
};

// Validation function (unchanged)
export const validateTripData = (
  city: string,
  coordinates: Coordenadas,
  days: number
): ValidationResult => {
  if (!city || city.trim().length === 0) {
    return {
      isValid: false,
      error: "Please select a valid city",
    };
  }

  if (
    !coordinates ||
    typeof coordinates.lat !== "number" ||
    typeof coordinates.lng !== "number" ||
    coordinates.lat === 0 ||
    coordinates.lng === 0
  ) {
    return {
      isValid: false,
      error: "Invalid coordinates. Please select a city from the suggestions.",
    };
  }

  if (coordinates.lat < -90 || coordinates.lat > 90) {
    return {
      isValid: false,
      error: "Invalid latitude. Please select a valid location.",
    };
  }

  if (coordinates.lng < -180 || coordinates.lng > 180) {
    return {
      isValid: false,
      error: "Invalid longitude. Please select a valid location.",
    };
  }

  if (!days || typeof days !== "number" || days <= 0) {
    return {
      isValid: false,
      error: "Please select a valid number of days (1-4)",
    };
  }

  if (days < 1 || days > 4) {
    return {
      isValid: false,
      error: "Number of days must be between 1 and 4",
    };
  }

  return {
    isValid: true,
  };
};

// Weather function (unchanged)
export const getWeatherData = async (
  coordenada: Coordenadas,
  dateT: string
): Promise<WeatherResponse> => {
  const url = new URL(WEATHER_CONFIG.API_URL);
  url.searchParams.set("lat", coordenada.lat.toString());
  url.searchParams.set("lon", coordenada.lng.toString());
  url.searchParams.set("start", dateT);
  url.searchParams.set("end", dateT);

  const headers = {
    "x-rapidapi-key": WEATHER_CONFIG.API_KEY,
    "x-rapidapi-host": WEATHER_CONFIG.API_HOST,
    "Content-Type": "application/json",
  };

  try {
    const response = await makeRequest<WeatherResponse>(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No weather data available");
    }

    const weatherInfo = response.data[0];
    const formattedData: WeatherResponse = {
      data: [
        {
          tavg: Number(weatherInfo.tavg?.toFixed(1) || "25.5"),
          tmin: Number(weatherInfo.tmin?.toFixed(1) || "20.0"),
          tmax: Number(weatherInfo.tmax?.toFixed(1) || "30.0"),
          prcp: Number(weatherInfo.prcp?.toFixed(1) || "0.0"),
          wdir: Number(weatherInfo.wdir?.toFixed(0) || "180"),
          wspd: Number(weatherInfo.wspd?.toFixed(1) || "10.5"),
          pres: Number(weatherInfo.pres?.toFixed(1) || "1013.2"),
        },
      ],
    };

    console.log("Weather data received and formatted:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      data: [
        {
          tavg: 25.5,
          tmin: 20.0,
          tmax: 30.0,
          prcp: 0.0,
          wdir: 180,
          wspd: 10.5,
          pres: 1013.2,
        },
      ],
    };
  }
};

// FIXED: Temperature prediction function now accepts token as parameter
export const predictTemperature = async (
  data: ClimaFormatter,
  token?: string // Add token as parameter
): Promise<TemperaturePredictionResponse> => {
  const url = "http://localhost:8000/api/predict/";

  const requestBody = {
    tavg: Number(data.tavg.toFixed(1)),
    tmin: Number(data.tmin.toFixed(1)),
    tmax: Number(data.tmax.toFixed(1)),
    prcp: Number(data.prcp.toFixed(1)),
    wdir: Number(data.wdir.toFixed(0)),
    wspd: Number(data.wspd.toFixed(1)),
    pres: Number(data.pres.toFixed(1)),
    latitude: Number(data.latitude.toFixed(4)),
    longitude: Number(data.longitude.toFixed(4)),
  };

  console.log(
    "Sending temperature prediction request with formatted data:",
    requestBody
  );

  const response = await makeRequest<TemperaturePredictionResponse>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(requestBody),
  });

  response.temperatura_predicha =
    Math.round(response.temperatura_predicha * 10) / 10;

  return response;
};

// FIXED: Itinerary generation function now accepts token as parameter
export const generateItinerary = async (
  request: ItineraryRequest,
  token?: string // Add token as parameter
): Promise<GeminiItineraryResponse> => {
  const url = "http://localhost:8000/gemini/ai/itinerary/";

  const requestBody = {
    city: request.city,
    temperature: request.temperature,
    days: request.days,
  };

  console.log("Sending itinerary generation request:", requestBody);

  return makeRequest<GeminiItineraryResponse>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(requestBody),
  });
};

// City search function (unchanged)
export const searchCities = async (query: string): Promise<CityResult[]> => {
  if (query.length <= 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=5&addressdetails=1`;

    const response = await fetch(url);
    const data = await response.json();

    const suggestions = data
      .map((item: any) => ({
        name: item.display_name.split(",")[0],
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }))
      .filter(
        (item: CityResult, index: number, self: CityResult[]) =>
          index ===
          self.findIndex((t) => t.lat === item.lat && t.lng === item.lng)
      )
      .map((item: CityResult) => {
        const parts = item.display_name.split(",");
        return {
          ...item,
          display_name: `${parts[0]}, ${parts[parts.length - 1].trim()}`,
        };
      });

    return suggestions;
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
};

// FIXED: Complete trip processing function now accepts token as parameter
export const processCompleteTrip = async (
  city: string,
  coordinates: Coordenadas,
  days: number,
  token?: string // Add token as parameter
): Promise<{
  weatherData: WeatherResponse;
  predictedTemperature: number;
  itineraryResponse: GeminiItineraryResponse;
}> => {
  try {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    console.log("Starting complete trip process for:", {
      city,
      coordinates,
      days,
    });

    const weatherData = await getWeatherData(coordinates, formattedDate);

    const weatherInfo = weatherData.data[0];
    const climaData: ClimaFormatter = {
      tavg: weatherInfo.tavg,
      tmin: weatherInfo.tmin,
      tmax: weatherInfo.tmax,
      prcp: weatherInfo.prcp,
      wdir: weatherInfo.wdir,
      wspd: weatherInfo.wspd,
      pres: weatherInfo.pres,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };

    const temperatureResponse = await predictTemperature(climaData, token);
    const predictedTemperature = temperatureResponse.temperatura_predicha;

    const itineraryResponse = await generateItinerary({
      city: city,
      temperature: predictedTemperature,
      days: days,
    }, token);

    console.log("Complete trip process completed successfully.");

    return { weatherData, predictedTemperature, itineraryResponse };
  } catch (error) {
    console.error("Error in complete trip process:", error);
    throw error;
  }
};
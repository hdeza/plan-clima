/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api.ts

// Interfaces
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

// Configuración de APIs
const WEATHER_CONFIG = {
  API_URL: "https://meteostat.p.rapidapi.com/point/daily",
  API_KEY: "b1932eaad6msh4b2d6ba5ad36701p1dd6ccjsn90affbdb3cc4",
  API_HOST: "meteostat.p.rapidapi.com",
};

// URL base para tu backend - configúrala según tu entorno
const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// ==================== FUNCIONES DE UTILIDAD ====================

/**
 * Función genérica para hacer peticiones HTTP
 */
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

// ==================== SERVICIOS METEOROLÓGICOS ====================

/**
 * Obtiene datos meteorológicos usando Meteostat API (RapidAPI)
 * @param coordenada - Coordenadas de ubicación
 * @param dateT - Fecha en formato YYYY-MM-DD
 * @returns Promise con datos meteorológicos
 */
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

    console.log("Weather data received:", response);
    return response;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // En caso de error, devolver datos por defecto para desarrollo
    return {
      data: [
        {
          tavg: 25,
          tmin: 20,
          tmax: 30,
          prcp: 0,
          wdir: 180,
          wspd: 10,
          pres: 1013,
        },
      ],
    };
  }
};

// ==================== PREDICCIÓN DE TEMPERATURA ====================

/**
 * Predice la temperatura usando tu modelo de Machine Learning
 * @param data - Datos meteorológicos formateados
 * @returns Promise con la temperatura predicha
 */
export const predictTemperature = async (
  data: ClimaFormatter
): Promise<TemperaturePredictionResponse> => {
  const url = `${BACKEND_BASE_URL}/predict/`;

  const requestBody = {
    tavg: data.tavg,
    tmin: data.tmin,
    tmax: data.tmax,
    prcp: data.prcp,
    wdir: data.wdir,
    wspd: data.wspd,
    pres: data.pres,
    latitude: data.latitude,
    longitude: data.longitude,
  };

  console.log("Sending temperature prediction request:", requestBody);

  return makeRequest<TemperaturePredictionResponse>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
};

// ==================== GENERACIÓN DE ITINERARIO ====================

/**
 * Genera un itinerario usando Gemini AI
 * @param request - Datos para generar el itinerario
 * @returns Promise con el itinerario generado
 */
export const generateItinerary = async (
  request: ItineraryRequest
): Promise<string> => {
  const url = `${BACKEND_BASE_URL}/itinerary/`;

  const requestBody = {
    city: request.city,
    temperature: request.temperature,
    days: request.days,
  };

  console.log("Sending itinerary generation request:", requestBody);

  return makeRequest<string>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
};

// ==================== BÚSQUEDA DE CIUDADES ====================

/**
 * Interface para resultados de búsqueda de ciudades
 */
export interface CityResult {
  name: string;
  lat: number;
  lng: number;
  display_name: string;
}

/**
 * Busca ciudades usando Nominatim API (OpenStreetMap)
 * @param query - Término de búsqueda
 * @returns Promise con array de ciudades encontradas
 */
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

// ==================== FUNCIÓN COMPLETA DE PROCESAMIENTO ====================

/**
 * Procesa todo el flujo: obtiene clima, predice temperatura y genera itinerario
 * @param city - Nombre de la ciudad
 * @param coordinates - Coordenadas de la ciudad
 * @param days - Número de días del viaje
 * @returns Promise con todos los datos procesados
 */
export const processCompleteTrip = async (
  city: string,
  coordinates: Coordenadas,
  days: number
): Promise<{
  weatherData: WeatherResponse;
  predictedTemperature: number;
  itinerary: string;
}> => {
  try {
    // 1. Obtener fecha actual
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    console.log("Starting complete trip process for:", {
      city,
      coordinates,
      days,
    });

    // 2. Obtener datos meteorológicos
    const weatherData = await getWeatherData(coordinates, formattedDate);

    if (!weatherData.data || weatherData.data.length === 0) {
      throw new Error("No weather data available");
    }

    const weatherInfo = weatherData.data[0];

    // 3. Preparar datos para predicción de temperatura
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

    // 4. Predecir temperatura
    const temperatureResponse = await predictTemperature(climaData);
    const predictedTemperature =
      Math.round(temperatureResponse.temperatura_predicha * 10) / 10;

    // 5. Generar itinerario
    const itineraryRequest: ItineraryRequest = {
      city,
      temperature: predictedTemperature,
      days,
    };

    const itinerary = await generateItinerary(itineraryRequest);

    console.log("Complete trip process finished successfully");

    return {
      weatherData,
      predictedTemperature,
      itinerary,
    };
  } catch (error) {
    console.error("Error in complete trip process:", error);
    throw error;
  }
};

// ==================== FUNCIONES DE VALIDACIÓN ====================

/**
 * Valida que las coordenadas sean válidas
 */
export const validateCoordinates = (coordinates: Coordenadas): boolean => {
  return (
    coordinates.lat !== 0 &&
    coordinates.lng !== 0 &&
    !isNaN(coordinates.lat) &&
    !isNaN(coordinates.lng) &&
    coordinates.lat >= -90 &&
    coordinates.lat <= 90 &&
    coordinates.lng >= -180 &&
    coordinates.lng <= 180
  );
};

/**
 * Valida los datos de entrada para crear un viaje
 */
export const validateTripData = (
  city: string,
  coordinates: Coordenadas,
  days: number
): { isValid: boolean; error?: string } => {
  if (!city.trim()) {
    return { isValid: false, error: "City name is required" };
  }

  if (!validateCoordinates(coordinates)) {
    return { isValid: false, error: "Invalid coordinates" };
  }

  if (!days || days < 1 || days > 10) {
    return { isValid: false, error: "Days must be between 1 and 10" };
  }

  return { isValid: true };
};

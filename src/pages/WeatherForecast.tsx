/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback } from "react";
import { debounce } from "lodash";
import Header from "@/layouts/Header";
import {
  searchCities,
  validateTripData,
  type CityResult,
  type Coordenadas,
  generateItinerary,
  predictTemperature,
  type ClimaFormatter,
  getWeatherData,
} from "@/lib/api";

// Interfaces locales para el componente
interface ItineraryInfo {
  city: string;
  temperature: number;
  days: number;
}

interface Activities {
  description: string;
  status: string;
  day: number;
  itinerary: string;
}

interface ItineraryToSave {
  city: string;
  date: Date;
  days: number;
  status: string;
  preditedTemperature: number;
  activities: Activities[];
  user: string;
}

// Weather Component - Soft Pastel Design
const WeatherComponent: React.FC<{ dataInfo: ItineraryInfo }> = ({
  dataInfo,
}) => (
  <div className="p-6 mb-8 border border-blue-200 shadow-2xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-green-100">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="mb-2 text-2xl font-bold text-blue-900">
          Weather in {dataInfo.city}
        </h3>
        <p className="mb-1 text-4xl font-bold text-blue-700">
          {dataInfo.temperature}°C
        </p>
        <p className="text-base text-blue-600 opacity-80">
          Perfect for exploring!
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-medium text-blue-800">Duration</p>
        <p className="text-2xl font-bold text-blue-700">{dataInfo.days} Days</p>
      </div>
    </div>
  </div>
);

// Itinerary Component - Soft Pastel Travel Design
const ItineraryComponent: React.FC<{ dataItinerary: string }> = ({
  dataItinerary,
}) => {
  // Split the itinerary into days
  const days = dataItinerary
    .split("\n\n")
    .filter((day) => day.trim().toLowerCase().startsWith("day"));

  return (
    <div className="p-6 mt-6 border border-blue-100 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-extrabold text-blue-900">
          Your Adventure Awaits
        </h3>
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="text-sm font-medium text-blue-500">
            Travel Itinerary
          </span>
        </div>
      </div>

      <div className="space-y-10">
        {days.map((day, index) => {
          const [title, ...content] = day.split("\n");
          const dayNumber = title.match(/\d+/)?.[0] || (index + 1).toString();
          return (
            <div
              key={index}
              className="relative overflow-hidden transition-all duration-300 border border-blue-100 shadow-lg rounded-xl bg-gradient-to-br from-blue-50 via-white to-green-50 hover:shadow-2xl"
            >
              {/* Day Header */}
              <div className="flex items-center p-6 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200">
                <div className="flex items-center justify-center w-10 h-10 mr-4 text-xl font-bold text-white bg-blue-400 rounded-full shadow bg-opacity-80">
                  {dayNumber}
                </div>
                <h4 className="text-xl font-bold text-blue-900">{title}</h4>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {content.map((paragraph, pIndex) => (
                  <div key={pIndex} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <p className="leading-relaxed text-gray-700">{paragraph}</p>
                  </div>
                ))}
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-10 -translate-y-10">
                <div className="w-full h-full bg-blue-200 rounded-full opacity-10"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with Travel Tips */}
      <div className="p-6 mt-10 border border-blue-100 bg-blue-50 rounded-xl">
        <div className="flex items-center mb-4 space-x-3">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h4 className="text-lg font-semibold text-blue-900">Travel Tips</h4>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <li className="flex items-center space-x-2 text-blue-700">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Pack comfortable walking shoes</span>
          </li>
          <li className="flex items-center space-x-2 text-blue-700">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Bring a reusable water bottle</span>
          </li>
          <li className="flex items-center space-x-2 text-blue-700">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Don't forget your camera</span>
          </li>
          <li className="flex items-center space-x-2 text-blue-700">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Check local weather forecast</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const MainPredictionComponent: React.FC = () => {
  // State variables
  const [city, setCity] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [dataItinerary, setDataItinerary] = useState<string>("");
  const [showData, setShowData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Refs
  const dataSectionRef = useRef<HTMLDivElement>(null);

  // Constants
  const backGroundUrl = "src/assets/travel.jpg";

  const [coordinateCitySelected, setCoordinateCitySelected] =
    useState<Coordenadas>({
      lat: 0,
      lng: 0,
    });

  const [dataInfo, setDataInfo] = useState<ItineraryInfo>({
    city: "",
    temperature: 0,
    days: 2,
  });

  // ==================== SEARCH FUNCTIONS ====================

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      try {
        const results = await searchCities(query);
        setSuggestions(results);
      } catch (error) {
        console.error("Error searching cities:", error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  // ==================== EVENT HANDLERS ====================

  const onCityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setCity(query);
    setError(""); // Clear any previous errors
    debouncedSearch(query);
  };

  const selectCity = (suggestion: CityResult) => {
    setCity(suggestion.display_name);
    setCoordinateCitySelected({
      lat: suggestion.lat,
      lng: suggestion.lng,
    });
    setDataInfo((prev) => ({
      ...prev,
      city: suggestion.name,
    }));
    setSuggestions([]);
    setError(""); // Clear any previous errors
  };

  const onChangeDays = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const days = parseInt(event.target.value);
    if (!isNaN(days)) {
      setShowData(false);
      setDataInfo((prev) => ({ ...prev, days }));
      setError(""); // Clear any previous errors
    }
  };

  // ==================== MAIN TRIP CREATION FUNCTION ====================

  const createTrip = async (): Promise<void> => {
    // Validate input data
    const validation = validateTripData(
      city,
      coordinateCitySelected,
      dataInfo.days
    );
    if (!validation.isValid) {
      setError(validation.error || "Invalid input data");
      alert(validation.error || "Please check your input data");
      return;
    }

    setLoading(true);
    setShowData(false);
    setError("");

    try {
      console.log("Starting trip creation with:", {
        city: dataInfo.city,
        coordinates: coordinateCitySelected,
        days: dataInfo.days,
      });

      // Get current date in YYYY-MM-DD format
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

      // First, get the weather data from Meteostat
      const weatherData = await getWeatherData(
        coordinateCitySelected,
        formattedDate
      );
      const weatherInfo = weatherData.data[0];

      // Prepare data for temperature prediction
      const climaData: ClimaFormatter = {
        tavg: weatherInfo.tavg,
        tmin: weatherInfo.tmin,
        tmax: weatherInfo.tmax,
        prcp: weatherInfo.prcp,
        wdir: weatherInfo.wdir,
        wspd: weatherInfo.wspd,
        pres: weatherInfo.pres,
        latitude: coordinateCitySelected.lat,
        longitude: coordinateCitySelected.lng,
      };

      // Get temperature prediction
      const temperatureResponse = await predictTemperature(climaData);
      const predictedTemperature = temperatureResponse.temperatura_predicha;

      // Update the temperature in the state
      setDataInfo((prev) => ({
        ...prev,
        temperature: predictedTemperature,
      }));

      // Generate itinerary with the predicted temperature
      const itinerary = await generateItinerary({
        city: dataInfo.city,
        temperature: predictedTemperature,
        days: dataInfo.days,
      });

      setDataItinerary(itinerary);
      setLoading(false);
      setShowData(true);

      // Scroll to results
      setTimeout(() => {
        dataSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      console.log("Trip creation completed successfully");
    } catch (error) {
      console.error("Error creating trip:", error);
      setLoading(false);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);

      // Show user-friendly error messages
      let userMessage = "Error creating trip. Please try again.";

      if (errorMessage.includes("weather")) {
        userMessage = "Unable to fetch weather data. Please try again later.";
      } else if (errorMessage.includes("temperatura")) {
        userMessage = "Unable to predict temperature. Please try again.";
      } else if (errorMessage.includes("itinerary")) {
        userMessage = "Unable to generate itinerary. Please try again.";
      } else if (errorMessage.includes("coordinates")) {
        userMessage = "Invalid location selected. Please choose another city.";
      }

      alert(userMessage);
    }
  };

  // ==================== LOADING STATE HELPER ====================

  const getLoadingMessage = (): string => {
    if (!loading) return "";

    // You could make this more sophisticated by tracking which step is currently executing
    return "Creating your perfect trip...";
  };

  // ==================== RENDER ====================

  return (
    <>
      <Header />
      <main className="relative w-full min-h-screen">
        {loading && (
          <div className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-screen h-screen bg-black bg-opacity-50">
            <div className="w-16 h-16 mb-4 border-8 border-white rounded-full border-opacity-30 border-t-white animate-spin"></div>
            <p className="text-lg font-medium text-white">
              {getLoadingMessage()}
            </p>
            <p className="mt-2 text-sm text-white opacity-75">
              This may take a few moments...
            </p>
          </div>
        )}

        <img
          src={backGroundUrl}
          alt="Travel background"
          className="absolute object-cover w-full h-full saturate-150 brightness-50"
        />

        <article className="absolute inset-0 flex flex-col items-center justify-center px-4 space-y-6 text-center text-white">
          <div>
            <h2 className="mb-4 text-4xl font-black lg:text-6xl">
              Discover Your Perfect Trip
            </h2>
            <p className="font-light lg:text-lg">
              Get personalized travel recommendations based on AI-powered
              weather predictions
            </p>
          </div>

          {error && (
            <div className="max-w-md p-4 mx-auto bg-red-500 rounded-lg bg-opacity-90">
              <p className="text-sm text-white">{error}</p>
            </div>
          )}

          <div className="relative w-56 md:w-64 lg:w-96">
            <input
              type="text"
              onChange={onCityInput}
              value={city}
              placeholder="Search for a city..."
              className="w-full py-2 text-center text-white placeholder-white transition-colors bg-transparent border-b-2 border-white hover:border-orange-500 lg:text-lg focus:outline-none focus:border-orange-500"
              disabled={loading}
            />
            {suggestions.length > 0 && !loading && (
              <ul className="absolute left-0 right-0 z-10 overflow-y-auto text-black bg-white rounded-md shadow-lg top-full max-h-48">
                {suggestions.map((suggestion) => (
                  <li
                    key={`${suggestion.lat}_${suggestion.lng}_${suggestion.display_name}`}
                    onClick={() => selectCity(suggestion)}
                    className="p-3 text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-sm text-gray-600">
                      {suggestion.display_name}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <select
            onChange={onChangeDays}
            value={dataInfo.days}
            className="w-56 py-2 text-center text-white transition-colors bg-transparent border-b-2 border-white hover:border-orange-500 md:w-64 lg:w-96 lg:text-lg focus:outline-none focus:border-orange-500"
            disabled={loading}
          >
            <option className="text-sm bg-gray-800" value="">
              Select number of days
            </option>
            <option className="text-sm bg-gray-800" value="1">
              1 Day
            </option>
            <option className="text-sm bg-gray-800" value="2">
              2 Days
            </option>
            <option className="text-sm bg-gray-800" value="3">
              3 Days
            </option>
            <option className="text-sm bg-gray-800" value="4">
              4 Days
            </option>
          </select>

          <button
            onClick={createTrip}
            disabled={!city || !dataInfo.days || loading}
            className="flex items-center justify-center p-3 space-x-3 font-bold text-white transition-all duration-300 transform bg-gray-400 rounded-full shadow-xl bg-opacity-45 hover:bg-orange-500 hover:shadow-2xl lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            <span>{loading ? "Creating Trip..." : "Create Trip"}</span>
            <div className="flex items-center justify-center p-2 bg-white rounded-full">
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-400 rounded-full border-t-orange-500 animate-spin"></div>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              )}
            </div>
          </button>

          {/* Info about the process */}
          <div className="max-w-md text-xs opacity-75">
            <p>
              We use AI to predict weather conditions and create personalized
              itineraries
            </p>
          </div>
        </article>
      </main>

      {showData && (
        <div ref={dataSectionRef} className="min-h-screen p-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <WeatherComponent dataInfo={dataInfo} />
            <ItineraryComponent dataItinerary={dataItinerary} />
          </div>
        </div>
      )}
    </>
  );
};

export default MainPredictionComponent;

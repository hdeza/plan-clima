/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback } from "react";
import { debounce } from "lodash";
import Header from "@/layouts/Header";
import {
  searchCities,
  processCompleteTrip,
  validateTripData,
  type CityResult,
  type Coordenadas,
} from "@/lib/api";

// Interfaces locales para el componente
interface ItineraryInfo {
  city: string;
  temperature: number;
  days: number;
}

// Weather Component - Mock
const WeatherComponent: React.FC<{ dataInfo: ItineraryInfo }> = ({
  dataInfo,
}) => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h3 className="mb-2 text-xl font-bold">Weather for {dataInfo.city}</h3>
    <p>Predicted Temperature: {dataInfo.temperature}°C</p>
    <p>Duration: {dataInfo.days} days</p>
  </div>
);

// Itinerary Component - Mock
const ItineraryComponent: React.FC<{ dataItinerary: string }> = ({
  dataItinerary,
}) => (
  <div className="p-4 mt-4 bg-white rounded-lg shadow-md">
    <h3 className="mb-2 text-xl font-bold">Your Itinerary</h3>
    <div className="leading-relaxed text-gray-700 whitespace-pre-wrap">
      {dataItinerary}
    </div>
  </div>
);

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

      // Use the complete processing function from lib/api.ts
      const result = await processCompleteTrip(
        dataInfo.city,
        coordinateCitySelected,
        dataInfo.days
      );

      // Update component state with results
      setDataInfo((prev) => ({
        ...prev,
        temperature: result.predictedTemperature,
      }));

      setDataItinerary(result.itinerary);
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

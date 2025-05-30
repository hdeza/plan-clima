/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback, useContext } from "react";
import { debounce } from "lodash";
import Header from "@/layouts/Header";
import { AuthContext, AuthContextType } from "@/contexts/AuthProvider"; // Import AuthContext here
import {
  searchCities,
  validateTripData,
  type CityResult,
  type Coordenadas,
  generateItinerary,
  predictTemperature,
  type ClimaFormatter,
  getWeatherData,
  type GeminiItineraryResponse,
} from "@/lib/api";
import { CreateItineraryRequest, transformItineraryDataForAPI } from "@/services/itineraryService";
import { ActivityForCreation, transformActivitiesDataForAPI, useCompleteItineraryService } from "@/services/completeItineraryService";

// Interfaces locales para el componente
interface ItineraryInfo {
  city: string;
  temperature: number;
  days: number;
}

// Weather Component - Enhanced Design
const WeatherComponent: React.FC<{ dataInfo: ItineraryInfo }> = ({
  dataInfo,
}) => (
  <div className="relative p-8 mb-8 overflow-hidden border border-blue-200 shadow-2xl rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    {/* Decorative background elements */}
    <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 bg-blue-200 rounded-full opacity-20"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 transform -translate-x-12 translate-y-12 bg-purple-200 rounded-full opacity-20"></div>

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-400 rounded-full bg-opacity-20">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.4 4.4 0 003 15z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-900">
              Weather Forecast
            </h3>
            <p className="text-lg text-blue-700 opacity-80">{dataInfo.city}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {dataInfo.temperature}°C
          </div>
          <p className="text-sm font-medium text-blue-600 opacity-70">
            Perfect for exploring!
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white bg-opacity-50 rounded-2xl backdrop-blur-sm">
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-800">Duration</p>
          <p className="text-2xl font-bold text-blue-700">
            {dataInfo.days} Days
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-800">Status</p>
          <p className="text-2xl font-bold text-green-600">Ready</p>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Itinerary Component with Save Button
const ItineraryComponent: React.FC<{
  dataItinerary: GeminiItineraryResponse;
  onSaveItinerary: () => void;
}> = ({ dataItinerary, onSaveItinerary }) => {
  const { itinerary, activities } = dataItinerary;
  const [savedMessage, setSavedMessage] = useState<string>("");

  const handleSaveClick = () => {
    onSaveItinerary();
    setSavedMessage("Itinerary saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  // Group activities by day (assuming 3-4 activities per day)
  const activitiesPerDay = Math.ceil(
    activities.length / (itinerary.predicted_temperature > 25 ? 3 : 4)
  );
  const groupedActivities = [];
  for (let i = 0; i < activities.length; i += activitiesPerDay) {
    groupedActivities.push(activities.slice(i, i + activitiesPerDay));
  }

  return (
    <div className="p-8 mt-8 border border-blue-100 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Your Adventure Awaits
          </h3>
          <p className="text-xl text-blue-700 opacity-80">
            Exploring {itinerary.city}
          </p>
        </div>

        <div className="flex flex-col items-end space-y-3">
          <button
            onClick={handleSaveClick}
            className="flex items-center px-6 py-3 space-x-2 text-white transition-all duration-300 transform bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            <span className="font-semibold">Save Itinerary</span>
          </button>

          {savedMessage && (
            <div className="px-4 py-2 text-sm text-green-800 bg-green-100 rounded-lg animate-fade-in">
              {savedMessage}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                itinerary.state === "planificado"
                  ? "bg-blue-400"
                  : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm font-medium text-blue-600 capitalize">
              {itinerary.state}
            </span>
          </div>
        </div>
      </div>

      {/* Activities grouped by days */}
      <div className="space-y-8">
        {groupedActivities.map((dayActivities, dayIndex) => (
          <div key={dayIndex} className="relative">
            <div className="sticky z-20 flex items-center mb-6 space-x-4 top-4">
              <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
                {dayIndex + 1}
              </div>
              <h4 className="text-2xl font-bold text-blue-900">
                Day {dayIndex + 1}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-transparent"></div>
            </div>

            <div className="ml-6 space-y-6">
              {dayActivities.map((activity, activityIndex) => (
                <div
                  key={`day-${dayIndex}-activity-${activityIndex}`}
                  className="relative pl-8 group"
                >
                  {/* Timeline connector */}
                  <div className="absolute left-0 w-4 h-4 transition-colors duration-300 transform -translate-x-2 bg-blue-400 border-4 border-white rounded-full shadow-lg top-6 group-hover:bg-purple-500"></div>
                  {activityIndex < dayActivities.length - 1 && (
                    <div className="absolute left-0 w-px h-full transform -translate-x-px bg-blue-200 top-10"></div>
                  )}

                  <div className="p-6 transition-all duration-300 border border-blue-100 shadow-lg rounded-2xl bg-gradient-to-br from-white via-blue-25 to-purple-25 hover:shadow-xl hover:scale-102">
                    {/* Activity Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                          {activity.hour.substring(0, 5)}
                        </div>
                        <div
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            activity.state === "pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : activity.state === "realizada"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {activity.state}
                        </div>
                      </div>
                    </div>

                    {/* Activity Content */}
                    <div className="space-y-3">
                      <p className="leading-relaxed text-gray-700">
                        {activity.description}
                      </p>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-10"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Travel Tips */}
      <div className="p-8 mt-12 border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
        <div className="flex items-center mb-6 space-x-3">
          <div className="p-2 bg-blue-400 rounded-lg bg-opacity-20">
            <svg
              className="w-6 h-6 text-blue-600"
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
          </div>
          <h4 className="text-2xl font-bold text-blue-900">Travel Tips</h4>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { icon: "👟", tip: "Pack comfortable walking shoes" },
            { icon: "💧", tip: "Bring a reusable water bottle" },
            { icon: "📸", tip: "Don't forget your camera" },
            { icon: "🌤️", tip: "Check local weather forecast" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 space-x-3 transition-colors duration-200 bg-white rounded-xl hover:bg-blue-50"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-blue-700">{item.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MainPredictionComponent: React.FC = () => {
  // FIXED: Get AuthContext at the component level (where hooks are allowed)
  const authContext = useContext(AuthContext);
  const { saveCompleteItinerary } = useCompleteItineraryService();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // State variables
  const [city, setCity] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [dataItinerary, setDataItinerary] =
    useState<GeminiItineraryResponse | null>(null);
  const [showData, setShowData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState<string>("");

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
    [setSuggestions]
  );

  // ==================== EVENT HANDLERS ====================

  const onCityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setCity(query);
    setError("");
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
    setError("");
  };

  const onChangeDays = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const days = parseInt(event.target.value);
    if (!isNaN(days)) {
      setShowData(false);
      setDataInfo((prev) => ({ ...prev, days }));
      setError("");
    }
  };

  // ==================== SAVE ITINERARY FUNCTION ====================

 const handleSaveItinerary = async () => {
    if (!dataItinerary) return;

    setIsSaving(true);

    try {
      console.log("🚀 Starting to save itinerary to backend...");

      // Transformar datos del itinerario para la API
      const itineraryForAPI = transformItineraryDataForAPI(
        dataItinerary.itinerary.city,
        dataItinerary.itinerary.predicted_temperature,
        dataItinerary.itinerary.state
      );

      // Transformar actividades para la API
      const activitiesForAPI = transformActivitiesDataForAPI(
        dataItinerary.activities.map((activity) => ({
          hour: activity.hour,
          description: activity.description,
          state: activity.state,
        }))
      );

      console.log("📝 Data prepared for API:");
      console.log("Itinerary:", itineraryForAPI);
      console.log("Activities:", activitiesForAPI);

      // Guardar itinerario completo (itinerario + actividades)
      const result = await saveCompleteItinerary(
        authContext,
        itineraryForAPI,
        activitiesForAPI
      );

      console.log("✅ Save completed successfully:", result);

      // Mostrar mensaje de éxito con detalles
      let alertMessage = `🎉 ${result.message}\n\nItinerary ID: ${result.itinerary.id}\nActivities saved: ${result.activities.length}`;

      if (result.failedActivities && result.failedActivities.length > 0) {
        alertMessage += `\nFailed activities: ${result.failedActivities.length}`;
      }

      alert(alertMessage);
    } catch (error) {
      console.error("❌ Error saving itinerary:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to save itinerary";
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }

    // Log separated data for debugging (mantener el logging original)
    const itineraryData = {
      city: dataItinerary.itinerary.city,
      predicted_temperature: dataItinerary.itinerary.predicted_temperature,
      state: dataItinerary.itinerary.state,
      days: dataInfo.days,
      created_at: new Date().toISOString(),
    };

    const activitiesData = dataItinerary.activities.map((activity, index) => ({
      id: `activity_${index + 1}`,
      hour: activity.hour,
      description: activity.description,
      state: activity.state,
      day:
        Math.floor(
          index / Math.ceil(dataItinerary.activities.length / dataInfo.days)
        ) + 1,
    }));

    console.log("=== FRONTEND DATA STRUCTURE (for reference) ===");
    console.log("Itinerary Data:", JSON.stringify(itineraryData, null, 2));
    console.log("Activities Data:", JSON.stringify(activitiesData, null, 2));
  };

  // ==================== MAIN TRIP CREATION FUNCTION (FIXED) ====================

  const createTrip = async (): Promise<void> => {
    const validation = validateTripData(
      city,
      coordinateCitySelected,
      dataInfo.days
    );
    if (!validation.isValid) {
      setError(validation.error || "Invalid input data");
      return;
    }

    setLoading(true);
    setShowData(false);
    setError("");

    try {
      // FIXED: Get token here where hooks are allowed
      const token = authContext ? await authContext.getToken() : undefined;

      setLoadingStep("Fetching weather data...");

      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

      const weatherData = await getWeatherData(
        coordinateCitySelected,
        formattedDate
      );
      const weatherInfo = weatherData.data[0];

      setLoadingStep("Predicting temperature...");

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

      // FIXED: Pass token to the function
      const temperatureResponse = await predictTemperature(climaData, token ?? undefined);
      const predictedTemperature = temperatureResponse.temperatura_predicha;

      setDataInfo((prev) => ({
        ...prev,
        temperature: predictedTemperature,
      }));

      setLoadingStep("Generating your personalized itinerary...");

      // FIXED: Pass token to the function
      const itinerary = await generateItinerary({
        city: dataInfo.city,
        temperature: predictedTemperature,
        days: dataInfo.days,
      }, token ?? undefined);

      setDataItinerary(itinerary);
      setLoading(false);
      setLoadingStep("");
      setShowData(true);

      setTimeout(() => {
        dataSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error("Error creating trip:", error);
      setLoading(false);
      setLoadingStep("");

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);

      // Show user-friendly error messages
      if (errorMessage.includes("weather")) {
        setError("Unable to fetch weather data. Please try again later.");
      } else if (errorMessage.includes("temperatura")) {
        setError("Unable to predict temperature. Please try again.");
      } else if (errorMessage.includes("itinerary")) {
        setError("Unable to generate itinerary. Please try again.");
      } else if (errorMessage.includes("coordinates")) {
        setError("Invalid location selected. Please choose another city.");
      } else {
        setError("Error creating trip. Please try again.");
      }
    }
  };

  // ==================== RENDER ====================

  return (
    <>
      <Header />
      <main className="relative w-full min-h-screen">
        {/* Enhanced Loading Overlay */}
        {loading && (
          <div className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-screen h-screen bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="flex flex-col items-center p-8 bg-white shadow-2xl rounded-3xl">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 rounded-full border-t-blue-600 animate-spin"></div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                Creating Your Perfect Trip
              </h3>
              <p className="text-lg font-medium text-blue-600">{loadingStep}</p>
              <p className="mt-2 text-sm text-gray-500">
                This may take a few moments...
              </p>
            </div>
          </div>
        )}

        <img
          src={backGroundUrl}
          alt="Travel background"
          className="absolute object-cover w-full h-full saturate-150 brightness-50"
        />

        <article className="absolute inset-0 flex flex-col items-center justify-center px-4 space-y-8 text-center text-white">
          <div className="max-w-4xl">
            <h1 className="mb-6 text-5xl font-black text-transparent lg:text-7xl bg-clip-text bg-gradient-to-r from-white to-blue-200">
              Discover Your Perfect Trip
            </h1>
            <p className="text-xl font-light lg:text-2xl opacity-90">
              Get personalized travel recommendations based on AI-powered
              weather predictions
            </p>
          </div>

          {error && (
            <div className="max-w-md p-6 mx-auto bg-red-500 rounded-2xl bg-opacity-90 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-white">{error}</p>
              </div>
            </div>
          )}

          <div className="relative w-full max-w-lg">
            <input
              type="text"
              onChange={onCityInput}
              value={city}
              placeholder="Search for a city..."
              className="w-full px-6 py-4 text-lg text-gray-800 placeholder-gray-500 transition-all duration-300 bg-white shadow-2xl rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:shadow-xl"
              disabled={loading}
            />
            {suggestions.length > 0 && !loading && (
              <ul className="absolute left-0 right-0 z-10 mt-2 overflow-y-auto bg-white shadow-2xl rounded-2xl top-full max-h-48">
                {suggestions.map((suggestion) => (
                  <li
                    key={`${suggestion.lat}_${suggestion.lng}_${suggestion.display_name}`}
                    onClick={() => selectCity(suggestion)}
                    className="p-4 text-left transition-colors duration-200 border-b border-gray-100 cursor-pointer hover:bg-blue-50 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <div className="font-semibold text-gray-800">
                      {suggestion.name}
                    </div>
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
            className="w-full max-w-lg px-6 py-4 text-lg text-gray-800 transition-all duration-300 bg-white shadow-2xl rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
            disabled={loading}
          >
            <option value="">Select number of days</option>
            <option value="1">1 Day Adventure</option>
            <option value="2">2 Day Journey</option>
            <option value="3">3 Day Exploration</option>
            <option value="4">4 Day Experience</option>
          </select>

          <button
            onClick={createTrip}
            disabled={!city || !dataInfo.days || loading}
            className="flex items-center justify-center px-8 py-4 space-x-4 text-xl font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <span>{loading ? "Creating Trip..." : "Create My Trip"}</span>
            <div className="flex items-center justify-center">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              )}
            </div>
          </button>

          <div className="max-w-2xl text-sm opacity-75">
            <p>
              ✨ We use advanced AI to predict weather conditions and create
              personalized itineraries tailored just for you
            </p>
          </div>
        </article>
      </main>

      {showData && dataItinerary && (
        <div
          ref={dataSectionRef}
          className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-50"
        >
          <div className="max-w-6xl mx-auto">
            <WeatherComponent dataInfo={dataInfo} />
            <ItineraryComponent
              dataItinerary={dataItinerary}
              onSaveItinerary={handleSaveItinerary}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MainPredictionComponent;



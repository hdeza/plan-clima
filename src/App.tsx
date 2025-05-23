import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WeatherForecast from "./pages/WeatherForecast";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { AuthProvider } from "./contexts/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/forecast",
    element: <WeatherForecast />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/itinerary-history",
    element: <ItineraryHistory />,
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;

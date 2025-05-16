import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WeatherForecast from "./pages/WeatherForecast";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { PasswordRecovery } from "./pages/PasswordRecovery";

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
  }, {
    path: "/password-recovery",
    element: <PasswordRecovery />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

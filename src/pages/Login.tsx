import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de inicio de sesión aquí
    navigate("/itinerary-history");
    console.log("Iniciando sesión con:", username);
  };

  return (
    <>
      <Header isInHome={false} />
      <div className="flex flex-col items-center justify-center h-svh bg-cover bg-no-repeat bg-center bg-[url('src/assets/Cartagena_login.webp')]">
        <div className="flex items-center flex-1">
          <div className="w-full max-w-lg">
            <div className="mb-4 ">
              <h2 className="font-serif text-4xl font-bold text-white">
                SIGN IN
              </h2>
            </div>

            <div className="p-8 border-2 rounded-lg shadow-lg bg-black/40 backdrop-blur-sm border-black/25">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
                <div className="grid">
                  <label htmlFor="username" className="text-white">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username here"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-sm bg-white/90"
                    required
                  />
                </div>

                <div className="grid">
                  <label htmlFor="password" className="text-white">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-sm bg-white/90"
                    required
                  />
                </div>

                <button
                  type="submit"
                  onClick={() => (window.location.href = "/")}
                  className="w-full py-2 font-medium text-white rounded-sm bg-amber-500 hover:bg-amber-600"
                >
                  Log In
                </button>

                <div className="space-y-2 text-center">
                  <a
                    href="/forgot-password"
                    className="block text-sm text-white/90 hover:text-white"
                  >
                    Have you forgotten your password?
                  </a>
                  <a
                    href="/signup"
                    className="block text-sm text-white/90 hover:text-white"
                  >
                    Sign Up?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

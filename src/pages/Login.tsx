import { AuthContext } from "@/contexts/AuthProvider";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de inicio de sesión aquí
    if (authContext && authContext.login) {
      authContext.login(email, password);
      console.log("Iniciando sesión con:", email);
    } else {
      console.error("AuthContext or login function is not available.");
    }
    navigate("/itinerary-list");
  } 


  return (
    <>
      <Header isInHome={false} />
      <div className="flex flex-col items-center justify-center h-svh bg-cover bg-no-repeat bg-center bg-[url('src/assets/Cartagena_login.webp')]">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-lg">
            <div className="mb-4 ">
              <h2 className="text-4xl font-serif font-bold text-white">SIGN IN</h2>
            </div>

            <div className="bg-black/40  backdrop-blur-sm p-8 rounded-lg border-black/25 border-2 shadow-lg">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
                <div className="grid">
                  <label htmlFor="email" className="text-white">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email here"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/90 rounded-sm"
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
                    className="bg-white/90 rounded-sm"
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-sm">
                  Log In
                </button>

                <div className="text-center space-y-2">
                  <a href="/signup" className="text-white/90 hover:text-white text-sm block">
                    Sign Up?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    
    </>
  );
};

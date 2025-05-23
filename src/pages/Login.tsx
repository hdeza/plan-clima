import { AuthContext } from "@/contexts/AuthProvider";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authContext && authContext.login) {
        await authContext.login(email, password);
        // If login is successful, the user state will be updated by onAuthStateChanged
        // and we can navigate to the home page
        navigate("/");
      } else {
        console.error("AuthContext or login function is not available.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <Header isInHome={false} />
      <div className="flex flex-col items-center justify-center h-svh bg-cover bg-no-repeat bg-center bg-[url('src/assets/Cartagena_login.jpg')]">
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
                  <label htmlFor="email" className="text-white">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email here"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-sm bg-white/90"
                    required
                  />
                </div>

                <div className="grid">
                  <label htmlFor="password" className="text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-sm bg-white/90"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute text-gray-600 -translate-y-1/2 right-2 top-1/2 hover:text-gray-800"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 font-medium text-white rounded-sm bg-amber-500 hover:bg-amber-600"
                >
                  Log In
                </button>
                <div className="space-y-2 text-center">
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

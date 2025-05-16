import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de inicio de sesión aquí
    console.log("Iniciando sesión con:", username);
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
                  <label htmlFor="username" className="text-white">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username here"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                  <a href="/password-recovery" className="text-white/90 hover:text-white text-sm block">
                    Have you forgotten your password?
                  </a>
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

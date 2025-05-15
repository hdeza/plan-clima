import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { useState } from "react";

export const SignUp = () => {
  const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de inicio de sesión aquí
    console.log("Iniciando sesión con:", username);
  }


  return (
    <>
      <Header isInHome={false} />
      <div className="flex flex-col items-center justify-center h-svh bg-cover bg-no-repeat bg-center bg-[url('src/assets/guatape.jpg')]">
        <div className="flex flex-1 items-center ">
          <div className="w-full max-w-lg">
            <div className="mb-5">
              <h2 className="text-4xl font-serif font-bold text-orange-500">REGISTER</h2>
            </div>

            <div className="bg-black/40  backdrop-blur-sm p-8 rounded-lg border-black/25 border-2 shadow-lg">
              <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-4">
                <div className="col-span-3 col-start-1">
                  <label htmlFor="username" className="text-white md-text-lg">
                    First name
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your first name here"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/90 rounded-sm w-full" 
                    required
                  />
                </div>
                <div className="col-span-3 col-start-4">
                  <label htmlFor="username" className="text-white">
                    Lastname
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your lastname here"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/90 rounded-sm w-full"
                    required
                  />
                </div>
                <div className="col-span-3 col-start-1">
                  <label htmlFor="username" className="text-white">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username here"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/90 rounded-sm w-full" 
                    required
                  />
                </div>
                <div className="col-span-3 col-start-4">
                  <label htmlFor="username" className="text-white">
                    E-mail
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your e-mail here"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/90 rounded-sm w-full"
                    required
                  />
                </div>

                <div className="col-span-3 ">
                  <label htmlFor="password" className="text-white">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/90 rounded-sm w-full"
                    required
                  />
                </div>
                <div className="col-span-3 ">
                  <label htmlFor="password" className="text-white">
                    Confirm password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/90 rounded-sm w-full"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="col-span-4 col-start-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-sm "
                >
                  Sign up
                </button>

                <div className="text-center space-y-2 col-span-6">
                  <a
                    href="/forgot-password"
                    className="text-white/90 hover:text-white text-sm block"
                  >
                    Already have an account?
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

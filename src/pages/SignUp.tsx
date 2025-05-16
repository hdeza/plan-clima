import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { FormEvent } from "react";

interface UserRegistration {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export const SignUp = () => {

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const userData: UserRegistration = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    if (userData.password !== userData.confirmPassword) {
      alert("Passwords do not match");
      return
    }

    // Lógica de registro aquí
    console.log("Registering user", userData);
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
                  <label htmlFor="firstName" className="text-white md-text-lg">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"    
                    type="text"
                    placeholder="Enter your first name here"
                    className="bg-white/90 rounded-sm w-full" 
                    required
                  />
                </div>
                <div className="col-span-3 col-start-4">
                  <label htmlFor="lastName" className="text-white">
                    Lastname
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your lastname here"
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
                    name="username"
                    type="text"
                    placeholder="Enter your username here"
                    className="bg-white/90 rounded-sm w-full" 
                    required
                  />
                </div>
                <div className="col-span-3 col-start-4">
                  <label htmlFor="email" className="text-white">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your e-mail here"
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
                    name="password"
                    placeholder="••••••••••••••"
                    className="bg-white/90 rounded-sm w-full"
                    required
                  />
                </div>
                <div className="col-span-3 ">
                  <label htmlFor="confirmPassword" className="text-white">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••••••••"
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
                    href="/login"
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

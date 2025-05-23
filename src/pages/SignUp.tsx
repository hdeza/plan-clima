import { AuthContext } from "@/contexts/AuthProvider";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { Alert } from "@mui/material";
import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastname: string;
}

export const SignUp = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const userData: UserRegistration = {
      firstName: formData.get("firstName") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    if (userData.password !== confirmPassword) {
      setAlert("Passwords do not match");
      return;
    }

    if (authContext && authContext.register) {
      try {
        await authContext.register(
          userData.email,
          userData.password,
          userData.firstName,
          userData.lastname
        );
        console.log("Registration successful");
        navigate("/login"); // Navigate to login page after successful registration
      } catch (error) {
        console.error("Registration failed:", error);
        setAlert("Registration failed. Please try again.");
      }
    } else {
      console.error("AuthContext or register function is not available.");
    }
  };

  return (
    <>
      <Header isInHome={false} />
      <div className="flex flex-col items-center justify-center h-svh bg-cover bg-no-repeat bg-center bg-[url('src/assets/guatape.jpg')]">
        <div className="flex items-center flex-1 ">
          <div className="w-full max-w-lg">
            <div className="mb-5">
              <h2 className="font-serif text-4xl font-bold text-orange-500">
                REGISTER
              </h2>
            </div>

            <div className="p-8 border-2 rounded-lg shadow-lg bg-black/40 backdrop-blur-sm border-black/25">
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
                    className="w-full rounded-sm bg-white/90"
                    required
                  />
                </div>
                <div className="col-span-3 col-start-4">
                  <label htmlFor="lastname" className="text-white">
                    Lastname
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    placeholder="Enter your lastname here"
                    className="w-full rounded-sm bg-white/90"
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username here"
                    className="w-full rounded-sm bg-white/90"
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
                    className="w-full rounded-sm bg-white/90"
                    required
                  />
                </div>

                <div className="col-span-3 ">
                  <label htmlFor="password" className="text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••••••••"
                      className="w-full pr-10 rounded-sm bg-white/90"
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
                <div className="col-span-3 ">
                  <label htmlFor="confirmPassword" className="text-white">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      className="w-full pr-10 rounded-sm bg-white/90"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute text-gray-600 -translate-y-1/2 right-2 top-1/2 hover:text-gray-800"
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full col-span-4 col-start-2 py-2 font-medium text-white rounded-sm bg-amber-500 hover:bg-amber-600 "
                >
                  Sign up
                </button>
                  

                <div className="col-span-6 space-y-2 text-center">
                  <a
                    href="/login"
                    className="block text-sm text-white/90 hover:text-white"
                  >
                    Already have an account?
                  </a>
                </div>
              </form>
              {
              alert && (
                    <Alert className="pt-3" severity={alert.includes('registered') ? 'success': 'error'} variant="outlined">{alert}</Alert>
                  )
              }
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

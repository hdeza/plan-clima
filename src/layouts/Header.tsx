import { AuthContext } from "@/contexts/AuthProvider";
import HamburguerButton from "../components/common/HamburguerButton";
import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useContext } from "react";
import { Link } from "react-router-dom";

type HeaderProps = {
  isInHome?: boolean;
};
export default function Header({ isInHome = false }: HeaderProps) {
  const authContext = useContext(AuthContext);
  const isLgUp = useMediaQuery("(min-width:1024px");
  return (
    <header
      style={{ height: "10dvh" }}
      className="absolute top-0 left-0 z-10 flex items-center justify-between w-full px-6 py-4 bg-gray-500/15"
    >
      <h1 className="text-2xl font-bold text-white font-playfair md:text-4xl">
        Clima<span className="text-primary-orange">Tour</span>
      </h1>
      {isLgUp ? (
        <motion.nav className="pr-5 text-lg font-bold">
          <ul className="flex space-x-10">
            <motion.li
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Link
                to={"/"}
                className="text-white transition-colors duration-300 hover:text-primary-orange"
              >
                Home
              </Link>
              {isInHome && <hr className="border-primary-orange" />}
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.1, color: "primary-orange" }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Link
                to={"/forecast"}
                className="text-white transition-colors duration-300 hover:text-primary-orange"
              >
                Forecast
              </Link>
              {!isInHome && <hr className="border-primary-orange" />}
            </motion.li>
            {authContext?.user ? (
              <motion.li
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Link
                  to={"/itinerary-history"}
                  className="text-white transition-colors duration-300 hover:text-primary-orange"
                >
                  Itinerary History
                </Link>
              </motion.li>
            ) : (
              <>
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <Link
                    to={"/login"}
                    className="text-white transition-colors duration-300 hover:text-primary-orange"
                  >
                    Login
                  </Link>
                </motion.li>

                <motion.li
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <Link
                    to={"/signup"}
                    className="text-white transition-colors duration-300 hover:text-primary-orange"
                  >
                    Sign Up
                  </Link>
                </motion.li>
              </>
            )}
            
          </ul>
        </motion.nav>
      ) : (
        <HamburguerButton />
      )}
    </header>
  );
}

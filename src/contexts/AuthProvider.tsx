import { ReactNode, useState, useEffect, createContext } from "react";
import { firebaseApp } from "@/firebase/credentials";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getIdToken } from "firebase/auth";
const auth = getAuth(firebaseApp);

export interface AuthContextType {
  user: any | null;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastname: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase: any) => {
      if (userFirebase) {
        const userData = {
          uid: userFirebase.uid,
          email: userFirebase.email,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("firebase_token");
      }
    });
    return () => unsubscribe();
  }, []);

  async function register(
    email: string,
    password: string,
    firstName: string,
    lastname: string
  ) {
    const firestore = getFirestore(firebaseApp);
    const userInfo = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const docRef = doc(firestore, `users/${userInfo.user.uid}`);
    await setDoc(docRef, {
      email: email,
      firstName: firstName,
      lastname: lastname,
    });
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    // El usuario se actualizará automáticamente por onAuthStateChanged
    const token = await auth.currentUser?.getIdToken();
    if (token) {
      localStorage.setItem("firebase_token", token);
    }
  }

  async function logout() {
    await signOut(auth);
    // El usuario se actualizará automáticamente por onAuthStateChanged
    console.log("Cerrando sesión");
  }

  async function getToken(): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return await getIdToken(currentUser);
    }
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

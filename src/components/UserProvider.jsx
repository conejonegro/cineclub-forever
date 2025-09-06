// src/components/UserProvider.jsx
"use client";

import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { app } from "./FirebaseSettings"; // o "@/components/FirebaseSettings"

export const UserContext = createContext({ user: undefined });

export default function UserProvider({ children }) {
  const [user, setUser] = useState(undefined); // <-- undefined = cargando

  // Dark mode (igual que antes)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkmode") === "true";
    }
    return false;
  });

  useEffect(() => {
    const auth = getAuth(app);
    // Asegura persistencia local (evita que se “olvide” tras refresh)
    setPersistence(auth, browserLocalPersistence).finally(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser ?? null); // null si no hay sesión
      });
      // Limpieza
      return () => unsubscribe();
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("darkmode", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <UserContext.Provider value={{ user, setUser, darkMode, setDarkMode }}>
      {children}
    </UserContext.Provider>
  );
}

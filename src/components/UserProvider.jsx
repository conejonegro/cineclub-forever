"use client";

import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FirebaseSettings"; // asegúrate de importar correctamente

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Dark mode (sin cambios)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkmode") === "true";
    }
    return false;
  });

  // Escuchar sesión de usuario en tiempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkmode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <UserContext.Provider value={{ user, setUser, darkMode, setDarkMode }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };

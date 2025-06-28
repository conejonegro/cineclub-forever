'use client';

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {

  const [user, setUser] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {

    if (typeof window !== 'undefined') {
      return localStorage.getItem("darkmode") === "true";
    }
    return false;
  });

   useEffect(() => {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        setUser(JSON.parse(userDataString));
      } else {
        setUser(null);
      }
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

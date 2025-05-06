"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "./UserProvider";
import Image from "next/image";
// import DarkModeBTN from "./darkModeBTN/DarkModeBTN";

const navItems = [
  { text: "Películas", item_url: "/peliculas" },
];

export default function NavComponent() {
  const { darkMode, user } = useContext(UserContext) || { darkMode: false, user: false };

  return (
    <nav
      className={`w-full ${
        darkMode ? "bg-gray-900" : "bg-white"
      } border-b shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/cineclub-logo.png"
            alt="Cineclub Logo"
            className="h-8 w-auto"
          />
          <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
            Cineclub Forever
          </span>
        </Link>

        {/* Login/Logout */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/profile"
              className="text-sm text-blue-400 hover:underline"
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-blue-400 hover:underline"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="text-sm text-blue-400 hover:underline"
              >
                Registro
              </Link>
            </>
          )}
        </div>
      </div>
      {/* <DarkModeBTN /> */}
    </nav>
  );
}

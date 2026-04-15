"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "./UserProvider";
import Image from "next/image";
// import DarkModeBTN from "./darkModeBTN/DarkModeBTN";

const navItems = [
  { text: "Reviews", item_url: "/reviews" },
  { text: "Películas solicitadas", item_url: "/peliculas-solicitadas" },
];

export default function NavComponent() {
  const { darkMode, user } = useContext(UserContext);

  // user console log
  console.log("User in NavComponent:", user);

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
            width={32}
            height={32}
          />
          <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
            Cineclub Forever
          </span>
        </Link>

        {/* Navegación */}
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.item_url}
              href={item.item_url}
              className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"} hover:underline`}
            >
              {item.text}
            </Link>
          ))}
        </div>

        {/* Login/Logout */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/solicitar-pelicula"
                className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"} hover:underline`}
              >
                Solicitar película
              </Link>
              <Link
                href="/profile"
                className="text-sm text-blue-400 hover:underline"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-blue-400 hover:underline"
              >
                Iniciar Sesión
              </Link>
             {/*<Link
                href="/registro"
                className="text-sm text-blue-400 hover:underline"
              >
                Registro
              </Link> */} 
            </>
          )}
        </div>
      </div>
      {/* <DarkModeBTN /> */}
    </nav>
  );
}

"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "./UserProvider";
import Image from "next/image";

const navItems = [
  { text: "Reviews", item_url: "/reviews" },
  { text: "Películas solicitadas", item_url: "/peliculas-solicitadas" },
];

export default function NavComponent() {
  const { user } = useContext(UserContext);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/cineclub-logo.png"
            alt="Cineclub Logo"
            width={28}
            height={28}
            className="w-7 h-7 object-contain opacity-90"
          />
          <span
            className="text-white/95 text-sm font-bold tracking-wide"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Cineclub Forever
          </span>
        </Link>

        {/* Links centrales */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.item_url}
              href={item.item_url}
              className="text-white/70 hover:text-white text-sm transition-colors duration-200"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {item.text}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              <Link
                href="/solicitar-pelicula"
                className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Solicitar película
              </Link>
              <Link
                href="/profile"
                className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors duration-200"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Mi perfil
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors duration-200"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Iniciar sesión
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

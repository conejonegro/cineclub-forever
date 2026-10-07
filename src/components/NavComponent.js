"use client";

import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserProvider";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCiclos } from "@/lib/ciclos/ciclosData";
import { festivales } from "@/lib/premiadas/festivales";

const navItems = [
  { text: "Ciclos", item_url: "/ciclos" },
  { text: "Reviews", item_url: "/reviews" },
  { text: "Premiadas", item_url: "/premiadas" },
  { text: "Películas solicitadas", item_url: "/peliculas-solicitadas" },
];

// Link con flechita que abre un menú de sub-páginas (ej. Ciclos, Premiadas)
function NavDropdown({ text, href, items, ariaLabel }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const closeDropdown = () => setDropdownOpen(false);

  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-1">
      <Link
        href={href}
        onClick={closeDropdown}
        className="text-white/70 hover:text-white text-sm transition-colors duration-200"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {text}
      </Link>
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-expanded={dropdownOpen}
        className="text-white/70 hover:text-white transition-colors duration-200"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-3 min-w-[180px] bg-[#141414] border border-white/[0.08] rounded-xl py-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeDropdown}
              className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors duration-150"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavComponent() {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ciclos = getCiclos();

  const close = () => setOpen(false);

  // Links del menú que abren un desplegable en desktop
  const dropdowns = {
    "/ciclos": {
      ariaLabel: "Ver ciclos",
      items: ciclos.map((c) => ({ text: c.nombre, href: `/ciclos/${c.slug}` })),
    },
    "/premiadas": {
      ariaLabel: "Ver festivales",
      items: festivales.map((f) => ({ text: f.nombre, href: `/premiadas/${f.slug}` })),
    },
  };

  const allLinks = [
    ...navItems,
    ...(user
      ? [
          { text: "Solicitar película", item_url: "/solicitar-pelicula" },
          { text: "Mi perfil", item_url: "/profile" },
        ]
      : [{ text: "Iniciar sesión", item_url: "/login" }]),
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" onClick={close} className="flex items-center gap-3">
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

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              dropdowns[item.item_url] ? (
                <NavDropdown
                  key={item.item_url}
                  text={item.text}
                  href={item.item_url}
                  items={dropdowns[item.item_url].items}
                  ariaLabel={dropdowns[item.item_url].ariaLabel}
                />
              ) : (
                <Link
                  key={item.item_url}
                  href={item.item_url}
                  className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {item.text}
                </Link>
              )
            )}
          </div>

          {/* Auth desktop */}
          <div className="hidden md:flex items-center gap-5">
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

          {/* Hamburger button (mobile) */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Menú"
          >
            <span
              className={`block h-px w-5 bg-white/70 transition-all duration-200 origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-white/70 transition-all duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-white/70 transition-all duration-200 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>

        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 bg-[#0d0d0d] flex flex-col px-6 pt-8 pb-12 gap-1">
          {allLinks.map((item) => (
            <Link
              key={item.item_url}
              href={item.item_url}
              onClick={close}
              className={`py-4 text-lg font-semibold border-b border-white/[0.06] transition-colors duration-150 ${
                pathname === item.item_url
                  ? "text-amber-400"
                  : "text-white/70 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

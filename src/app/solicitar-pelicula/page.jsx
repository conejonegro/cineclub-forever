"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/components/FirebaseSettings";

export default function SolicitarPeliculaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("invalid_email");
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const existing = await getDocs(
        query(collection(db, "movie_requests"), where("email", "==", email.trim().toLowerCase()))
      );
      if (existing.size >= 5) {
        setStatus("limit_reached");
        setLoading(false);
        return;
      }
      await addDoc(collection(db, "movie_requests"), {
        name,
        email: email.trim().toLowerCase(),
        movie_title: movieTitle,
        created_at: serverTimestamp(),
      });
      setStatus("success");
      setName("");
      setEmail("");
      setMovieTitle("");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">

        {/* Header */}
        <div className="mb-10">
          <p
            className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Comunidad
          </p>
          <h1
            className="text-white text-3xl font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Solicitar película
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Propón una película para la próxima sesión del cineclub.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-md">
          {status === "success" ? (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-8 py-12 flex flex-col items-center gap-4 text-center">
              <span className="text-amber-400 text-3xl">✓</span>
              <p
                className="text-white/90 text-base font-semibold"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Solicitud enviada
              </p>
              <p className="text-white/40 text-sm">
                Tu propuesta fue registrada. La revisaremos para la próxima sesión.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="mt-2 text-amber-400 hover:text-amber-300 text-sm transition-colors duration-200"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.06] transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.06] transition-colors duration-200"
                />
                {status === "invalid_email" && (
                  <p className="text-red-400/80 text-xs mt-0.5">
                    Ingresa un correo electrónico válido.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="movie_title"
                  className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Película que propones
                </label>
                <input
                  id="movie_title"
                  type="text"
                  required
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  placeholder="Título de la película"
                  className="bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.06] transition-colors duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black text-sm font-bold py-3 rounded-full transition-colors duration-200"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
              </button>

              {status === "error" && (
                <p className="text-red-400/80 text-sm text-center">
                  Ocurrió un error. Intenta de nuevo.
                </p>
              )}
              {status === "limit_reached" && (
                <p className="text-amber-400/70 text-sm text-center">
                  Ya alcanzaste el límite de 5 solicitudes con este correo.
                </p>
              )}

            </form>
          )}
        </div>

      </div>
    </main>
  );
}

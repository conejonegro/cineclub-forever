"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/components/FirebaseSettings";

export default function SolicitarPeliculaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error" | null
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
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">Solicitar película</h1>
      <p className="text-gray-500 text-center mb-8">
        Propón una película para la próxima sesión del cineclub.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Tu nombre"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="tu@correo.com"
          />
          {status === "invalid_email" && (
            <p className="text-red-500 text-xs mt-1">Ingresa un correo electrónico válido.</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="movie_title" className="text-sm font-medium text-gray-700">
            Película que propones
          </label>
          <input
            id="movie_title"
            type="text"
            required
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Título de la película"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white text-sm font-medium py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>

        {status === "success" && (
          <p className="text-green-600 text-sm text-center font-medium">
            Tu solicitud fue enviada.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-sm text-center font-medium">
            Ocurrió un error. Intenta de nuevo.
          </p>
        )}
        {status === "limit_reached" && (
          <p className="text-orange-500 text-sm text-center font-medium">
            Ya alcanzaste el límite de 5 solicitudes con este correo.
          </p>
        )}
      </form>
    </main>
  );
}

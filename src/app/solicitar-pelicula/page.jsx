"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/components/FirebaseSettings";
import { UserContext } from "@/components/UserProvider";

export default function SolicitarPeliculaPage() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim() || selectedMovie) {
      setSearchResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/yts-search?q=${encodeURIComponent(searchQuery.trim())}`
        );
        const data = await res.json();
        setSearchResults(data?.movies ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, selectedMovie]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedMovie) {
      setStatus("no_movie");
      return;
    }
    const email = user?.email?.trim().toLowerCase();
    setLoading(true);
    setStatus(null);
    try {
      const existing = await getDocs(
        query(collection(db, "movie_requests"), where("email", "==", email))
      );
      if (existing.size >= 5) {
        setStatus("limit_reached");
        setLoading(false);
        return;
      }
      await addDoc(collection(db, "movie_requests"), {
        name,
        email,
        movie_title: selectedMovie.title,
        yts_id: selectedMovie.id ?? null,
        yts_cover: selectedMovie.medium_cover_image ?? null,
        created_at: serverTimestamp(),
      });
      setStatus("success");
      setName("");
      setSelectedMovie(null);
      setSearchQuery("");
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
          <p className="text-amber-400/60 text-xs mt-1.5">
            Usa el nombre original, ej. <span className="italic">The Matrix</span> en lugar de <span className="italic">La Matriz</span>.
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

              {/* Movie search */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Película que propones
                </label>

                {selectedMovie ? (
                  /* Selected movie card */
                  <div className={`bg-white/[0.04] border rounded-md px-3 py-3 flex flex-col gap-2.5 ${selectedMovie.yts_available === false ? "border-orange-400/30" : "border-amber-400/30"}`}>
                    <div className="flex items-start gap-3">
                      {selectedMovie.medium_cover_image && (
                        <img
                          src={selectedMovie.medium_cover_image}
                          alt={selectedMovie.title}
                          className="w-10 h-14 object-cover rounded-sm flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-white/90 text-sm font-semibold leading-snug"
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {selectedMovie.title}
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">{selectedMovie.year}</p>

                        {/* YTS badge */}
                        {selectedMovie.yts_available === false ? (
                          <div className="mt-2">
                            <p className="text-white/30 text-[10px] leading-relaxed">
                              No está en nuestra base de datos, pero la buscaremos.
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/80 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                              Disponible en YTS
                            </span>
                            {selectedMovie.torrents?.map((t, i) => (
                              <span
                                key={`${t.quality}-${i}`}
                                className="text-[9px] font-mono text-white/30 bg-white/[0.05] px-1.5 py-0.5 rounded"
                              >
                                {t.quality}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMovie(null);
                          setSearchQuery("");
                        }}
                        className="text-white/30 hover:text-white/60 text-xs flex-shrink-0 transition-colors duration-200"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Search input + results */
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Busca por título..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.06] transition-colors duration-200"
                    />

                    {/* Searching indicator */}
                    {searching && (
                      <p className="text-white/30 text-xs mt-2">Buscando...</p>
                    )}

                    {/* Results */}
                    {!searching && searchResults.length > 0 && (
                      <ul className="mt-2 flex flex-col gap-1">
                        {searchResults.map((movie) => (
                          <li key={movie.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMovie(movie);
                                setSearchResults([]);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-amber-400/20 transition-colors duration-150 text-left"
                            >
                              {movie.medium_cover_image && (
                                <img
                                  src={movie.medium_cover_image}
                                  alt={movie.title}
                                  className="w-7 h-10 object-cover rounded-sm flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-white/80 text-xs font-semibold truncate"
                                  style={{ fontFamily: "var(--font-montserrat)" }}
                                >
                                  {movie.title}
                                </p>
                                <p className="text-white/30 text-[10px]">{movie.year}</p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* No YTS results — fallback option */}
                    {!searching && searchQuery.trim().length > 1 && searchResults.length === 0 && (
                      <div className="mt-2 flex flex-col gap-1.5">
                        <p className="text-red-400/70 text-xs">No se encontró en YTS.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMovie({ title: searchQuery.trim(), year: null, medium_cover_image: null, torrents: null, yts_available: false });
                            setSearchResults([]);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-orange-400/20 transition-colors duration-150 text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-white/70 text-xs font-semibold truncate"
                              style={{ fontFamily: "var(--font-montserrat)" }}
                            >
                              {searchQuery.trim()}
                            </p>
                            <p className="text-orange-400/60 text-[10px] mt-0.5">Solicitar de todas formas</p>
                          </div>
                          <span className="text-white/20 text-xs">→</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {status === "no_movie" && (
                  <p className="text-red-400/80 text-xs mt-0.5">
                    Selecciona una película de los resultados.
                  </p>
                )}
              </div>

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
